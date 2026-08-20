import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Database,
  Mail,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import api from "../../api/axios.js";

import {
  getAdminNewsletters,
} from "../../services/newsletterService.js";


/* =====================================================
   INITIAL STATISTICS
===================================================== */

const initialStatistics = {
  totalUsers: 0,
  totalClinics: 0,

  totalPredictions: 0,
  symptomPredictions: 0,
  imagePredictions: 0,

  totalNewsletters: 0,
  sentNewsletters: 0,
  draftNewsletters: 0,
  publishedNewsletters: 0,
};


const DAY_LABELS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];


/* =====================================================
   WEEKLY REGISTRATION HELPER
===================================================== */

function createWeeklyRegistrationData(
  users = []
) {
  const today = new Date();

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
    const startDate =
      new Date(today);

    startDate.setDate(
      today.getDate() -
        offset
    );

    startDate.setHours(
      0,
      0,
      0,
      0
    );


    const endDate =
      new Date(startDate);

    endDate.setDate(
      startDate.getDate() + 1
    );


    const count =
      users.filter(
        (user) => {
          if (!user.createdAt) {
            return false;
          }

          const registrationDate =
            new Date(
              user.createdAt
            );

          return (
            registrationDate >=
              startDate &&
            registrationDate <
              endDate
          );
        }
      ).length;


    days.push({
      date:
        startDate.toISOString(),

      day:
        DAY_LABELS[
          startDate.getDay()
        ],

      count,
    });
  }

  return days;
}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export default function AdminDashboard() {
  const [
    statistics,
    setStatistics,
  ] = useState(
    initialStatistics
  );


  const [
    weeklyRegistrations,
    setWeeklyRegistrations,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const [
    newsletterConnected,
    setNewsletterConnected,
  ] = useState(false);


  const [
    predictionConnected,
    setPredictionConnected,
  ] = useState(false);


  /* =====================================================
     LOAD REAL DASHBOARD DATA
  ===================================================== */

  const loadDashboard =
    useCallback(
      async (
        showRefreshState = false
      ) => {
        try {
          if (
            showRefreshState
          ) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setErrorMessage("");


          /*
           * Load:
           *
           * 1. Registered users
           * 2. Clinic statistics
           * 3. Newsletter statistics
           * 4. AI prediction statistics
           *
           * Promise.allSettled allows the
           * dashboard to continue working
           * even if one service fails.
           */
          const [
            usersResult,
            clinicResult,
            newsletterResult,
            predictionResult,
          ] =
            await Promise.allSettled(
              [
                api.get(
                  "/admin/users"
                ),

                api.get(
                  "/clinics/admin/searches",
                  {
                    params: {
                      page: 1,
                      limit: 1,
                    },
                  }
                ),

                getAdminNewsletters(),

                api.get(
                  "/admin/prediction-summary"
                ),
              ]
            );


          let users = [];

          let totalClinics = 0;

          let totalPredictions = 0;
          let symptomPredictions = 0;
          let imagePredictions = 0;

          let totalNewsletters = 0;
          let sentNewsletters = 0;
          let draftNewsletters = 0;
          let publishedNewsletters = 0;

          const failedServices = [];


          /* =================================================
             USERS
          ================================================= */

          if (
            usersResult.status ===
            "fulfilled"
          ) {
            users =
              usersResult.value
                .data?.users ||
              [];
          } else {
            console.error(
              "User dashboard request failed:",
              usersResult.reason
            );

            failedServices.push(
              "User Management"
            );
          }


          /* =================================================
             CLINICS
          ================================================= */

          if (
            clinicResult.status ===
            "fulfilled"
          ) {
            const clinicStatistics =
              clinicResult.value
                .data
                ?.statistics ||
              {};

            totalClinics =
              Number(
                clinicStatistics
                  .totalClinicsReturned
              ) || 0;
          } else {
            console.error(
              "Clinic dashboard request failed:",
              clinicResult.reason
            );

            failedServices.push(
              "Clinic Finder"
            );
          }


          /* =================================================
             NEWSLETTERS
          ================================================= */

          if (
            newsletterResult.status ===
            "fulfilled"
          ) {
            const newsletterResponse =
              newsletterResult.value ||
              {};

            const newsletters =
              newsletterResponse
                .newsletters ||
              [];

            const newsletterStatistics =
              newsletterResponse
                .statistics ||
              {};


            const countStatus =
              (status) =>
                newsletters.filter(
                  (
                    newsletter
                  ) =>
                    String(
                      newsletter
                        .status ||
                        ""
                    ).toLowerCase() ===
                    status
                ).length;


            totalNewsletters =
              Number(
                newsletterStatistics
                  .total
              ) ||
              newsletters.length;


            sentNewsletters =
              Number(
                newsletterStatistics
                  .sent
              ) ||
              countStatus(
                "sent"
              );


            draftNewsletters =
              Number(
                newsletterStatistics
                  .draft
              ) ||
              countStatus(
                "draft"
              );


            publishedNewsletters =
              Number(
                newsletterStatistics
                  .published
              ) ||
              countStatus(
                "published"
              );


            setNewsletterConnected(
              true
            );
          } else {
            console.error(
              "Newsletter dashboard request failed:",
              newsletterResult.reason
            );

            setNewsletterConnected(
              false
            );

            failedServices.push(
              "Newsletter API"
            );
          }


          /* =================================================
             AI PREDICTIONS
          ================================================= */

          if (
            predictionResult.status ===
            "fulfilled"
          ) {
            const predictionSummary =
              predictionResult.value
                .data?.summary ||
              {};


            symptomPredictions =
              Number(
                predictionSummary
                  .symptomPredictions
              ) || 0;


            imagePredictions =
              Number(
                predictionSummary
                  .imagePredictions
              ) || 0;


            totalPredictions =
              Number(
                predictionSummary
                  .totalPredictions
              ) ||
              (
                symptomPredictions +
                imagePredictions
              );


            setPredictionConnected(
              true
            );
          } else {
            console.error(
              "Prediction dashboard request failed:",
              predictionResult.reason
            );

            setPredictionConnected(
              false
            );

            failedServices.push(
              "AI Prediction"
            );
          }


          /* =================================================
             UPDATE STATISTICS
          ================================================= */

          setStatistics({
            totalUsers:
              users.length,

            totalClinics,

            totalPredictions,

            symptomPredictions,

            imagePredictions,

            totalNewsletters,

            sentNewsletters,

            draftNewsletters,

            publishedNewsletters,
          });


          setWeeklyRegistrations(
            createWeeklyRegistrationData(
              users
            )
          );


          if (
            failedServices.length >
            0
          ) {
            setErrorMessage(
              `Some dashboard services could not be loaded: ${failedServices.join(
                ", "
              )}.`
            );
          }
        } catch (error) {
          console.error(
            "Admin dashboard loading error:",
            error
          );


          setStatistics(
            initialStatistics
          );


          setWeeklyRegistrations(
            []
          );


          setNewsletterConnected(
            false
          );


          setPredictionConnected(
            false
          );


          setErrorMessage(
            error.response?.data
              ?.message ||
              "Unable to load the admin dashboard."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  /* =====================================================
     WEEKLY CHART CALCULATIONS
  ===================================================== */

  const maximumWeeklyValue =
    useMemo(() => {
      return Math.max(
        1,

        ...weeklyRegistrations.map(
          (item) =>
            Number(
              item.count
            ) || 0
        )
      );
    }, [
      weeklyRegistrations,
    ]);


  const weeklyTotal =
    useMemo(() => {
      return weeklyRegistrations.reduce(
        (
          total,
          item
        ) =>
          total +
          (
            Number(
              item.count
            ) || 0
          ),

        0
      );
    }, [
      weeklyRegistrations,
    ]);


  /* =====================================================
     DASHBOARD STATISTIC CARDS
  ===================================================== */

  const statisticCards = [
    {
      label:
        "Total Users",

      value:
        statistics.totalUsers,

      description:
        "Registered patient accounts",

      icon:
        Users,

      link:
        "/admin/users",

      iconStyle:
        "bg-sky-100 text-sky-700",

      borderStyle:
        "from-sky-500 to-cyan-500",
    },


    {
      label:
        "Total Clinics",

      value:
        statistics.totalClinics,

      description:
        "Clinic results saved from Google Maps",

      icon:
        Building2,

      link:
        "/admin/clinics",

      iconStyle:
        "bg-cyan-100 text-cyan-700",

      borderStyle:
        "from-cyan-500 to-teal-500",
    },


    {
      label:
        "Predictions",

      value:
        statistics.totalPredictions,

      description:
        predictionConnected
          ? `${statistics.symptomPredictions} symptom • ${statistics.imagePredictions} image`
          : "AI prediction service unavailable",

      icon:
        Activity,

      link:
        "/admin/analytics",

      iconStyle:
        "bg-indigo-100 text-indigo-700",

      borderStyle:
        "from-indigo-500 to-sky-500",
    },


    {
      label:
        "Newsletters",

      value:
        statistics.totalNewsletters,

      description:
        newsletterConnected
          ? `${statistics.sentNewsletters} sent campaign${
              statistics
                .sentNewsletters ===
              1
                ? ""
                : "s"
            }`
          : "Newsletter API unavailable",

      icon:
        Mail,

      link:
        "/admin/newsletters",

      iconStyle:
        "bg-teal-100 text-teal-700",

      borderStyle:
        "from-teal-500 to-emerald-500",
    },
  ];


  /* =====================================================
     LOADING PAGE
  ===================================================== */

  if (loading) {
    return (
      <AdminLayout
        title="Dashboard"
      >
        <div className="grid min-h-[430px] place-items-center rounded-3xl border border-sky-100 bg-sky-50">

          <div className="text-center">

            <RefreshCw
              size={34}
              className="mx-auto animate-spin text-sky-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>

          </div>

        </div>
      </AdminLayout>
    );
  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <AdminLayout
      title="Dashboard"
    >
      <div className="min-h-[calc(100vh-6.5rem)] overflow-hidden rounded-[26px] border border-sky-100 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-4 lg:p-5">

        {/* =================================================
            WELCOME BANNER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 px-5 py-4 shadow-lg shadow-sky-200/60">

          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10" />

          <div className="absolute right-32 top-5 h-24 w-24 rounded-full bg-white/10 blur-2xl" />


          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">

                <ShieldCheck
                  size={13}
                />

                Administrator dashboard

              </span>


              <h2 className="mt-2 text-2xl font-black tracking-tight text-white lg:text-3xl">
                Welcome back, Admin
              </h2>


              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/80">
                Monitor registered users,
                AI predictions, clinic
                services and platform
                activity from one place.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                loadDashboard(true)
              }
              disabled={refreshing}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 text-xs font-bold text-white backdrop-blur transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Data"}

            </button>

          </div>

        </section>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {errorMessage && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">

            <AlertCircle
              size={17}
            />

            {errorMessage}

          </div>
        )}


        {/* =================================================
            STATISTIC CARDS
        ================================================= */}

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {statisticCards.map(
            (card) => {

              const Icon =
                card.icon;


              return (
                <Link
                  key={
                    card.label
                  }
                  to={
                    card.link
                  }
                  className="group relative min-h-[138px] overflow-hidden rounded-[18px] border border-white bg-white/95 p-4 shadow-md shadow-sky-100/70 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${card.borderStyle}`}
                  />


                  <div className="flex items-start justify-between">

                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${card.iconStyle}`}
                    >
                      <Icon
                        size={19}
                      />
                    </div>


                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600"
                    />

                  </div>


                  <div className="mt-3 flex items-end justify-between gap-3">

                    <div>

                      <p className="text-xs font-semibold text-slate-500">
                        {card.label}
                      </p>


                      <p className="mt-0.5 text-2xl font-black text-slate-900">

                        {Number(
                          card.value ||
                            0
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>


                  <p className="mt-1 text-[10px] text-slate-400">
                    {
                      card.description
                    }
                  </p>

                </Link>
              );
            }
          )}

        </section>


        {/* =================================================
            BOTTOM SECTION
        ================================================= */}

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_0.75fr]">

          {/* =================================================
              WEEKLY REGISTRATION CHART
          ================================================= */}

          <div className="rounded-[20px] border border-white bg-white/95 p-4 shadow-lg shadow-sky-100/60">

            <div className="flex flex-wrap items-start justify-between gap-3">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600">
                  Registration overview
                </p>


                <h3 className="mt-1 text-lg font-black text-slate-900">
                  Weekly User Registrations
                </h3>


                <p className="mt-1 text-[10px] text-slate-400">
                  New patients registered
                  during the last seven
                  days.
                </p>

              </div>


              <span className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-[10px] font-bold text-sky-700">

                <CalendarDays
                  size={14}
                />

                Last 7 days

              </span>

            </div>


            <div className="mt-3 flex h-[170px] items-end gap-2 rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/80 to-white px-4 pb-3 pt-4">

              {weeklyRegistrations.length >
              0 ? (

                weeklyRegistrations.map(
                  (item) => {

                    const count =
                      Number(
                        item.count
                      ) || 0;


                    const height =
                      count === 0
                        ? 5
                        : Math.max(
                            18,

                            (
                              count /
                              maximumWeeklyValue
                            ) *
                              100
                          );


                    return (
                      <div
                        key={
                          item.date
                        }
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >

                        <span className="mb-1 text-[9px] font-black text-sky-700">
                          {count}
                        </span>


                        <div className="flex h-[105px] w-full items-end justify-center">

                          <div
                            className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-sky-600 via-cyan-500 to-teal-400 shadow-sm"
                            style={{
                              height:
                                `${height}%`,
                            }}
                            title={`${item.day}: ${count} registrations`}
                          />

                        </div>


                        <span className="mt-2 text-[9px] font-bold text-slate-400">
                          {item.day}
                        </span>

                      </div>
                    );
                  }
                )

              ) : (

                <div className="grid h-full w-full place-items-center text-xs text-slate-400">
                  No registration data
                  available
                </div>

              )}

            </div>


            <div className="mt-3 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-4 py-2.5">

              <div className="flex items-center gap-2">

                <Users
                  size={16}
                  className="text-sky-700"
                />


                <span className="text-[10px] font-bold text-sky-700">
                  Weekly registrations
                </span>

              </div>


              <strong className="text-lg font-black text-slate-900">
                {weeklyTotal}
              </strong>

            </div>

          </div>


          {/* =================================================
              SYSTEM CONNECTIONS
          ================================================= */}

          <div className="rounded-[20px] border border-white bg-white/95 p-4 shadow-lg shadow-sky-100/60">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
                Platform status
              </p>


              <h3 className="mt-1 text-lg font-black text-slate-900">
                System Connections
              </h3>


              <p className="mt-1 text-[10px] text-slate-400">
                Current backend and
                service status.
              </p>

            </div>


            <div className="mt-4 space-y-2.5">

              <StatusItem
                icon={Database}
                label="MongoDB Database"
                status="Connected"
                active
              />


              <StatusItem
                icon={Users}
                label="User Management"
                status="Connected"
                active
              />


              <StatusItem
                icon={Building2}
                label="Google Maps"
                status="Connected"
                active
              />


              <StatusItem
                icon={Activity}
                label="AI Prediction"
                status={
                  predictionConnected
                    ? "Connected"
                    : "Unavailable"
                }
                active={
                  predictionConnected
                }
              />


              <StatusItem
                icon={Mail}
                label="Newsletter API"
                status={
                  newsletterConnected
                    ? "Connected"
                    : "Unavailable"
                }
                active={
                  newsletterConnected
                }
              />

            </div>


            <Link
              to="/admin/users"
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5"
            >
              Manage Users

              <ArrowRight
                size={14}
              />
            </Link>

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}


/* =====================================================
   STATUS ITEM
===================================================== */

function StatusItem({
  icon: Icon,
  label,
  status,
  active = false,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">

      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
          active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        <Icon size={15} />
      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-[11px] font-bold text-slate-700">
          {label}
        </p>

      </div>


      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold ${
          active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-500"
        }`}
      >

        {active && (
          <CheckCircle2
            size={10}
          />
        )}

        {status}

      </span>

    </div>
  );
}