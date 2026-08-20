import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  ExternalLink,
  Hospital,
  LoaderCircle,
  Mail,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";

import {
  getAdminClinicSearch,
  getAdminClinicSearches,
} from "../../services/clinicService.js";

/* =====================================================
   HELPERS
===================================================== */

const formatDateTime = (value) => {
  if (!value) {
    return "Unknown";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-LK",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(value));
  } catch {
    return "Unknown";
  }
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

const getOpeningClass = (isOpen) => {
  if (isOpen === true) {
    return "clinic-status clinic-status-active";
  }

  if (isOpen === false) {
    return "clinic-status clinic-status-blocked";
  }

  return "clinic-status clinic-status-pending";
};

const formatRating = (rating) => {
  if (
    rating === null ||
    rating === undefined ||
    Number.isNaN(Number(rating))
  ) {
    return "Not rated";
  }

  return Number(rating).toFixed(1);
};

const EMPTY_STATISTICS = {
  totalSearches: 0,
  totalClinicsReturned: 0,
  uniquePatients: 0,
};

const EMPTY_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

/* =====================================================
   COMPONENT
===================================================== */

export default function ClinicManagement() {
  const [records, setRecords] =
    useState([]);

  const [statistics, setStatistics] =
    useState(EMPTY_STATISTICS);

  const [pagination, setPagination] =
    useState(EMPTY_PAGINATION);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [appliedSearch, setAppliedSearch] =
    useState("");

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* ===================================================
     LOAD SEARCH HISTORY
  =================================================== */

  const loadClinicSearches = async ({
    page = 1,
    search = appliedSearch,
  } = {}) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result =
        await getAdminClinicSearches({
          page,
          limit: 10,
          search,
        });

      setRecords(
        Array.isArray(result?.records)
          ? result.records
          : []
      );

      setStatistics(
        result?.statistics ||
          EMPTY_STATISTICS
      );

      setPagination(
        result?.pagination ||
          EMPTY_PAGINATION
      );
    } catch (requestError) {
      console.error(
        "Clinic management loading failed:",
        requestError
      );

      setRecords([]);
      setStatistics(
        EMPTY_STATISTICS
      );
      setPagination(
        EMPTY_PAGINATION
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Unable to load patient clinic-search records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinicSearches({
      page: 1,
      search: "",
    });
  }, []);

  /* ===================================================
     SEARCH
  =================================================== */

  const handleSearch = (event) => {
    event.preventDefault();

    const normalizedSearch =
      searchTerm.trim();

    setAppliedSearch(
      normalizedSearch
    );

    loadClinicSearches({
      page: 1,
      search: normalizedSearch,
    });
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");

    loadClinicSearches({
      page: 1,
      search: "",
    });
  };

  /* ===================================================
     VIEW DETAILS
  =================================================== */

  const openRecordDetails =
    async (recordId) => {
      if (!recordId) {
        return;
      }

      setDetailLoading(true);
      setError("");

      try {
        const result =
          await getAdminClinicSearch(
            recordId
          );

        setSelectedRecord(
          result?.record || null
        );
      } catch (requestError) {
        console.error(
          "Clinic search detail loading failed:",
          requestError
        );

        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load the selected clinic-search details."
        );
      } finally {
        setDetailLoading(false);
      }
    };

  /* ===================================================
     PAGINATION
  =================================================== */

  const goToPreviousPage = () => {
    if (pagination.page <= 1) {
      return;
    }

    loadClinicSearches({
      page: pagination.page - 1,
      search: appliedSearch,
    });
  };

  const goToNextPage = () => {
    if (
      pagination.page >=
      pagination.totalPages
    ) {
      return;
    }

    loadClinicSearches({
      page: pagination.page + 1,
      search: appliedSearch,
    });
  };

  /* ===================================================
     DERIVED VALUES
  =================================================== */

  const recentSearchCount =
    useMemo(() => {
      const today = new Date();

      return records.filter(
        (record) => {
          if (!record.searchedAt) {
            return false;
          }

          const searchedDate =
            new Date(
              record.searchedAt
            );

          return (
            searchedDate.getFullYear() ===
              today.getFullYear() &&
            searchedDate.getMonth() ===
              today.getMonth() &&
            searchedDate.getDate() ===
              today.getDate()
          );
        }
      ).length;
    }, [records]);

  return (
    <AdminLayout
      title="Clinic Management"
      subtitle="Review patient clinic searches and returned Google clinic information"
    >
      <div className="clinic-management-page">
        {/* =============================================
            HERO
        ============================================== */}

        <section className="clinic-management-hero">
          <div className="clinic-management-hero-overlay" />

          <div className="clinic-management-hero-content">
            <div className="clinic-management-hero-copy">
              <span className="clinic-management-badge">
                <Sparkles size={15} />
                OralVista clinic operations
              </span>

              <h2>
                Patient clinic-search history
              </h2>

              <p>
                Review locations searched by
                patients and all dental clinics
                returned by Google Places.
              </p>

              <div className="clinic-management-hero-tags">
                <span>
                  <ShieldCheck size={15} />
                  Administrator access
                </span>

                <span>
                  <MapPin size={15} />
                  Google Places connected
                </span>

                <span>
                  <CheckCircle2 size={15} />
                  MongoDB search records
                </span>
              </div>
            </div>

            <button
              type="button"
              className="clinic-management-add-button"
              onClick={() =>
                loadClinicSearches({
                  page:
                    pagination.page,
                  search:
                    appliedSearch,
                })
              }
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle
                  size={19}
                  className="clinic-management-spin"
                />
              ) : (
                <RefreshCw size={19} />
              )}

              Refresh records
            </button>
          </div>
        </section>

        {/* =============================================
            NOTIFICATIONS
        ============================================== */}

        {error && (
          <div className="clinic-management-message clinic-management-message-error">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {message && (
          <div className="clinic-management-message clinic-management-message-success">
            <CheckCircle2
              size={18}
            />

            <span>{message}</span>
          </div>
        )}

        {/* =============================================
            STATISTICS
        ============================================== */}

        <section className="clinic-statistics-grid">
          <article className="clinic-statistic-card">
            <div className="clinic-statistic-icon clinic-statistic-total">
              <Search size={22} />
            </div>

            <div>
              <span>Total searches</span>

              <strong>
                {
                  statistics.totalSearches
                }
              </strong>

              <p>
                Patient clinic searches
                recorded
              </p>
            </div>
          </article>

          <article className="clinic-statistic-card">
            <div className="clinic-statistic-icon clinic-statistic-active">
              <Users size={22} />
            </div>

            <div>
              <span>
                Unique patients
              </span>

              <strong>
                {
                  statistics.uniquePatients
                }
              </strong>

              <p>
                Patients who used Clinic
                Finder
              </p>
            </div>
          </article>

          <article className="clinic-statistic-card">
            <div className="clinic-statistic-icon clinic-statistic-pending">
              <Hospital size={22} />
            </div>

            <div>
              <span>
                Clinics returned
              </span>

              <strong>
                {
                  statistics.totalClinicsReturned
                }
              </strong>

              <p>
                Google clinic results
                stored
              </p>
            </div>
          </article>

          <article className="clinic-statistic-card">
            <div className="clinic-statistic-icon clinic-statistic-blocked">
              <CalendarDays
                size={22}
              />
            </div>

            <div>
              <span>
                Searches on this page
              </span>

              <strong>
                {recentSearchCount}
              </strong>

              <p>
                Today's visible records
              </p>
            </div>
          </article>
        </section>

        {/* =============================================
            MAIN PANEL
        ============================================== */}

        <section className="clinic-management-panel">
          <div className="clinic-management-panel-header">
            <div>
              <span className="clinic-section-label">
                Clinic Finder activity
              </span>

              <h3>
                Patient search records
              </h3>

              <p>
                Search by patient name,
                email, location or clinic
                name.
              </p>
            </div>

            <form
              className="clinic-management-tools"
              onSubmit={handleSearch}
            >
              <label className="clinic-search-box">
                <Search size={18} />

                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search patient, place or clinic..."
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />
              </label>

              <button
                type="submit"
                className="clinic-management-search-submit"
                disabled={loading}
              >
                Search
              </button>

              <button
                type="button"
                className="clinic-management-search-reset"
                onClick={
                  handleResetSearch
                }
                disabled={loading}
              >
                Reset
              </button>
            </form>
          </div>

          {loading ? (
            <div className="clinic-empty-state">
              <div className="clinic-empty-illustration">
                <LoaderCircle
                  size={43}
                  className="clinic-management-spin"
                />
              </div>

              <h4>
                Loading clinic searches
              </h4>

              <p>
                OralVista is retrieving
                patient search records from
                MongoDB.
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="clinic-empty-state">
              <div className="clinic-empty-illustration">
                <Building2 size={43} />
              </div>

              <h4>
                No clinic searches found
              </h4>

              <p>
                Patient searches will appear
                here after someone uses the
                Clinic Finder.
              </p>
            </div>
          ) : (
            <div className="clinic-search-record-list">
              {records.map(
                (record, index) => (
                  <article
                    key={record._id}
                    className="clinic-search-record-card"
                  >
                    <div className="clinic-card-number">
                      {String(
                        (pagination.page -
                          1) *
                          pagination.limit +
                          index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="clinic-search-record-main">
                      <div className="clinic-card-heading">
                        <div className="clinic-card-icon">
                          <Users size={23} />
                        </div>

                        <div>
                          <h4>
                            {
                              record.patientName
                            }
                          </h4>

                          <span className="clinic-status clinic-status-active">
                            Search recorded
                          </span>
                        </div>
                      </div>

                      <div className="clinic-search-record-grid">
                        <div className="clinic-view-detail">
                          <Mail size={17} />

                          <div>
                            <strong>
                              Patient email
                            </strong>

                            <p>
                              {
                                record.patientEmail
                              }
                            </p>
                          </div>
                        </div>

                        <div className="clinic-view-detail">
                          <MapPin
                            size={17}
                          />

                          <div>
                            <strong>
                              Searched place
                            </strong>

                            <p>
                              {
                                record.searchedLocation
                              }
                            </p>
                          </div>
                        </div>

                        <div className="clinic-view-detail">
                          <Hospital
                            size={17}
                          />

                          <div>
                            <strong>
                              Clinics found
                            </strong>

                            <p>
                              {
                                record.clinicsFound
                              }
                            </p>
                          </div>
                        </div>

                        <div className="clinic-view-detail">
                          <Clock3 size={17} />

                          <div>
                            <strong>
                              Search date
                            </strong>

                            <p>
                              {formatDateTime(
                                record.searchedAt
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="clinic-card-footer">
                      <button
                        type="button"
                        onClick={() =>
                          openRecordDetails(
                            record._id
                          )
                        }
                        disabled={
                          detailLoading
                        }
                        title="View search details"
                      >
                        {detailLoading ? (
                          <LoaderCircle
                            size={17}
                            className="clinic-management-spin"
                          />
                        ) : (
                          <Eye size={17} />
                        )}

                        View details
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}

          {/* ===========================================
              PAGINATION
          ============================================ */}

          <div className="clinic-management-footer">
            <span>
              Showing {records.length} of{" "}
              {pagination.total} search
              records
            </span>

            <div className="clinic-management-pagination">
              <button
                type="button"
                onClick={
                  goToPreviousPage
                }
                disabled={
                  pagination.page <= 1 ||
                  loading
                }
                aria-label="Previous page"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <span>
                Page {pagination.page} of{" "}
                {
                  pagination.totalPages
                }
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  loading
                }
                aria-label="Next page"
              >
                <ChevronRight
                  size={18}
                />
              </button>
            </div>

            <span>
              Clinic API: Connected
            </span>
          </div>
        </section>
      </div>

      {/* =============================================
          SEARCH DETAILS MODAL
      ============================================== */}

      {selectedRecord && (
        <div className="clinic-modal-backdrop">
          <div
            className="clinic-modal clinic-search-detail-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="clinic-modal-header">
              <div>
                <span>
                  Patient clinic search
                </span>

                <h3>
                  {
                    selectedRecord.searchedLocation
                  }
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(
                    null
                  )
                }
                aria-label="Close search details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="clinic-search-detail-summary">
              <div className="clinic-view-detail">
                <Users size={18} />

                <div>
                  <strong>
                    Patient
                  </strong>

                  <p>
                    {
                      selectedRecord.patientName
                    }
                  </p>
                </div>
              </div>

              <div className="clinic-view-detail">
                <Mail size={18} />

                <div>
                  <strong>Email</strong>

                  <p>
                    {
                      selectedRecord.patientEmail
                    }
                  </p>
                </div>
              </div>

              <div className="clinic-view-detail">
                <MapPin size={18} />

                <div>
                  <strong>
                    Searched location
                  </strong>

                  <p>
                    {
                      selectedRecord.searchedLocation
                    }
                  </p>
                </div>
              </div>

              <div className="clinic-view-detail">
                <Clock3 size={18} />

                <div>
                  <strong>
                    Search date
                  </strong>

                  <p>
                    {formatDateTime(
                      selectedRecord.searchedAt
                    )}
                  </p>
                </div>
              </div>

              <div className="clinic-view-detail">
                <Hospital size={18} />

                <div>
                  <strong>
                    Clinics found
                  </strong>

                  <p>
                    {
                      selectedRecord.clinicsFound
                    }
                  </p>
                </div>
              </div>

              <div className="clinic-view-detail">
                <Navigation size={18} />

                <div>
                  <strong>
                    Search mode
                  </strong>

                  <p>
                    {
                      selectedRecord.searchMode
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="clinic-search-detail-heading">
              <span>
                Returned clinic results
              </span>

              <strong>
                {
                  selectedRecord.clinics
                    ?.length
                }
              </strong>
            </div>

            {Array.isArray(
              selectedRecord.clinics
            ) &&
            selectedRecord.clinics
              .length > 0 ? (
              <div className="clinic-search-detail-grid">
                {selectedRecord.clinics.map(
                  (
                    clinic,
                    index
                  ) => (
                    <article
                      key={`${clinic.placeId}-${index}`}
                      className="clinic-directory-card"
                    >
                      <div className="clinic-card-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="clinic-card-heading">
                        <div className="clinic-card-icon">
                          <Building2
                            size={23}
                          />
                        </div>

                        <div>
                          <h4>
                            {
                              clinic.name
                            }
                          </h4>

                          <span
                            className={getOpeningClass(
                              clinic.isOpen
                            )}
                          >
                            {getOpeningLabel(
                              clinic.isOpen
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="clinic-card-details">
                        <div>
                          <MapPin
                            size={16}
                          />

                          <span>
                            <strong>
                              Address
                            </strong>

                            <small>
                              {clinic.address ||
                                "Unavailable"}
                            </small>
                          </span>
                        </div>

                        <div>
                          <Phone
                            size={16}
                          />

                          <span>
                            <strong>
                              Contact number
                            </strong>

                            <small>
                              {clinic.phone ||
                                "Unavailable"}
                            </small>
                          </span>
                        </div>

                        <div>
                          <Star size={16} />

                          <span>
                            <strong>
                              Rating
                            </strong>

                            <small>
                              {formatRating(
                                clinic.rating
                              )}

                              {clinic.reviewCount >
                                0 &&
                                ` (${clinic.reviewCount} reviews)`}
                            </small>
                          </span>
                        </div>

                        {clinic.distanceKm !==
                          null &&
                          clinic.distanceKm !==
                            undefined && (
                            <div>
                              <Navigation
                                size={16}
                              />

                              <span>
                                <strong>
                                  Distance
                                </strong>

                                <small>
                                  {
                                    clinic.distanceKm
                                  }{" "}
                                  km
                                </small>
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="clinic-card-footer">
                        {clinic.googleMapsUrl ? (
                          <a
                            href={
                              clinic.googleMapsUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="clinic-search-map-link"
                          >
                            <ExternalLink
                              size={16}
                            />

                            Open in Google Maps
                          </a>
                        ) : (
                          <span className="clinic-search-map-link-disabled">
                            Map link unavailable
                          </span>
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="clinic-empty-state">
                <div className="clinic-empty-illustration">
                  <Building2
                    size={43}
                  />
                </div>

                <h4>
                  No clinic results stored
                </h4>

                <p>
                  This search did not return
                  clinic details.
                </p>
              </div>
            )}

            <button
              type="button"
              className="clinic-view-close-button"
              onClick={() =>
                setSelectedRecord(
                  null
                )
              }
            >
              Close details
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}