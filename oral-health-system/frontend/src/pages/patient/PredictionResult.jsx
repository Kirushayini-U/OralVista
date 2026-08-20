import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Info,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";
import { SectionCard } from "../../components/UI.jsx";

import {
  getStoredUser,
} from "../../api/authStorage.js";


/* =====================================================
   LANGUAGE HELPERS
===================================================== */

const languageNameToCode = (language) => {
  const normalized =
    String(language || "English")
      .trim()
      .toLowerCase();

  if (normalized === "sinhala") {
    return "si";
  }

  if (normalized === "tamil") {
    return "ta";
  }

  return "en";
};


/* =====================================================
   MULTILINGUAL PAGE CONTENT
===================================================== */

const predictionResultTranslations = {
  en: {
    pageTitle:
      "Prediction Result",

    breadcrumbAssessment:
      "Dashboard › Symptom Prediction › Result",

    breadcrumbHistory:
      "Dashboard › Prediction History › Result",

    noResult:
      "No prediction result available",

    completeAssessmentFirst:
      "Please complete the symptom assessment first.",

    returnAssessment:
      "Return to Assessment",

    predictedCondition:
      "Predicted Oral Condition",

    confidence:
      "Confidence",

    confidenceLevel:
      "Confidence Level",

    high:
      "High",

    moderate:
      "Moderate",

    low:
      "Low",

    integrityProtected:
      "Prediction integrity protected",

    recommendedActions:
      "Recommended Actions",

    suggestedNextSteps:
      "Suggested next steps",

    noRecommendations:
      "No specific recommendations are available.",

    backHistory:
      "Back to History",

    newAssessment:
      "New Assessment",

    findClinic:
      "Find Nearby Clinic",

    probabilities:
      "Prediction Probabilities",

    probabilityDescription:
      "Probability across all six classes — highest to lowest",

    predicted:
      "Predicted",

    whyPrediction:
      "Why did the model make this prediction?",

    shapExplanation:
      "SHAP Explanation",

    shapDescription:
      "These are the main factors that influenced the Random Forest prediction.",

    inputValue:
      "Input value",

    yes:
      "Yes",

    no:
      "No",

    supportsPrediction:
      "Supports prediction",

    reducesPrediction:
      "Reduces prediction",

    neutralImpact:
      "Neutral impact",

    shapValue:
      "SHAP value",

    noShap:
      "No SHAP explanation was returned for this prediction.",

    preliminaryOnly:
      "Preliminary screening only",

    defaultDisclaimer:
      "This prediction is for preliminary screening and educational purposes only. It is not a confirmed medical diagnosis. Please consult a qualified dental professional.",

    conditions: {
      "Dental Caries":
        "Dental Caries",

      Gingivitis:
        "Gingivitis",

      Healthy:
        "Healthy",

      "Oral Thrush":
        "Oral Thrush",

      "Oral Ulcer":
        "Oral Ulcer",

      Periodontitis:
        "Periodontitis",
    },

    features: {
      tooth_pain:
        "Tooth Pain",

      gum_bleeding:
        "Gum Bleeding",

      bad_breath:
        "Bad Breath",

      mouth_ulcer:
        "Mouth Ulcer",

      tooth_sensitivity:
        "Tooth Sensitivity",

      swelling:
        "Swelling",

      white_spots:
        "White Spots",

      dry_mouth:
        "Dry Mouth",

      sugar_intake_high:
        "High Sugar Intake",

      smoking:
        "Smoking",

      betel_chewing:
        "Betel Chewing",

      brushing_frequency_low:
        "Low Brushing Frequency",

      age:
        "Age",

      water_intake_low:
        "Low Water Intake",
    },

    recommendations: {
      "Maintain good oral hygiene.":
        "Maintain good oral hygiene.",

      "Brush twice daily using fluoride toothpaste.":
        "Brush twice daily using fluoride toothpaste.",

      "Reduce sugary foods and drinks.":
        "Reduce sugary foods and drinks.",

      "Visit a dental professional for further assessment.":
        "Visit a dental professional for further assessment.",

      "Seek professional dental care if symptoms persist or worsen.":
        "Seek professional dental care if symptoms persist or worsen.",
    },
  },


  si: {
    pageTitle:
      "පුරෝකථන ප්‍රතිඵලය",

    breadcrumbAssessment:
      "උපකරණ පුවරුව › රෝග ලක්ෂණ පුරෝකථනය › ප්‍රතිඵලය",

    breadcrumbHistory:
      "උපකරණ පුවරුව › පුරෝකථන ඉතිහාසය › ප්‍රතිඵලය",

    noResult:
      "පුරෝකථන ප්‍රතිඵලයක් නොමැත",

    completeAssessmentFirst:
      "කරුණාකර මුලින් රෝග ලක්ෂණ ඇගයීම සම්පූර්ණ කරන්න.",

    returnAssessment:
      "ඇගයීමට ආපසු යන්න",

    predictedCondition:
      "පුරෝකථනය කළ මුඛ සෞඛ්‍ය තත්ත්වය",

    confidence:
      "විශ්වාසනීයතාව",

    confidenceLevel:
      "විශ්වාසනීයතා මට්ටම",

    high:
      "ඉහළ",

    moderate:
      "මධ්‍යම",

    low:
      "අඩු",

    integrityProtected:
      "පුරෝකථන අඛණ්ඩතාව ආරක්ෂා කර ඇත",

    recommendedActions:
      "නිර්දේශිත ක්‍රියාමාර්ග",

    suggestedNextSteps:
      "යෝජිත ඊළඟ පියවර",

    noRecommendations:
      "විශේෂ නිර්දේශ ලබාගත නොහැක.",

    backHistory:
      "ඉතිහාසයට ආපසු",

    newAssessment:
      "නව ඇගයීම",

    findClinic:
      "ළඟම දන්ත සායනය සොයන්න",

    probabilities:
      "පුරෝකථන සම්භාවිතා",

    probabilityDescription:
      "පන්ති හයම සඳහා සම්භාවිතා — ඉහළ සිට අඩු දක්වා",

    predicted:
      "පුරෝකථනය කළ",

    whyPrediction:
      "ආකෘතිය මෙම පුරෝකථනය කළේ ඇයි?",

    shapExplanation:
      "SHAP පැහැදිලි කිරීම",

    shapDescription:
      "Random Forest පුරෝකථනයට වැඩිම බලපෑම කළ ප්‍රධාන සාධක මෙහි පෙන්වයි.",

    inputValue:
      "ආදාන අගය",

    yes:
      "ඔව්",

    no:
      "නැත",

    supportsPrediction:
      "පුරෝකථනයට සහාය දක්වයි",

    reducesPrediction:
      "පුරෝකථනය අඩු කරයි",

    neutralImpact:
      "මධ්‍යස්ථ බලපෑම",

    shapValue:
      "SHAP අගය",

    noShap:
      "මෙම පුරෝකථනය සඳහා SHAP පැහැදිලි කිරීමක් ලැබී නොමැත.",

    preliminaryOnly:
      "මූලික පරීක්ෂාව සඳහා පමණි",

    defaultDisclaimer:
      "මෙම පුරෝකථනය මූලික පරීක්ෂාව සහ අධ්‍යාපනික අරමුණු සඳහා පමණි. මෙය තහවුරු කළ වෛද්‍ය රෝග විනිශ්චයක් නොවේ. කරුණාකර සුදුසුකම් ලත් දන්ත වෛද්‍ය වෘත්තිකයෙකු හමුවන්න.",

    conditions: {
      "Dental Caries":
        "දත් කුහර රෝගය",

      Gingivitis:
        "දත් මස් දැවිල්ල",

      Healthy:
        "සෞඛ්‍ය සම්පන්න",

      "Oral Thrush":
        "මුඛ කැන්ඩිඩා ආසාදනය",

      "Oral Ulcer":
        "මුඛ තුවාල",

      Periodontitis:
        "පරියෝඩොන්ටයිටිස්",
    },

    features: {
      tooth_pain:
        "දත් වේදනාව",

      gum_bleeding:
        "දත් මස් ලේ ගැලීම",

      bad_breath:
        "මුඛ දුර්ගන්ධය",

      mouth_ulcer:
        "මුඛ තුවාල",

      tooth_sensitivity:
        "දත් සංවේදීතාව",

      swelling:
        "ඉදිමීම",

      white_spots:
        "සුදු ලප",

      dry_mouth:
        "වියළි මුඛය",

      sugar_intake_high:
        "අධික සීනි පරිභෝජනය",

      smoking:
        "දුම්පානය",

      betel_chewing:
        "බුලත් හපීම",

      brushing_frequency_low:
        "අඩු දත් මැදීමේ වාර ගණන",

      age:
        "වයස",

      water_intake_low:
        "අඩු ජල පරිභෝජනය",
    },

    recommendations: {
      "Maintain good oral hygiene.":
        "හොඳ මුඛ සෞඛ්‍ය පුරුදු පවත්වාගෙන යන්න.",

      "Brush twice daily using fluoride toothpaste.":
        "ෆ්ලෝරයිඩ් දන්තාලේපයක් භාවිතා කර දිනකට දෙවරක් දත් මදින්න.",

      "Reduce sugary foods and drinks.":
        "සීනි සහිත ආහාර සහ බීම අඩු කරන්න.",

      "Visit a dental professional for further assessment.":
        "වැඩිදුර ඇගයීමක් සඳහා දන්ත වෛද්‍ය වෘත්තිකයෙකු හමුවන්න.",

      "Seek professional dental care if symptoms persist or worsen.":
        "රෝග ලක්ෂණ දිගටම පවතින්නේ නම් හෝ වැඩි වන්නේ නම් වෘත්තීය දන්ත වෛද්‍ය සේවාව ලබාගන්න.",
    },
  },


  ta: {
    pageTitle:
      "கணிப்பு முடிவு",

    breadcrumbAssessment:
      "முகப்புப் பலகை › அறிகுறி கணிப்பு › முடிவு",

    breadcrumbHistory:
      "முகப்புப் பலகை › கணிப்பு வரலாறு › முடிவு",

    noResult:
      "கணிப்பு முடிவு கிடைக்கவில்லை",

    completeAssessmentFirst:
      "முதலில் அறிகுறி மதிப்பீட்டை முடிக்கவும்.",

    returnAssessment:
      "மதிப்பீட்டிற்கு திரும்பவும்",

    predictedCondition:
      "கணிக்கப்பட்ட வாய்ச் சுகாதார நிலை",

    confidence:
      "நம்பகத்தன்மை",

    confidenceLevel:
      "நம்பகத்தன்மை நிலை",

    high:
      "உயர்",

    moderate:
      "மிதமான",

    low:
      "குறைந்த",

    integrityProtected:
      "கணிப்பு ஒருமைப்பாடு பாதுகாக்கப்பட்டுள்ளது",

    recommendedActions:
      "பரிந்துரைக்கப்பட்ட செயல்கள்",

    suggestedNextSteps:
      "பரிந்துரைக்கப்பட்ட அடுத்த படிகள்",

    noRecommendations:
      "குறிப்பிட்ட பரிந்துரைகள் கிடைக்கவில்லை.",

    backHistory:
      "வரலாற்றிற்கு திரும்பவும்",

    newAssessment:
      "புதிய மதிப்பீடு",

    findClinic:
      "அருகிலுள்ள பல் மருத்துவமனையை தேடவும்",

    probabilities:
      "கணிப்பு சாத்தியக்கூறுகள்",

    probabilityDescription:
      "ஆறு வகைகளின் சாத்தியக்கூறுகள் — அதிகத்திலிருந்து குறைவிற்கு",

    predicted:
      "கணிக்கப்பட்டது",

    whyPrediction:
      "மாதிரி ஏன் இந்த கணிப்பை செய்தது?",

    shapExplanation:
      "SHAP விளக்கம்",

    shapDescription:
      "Random Forest கணிப்பை அதிகமாக பாதித்த முக்கிய காரணிகள் இங்கே காட்டப்படுகின்றன.",

    inputValue:
      "உள்ளீட்டு மதிப்பு",

    yes:
      "ஆம்",

    no:
      "இல்லை",

    supportsPrediction:
      "கணிப்பை ஆதரிக்கிறது",

    reducesPrediction:
      "கணிப்பை குறைக்கிறது",

    neutralImpact:
      "நடுநிலை தாக்கம்",

    shapValue:
      "SHAP மதிப்பு",

    noShap:
      "இந்த கணிப்பிற்கு SHAP விளக்கம் கிடைக்கவில்லை.",

    preliminaryOnly:
      "ஆரம்ப பரிசோதனைக்காக மட்டும்",

    defaultDisclaimer:
      "இந்த கணிப்பு ஆரம்ப பரிசோதனை மற்றும் கல்வி நோக்கங்களுக்காக மட்டுமே. இது உறுதிப்படுத்தப்பட்ட மருத்துவ நோயறிதல் அல்ல. தகுதியான பல் மருத்துவ நிபுணரை அணுகவும்.",

    conditions: {
      "Dental Caries":
        "பல் சொத்தை",

      Gingivitis:
        "ஈறு அழற்சி",

      Healthy:
        "ஆரோக்கியம்",

      "Oral Thrush":
        "வாய் பூஞ்சை தொற்று",

      "Oral Ulcer":
        "வாய் புண்",

      Periodontitis:
        "பல் சுற்றுத் திசு அழற்சி",
    },

    features: {
      tooth_pain:
        "பல் வலி",

      gum_bleeding:
        "ஈறு இரத்தப்போக்கு",

      bad_breath:
        "வாய் துர்நாற்றம்",

      mouth_ulcer:
        "வாய் புண்",

      tooth_sensitivity:
        "பல் உணர்திறன்",

      swelling:
        "வீக்கம்",

      white_spots:
        "வெள்ளை புள்ளிகள்",

      dry_mouth:
        "வாய் உலர்வு",

      sugar_intake_high:
        "அதிக சர்க்கரை உட்கொள்ளல்",

      smoking:
        "புகைப்பிடித்தல்",

      betel_chewing:
        "வெற்றிலை மென்றல்",

      brushing_frequency_low:
        "குறைந்த பல் துலக்கும் பழக்கம்",

      age:
        "வயது",

      water_intake_low:
        "குறைந்த நீர் உட்கொள்ளல்",
    },

    recommendations: {
      "Maintain good oral hygiene.":
        "நல்ல வாய்ச் சுகாதார பழக்கங்களை தொடரவும்.",

      "Brush twice daily using fluoride toothpaste.":
        "ஃப்ளூரைடு பற்பசையை பயன்படுத்தி தினமும் இருமுறை பல் துலக்குங்கள்.",

      "Reduce sugary foods and drinks.":
        "சர்க்கரை நிறைந்த உணவுகள் மற்றும் பானங்களை குறைக்கவும்.",

      "Visit a dental professional for further assessment.":
        "மேலும் மதிப்பீட்டிற்காக பல் மருத்துவ நிபுணரை அணுகவும்.",

      "Seek professional dental care if symptoms persist or worsen.":
        "அறிகுறிகள் தொடர்ந்தாலோ மோசமடைந்தாலோ தொழில்முறை பல் மருத்துவ சேவையைப் பெறவும்.",
    },
  },
};


/* =====================================================
   TRANSLATION HELPERS
===================================================== */

const translateCondition = (
  condition,
  t
) => {
  return (
    t.conditions?.[
      condition
    ] ||
    condition
  );
};


const translateRecommendation = (
  recommendation,
  t
) => {
  return (
    t.recommendations?.[
      recommendation
    ] ||
    recommendation
  );
};


const translateFeatureName = (
  item,
  t
) => {
  if (
    item?.feature &&
    t.features?.[
      item.feature
    ]
  ) {
    return t.features[
      item.feature
    ];
  }

  return (
    item?.displayName ||
    item?.feature ||
    ""
  );
};


const translateImpact = (
  impact,
  t
) => {
  if (
    impact ===
    "Supports prediction"
  ) {
    return t.supportsPrediction;
  }

  if (
    impact ===
    "Reduces prediction"
  ) {
    return t.reducesPrediction;
  }

  return (
    impact ||
    t.neutralImpact
  );
};


const translateConfidenceLevel = (
  level,
  t
) => {
  if (level === "High") {
    return t.high;
  }

  if (level === "Moderate") {
    return t.moderate;
  }

  if (level === "Low") {
    return t.low;
  }

  return level || "";
};


/* =====================================================
   COMPONENT
===================================================== */

export default function PredictionResult() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [currentUser, setCurrentUser] =
    useState(
      getStoredUser()
    );


  useEffect(() => {
    const refreshCurrentUser = () => {
      setCurrentUser(
        getStoredUser()
      );
    };

    window.addEventListener(
      "oralvista-user-updated",
      refreshCurrentUser
    );

    window.addEventListener(
      "storage",
      refreshCurrentUser
    );

    return () => {
      window.removeEventListener(
        "oralvista-user-updated",
        refreshCurrentUser
      );

      window.removeEventListener(
        "storage",
        refreshCurrentUser
      );
    };
  }, []);


  const languageCode =
    languageNameToCode(
      currentUser?.language ||
      location.state?.language
    );


  const t =
    predictionResultTranslations[
      languageCode
    ] ||
    predictionResultTranslations.en;


  const result =
    location.state?.result ||
    null;


  const fromHistory =
    location.state?.fromHistory ===
    true;


  /* ===================================================
     NO RESULT
  =================================================== */

  if (!result) {
    return (
      <PatientLayout
        title={
          t.pageTitle
        }
        breadcrumb={
          t.breadcrumbAssessment
        }
      >

        <SectionCard>

          <div className="flex flex-col items-center text-center py-10">

            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">

              <AlertCircle
                size={30}
              />

            </div>


            <h2 className="text-xl font-bold text-ink">

              {t.noResult}

            </h2>


            <p className="text-sm text-slate-500 mt-2 max-w-md">

              {
                t.completeAssessmentFirst
              }

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

              <ArrowLeft
                size={17}
              />

              {
                t.returnAssessment
              }

            </button>

          </div>

        </SectionCard>

      </PatientLayout>
    );
  }


  /* ===================================================
     RESULT DATA
  =================================================== */

  const probabilities =
    result.probabilities ||
    {};


  const shapExplanation =
    result.shapExplanation ||
    [];


  const recommendations =
    result.recommendations ||
    [];


  const sortedProbabilities =
    useMemo(
      () =>
        Object.entries(
          probabilities
        ).sort(
          (
            [, probabilityA],
            [, probabilityB]
          ) =>
            Number(
              probabilityB ||
              0
            ) -
            Number(
              probabilityA ||
              0
            )
        ),
      [probabilities]
    );


  /* ===================================================
     CONFIDENCE COLOR
  =================================================== */

  const confidenceLevelClass =
    (() => {
      if (
        result.confidenceLevel ===
        "High"
      ) {
        return "text-emerald-600";
      }

      if (
        result.confidenceLevel ===
        "Moderate"
      ) {
        return "text-amber-500";
      }

      return "text-red-500";
    })();


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <PatientLayout
      title={
        t.pageTitle
      }
      breadcrumb={
        fromHistory
          ? t.breadcrumbHistory
          : t.breadcrumbAssessment
      }
    >

      <div className="space-y-6">


        {/* =================================================
            MAIN RESULT
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-6">


          <SectionCard>

            <div className="flex flex-col items-center text-center py-5">


              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">

                <Stethoscope
                  size={30}
                />

              </div>


              <p className="text-xs text-slate-400 uppercase tracking-wide">

                {
                  t.predictedCondition
                }

              </p>


              <h2 className="text-2xl font-bold text-ink mt-2">

                {translateCondition(
                  result.prediction,
                  t
                )}

              </h2>


              {/* Confidence */}

              <div className="mt-6 grid grid-cols-2 gap-6 w-full max-w-sm">


                <div>

                  <p className="text-xs text-slate-400">

                    {t.confidence}

                  </p>


                  <strong className="text-xl text-ink">

                    {Number(
                      result.confidence ||
                      0
                    ).toFixed(
                      2
                    )}
                    %

                  </strong>

                </div>


                <div>

                  <p className="text-xs text-slate-400">

                    {
                      t.confidenceLevel
                    }

                  </p>


                  <strong
                    className={`text-lg ${confidenceLevelClass}`}
                  >

                    {
                      translateConfidenceLevel(
                        result.confidenceLevel,
                        t
                      )
                    }

                  </strong>

                </div>

              </div>


              {/* Prediction Integrity */}

              {result.integrityProtected && (

                <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">

                  <ShieldCheck
                    size={15}
                  />

                  {
                    t.integrityProtected
                  }

                </div>

              )}

            </div>

          </SectionCard>


          {/* =================================================
              RECOMMENDATIONS
          ================================================= */}

          <SectionCard
            title={
              t.recommendedActions
            }
          >

            <div className="flex items-center gap-2 mb-4 text-brand-600">

              <CheckCircle2
                size={19}
              />

              <span className="text-sm font-semibold">

                {
                  t.suggestedNextSteps
                }

              </span>

            </div>


            {recommendations.length > 0 ? (

              <ul className="space-y-3">

                {recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (

                    <li
                      key={`${recommendation}-${index}`}
                      className="text-sm text-slate-500 flex gap-3"
                    >

                      <span className="text-brand-500 font-bold">
                        •
                      </span>

                      <span>
                        {
                          translateRecommendation(
                            recommendation,
                            t
                          )
                        }
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p className="text-sm text-slate-500">

                {
                  t.noRecommendations
                }

              </p>

            )}


            {/* Navigation Buttons */}

            <div className="flex flex-wrap gap-3 mt-6">


              {fromHistory ? (

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/prediction-history"
                    )
                  }
                  className="btn-secondary"
                >

                  <ArrowLeft
                    size={17}
                  />

                  {
                    t.backHistory
                  }

                </button>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/symptom-prediction"
                    )
                  }
                  className="btn-secondary"
                >

                  <ArrowLeft
                    size={17}
                  />

                  {
                    t.newAssessment
                  }

                </button>

              )}


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/clinic-finder"
                  )
                }
                className="btn-primary"
              >

                <MapPin
                  size={17}
                />

                {
                  t.findClinic
                }

              </button>

            </div>

          </SectionCard>

        </div>


        {/* =================================================
            PREDICTION PROBABILITIES
        ================================================= */}

        <SectionCard
          title={
            t.probabilities
          }
        >

          <div className="flex items-center gap-2 mb-5 text-brand-600">

            <BarChart3
              size={19}
            />

            <span className="text-sm font-semibold">

              {
                t.probabilityDescription
              }

            </span>

          </div>


          <div className="grid md:grid-cols-2 gap-4">

            {sortedProbabilities.map(
              (
                [condition, probability],
                index
              ) => {

                const value =
                  Number(
                    probability ||
                    0
                  );

                const isHighest =
                  index === 0;


                return (

                  <div
                    key={
                      condition
                    }
                    className={`border rounded-xl p-4 transition ${
                      isHighest
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-slate-100"
                    }`}
                  >

                    <div className="flex justify-between items-center gap-4">


                      <div className="flex items-center gap-3">

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isHighest
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {
                            index + 1
                          }
                        </div>


                        <span className="text-sm font-medium text-ink">

                          {
                            translateCondition(
                              condition,
                              t
                            )
                          }

                        </span>


                        {isHighest && (

                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">

                            {
                              t.predicted
                            }

                          </span>

                        )}

                      </div>


                      <strong
                        className={`text-sm ${
                          isHighest
                            ? "text-emerald-700"
                            : "text-brand-600"
                        }`}
                      >

                        {
                          value.toFixed(
                            2
                          )
                        }
                        %

                      </strong>

                    </div>


                    <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">

                      <div
                        className={`h-full rounded-full ${
                          isHighest
                            ? "bg-emerald-500"
                            : "bg-brand-500"
                        }`}
                        style={{
                          width:
                            `${Math.min(
                              100,
                              Math.max(
                                0,
                                value
                              )
                            )}%`,
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </SectionCard>


        {/* =================================================
            SHAP EXPLANATION
        ================================================= */}

        <SectionCard
          title={
            t.whyPrediction
          }
        >

          <div className="flex items-start gap-3 mb-5">

            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">

              <Sparkles
                size={19}
              />

            </div>


            <div>

              <h4 className="text-sm font-semibold text-ink">

                {
                  t.shapExplanation
                }

              </h4>


              <p className="text-sm text-slate-500 mt-1">

                {
                  t.shapDescription
                }

              </p>

            </div>

          </div>


          {shapExplanation.length > 0 ? (

            <div className="space-y-3">

              {shapExplanation.map(
                (
                  item,
                  index
                ) => {

                  const translatedImpact =
                    translateImpact(
                      item.impact,
                      t
                    );


                  return (

                    <div
                      key={`${item.feature}-${index}`}
                      className="border border-slate-100 rounded-xl p-4"
                    >

                      <div className="flex flex-wrap justify-between gap-3">


                        <div>

                          <p className="font-semibold text-sm text-ink">

                            {
                              translateFeatureName(
                                item,
                                t
                              )
                            }

                          </p>


                          <p className="text-xs text-slate-400 mt-1">

                            {
                              t.inputValue
                            }
                            :{" "}

                            {
                              item.feature ===
                              "age"
                                ? item.value
                                : item.value ===
                                    1
                                  ? t.yes
                                  : t.no
                            }

                          </p>

                        </div>


                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                            item.impact ===
                            "Supports prediction"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : item.impact ===
                                  "Reduces prediction"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >

                          {
                            translatedImpact
                          }

                        </span>

                      </div>


                      <div className="mt-3 flex justify-between text-xs text-slate-500">

                        <span>
                          {
                            t.shapValue
                          }
                        </span>

                        <strong>
                          {Number(
                            item.shapValue ||
                            0
                          ).toFixed(
                            6
                          )}
                        </strong>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          ) : (

            <p className="text-sm text-slate-500">

              {t.noShap}

            </p>

          )}

        </SectionCard>


        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

          <div className="flex items-start gap-3">

            <Info
              size={19}
              className="text-blue-600 mt-0.5 shrink-0"
            />


            <div>

              <h4 className="text-sm font-semibold text-blue-900">

                {
                  t.preliminaryOnly
                }

              </h4>


              <p className="text-sm text-blue-800/80 mt-1 leading-relaxed">

                {
                  result.disclaimer ||
                  t.defaultDisclaimer
                }

              </p>

            </div>

          </div>

        </div>


      </div>

    </PatientLayout>
  );
}