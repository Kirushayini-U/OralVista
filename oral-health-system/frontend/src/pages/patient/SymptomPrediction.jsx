import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import PatientLayout from "../../components/PatientLayout.jsx";

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

const symptomPageTranslations = {
  en: {
    pageTitle: "Symptom Prediction",
    breadcrumb:
      "Dashboard › Symptom Prediction",

    heroBadge:
      "OralVista ML assessment",

    heroTitle:
      "Check your oral-health symptoms",

    heroDescription:
      "Answer all questions carefully. Your responses will be used by the trained machine-learning model to provide a preliminary oral-health prediction.",

    privateAssessment:
      "Private assessment",

    healthInputs:
      "health inputs",

    preliminaryGuidance:
      "Preliminary guidance",

    assessmentProgress:
      "Assessment progress",

    of:
      "of",

    completed:
      "completed",

    questionnaire:
      "Health questionnaire",

    tellSymptoms:
      "Tell us about your symptoms",

    selectYesNo:
      "Select Yes or No for every symptom.",

    yourAge:
      "Your age",

    ageHelp:
      "Enter your current age in years.",

    agePlaceholder:
      "e.g. 25",

    yes:
      "Yes",

    no:
      "No",

    resetAnswers:
      "Reset answers",

    processing:
      "Processing assessment...",

    predictRisk:
      "Predict oral-health risk",

    assessmentResult:
      "Assessment result",

    predictionSummary:
      "Prediction Summary",

    resultHere:
      "Your result will appear here",

    resultHelp:
      "Complete every question and click the prediction button to process your assessment.",

    answerEverySymptom:
      "Answer every symptom",

    enterAge:
      "Enter your age",

    reviewResult:
      "Review the result",

    predictedCondition:
      "Predicted condition",

    confidence:
      "Confidence",

    confidenceLevel:
      "Confidence level",

    resultDescription:
      "The detailed prediction, probabilities and SHAP explanation are available on the result page.",

    defaultDisclaimer:
      "This result is preliminary guidance only and does not replace diagnosis or treatment from a qualified dental professional.",

    missingAnswers:
      "Please answer every question and enter your age before continuing.",

    invalidAge:
      "Please enter a valid age between 1 and 120.",

    sessionMissing:
      "Your login session could not be found. Please sign in again.",

    predictionFailed:
      "Unable to complete the symptom prediction.",

    invalidResponse:
      "The prediction service returned an invalid response.",

    processingFailed:
      "Unable to process the assessment. Please try again.",

    questions: {
      toothPain: {
        label: "Tooth Pain",
        description:
          "Pain or discomfort in one or more teeth.",
      },

      gumBleeding: {
        label: "Gum Bleeding",
        description:
          "Bleeding while brushing, flossing or eating.",
      },

      badBreath: {
        label: "Bad Breath",
        description:
          "Persistent unpleasant breath.",
      },

      mouthUlcer: {
        label: "Mouth Ulcer",
        description:
          "Painful sore or lesion inside the mouth.",
      },

      toothSensitivity: {
        label: "Tooth Sensitivity",
        description:
          "Sensitivity to hot, cold or sweet food.",
      },

      swelling: {
        label: "Swelling",
        description:
          "Swelling around the gum, cheek or jaw.",
      },

      whiteSpots: {
        label: "White Spots",
        description:
          "White patches or spots inside the mouth.",
      },

      dryMouth: {
        label: "Dry Mouth",
        description:
          "Frequent dryness or lack of saliva.",
      },

      highSugarIntake: {
        label: "High Sugar Intake",
        description:
          "Frequent intake of sweets or sugary drinks.",
      },

      smoking: {
        label: "Smoking",
        description:
          "Regular cigarette or tobacco use.",
      },

      betelChewing: {
        label: "Betel Chewing",
        description:
          "Regular use of betel, areca nut or related products.",
      },

      lowBrushingFrequency: {
        label: "Low Brushing Frequency",
        description:
          "Brushing less than twice per day.",
      },

      lowWaterIntake: {
        label: "Low Water Intake",
        description:
          "Not drinking enough water during the day.",
      },
    },
  },


  si: {
    pageTitle:
      "රෝග ලක්ෂණ පුරෝකථනය",

    breadcrumb:
      "උපකරණ පුවරුව › රෝග ලක්ෂණ පුරෝකථනය",

    heroBadge:
      "OralVista යන්ත්‍ර ඉගෙනුම් සෞඛ්‍ය ඇගයීම",

    heroTitle:
      "ඔබගේ මුඛ සෞඛ්‍ය රෝග ලක්ෂණ පරීක්ෂා කරන්න",

    heroDescription:
      "සියලු ප්‍රශ්න ප්‍රවේශමෙන් පිළිතුරු දෙන්න. ඔබගේ පිළිතුරු පුහුණු කළ යන්ත්‍ර ඉගෙනුම් ආකෘතිය මඟින් මූලික මුඛ සෞඛ්‍ය පුරෝකථනයක් ලබාදීමට භාවිතා කරයි.",

    privateAssessment:
      "පුද්ගලික ඇගයීම",

    healthInputs:
      "සෞඛ්‍ය ආදාන",

    preliminaryGuidance:
      "මූලික මගපෙන්වීම",

    assessmentProgress:
      "ඇගයීමේ ප්‍රගතිය",

    of:
      "න්",

    completed:
      "සම්පූර්ණයි",

    questionnaire:
      "සෞඛ්‍ය ප්‍රශ්නාවලිය",

    tellSymptoms:
      "ඔබගේ රෝග ලක්ෂණ අපට කියන්න",

    selectYesNo:
      "සෑම රෝග ලක්ෂණයකටම ඔව් හෝ නැත තෝරන්න.",

    yourAge:
      "ඔබගේ වයස",

    ageHelp:
      "ඔබගේ වර්තමාන වයස අවුරුදු වලින් ඇතුළත් කරන්න.",

    agePlaceholder:
      "උදා: 25",

    yes:
      "ඔව්",

    no:
      "නැත",

    resetAnswers:
      "පිළිතුරු යළි සකසන්න",

    processing:
      "ඇගයීම සැකසෙමින් පවතී...",

    predictRisk:
      "මුඛ සෞඛ්‍ය අවදානම පුරෝකථනය කරන්න",

    assessmentResult:
      "ඇගයීම් ප්‍රතිඵලය",

    predictionSummary:
      "පුරෝකථන සාරාංශය",

    resultHere:
      "ඔබගේ ප්‍රතිඵලය මෙහි පෙන්වනු ඇත",

    resultHelp:
      "සියලු ප්‍රශ්න සම්පූර්ණ කර පුරෝකථන බොත්තම ක්ලික් කර ඔබගේ ඇගයීම සකසන්න.",

    answerEverySymptom:
      "සෑම රෝග ලක්ෂණයකටම පිළිතුරු දෙන්න",

    enterAge:
      "ඔබගේ වයස ඇතුළත් කරන්න",

    reviewResult:
      "ප්‍රතිඵලය සමාලෝචනය කරන්න",

    predictedCondition:
      "පුරෝකථනය කළ තත්ත්වය",

    confidence:
      "විශ්වාසනීයතා අගය",

    confidenceLevel:
      "විශ්වාසනීයතා මට්ටම",

    resultDescription:
      "සවිස්තරාත්මක පුරෝකථනය, සම්භාවිතා සහ SHAP පැහැදිලි කිරීම ප්‍රතිඵල පිටුවේ ලබාගත හැක.",

    defaultDisclaimer:
      "මෙම ප්‍රතිඵලය මූලික මගපෙන්වීමක් පමණක් වන අතර සුදුසුකම් ලත් දන්ත වෛද්‍ය වෘත්තිකයෙකුගේ රෝග විනිශ්චය හෝ ප්‍රතිකාරය වෙනුවට භාවිතා නොකළ යුතුය.",

    missingAnswers:
      "ඉදිරියට යාමට පෙර සියලු ප්‍රශ්නවලට පිළිතුරු දී ඔබගේ වයස ඇතුළත් කරන්න.",

    invalidAge:
      "කරුණාකර 1 සහ 120 අතර වලංගු වයසක් ඇතුළත් කරන්න.",

    sessionMissing:
      "ඔබගේ පිවිසුම් සැසිය සොයාගත නොහැක. කරුණාකර නැවත පිවිසෙන්න.",

    predictionFailed:
      "රෝග ලක්ෂණ පුරෝකථනය සම්පූර්ණ කළ නොහැක.",

    invalidResponse:
      "පුරෝකථන සේවාව වලංගු නොවන ප්‍රතිචාරයක් ලබා දුන්නා.",

    processingFailed:
      "ඇගයීම සැකසීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.",

    questions: {
      toothPain: {
        label:
          "දත් වේදනාව",
        description:
          "දත් එකක හෝ කිහිපයක වේදනාව හෝ අපහසුතාව.",
      },

      gumBleeding: {
        label:
          "දත් මස් ලේ ගැලීම",
        description:
          "දත් මැදීමේදී, ෆ්ලොස් කිරීමේදී හෝ ආහාර ගැනීමේදී ලේ ගැලීම.",
      },

      badBreath: {
        label:
          "මුඛ දුර්ගන්ධය",
        description:
          "අඛණ්ඩ අප්‍රසන්න මුඛ ගඳ.",
      },

      mouthUlcer: {
        label:
          "මුඛ තුවාල",
        description:
          "මුඛය ඇතුළත වේදනාකාරී තුවාලයක් හෝ අසාමාන්‍ය තුවාලයක්.",
      },

      toothSensitivity: {
        label:
          "දත් සංවේදීතාව",
        description:
          "උණු, සීතල හෝ පැණිරස ආහාරවලට දත් සංවේදී වීම.",
      },

      swelling: {
        label:
          "ඉදිමීම",
        description:
          "දත් මස්, කම්මුල හෝ හකු වටා ඉදිමීම.",
      },

      whiteSpots: {
        label:
          "සුදු ලප",
        description:
          "මුඛය ඇතුළත සුදු පැල්ලම් හෝ ලප.",
      },

      dryMouth: {
        label:
          "වියළි මුඛය",
        description:
          "නිතර මුඛය වියළීම හෝ ලාලා අඩුවීම.",
      },

      highSugarIntake: {
        label:
          "අධික සීනි පරිභෝජනය",
        description:
          "රසකැවිලි හෝ සීනි සහිත බීම නිතර ගැනීම.",
      },

      smoking: {
        label:
          "දුම්පානය",
        description:
          "නිතර සිගරට් හෝ දුම්කොළ භාවිතය.",
      },

      betelChewing: {
        label:
          "බුලත් හපීම",
        description:
          "බුලත්, පුවක් හෝ ඒ සම්බන්ධ නිෂ්පාදන නිතර භාවිතය.",
      },

      lowBrushingFrequency: {
        label:
          "අඩු දත් මැදීමේ වාර ගණන",
        description:
          "දිනකට දෙවරකට වඩා අඩුවෙන් දත් මැදීම.",
      },

      lowWaterIntake: {
        label:
          "අඩු ජල පරිභෝජනය",
        description:
          "දවස පුරා ප්‍රමාණවත් ජලය නොබීම.",
      },
    },
  },


  ta: {
    pageTitle:
      "அறிகுறி கணிப்பு",

    breadcrumb:
      "முகப்புப் பலகை › அறிகுறி கணிப்பு",

    heroBadge:
      "OralVista இயந்திரக் கற்றல் சுகாதார மதிப்பீடு",

    heroTitle:
      "உங்கள் வாய்ச் சுகாதார அறிகுறிகளை சரிபார்க்கவும்",

    heroDescription:
      "அனைத்து கேள்விகளுக்கும் கவனமாக பதிலளிக்கவும். உங்கள் பதில்கள் பயிற்சியளிக்கப்பட்ட இயந்திரக் கற்றல் மாதிரியால் ஆரம்ப வாய்ச் சுகாதார கணிப்பை வழங்க பயன்படுத்தப்படும்.",

    privateAssessment:
      "தனிப்பட்ட மதிப்பீடு",

    healthInputs:
      "சுகாதார உள்ளீடுகள்",

    preliminaryGuidance:
      "ஆரம்ப வழிகாட்டல்",

    assessmentProgress:
      "மதிப்பீட்டு முன்னேற்றம்",

    of:
      "இல்",

    completed:
      "முடிந்தது",

    questionnaire:
      "சுகாதார கேள்வித்தாள்",

    tellSymptoms:
      "உங்கள் அறிகுறிகளை எங்களிடம் தெரிவிக்கவும்",

    selectYesNo:
      "ஒவ்வொரு அறிகுறிக்கும் ஆம் அல்லது இல்லை என்பதைத் தேர்ந்தெடுக்கவும்.",

    yourAge:
      "உங்கள் வயது",

    ageHelp:
      "உங்கள் தற்போதைய வயதை ஆண்டுகளில் உள்ளிடவும்.",

    agePlaceholder:
      "உதா: 25",

    yes:
      "ஆம்",

    no:
      "இல்லை",

    resetAnswers:
      "பதில்களை மீட்டமைக்கவும்",

    processing:
      "மதிப்பீடு செயலாக்கப்படுகிறது...",

    predictRisk:
      "வாய்ச் சுகாதார அபாயத்தை கணிக்கவும்",

    assessmentResult:
      "மதிப்பீட்டு முடிவு",

    predictionSummary:
      "கணிப்பு சுருக்கம்",

    resultHere:
      "உங்கள் முடிவு இங்கே தோன்றும்",

    resultHelp:
      "அனைத்து கேள்விகளையும் முடித்து, உங்கள் மதிப்பீட்டை செயலாக்க கணிப்பு பொத்தானை அழுத்தவும்.",

    answerEverySymptom:
      "ஒவ்வொரு அறிகுறிக்கும் பதிலளிக்கவும்",

    enterAge:
      "உங்கள் வயதை உள்ளிடவும்",

    reviewResult:
      "முடிவை பரிசீலிக்கவும்",

    predictedCondition:
      "கணிக்கப்பட்ட நிலை",

    confidence:
      "நம்பகத்தன்மை",

    confidenceLevel:
      "நம்பகத்தன்மை நிலை",

    resultDescription:
      "விரிவான கணிப்பு, சாத்தியக்கூறுகள் மற்றும் SHAP விளக்கம் முடிவு பக்கத்தில் கிடைக்கும்.",

    defaultDisclaimer:
      "இந்த முடிவு ஆரம்ப வழிகாட்டலுக்காக மட்டுமே; தகுதியான பல் மருத்துவ நிபுணரின் நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாகாது.",

    missingAnswers:
      "தொடர்வதற்கு முன் அனைத்து கேள்விகளுக்கும் பதிலளித்து உங்கள் வயதை உள்ளிடவும்.",

    invalidAge:
      "1 முதல் 120 வரை சரியான வயதை உள்ளிடவும்.",

    sessionMissing:
      "உங்கள் உள்நுழைவு அமர்வு கிடைக்கவில்லை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",

    predictionFailed:
      "அறிகுறி கணிப்பை முடிக்க முடியவில்லை.",

    invalidResponse:
      "கணிப்பு சேவை தவறான பதிலை வழங்கியது.",

    processingFailed:
      "மதிப்பீட்டை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",

    questions: {
      toothPain: {
        label:
          "பல் வலி",
        description:
          "ஒன்று அல்லது அதற்கு மேற்பட்ட பற்களில் வலி அல்லது அசௌகரியம்.",
      },

      gumBleeding: {
        label:
          "ஈறு இரத்தப்போக்கு",
        description:
          "பல் துலக்கும் போது, பல் நூல் பயன்படுத்தும் போது அல்லது உணவு உண்ணும் போது இரத்தப்போக்கு.",
      },

      badBreath: {
        label:
          "வாய் துர்நாற்றம்",
        description:
          "தொடர்ச்சியான விரும்பத்தகாத வாய் நாற்றம்.",
      },

      mouthUlcer: {
        label:
          "வாய் புண்",
        description:
          "வாயின் உள்ளே வலியுடைய புண் அல்லது காயம்.",
      },

      toothSensitivity: {
        label:
          "பல் உணர்திறன்",
        description:
          "சூடான, குளிரான அல்லது இனிப்பான உணவுகளுக்கு பற்கள் உணர்திறன் காட்டுதல்.",
      },

      swelling: {
        label:
          "வீக்கம்",
        description:
          "ஈறு, கன்னம் அல்லது தாடை பகுதியில் வீக்கம்.",
      },

      whiteSpots: {
        label:
          "வெள்ளை புள்ளிகள்",
        description:
          "வாயின் உள்ளே வெள்ளை தழும்புகள் அல்லது புள்ளிகள்.",
      },

      dryMouth: {
        label:
          "வாய் உலர்வு",
        description:
          "அடிக்கடி வாய் உலர்வு அல்லது உமிழ்நீர் குறைபாடு.",
      },

      highSugarIntake: {
        label:
          "அதிக சர்க்கரை உட்கொள்ளல்",
        description:
          "இனிப்புகள் அல்லது சர்க்கரை பானங்களை அடிக்கடி உட்கொள்ளுதல்.",
      },

      smoking: {
        label:
          "புகைப்பிடித்தல்",
        description:
          "தொடர்ச்சியான சிகரெட் அல்லது புகையிலை பயன்பாடு.",
      },

      betelChewing: {
        label:
          "வெற்றிலை மென்றல்",
        description:
          "வெற்றிலை, பாக்கு அல்லது தொடர்புடைய பொருட்களை அடிக்கடி பயன்படுத்துதல்.",
      },

      lowBrushingFrequency: {
        label:
          "குறைந்த பல் துலக்கும் பழக்கம்",
        description:
          "ஒரு நாளில் இருமுறைக்கும் குறைவாக பல் துலக்குதல்.",
      },

      lowWaterIntake: {
        label:
          "குறைந்த நீர் உட்கொள்ளல்",
        description:
          "நாள்பட்ட போதுமான அளவு தண்ணீர் குடிக்காதது.",
      },
    },
  },
};


/* =====================================================
   QUESTION DEFINITIONS
===================================================== */

const symptomQuestionKeys = [
  "toothPain",
  "gumBleeding",
  "badBreath",
  "mouthUlcer",
  "toothSensitivity",
  "swelling",
  "whiteSpots",
  "dryMouth",
  "highSugarIntake",
  "smoking",
  "betelChewing",
  "lowBrushingFrequency",
  "lowWaterIntake",
];


const createInitialAnswers = () =>
  symptomQuestionKeys.reduce(
    (answers, questionKey) => {
      answers[questionKey] = "";
      return answers;
    },
    {}
  );


/* =====================================================
   COMPONENT
===================================================== */

export default function SymptomPrediction() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] =
    useState(getStoredUser());

  const [answers, setAnswers] =
    useState(createInitialAnswers);

  const [age, setAge] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /* ===================================================
     KEEP LANGUAGE IN SYNC WITH PATIENT LAYOUT
  =================================================== */

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
      currentUser?.language
    );

  const t =
    symptomPageTranslations[
      languageCode
    ] ||
    symptomPageTranslations.en;


  const symptomQuestions =
    useMemo(
      () =>
        symptomQuestionKeys.map(
          (questionKey) => ({
            key: questionKey,
            label:
              t.questions[
                questionKey
              ].label,
            description:
              t.questions[
                questionKey
              ].description,
          })
        ),
      [t]
    );


  const answeredCount =
    useMemo(
      () =>
        Object.values(
          answers
        ).filter(
          (answer) =>
            answer === "yes" ||
            answer === "no"
        ).length,
      [answers]
    );


  const totalQuestions =
    symptomQuestionKeys.length + 1;


  const completedCount =
    answeredCount +
    (age.trim() ? 1 : 0);


  const progressPercentage =
    Math.round(
      (
        completedCount /
        totalQuestions
      ) * 100
    );


  /* ===================================================
     FORM HANDLERS
  =================================================== */

  const handleAnswer = (
    questionKey,
    answer
  ) => {
    setAnswers(
      (previous) => ({
        ...previous,
        [questionKey]:
          answer,
      })
    );

    setMessage("");
    setResult(null);
  };


  const handleReset = () => {
    setAnswers(
      createInitialAnswers()
    );

    setAge("");
    setResult(null);
    setMessage("");
  };


  const yesNoToNumber = (
    value
  ) => {
    return value === "yes"
      ? 1
      : 0;
  };


  const buildPayload = (
    parsedAge
  ) => {
    return {
      tooth_pain:
        yesNoToNumber(
          answers.toothPain
        ),

      gum_bleeding:
        yesNoToNumber(
          answers.gumBleeding
        ),

      bad_breath:
        yesNoToNumber(
          answers.badBreath
        ),

      mouth_ulcer:
        yesNoToNumber(
          answers.mouthUlcer
        ),

      tooth_sensitivity:
        yesNoToNumber(
          answers.toothSensitivity
        ),

      swelling:
        yesNoToNumber(
          answers.swelling
        ),

      white_spots:
        yesNoToNumber(
          answers.whiteSpots
        ),

      dry_mouth:
        yesNoToNumber(
          answers.dryMouth
        ),

      sugar_intake_high:
        yesNoToNumber(
          answers.highSugarIntake
        ),

      smoking:
        yesNoToNumber(
          answers.smoking
        ),

      betel_chewing:
        yesNoToNumber(
          answers.betelChewing
        ),

      brushing_frequency_low:
        yesNoToNumber(
          answers.lowBrushingFrequency
        ),

      age:
        parsedAge,

      water_intake_low:
        yesNoToNumber(
          answers.lowWaterIntake
        ),
    };
  };


  const getStoredToken = () => {
    return (
      localStorage.getItem(
        "token"
      ) ||
      localStorage.getItem(
        "authToken"
      ) ||
      localStorage.getItem(
        "patientToken"
      ) ||
      sessionStorage.getItem(
        "token"
      ) ||
      sessionStorage.getItem(
        "authToken"
      ) ||
      sessionStorage.getItem(
        "patientToken"
      )
    );
  };


  /* ===================================================
     PREDICTION
  =================================================== */

  const handlePredict = async () => {
    const unansweredQuestionExists =
      Object.values(
        answers
      ).some(
        (answer) =>
          answer !== "yes" &&
          answer !== "no"
      );


    if (
      unansweredQuestionExists ||
      !age.trim()
    ) {
      setMessage(
        t.missingAnswers
      );

      setResult(null);

      return;
    }


    const parsedAge =
      Number(age);


    if (
      Number.isNaN(
        parsedAge
      ) ||
      !Number.isInteger(
        parsedAge
      ) ||
      parsedAge < 1 ||
      parsedAge > 120
    ) {
      setMessage(
        t.invalidAge
      );

      setResult(null);

      return;
    }


    const token =
      getStoredToken();


    if (!token) {
      setMessage(
        t.sessionMissing
      );

      return;
    }


    const payload =
      buildPayload(
        parsedAge
      );


    setLoading(true);
    setMessage("");
    setResult(null);


    try {
      const response =
        await fetch(
          "http://localhost:5000/api/symptom-predictions/predict",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          t.predictionFailed
        );
      }


      if (
        !data ||
        data.success !== true
      ) {
        throw new Error(
          t.invalidResponse
        );
      }


      setResult(data);


      navigate(
        "/prediction-result",
        {
          state: {
            result:
              data,

            language:
              currentUser?.language ||
              "English",
          },
        }
      );
    } catch (error) {
      console.error(
        "Symptom prediction error:",
        error
      );

      setMessage(
        error.message ||
        t.processingFailed
      );
    } finally {
      setLoading(false);
    }
  };


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <PatientLayout
      title={
        t.pageTitle
      }
      breadcrumb={
        t.breadcrumb
      }
    >
      <div className="symptom-modern-page">

        {/* =============================================
            HERO
        ============================================== */}

        <section className="symptom-hero-banner">

          <div className="symptom-hero-overlay" />

          <div className="symptom-hero-content">

            <div className="symptom-hero-copy">

              <span className="symptom-hero-badge">
                <Sparkles
                  size={15}
                />

                {t.heroBadge}
              </span>


              <h2>
                {t.heroTitle}
              </h2>


              <p>
                {t.heroDescription}
              </p>


              <div className="symptom-hero-points">

                <span>
                  <ShieldCheck
                    size={15}
                  />

                  {
                    t.privateAssessment
                  }
                </span>


                <span>
                  <ClipboardList
                    size={15}
                  />

                  {totalQuestions}{" "}
                  {
                    t.healthInputs
                  }
                </span>


                <span>
                  <Stethoscope
                    size={15}
                  />

                  {
                    t.preliminaryGuidance
                  }
                </span>

              </div>

            </div>


            <div className="symptom-progress-card">

              <div className="symptom-progress-icon">
                <Activity
                  size={28}
                />
              </div>


              <div className="symptom-progress-information">

                <span>
                  {
                    t.assessmentProgress
                  }
                </span>


                <strong>
                  {completedCount}{" "}
                  {t.of}{" "}
                  {totalQuestions}
                </strong>


                <div className="symptom-progress-track">

                  <span
                    style={{
                      width:
                        `${progressPercentage}%`,
                    }}
                  />

                </div>


                <small>
                  {
                    progressPercentage
                  }
                  %{" "}
                  {t.completed}
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =============================================
            ALERT
        ============================================== */}

        {message && (
          <div className="symptom-alert">

            <AlertCircle
              size={19}
            />

            <span>
              {message}
            </span>

          </div>
        )}


        {/* =============================================
            MAIN CONTENT
        ============================================== */}

        <div className="symptom-content-grid">

          <section className="symptom-question-panel">

            <div className="symptom-section-heading">

              <div>

                <span>
                  {
                    t.questionnaire
                  }
                </span>

                <h3>
                  {
                    t.tellSymptoms
                  }
                </h3>

                <p>
                  {
                    t.selectYesNo
                  }
                </p>

              </div>


              <div className="symptom-heading-icon">

                <ClipboardList
                  size={23}
                />

              </div>

            </div>


            {/* ===========================================
                AGE
            ============================================ */}

            <div className="symptom-age-card">

              <div>

                <label htmlFor="patientAge">
                  {t.yourAge}
                </label>

                <p>
                  {t.ageHelp}
                </p>

              </div>


              <input
                id="patientAge"
                type="number"
                min="1"
                max="120"
                placeholder={
                  t.agePlaceholder
                }
                value={age}
                onChange={(
                  event
                ) => {
                  setAge(
                    event.target.value
                  );

                  setMessage("");
                  setResult(null);
                }}
              />

            </div>


            {/* ===========================================
                QUESTIONS
            ============================================ */}

            <div className="symptom-question-grid">

              {symptomQuestions.map(
                (
                  question,
                  index
                ) => (

                  <article
                    key={
                      question.key
                    }
                    className={`symptom-question-card ${
                      answers[
                        question.key
                      ]
                        ? "symptom-question-answered"
                        : ""
                    }`}
                  >

                    <div className="symptom-question-number">

                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    <div className="symptom-question-copy">

                      <h4>
                        {
                          question.label
                        }
                      </h4>

                      <p>
                        {
                          question.description
                        }
                      </p>

                    </div>


                    <div className="symptom-choice-group">

                      <button
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            question.key,
                            "yes"
                          )
                        }
                        className={
                          answers[
                            question.key
                          ] === "yes"
                            ? "symptom-choice symptom-choice-yes-active"
                            : "symptom-choice"
                        }
                      >
                        <CheckCircle2
                          size={16}
                        />

                        {t.yes}
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            question.key,
                            "no"
                          )
                        }
                        className={
                          answers[
                            question.key
                          ] === "no"
                            ? "symptom-choice symptom-choice-no-active"
                            : "symptom-choice"
                        }
                      >
                        {t.no}
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>


            {/* ===========================================
                FOOTER BUTTONS
            ============================================ */}

            <div className="symptom-form-footer">

              <button
                type="button"
                onClick={
                  handleReset
                }
                className="symptom-reset-button"
              >
                <RotateCcw
                  size={18}
                />

                {
                  t.resetAnswers
                }
              </button>


              <button
                type="button"
                onClick={
                  handlePredict
                }
                disabled={
                  loading
                }
                className="symptom-predict-button"
              >

                {loading
                  ? t.processing
                  : t.predictRisk}

                {!loading && (
                  <ArrowRight
                    size={18}
                  />
                )}

              </button>

            </div>

          </section>


          {/* =============================================
              RESULT PREVIEW
          ============================================== */}

          <aside className="symptom-result-panel">

            <div className="symptom-result-heading">

              <div>

                <span>
                  {
                    t.assessmentResult
                  }
                </span>

                <h3>
                  {
                    t.predictionSummary
                  }
                </h3>

              </div>


              <div className="symptom-result-icon">

                <Stethoscope
                  size={23}
                />

              </div>

            </div>


            {!result ? (

              <div className="symptom-empty-result">

                <div className="symptom-empty-illustration">

                  <Activity
                    size={42}
                  />

                </div>


                <h4>
                  {
                    t.resultHere
                  }
                </h4>


                <p>
                  {
                    t.resultHelp
                  }
                </p>


                <div className="symptom-result-checklist">

                  <span>
                    <CheckCircle2
                      size={15}
                    />

                    {
                      t.answerEverySymptom
                    }
                  </span>


                  <span>
                    <CheckCircle2
                      size={15}
                    />

                    {
                      t.enterAge
                    }
                  </span>


                  <span>
                    <CheckCircle2
                      size={15}
                    />

                    {
                      t.reviewResult
                    }
                  </span>

                </div>

              </div>

            ) : (

              <div className="symptom-result-content">

                <div className="symptom-result-status">

                  <Info
                    size={20}
                  />


                  <div>

                    <span>
                      {
                        t.predictedCondition
                      }
                    </span>


                    <strong>
                      {
                        result.prediction
                      }
                    </strong>

                  </div>

                </div>


                <div className="symptom-risk-card">

                  <span>
                    {
                      t.confidence
                    }
                  </span>


                  <strong>
                    {Number(
                      result.confidence ||
                      0
                    ).toFixed(
                      2
                    )}
                    %
                  </strong>


                  <p>
                    {
                      t.confidenceLevel
                    }
                    :{" "}
                    {
                      result.confidenceLevel
                    }
                  </p>

                </div>


                <p className="symptom-result-description">
                  {
                    t.resultDescription
                  }
                </p>


                <div className="symptom-disclaimer">

                  <ShieldCheck
                    size={18}
                  />


                  <p>
                    {
                      result.disclaimer ||
                      t.defaultDisclaimer
                    }
                  </p>

                </div>

              </div>

            )}

          </aside>

        </div>

      </div>
    </PatientLayout>
  );
}