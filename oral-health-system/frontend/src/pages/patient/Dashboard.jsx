import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  Bot,
  Camera,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";

import {
  getStoredUser,
} from "../../api/authStorage.js";

import api from "../../api/axios.js";


/* =====================================================
   MULTILINGUAL DASHBOARD CONTENT
===================================================== */

const dashboardTranslations = {
  en: {
    pageTitle: "Dashboard",
    patientPortal: "{t.patientPortal}",
    welcomeBack: "Welcome back,",
    intro:
      "Access your OralVista oral and dental-health tools, educational resources, clinic information and personalised support from one dashboard.",
    secureAccount: "Secure patient account",
    mongodbConnected: "MongoDB connected",
    startAssessment: "Start your assessment",
    checkSymptoms:
      "Check your oral and dental-health symptoms",

    predictionsMade: "Predictions Made",
    loadingPredictionHistory:
      "Loading prediction history",
    symptom: "symptom",
    image: "image",
    quizzesCompleted: "Quizzes Completed",
    lessonsPassed: "lessons passed",
    healthEducationCompleted:
      "Health education & quizzes completed",
    aiChats: "AI Chats",
    sessionOnly: "Session Only",
    questionsAsked:
      "Questions asked to the assistant",

    loading: "Loading",
    unavailable: "Unavailable",
    connected: "Connected",

    predictionStatsUnavailable:
      "Prediction statistics unavailable",
   predictionStatsUnavailableMessage:
  "Prediction statistics are temporarily unavailable.",
    tutorStatsUnavailable:
      "Tutor statistics unavailable",
    tutorStatsUnavailableMessage:
      "Tutor progress is temporarily unavailable.",
    tutorZeroMessage:
      "The dashboard currently displays zero completed quizzes.",

    communication: "Communication",
    newsletter: "Newsletter",
    subscriptionStatus: "Subscription status",
    manageWeeklyNewsletter:
      "Manage weekly OralVista oral and dental-health newsletters.",
    available: "Available",
    manageSubscription: "Manage subscription",

    dailyGuidance:
      "Daily oral and dental-health guidance",
    tipForYou: "Tip for You",
    educationalGuidanceOnly:
      "Educational guidance only",

    services: "OralVista services",
    quickActions: "Quick Actions",
    selectService:
      "Select a service to continue with your OralVista oral and dental-health journey.",
    viewProfile: "View profile",

    aiServicesStatus: "AI services status",
    aiServicesDescription:
      "Symptom prediction, image prediction, Oral and Dental Health Education & Quiz, and AI Chat Assistant are connected to the OralVista patient portal.",
    predictionRecords:
      "Prediction records for this account:",
    tutorAttempts:
      "Quiz attempts recorded for this account:",
    symptomConnected:
      "Symptom prediction connected",
    imageConnected:
      "Image analysis connected",
    clinicConnected:
      "Clinic finder connected",
    tutorConnected:
      "Education & Quiz connected",
    chatConnected:
      "Chat assistant connected",

    quickSymptomTitle: "Symptom Prediction",
    quickSymptomDescription:
      "Answer oral and dental-health questions and receive a preliminary result.",
    quickImageTitle: "Image Prediction",
    quickImageDescription:
      "Upload a dental image for AI-based image analysis.",
    quickTutorTitle:
      "Oral and Dental Health Education & Quiz",
    quickTutorDescription:
      "Learn oral and dental-health topics and complete educational quizzes.",
    quickChatTitle: "AI Chat Assistant",
    quickChatDescription:
      "Ask oral and dental-health questions and receive AI-powered guidance.",

    tip1:
      "Brush your teeth twice a day using fluoride toothpaste.",
    tip2:
      "Reduce sugary snacks and drinks between meals.",
    tip3:
      "Replace your toothbrush every three to four months.",
  },

  si: {
    pageTitle: "උපකරණ පුවරුව",
    patientPortal: "OralVista රෝගී ද්වාරය",
    welcomeBack: "නැවත සාදරයෙන් පිළිගනිමු,",
    intro:
      "එක් උපකරණ පුවරුවකින් OralVista මුඛ හා දන්ත සෞඛ්‍ය මෙවලම්, අධ්‍යාපනික සම්පත්, දන්ත සායන තොරතුරු සහ පුද්ගලීකරණය කළ සහාය ලබාගන්න.",
    secureAccount: "ආරක්ෂිත රෝගී ගිණුම",
    mongodbConnected: "MongoDB සම්බන්ධයි",
    startAssessment: "ඔබගේ ඇගයීම ආරම්භ කරන්න",
    checkSymptoms:
      "ඔබගේ මුඛ හා දන්ත සෞඛ්‍ය රෝග ලක්ෂණ පරීක්ෂා කරන්න",

    predictionsMade: "සිදු කළ පුරෝකථන",
    loadingPredictionHistory:
      "පුරෝකථන ඉතිහාසය පූරණය වෙමින් පවතී",
    symptom: "රෝග ලක්ෂණ",
    image: "රූප",
    quizzesCompleted: "සම්පූර්ණ කළ ප්‍රශ්නාවලි",
    lessonsPassed: "පාඩම් සමත්",
    healthEducationCompleted:
      "සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලි සම්පූර්ණ කර ඇත",
    aiChats: "AI කතාබස්",
    sessionOnly: "මෙම සැසියට පමණයි",
    questionsAsked:
      "AI සහායකයාගෙන් අසන ලද ප්‍රශ්න",

    loading: "පූරණය වෙමින්",
    unavailable: "ලබාගත නොහැක",
    connected: "සම්බන්ධයි",

    predictionStatsUnavailable:
      "පුරෝකථන සංඛ්‍යාලේඛන ලබාගත නොහැක",
    predictionStatsUnavailableMessage:
      "පුරෝකථන සංඛ්‍යාලේඛන තාවකාලිකව ලබාගත නොහැක.",
    tutorStatsUnavailable:
      "අධ්‍යාපන සංඛ්‍යාලේඛන ලබාගත නොහැක",
    tutorStatsUnavailableMessage:
      "අධ්‍යාපන ප්‍රගතිය තාවකාලිකව ලබාගත නොහැක.",
    tutorZeroMessage:
      "දැනට උපකරණ පුවරුවේ සම්පූර්ණ කළ ප්‍රශ්නාවලි ශූන්‍ය ලෙස පෙන්වයි.",

    communication: "සන්නිවේදනය",
    newsletter: "පුවත් පත්‍රිකාව",
    subscriptionStatus: "දායකත්ව තත්ත්වය",
    manageWeeklyNewsletter:
      "සතිපතා OralVista මුඛ හා දන්ත සෞඛ්‍ය පුවත් පත්‍රිකා කළමනාකරණය කරන්න.",
    available: "ලබාගත හැක",
    manageSubscription: "දායකත්වය කළමනාකරණය කරන්න",

    dailyGuidance:
      "දිනපතා මුඛ හා දන්ත සෞඛ්‍ය මගපෙන්වීම",
    tipForYou: "ඔබ සඳහා උපදෙසක්",
    educationalGuidanceOnly:
      "අධ්‍යාපනික මගපෙන්වීම සඳහා පමණි",

    services: "OralVista සේවා",
    quickActions: "ඉක්මන් ක්‍රියා",
    selectService:
      "ඔබගේ OralVista මුඛ හා දන්ත සෞඛ්‍ය ගමන ඉදිරියට ගෙන යාමට සේවාවක් තෝරන්න.",
    viewProfile: "පැතිකඩ බලන්න",

    aiServicesStatus: "AI සේවා තත්ත්වය",
    aiServicesDescription:
      "රෝග ලක්ෂණ පුරෝකථනය, රූප විශ්ලේෂණය, මුඛ හා දන්ත සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය, සහ AI කතාබස් සහායකයා OralVista රෝගී ද්වාරයට සම්බන්ධ කර ඇත.",
    predictionRecords:
      "මෙම ගිණුමේ පුරෝකථන වාර්තා:",
    tutorAttempts:
      "මෙම ගිණුමේ ප්‍රශ්නාවලි උත්සාහ:",
    symptomConnected:
      "රෝග ලක්ෂණ පුරෝකථනය සම්බන්ධයි",
    imageConnected:
      "රූප විශ්ලේෂණය සම්බන්ධයි",
    clinicConnected:
      "දන්ත සායන සෙවුම සම්බන්ධයි",
    tutorConnected:
      "අධ්‍යාපනය සහ ප්‍රශ්නාවලිය සම්බන්ධයි",
    chatConnected:
      "කතාබස් සහායකයා සම්බන්ධයි",

    quickSymptomTitle: "රෝග ලක්ෂණ පුරෝකථනය",
    quickSymptomDescription:
      "මුඛ හා දන්ත සෞඛ්‍ය ප්‍රශ්නවලට පිළිතුරු දී මූලික ප්‍රතිඵලයක් ලබාගන්න.",
    quickImageTitle: "රූප පුරෝකථනය",
    quickImageDescription:
      "AI රූප විශ්ලේෂණය සඳහා දන්ත රූපයක් උඩුගත කරන්න.",
    quickTutorTitle:
      "මුඛ හා දන්ත සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය",
    quickTutorDescription:
      "මුඛ හා දන්ත සෞඛ්‍ය මාතෘකා ඉගෙනගෙන අධ්‍යාපනික ප්‍රශ්නාවලි සම්පූර්ණ කරන්න.",
    quickChatTitle: "AI කතාබස් සහායක",
    quickChatDescription:
      "මුඛ හා දන්ත සෞඛ්‍ය ප්‍රශ්න අසා AI මගපෙන්වීම ලබාගන්න.",

    tip1:
      "ෆ්ලෝරයිඩ් දන්තාලේපයක් භාවිතා කර දිනකට දෙවරක් දත් මදින්න.",
    tip2:
      "ආහාර අතර සීනි සහිත කෑම හා බීම අඩු කරන්න.",
    tip3:
      "මාස තුනකට හෝ හතරකට වරක් දත් බුරුසුව මාරු කරන්න.",
  },

  ta: {
    pageTitle: "முகப்புப் பலகை",
    patientPortal: "OralVista நோயாளர் தளம்",
    welcomeBack: "மீண்டும் வரவேற்கிறோம்,",
    intro:
      "ஒரே முகப்புப் பலகையிலிருந்து OralVista வாய் மற்றும் பல் சுகாதார கருவிகள், கல்வி வளங்கள், பல் மருத்துவமனை தகவல்கள் மற்றும் தனிப்பயன் ஆதரவை அணுகுங்கள்.",
    secureAccount: "பாதுகாப்பான நோயாளர் கணக்கு",
    mongodbConnected: "MongoDB இணைக்கப்பட்டுள்ளது",
    startAssessment: "உங்கள் மதிப்பீட்டை தொடங்குங்கள்",
    checkSymptoms:
      "உங்கள் வாய் மற்றும் பல் சுகாதார அறிகுறிகளை சரிபார்க்கவும்",

    predictionsMade: "செய்யப்பட்ட கணிப்புகள்",
    loadingPredictionHistory:
      "கணிப்பு வரலாறு ஏற்றப்படுகிறது",
    symptom: "அறிகுறி",
    image: "படம்",
    quizzesCompleted: "முடிக்கப்பட்ட வினாடி வினாக்கள்",
    lessonsPassed: "பாடங்கள் தேர்ச்சி",
    healthEducationCompleted:
      "சுகாதாரக் கல்வி மற்றும் வினாடி வினாக்கள் முடிக்கப்பட்டன",
    aiChats: "AI அரட்டைகள்",
    sessionOnly: "இந்த அமர்வில் மட்டும்",
    questionsAsked:
      "AI உதவியாளரிடம் கேட்கப்பட்ட கேள்விகள்",

    loading: "ஏற்றுகிறது",
    unavailable: "கிடைக்கவில்லை",
    connected: "இணைக்கப்பட்டுள்ளது",

    predictionStatsUnavailable:
      "கணிப்பு புள்ளிவிவரங்கள் கிடைக்கவில்லை",
    predictionStatsUnavailableMessage:
      "கணிப்பு புள்ளிவிவரங்கள் தற்காலிகமாக கிடைக்கவில்லை.",
    tutorStatsUnavailable:
      "கல்வி புள்ளிவிவரங்கள் கிடைக்கவில்லை",
    tutorStatsUnavailableMessage:
      "கல்வி முன்னேற்றம் தற்காலிகமாக கிடைக்கவில்லை.",
    tutorZeroMessage:
      "முகப்புப் பலகை தற்போது முடிக்கப்பட்ட வினாடி வினாக்களை பூஜ்ஜியமாக காட்டுகிறது.",

    communication: "தொடர்பு",
    newsletter: "செய்திமடல்",
    subscriptionStatus: "சந்தா நிலை",
    manageWeeklyNewsletter:
      "வாராந்திர OralVista வாய் மற்றும் பல் சுகாதார செய்திமடல்களை நிர்வகிக்கவும்.",
    available: "கிடைக்கிறது",
    manageSubscription: "சந்தாவை நிர்வகிக்கவும்",

    dailyGuidance:
      "தினசரி வாய் மற்றும் பல் சுகாதார வழிகாட்டல்",
    tipForYou: "உங்களுக்கான குறிப்பு",
    educationalGuidanceOnly:
      "கல்வி வழிகாட்டலுக்காக மட்டும்",

    services: "OralVista சேவைகள்",
    quickActions: "விரைவு செயல்கள்",
    selectService:
      "உங்கள் OralVista வாய் மற்றும் பல் சுகாதார பயணத்தைத் தொடர ஒரு சேவையைத் தேர்ந்தெடுக்கவும்.",
    viewProfile: "சுயவிவரத்தை பார்க்கவும்",

    aiServicesStatus: "AI சேவைகளின் நிலை",
    aiServicesDescription:
      "அறிகுறி கணிப்பு, பட பகுப்பாய்வு, வாய் மற்றும் பல் சுகாதாரக் கல்வி மற்றும் வினாடி வினா, மற்றும் AI அரட்டை உதவியாளர் ஆகியவை OralVista நோயாளர் தளத்துடன் இணைக்கப்பட்டுள்ளன.",
    predictionRecords:
      "இந்த கணக்கிற்கான கணிப்பு பதிவுகள்:",
    tutorAttempts:
      "இந்த கணக்கிற்கான வினாடி வினா முயற்சிகள்:",
    symptomConnected:
      "அறிகுறி கணிப்பு இணைக்கப்பட்டுள்ளது",
    imageConnected:
      "பட பகுப்பாய்வு இணைக்கப்பட்டுள்ளது",
    clinicConnected:
      "பல் மருத்துவமனை தேடல் இணைக்கப்பட்டுள்ளது",
    tutorConnected:
      "கல்வி மற்றும் வினாடி வினா இணைக்கப்பட்டுள்ளது",
    chatConnected:
      "அரட்டை உதவியாளர் இணைக்கப்பட்டுள்ளது",

    quickSymptomTitle: "அறிகுறி கணிப்பு",
    quickSymptomDescription:
      "வாய் மற்றும் பல் சுகாதார கேள்விகளுக்கு பதிலளித்து ஆரம்ப முடிவைப் பெறுங்கள்.",
    quickImageTitle: "பட கணிப்பு",
    quickImageDescription:
      "AI பட பகுப்பாய்வுக்காக பல் படத்தை பதிவேற்றவும்.",
    quickTutorTitle:
      "வாய் மற்றும் பல் சுகாதாரக் கல்வி மற்றும் வினாடி வினா",
    quickTutorDescription:
      "வாய் மற்றும் பல் சுகாதார தலைப்புகளை கற்று கல்வி வினாடி வினாக்களை முடிக்கவும்.",
    quickChatTitle: "AI அரட்டை உதவியாளர்",
    quickChatDescription:
      "வாய் மற்றும் பல் சுகாதார கேள்விகளை கேட்டு AI வழிகாட்டலைப் பெறுங்கள்.",

    tip1:
      "ஃப்ளூரைடு பற்பசையை பயன்படுத்தி தினமும் இருமுறை பல் துலக்குங்கள்.",
    tip2:
      "உணவுகளுக்கு இடையில் சர்க்கரை நிறைந்த சிற்றுண்டிகள் மற்றும் பானங்களை குறைக்கவும்.",
    tip3:
      "மூன்று முதல் நான்கு மாதங்களுக்கு ஒருமுறை பல் துலக்கியை மாற்றவும்.",
  },
};

const quickActionDefinitions = [
  {
    to: "/symptom-prediction",
    titleKey: "quickSymptomTitle",
    descriptionKey:
      "quickSymptomDescription",
    icon: Stethoscope,
  },
  {
    to: "/image-prediction",
    titleKey: "quickImageTitle",
    descriptionKey:
      "quickImageDescription",
    icon: ImagePlus,
  },
  {
    to: "/ai-tutor",
    titleKey: "quickTutorTitle",
    descriptionKey:
      "quickTutorDescription",
    icon: BookOpenCheck,
  },
  {
    to: "/chat-assistant",
    titleKey: "quickChatTitle",
    descriptionKey:
      "quickChatDescription",
    icon: Bot,
  },
];

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
   HELPER FUNCTIONS
===================================================== */

function getFirstName(fullName = "") {
  const trimmedName =
    String(fullName).trim();

  if (!trimmedName) {
    return "Patient";
  }

  return trimmedName.split(/\s+/)[0];
}


/*
 * Different API controllers may return their arrays
 * using slightly different property names.
 *
 * This helper makes the dashboard tolerant of:
 *
 * predictions
 * history
 * records
 * data
 */
function extractPredictionArray(
  responseData
) {
  if (
    Array.isArray(
      responseData?.predictions
    )
  ) {
    return responseData.predictions;
  }

  if (
    Array.isArray(
      responseData?.history
    )
  ) {
    return responseData.history;
  }

  if (
    Array.isArray(
      responseData?.records
    )
  ) {
    return responseData.records;
  }

  if (
    Array.isArray(
      responseData?.data
    )
  ) {
    return responseData.data;
  }

  if (
    Array.isArray(responseData)
  ) {
    return responseData;
  }

  return [];
}


/* =====================================================
   DASHBOARD COMPONENT
===================================================== */

export default function Dashboard() {
  const [currentUser, setCurrentUser] =
    useState(getStoredUser());

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

  const firstName =
    getFirstName(
      currentUser?.fullName
    );

  const languageCode =
    languageNameToCode(
      currentUser?.language
    );

  const t =
    dashboardTranslations[
      languageCode
    ] ||
    dashboardTranslations.en;

  const healthTips = useMemo(
    () => [
      t.tip1,
      t.tip2,
      t.tip3,
    ],
    [t]
  );

  const currentTip =
    healthTips[0];

  const quickActions = useMemo(
    () =>
      quickActionDefinitions.map(
        (action) => ({
          ...action,
          title:
            t[action.titleKey],
          description:
            t[action.descriptionKey],
          status:
            t.connected,
        })
      ),
    [t]
  );


  /* ===================================================
     REAL PREDICTION STATISTICS
  =================================================== */

  const [
    symptomPredictionCount,
    setSymptomPredictionCount,
  ] = useState(0);


  const [
    imagePredictionCount,
    setImagePredictionCount,
  ] = useState(0);


  const [
    predictionSummaryLoading,
    setPredictionSummaryLoading,
  ] = useState(true);


  const [
    predictionSummaryError,
    setPredictionSummaryError,
  ] = useState("");


  const totalPredictions =
    symptomPredictionCount +
    imagePredictionCount;


  /* ===================================================
     REAL TUTOR STATISTICS
  =================================================== */

  const [
    quizzesCompleted,
    setQuizzesCompleted,
  ] = useState(0);


  const [
    totalQuizAttempts,
    setTotalQuizAttempts,
  ] = useState(0);


  const [
    totalTutorLessons,
    setTotalTutorLessons,
  ] = useState(8);


  const [
    tutorSummaryLoading,
    setTutorSummaryLoading,
  ] = useState(true);


  const [
    tutorSummaryError,
    setTutorSummaryError,
  ] = useState("");


  /* ===================================================
     LOAD REAL PREDICTION SUMMARY
  =================================================== */

  useEffect(() => {
    let componentIsMounted = true;


    const loadPredictionSummary =
      async () => {

        setPredictionSummaryLoading(
          true
        );

        setPredictionSummaryError("");


        try {
          /*
           * Load both AI prediction histories.
           *
           * axios.js already contains:
           *
           * http://localhost:5000/api
           *
           * and automatically attaches
           * the patient JWT.
           */

          const results =
            await Promise.allSettled([
              api.get(
                "/symptom-predictions/history"
              ),

              api.get(
                "/image-predictions/history"
              ),
            ]);


          if (!componentIsMounted) {
            return;
          }


          const symptomResult =
            results[0];

          const imageResult =
            results[1];


          /* -----------------------------
             Symptom predictions
          ----------------------------- */

          if (
            symptomResult.status ===
            "fulfilled"
          ) {
            const symptomData =
              symptomResult.value.data;

            const symptomPredictions =
              extractPredictionArray(
                symptomData
              );

            const symptomCount =
              Number(
                symptomData?.count
              );

            setSymptomPredictionCount(
              Number.isFinite(
                symptomCount
              )
                ? symptomCount
                : symptomPredictions.length
            );
          } else {
            console.error(
              "Unable to load symptom prediction history:",
              symptomResult.reason
            );

            setSymptomPredictionCount(
              0
            );
          }


          /* -----------------------------
             Image predictions
          ----------------------------- */

          if (
            imageResult.status ===
            "fulfilled"
          ) {
            const imageData =
              imageResult.value.data;

            const imagePredictions =
              extractPredictionArray(
                imageData
              );

            const imageCount =
              Number(
                imageData?.count
              );

            setImagePredictionCount(
              Number.isFinite(
                imageCount
              )
                ? imageCount
                : imagePredictions.length
            );
          } else {
            console.error(
              "Unable to load image prediction history:",
              imageResult.reason
            );

            setImagePredictionCount(
              0
            );
          }


          /*
           * If both APIs failed, show an
           * unavailable status.
           */
          if (
            symptomResult.status ===
              "rejected" &&
            imageResult.status ===
              "rejected"
          ) {
            setPredictionSummaryError(
              t.predictionStatsUnavailableMessage
            );
          }
        } catch (error) {
          console.error(
            "Unable to load prediction summary:",
            error
          );

          if (!componentIsMounted) {
            return;
          }

          setSymptomPredictionCount(
            0
          );

          setImagePredictionCount(
            0
          );

          setPredictionSummaryError(
            t.predictionStatsUnavailableMessage
          );
        } finally {
          if (componentIsMounted) {
            setPredictionSummaryLoading(
              false
            );
          }
        }
      };


    loadPredictionSummary();


    return () => {
      componentIsMounted = false;
    };
  }, []);


  /* ===================================================
     LOAD REAL TUTOR SUMMARY
  =================================================== */

  useEffect(() => {
    let componentIsMounted = true;


    const loadTutorSummary =
      async () => {

        setTutorSummaryLoading(
          true
        );

        setTutorSummaryError("");


        try {
          const response =
            await api.get(
              "/tutor/dashboard-summary"
            );


          if (!componentIsMounted) {
            return;
          }


          const summary =
            response.data?.summary ||
            {};


          setQuizzesCompleted(
            Number(
              summary.quizzesCompleted
            ) || 0
          );


          setTotalQuizAttempts(
            Number(
              summary.totalQuizAttempts
            ) || 0
          );


          setTotalTutorLessons(
            Number(
              summary.totalLessons
            ) || 8
          );
        } catch (error) {
          console.error(
            "Unable to load tutor summary:",
            error
          );


          if (!componentIsMounted) {
            return;
          }


          setQuizzesCompleted(0);

          setTotalQuizAttempts(0);

          setTotalTutorLessons(8);


          setTutorSummaryError(
            error.response?.data
              ?.message ||
            t.tutorStatsUnavailableMessage
          );
        } finally {
          if (componentIsMounted) {
            setTutorSummaryLoading(
              false
            );
          }
        }
      };


    loadTutorSummary();


    return () => {
      componentIsMounted = false;
    };
  }, []);


  /* ===================================================
     DASHBOARD STATISTICS
  =================================================== */

  const dashboardStatistics =
    useMemo(
      () => [
        {
          label:
            t.predictionsMade,

          value:
            predictionSummaryLoading
              ? "..."
              : totalPredictions,

          description:
            predictionSummaryLoading
              ? t.loadingPredictionHistory
              : `${symptomPredictionCount} ${t.symptom} • ${imagePredictionCount} ${t.image}`,

          icon:
            Stethoscope,

          iconClass:
            "patient-stat-icon-blue",

          status:
            predictionSummaryLoading
              ? t.loading
              : predictionSummaryError
                ? t.unavailable
                : t.connected,
        },

        {
          label:
            t.quizzesCompleted,

          value:
            tutorSummaryLoading
              ? "..."
              : quizzesCompleted,

          description:
            totalTutorLessons > 0
              ? `${quizzesCompleted} / ${totalTutorLessons} ${t.lessonsPassed}`
              : t.healthEducationCompleted,

          icon:
            HelpCircle,

          iconClass:
            "patient-stat-icon-purple",

          status:
            tutorSummaryLoading
              ? t.loading
              : tutorSummaryError
                ? t.unavailable
                : t.connected,
        },

        {
          label:
            t.aiChats,

          value:
            t.sessionOnly,

          description:
            t.questionsAsked,

          icon:
            MessageCircle,

          iconClass:
            "patient-stat-icon-teal",

          status:
            t.sessionOnly,
        },
      ],
      [
        t,
        predictionSummaryLoading,
        predictionSummaryError,
        totalPredictions,
        symptomPredictionCount,
        imagePredictionCount,
        quizzesCompleted,
        totalTutorLessons,
        tutorSummaryLoading,
        tutorSummaryError,
      ]
    );


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <PatientLayout
      title={t.pageTitle}
    >
      <div className="patient-dashboard-page">

        {/* =============================================
            WELCOME BANNER
        ============================================== */}

        <section className="patient-dashboard-welcome">

          <div className="patient-dashboard-welcome-overlay" />

          <div className="patient-dashboard-welcome-decoration patient-dashboard-decoration-one" />

          <div className="patient-dashboard-welcome-decoration patient-dashboard-decoration-two" />


          <div className="patient-dashboard-welcome-content">

            <div className="patient-dashboard-welcome-copy">

              <span className="patient-dashboard-eyebrow">

                <Sparkles size={15} />

                OralVista patient portal

              </span>


              <h2>
                {t.welcomeBack}{" "}

                <span>
                  {firstName}
                </span>

                <span
                  className="patient-dashboard-wave"
                  role="img"
                  aria-label="Waving hand"
                >
                  👋
                </span>
              </h2>


              <p>
                {t.intro}
              </p>


              <div className="patient-dashboard-welcome-pills">

                <span>
                  <ShieldCheck
                    size={15}
                  />

                  {t.secureAccount}
                </span>


                <span>
                  <CheckCircle2
                    size={15}
                  />

                  {t.mongodbConnected}
                </span>

              </div>

            </div>


            <div className="patient-dashboard-welcome-action">

              <div className="patient-dashboard-action-icon">
                <Stethoscope
                  size={27}
                />
              </div>


              <div>
                <small>
                  {t.startAssessment}
                </small>

                <strong>
                  {t.checkSymptoms}
                </strong>
              </div>


              <Link
                to="/symptom-prediction"
                aria-label="Open symptom prediction"
              >
                <ArrowRight
                  size={19}
                />
              </Link>

            </div>

          </div>

        </section>


        {/* =============================================
            STATISTICS
        ============================================== */}

        <section className="patient-dashboard-stat-grid">

          {dashboardStatistics.map(
            (statistic) => {

              const Icon =
                statistic.icon;


              return (
                <article
                  key={statistic.label}
                  className="patient-dashboard-stat-card"
                >

                  <div
                    className={`patient-dashboard-stat-icon ${statistic.iconClass}`}
                  >
                    <Icon size={23} />
                  </div>


                  <div className="patient-dashboard-stat-information">

                    <p>
                      {statistic.label}
                    </p>

                    <strong>
                      {statistic.value}
                    </strong>

                    <span>
                      {
                        statistic.description
                      }
                    </span>

                  </div>


                  <span className="patient-dashboard-stat-status">
                    {
                      statistic.status
                    }
                  </span>

                </article>
              );
            }
          )}

        </section>


        {/* =============================================
            PREDICTION ERROR NOTICE
        ============================================== */}

        {predictionSummaryError && (
          <section className="patient-dashboard-development">

            <div className="patient-dashboard-development-icon">
              <Stethoscope
                size={21}
              />
            </div>


            <div>
              <strong>
                {t.predictionStatsUnavailable}
              </strong>

              <p>
                {
                  predictionSummaryError
                }
              </p>
            </div>

          </section>
        )}


        {/* =============================================
            TUTOR ERROR NOTICE
        ============================================== */}

        {tutorSummaryError && (
          <section className="patient-dashboard-development">

            <div className="patient-dashboard-development-icon">
              <HelpCircle
                size={21}
              />
            </div>


            <div>
              <strong>
                {t.tutorStatsUnavailable}
              </strong>

              <p>
                {tutorSummaryError}
                {" "}
                {t.tutorZeroMessage}
              </p>
            </div>

          </section>
        )}


        {/* =============================================
            MIDDLE CARDS
        ============================================== */}

        <section className="patient-dashboard-middle-grid">

          <article className="patient-dashboard-newsletter-card">

            <div className="patient-dashboard-card-heading">

              <div>

                <span className="patient-dashboard-section-label">
                  {t.communication}
                </span>

                <h3>
                  {t.newsletter}
                </h3>

              </div>


              <div className="patient-dashboard-card-icon">
                <Bell size={20} />
              </div>

            </div>


            <div className="patient-dashboard-subscription">

              <div>

                <strong>
                  {t.subscriptionStatus}
                </strong>

                <p>
                  {t.manageWeeklyNewsletter}
                </p>

              </div>


              <span>
                {t.available}
              </span>

            </div>


            <Link
              to="/newsletter"
              className="patient-dashboard-secondary-button"
            >
              {t.manageSubscription}

              <ArrowRight
                size={15}
              />
            </Link>

          </article>


          <article className="patient-dashboard-tip-card">

            <div className="patient-dashboard-tip-decoration" />


            <div className="patient-dashboard-card-heading">

              <div>

                <span className="patient-dashboard-section-label">
                  {t.dailyGuidance}
                </span>

                <h3>
                  {t.tipForYou}
                </h3>

              </div>


              <div className="patient-dashboard-tip-icon">
                <Sparkles
                  size={20}
                />
              </div>

            </div>


            <p className="patient-dashboard-tip-text">
              {currentTip}
            </p>


            <div className="patient-dashboard-tip-footer">

              <div className="patient-dashboard-tip-dots">

                {healthTips.map(
                  (tip, index) => (
                    <span
                      key={tip}
                      className={
                        index === 0
                          ? "patient-dashboard-tip-dot-active"
                          : ""
                      }
                    />
                  )
                )}

              </div>


              <small>
                {t.educationalGuidanceOnly}
              </small>

            </div>

          </article>

        </section>


        {/* =============================================
            QUICK ACTIONS
        ============================================== */}

        <section className="patient-dashboard-quick-section">

          <div className="patient-dashboard-section-heading">

            <div>

              <span className="patient-dashboard-section-label">
                {t.services}
              </span>

              <h3>
                {t.quickActions}
              </h3>

              <p>
                {t.selectService}
              </p>

            </div>


            <Link
              to="/profile"
              className="patient-dashboard-profile-link"
            >
              {t.viewProfile}

              <ArrowRight
                size={15}
              />
            </Link>

          </div>


          <div className="patient-dashboard-quick-grid">

            {quickActions.map(
              (action) => {

                const Icon =
                  action.icon;


                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="patient-dashboard-quick-card"
                  >

                    <div className="patient-dashboard-quick-card-top">

                      <div className="patient-dashboard-quick-icon">
                        <Icon
                          size={22}
                        />
                      </div>


                      <ArrowRight
                        size={17}
                        className="patient-dashboard-quick-arrow"
                      />

                    </div>


                    <h4>
                      {action.title}
                    </h4>


                    <p>
                      {action.description}
                    </p>


                    <span>
                      {action.status}
                    </span>

                  </Link>
                );
              }
            )}

          </div>

        </section>


        {/* =============================================
            SYSTEM STATUS
        ============================================== */}

        <section className="patient-dashboard-development">

          <div className="patient-dashboard-development-icon">
            <Camera size={21} />
          </div>


          <div>

            <strong>
              {t.aiServicesStatus}
            </strong>


            <p>
              {t.aiServicesDescription}
            </p>


            <p>
              {t.predictionRecords}{" "}

              <strong>
                {
                  predictionSummaryLoading
                    ? "..."
                    : totalPredictions
                }
              </strong>

              {" "}
              (
              {
                symptomPredictionCount
              }{" "}
              symptom,{" "}
              {
                imagePredictionCount
              }{" "}
              image
              ).
            </p>


            <p>
              {t.tutorAttempts}{" "}

              <strong>
                {totalQuizAttempts}
              </strong>
            </p>

          </div>


          <div className="patient-dashboard-development-tags">

            <span>
              <Stethoscope
                size={13}
              />

              {t.symptomConnected}
            </span>


            <span>
              <ImagePlus
                size={13}
              />

              {t.imageConnected}
            </span>


            <span>
              <MapPin
                size={13}
              />

              {t.clinicConnected}
            </span>


            <span>
              <BookOpenCheck
                size={13}
              />

              {t.tutorConnected}
            </span>


            <span>
              <Bot
                size={13}
              />

              {t.chatConnected}
            </span>

          </div>

        </section>

      </div>
    </PatientLayout>
  );
}