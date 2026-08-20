import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BellRing,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  LoaderCircle,
  Mail,
  MailCheck,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  X,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";

import {
  getNewsletterSubscription,
  getPublishedNewsletters,
  updateNewsletterSubscription,
} from "../../services/newsletterService.js";

import {
  getStoredUser,
  updateStoredUser,
} from "../../api/authStorage.js";

import "./Newsletter.css";


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
   TRANSLATIONS
===================================================== */

const newsletterTranslations = {
  en: {
    pageTitle: "Newsletter",
    breadcrumb: "Dashboard › Newsletter",

    patientFallback: "Patient",

    heroBadge: "OralVista health newsletter",
    heroTitle: "Better oral-health guidance, delivered to you",
    heroDescription:
      "Receive useful dental tips, preventive-care guidance, healthy-lifestyle information and important oral-health reminders.",
    personalisedEmail: "Personalised email",
    weeklyGuidance: "Weekly guidance",
    secureSubscription: "Secure subscription",

    subscriptionStatus: "Subscription status",
    subscribed: "Subscribed",
    notSubscribed: "Not subscribed",
    preferencesActive: "Your newsletter preferences are active.",
    subscribeForUpdates: "Subscribe to receive OralVista updates.",

    newsletterSubscription: "Newsletter subscription",
    stayInformed: "Stay informed",
    managePreference:
      "Manage your newsletter email preference from one place.",

    loadingSubscription: "Loading subscription",
    retrievingInformation:
      "Retrieving your newsletter information.",

    emailAddress: "Email address",
    active: "Active",
    inactive: "Inactive",
    registeredEmailHelp:
      "Your registered email is loaded automatically from your OralVista account.",

    yourPreference: "Your preference",
    currentlySubscribed:
      "You are currently subscribed to OralVista newsletter updates.",
    currentlyNotSubscribed:
      "You are not currently subscribed to newsletter updates.",

    unsubscribe: "Unsubscribe",
    saving: "Saving...",
    subscribeNow: "Subscribe now",

    whatYouWillReceive: "What you will receive",
    usefulHealthContent: "Useful health content",
    contentSupport:
      "Content designed to support better oral-health decisions.",

    weeklyDentalTips: "Weekly dental tips",
    weeklyDentalTipsDescription:
      "Simple oral-health guidance and preventive-care advice.",

    healthyLifestyleGuidance: "Healthy lifestyle guidance",
    healthyLifestyleDescription:
      "Food, brushing habits and routines that support healthy teeth.",

    importantReminders: "Important reminders",
    importantRemindersDescription:
      "Useful reminders about check-ups and oral-health activities.",

    newsletterLibrary: "Newsletter library",
    previousNewsletters: "Previous newsletters",
    libraryDescription:
      "Read newsletters published by the OralVista administrator.",

    loadingNewsletters: "Loading newsletters",
    noNewsletters: "No newsletters published yet",
    noNewslettersDescription:
      "Published OralVista newsletters will appear here when the administrator releases them.",
    checkAgainLater: "Please check again later",

    published: "Published",
    readNewsletter: "Read newsletter",

    publishedNewsletter: "Published newsletter",
    summary: "Summary",
    closeNewsletter: "Close newsletter",

    dateUnavailable: "Date unavailable",

    unableLoad:
      "Unable to load newsletter information.",
    subscriptionActivated:
      "Newsletter subscription activated.",
    subscriptionCancelled:
      "Newsletter subscription cancelled.",
    unableUpdate:
      "Unable to update your newsletter subscription.",
    emailUnavailable:
      "Your registered email address is unavailable.",
  },


  si: {
    pageTitle: "මුඛ හා දන්ත සෞඛ්‍ය පුවත්පත",
    breadcrumb: "උපකරණ පුවරුව › මුඛ හා දන්ත සෞඛ්‍ය පුවත්පත",

    patientFallback: "රෝගියා",

    heroBadge: "OralVista සෞඛ්‍ය පුවත්පත",
    heroTitle: "වඩා හොඳ මුඛ සෞඛ්‍ය මගපෙන්වීම ඔබ වෙත",
    heroDescription:
      "ප්‍රයෝජනවත් දන්ත උපදෙස්, වැළැක්වීමේ මගපෙන්වීම, සෞඛ්‍ය සම්පන්න ජීවන රටා තොරතුරු සහ වැදගත් මුඛ සෞඛ්‍ය මතක් කිරීම් ලබාගන්න.",
    personalisedEmail: "පුද්ගලීකරණය කළ ඊමේල්",
    weeklyGuidance: "සතිපතා මගපෙන්වීම",
    secureSubscription: "ආරක්ෂිත දායකත්වය",

    subscriptionStatus: "දායකත්ව තත්ත්වය",
    subscribed: "දායක වී ඇත",
    notSubscribed: "දායක වී නොමැත",
    preferencesActive: "ඔබගේ පුවත්පත් මනාප සක්‍රීයයි.",
    subscribeForUpdates: "OralVista යාවත්කාලීන ලබාගැනීමට දායක වන්න.",

    newsletterSubscription: "පුවත්පත් දායකත්වය",
    stayInformed: "දැනුවත්ව සිටින්න",
    managePreference:
      "ඔබගේ පුවත්පත් ඊමේල් මනාපය එකම ස්ථානයකින් කළමනාකරණය කරන්න.",

    loadingSubscription: "දායකත්වය පූරණය වෙමින්",
    retrievingInformation:
      "ඔබගේ පුවත්පත් තොරතුරු ලබාගනිමින් පවතී.",

    emailAddress: "ඊමේල් ලිපිනය",
    active: "සක්‍රීය",
    inactive: "අක්‍රීය",
    registeredEmailHelp:
      "ඔබගේ ලියාපදිංචි ඊමේල් ලිපිනය OralVista ගිණුමෙන් ස්වයංක්‍රීයව පූරණය වේ.",

    yourPreference: "ඔබගේ මනාපය",
    currentlySubscribed:
      "ඔබ දැනට OralVista පුවත්පත් යාවත්කාලීන සඳහා දායක වී ඇත.",
    currentlyNotSubscribed:
      "ඔබ දැනට පුවත්පත් යාවත්කාලීන සඳහා දායක වී නොමැත.",

    unsubscribe: "දායකත්වය අවලංගු කරන්න",
    saving: "සුරකිමින්...",
    subscribeNow: "දැන් දායක වන්න",

    whatYouWillReceive: "ඔබට ලැබෙන දේ",
    usefulHealthContent: "ප්‍රයෝජනවත් සෞඛ්‍ය අන්තර්ගතය",
    contentSupport:
      "වඩා හොඳ මුඛ සෞඛ්‍ය තීරණ ගැනීමට සහාය වන අන්තර්ගතය.",

    weeklyDentalTips: "සතිපතා දන්ත උපදෙස්",
    weeklyDentalTipsDescription:
      "සරල මුඛ සෞඛ්‍ය මගපෙන්වීම සහ වැළැක්වීමේ උපදෙස්.",

    healthyLifestyleGuidance: "සෞඛ්‍ය සම්පන්න ජීවන රටා මගපෙන්වීම",
    healthyLifestyleDescription:
      "සෞඛ්‍ය සම්පන්න දත් සඳහා ආහාර, දත් මැදීමේ පුරුදු සහ දෛනික රටාවන්.",

    importantReminders: "වැදගත් මතක් කිරීම්",
    importantRemindersDescription:
      "පරීක්ෂණ සහ මුඛ සෞඛ්‍ය ක්‍රියාකාරකම් පිළිබඳ ප්‍රයෝජනවත් මතක් කිරීම්.",

    newsletterLibrary: "පුවත්පත් පුස්තකාලය",
    previousNewsletters: "පෙර පුවත්පත්",
    libraryDescription:
      "OralVista පරිපාලකයා විසින් ප්‍රකාශිත පුවත්පත් කියවන්න.",

    loadingNewsletters: "පුවත්පත් පූරණය වෙමින්",
    noNewsletters: "තවමත් පුවත්පත් ප්‍රකාශයට පත් කර නැත",
    noNewslettersDescription:
      "පරිපාලකයා පුවත්පත් ප්‍රකාශයට පත් කළ විට ඒවා මෙහි පෙන්වනු ඇත.",
    checkAgainLater: "කරුණාකර පසුව නැවත පරීක්ෂා කරන්න",

    published: "ප්‍රකාශිත",
    readNewsletter: "පුවත්පත කියවන්න",

    publishedNewsletter: "ප්‍රකාශිත පුවත්පත",
    summary: "සාරාංශය",
    closeNewsletter: "පුවත්පත වසන්න",

    dateUnavailable: "දිනය ලබාගත නොහැක",

    unableLoad:
      "පුවත්පත් තොරතුරු පූරණය කළ නොහැක.",
    subscriptionActivated:
      "පුවත්පත් දායකත්වය සක්‍රීය කර ඇත.",
    subscriptionCancelled:
      "පුවත්පත් දායකත්වය අවලංගු කර ඇත.",
    unableUpdate:
      "ඔබගේ පුවත්පත් දායකත්වය යාවත්කාලීන කළ නොහැක.",
    emailUnavailable:
      "ඔබගේ ලියාපදිංචි ඊමේල් ලිපිනය ලබාගත නොහැක.",
  },


  ta: {
    pageTitle: "வாய் மற்றும் பல் சுகாதார செய்திமடல்",
    breadcrumb: "முகப்புப் பலகை › வாய் மற்றும் பல் சுகாதார செய்திமடல்",

    patientFallback: "நோயாளர்",

    heroBadge: "OralVista சுகாதார செய்திமடல்",
    heroTitle: "சிறந்த வாய்ச் சுகாதார வழிகாட்டல் உங்களுக்காக",
    heroDescription:
      "பயனுள்ள பல் பராமரிப்பு குறிப்புகள், தடுப்பு பராமரிப்பு வழிகாட்டல், ஆரோக்கியமான வாழ்க்கைமுறை தகவல்கள் மற்றும் முக்கிய வாய்ச் சுகாதார நினைவூட்டல்களைப் பெறுங்கள்.",
    personalisedEmail: "தனிப்பயன் மின்னஞ்சல்",
    weeklyGuidance: "வாராந்திர வழிகாட்டல்",
    secureSubscription: "பாதுகாப்பான சந்தா",

    subscriptionStatus: "சந்தா நிலை",
    subscribed: "சந்தா செயலில் உள்ளது",
    notSubscribed: "சந்தா செய்யப்படவில்லை",
    preferencesActive: "உங்கள் செய்திமடல் விருப்பங்கள் செயலில் உள்ளன.",
    subscribeForUpdates: "OralVista புதுப்பிப்புகளைப் பெற சந்தா செய்யுங்கள்.",

    newsletterSubscription: "செய்திமடல் சந்தா",
    stayInformed: "தகவலுடன் இருங்கள்",
    managePreference:
      "உங்கள் செய்திமடல் மின்னஞ்சல் விருப்பத்தை ஒரே இடத்தில் நிர்வகிக்கவும்.",

    loadingSubscription: "சந்தா ஏற்றப்படுகிறது",
    retrievingInformation:
      "உங்கள் செய்திமடல் தகவல் பெறப்படுகிறது.",

    emailAddress: "மின்னஞ்சல் முகவரி",
    active: "செயலில்",
    inactive: "செயலில் இல்லை",
    registeredEmailHelp:
      "உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் OralVista கணக்கிலிருந்து தானாக ஏற்றப்படுகிறது.",

    yourPreference: "உங்கள் விருப்பம்",
    currentlySubscribed:
      "நீங்கள் தற்போது OralVista செய்திமடல் புதுப்பிப்புகளுக்கு சந்தா செய்துள்ளீர்கள்.",
    currentlyNotSubscribed:
      "நீங்கள் தற்போது செய்திமடல் புதுப்பிப்புகளுக்கு சந்தா செய்யவில்லை.",

    unsubscribe: "சந்தாவை ரத்து செய்யவும்",
    saving: "சேமிக்கப்படுகிறது...",
    subscribeNow: "இப்போது சந்தா செய்யவும்",

    whatYouWillReceive: "நீங்கள் பெறுவது",
    usefulHealthContent: "பயனுள்ள சுகாதார உள்ளடக்கம்",
    contentSupport:
      "சிறந்த வாய்ச் சுகாதார முடிவுகளை எடுக்க உதவும் உள்ளடக்கம்.",

    weeklyDentalTips: "வாராந்திர பல் பராமரிப்பு குறிப்புகள்",
    weeklyDentalTipsDescription:
      "எளிய வாய்ச் சுகாதார வழிகாட்டல் மற்றும் தடுப்பு பராமரிப்பு ஆலோசனைகள்.",

    healthyLifestyleGuidance: "ஆரோக்கியமான வாழ்க்கைமுறை வழிகாட்டல்",
    healthyLifestyleDescription:
      "ஆரோக்கியமான பற்களுக்கு உணவு, பல் துலக்கும் பழக்கங்கள் மற்றும் தினசரி நடைமுறைகள்.",

    importantReminders: "முக்கிய நினைவூட்டல்கள்",
    importantRemindersDescription:
      "பல் பரிசோதனைகள் மற்றும் வாய்ச் சுகாதார செயல்பாடுகள் பற்றிய பயனுள்ள நினைவூட்டல்கள்.",

    newsletterLibrary: "செய்திமடல் நூலகம்",
    previousNewsletters: "முந்தைய செய்திமடல்கள்",
    libraryDescription:
      "OralVista நிர்வாகியால் வெளியிடப்பட்ட செய்திமடல்களைப் படிக்கவும்.",

    loadingNewsletters: "செய்திமடல்கள் ஏற்றப்படுகின்றன",
    noNewsletters: "இன்னும் செய்திமடல்கள் வெளியிடப்படவில்லை",
    noNewslettersDescription:
      "நிர்வாகி செய்திமடலை வெளியிடும்போது அது இங்கே தோன்றும்.",
    checkAgainLater: "பின்னர் மீண்டும் பார்க்கவும்",

    published: "வெளியிடப்பட்டது",
    readNewsletter: "செய்திமடலைப் படிக்கவும்",

    publishedNewsletter: "வெளியிடப்பட்ட செய்திமடல்",
    summary: "சுருக்கம்",
    closeNewsletter: "செய்திமடலை மூடவும்",

    dateUnavailable: "தேதி கிடைக்கவில்லை",

    unableLoad:
      "செய்திமடல் தகவலை ஏற்ற முடியவில்லை.",
    subscriptionActivated:
      "செய்திமடல் சந்தா செயல்படுத்தப்பட்டது.",
    subscriptionCancelled:
      "செய்திமடல் சந்தா ரத்து செய்யப்பட்டது.",
    unableUpdate:
      "உங்கள் செய்திமடல் சந்தாவை புதுப்பிக்க முடியவில்லை.",
    emailUnavailable:
      "உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் முகவரி கிடைக்கவில்லை.",
  },
};


/* =====================================================
   DYNAMIC NEWSLETTER LOCALIZATION
===================================================== */

/*
  This page supports translated newsletters if your backend
  later returns data in this form:

  newsletter.translations = {
    si: {
      title: "...",
      summary: "...",
      content: "...",
    },
    ta: {
      title: "...",
      summary: "...",
      content: "...",
    },
  };

  If translations are not present, the original newsletter
  title/summary/content is displayed safely.
*/

const localizeNewsletter = (
  newsletter,
  languageCode
) => {
  if (!newsletter) {
    return null;
  }

  if (languageCode === "en") {
    return newsletter;
  }

  const translated =
    newsletter.translations?.[
      languageCode
    ];

  if (!translated) {
    return newsletter;
  }

  return {
    ...newsletter,
    ...translated,
  };
};


/* =====================================================
   COMPONENT
===================================================== */

export default function Newsletter() {
  const storedUser =
    getStoredUser();

  const [currentUser, setCurrentUser] =
    useState(storedUser);

  const [email, setEmail] =
    useState(
      storedUser?.email || ""
    );

  const [subscribed, setSubscribed] =
    useState(false);

  const [newsletters, setNewsletters] =
    useState([]);

  const [
    selectedNewsletter,
    setSelectedNewsletter,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });


  /* ===================================================
     LANGUAGE STATE
  =================================================== */

  useEffect(() => {
    const refreshCurrentUser = () => {
      const user =
        getStoredUser();

      setCurrentUser(user);

      if (user?.email) {
        setEmail(user.email);
      }
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
    newsletterTranslations[
      languageCode
    ] ||
    newsletterTranslations.en;


  const firstName =
    useMemo(() => {
      const fullName =
        currentUser?.fullName?.trim();

      return fullName
        ? fullName.split(" ")[0]
        : t.patientFallback;
    }, [
      currentUser,
      t.patientFallback,
    ]);


  const newsletterBenefits =
    useMemo(
      () => [
        {
          title:
            t.weeklyDentalTips,
          description:
            t.weeklyDentalTipsDescription,
          icon:
            HeartPulse,
        },

        {
          title:
            t.healthyLifestyleGuidance,
          description:
            t.healthyLifestyleDescription,
          icon:
            BookOpen,
        },

        {
          title:
            t.importantReminders,
          description:
            t.importantRemindersDescription,
          icon:
            BellRing,
        },
      ],
      [t]
    );


  const formatDate = (value) => {
    if (!value) {
      return t.dateUnavailable;
    }

    const locale =
      languageCode === "si"
        ? "si-LK"
        : languageCode === "ta"
          ? "ta-LK"
          : "en-LK";

    try {
      return new Intl.DateTimeFormat(
        locale,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ).format(
        new Date(value)
      );
    } catch {
      return new Intl.DateTimeFormat(
        "en-LK",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ).format(
        new Date(value)
      );
    }
  };


  /* ===================================================
     LOAD NEWSLETTER PAGE
  =================================================== */

  const loadNewsletterPage =
    async () => {
      try {
        setLoading(true);

        setMessage({
          type: "",
          text: "",
        });

        const [
          subscriptionResponse,
          newslettersResponse,
        ] = await Promise.all([
          getNewsletterSubscription(),
          getPublishedNewsletters(),
        ]);

        const subscription =
          subscriptionResponse?.subscription;

        const isSubscribed =
          Boolean(
            subscription?.subscribed
          );

        setSubscribed(
          isSubscribed
        );

        setEmail(
          subscription?.email ||
            getStoredUser()?.email ||
            ""
        );

        setCurrentUser(
          (previous) => {
            const updatedUser = {
              ...(previous || {}),
              email:
                subscription?.email ||
                previous?.email ||
                "",
              newsletterSubscribed:
                isSubscribed,
            };

            updateStoredUser(
              updatedUser
            );

            return updatedUser;
          }
        );

        setNewsletters(
          newslettersResponse?.newsletters ||
            []
        );
      } catch (error) {
        console.error(
          "Unable to load newsletter page:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            t.unableLoad,
        });
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadNewsletterPage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* ===================================================
     SUBSCRIPTION
  =================================================== */

  const updateSubscription =
    async (nextStatus) => {
      try {
        setSaving(true);

        setMessage({
          type: "",
          text: "",
        });

        const response =
          await updateNewsletterSubscription(
            nextStatus
          );

        const subscription =
          response?.subscription;

        const isSubscribed =
          Boolean(
            subscription?.subscribed
          );

        setSubscribed(
          isSubscribed
        );

        setEmail(
          subscription?.email ||
            email
        );

        setCurrentUser(
          (previous) => {
            const updatedUser = {
              ...(previous || {}),
              email:
                subscription?.email ||
                previous?.email ||
                "",
              newsletterSubscribed:
                isSubscribed,
            };

            updateStoredUser(
              updatedUser
            );

            window.dispatchEvent(
              new Event(
                "storage"
              )
            );

            return updatedUser;
          }
        );

        setMessage({
          type: "success",
          text:
            nextStatus
              ? t.subscriptionActivated
              : t.subscriptionCancelled,
        });
      } catch (error) {
        console.error(
          "Newsletter subscription update error:",
          error
        );

        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            t.unableUpdate,
        });
      } finally {
        setSaving(false);
      }
    };


  const handleSubscribe =
    async (event) => {
      event.preventDefault();

      if (!email.trim()) {
        setMessage({
          type: "error",
          text:
            t.emailUnavailable,
        });

        return;
      }

      await updateSubscription(
        true
      );
    };


  const handleUnsubscribe =
    async () => {
      await updateSubscription(
        false
      );
    };


  /* ===================================================
     LOCALIZED SELECTED NEWSLETTER
  =================================================== */

  const localizedSelectedNewsletter =
    useMemo(
      () =>
        localizeNewsletter(
          selectedNewsletter,
          languageCode
        ),
      [
        selectedNewsletter,
        languageCode,
      ]
    );


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <PatientLayout
      title={t.pageTitle}
      breadcrumb={t.breadcrumb}
    >
      <div className="pn-page">

        {/* =============================================
            HERO
        ============================================== */}

        <section className="pn-hero">

          <div className="pn-hero-glow pn-hero-glow-one" />

          <div className="pn-hero-glow pn-hero-glow-two" />


          <div className="pn-hero-content">

            <div className="pn-hero-copy">

              <span className="pn-badge">
                <Sparkles
                  size={16}
                />

                {t.heroBadge}
              </span>


              <h2>
                {t.heroTitle}
              </h2>


              <p>
                {t.heroDescription}
              </p>


              <div className="pn-hero-tags">

                <span>
                  <MailCheck
                    size={15}
                  />

                  {t.personalisedEmail}
                </span>


                <span>
                  <CalendarDays
                    size={15}
                  />

                  {t.weeklyGuidance}
                </span>


                <span>
                  <ShieldCheck
                    size={15}
                  />

                  {t.secureSubscription}
                </span>

              </div>

            </div>


            <div className="pn-hero-status">

              <div className="pn-hero-status-icon">

                {subscribed ? (
                  <MailCheck
                    size={30}
                  />
                ) : (
                  <Mail
                    size={30}
                  />
                )}

              </div>


              <div>

                <small>
                  {t.subscriptionStatus}
                </small>


                <strong>
                  {subscribed
                    ? t.subscribed
                    : t.notSubscribed}
                </strong>


                <span>
                  {subscribed
                    ? t.preferencesActive
                    : t.subscribeForUpdates}
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =============================================
            MESSAGE
        ============================================== */}

        {message.text && (
          <div
            className={`pn-message ${
              message.type ===
              "success"
                ? "pn-message-success"
                : "pn-message-error"
            }`}
          >

            {message.type ===
            "success" ? (
              <CheckCircle2
                size={18}
              />
            ) : (
              <AlertCircle
                size={18}
              />
            )}

            <span>
              {message.text}
            </span>

          </div>
        )}


        {/* =============================================
            SUBSCRIPTION + BENEFITS
        ============================================== */}

        <section className="pn-main-grid">

          <article className="pn-subscription-card">

            <div className="pn-section-heading">

              <div>

                <span>
                  {
                    t.newsletterSubscription
                  }
                </span>


                <h3>
                  {t.stayInformed},{" "}
                  {firstName}
                </h3>


                <p>
                  {t.managePreference}
                </p>

              </div>


              <div className="pn-heading-icon">
                <Send
                  size={24}
                />
              </div>

            </div>


            {loading ? (

              <div className="pn-loading">

                <LoaderCircle
                  size={30}
                  className="pn-spinner"
                />


                <strong>
                  {
                    t.loadingSubscription
                  }
                </strong>


                <span>
                  {
                    t.retrievingInformation
                  }
                </span>

              </div>

            ) : (

              <form
                className="pn-form"
                onSubmit={
                  handleSubscribe
                }
              >

                <label>

                  <span>
                    {t.emailAddress}
                  </span>


                  <div className="pn-email-box">

                    <Mail
                      size={20}
                    />


                    <input
                      type="email"
                      value={email}
                      readOnly
                    />


                    <small
                      className={
                        subscribed
                          ? "pn-status-active"
                          : "pn-status-inactive"
                      }
                    >

                      {subscribed ? (
                        <CheckCircle2
                          size={13}
                        />
                      ) : (
                        <Clock3
                          size={13}
                        />
                      )}


                      {subscribed
                        ? t.active
                        : t.inactive}

                    </small>

                  </div>


                  <p>
                    {
                      t.registeredEmailHelp
                    }
                  </p>

                </label>


                <div className="pn-preference">

                  <div className="pn-preference-icon">
                    <UserCheck
                      size={21}
                    />
                  </div>


                  <div>

                    <strong>
                      {
                        t.yourPreference
                      }
                    </strong>


                    <p>
                      {subscribed
                        ? t.currentlySubscribed
                        : t.currentlyNotSubscribed}
                    </p>

                  </div>

                </div>


                <div className="pn-actions">

                  {subscribed && (
                    <button
                      type="button"
                      className="pn-unsubscribe-button"
                      onClick={
                        handleUnsubscribe
                      }
                      disabled={saving}
                    >
                      {t.unsubscribe}
                    </button>
                  )}


                  <button
                    type="submit"
                    className="pn-subscribe-button"
                    disabled={
                      saving ||
                      subscribed
                    }
                  >

                    {saving ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="pn-spinner"
                        />

                        {t.saving}
                      </>
                    ) : subscribed ? (
                      <>
                        <CheckCircle2
                          size={18}
                        />

                        {t.subscribed}
                      </>
                    ) : (
                      <>
                        <Send
                          size={18}
                        />

                        {t.subscribeNow}
                      </>
                    )}

                  </button>

                </div>

              </form>

            )}

          </article>


          {/* =============================================
              BENEFITS
          ============================================== */}

          <aside className="pn-benefits-card">

            <div className="pn-section-heading">

              <div>

                <span>
                  {
                    t.whatYouWillReceive
                  }
                </span>


                <h3>
                  {
                    t.usefulHealthContent
                  }
                </h3>


                <p>
                  {t.contentSupport}
                </p>

              </div>


              <div className="pn-heading-icon pn-star-icon">
                <Star
                  size={24}
                />
              </div>

            </div>


            <div className="pn-benefits-list">

              {newsletterBenefits.map(
                (benefit) => {
                  const Icon =
                    benefit.icon;

                  return (
                    <article
                      key={
                        benefit.title
                      }
                      className="pn-benefit-item"
                    >

                      <div>
                        <Icon
                          size={21}
                        />
                      </div>


                      <span>

                        <strong>
                          {
                            benefit.title
                          }
                        </strong>


                        <p>
                          {
                            benefit.description
                          }
                        </p>

                      </span>

                    </article>
                  );
                }
              )}

            </div>

          </aside>

        </section>


        {/* =============================================
            NEWSLETTER LIBRARY
        ============================================== */}

        <section className="pn-library">

          <div className="pn-library-header">

            <div>

              <span className="pn-library-label">
                {
                  t.newsletterLibrary
                }
              </span>


              <h3>
                {
                  t.previousNewsletters
                }
              </h3>


              <p>
                {
                  t.libraryDescription
                }
              </p>

            </div>


            <div className="pn-heading-icon pn-library-icon">
              <BookOpen
                size={24}
              />
            </div>

          </div>


          {loading ? (

            <div className="pn-empty">

              <LoaderCircle
                size={40}
                className="pn-spinner"
              />


              <h4>
                {
                  t.loadingNewsletters
                }
              </h4>

            </div>

          ) : newsletters.length ===
            0 ? (

            <div className="pn-empty">

              <div className="pn-empty-icon">
                <Mail
                  size={42}
                />
              </div>


              <h4>
                {t.noNewsletters}
              </h4>


              <p>
                {
                  t.noNewslettersDescription
                }
              </p>


              <span>
                <Clock3
                  size={15}
                />

                {t.checkAgainLater}
              </span>

            </div>

          ) : (

            <div className="pn-card-grid">

              {newsletters.map(
                (rawNewsletter) => {
                  const newsletter =
                    localizeNewsletter(
                      rawNewsletter,
                      languageCode
                    );

                  return (
                    <article
                      key={
                        newsletter._id
                      }
                      className="pn-newsletter-card"
                    >

                      <div className="pn-card-top">

                        <div className="pn-card-icon">
                          <MailCheck
                            size={24}
                          />
                        </div>


                        <span className="pn-published-badge">
                          {t.published}
                        </span>

                      </div>


                      <div className="pn-card-date">

                        <CalendarDays
                          size={15}
                        />

                        {formatDate(
                          newsletter.publishedAt ||
                            newsletter.sentAt ||
                            newsletter.createdAt
                        )}

                      </div>


                      <h4>
                        {newsletter.title}
                      </h4>


                      <p>
                        {newsletter.summary ||
                          newsletter.content?.slice(
                            0,
                            160
                          )}
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          setSelectedNewsletter(
                            rawNewsletter
                          )
                        }
                      >

                        {t.readNewsletter}

                        <ChevronRight
                          size={17}
                        />

                      </button>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>


      {/* ===============================================
          NEWSLETTER MODAL
      ================================================ */}

      {localizedSelectedNewsletter && (

        <div
          className="pn-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedNewsletter(
                null
              );
            }
          }}
        >

          <section
            className="pn-modal"
            role="dialog"
            aria-modal="true"
          >

            <header className="pn-modal-header">

              <div>

                <span>
                  {
                    t.publishedNewsletter
                  }
                </span>


                <h3>
                  {
                    localizedSelectedNewsletter.title
                  }
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedNewsletter(
                    null
                  )
                }
                aria-label={
                  t.closeNewsletter
                }
              >
                <X
                  size={21}
                />
              </button>

            </header>


            <div className="pn-modal-content">

              <div className="pn-modal-icon">
                <MailCheck
                  size={36}
                />
              </div>


              <p className="pn-modal-date">

                {formatDate(
                  localizedSelectedNewsletter.publishedAt ||
                    localizedSelectedNewsletter.sentAt ||
                    localizedSelectedNewsletter.createdAt
                )}

              </p>


              {localizedSelectedNewsletter.summary && (

                <div className="pn-modal-summary">

                  <span>
                    {t.summary}
                  </span>


                  <strong>
                    {
                      localizedSelectedNewsletter.summary
                    }
                  </strong>

                </div>

              )}


              <div className="pn-modal-body">

                <p>
                  {
                    localizedSelectedNewsletter.content
                  }
                </p>

              </div>


              <button
                type="button"
                className="pn-modal-close"
                onClick={() =>
                  setSelectedNewsletter(
                    null
                  )
                }
              >
                {t.closeNewsletter}
              </button>

            </div>

          </section>

        </div>

      )}

    </PatientLayout>
  );
}