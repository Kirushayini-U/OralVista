import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";
import { SectionCard } from "../../components/UI.jsx";


export default function PredictionHistory() {
  const navigate = useNavigate();

  const [predictions, setPredictions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);


  /* =====================================================
     GET STORED PATIENT TOKEN
  ===================================================== */

  const getStoredToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("patientToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("patientToken")
    );
  };


  /* =====================================================
     LOAD PREDICTION HISTORY
  ===================================================== */

  const loadHistory = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token =
        getStoredToken();

      if (!token) {
        setMessage(
          "Your login session could not be found. Please sign in again."
        );

        return;
      }


      const response =
        await fetch(
          "http://localhost:5000/api/symptom-predictions/history",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load prediction history."
        );
      }


      setPredictions(
        Array.isArray(
          data.predictions
        )
          ? data.predictions
          : []
      );
    } catch (error) {
      console.error(
        "Prediction history error:",
        error
      );

      setMessage(
        error.message ||
        "Unable to load prediction history."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadHistory();
  }, []);


  /* =====================================================
     VIEW FULL PREDICTION DETAILS
  ===================================================== */

  const handleViewDetails = (
    prediction
  ) => {
    /*
     * History data uses MongoDB-friendly
     * probability property names.
     *
     * PredictionResult.jsx expects
     * readable condition names.
     */
    const probabilities = {
      "Dental Caries":
        prediction.probabilities
          ?.dentalCaries ?? 0,

      Gingivitis:
        prediction.probabilities
          ?.gingivitis ?? 0,

      Healthy:
        prediction.probabilities
          ?.healthy ?? 0,

      "Oral Thrush":
        prediction.probabilities
          ?.oralThrush ?? 0,

      "Oral Ulcer":
        prediction.probabilities
          ?.oralUlcer ?? 0,

      Periodontitis:
        prediction.probabilities
          ?.periodontitis ?? 0,
    };


    const result = {
      predictionId:
        prediction.id,

      prediction:
        prediction.prediction,

      confidence:
        prediction.confidence,

      confidenceLevel:
        prediction.confidenceLevel,

      probabilities,

      shapExplanation:
        prediction.shapExplanation ||
        [],

      recommendations:
        prediction.recommendations ||
        [],

      disclaimer:
        prediction.disclaimer,

      model:
        prediction.model,

      integrityProtected:
        prediction.integrityValid ===
        true,

      createdAt:
        prediction.createdAt,
    };


    navigate(
      "/prediction-result",
      {
        state: {
          result,
          fromHistory: true,
        },
      }
    );
  };


  /* =====================================================
     DELETE PREDICTION
  ===================================================== */

  const handleDelete = async (
    predictionId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this prediction?"
      );


    if (!confirmed) {
      return;
    }


    try {
      setDeletingId(
        predictionId
      );

      setMessage("");


      const token =
        getStoredToken();


      if (!token) {
        setMessage(
          "Your login session could not be found. Please sign in again."
        );

        return;
      }


      const response =
        await fetch(
          `http://localhost:5000/api/symptom-predictions/history/${predictionId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to delete prediction."
        );
      }


      setPredictions(
        (previous) =>
          previous.filter(
            (prediction) =>
              prediction.id !==
              predictionId
          )
      );
    } catch (error) {
      console.error(
        "Delete prediction error:",
        error
      );

      setMessage(
        error.message ||
        "Unable to delete prediction."
      );
    } finally {
      setDeletingId(null);
    }
  };


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "Unknown date";
    }

    return new Date(
      dateValue
    ).toLocaleString();
  };


  /* =====================================================
     FORMAT SYMPTOM NAME
  ===================================================== */

  const formatSymptomName = (
    key
  ) => {
    return key
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (character) =>
          character.toUpperCase()
      );
  };


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <PatientLayout
      title="Prediction History"
      breadcrumb="Dashboard › Prediction History"
    >
      <div className="space-y-6">

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {message && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 flex gap-3 text-red-700">

            <AlertCircle
              size={19}
              className="shrink-0 mt-0.5"
            />

            <span className="text-sm">
              {message}
            </span>

          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <SectionCard>

            <div className="py-12 text-center">

              <Activity
                size={34}
                className="mx-auto text-brand-500 mb-3"
              />

              <p className="text-slate-500">
                Loading prediction history...
              </p>

            </div>

          </SectionCard>

        ) : predictions.length === 0 ? (

          /* =================================================
             EMPTY HISTORY
          ================================================= */

          <SectionCard>

            <div className="py-12 text-center">

              <Activity
                size={40}
                className="mx-auto text-slate-300 mb-4"
              />

              <h3 className="text-lg font-semibold text-ink">
                No predictions yet
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Complete a symptom assessment and your
                prediction history will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/symptom-prediction"
                  )
                }
                className="btn-primary mt-6"
              >
                Start Assessment
              </button>

            </div>

          </SectionCard>

        ) : (

          /* =================================================
             PREDICTION CARDS
          ================================================= */

          <div className="space-y-5">

            {predictions.map(
              (prediction) => (

                <SectionCard
                  key={prediction.id}
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* =========================================
                        LEFT CONTENT
                    ========================================= */}

                    <div className="flex-1">

                      {/* Prediction heading */}

                      <div className="flex flex-wrap items-center gap-3 mb-3">

                        <h3 className="text-xl font-bold text-ink">
                          {
                            prediction.prediction
                          }
                        </h3>


                        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                          {
                            prediction.confidenceLevel
                          }
                        </span>


                        {prediction.integrityValid ? (

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">

                            <ShieldCheck
                              size={14}
                            />

                            Integrity verified

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">

                            <AlertCircle
                              size={14}
                            />

                            Integrity check failed

                          </span>

                        )}

                      </div>


                      {/* =========================================
                          SUMMARY
                      ========================================= */}

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                        {/* Confidence */}

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-xs text-slate-400">
                            Confidence
                          </p>

                          <strong className="text-lg text-ink">
                            {Number(
                              prediction.confidence ||
                              0
                            ).toFixed(2)}
                            %
                          </strong>

                        </div>


                        {/* Date */}

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-xs text-slate-400">
                            Date
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-sm text-ink">

                            <CalendarDays
                              size={15}
                            />

                            {formatDate(
                              prediction.createdAt
                            )}

                          </div>

                        </div>


                        {/* Model */}

                        <div className="rounded-xl bg-slate-50 p-4">

                          <p className="text-xs text-slate-400">
                            Model
                          </p>

                          <strong className="text-sm text-ink">
                            {
                              prediction.model
                                ?.name ||
                              "OralVista Random Forest"
                            }
                          </strong>

                        </div>

                      </div>


                      {/* =========================================
                          SUBMITTED SYMPTOMS
                      ========================================= */}

                      {prediction.symptoms && (

                        <div className="mt-5">

                          <h4 className="text-sm font-semibold text-ink mb-3">
                            Submitted symptoms
                          </h4>


                          <div className="flex flex-wrap gap-2">

                            {Object.entries(
                              prediction.symptoms
                            ).map(
                              ([
                                key,
                                value,
                              ]) => (

                                <span
                                  key={key}
                                  className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-xs text-slate-600"
                                >

                                  {formatSymptomName(
                                    key
                                  )}

                                  :{" "}

                                  {key === "age"
                                    ? value
                                    : value === 1
                                      ? "Yes"
                                      : "No"}

                                </span>

                              )
                            )}

                          </div>

                        </div>

                      )}


                      {/* =========================================
                          RECOMMENDATIONS
                      ========================================= */}

                      {Array.isArray(
                        prediction.recommendations
                      ) &&
                        prediction
                          .recommendations
                          .length > 0 && (

                          <div className="mt-5">

                            <h4 className="text-sm font-semibold text-ink mb-3">
                              Recommendations
                            </h4>


                            <ul className="space-y-2">

                              {prediction.recommendations.map(
                                (
                                  recommendation,
                                  index
                                ) => (

                                  <li
                                    key={`${recommendation}-${index}`}
                                    className="flex gap-2 text-sm text-slate-500"
                                  >

                                    <CheckCircle2
                                      size={15}
                                      className="text-brand-500 shrink-0 mt-0.5"
                                    />

                                    <span>
                                      {
                                        recommendation
                                      }
                                    </span>

                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        )}

                    </div>


                    {/* =========================================
                        ACTION BUTTONS
                    ========================================= */}

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">

                      {/* View Details */}

                      <button
                        type="button"
                        onClick={() =>
                          handleViewDetails(
                            prediction
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 text-brand-600 hover:bg-brand-50 transition"
                      >
                        <Eye size={17} />

                        View Details
                      </button>


                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            prediction.id
                          )
                        }
                        disabled={
                          deletingId ===
                          prediction.id
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >

                        <Trash2 size={17} />

                        {deletingId ===
                        prediction.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </div>

                </SectionCard>

              )
            )}

          </div>

        )}

      </div>
    </PatientLayout>
  );
}