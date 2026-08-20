const axios = require("axios");

const ClinicSearch = require(
  "../models/ClinicSearch"
);

const User = require("../models/User");

/* =====================================================
   GOOGLE PLACES ENDPOINTS
===================================================== */

const GOOGLE_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GOOGLE_NEARBY_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

/*
 * Google only returns the fields listed here.
 * Avoid adding unnecessary fields because Places API
 * billing may depend on the requested data fields.
 */
const GOOGLE_PLACE_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.currentOpeningHours",
  "places.businessStatus",
].join(",");

/* =====================================================
   HELPERS
===================================================== */

const getUserId = (req) =>
  req.user?._id || req.user?.id;

const toRadians = (degrees) =>
  (degrees * Math.PI) / 180;

/*
 * Calculates straight-line distance between
 * the patient's position and a clinic.
 */
const calculateDistanceKm = (
  firstLatitude,
  firstLongitude,
  secondLatitude,
  secondLongitude
) => {
  if (
    !Number.isFinite(firstLatitude) ||
    !Number.isFinite(firstLongitude) ||
    !Number.isFinite(secondLatitude) ||
    !Number.isFinite(secondLongitude)
  ) {
    return null;
  }

  const earthRadiusKm = 6371;

  const latitudeDifference =
    toRadians(
      secondLatitude -
        firstLatitude
    );

  const longitudeDifference =
    toRadians(
      secondLongitude -
        firstLongitude
    );

  const value =
    Math.sin(
      latitudeDifference / 2
    ) ** 2 +
    Math.cos(
      toRadians(firstLatitude)
    ) *
      Math.cos(
        toRadians(secondLatitude)
      ) *
      Math.sin(
        longitudeDifference / 2
      ) ** 2;

  const distance =
    earthRadiusKm *
    2 *
    Math.atan2(
      Math.sqrt(value),
      Math.sqrt(1 - value)
    );

  return Number(
    distance.toFixed(2)
  );
};

const buildGoogleMapsUrl = (
  placeId,
  latitude,
  longitude
) => {
  if (placeId) {
    return (
      "https://www.google.com/maps/search/?api=1" +
      `&query=${latitude},${longitude}` +
      `&query_place_id=${encodeURIComponent(
        placeId
      )}`
    );
  }

  return (
    "https://www.google.com/maps/search/?api=1" +
    `&query=${latitude},${longitude}`
  );
};

/*
 * Convert Google Place response into the structure
 * used by OralVista and MongoDB.
 */
const normalizeClinic = (
  place,
  patientLatitude = null,
  patientLongitude = null
) => {
  const latitude = Number(
    place.location?.latitude
  );

  const longitude = Number(
    place.location?.longitude
  );

  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const openNow =
    place.currentOpeningHours
      ?.openNow;

  return {
    placeId:
      String(place.id || "").trim(),

    name:
      place.displayName?.text ||
      "Unnamed dental clinic",

    address:
      place.formattedAddress || "",

    phone:
      place.nationalPhoneNumber ||
      "",

    website:
      place.websiteUri || "",

    rating:
      Number.isFinite(
        Number(place.rating)
      )
        ? Number(place.rating)
        : null,

    reviewCount:
      Number(
        place.userRatingCount
      ) || 0,

    businessStatus:
      place.businessStatus || "",

    isOpen:
      typeof openNow === "boolean"
        ? openNow
        : null,

    latitude:
      hasValidCoordinates
        ? latitude
        : null,

    longitude:
      hasValidCoordinates
        ? longitude
        : null,

    distanceKm:
      hasValidCoordinates
        ? calculateDistanceKm(
            patientLatitude,
            patientLongitude,
            latitude,
            longitude
          )
        : null,

    googleMapsUrl:
      place.googleMapsUri ||
      (hasValidCoordinates
        ? buildGoogleMapsUrl(
            place.id,
            latitude,
            longitude
          )
        : ""),
  };
};

/* =====================================================
   GOOGLE PLACES REQUEST
===================================================== */

const requestGooglePlaces = async (
  url,
  body
) => {
  const apiKey =
    process.env
      .GOOGLE_PLACES_SERVER_KEY;

  if (!apiKey) {
    const configurationError =
      new Error(
        "Google Places API key is not configured in backend/.env."
      );

    configurationError.statusCode =
      500;

    throw configurationError;
  }

  try {
    const response =
      await axios.post(
        url,
        body,
        {
          headers: {
            "Content-Type":
              "application/json",

            "X-Goog-Api-Key":
              apiKey,

            "X-Goog-FieldMask":
              GOOGLE_PLACE_FIELD_MASK,
          },

          timeout: 20000,
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "Google Places API request failed:",
      error.response?.data ||
        error.message
    );

    const placesError =
      new Error(
        error.response?.data?.error
          ?.message ||
          "Google Places could not complete the clinic search."
      );

    const googleStatus =
      error.response?.status;

    if (
      googleStatus === 400
    ) {
      placesError.statusCode = 400;
    } else if (
      googleStatus === 401 ||
      googleStatus === 403
    ) {
      placesError.statusCode = 503;

      placesError.message =
        "The Google Places API key is invalid, restricted incorrectly, or billing is unavailable.";
    } else if (
      googleStatus === 429
    ) {
      placesError.statusCode = 429;

      placesError.message =
        "Google Places search quota has been reached. Please try again later.";
    } else {
      placesError.statusCode = 502;
    }

    throw placesError;
  }
};

/* =====================================================
   PATIENT: SEARCH CLINICS
   POST /api/clinics/search
===================================================== */

exports.searchClinics = async (
  req,
  res
) => {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    /*
     * Read the user directly from MongoDB so the saved
     * patient details are always correct.
     */
    const patient =
      await User.findById(
        userId
      ).select(
        "fullName email role isActive"
      );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message:
          "Patient account was not found.",
      });
    }

    if (
      patient.role !== "patient"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only patient accounts can perform clinic searches.",
      });
    }

    if (
      patient.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This patient account has been disabled.",
      });
    }

    const location = String(
      req.body?.location || ""
    ).trim();

    const latitude =
      req.body?.latitude ===
        undefined ||
      req.body?.latitude === null
        ? null
        : Number(
            req.body.latitude
          );

    const longitude =
      req.body?.longitude ===
        undefined ||
      req.body?.longitude === null
        ? null
        : Number(
            req.body.longitude
          );

    const requestedRadius =
      Number(
        req.body?.radiusMeters
      ) || 10000;

    /*
     * Google Nearby Search supports a circular radius.
     * OralVista limits it to between 500m and 50km.
     */
    const radiusMeters =
      Math.min(
        Math.max(
          requestedRadius,
          500
        ),
        50000
      );

    const hasCoordinates =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    if (
      !hasCoordinates &&
      location.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a city, town, district or address.",
      });
    }

    let googleData;
    let searchMode;
    let searchedLocation;

    /*
     * Current location search.
     */
    if (hasCoordinates) {
      searchMode =
        "current-location";

      searchedLocation =
        location ||
        "Current location";

      googleData =
        await requestGooglePlaces(
          GOOGLE_NEARBY_SEARCH_URL,
          {
            includedTypes: [
              "dentist",
            ],

            maxResultCount: 20,

            rankPreference:
              "DISTANCE",

            languageCode: "en",

            regionCode: "LK",

            locationRestriction: {
              circle: {
                center: {
                  latitude,
                  longitude,
                },

                radius:
                  radiusMeters,
              },
            },
          }
        );
    } else {
      /*
       * Place-name search.
       *
       * Example:
       * dental clinics near Jaffna, Sri Lanka
       */
      searchMode = "text";

      searchedLocation =
        location;

      googleData =
        await requestGooglePlaces(
          GOOGLE_TEXT_SEARCH_URL,
          {
            textQuery:
              `dental clinics near ${location}, Sri Lanka`,

            includedType:
              "dentist",

            pageSize: 20,

            languageCode: "en",

            regionCode: "LK",
          }
        );
    }

    let clinics = Array.isArray(
      googleData.places
    )
      ? googleData.places
          .filter(
            (place) =>
              place?.id &&
              place
                ?.displayName
                ?.text
          )
          .map((place) =>
            normalizeClinic(
              place,
              latitude,
              longitude
            )
          )
      : [];

    /*
     * Remove accidental duplicate Google Place IDs.
     */
    const clinicMap =
      new Map();

    clinics.forEach(
      (clinic) => {
        if (
          !clinicMap.has(
            clinic.placeId
          )
        ) {
          clinicMap.set(
            clinic.placeId,
            clinic
          );
        }
      }
    );

    clinics = Array.from(
      clinicMap.values()
    );

    /*
     * Current-location results are ordered by distance.
     */
    if (hasCoordinates) {
      clinics.sort(
        (
          firstClinic,
          secondClinic
        ) =>
          (firstClinic.distanceKm ??
            Number.MAX_VALUE) -
          (secondClinic.distanceKm ??
            Number.MAX_VALUE)
      );
    }

    /*
     * Save the search and every returned clinic
     * inside MongoDB.
     */
    const searchRecord =
      await ClinicSearch.create({
        user: patient._id,

        patientName:
          patient.fullName,

        patientEmail:
          patient.email,

        searchMode,

        searchedLocation,

        searchLatitude:
          hasCoordinates
            ? latitude
            : null,

        searchLongitude:
          hasCoordinates
            ? longitude
            : null,

        radiusMeters,

        clinicsFound:
          clinics.length,

        clinics,

        searchedAt:
          new Date(),
      });

    return res.status(201).json({
      success: true,

      message:
        clinics.length > 0
          ? `${clinics.length} dental clinics found near ${searchedLocation}.`
          : `No dental clinics were found near ${searchedLocation}.`,

      searchId:
        searchRecord._id,

      search: {
        searchedLocation,
        searchMode,

        latitude:
          hasCoordinates
            ? latitude
            : null,

        longitude:
          hasCoordinates
            ? longitude
            : null,

        radiusMeters,
      },

      clinics,
    });
  } catch (error) {
    console.error(
      "Clinic search error:",
      error
    );

    return res
      .status(
        error.statusCode ||
          500
      )
      .json({
        success: false,

        message:
          error.message ||
          "Unable to search for dental clinics.",
      });
  }
};

/* =====================================================
   PATIENT: GET PERSONAL SEARCH HISTORY
   GET /api/clinics/my-history
===================================================== */

exports.getMyClinicSearchHistory =
  async (req, res) => {
    try {
      const userId =
        getUserId(req);

      const history =
        await ClinicSearch.find({
          user: userId,
        })
          .sort({
            searchedAt: -1,
          })
          .limit(20)
          .lean();

      return res.status(200).json({
        success: true,
        count: history.length,
        history,
      });
    } catch (error) {
      console.error(
        "Patient clinic history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load clinic-search history.",
      });
    }
  };

/* =====================================================
   ADMIN: GET ALL PATIENT SEARCHES
   GET /api/clinics/admin/searches
===================================================== */

exports.getAdminClinicSearches =
  async (req, res) => {
    try {
      if (
        req.user?.role !==
        "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Administrator access is required.",
        });
      }

      const page = Math.max(
        Number(
          req.query.page
        ) || 1,
        1
      );

      const limit = Math.min(
        Math.max(
          Number(
            req.query.limit
          ) || 10,
          1
        ),
        50
      );

      const searchText =
        String(
          req.query.search ||
            ""
        ).trim();

      const query = searchText
        ? {
            $or: [
              {
                patientName: {
                  $regex:
                    searchText,
                  $options: "i",
                },
              },

              {
                patientEmail: {
                  $regex:
                    searchText,
                  $options: "i",
                },
              },

              {
                searchedLocation: {
                  $regex:
                    searchText,
                  $options: "i",
                },
              },

              {
                "clinics.name": {
                  $regex:
                    searchText,
                  $options: "i",
                },
              },
            ],
          }
        : {};

      const [
        records,
        totalRecords,
      ] = await Promise.all([
        ClinicSearch.find(query)
          .sort({
            searchedAt: -1,
          })
          .skip(
            (page - 1) *
              limit
          )
          .limit(limit)
          .lean(),

        ClinicSearch.countDocuments(
          query
        ),
      ]);

      const statisticsResult =
        await ClinicSearch.aggregate([
          {
            $group: {
              _id: null,

              totalSearches: {
                $sum: 1,
              },

              totalClinicsReturned: {
                $sum:
                  "$clinicsFound",
              },

              patients: {
                $addToSet:
                  "$user",
              },
            },
          },

          {
            $project: {
              _id: 0,

              totalSearches: 1,

              totalClinicsReturned:
                1,

              uniquePatients: {
                $size:
                  "$patients",
              },
            },
          },
        ]);

      const statistics =
        statisticsResult[0] || {
          totalSearches: 0,
          totalClinicsReturned: 0,
          uniquePatients: 0,
        };

      return res.status(200).json({
        success: true,

        statistics,

        pagination: {
          page,
          limit,
          total:
            totalRecords,

          totalPages:
            Math.max(
              Math.ceil(
                totalRecords /
                  limit
              ),
              1
            ),
        },

        records,
      });
    } catch (error) {
      console.error(
        "Admin clinic search history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load patient clinic-search records.",
      });
    }
  };

/* =====================================================
   ADMIN: GET ONE SEARCH WITH ALL CLINICS
   GET /api/clinics/admin/searches/:id
===================================================== */

exports.getAdminClinicSearchById =
  async (req, res) => {
    try {
      if (
        req.user?.role !==
        "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Administrator access is required.",
        });
      }

      const record =
        await ClinicSearch.findById(
          req.params.id
        ).lean();

      if (!record) {
        return res.status(404).json({
          success: false,
          message:
            "Clinic-search record was not found.",
        });
      }

      return res.status(200).json({
        success: true,
        record,
      });
    } catch (error) {
      console.error(
        "Admin clinic search detail error:",
        error
      );

      if (
        error.name ===
        "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The clinic-search record ID is invalid.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to load the clinic-search details.",
      });
    }
  };