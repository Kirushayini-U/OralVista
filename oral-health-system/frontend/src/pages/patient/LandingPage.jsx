import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Facebook,
  GraduationCap,
  HeartPulse,
  ImageIcon,
  Instagram,
  Languages,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

/* =====================================================
   MULTILINGUAL LANDING PAGE DATA
===================================================== */

const SECTION_IDS = [
  "home",
  "features",
  "about",
  "contact",
];

const FEATURE_ICONS = [
  Brain,
  ImageIcon,
  MessageCircle,
  GraduationCap,
  Languages,
  MapPin,
  Mail,
  ShieldCheck,
];

const STEP_ICONS = [
  Users,
  Sparkles,
  Activity,
  CheckCircle2,
];

const ABOUT_ICONS = [
  Target,
  Eye,
  Lightbulb,
];

const HERO_SERVICE_ICONS = [
  Brain,
  ImageIcon,
  GraduationCap,
  MapPin,
];

const VALUE_ICONS = [
  Brain,
  Languages,
  Users,
  GraduationCap,
];

const landingTranslations = {
  en: {
    languageName: "English",
    nav: [
      { name: "Home", sectionId: "home" },
      { name: "Features", sectionId: "features" },
      { name: "About Us", sectionId: "about" },
      { name: "Contact", sectionId: "contact" },
    ],
    signIn: "Sign In",
    register: "Register",
    openMenu: "Open navigation menu",
    brandTagline: "Smart Dental and Oral Assistant",

    heroBadge:
      "AI-powered oral and dental health support for Sri Lanka",
    heroTitlePrefix:
      "Smarter oral and dental care for a",
    heroTitleHighlight:
      "healthier smile.",
    heroDescription:
      "OralVista combines intelligent prediction, dental image analysis, education and personalized guidance in one secure, accessible platform.",
    getStarted: "Get Started",
    exploreFeatures: "Explore Features",
    userFriendly: "User-friendly",
    multilingual: "Multilingual",
    personalized: "Personalized",
    threeLanguages: "3 Languages",
    accessibleSupport: "Accessible support",
    aiPowered: "AI Powered",
    smartAssistance: "Smart assistance",
    secure: "Secure",
    protectedAccess: "Protected access",
    systemReady: "System ready",
    smartDentalCompanion: "Your smart dental companion",
    privacyFocused: "Privacy focused",
    secureExperience: "Secure experience",
    explore: "Explore",
    scrollToFeatures: "Scroll to features",

    heroServices: [
      "Analyse oral and dental-health symptoms",
      "Upload and analyse dental images",
      "Learn through Oral Health Education & Quiz",
      "Locate nearby dental clinics",
    ],

    systemFeatures: "System Features",
    featuresHeading:
      "Intelligent features for better oral and dental-health support",
    featuresDescription:
      "Prediction, dental-image analysis, learning, communication and clinic information are available in one modern platform.",
    learnMore: "Learn more",

    features: [
      {
        title: "OralVista Symptom Prediction",
        description:
          "Enter your oral and dental-health symptoms and receive an AI-based preliminary prediction with an understandable risk level.",
        label: "Smart assessment",
      },
      {
        title: "Dental Image Analysis",
        description:
          "Upload a dental image and allow the CNN model to analyse signs of the supported oral-health condition.",
        label: "CNN powered",
      },
      {
        title: "AI Chat Assistant",
        description:
          "Ask oral and dental-health questions and receive simple guidance through an intelligent conversational assistant.",
        label: "Smart guidance",
      },
      {
        title: "OralVista Oral Health Education & Quiz",
        description:
          "Study oral and dental-health lessons, complete quizzes and improve your dental-care knowledge.",
        label: "Learn and improve",
      },
      {
        title: "Multilingual Support",
        description:
          "Access oral-health guidance in English, Sinhala and Tamil throughout the platform.",
        label: "Three languages",
      },
      {
        title: "Dental Clinic Finder",
        description:
          "Search for nearby dental clinics and view useful location and contact information.",
        label: "Location based",
      },
      {
        title: "OralVista Oral Health Newsletter",
        description:
          "Receive oral and dental-health tips, reminders and personalized educational information.",
        label: "Weekly support",
      },
      {
        title: "Secure User Account",
        description:
          "Securely manage your profile, predictions and personalized oral-health activities.",
        label: "Privacy focused",
      },
    ],

    simpleProcess: "Simple Process",
    howHeading:
      "Access smart oral and dental-health support in four simple steps",
    howDescription:
      "Register, select a service, provide the required information and receive helpful preliminary oral-health guidance.",
    createYourAccount: "Create Your Account",
    learnAboutUs: "Learn About Us",
    oneCompletePlatform: "One complete platform",
    platformSummary: "Prediction, education and clinic guidance",

    steps: [
      {
        number: "01",
        title: "Create an account",
        description:
          "Register securely and complete your basic user profile.",
      },
      {
        number: "02",
        title: "Select a service",
        description:
          "Choose symptom prediction, image analysis, AI tutor or clinic finder.",
      },
      {
        number: "03",
        title: "Provide information",
        description:
          "Enter symptoms, upload a dental image or ask an oral-health question.",
      },
      {
        number: "04",
        title: "Receive guidance",
        description:
          "View preliminary results, recommendations and educational information.",
      },
    ],

    aboutOralVista: "About OralVista",
    aboutHeading:
      "Building a healthier future through intelligent dental support",
    aboutDescription:
      "OralVista makes oral and dental-health information, preliminary assessment and education more accessible to Sri Lankan communities.",

    aboutCards: [
      {
        number: "01",
        title: "Our Goal",
        description:
          "To improve oral and dental-health awareness and encourage the early identification of oral-health risks among people in Sri Lanka.",
      },
      {
        number: "02",
        title: "Our Vision",
        description:
          "To create an accessible and trusted digital oral-health platform that supports healthier communities through artificial intelligence.",
      },
      {
        number: "03",
        title: "Our Mission",
        description:
          "To combine AI prediction, education, multilingual guidance and clinic information in one user-friendly platform.",
      },
    ],

    values: [
      { title: "AI Powered", description: "Intelligent support" },
      { title: "Multilingual", description: "Three languages" },
      { title: "Accessible", description: "Designed for everyone" },
      { title: "Educational", description: "Helpful learning" },
    ],

    contactUs: "Contact Us",
    contactHeading: "Have a question? Contact our team",
    contactDescription:
      "Contact us for general information, technical support or feedback about your experience.",
    contactInformation: "Contact Information",
    happyToHear: "We would be happy to hear from you",
    contactInfoDescription:
      "Contact us for information about the system, user support or general enquiries.",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    location: "Location",
    sriLanka: "Sri Lanka",
    supportHours: "Support Hours",
    supportTime: "Monday–Friday, 9:00 AM–5:00 PM",
    navigation: "Navigation",
    quickLinks: "Quick Links",
    userSignIn: "User Sign In",
    createAccount: "Create Account",
    startToday: "Start today",
    needGuidance: "Need oral and dental-health guidance?",
    ctaDescription:
      "Register to access symptom prediction, dental image analysis, learning and clinic information.",
    joinOralVista: "Join OralVista",
    secureUserFriendly: "Secure and user-friendly",

    footerTagline: "Smart Oral and Dental Health Assistant",
    footerDescription:
      "An AI-based platform supporting oral and dental-health awareness, prediction, education and dental clinic information.",
    exploreFooter: "Explore",
    account: "Account",
    userAccess: "User Access",
    adminLogin: "Admin Login",
    allRightsReserved: "All rights reserved.",
    disclaimer:
      "Preliminary guidance does not replace professional diagnosis.",
  },

  si: {
    languageName: "සිංහල",
    nav: [
      { name: "මුල් පිටුව", sectionId: "home" },
      { name: "විශේෂාංග", sectionId: "features" },
      { name: "අප ගැන", sectionId: "about" },
      { name: "සම්බන්ධ වන්න", sectionId: "contact" },
    ],
    signIn: "පිවිසෙන්න",
    register: "ලියාපදිංචි වන්න",
    openMenu: "සංචාලන මෙනුව විවෘත කරන්න",
    brandTagline: "ස්මාර්ට් දන්ත සහ මුඛ සෞඛ්‍ය සහායක",

    heroBadge:
      "ශ්‍රී ලංකාව සඳහා AI බලයෙන් ක්‍රියාත්මක මුඛ හා දන්ත සෞඛ්‍ය සහාය",
    heroTitlePrefix:
      "වඩා සෞඛ්‍ය සම්පන්න සිනහවක් සඳහා",
    heroTitleHighlight:
      "ස්මාර්ට් මුඛ හා දන්ත සත්කාර.",
    heroDescription:
      "OralVista බුද්ධිමත් පුරෝකථනය, දන්ත රූප විශ්ලේෂණය, අධ්‍යාපනය සහ පුද්ගලීකරණය කළ මගපෙන්වීම එක් ආරක්ෂිත සහ පහසුවෙන් ප්‍රවේශ විය හැකි වේදිකාවක ඒකාබද්ධ කරයි.",
    getStarted: "ආරම්භ කරන්න",
    exploreFeatures: "විශේෂාංග බලන්න",
    userFriendly: "පරිශීලක හිතකාමී",
    multilingual: "බහුභාෂා",
    personalized: "පුද්ගලීකරණය කළ",
    threeLanguages: "භාෂා 3",
    accessibleSupport: "පහසු ප්‍රවේශ සහාය",
    aiPowered: "AI බලයෙන්",
    smartAssistance: "ස්මාර්ට් සහාය",
    secure: "ආරක්ෂිත",
    protectedAccess: "ආරක්ෂිත ප්‍රවේශය",
    systemReady: "පද්ධතිය සූදානම්",
    smartDentalCompanion: "ඔබගේ ස්මාර්ට් දන්ත සහායක",
    privacyFocused: "පෞද්ගලිකත්වයට ප්‍රමුඛතාව",
    secureExperience: "ආරක්ෂිත අත්දැකීම",
    explore: "ගවේෂණය කරන්න",
    scrollToFeatures: "විශේෂාංග වෙත යන්න",

    heroServices: [
      "මුඛ හා දන්ත සෞඛ්‍ය රෝග ලක්ෂණ විශ්ලේෂණය කරන්න",
      "දන්ත රූප උඩුගත කර විශ්ලේෂණය කරන්න",
      "මුඛ සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය මගින් ඉගෙන ගන්න",
      "ළඟම දන්ත සායන සොයන්න",
    ],

    systemFeatures: "පද්ධති විශේෂාංග",
    featuresHeading:
      "වඩා හොඳ මුඛ හා දන්ත සෞඛ්‍ය සහාය සඳහා බුද්ධිමත් විශේෂාංග",
    featuresDescription:
      "පුරෝකථනය, දන්ත රූප විශ්ලේෂණය, ඉගෙනීම, සන්නිවේදනය සහ සායන තොරතුරු එක් නවීන වේදිකාවක ලබාගත හැක.",
    learnMore: "තවත් දැනගන්න",

    features: [
      {
        title: "OralVista රෝග ලක්ෂණ පුරෝකථනය",
        description:
          "ඔබගේ මුඛ හා දන්ත සෞඛ්‍ය රෝග ලක්ෂණ ඇතුළත් කර පැහැදිලි අවදානම් මට්ටමක් සමඟ AI මූලික පුරෝකථනයක් ලබාගන්න.",
        label: "ස්මාර්ට් ඇගයීම",
      },
      {
        title: "දන්ත රූප විශ්ලේෂණය",
        description:
          "දන්ත රූපයක් උඩුගත කර CNN ආකෘතියට සහය දක්වන මුඛ සෞඛ්‍ය තත්ත්වයේ ලක්ෂණ විශ්ලේෂණය කිරීමට ඉඩ දෙන්න.",
        label: "CNN බලයෙන්",
      },
      {
        title: "AI කතාබස් සහායක",
        description:
          "මුඛ හා දන්ත සෞඛ්‍ය ප්‍රශ්න අසා බුද්ධිමත් සංවාද සහායකයෙකුගෙන් සරල මගපෙන්වීම ලබාගන්න.",
        label: "ස්මාර්ට් මගපෙන්වීම",
      },
      {
        title: "OralVista මුඛ සෞඛ්‍ය අධ්‍යාපනය සහ ප්‍රශ්නාවලිය",
        description:
          "මුඛ හා දන්ත සෞඛ්‍ය පාඩම් අධ්‍යයනය කර ප්‍රශ්නාවලි සම්පූර්ණ කර ඔබගේ දන්ත සත්කාර දැනුම වැඩිදියුණු කරන්න.",
        label: "ඉගෙනගෙන වැඩිදියුණු වන්න",
      },
      {
        title: "බහුභාෂා සහාය",
        description:
          "වේදිකාව පුරා ඉංග්‍රීසි, සිංහල සහ දෙමළ භාෂාවලින් මුඛ සෞඛ්‍ය මගපෙන්වීම ලබාගන්න.",
        label: "භාෂා තුනක්",
      },
      {
        title: "දන්ත සායන සෙවුම",
        description:
          "ළඟම දන්ත සායන සොයා ස්ථාන සහ සම්බන්ධතා තොරතුරු බලන්න.",
        label: "ස්ථාන පදනම්",
      },
      {
        title: "OralVista මුඛ සෞඛ්‍ය පුවත්පත",
        description:
          "මුඛ හා දන්ත සෞඛ්‍ය උපදෙස්, මතක් කිරීම් සහ පුද්ගලීකරණය කළ අධ්‍යාපනික තොරතුරු ලබාගන්න.",
        label: "සතිපතා සහාය",
      },
      {
        title: "ආරක්ෂිත පරිශීලක ගිණුම",
        description:
          "ඔබගේ පැතිකඩ, පුරෝකථන සහ පුද්ගලීකරණය කළ මුඛ සෞඛ්‍ය ක්‍රියාකාරකම් ආරක්ෂිතව කළමනාකරණය කරන්න.",
        label: "පෞද්ගලිකත්වයට ප්‍රමුඛතාව",
      },
    ],

    simpleProcess: "සරල ක්‍රියාවලිය",
    howHeading:
      "සරල පියවර හතරකින් ස්මාර්ට් මුඛ හා දන්ත සෞඛ්‍ය සහාය ලබාගන්න",
    howDescription:
      "ලියාපදිංචි වන්න, සේවාවක් තෝරන්න, අවශ්‍ය තොරතුරු සපයන්න සහ ප්‍රයෝජනවත් මූලික මුඛ සෞඛ්‍ය මගපෙන්වීම ලබාගන්න.",
    createYourAccount: "ඔබගේ ගිණුම සාදන්න",
    learnAboutUs: "අප ගැන දැනගන්න",
    oneCompletePlatform: "සම්පූර්ණ එක් වේදිකාවක්",
    platformSummary: "පුරෝකථනය, අධ්‍යාපනය සහ සායන මගපෙන්වීම",

    steps: [
      {
        number: "01",
        title: "ගිණුමක් සාදන්න",
        description:
          "ආරක්ෂිතව ලියාපදිංචි වී ඔබගේ මූලික පරිශීලක පැතිකඩ සම්පූර්ණ කරන්න.",
      },
      {
        number: "02",
        title: "සේවාවක් තෝරන්න",
        description:
          "රෝග ලක්ෂණ පුරෝකථනය, රූප විශ්ලේෂණය, අධ්‍යාපනය හෝ සායන සෙවුම තෝරන්න.",
      },
      {
        number: "03",
        title: "තොරතුරු සපයන්න",
        description:
          "රෝග ලක්ෂණ ඇතුළත් කරන්න, දන්ත රූපයක් උඩුගත කරන්න හෝ මුඛ සෞඛ්‍ය ප්‍රශ්නයක් අසන්න.",
      },
      {
        number: "04",
        title: "මගපෙන්වීම ලබාගන්න",
        description:
          "මූලික ප්‍රතිඵල, නිර්දේශ සහ අධ්‍යාපනික තොරතුරු බලන්න.",
      },
    ],

    aboutOralVista: "OralVista ගැන",
    aboutHeading:
      "බුද්ධිමත් දන්ත සහාය මගින් වඩා සෞඛ්‍ය සම්පන්න අනාගතයක් ගොඩනගමු",
    aboutDescription:
      "OralVista ශ්‍රී ලාංකික ප්‍රජාවන් සඳහා මුඛ හා දන්ත සෞඛ්‍ය තොරතුරු, මූලික ඇගයීම් සහ අධ්‍යාපනය වඩා පහසුවෙන් ලබාගත හැකි කරයි.",

    aboutCards: [
      {
        number: "01",
        title: "අපගේ අරමුණ",
        description:
          "ශ්‍රී ලංකාවේ ජනතාව අතර මුඛ හා දන්ත සෞඛ්‍ය දැනුවත්භාවය වැඩි කිරීම සහ මුඛ සෞඛ්‍ය අවදානම් ඉක්මනින් හඳුනාගැනීම දිරිමත් කිරීම.",
      },
      {
        number: "02",
        title: "අපගේ දැක්ම",
        description:
          "කෘත්‍රිම බුද්ධිය මගින් සෞඛ්‍ය සම්පන්න ප්‍රජාවන්ට සහාය වන පහසුවෙන් ප්‍රවේශ විය හැකි සහ විශ්වාසදායක ඩිජිටල් මුඛ සෞඛ්‍ය වේදිකාවක් නිර්මාණය කිරීම.",
      },
      {
        number: "03",
        title: "අපගේ මෙහෙවර",
        description:
          "AI පුරෝකථනය, අධ්‍යාපනය, බහුභාෂා මගපෙන්වීම සහ සායන තොරතුරු එක් පරිශීලක හිතකාමී වේදිකාවක ඒකාබද්ධ කිරීම.",
      },
    ],

    values: [
      { title: "AI බලයෙන්", description: "බුද්ධිමත් සහාය" },
      { title: "බහුභාෂා", description: "භාෂා තුනක්" },
      { title: "පහසු ප්‍රවේශය", description: "සෑම කෙනෙකුටම නිර්මාණය කර ඇත" },
      { title: "අධ්‍යාපනික", description: "ප්‍රයෝජනවත් ඉගෙනීම" },
    ],

    contactUs: "අප අමතන්න",
    contactHeading: "ප්‍රශ්නයක් තිබේද? අපගේ කණ්ඩායම අමතන්න",
    contactDescription:
      "සාමාන්‍ය තොරතුරු, තාක්ෂණික සහාය හෝ ඔබගේ අත්දැකීම පිළිබඳ ප්‍රතිචාර සඳහා අප අමතන්න.",
    contactInformation: "සම්බන්ධතා තොරතුරු",
    happyToHear: "ඔබගෙන් අසන්නට අප සතුටු වෙමු",
    contactInfoDescription:
      "පද්ධතිය, පරිශීලක සහාය හෝ සාමාන්‍ය විමසීම් පිළිබඳ තොරතුරු සඳහා අප අමතන්න.",
    phoneNumber: "දුරකථන අංකය",
    emailAddress: "ඊමේල් ලිපිනය",
    location: "ස්ථානය",
    sriLanka: "ශ්‍රී ලංකාව",
    supportHours: "සහාය වේලාවන්",
    supportTime: "සඳුදා–සිකුරාදා, පෙ.ව. 9:00–ප.ව. 5:00",
    navigation: "සංචාලනය",
    quickLinks: "ඉක්මන් සබැඳි",
    userSignIn: "පරිශීලක පිවිසුම",
    createAccount: "ගිණුමක් සාදන්න",
    startToday: "අදම ආරම්භ කරන්න",
    needGuidance: "මුඛ හා දන්ත සෞඛ්‍ය මගපෙන්වීම අවශ්‍යද?",
    ctaDescription:
      "රෝග ලක්ෂණ පුරෝකථනය, දන්ත රූප විශ්ලේෂණය, ඉගෙනීම සහ සායන තොරතුරු සඳහා ලියාපදිංචි වන්න.",
    joinOralVista: "OralVista සමඟ එක්වන්න",
    secureUserFriendly: "ආරක්ෂිත සහ පරිශීලක හිතකාමී",

    footerTagline: "ස්මාර්ට් මුඛ හා දන්ත සෞඛ්‍ය සහායක",
    footerDescription:
      "මුඛ හා දන්ත සෞඛ්‍ය දැනුවත්භාවය, පුරෝකථනය, අධ්‍යාපනය සහ දන්ත සායන තොරතුරු සඳහා සහාය වන AI පදනම් වේදිකාවක්.",
    exploreFooter: "ගවේෂණය",
    account: "ගිණුම",
    userAccess: "පරිශීලක ප්‍රවේශය",
    adminLogin: "පරිපාලක පිවිසුම",
    allRightsReserved: "සියලු හිමිකම් ඇවිරිණි.",
    disclaimer:
      "මූලික මගපෙන්වීම වෘත්තීය රෝග විනිශ්චය වෙනුවට භාවිතා කළ නොහැක.",
  },

  ta: {
    languageName: "தமிழ்",
    nav: [
      { name: "முகப்பு", sectionId: "home" },
      { name: "அம்சங்கள்", sectionId: "features" },
      { name: "எங்களைப் பற்றி", sectionId: "about" },
      { name: "தொடர்பு", sectionId: "contact" },
    ],
    signIn: "உள்நுழைக",
    register: "பதிவு செய்க",
    openMenu: "வழிசெலுத்தல் மெனுவை திறக்கவும்",
    brandTagline: "ஸ்மார்ட் பல் மற்றும் வாய்ச் சுகாதார உதவியாளர்",

    heroBadge:
      "இலங்கைக்கான AI ஆதரவு கொண்ட வாய்ச் மற்றும் பல் சுகாதார உதவி",
    heroTitlePrefix:
      "ஆரோக்கியமான புன்னகைக்கான",
    heroTitleHighlight:
      "சிறந்த வாய்ச் மற்றும் பல் பராமரிப்பு.",
    heroDescription:
      "OralVista நுண்ணறிவு கணிப்பு, பல் படப் பகுப்பாய்வு, கல்வி மற்றும் தனிப்பயன் வழிகாட்டலை ஒரே பாதுகாப்பான மற்றும் எளிதில் அணுகக்கூடிய தளத்தில் இணைக்கிறது.",
    getStarted: "தொடங்குங்கள்",
    exploreFeatures: "அம்சங்களைப் பாருங்கள்",
    userFriendly: "பயனர் நட்பு",
    multilingual: "பல்மொழி",
    personalized: "தனிப்பயன்",
    threeLanguages: "3 மொழிகள்",
    accessibleSupport: "எளிய அணுகல் ஆதரவு",
    aiPowered: "AI இயக்கம்",
    smartAssistance: "நுண்ணறிவு உதவி",
    secure: "பாதுகாப்பானது",
    protectedAccess: "பாதுகாக்கப்பட்ட அணுகல்",
    systemReady: "அமைப்பு தயாராக உள்ளது",
    smartDentalCompanion: "உங்கள் ஸ்மார்ட் பல் துணை",
    privacyFocused: "தனியுரிமை மையப்படுத்தப்பட்டது",
    secureExperience: "பாதுகாப்பான அனுபவம்",
    explore: "ஆராயுங்கள்",
    scrollToFeatures: "அம்சங்களுக்கு செல்லவும்",

    heroServices: [
      "வாய் மற்றும் பல் சுகாதார அறிகுறிகளை பகுப்பாய்வு செய்யுங்கள்",
      "பல் படங்களை பதிவேற்றி பகுப்பாய்வு செய்யுங்கள்",
      "வாய்ச் சுகாதார கல்வி மற்றும் வினாடி வினா மூலம் கற்றுக்கொள்ளுங்கள்",
      "அருகிலுள்ள பல் மருத்துவ நிலையங்களை கண்டறியுங்கள்",
    ],

    systemFeatures: "அமைப்பு அம்சங்கள்",
    featuresHeading:
      "சிறந்த வாய்ச் மற்றும் பல் சுகாதார உதவிக்கான நுண்ணறிவு அம்சங்கள்",
    featuresDescription:
      "கணிப்பு, பல் படப் பகுப்பாய்வு, கற்றல், தொடர்பு மற்றும் மருத்துவ நிலைய தகவல்கள் ஒரே நவீன தளத்தில் கிடைக்கின்றன.",
    learnMore: "மேலும் அறிக",

    features: [
      {
        title: "OralVista அறிகுறி கணிப்பு",
        description:
          "உங்கள் வாய் மற்றும் பல் சுகாதார அறிகுறிகளை உள்ளிட்டு புரிந்துகொள்ளக்கூடிய அபாய நிலையுடன் AI அடிப்படையிலான ஆரம்ப கணிப்பைப் பெறுங்கள்.",
        label: "ஸ்மார்ட் மதிப்பீடு",
      },
      {
        title: "பல் படப் பகுப்பாய்வு",
        description:
          "ஒரு பல் படத்தை பதிவேற்றி ஆதரிக்கப்படும் வாய்ச் சுகாதார நிலையின் அறிகுறிகளை CNN மாதிரி பகுப்பாய்வு செய்ய அனுமதிக்கவும்.",
        label: "CNN இயக்கம்",
      },
      {
        title: "AI அரட்டை உதவியாளர்",
        description:
          "வாய் மற்றும் பல் சுகாதார கேள்விகளை கேட்டு நுண்ணறிவு உரையாடல் உதவியாளரிடமிருந்து எளிய வழிகாட்டலைப் பெறுங்கள்.",
        label: "ஸ்மார்ட் வழிகாட்டல்",
      },
      {
        title: "OralVista வாய்ச் சுகாதாரக் கல்வி மற்றும் வினாடி வினா",
        description:
          "வாய் மற்றும் பல் சுகாதார பாடங்களைப் படித்து வினாடி வினாக்களை முடித்து உங்கள் பல் பராமரிப்பு அறிவை மேம்படுத்துங்கள்.",
        label: "கற்று மேம்படுங்கள்",
      },
      {
        title: "பல்மொழி ஆதரவு",
        description:
          "தளம் முழுவதும் ஆங்கிலம், சிங்களம் மற்றும் தமிழில் வாய்ச் சுகாதார வழிகாட்டலை அணுகுங்கள்.",
        label: "மூன்று மொழிகள்",
      },
      {
        title: "பல் மருத்துவ நிலைய தேடல்",
        description:
          "அருகிலுள்ள பல் மருத்துவ நிலையங்களைத் தேடி பயனுள்ள இருப்பிட மற்றும் தொடர்பு தகவல்களைப் பாருங்கள்.",
        label: "இருப்பிட அடிப்படை",
      },
      {
        title: "OralVista வாய்ச் சுகாதார செய்திமடல்",
        description:
          "வாய் மற்றும் பல் சுகாதார குறிப்புகள், நினைவூட்டல்கள் மற்றும் தனிப்பயன் கல்வித் தகவல்களைப் பெறுங்கள்.",
        label: "வாராந்திர ஆதரவு",
      },
      {
        title: "பாதுகாப்பான பயனர் கணக்கு",
        description:
          "உங்கள் சுயவிவரம், கணிப்புகள் மற்றும் தனிப்பயன் வாய்ச் சுகாதார செயல்பாடுகளை பாதுகாப்பாக நிர்வகிக்கவும்.",
        label: "தனியுரிமை மையப்படுத்தப்பட்டது",
      },
    ],

    simpleProcess: "எளிய செயல்முறை",
    howHeading:
      "நான்கு எளிய படிகளில் ஸ்மார்ட் வாய்ச் மற்றும் பல் சுகாதார உதவியை அணுகுங்கள்",
    howDescription:
      "பதிவு செய்து, ஒரு சேவையைத் தேர்ந்தெடுத்து, தேவையான தகவலை வழங்கி பயனுள்ள ஆரம்ப வாய்ச் சுகாதார வழிகாட்டலைப் பெறுங்கள்.",
    createYourAccount: "உங்கள் கணக்கை உருவாக்குங்கள்",
    learnAboutUs: "எங்களைப் பற்றி அறிக",
    oneCompletePlatform: "ஒரே முழுமையான தளம்",
    platformSummary: "கணிப்பு, கல்வி மற்றும் மருத்துவ நிலைய வழிகாட்டல்",

    steps: [
      {
        number: "01",
        title: "கணக்கை உருவாக்குங்கள்",
        description:
          "பாதுகாப்பாக பதிவு செய்து உங்கள் அடிப்படை பயனர் சுயவிவரத்தை முடிக்கவும்.",
      },
      {
        number: "02",
        title: "ஒரு சேவையைத் தேர்ந்தெடுக்கவும்",
        description:
          "அறிகுறி கணிப்பு, படப் பகுப்பாய்வு, கல்வி அல்லது மருத்துவ நிலைய தேடலைத் தேர்ந்தெடுக்கவும்.",
      },
      {
        number: "03",
        title: "தகவலை வழங்குங்கள்",
        description:
          "அறிகுறிகளை உள்ளிடுங்கள், பல் படத்தை பதிவேற்றுங்கள் அல்லது வாய்ச் சுகாதார கேள்வியை கேளுங்கள்.",
      },
      {
        number: "04",
        title: "வழிகாட்டலைப் பெறுங்கள்",
        description:
          "ஆரம்ப முடிவுகள், பரிந்துரைகள் மற்றும் கல்வித் தகவல்களைப் பாருங்கள்.",
      },
    ],

    aboutOralVista: "OralVista பற்றி",
    aboutHeading:
      "நுண்ணறிவு பல் உதவியின் மூலம் ஆரோக்கியமான எதிர்காலத்தை உருவாக்குதல்",
    aboutDescription:
      "OralVista இலங்கை சமூகங்களுக்கு வாய் மற்றும் பல் சுகாதார தகவல், ஆரம்ப மதிப்பீடு மற்றும் கல்வியை எளிதில் அணுகக்கூடியதாக ஆக்குகிறது.",

    aboutCards: [
      {
        number: "01",
        title: "எங்கள் இலக்கு",
        description:
          "இலங்கையிலுள்ள மக்களிடையே வாய் மற்றும் பல் சுகாதார விழிப்புணர்வை மேம்படுத்தி அபாயங்களை ஆரம்பத்திலேயே அடையாளம் காண ஊக்குவித்தல்.",
      },
      {
        number: "02",
        title: "எங்கள் பார்வை",
        description:
          "செயற்கை நுண்ணறிவு மூலம் ஆரோக்கியமான சமூகங்களை ஆதரிக்கும் அணுகக்கூடிய மற்றும் நம்பகமான டிஜிட்டல் வாய்ச் சுகாதார தளத்தை உருவாக்குதல்.",
      },
      {
        number: "03",
        title: "எங்கள் பணி",
        description:
          "AI கணிப்பு, கல்வி, பல்மொழி வழிகாட்டல் மற்றும் மருத்துவ நிலைய தகவல்களை ஒரே பயனர் நட்பு தளத்தில் இணைத்தல்.",
      },
    ],

    values: [
      { title: "AI இயக்கம்", description: "நுண்ணறிவு ஆதரவு" },
      { title: "பல்மொழி", description: "மூன்று மொழிகள்" },
      { title: "அணுகக்கூடியது", description: "அனைவருக்கும் வடிவமைக்கப்பட்டது" },
      { title: "கல்வி", description: "பயனுள்ள கற்றல்" },
    ],

    contactUs: "எங்களை தொடர்புகொள்ளுங்கள்",
    contactHeading: "கேள்வி உள்ளதா? எங்கள் குழுவை தொடர்புகொள்ளுங்கள்",
    contactDescription:
      "பொது தகவல், தொழில்நுட்ப ஆதரவு அல்லது உங்கள் அனுபவம் குறித்த கருத்துகளுக்கு எங்களை தொடர்புகொள்ளுங்கள்.",
    contactInformation: "தொடர்பு தகவல்",
    happyToHear: "உங்களிடமிருந்து கேட்க நாங்கள் மகிழ்ச்சியடைகிறோம்",
    contactInfoDescription:
      "அமைப்பு, பயனர் ஆதரவு அல்லது பொது விசாரணைகள் பற்றிய தகவலுக்கு எங்களை தொடர்புகொள்ளுங்கள்.",
    phoneNumber: "தொலைபேசி எண்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    location: "இருப்பிடம்",
    sriLanka: "இலங்கை",
    supportHours: "ஆதரவு நேரங்கள்",
    supportTime: "திங்கள்–வெள்ளி, காலை 9:00–மாலை 5:00",
    navigation: "வழிசெலுத்தல்",
    quickLinks: "விரைவு இணைப்புகள்",
    userSignIn: "பயனர் உள்நுழைவு",
    createAccount: "கணக்கை உருவாக்கவும்",
    startToday: "இன்றே தொடங்குங்கள்",
    needGuidance: "வாய் மற்றும் பல் சுகாதார வழிகாட்டல் தேவையா?",
    ctaDescription:
      "அறிகுறி கணிப்பு, பல் படப் பகுப்பாய்வு, கற்றல் மற்றும் மருத்துவ நிலைய தகவல்களை அணுக பதிவு செய்யுங்கள்.",
    joinOralVista: "OralVista-வில் இணையுங்கள்",
    secureUserFriendly: "பாதுகாப்பான மற்றும் பயனர் நட்பு",

    footerTagline: "ஸ்மார்ட் வாய் மற்றும் பல் சுகாதார உதவியாளர்",
    footerDescription:
      "வாய் மற்றும் பல் சுகாதார விழிப்புணர்வு, கணிப்பு, கல்வி மற்றும் பல் மருத்துவ நிலைய தகவல்களை ஆதரிக்கும் AI அடிப்படையிலான தளம்.",
    exploreFooter: "ஆராயுங்கள்",
    account: "கணக்கு",
    userAccess: "பயனர் அணுகல்",
    adminLogin: "நிர்வாகி உள்நுழைவு",
    allRightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    disclaimer:
      "ஆரம்ப வழிகாட்டல் தொழில்முறை நோயறிதலை மாற்றாது.",
  },
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [languageCode, setLanguageCode] = useState(() => {
    return localStorage.getItem("oralvista_guest_language") || "en";
  });

  const headerRef = useRef(null);

  const t =
    landingTranslations[languageCode] ||
    landingTranslations.en;

  const navigationLinks = t.nav;

  const features = t.features.map(
    (item, index) => ({
      ...item,
      icon: FEATURE_ICONS[index],
    })
  );

  const workingSteps = t.steps.map(
    (item, index) => ({
      ...item,
      icon: STEP_ICONS[index],
    })
  );

  const aboutCards = t.aboutCards.map(
    (item, index) => ({
      ...item,
      icon: ABOUT_ICONS[index],
    })
  );

  const heroServices = t.heroServices.map(
    (item, index) => ({
      text: item,
      icon: HERO_SERVICE_ICONS[index],
    })
  );

  const aboutValues = t.values.map(
    (item, index) => ({
      ...item,
      icon: VALUE_ICONS[index],
    })
  );

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;

    setLanguageCode(nextLanguage);

    localStorage.setItem(
      "oralvista_guest_language",
      nextLanguage
    );

    document.documentElement.lang =
      nextLanguage === "si"
        ? "si"
        : nextLanguage === "ta"
          ? "ta"
          : "en";
  };

  useEffect(() => {
    document.documentElement.lang =
      languageCode === "si"
        ? "si"
        : languageCode === "ta"
          ? "ta"
          : "en";
  }, [languageCode]);

  /* =====================================================
     SAME-PAGE SMOOTH SCROLL
  ===================================================== */

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    setMobileMenuOpen(false);

    window.setTimeout(() => {
      const headerHeight = headerRef.current?.offsetHeight ?? 80;
      const extraSpacing = 10;

      const targetPosition =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        extraSpacing;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: "smooth",
      });

      window.history.replaceState(null, "", `#${sectionId}`);
    }, 60);
  };

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();
    scrollToSection(sectionId);
  };

  /* =====================================================
     LOAD PAGE USING EXISTING HASH
  ===================================================== */

  useEffect(() => {
    const sectionId = window.location.hash.replace("#", "");

    if (!sectionId) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  /* =====================================================
     ACTIVE NAVIGATION LINK
  ===================================================== */

  useEffect(() => {
    const sectionElements = SECTION_IDS
      .map((sectionId) => document.getElementById(sectionId))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.05, 0.15, 0.3],
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  /* =====================================================
     TOP SCROLL PROGRESS
  ===================================================== */

  useEffect(() => {
    const calculateProgress = () => {
      const availableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        availableHeight > 0 ? (window.scrollY / availableHeight) * 100 : 0;

      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    calculateProgress();

    window.addEventListener("scroll", calculateProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", calculateProgress);
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header ref={headerRef} className="landing-header">
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav className="mx-auto flex h-[76px] w-full max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:h-[86px] lg:px-8">
          <a
            href="#home"
            onClick={(event) => handleSectionClick(event, "home")}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="logo-wrapper">
              <img
                src="/images/logo.png"
                alt="OralVista logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
                Oral<span className="text-teal-600">Vista</span>
              </p>

              <p className="mt-1 hidden truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
                {t.brandTagline}
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navigationLinks.map((item) => (
              <a
                key={item.sectionId}
                href={`#${item.sectionId}`}
                onClick={(event) =>
                  handleSectionClick(event, item.sectionId)
                }
                className={`landing-nav-link ${
                  activeSection === item.sectionId
                    ? "landing-nav-link-active"
                    : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <label className="relative">
              <span className="sr-only">Language</span>

              <select
                value={languageCode}
                onChange={handleLanguageChange}
                className="h-[44px] rounded-xl border border-teal-200 bg-white/90 px-3 pr-8 text-sm font-bold text-slate-700 outline-none transition hover:border-teal-400 focus:border-teal-500"
                aria-label="Language"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </label>

            <Link
              to="/login"
              className="sign-in-button px-5 py-2.5 text-sm"
            >
              {t.signIn}
            </Link>

            <Link
              to="/register"
              className="register-button px-5 py-2.5 text-sm"
            >
              {t.register}
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="mobile-menu-button lg:hidden"
            aria-label={t.openMenu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="mobile-menu-panel lg:hidden">
            <div className="mx-auto flex max-w-[1360px] flex-col gap-2 px-4 py-4 sm:px-6">
              {navigationLinks.map((item) => (
                <a
                  key={item.sectionId}
                  href={`#${item.sectionId}`}
                  onClick={(event) =>
                    handleSectionClick(event, item.sectionId)
                  }
                  className={`mobile-nav-link ${
                    activeSection === item.sectionId
                      ? "mobile-nav-link-active"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              ))}

              <div className="mt-2 md:hidden">
                <select
                  value={languageCode}
                  onChange={handleLanguageChange}
                  className="mb-3 h-11 w-full rounded-xl border border-teal-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none"
                  aria-label="Language"
                >
                  <option value="en">English</option>
                  <option value="si">සිංහල</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 md:hidden">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sign-in-button px-4 py-2.5 text-center text-sm"
                >
                  {t.signIn}
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="register-button px-4 py-2.5 text-center text-sm"
                >
                  {t.register}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =====================================================
            HOME
        ===================================================== */}

        <section
          id="home"
          className="hero-section"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(3,30,29,0.97) 0%, rgba(8,73,69,0.91) 48%, rgba(14,116,110,0.46) 100%), url('/images/dental-background.jpg')",
          }}
        >
          <div className="hero-pattern" />
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1360px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-14">
            <div className="max-w-3xl">
              <div className="hero-badge">
                <span className="hero-badge-icon">
                  <Sparkles size={15} />
                </span>

                {t.heroBadge}
              </div>

              <h1 className="hero-title">
                {t.heroTitlePrefix}{" "}
                <span className="hero-title-highlight">
                  {t.heroTitleHighlight}
                </span>
              </h1>

              <p className="hero-description">
                {t.heroDescription}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="hero-primary-button group">
                  {t.getStarted}

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#features"
                  onClick={(event) =>
                    handleSectionClick(event, "features")
                  }
                  className="hero-secondary-button"
                >
                  {t.exploreFeatures}
                </a>
              </div>

              <div className="hero-benefits">
                <div className="hero-benefit-item">
                  <CheckCircle2 size={17} />
                  {t.userFriendly}
                </div>

                <div className="hero-benefit-item">
                  <CheckCircle2 size={17} />
                  {t.multilingual}
                </div>

                <div className="hero-benefit-item">
                  <CheckCircle2 size={17} />
                  {t.personalized}
                </div>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <Languages size={19} />

                  <div>
                    <p className="hero-stat-value">{t.threeLanguages}</p>
                    <p className="hero-stat-label">{t.accessibleSupport}</p>
                  </div>
                </div>

                <div className="hero-stat">
                  <Zap size={19} />

                  <div>
                    <p className="hero-stat-value">{t.aiPowered}</p>
                    <p className="hero-stat-label">{t.smartAssistance}</p>
                  </div>
                </div>

                <div className="hero-stat">
                  <ShieldCheck size={19} />

                  <div>
                    <p className="hero-stat-value">{t.secure}</p>
                    <p className="hero-stat-label">{t.protectedAccess}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Home panel */}

            <div className="hidden w-full justify-end xl:flex">
              <div className="relative w-full max-w-[430px]">
                <div className="hero-dashboard-frame">
                  <div className="hero-dashboard-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                          {t.systemReady}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-teal-600">
                          OralVista
                        </p>

                        <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                          {t.smartDentalCompanion}
                        </h2>
                      </div>

                      <div className="hero-dashboard-main-icon">
                        <HeartPulse size={25} />
                      </div>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      {heroServices.map((item) => (
                        <div
                          key={item.text}
                          className="hero-dashboard-item group"
                        >
                          <div className="hero-dashboard-item-icon">
                            <item.icon size={19} />
                          </div>

                          <p className="text-[13px] font-semibold text-slate-700">
                            {item.text}
                          </p>

                          <ArrowRight
                            size={15}
                            className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hero-floating-card">
                  <ShieldCheck size={20} />

                  <div>
                    <p className="text-[10px] text-slate-500">
                      {t.privacyFocused}
                    </p>

                    <p className="text-xs font-bold text-slate-900">
                      {t.secureExperience}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="hero-scroll-button"
            aria-label={t.scrollToFeatures}
          >
            <span>{t.explore}</span>
            <ChevronDown size={19} />
          </button>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section id="features" className="features-section">
          <div className="section-decoration section-decoration-left" />
          <div className="section-decoration section-decoration-right" />

          <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="section-badge">
                <Sparkles size={14} />
                {t.systemFeatures}
              </div>

              <h2 className="section-main-heading">
                {t.featuresHeading}
              </h2>

              <p className="section-description">
                {t.featuresDescription}
              </p>
            </div>

            <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <article key={feature.title} className="feature-card group">
                  <div className="feature-card-top">
                    <div className="feature-icon">
                      <feature.icon size={24} strokeWidth={1.9} />
                    </div>

                    <span className="feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="feature-label">{feature.label}</span>

                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-[13px] leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="feature-card-footer">
                    <span>{t.learnMore}</span>
                    <ArrowRight size={15} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="how-section">
          <div className="mx-auto grid w-full max-w-[1360px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="section-badge section-badge-left">
                <Zap size={14} />
                {t.simpleProcess}
              </div>

              <h2 className="how-title">
                {t.howHeading}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                {t.register}, select a service, provide the required information
                and receive helpful preliminary oral-health guidance.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="register-button gap-2 px-5 py-3 text-sm"
                >
                  {t.createYourAccount}
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#about"
                  onClick={(event) =>
                    handleSectionClick(event, "about")
                  }
                  className="outline-button"
                >
                  {t.learnAboutUs}
                </a>
              </div>

              <div className="how-trust-box">
                <div className="flex -space-x-2.5">
                  {[Brain, ShieldCheck, Languages].map((Icon, index) => (
                    <div key={index} className="how-trust-avatar">
                      <Icon size={16} />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {t.oneCompletePlatform}
                  </p>

                  <p className="text-xs text-slate-500">
                    {t.platformSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="how-timeline">
              {workingSteps.map((step, index) => (
                <article key={step.number} className="how-step-card">
                  <div className="how-step-number">{step.number}</div>

                  <div className="how-step-icon">
                    <step.icon size={20} />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>

                  {index !== workingSteps.length - 1 && (
                    <div className="how-step-line" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT US
        ===================================================== */}

        <section id="about" className="about-section">
          <div className="about-grid-pattern" />

          <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="section-badge section-badge-dark">
                <HeartPulse size={14} />
                {t.aboutOralVista}
              </div>

              <h2 className="about-main-title">
                {t.aboutHeading}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                {t.aboutDescription}
              </p>
            </div>

            <div className="mt-11 grid gap-5 md:grid-cols-3">
              {aboutCards.map((item) => (
                <article key={item.title} className="about-card">
                  <div className="flex items-start justify-between">
                    <div className="about-icon">
                      <item.icon size={24} />
                    </div>

                    <span className="about-card-number">{item.number}</span>
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-slate-300">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="about-values-panel">
              {aboutValues.map((item) => (
                <div key={item.title} className="about-value-item">
                  <div className="about-value-icon">
                    <item.icon size={20} />
                  </div>

                  <div>
                    <p className="text-base font-extrabold text-white">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ===================================================== */}

        <section id="contact" className="contact-section">
          <div className="contact-background-shape contact-shape-one" />
          <div className="contact-background-shape contact-shape-two" />

          <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="section-badge">
                <MessageCircle size={14} />
                {t.contactUs}
              </div>

              <h2 className="section-main-heading">
                {t.contactHeading}
              </h2>

              <p className="section-description">
                {t.contactDescription}
              </p>
            </div>

            <div className="mt-11 grid items-stretch gap-5 lg:grid-cols-5">
              {/* Contact information */}

              <div className="contact-information-card lg:col-span-2">
                <div className="contact-card-decoration" />

                <div className="relative z-10">
                  <div className="contact-card-badge">
                    <Mail size={14} />
                    {t.contactInformation}
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold leading-tight text-white">
                    {t.happyToHear}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-white/90">
                    {t.contactInfoDescription}
                  </p>

                  <div className="mt-6 space-y-3">
                    <a
                      href="tel:+94771234567"
                      className="contact-detail-item"
                    >
                      <div className="contact-icon-box">
                        <Phone size={19} />
                      </div>

                      <div>
                        <p className="contact-detail-label">{t.phoneNumber}</p>
                        <p className="contact-detail-value">
                          +94 77 123 4567
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:admin@oralvista.lk"
                      className="contact-detail-item"
                    >
                      <div className="contact-icon-box">
                        <Mail size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="contact-detail-label">{t.emailAddress}</p>
                        <p className="contact-detail-value break-all">
                          admin@oralvista.lk
                        </p>
                      </div>
                    </a>

                    <div className="contact-detail-item">
                      <div className="contact-icon-box">
                        <MapPin size={19} />
                      </div>

                      <div>
                        <p className="contact-detail-label">{t.location}</p>
                        <p className="contact-detail-value">{t.sriLanka}</p>
                      </div>
                    </div>

                    <div className="contact-detail-item">
                      <div className="contact-icon-box">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <p className="contact-detail-label">{t.supportHours}</p>
                        <p className="contact-detail-value">
                          {t.supportTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact right-side cards */}

              <div className="contact-side-grid lg:col-span-3">
                <div className="quick-links-card">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600">
                        {t.navigation}
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                        {t.quickLinks}
                      </h3>
                    </div>

                    <div className="quick-links-icon">
                      <Zap size={20} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {navigationLinks.map((item) => (
                      <a
                        key={item.sectionId}
                        href={`#${item.sectionId}`}
                        onClick={(event) =>
                          handleSectionClick(event, item.sectionId)
                        }
                        className="quick-link-item group"
                      >
                        <span>{item.name}</span>

                        <ArrowRight
                          size={15}
                          className="transition group-hover:translate-x-1"
                        />
                      </a>
                    ))}

                    <Link to="/login" className="quick-link-item group">
                      <span>{t.userSignIn}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      to="/register"
                      className="register-button justify-between px-4 py-3 text-sm"
                    >
                      {t.createAccount}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                <div className="contact-cta-card">
                  <div className="contact-cta-icon">
                    <Activity size={24} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600">
                    {t.startToday}
                  </p>

                  <h3 className="mt-1.5 text-xl font-extrabold text-slate-900">
                    {t.needGuidance}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-slate-600">
                    {t.register} to access symptom prediction, dental image
                    analysis, learning and clinic information.
                  </p>

                  <Link
                    to="/register"
                    className="register-button mt-5 gap-2 px-5 py-3 text-sm"
                  >
                    {t.joinOralVista}
                    <ArrowRight size={16} />
                  </Link>

                  <div className="contact-cta-footer">
                    <ShieldCheck size={16} />
                    {t.secureUserFriendly}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer-section">
        <div className="footer-top-line" />

        <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-9 border-b border-white/10 pb-9 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="footer-logo">
                  <img
                    src="/images/logo.png"
                    alt="OralVista logo"
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div>
                  <p className="text-xl font-extrabold text-white">
                    Oral<span className="text-sky-300">Vista</span>
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-400">
                    {t.footerTagline}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-lg text-[13px] leading-6 text-slate-400">
                {t.footerDescription}
              </p>

              <div className="mt-5 flex gap-3">
                <a
                  href="#contact"
                  onClick={(event) =>
                    handleSectionClick(event, "contact")
                  }
                  className="footer-social-link"
                  aria-label="Facebook"
                >
                  <Facebook size={17} />
                </a>

                <a
                  href="#contact"
                  onClick={(event) =>
                    handleSectionClick(event, "contact")
                  }
                  className="footer-social-link"
                  aria-label="Instagram"
                >
                  <Instagram size={17} />
                </a>

                <a
                  href="#contact"
                  onClick={(event) =>
                    handleSectionClick(event, "contact")
                  }
                  className="footer-social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={17} />
                </a>
              </div>
            </div>

            <div>
              <p className="footer-column-label">{t.exploreFooter}</p>

              <h3 className="mt-1.5 text-sm font-bold text-white">
                {t.quickLinks}
              </h3>

              <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-slate-400">
                {navigationLinks.map((item) => (
                  <a
                    key={item.sectionId}
                    href={`#${item.sectionId}`}
                    onClick={(event) =>
                      handleSectionClick(event, item.sectionId)
                    }
                    className="footer-link"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="footer-column-label">{t.account}</p>

              <h3 className="mt-1.5 text-sm font-bold text-white">
                {t.userAccess}
              </h3>

              <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-slate-400">
                <Link to="/login" className="footer-link">
                  {t.signIn}
                </Link>

                <Link to="/register" className="footer-link">
                  {t.register}
                </Link>

                <Link to="/admin/login" className="footer-link">
                  {t.adminLogin}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-5 text-center text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} OralVista. All rights reserved.
            </p>

            <p className="flex items-center justify-center gap-2 sm:justify-end">
              <ShieldCheck size={13} />
              {t.disclaimer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}