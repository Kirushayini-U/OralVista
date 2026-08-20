import React, {
  useMemo,
  useState,
} from "react";

import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Filter,
  Globe,
  LoaderCircle,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";

import {
  searchClinics,
} from "../../services/clinicService.js";

/* =====================================================
   GOOGLE MAP CONFIGURATION
===================================================== */

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "490px",
};

const defaultMapCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

const defaultMapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
};

/* =====================================================
   SEARCH FILTER DATA
===================================================== */

const districts = [
  "All Districts",
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const distanceOptions = [
  {
    label: "Any Distance",
    radiusMeters: 10000,
  },
  {
    label: "Within 2 km",
    radiusMeters: 2000,
  },
  {
    label: "Within 5 km",
    radiusMeters: 5000,
  },
  {
    label: "Within 10 km",
    radiusMeters: 10000,
  },
  {
    label: "Within 25 km",
    radiusMeters: 25000,
  },
];

/* =====================================================
   HELPERS
===================================================== */

const isValidCoordinate = (
  latitude,
  longitude
) =>
  Number.isFinite(Number(latitude)) &&
  Number.isFinite(Number(longitude));

const formatRating = (rating) => {
  if (
    rating === null ||
    rating === undefined
  ) {
    return "Not rated";
  }

  return Number(rating).toFixed(1);
};

const getOpeningLabel = (isOpen) => {
  if (isOpen === true) {
    return "Open now";
  }

  if (isOpen === false) {
    return "Closed now";
  }

  return "Hours unavailable";
};

export default function ClinicFinder() {
  const [location, setLocation] =
    useState("");

  const [district, setDistrict] =
    useState("All Districts");

  const [distance, setDistance] =
    useState("Any Distance");

  const [clinics, setClinics] =
    useState([]);

  const [selectedClinic, setSelectedClinic] =
    useState(null);

  const [searchSubmitted, setSearchSubmitted] =
    useState(false);

  const [searchedLocation, setSearchedLocation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [locating, setLocating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =====================================================
     LOAD GOOGLE MAP
  ===================================================== */

  const browserKey =
    import.meta.env
      .VITE_GOOGLE_MAPS_BROWSER_KEY;

  const {
    isLoaded,
    loadError,
  } = useJsApiLoader({
    id: "oralvista-google-map",
    googleMapsApiKey:
      browserKey || "",
  });

  /* =====================================================
     DERIVED VALUES
  ===================================================== */

  const selectedDistance =
    useMemo(() => {
      return (
        distanceOptions.find(
          (option) =>
            option.label === distance
        ) || distanceOptions[0]
      );
    }, [distance]);

  const clinicsWithCoordinates =
    useMemo(() => {
      return clinics.filter((clinic) =>
        isValidCoordinate(
          clinic.latitude,
          clinic.longitude
        )
      );
    }, [clinics]);

  const mapCenter =
    useMemo(() => {
      if (
        selectedClinic &&
        isValidCoordinate(
          selectedClinic.latitude,
          selectedClinic.longitude
        )
      ) {
        return {
          lat: Number(
            selectedClinic.latitude
          ),
          lng: Number(
            selectedClinic.longitude
          ),
        };
      }

      if (
        clinicsWithCoordinates.length > 0
      ) {
        return {
          lat: Number(
            clinicsWithCoordinates[0]
              .latitude
          ),
          lng: Number(
            clinicsWithCoordinates[0]
              .longitude
          ),
        };
      }

      return defaultMapCenter;
    }, [
      selectedClinic,
      clinicsWithCoordinates,
    ]);

  const selectedLocationLabel =
    searchedLocation ||
    location ||
    (district !== "All Districts"
      ? district
      : "Not selected");

  /* =====================================================
     SEARCH BY ENTERED LOCATION
  ===================================================== */

  const handleSearch = async (event) => {
    event.preventDefault();

    const enteredLocation =
      location.trim();

    const queryLocation =
      enteredLocation ||
      (district !== "All Districts"
        ? district
        : "");

    if (!queryLocation) {
      setError(
        "Please enter a city, town, district or address."
      );

      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setSearchSubmitted(true);
      setSelectedClinic(null);

      const result =
        await searchClinics({
          location: queryLocation,
          radiusMeters:
            selectedDistance.radiusMeters,
        });

      const returnedClinics =
        Array.isArray(result?.clinics)
          ? result.clinics
          : [];

      setClinics(returnedClinics);

      setSearchedLocation(
        result?.search
          ?.searchedLocation ||
          queryLocation
      );

      setSelectedClinic(
        returnedClinics[0] || null
      );

      setSuccessMessage(
        result?.message ||
          `${returnedClinics.length} clinics found.`
      );
    } catch (requestError) {
      console.error(
        "Clinic search error:",
        requestError
      );

      setClinics([]);
      setSelectedClinic(null);
      setSuccessMessage("");

      setError(
        requestError.response?.data
          ?.message ||
          "Unable to search for dental clinics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SEARCH USING CURRENT LOCATION
  ===================================================== */

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location access is not supported by this browser."
      );

      return;
    }

    setLocating(true);
    setError("");
    setSuccessMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        try {
          setLoading(true);
          setSearchSubmitted(true);
          setLocation(
            "Current location"
          );
          setSelectedClinic(null);

          const result =
            await searchClinics({
              location:
                district !==
                "All Districts"
                  ? district
                  : "Current location",

              latitude,
              longitude,

              radiusMeters:
                selectedDistance
                  .radiusMeters,
            });

          const returnedClinics =
            Array.isArray(
              result?.clinics
            )
              ? result.clinics
              : [];

          setClinics(
            returnedClinics
          );

          setSearchedLocation(
            result?.search
              ?.searchedLocation ||
              "Current location"
          );

          setSelectedClinic(
            returnedClinics[0] ||
              null
          );

          setSuccessMessage(
            result?.message ||
              `${returnedClinics.length} clinics found near your location.`
          );
        } catch (requestError) {
          console.error(
            "Current-location clinic search error:",
            requestError
          );

          setClinics([]);
          setSelectedClinic(null);

          setError(
            requestError.response
              ?.data?.message ||
              "Unable to search near your current location."
          );
        } finally {
          setLoading(false);
          setLocating(false);
        }
      },

      (geolocationError) => {
        console.error(
          "Geolocation error:",
          geolocationError
        );

        let message =
          "Unable to access your current location.";

        if (
          geolocationError.code ===
          geolocationError
            .PERMISSION_DENIED
        ) {
          message =
            "Location permission was denied. Please allow location access or enter your area manually.";
        }

        if (
          geolocationError.code ===
          geolocationError
            .POSITION_UNAVAILABLE
        ) {
          message =
            "Your current location is unavailable. Please enter an area manually.";
        }

        if (
          geolocationError.code ===
          geolocationError.TIMEOUT
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setError(message);
        setLocating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLocation("");
    setDistrict("All Districts");
    setDistance("Any Distance");
    setClinics([]);
    setSelectedClinic(null);
    setSearchSubmitted(false);
    setSearchedLocation("");
    setError("");
    setSuccessMessage("");
  };

  /* =====================================================
     SELECT CLINIC
  ===================================================== */

  const handleSelectClinic = (
    clinic
  ) => {
    setSelectedClinic(clinic);
  };

  return (
    <PatientLayout
      title="Clinic Finder"
      breadcrumb="Dashboard › Clinic Finder"
    >
      <div className="clinic-finder-page">
        <div className="clinic-finder-page-overlay" />

        <div className="clinic-finder-content">
          {/* Introduction banner */}
          <section className="clinic-finder-hero">
            <div className="clinic-finder-hero-overlay" />

            <div className="clinic-finder-hero-copy">
              <span className="clinic-finder-hero-badge">
                <Sparkles size={15} />
                OralVista clinic discovery
              </span>

              <h2>
                Find dental care near you
              </h2>

              <p>
                Search for nearby dental clinics
                by city, district or your current
                location. View clinic information
                and directions using Google Maps.
              </p>

              <div className="clinic-finder-hero-tags">
                <span>
                  <MapPin size={15} />
                  Location-based search
                </span>

                <span>
                  <Building2 size={15} />
                  Real dental clinics
                </span>

                <span>
                  <Navigation size={15} />
                  Google Maps directions
                </span>
              </div>
            </div>

            <div className="clinic-finder-hero-status">
              <div className="clinic-finder-hero-icon">
                <Map size={28} />
              </div>

              <div>
                <small>
                  Map service
                </small>

                <strong>
                  Google Maps connected
                </strong>

                <span>
                  Clinic search is available
                </span>
              </div>
            </div>
          </section>

          {/* Notifications */}
          {error && (
            <div className="clinic-finder-alert clinic-finder-alert-error">
              <AlertCircle size={19} />

              <span>{error}</span>
            </div>
          )}

          {successMessage &&
            !error && (
              <div className="clinic-finder-alert clinic-finder-alert-success">
                <CheckCircle2
                  size={19}
                />

                <span>
                  {successMessage}
                </span>
              </div>
            )}

          {/* Main two-column area */}
          <section className="clinic-finder-workspace">
            {/* Search and results */}
            <div className="clinic-finder-search-panel">
              <div className="clinic-finder-panel-heading">
                <div>
                  <span>
                    Search dental clinics
                  </span>

                  <h3>
                    Choose your preferred
                    area
                  </h3>

                  <p>
                    Enter a location or use
                    your current position.
                  </p>
                </div>

                <div className="clinic-finder-heading-icon">
                  <Compass size={23} />
                </div>
              </div>

              <form
                className="clinic-finder-form"
                onSubmit={handleSearch}
              >
                <label className="clinic-finder-location-field">
                  <MapPin size={20} />

                  <input
                    type="text"
                    value={location}
                    placeholder="Enter city, town or address"
                    disabled={
                      loading ||
                      locating
                    }
                    onChange={(event) => {
                      setLocation(
                        event.target
                          .value
                      );

                      setSearchSubmitted(
                        false
                      );

                      setError("");
                      setSuccessMessage(
                        ""
                      );
                    }}
                  />

                  <button
                    type="button"
                    onClick={
                      handleUseCurrentLocation
                    }
                    disabled={
                      loading ||
                      locating
                    }
                    title="Use current location"
                    aria-label="Use current location"
                  >
                    {locating ? (
                      <LoaderCircle
                        size={18}
                        className="clinic-finder-spin"
                      />
                    ) : (
                      <LocateFixed
                        size={18}
                      />
                    )}
                  </button>
                </label>

                <div className="clinic-finder-filter-grid">
                  <label>
                    <span>
                      <Filter size={14} />
                      District
                    </span>

                    <select
                      value={district}
                      disabled={loading}
                      onChange={(event) => {
                        const newDistrict =
                          event.target
                            .value;

                        setDistrict(
                          newDistrict
                        );

                        if (
                          !location.trim() &&
                          newDistrict !==
                            "All Districts"
                        ) {
                          setLocation(
                            newDistrict
                          );
                        }

                        setSearchSubmitted(
                          false
                        );

                        setError("");
                        setSuccessMessage(
                          ""
                        );
                      }}
                    >
                      {districts.map(
                        (
                          districtName
                        ) => (
                          <option
                            key={
                              districtName
                            }
                            value={
                              districtName
                            }
                          >
                            {
                              districtName
                            }
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label>
                    <span>
                      <Navigation
                        size={14}
                      />
                      Distance
                    </span>

                    <select
                      value={distance}
                      disabled={loading}
                      onChange={(event) => {
                        setDistance(
                          event.target
                            .value
                        );

                        setSearchSubmitted(
                          false
                        );

                        setError("");
                        setSuccessMessage(
                          ""
                        );
                      }}
                    >
                      {distanceOptions.map(
                        (option) => (
                          <option
                            key={
                              option.label
                            }
                            value={
                              option.label
                            }
                          >
                            {
                              option.label
                            }
                          </option>
                        )
                      )}
                    </select>
                  </label>
                </div>

                <div className="clinic-finder-form-actions">
                  <button
                    type="button"
                    className="clinic-finder-reset-button"
                    onClick={handleReset}
                    disabled={
                      loading ||
                      locating
                    }
                  >
                    <SlidersHorizontal
                      size={17}
                    />
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="clinic-finder-search-button"
                    disabled={
                      loading ||
                      locating
                    }
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="clinic-finder-spin"
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search
                          size={18}
                        />
                        Search Clinics
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="clinic-finder-result-heading">
                <div>
                  <span>
                    Search results
                  </span>

                  <strong>
                    {clinics.length}
                  </strong>
                </div>

                <small>
                  {distance}
                </small>
              </div>

              {loading ? (
                <div className="clinic-finder-empty-state">
                  <div className="clinic-finder-empty-icon">
                    <LoaderCircle
                      size={39}
                      className="clinic-finder-spin"
                    />
                  </div>

                  <h4>
                    Searching for clinics
                  </h4>

                  <p>
                    OralVista is finding
                    nearby dental clinics.
                    Please wait.
                  </p>
                </div>
              ) : clinics.length ===
                0 ? (
                <div className="clinic-finder-empty-state">
                  <div className="clinic-finder-empty-icon">
                    <Building2
                      size={39}
                    />
                  </div>

                  <h4>
                    {searchSubmitted
                      ? "No dental clinics found"
                      : "Search for nearby clinics"}
                  </h4>

                  <p>
                    {searchSubmitted
                      ? "No matching clinic results were returned. Try another town, district or a wider distance."
                      : "Enter your location and select your preferred filters to search for dental clinics."}
                  </p>

                  <div className="clinic-finder-development-note">
                    <Clock3 size={16} />

                    <span>
                      Search results are
                      provided through
                      Google Places.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="clinic-finder-card-list">
                  {clinics.map(
                    (clinic) => {
                      const isSelected =
                        selectedClinic
                          ?.placeId ===
                        clinic.placeId;

                      return (
                        <article
                          key={
                            clinic.placeId
                          }
                          className={`clinic-finder-card ${
                            isSelected
                              ? "clinic-finder-card-selected"
                              : ""
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            handleSelectClinic(
                              clinic
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              handleSelectClinic(
                                clinic
                              );
                            }
                          }}
                        >
                          <div className="clinic-finder-card-icon">
                            <Building2
                              size={22}
                            />
                          </div>

                          <div className="clinic-finder-card-content">
                            <div className="clinic-finder-card-title">
                              <h4>
                                {
                                  clinic.name
                                }
                              </h4>

                              <span>
                                <CheckCircle2
                                  size={12}
                                />

                                {getOpeningLabel(
                                  clinic.isOpen
                                )}
                              </span>
                            </div>

                            <p>
                              <MapPin
                                size={14}
                              />
                              {clinic.address ||
                                "Address unavailable"}
                            </p>

                            {clinic.phone && (
                              <p>
                                <Phone
                                  size={14}
                                />
                                {
                                  clinic.phone
                                }
                              </p>
                            )}

                            <p>
                              <Star
                                size={14}
                              />
                              {formatRating(
                                clinic.rating
                              )}

                              {clinic.reviewCount >
                                0 &&
                                ` (${clinic.reviewCount} reviews)`}
                            </p>

                            {clinic.distanceKm !==
                              null &&
                              clinic.distanceKm !==
                                undefined && (
                                <p>
                                  <Navigation
                                    size={14}
                                  />
                                  {
                                    clinic.distanceKm
                                  }{" "}
                                  km away
                                </p>
                              )}

                            <div className="clinic-finder-card-links">
                              {clinic.googleMapsUrl && (
                                <a
                                  href={
                                    clinic.googleMapsUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(
                                    event
                                  ) =>
                                    event.stopPropagation()
                                  }
                                >
                                  <ExternalLink
                                    size={14}
                                  />
                                  Directions
                                </a>
                              )}

                              {clinic.website && (
                                <a
                                  href={
                                    clinic.website
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(
                                    event
                                  ) =>
                                    event.stopPropagation()
                                  }
                                >
                                  <Globe
                                    size={14}
                                  />
                                  Website
                                </a>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label={`View ${clinic.name} on map`}
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              handleSelectClinic(
                                clinic
                              );
                            }}
                          >
                            <ChevronRight
                              size={19}
                            />
                          </button>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Google Map */}
            <div className="clinic-finder-map-panel">
              <div className="clinic-finder-panel-heading">
                <div>
                  <span>
                    Interactive map
                  </span>

                  <h3>
                    Clinic locations
                  </h3>

                  <p>
                    Select a result to focus
                    on its map marker.
                  </p>
                </div>

                <div className="clinic-finder-heading-icon clinic-finder-map-heading-icon">
                  <MapPin size={23} />
                </div>
              </div>

              <div className="clinic-finder-map-placeholder clinic-finder-google-map-container">
                {!browserKey ? (
                  <div className="clinic-map-message">
                    <div>
                      <AlertCircle
                        size={30}
                      />
                    </div>

                    <h4>
                      Google Maps key is
                      missing
                    </h4>

                    <p>
                      Add
                      VITE_GOOGLE_MAPS_BROWSER_KEY
                      to frontend/.env and
                      restart the frontend.
                    </p>
                  </div>
                ) : loadError ? (
                  <div className="clinic-map-message">
                    <div>
                      <AlertCircle
                        size={30}
                      />
                    </div>

                    <h4>
                      Map could not load
                    </h4>

                    <p>
                      Check the browser API
                      key, website restriction
                      and Maps JavaScript API.
                    </p>
                  </div>
                ) : !isLoaded ? (
                  <div className="clinic-map-message">
                    <div>
                      <LoaderCircle
                        size={30}
                        className="clinic-finder-spin"
                      />
                    </div>

                    <h4>
                      Loading Google Map
                    </h4>

                    <p>
                      Please wait while the
                      interactive map loads.
                    </p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={
                      mapContainerStyle
                    }
                    center={mapCenter}
                    zoom={
                      clinicsWithCoordinates
                        .length > 0
                        ? 13
                        : 7
                    }
                    options={
                      defaultMapOptions
                    }
                  >
                    {clinicsWithCoordinates.map(
                      (clinic) => (
                        <MarkerF
                          key={
                            clinic.placeId
                          }
                          position={{
                            lat: Number(
                              clinic.latitude
                            ),
                            lng: Number(
                              clinic.longitude
                            ),
                          }}
                          title={
                            clinic.name
                          }
                          onClick={() =>
                            handleSelectClinic(
                              clinic
                            )
                          }
                        />
                      )
                    )}

                    {selectedClinic &&
                      isValidCoordinate(
                        selectedClinic.latitude,
                        selectedClinic.longitude
                      ) && (
                        <InfoWindowF
                          position={{
                            lat: Number(
                              selectedClinic.latitude
                            ),
                            lng: Number(
                              selectedClinic.longitude
                            ),
                          }}
                          onCloseClick={() =>
                            setSelectedClinic(
                              null
                            )
                          }
                        >
                          <div className="clinic-map-info-window">
                            <strong>
                              {
                                selectedClinic.name
                              }
                            </strong>

                            <p>
                              {selectedClinic.address ||
                                "Address unavailable"}
                            </p>

                            <span>
                              Rating:{" "}
                              {formatRating(
                                selectedClinic.rating
                              )}
                            </span>

                            {selectedClinic.googleMapsUrl && (
                              <a
                                href={
                                  selectedClinic.googleMapsUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open directions
                              </a>
                            )}
                          </div>
                        </InfoWindowF>
                      )}
                  </GoogleMap>
                )}
              </div>

              <div className="clinic-finder-map-footer">
                <div>
                  <span className="clinic-finder-status-dot" />

                  <p>
                    Map service
                  </p>

                  <strong>
                    {isLoaded
                      ? "Connected"
                      : "Loading"}
                  </strong>
                </div>

                <div>
                  <MapPin size={17} />

                  <p>
                    Selected location
                  </p>

                  <strong>
                    {
                      selectedLocationLabel
                    }
                  </strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PatientLayout>
  );
}