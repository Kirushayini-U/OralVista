import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import api from "../../api/axios.js";

/* =====================================================
   CONSTANTS
===================================================== */

const DAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const DEFAULT_SYMPTOM_DISTRIBUTION = {
  "Dental Caries": 0,
  Gingivitis: 0,
  Healthy: 0,
  "Oral Thrush": 0,
  "Oral Ulcer": 0,
  Periodontitis: 0,
};

const DEFAULT_IMAGE_DISTRIBUTION = {
  calculus: 0,
  gingivitis: 0,
  hypodontia: 0,
};

/* =====================================================
   HELPER: USER INITIALS
===================================================== */

function getInitials(fullName = "") {
  const names = String(fullName)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 0) {
    return "U";
  }

  return names
    .slice(0, 2)
    .map((name) =>
      name[0].toUpperCase()
    )
    .join("");
}

/* =====================================================
   HELPER: REGISTRATION DATE
===================================================== */

function formatRegistrationDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

/* =====================================================
   HELPER: REGISTRATION TIME
===================================================== */

function formatRegistrationTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =====================================================
   HELPER: DISPLAY IMAGE CLASS
===================================================== */

function formatImageClass(value) {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

/* =====================================================
   HELPER: PERCENTAGE
===================================================== */

function calculatePercentage(
  count,
  total
) {
  const safeCount =
    Number(count) || 0;

  const safeTotal =
    Number(total) || 0;

  if (safeTotal <= 0) {
    return 0;
  }

  return Math.round(
    (safeCount / safeTotal) *
      100
  );
}

/* =====================================================
   ANALYTICS DASHBOARD
===================================================== */

export default function AnalyticsDashboard() {
  /* ===================================================
     USER DATA
  =================================================== */

  const [
    users,
    setUsers,
  ] = useState([]);

  /* ===================================================
     PREDICTION SUMMARY
  =================================================== */

  const [
    predictionSummary,
    setPredictionSummary,
  ] = useState({
    symptomPredictions: 0,
    imagePredictions: 0,
    totalPredictions: 0,
  });

  /* ===================================================
     DISTRIBUTION DATA
  =================================================== */

  const [
    symptomDistribution,
    setSymptomDistribution,
  ] = useState(
    DEFAULT_SYMPTOM_DISTRIBUTION
  );

  const [
    imageDistribution,
    setImageDistribution,
  ] = useState(
    DEFAULT_IMAGE_DISTRIBUTION
  );

  const [
    predictionConnected,
    setPredictionConnected,
  ] = useState(false);

  /* ===================================================
     PAGE STATE
  =================================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    lastUpdated,
    setLastUpdated,
  ] = useState(null);

  /* ===================================================
     LOAD REAL ANALYTICS DATA
  =================================================== */

  const loadAnalyticsData =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setErrorMessage("");

          const [
            usersResult,
            predictionResult,
          ] =
            await Promise.allSettled([
              api.get(
                "/admin/users"
              ),

              api.get(
                "/admin/prediction-summary"
              ),
            ]);

          const failedServices =
            [];

          /* =============================================
             USER ANALYTICS
          ============================================= */

          if (
            usersResult.status ===
            "fulfilled"
          ) {
            const registeredUsers =
              usersResult.value
                .data?.users ||
              [];

            setUsers(
              Array.isArray(
                registeredUsers
              )
                ? registeredUsers
                : []
            );
          } else {
            console.error(
              "Analytics users loading error:",
              usersResult.reason
            );

            setUsers([]);

            failedServices.push(
              "User analytics"
            );
          }

          /* =============================================
             PREDICTION ANALYTICS
          ============================================= */

          if (
            predictionResult.status ===
            "fulfilled"
          ) {
            const responseData =
              predictionResult.value
                .data || {};

            const summary =
              responseData.summary ||
              {};

            const distributions =
              responseData
                .distributions ||
              {};

            const symptomPredictions =
              Number(
                summary
                  .symptomPredictions
              ) || 0;

            const imagePredictions =
              Number(
                summary
                  .imagePredictions
              ) || 0;

            const apiTotal =
              Number(
                summary
                  .totalPredictions
              );

            const totalPredictions =
              Number.isFinite(
                apiTotal
              )
                ? apiTotal
                : symptomPredictions +
                  imagePredictions;

            setPredictionSummary({
              symptomPredictions,
              imagePredictions,
              totalPredictions,
            });

            /* ===========================================
               SYMPTOM DISTRIBUTION
            =========================================== */

            setSymptomDistribution({
              ...DEFAULT_SYMPTOM_DISTRIBUTION,
              ...(
                distributions
                  .symptom ||
                {}
              ),
            });

            /* ===========================================
               IMAGE DISTRIBUTION
            =========================================== */

            setImageDistribution({
              ...DEFAULT_IMAGE_DISTRIBUTION,
              ...(
                distributions
                  .image ||
                {}
              ),
            });

            setPredictionConnected(
              true
            );
          } else {
            console.error(
              "Analytics prediction loading error:",
              predictionResult.reason
            );

            setPredictionSummary({
              symptomPredictions:
                0,
              imagePredictions:
                0,
              totalPredictions:
                0,
            });

            setSymptomDistribution(
              DEFAULT_SYMPTOM_DISTRIBUTION
            );

            setImageDistribution(
              DEFAULT_IMAGE_DISTRIBUTION
            );

            setPredictionConnected(
              false
            );

            failedServices.push(
              "Prediction analytics"
            );
          }

          /* =============================================
             LAST UPDATED
          ============================================= */

          setLastUpdated(
            new Date()
          );

          /* =============================================
             PARTIAL ERROR MESSAGE
          ============================================= */

          if (
            failedServices.length >
            0
          ) {
            setErrorMessage(
              `Some analytics services could not be loaded: ${failedServices.join(
                ", "
              )}.`
            );
          }
        } catch (error) {
          console.error(
            "Analytics loading error:",
            error
          );

          setErrorMessage(
            error.response?.data
              ?.message ||
              "Unable to load analytics data."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  /* ===================================================
     USER STATISTICS
  =================================================== */

  const totalRegisteredUsers =
    users.length;

  const activeUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.isActive !==
            false
        ),
      [users]
    );

  const blockedUsers =
    useMemo(
      () =>
        users.filter(
          (user) =>
            user.isActive ===
            false
        ),
      [users]
    );

  const activeUserCount =
    activeUsers.length;

  const blockedUserCount =
    blockedUsers.length;

  const activePercentage =
    totalRegisteredUsers > 0
      ? Math.round(
          (
            activeUserCount /
            totalRegisteredUsers
          ) *
            100
        )
      : 0;

  /* ===================================================
     RECENT USERS
  =================================================== */

  const recentUsers =
    useMemo(
      () =>
        [...users]
          .sort(
            (
              firstUser,
              secondUser
            ) =>
              new Date(
                secondUser.createdAt ||
                  0
              ) -
              new Date(
                firstUser.createdAt ||
                  0
              )
          )
          .slice(
            0,
            5
          ),
      [users]
    );

  /* ===================================================
     WEEKLY REGISTRATION DATA
  =================================================== */

  const weeklyRegistrationData =
    useMemo(() => {
      const today =
        new Date();

      today.setHours(
        23,
        59,
        59,
        999
      );

      const days = [];

      for (
        let offset = 6;
        offset >= 0;
        offset -= 1
      ) {
        const date =
          new Date(today);

        date.setDate(
          today.getDate() -
            offset
        );

        date.setHours(
          0,
          0,
          0,
          0
        );

        const nextDate =
          new Date(date);

        nextDate.setDate(
          date.getDate() +
            1
        );

        const count =
          users.filter(
            (user) => {
              if (
                !user.createdAt
              ) {
                return false;
              }

              const registrationDate =
                new Date(
                  user.createdAt
                );

              return (
                registrationDate >=
                  date &&
                registrationDate <
                  nextDate
              );
            }
          ).length;

        days.push({
          label:
            DAY_LABELS[
              date.getDay()
            ],

          date,

          count,
        });
      }

      return days;
    }, [users]);

  /* ===================================================
     WEEKLY CHART CALCULATIONS
  =================================================== */

  const maximumWeeklyRegistrations =
    Math.max(
      ...weeklyRegistrationData.map(
        (day) =>
          day.count
      ),
      1
    );

  const registrationsThisWeek =
    weeklyRegistrationData.reduce(
      (
        total,
        day
      ) =>
        total +
        day.count,
      0
    );

  /* ===================================================
     DISTRIBUTION ARRAYS
  =================================================== */

  const symptomDistributionEntries =
    useMemo(
      () =>
        Object.entries(
          symptomDistribution
        ).map(
          ([
            name,
            count,
          ]) => ({
            name,
            count:
              Number(
                count
              ) || 0,

            percentage:
              calculatePercentage(
                count,
                predictionSummary
                  .symptomPredictions
              ),
          })
        ),
      [
        symptomDistribution,
        predictionSummary
          .symptomPredictions,
      ]
    );

  const imageDistributionEntries =
    useMemo(
      () =>
        Object.entries(
          imageDistribution
        ).map(
          ([
            name,
            count,
          ]) => ({
            name,
            displayName:
              formatImageClass(
                name
              ),

            count:
              Number(
                count
              ) || 0,

            percentage:
              calculatePercentage(
                count,
                predictionSummary
                  .imagePredictions
              ),
          })
        ),
      [
        imageDistribution,
        predictionSummary
          .imagePredictions,
      ]
    );

  /* ===================================================
     TOP STATISTICS
  =================================================== */

  const statistics = [
    {
      label:
        "Total Predictions",

      value:
        predictionSummary
          .totalPredictions
          .toString(),

      description:
        predictionConnected
          ? `${predictionSummary.symptomPredictions} symptom • ${predictionSummary.imagePredictions} image`
          : "Prediction service unavailable",

      icon:
        Activity,

      className:
        "analytics-stat-icon-predictions",
    },

    {
      label:
        "Symptom Predictions",

      value:
        predictionSummary
          .symptomPredictions
          .toString(),

      description:
        predictionConnected
          ? "Random Forest symptom assessments"
          : "Prediction service unavailable",

      icon:
        Stethoscope,

      className:
        "analytics-stat-icon-caries",
    },

    {
      label:
        "Active Users",

      value:
        activeUserCount
          .toString(),

      description:
        `${activePercentage}% of registered users`,

      icon:
        UserCheck,

      className:
        "analytics-stat-icon-users",
    },

    {
      label:
        "Image Predictions",

      value:
        predictionSummary
          .imagePredictions
          .toString(),

      description:
        predictionConnected
          ? "CNN image assessments"
          : "Prediction service unavailable",

      icon:
        Target,

      className:
        "analytics-stat-icon-accuracy",
    },
  ];

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <AdminLayout
      title="Analytics Dashboard"
      subtitle="View real system activity and reports"
    >
      <div className="analytics-modern-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="analytics-modern-hero">

          <div className="analytics-modern-hero-copy">

            <span className="analytics-modern-badge">

              <Sparkles
                size={15}
              />

              OralVista system intelligence

            </span>

            <h2>
              Real-time platform overview
            </h2>

            <p>
              Registered-user and AI
              prediction statistics are
              loaded securely from MongoDB.
              Analytics update whenever new
              patient accounts or prediction
              records are created.
            </p>

            <div className="analytics-modern-tags">

              <span>

                <Users
                  size={15}
                />

                {totalRegisteredUsers} registered users

              </span>

              <span>

                <UserCheck
                  size={15}
                />

                {activeUserCount} active accounts

              </span>

              <span>

                <Activity
                  size={15}
                />

                {
                  predictionSummary
                    .totalPredictions
                } predictions

              </span>

              <span>

                <ShieldCheck
                  size={15}
                />

                Admin-only analytics

              </span>

            </div>

          </div>

          <div className="analytics-modern-hero-actions">

            <div className="analytics-modern-live-status">

              <span className="analytics-live-dot" />

              <div>

                <small>
                  Data source
                </small>

                <strong>
                  MongoDB analytics data
                </strong>

              </div>

            </div>

            <button
              type="button"
              onClick={
                loadAnalyticsData
              }
              disabled={
                loading
              }
              className="analytics-refresh-button"
            >

              <RefreshCcw
                size={18}
                className={
                  loading
                    ? "analytics-refresh-spinning"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh data"}

            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="analytics-error-message">

            <AlertCircle
              size={19}
            />

            <span>
              {errorMessage}
            </span>

          </div>
        )}

        {/* =================================================
            TOP STATISTICS
        ================================================= */}

        <section className="analytics-statistics-grid">

          {statistics.map(
            (statistic) => {

              const Icon =
                statistic.icon;

              return (
                <article
                  key={
                    statistic.label
                  }
                  className="analytics-statistic-card"
                >

                  <div
                    className={`analytics-statistic-icon ${statistic.className}`}
                  >

                    <Icon
                      size={23}
                    />

                  </div>

                  <div className="analytics-statistic-content">

                    <span>
                      {
                        statistic.label
                      }
                    </span>

                    {loading ? (

                      <div className="analytics-value-loading" />

                    ) : (

                      <strong>
                        {
                          statistic.value
                        }
                      </strong>

                    )}

                    <p>
                      {
                        statistic.description
                      }
                    </p>

                  </div>

                </article>
              );
            }
          )}

        </section>

        {/* =================================================
            USER ACTIVITY
        ================================================= */}

        <div className="analytics-primary-grid">

          <section className="analytics-chart-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  User activity
                </span>

                <h3>
                  Weekly Registrations
                </h3>

                <p>
                  Real patient accounts
                  created during the last
                  seven days.
                </p>

              </div>

              <div className="analytics-heading-summary">

                <CalendarDays
                  size={19}
                />

                <div>

                  <span>
                    This week
                  </span>

                  <strong>
                    {
                      registrationsThisWeek
                    }
                  </strong>

                </div>

              </div>

            </div>

            <div className="analytics-registration-chart">

              {weeklyRegistrationData.map(
                (day) => {

                  const barHeight =
                    day.count === 0
                      ? 4
                      : Math.max(
                          (
                            day.count /
                            maximumWeeklyRegistrations
                          ) *
                            100,
                          18
                        );

                  return (
                    <div
                      key={
                        day.date.toISOString()
                      }
                      className="analytics-chart-column"
                    >

                      <span className="analytics-chart-count">
                        {day.count}
                      </span>

                      <div className="analytics-chart-track">

                        <div
                          className="analytics-chart-bar"
                          style={{
                            height:
                              `${barHeight}%`,
                          }}
                        />

                      </div>

                      <span className="analytics-chart-label">
                        {day.label}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

            <div className="analytics-chart-footer">

              <span>

                <span className="analytics-chart-legend-dot" />

                Registered patients

              </span>

              <span>
                Automatically updated
                from User Management
              </span>

            </div>

          </section>

          {/* ===============================================
              USER STATUS
          =============================================== */}

          <aside className="analytics-account-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  Account health
                </span>

                <h3>
                  User Status
                </h3>

                <p>
                  Current registered
                  account activity.
                </p>

              </div>

              <div className="analytics-account-icon">

                <Users
                  size={22}
                />

              </div>

            </div>

            <div className="analytics-account-progress">

              <div
                className="analytics-account-circle"
                style={{
                  "--active-percentage":
                    `${activePercentage * 3.6}deg`,
                }}
              >

                <div>

                  <strong>
                    {
                      activePercentage
                    }
                    %
                  </strong>

                  <span>
                    active
                  </span>

                </div>

              </div>

            </div>

            <div className="analytics-account-summary">

              <div>

                <span className="analytics-status-marker analytics-status-marker-active" />

                <div>

                  <small>
                    Active users
                  </small>

                  <strong>
                    {
                      activeUserCount
                    }
                  </strong>

                </div>

              </div>

              <div>

                <span className="analytics-status-marker analytics-status-marker-blocked" />

                <div>

                  <small>
                    Blocked users
                  </small>

                  <strong>
                    {
                      blockedUserCount
                    }
                  </strong>

                </div>

              </div>

              <div>

                <span className="analytics-status-marker analytics-status-marker-total" />

                <div>

                  <small>
                    Total users
                  </small>

                  <strong>
                    {
                      totalRegisteredUsers
                    }
                  </strong>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================================
            RECENT USERS + PREDICTION SUMMARY
        ================================================= */}

        <div className="analytics-secondary-grid">

          {/* ===============================================
              RECENT REGISTRATIONS
          =============================================== */}

          <section className="analytics-recent-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  Recent activity
                </span>

                <h3>
                  Latest Registrations
                </h3>

                <p>
                  Most recently created
                  patient accounts.
                </p>

              </div>

              <div className="analytics-recent-icon">

                <Clock3
                  size={21}
                />

              </div>

            </div>

            {loading ? (

              <div className="analytics-loading-list">

                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="analytics-loading-row"
                    />
                  )
                )}

              </div>

            ) : recentUsers.length ===
              0 ? (

              <div className="analytics-empty-users">

                <Users
                  size={36}
                />

                <h4>
                  No registered users yet
                </h4>

                <p>
                  New patient accounts will
                  appear here after
                  registration.
                </p>

              </div>

            ) : (

              <div className="analytics-recent-list">

                {recentUsers.map(
                  (user) => (

                    <article
                      key={
                        user._id
                      }
                      className="analytics-recent-user"
                    >

                      <div className="analytics-user-avatar">

                        {user.profileImage ? (

                          <img
                            src={
                              user.profileImage
                            }
                            alt={
                              user.fullName
                            }
                          />

                        ) : (

                          getInitials(
                            user.fullName
                          )

                        )}

                      </div>

                      <div className="analytics-user-details">

                        <strong>
                          {
                            user.fullName
                          }
                        </strong>

                        <span>
                          {
                            user.email
                          }
                        </span>

                      </div>

                      <div className="analytics-user-registration">

                        <span
                          className={
                            user.isActive !==
                            false
                              ? "analytics-user-status analytics-user-active"
                              : "analytics-user-status analytics-user-blocked"
                          }
                        >

                          {user.isActive !==
                          false
                            ? "Active"
                            : "Blocked"}

                        </span>

                        <small>
                          {formatRegistrationDate(
                            user.createdAt
                          )}
                        </small>

                        <small>
                          {formatRegistrationTime(
                            user.createdAt
                          )}
                        </small>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

          {/* ===============================================
              PREDICTION ANALYTICS
          =============================================== */}

          <aside className="analytics-prediction-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  AI services
                </span>

                <h3>
                  Prediction Analytics
                </h3>

                <p>
                  Current AI prediction
                  activity stored in
                  MongoDB.
                </p>

              </div>

              <div className="analytics-prediction-icon">

                <BarChart3
                  size={21}
                />

              </div>

            </div>

            <div className="analytics-no-prediction">

              <div className="analytics-no-prediction-icon">

                <Activity
                  size={37}
                />

              </div>

              <h4>
                {predictionConnected
                  ? "AI prediction services connected"
                  : "Prediction analytics unavailable"}
              </h4>

              <p>
                {predictionConnected
                  ? "Symptom and image prediction records are securely stored in MongoDB and included in the administrative analytics."
                  : "Prediction statistics could not currently be retrieved from the backend."}
              </p>

              <div className="analytics-model-status-list">

                <div>

                  <span className="analytics-model-dot" />

                  <div>

                    <strong>
                      Symptom prediction
                    </strong>

                    <small>
                      {predictionConnected
                        ? "Random Forest connected"
                        : "Service unavailable"}
                    </small>

                  </div>

                  <b>
                    {
                      predictionSummary
                        .symptomPredictions
                    }
                  </b>

                </div>

                <div>

                  <span className="analytics-model-dot" />

                  <div>

                    <strong>
                      Image prediction
                    </strong>

                    <small>
                      {predictionConnected
                        ? "CNN connected"
                        : "Service unavailable"}
                    </small>

                  </div>

                  <b>
                    {
                      predictionSummary
                        .imagePredictions
                    }
                  </b>

                </div>

                <div>

                  <span className="analytics-model-dot" />

                  <div>

                    <strong>
                      Total predictions
                    </strong>

                    <small>
                      MongoDB prediction
                      records
                    </small>

                  </div>

                  <b>
                    {
                      predictionSummary
                        .totalPredictions
                    }
                  </b>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================================
            REAL PREDICTION DISTRIBUTIONS
        ================================================= */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(360px, 1fr))",

            gap:
              "24px",

            marginTop:
              "24px",
          }}
        >

          {/* ===============================================
              SYMPTOM DISEASE DISTRIBUTION
          =============================================== */}

          <section className="analytics-chart-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  Symptom AI
                </span>

                <h3>
                  Disease Distribution
                </h3>

                <p>
                  Distribution of
                  symptom-based Random
                  Forest prediction outcomes
                  stored in MongoDB.
                </p>

              </div>

              <div className="analytics-prediction-icon">

                <Stethoscope
                  size={21}
                />

              </div>

            </div>

            <div
              style={{
                marginTop:
                  "24px",

                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  "16px",
              }}
            >

              {symptomDistributionEntries.map(
                (item) => (

                  <div
                    key={
                      item.name
                    }
                    style={{
                      padding:
                        "15px 16px",

                      border:
                        "1px solid #e2e8f0",

                      borderRadius:
                        "14px",

                      background:
                        "#ffffff",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "space-between",

                        gap:
                          "12px",
                      }}
                    >

                      <div>

                        <strong
                          style={{
                            display:
                              "block",

                            color:
                              "#0f2940",

                            fontSize:
                              "14px",
                          }}
                        >
                          {
                            item.name
                          }
                        </strong>

                        <small
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          {
                            item.percentage
                          }
                          % of symptom predictions
                        </small>

                      </div>

                      <strong
                        style={{
                          color:
                            "#0f766e",

                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          item.count
                        }
                      </strong>

                    </div>

                    <div
                      style={{
                        height:
                          "9px",

                        marginTop:
                          "11px",

                        borderRadius:
                          "999px",

                        background:
                          "#edf3f7",

                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width:
                            `${item.percentage}%`,

                          height:
                            "100%",

                          borderRadius:
                            "999px",

                          background:
                            "linear-gradient(90deg, #0ea5e9, #14b8a6)",

                          transition:
                            "width 0.4s ease",
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

            <div
              style={{
                marginTop:
                  "18px",

                padding:
                  "13px 16px",

                borderRadius:
                  "13px",

                background:
                  "#f0fdfa",

                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  "12px",
              }}
            >

              <span
                style={{
                  color:
                    "#64748b",

                  fontSize:
                    "13px",
                }}
              >
                Total symptom predictions
              </span>

              <strong
                style={{
                  color:
                    "#0f766e",

                  fontSize:
                    "19px",
                }}
              >
                {
                  predictionSummary
                    .symptomPredictions
                }
              </strong>

            </div>

          </section>

          {/* ===============================================
              IMAGE PREDICTION DISTRIBUTION
          =============================================== */}

          <section className="analytics-chart-panel">

            <div className="analytics-panel-heading">

              <div>

                <span className="analytics-section-label">
                  Image AI
                </span>

                <h3>
                  Image Class Distribution
                </h3>

                <p>
                  Distribution of CNN
                  prediction outcomes stored
                  in MongoDB.
                </p>

              </div>

              <div className="analytics-prediction-icon">

                <BarChart3
                  size={21}
                />

              </div>

            </div>

            <div
              style={{
                marginTop:
                  "24px",

                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  "16px",
              }}
            >

              {imageDistributionEntries.map(
                (item) => (

                  <div
                    key={
                      item.name
                    }
                    style={{
                      padding:
                        "15px 16px",

                      border:
                        "1px solid #e2e8f0",

                      borderRadius:
                        "14px",

                      background:
                        "#ffffff",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "space-between",

                        gap:
                          "12px",
                      }}
                    >

                      <div>

                        <strong
                          style={{
                            display:
                              "block",

                            color:
                              "#0f2940",

                            fontSize:
                              "14px",
                          }}
                        >
                          {
                            item.displayName
                          }
                        </strong>

                        <small
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          {
                            item.percentage
                          }
                          % of image predictions
                        </small>

                      </div>

                      <strong
                        style={{
                          color:
                            "#0369a1",

                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          item.count
                        }
                      </strong>

                    </div>

                    <div
                      style={{
                        height:
                          "9px",

                        marginTop:
                          "11px",

                        borderRadius:
                          "999px",

                        background:
                          "#edf3f7",

                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width:
                            `${item.percentage}%`,

                          height:
                            "100%",

                          borderRadius:
                            "999px",

                          background:
                            "linear-gradient(90deg, #6366f1, #0ea5e9)",

                          transition:
                            "width 0.4s ease",
                        }}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

            <div
              style={{
                marginTop:
                  "18px",

                padding:
                  "13px 16px",

                borderRadius:
                  "13px",

                background:
                  "#eff6ff",

                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap:
                  "12px",
              }}
            >

              <span
                style={{
                  color:
                    "#64748b",

                  fontSize:
                    "13px",
                }}
              >
                Total image predictions
              </span>

              <strong
                style={{
                  color:
                    "#0369a1",

                  fontSize:
                    "19px",
                }}
              >
                {
                  predictionSummary
                    .imagePredictions
                }
              </strong>

            </div>

          </section>

        </div>

        {/* =================================================
            LAST UPDATED
        ================================================= */}

        <div className="analytics-last-updated">

          <CheckCircle2
            size={15}
          />

          <span>

            {lastUpdated
              ? `Last updated at ${lastUpdated.toLocaleTimeString(
                  [],
                  {
                    hour:
                      "2-digit",

                    minute:
                      "2-digit",
                  }
                )}`
              : "Waiting for analytics data"}

          </span>

        </div>

      </div>
    </AdminLayout>
  );
}