import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  LoaderCircle,
  Lock,
  Mail,
  Palette,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  X,
} from "lucide-react";

import PatientLayout from "../../components/PatientLayout.jsx";
import api from "../../api/axios.js";

import {
  getStoredUser,
  updateStoredUser,
} from "../../api/authStorage.js";

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const createProfileState = (user = {}) => ({
  fullName: user.fullName || "",
  email: user.email || "",
  phone: user.phone || "",
  role: user.role || "patient",
  profileImage: user.profileImage || "",
  language: user.language || "English",
  notificationsEnabled:
    user.notificationsEnabled ?? true,
  theme: user.theme || "Light",
});

const languageNameToCode = (language) => {
  const normalized =
    String(language || "English")
      .trim()
      .toLowerCase();

  if (normalized === "sinhala") return "si";
  if (normalized === "tamil") return "ta";
  return "en";
};

const profileTranslations = {
  en: {
    pageTitle: "Profile & Settings",
    loadingProfile: "Loading your profile...",
    patientAccount: "Patient account",
    active: "Active",
    phoneNotProvided: "Phone not provided",
    heroDescription:
      "Manage your personal details, account security, language, theme and oral-health notifications.",
    cancel: "Cancel",
    saving: "Saving...",
    saveProfile: "Save Profile",
    editProfile: "Edit Profile",
    closeMessage: "Close message",

    accountDetails: "Account details",
    personalInformation: "Personal Information",
    registeredPatientInfo: "Your registered patient information.",
    fullName: "Full name",
    phoneNumber: "Phone number",
    enterPhoneNumber: "Enter phone number",
    emailAddress: "Email address",
    emailLoginNotice:
      "Your email is used as your login ID and cannot be changed from this page.",

    accountSecurity: "Account security",
    changePassword: "Change Password",
    chooseSecurePassword: "Choose a secure new password.",
    currentPassword: "Current password",
    enterCurrentPassword: "Enter current password",
    newPassword: "New password",
    minimumEight: "Minimum 8 characters",
    confirmPassword: "Confirm password",
    repeatNewPassword: "Repeat new password",
    updatingPassword: "Updating password...",

    personalisation: "Personalisation",
    preferences: "Preferences",
    preferenceDescription:
      "Choose your preferred language, theme and notification settings.",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    notificationsEnabled: "Oral-health notifications enabled",
    notificationsDisabled: "Oral-health notifications disabled",
    savePreferences: "Save Preferences",
    light: "Light",
    dark: "Dark",

    personalInfoSecure: "Your personal information is stored securely.",
    profileImageLimit: "Profile images must be below 2 MB",
    uploadProfilePicture: "Upload profile picture",

    loadError: "Unable to load your profile.",
    invalidImage: "Please select a valid image file.",
    imageTooLarge: "The profile picture must be smaller than 2 MB.",
    imageSelected:
      "Profile picture selected. Click Save Profile to keep it.",
    imageReadError: "Unable to read the selected image.",
    invalidName: "Please enter a valid full name.",
    preferencesSaved: "Preferences saved successfully.",
    profileUpdateError: "Unable to update your profile.",

    completePasswordFields: "Please complete all password fields.",
    passwordTooShort:
      "The new password must contain at least 8 characters.",
    passwordMismatch:
      "New password and confirm password do not match.",
    passwordSame:
      "The new password must be different from the current password.",
    passwordChanged: "Password changed successfully.",
    passwordChangeError: "Unable to change your password.",

    english: "English",
    sinhala: "Sinhala",
    tamil: "Tamil",
    show: "Show",
    hide: "Hide",
  },

  si: {
    pageTitle: "පැතිකඩ සහ සැකසුම්",
    loadingProfile: "ඔබගේ පැතිකඩ පූරණය වෙමින්...",
    patientAccount: "රෝගියාගේ ගිණුම",
    active: "සක්‍රීය",
    phoneNotProvided: "දුරකථන අංකය ලබාදී නැත",
    heroDescription:
      "ඔබගේ පුද්ගලික තොරතුරු, ගිණුම් ආරක්ෂාව, භාෂාව, තේමාව සහ මුඛ සෞඛ්‍ය දැනුම්දීම් කළමනාකරණය කරන්න.",
    cancel: "අවලංගු කරන්න",
    saving: "සුරකිමින්...",
    saveProfile: "පැතිකඩ සුරකින්න",
    editProfile: "පැතිකඩ සංස්කරණය කරන්න",
    closeMessage: "පණිවිඩය වසන්න",

    accountDetails: "ගිණුම් විස්තර",
    personalInformation: "පුද්ගලික තොරතුරු",
    registeredPatientInfo: "ඔබගේ ලියාපදිංචි රෝගී තොරතුරු.",
    fullName: "සම්පූර්ණ නම",
    phoneNumber: "දුරකථන අංකය",
    enterPhoneNumber: "දුරකථන අංකය ඇතුළත් කරන්න",
    emailAddress: "ඊමේල් ලිපිනය",
    emailLoginNotice:
      "ඔබගේ ඊමේල් ලිපිනය පිවිසුම් හැඳුනුම්පත ලෙස භාවිතා වන අතර මෙම පිටුවෙන් වෙනස් කළ නොහැක.",

    accountSecurity: "ගිණුම් ආරක්ෂාව",
    changePassword: "මුරපදය වෙනස් කරන්න",
    chooseSecurePassword: "ආරක්ෂිත නව මුරපදයක් තෝරන්න.",
    currentPassword: "වත්මන් මුරපදය",
    enterCurrentPassword: "වත්මන් මුරපදය ඇතුළත් කරන්න",
    newPassword: "නව මුරපදය",
    minimumEight: "අවම වශයෙන් අක්ෂර 8 ක්",
    confirmPassword: "මුරපදය තහවුරු කරන්න",
    repeatNewPassword: "නව මුරපදය නැවත ඇතුළත් කරන්න",
    updatingPassword: "මුරපදය යාවත්කාලීන වෙමින්...",

    personalisation: "පුද්ගලීකරණය",
    preferences: "මනාප",
    preferenceDescription:
      "ඔබ කැමති භාෂාව, තේමාව සහ දැනුම්දීම් සැකසුම් තෝරන්න.",
    language: "භාෂාව",
    theme: "තේමාව",
    notifications: "දැනුම්දීම්",
    notificationsEnabled: "මුඛ සෞඛ්‍ය දැනුම්දීම් සක්‍රීයයි",
    notificationsDisabled: "මුඛ සෞඛ්‍ය දැනුම්දීම් අක්‍රීයයි",
    savePreferences: "මනාප සුරකින්න",
    light: "ආලෝක",
    dark: "අඳුරු",

    personalInfoSecure: "ඔබගේ පුද්ගලික තොරතුරු ආරක්ෂිතව ගබඩා කර ඇත.",
    profileImageLimit: "පැතිකඩ රූපය 2 MB ට අඩු විය යුතුය",
    uploadProfilePicture: "පැතිකඩ රූපය උඩුගත කරන්න",

    loadError: "ඔබගේ පැතිකඩ පූරණය කළ නොහැක.",
    invalidImage: "වලංගු රූප ගොනුවක් තෝරන්න.",
    imageTooLarge: "පැතිකඩ රූපය 2 MB ට අඩු විය යුතුය.",
    imageSelected:
      "පැතිකඩ රූපය තෝරා ඇත. එය තබා ගැනීමට පැතිකඩ සුරකින්න ක්ලික් කරන්න.",
    imageReadError: "තෝරාගත් රූපය කියවිය නොහැක.",
    invalidName: "වලංගු සම්පූර්ණ නමක් ඇතුළත් කරන්න.",
    preferencesSaved: "මනාප සාර්ථකව සුරකින ලදී.",
    profileUpdateError: "ඔබගේ පැතිකඩ යාවත්කාලීන කළ නොහැක.",

    completePasswordFields: "සියලු මුරපද ක්ෂේත්‍ර පුරවන්න.",
    passwordTooShort: "නව මුරපදය අවම වශයෙන් අක්ෂර 8 ක් විය යුතුය.",
    passwordMismatch: "නව මුරපදය සහ තහවුරු මුරපදය නොගැලපේ.",
    passwordSame: "නව මුරපදය වත්මන් මුරපදයට වෙනස් විය යුතුය.",
    passwordChanged: "මුරපදය සාර්ථකව වෙනස් කරන ලදී.",
    passwordChangeError: "මුරපදය වෙනස් කළ නොහැක.",

    english: "ඉංග්‍රීසි",
    sinhala: "සිංහල",
    tamil: "දෙමළ",
    show: "පෙන්වන්න",
    hide: "සඟවන්න",
  },

  ta: {
    pageTitle: "சுயவிவரம் மற்றும் அமைப்புகள்",
    loadingProfile: "உங்கள் சுயவிவரம் ஏற்றப்படுகிறது...",
    patientAccount: "நோயாளர் கணக்கு",
    active: "செயலில்",
    phoneNotProvided: "தொலைபேசி எண் வழங்கப்படவில்லை",
    heroDescription:
      "உங்கள் தனிப்பட்ட விவரங்கள், கணக்கு பாதுகாப்பு, மொழி, தீம் மற்றும் வாய்ச் சுகாதார அறிவிப்புகளை நிர்வகிக்கவும்.",
    cancel: "ரத்து செய்யவும்",
    saving: "சேமிக்கப்படுகிறது...",
    saveProfile: "சுயவிவரத்தை சேமிக்கவும்",
    editProfile: "சுயவிவரத்தை திருத்தவும்",
    closeMessage: "செய்தியை மூடவும்",

    accountDetails: "கணக்கு விவரங்கள்",
    personalInformation: "தனிப்பட்ட தகவல்கள்",
    registeredPatientInfo: "உங்கள் பதிவு செய்யப்பட்ட நோயாளர் தகவல்கள்.",
    fullName: "முழுப் பெயர்",
    phoneNumber: "தொலைபேசி எண்",
    enterPhoneNumber: "தொலைபேசி எண்ணை உள்ளிடவும்",
    emailAddress: "மின்னஞ்சல் முகவரி",
    emailLoginNotice:
      "உங்கள் மின்னஞ்சல் உள்நுழைவு அடையாளமாக பயன்படுத்தப்படுகிறது; இந்தப் பக்கத்திலிருந்து அதை மாற்ற முடியாது.",

    accountSecurity: "கணக்கு பாதுகாப்பு",
    changePassword: "கடவுச்சொல்லை மாற்றவும்",
    chooseSecurePassword: "பாதுகாப்பான புதிய கடவுச்சொல்லை தேர்ந்தெடுக்கவும்.",
    currentPassword: "தற்போதைய கடவுச்சொல்",
    enterCurrentPassword: "தற்போதைய கடவுச்சொல்லை உள்ளிடவும்",
    newPassword: "புதிய கடவுச்சொல்",
    minimumEight: "குறைந்தது 8 எழுத்துகள்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    repeatNewPassword: "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
    updatingPassword: "கடவுச்சொல் புதுப்பிக்கப்படுகிறது...",

    personalisation: "தனிப்பயனாக்கம்",
    preferences: "விருப்பங்கள்",
    preferenceDescription:
      "உங்கள் விருப்பமான மொழி, தீம் மற்றும் அறிவிப்பு அமைப்புகளைத் தேர்ந்தெடுக்கவும்.",
    language: "மொழி",
    theme: "தீம்",
    notifications: "அறிவிப்புகள்",
    notificationsEnabled: "வாய்ச் சுகாதார அறிவிப்புகள் செயல்படுத்தப்பட்டுள்ளன",
    notificationsDisabled: "வாய்ச் சுகாதார அறிவிப்புகள் முடக்கப்பட்டுள்ளன",
    savePreferences: "விருப்பங்களை சேமிக்கவும்",
    light: "ஒளி",
    dark: "இருள்",

    personalInfoSecure: "உங்கள் தனிப்பட்ட தகவல்கள் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன.",
    profileImageLimit: "சுயவிவரப் படம் 2 MB-க்கு குறைவாக இருக்க வேண்டும்",
    uploadProfilePicture: "சுயவிவரப் படத்தை பதிவேற்றவும்",

    loadError: "உங்கள் சுயவிவரத்தை ஏற்ற முடியவில்லை.",
    invalidImage: "சரியான படக் கோப்பைத் தேர்ந்தெடுக்கவும்.",
    imageTooLarge: "சுயவிவரப் படம் 2 MB-க்கு குறைவாக இருக்க வேண்டும்.",
    imageSelected:
      "சுயவிவரப் படம் தேர்ந்தெடுக்கப்பட்டது. அதை வைத்திருக்க சுயவிவரத்தை சேமிக்கவும் என்பதைக் கிளிக் செய்யவும்.",
    imageReadError: "தேர்ந்தெடுத்த படத்தை வாசிக்க முடியவில்லை.",
    invalidName: "சரியான முழுப் பெயரை உள்ளிடவும்.",
    preferencesSaved: "விருப்பங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன.",
    profileUpdateError: "உங்கள் சுயவிவரத்தை புதுப்பிக்க முடியவில்லை.",

    completePasswordFields: "அனைத்து கடவுச்சொல் புலங்களையும் நிரப்பவும்.",
    passwordTooShort: "புதிய கடவுச்சொல் குறைந்தது 8 எழுத்துகளைக் கொண்டிருக்க வேண்டும்.",
    passwordMismatch: "புதிய கடவுச்சொலும் உறுதிப்படுத்தும் கடவுச்சொலும் பொருந்தவில்லை.",
    passwordSame: "புதிய கடவுச்சொல் தற்போதைய கடவுச்சொல்லிலிருந்து வேறுபட்டதாக இருக்க வேண்டும்.",
    passwordChanged: "கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.",
    passwordChangeError: "உங்கள் கடவுச்சொல்லை மாற்ற முடியவில்லை.",

    english: "ஆங்கிலம்",
    sinhala: "සිංහල",
    tamil: "தமிழ்",
    show: "காட்டு",
    hide: "மறை",
  },
};

export default function Profile() {
  const storedUser = getStoredUser();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(
    createProfileState(storedUser)
  );

  const [originalProfile, setOriginalProfile] =
    useState(createProfileState(storedUser));

  const [passwordForm, setPasswordForm] =
    useState(initialPasswordForm);

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmNewPassword,
    setShowConfirmNewPassword,
  ] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });


  const languageCode =
    languageNameToCode(
      profile.language
    );

  const t =
    profileTranslations[
      languageCode
    ] ||
    profileTranslations.en;

  const initials = useMemo(() => {
    const names = profile.fullName
      .trim()
      .split(" ")
      .filter(Boolean);

    if (names.length === 0) {
      return "P";
    }

    return names
      .slice(0, 2)
      .map((name) => name[0].toUpperCase())
      .join("");
  }, [profile.fullName]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const response = await api.get("/profile/me");
        const user = response.data.user;

        const latestProfile =
          createProfileState(user);

        setProfile(latestProfile);
        setOriginalProfile(latestProfile);
        updateStoredUser(user);
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            t.loadError,
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (message.type === "error") {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: t.invalidImage,
      });

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text:
          t.imageTooLarge,
      });

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((currentProfile) => ({
        ...currentProfile,
        profileImage: reader.result,
      }));

      setEditingProfile(true);

      setMessage({
        type: "success",
        text:
          t.imageSelected,
      });
    };

    reader.onerror = () => {
      setMessage({
        type: "error",
        text: t.imageReadError,
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const startEditing = () => {
    setOriginalProfile(profile);
    setEditingProfile(true);
  };

  const cancelEditing = () => {
    setProfile(originalProfile);
    setEditingProfile(false);

    setMessage({
      type: "",
      text: "",
    });
  };

  const saveProfile = async ({
    closeEditing = true,
  } = {}) => {
    if (profile.fullName.trim().length < 2) {
      setMessage({
        type: "error",
        text: t.invalidName,
      });

      return;
    }

    try {
      setSavingProfile(true);

      const response = await api.patch(
        "/profile/me",
        {
          fullName: profile.fullName.trim(),
          phone: profile.phone.trim(),
          profileImage: profile.profileImage,
          language: profile.language,
          notificationsEnabled: Boolean(
            profile.notificationsEnabled
          ),
          theme: profile.theme,
        }
      );

      const updatedUser = response.data.user;

      const latestProfile =
        createProfileState(updatedUser);

      setProfile(latestProfile);
      setOriginalProfile(latestProfile);

      updateStoredUser(updatedUser);

      /*
       * Inform PatientLayout immediately that the
       * authenticated user's profile/preferences changed.
       * This makes the header notification bell update
       * without requiring a page refresh.
       */
      window.dispatchEvent(
        new Event("oralvista-user-updated")
      );

      if (closeEditing) {
        setEditingProfile(false);
      }

      setMessage({
        type: "success",
        text:
          response.data.message ||
          t.preferencesSaved,
      });
    } catch (error) {
      console.error(
        "Unable to save profile preferences:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          t.profileUpdateError,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    const currentPassword =
      passwordForm.currentPassword.trim();

    const newPassword =
      passwordForm.newPassword.trim();

    const confirmPassword =
      passwordForm.confirmPassword.trim();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setMessage({
        type: "error",
        text:
          t.completePasswordFields,
      });

      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text:
          t.passwordTooShort,
      });

      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setMessage({
        type: "error",
        text:
          t.passwordMismatch,
      });

      return;
    }

    if (
      currentPassword === newPassword
    ) {
      setMessage({
        type: "error",
        text:
          t.passwordSame,
      });

      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.patch(
        "/profile/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      setPasswordForm(
        initialPasswordForm
      );

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);

      setMessage({
        type: "success",
        text:
          response.data.message ||
          t.passwordChanged,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          t.passwordChangeError,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <PatientLayout title={t.pageTitle}>
        <div className="grid min-h-[500px] place-items-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <LoaderCircle
              size={38}
              className="mx-auto animate-spin text-teal-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              {t.loadingProfile}
            </p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title={t.pageTitle}>
      <div className="relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100">
        {/* Page background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("/images/patient-profile-bg.jpg")',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-teal-950/70 to-cyan-900/55" />

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-teal-200/15 blur-3xl" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-7">
          {/* Profile hero */}
          <section className="overflow-hidden rounded-[26px] border border-white/20 bg-white/10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center lg:p-7">
              <div className="relative mx-auto h-32 w-32 shrink-0 md:mx-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-2xl"
                  />
                ) : (
                  <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-cyan-100 to-teal-200 text-4xl font-black text-teal-800 shadow-2xl">
                    {initials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-1 right-0 grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-teal-600 text-white shadow-lg transition hover:scale-105 hover:bg-teal-700"
                  title={t.uploadProfilePicture}
                  aria-label={t.uploadProfilePicture}
                >
                  <Camera size={18} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              <div className="text-center md:text-left">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    <Sparkles size={13} />
                    {t.patientAccount}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                    <Check size={13} />
                    {t.active}
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white lg:text-4xl">
                  {profile.fullName}
                </h2>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/75 md:justify-start">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={15} />
                    {profile.email}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Phone size={15} />
                    {profile.phone ||
                      t.phoneNotProvided}
                  </span>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
                  {t.heroDescription}
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                {editingProfile ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={savingProfile}
                      className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                    >
                      {t.cancel}
                    </button>

                    <button
                      type="button"
                      onClick={() => saveProfile()}
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-800 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <>
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                          {t.saving}
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {t.saveProfile}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    <User size={17} />
                    {t.editProfile}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Success/error message */}
          {message.text && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium shadow-lg backdrop-blur-xl ${
                message.type === "success"
                  ? "border-emerald-300/40 bg-emerald-50/95 text-emerald-800"
                  : "border-red-300/40 bg-red-50/95 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              )}

              <span>{message.text}</span>

              <button
                type="button"
                onClick={() =>
                  setMessage({
                    type: "",
                    text: "",
                  })
                }
                className="ml-auto rounded-lg p-1 transition hover:bg-black/5"
                aria-label={t.closeMessage}
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Main cards */}
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {/* Personal information */}
            <section className="rounded-[24px] border border-white/30 bg-white/95 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                    {t.accountDetails}
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {t.personalInformation}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t.registeredPatientInfo}
                  </p>
                </div>

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                  <User size={21} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="profileFullName"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    {t.fullName}
                  </label>

                  <div
                    className={`flex h-12 items-center gap-3 rounded-xl border px-4 transition ${
                      editingProfile
                        ? "border-teal-300 bg-white focus-within:ring-4 focus-within:ring-teal-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <User
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      id="profileFullName"
                      name="fullName"
                      type="text"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none disabled:cursor-default"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profilePhone"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    {t.phoneNumber}
                  </label>

                  <div
                    className={`flex h-12 items-center gap-3 rounded-xl border px-4 transition ${
                      editingProfile
                        ? "border-teal-300 bg-white focus-within:ring-4 focus-within:ring-teal-100"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <Phone
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      id="profilePhone"
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      disabled={!editingProfile}
                      placeholder={t.enterPhoneNumber}
                      className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 outline-none disabled:cursor-default"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profileEmail"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    {t.emailAddress}
                  </label>

                  <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <Mail
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      id="profileEmail"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full border-0 bg-transparent text-sm font-medium text-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-700">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                {t.emailLoginNotice}
              </div>
            </section>

            {/* Change password */}
            <section className="rounded-[24px] border border-white/30 bg-white/95 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-600">
                    {t.accountSecurity}
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {t.changePassword}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t.chooseSecurePassword}
                  </p>
                </div>

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
                  <ShieldCheck size={21} />
                </div>
              </div>

              <form
                className="space-y-3"
                onSubmit={changePassword}
              >
                <PasswordInput
                  id="currentPassword"
                  name="currentPassword"
                  label={t.currentPassword}
                  placeholder={t.enterCurrentPassword}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  showPassword={showCurrentPassword}
                  setShowPassword={
                    setShowCurrentPassword
                  }
                  autoComplete="current-password"
                  t={t}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    label={t.newPassword}
                    placeholder={t.minimumEight}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    showPassword={showNewPassword}
                    setShowPassword={
                      setShowNewPassword
                    }
                    autoComplete="new-password"
                  t={t}
                  />

                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t.confirmPassword}
                    placeholder={t.repeatNewPassword}
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    showPassword={
                      showConfirmNewPassword
                    }
                    setShowPassword={
                      setShowConfirmNewPassword
                    }
                    autoComplete="new-password"
                    t={t}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      {t.updatingPassword}
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      {t.changePassword}
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* Preferences */}
          <section className="mt-4 rounded-[24px] border border-white/30 bg-white/95 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                  {t.personalisation}
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-900">
                  {t.preferences}
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {t.preferenceDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.2fr_auto] xl:items-end">
                <div>
                  <label
                    htmlFor="profileLanguage"
                    className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                  >
                    <Languages size={15} />
                    {t.language}
                  </label>

                  <select
                    id="profileLanguage"
                    name="language"
                    value={profile.language}
                    onChange={handleProfileChange}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="English">
                      {t.english}
                    </option>
                    <option value="Sinhala">
                      {t.sinhala}
                    </option>
                    <option value="Tamil">
                      {t.tamil}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profileTheme"
                    className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
                  >
                    <Palette size={15} />
                    {t.theme}
                  </label>

                  <select
                    id="profileTheme"
                    name="theme"
                    value={profile.theme}
                    onChange={handleProfileChange}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  >
                    <option value="Light">
                      {t.light}
                    </option>
                    <option value="Dark">
                      {t.dark}
                    </option>
                  </select>
                </div>

                <label className="flex h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 transition hover:border-teal-200 hover:bg-teal-50/40">
                  <span className="flex min-w-0 items-center gap-3">
                    <Bell
                      size={18}
                      className={
                        profile.notificationsEnabled
                          ? "shrink-0 text-teal-600"
                          : "shrink-0 text-slate-400"
                      }
                    />

                    <span className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-800">
                        {t.notifications}
                      </strong>

                      <small className="block truncate text-[10px] text-slate-400">
                        {profile.notificationsEnabled
                          ? t.notificationsEnabled
                          : t.notificationsDisabled}
                      </small>
                    </span>
                  </span>

                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      profile.notificationsEnabled
                        ? "bg-teal-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={
                        profile.notificationsEnabled
                      }
                      onChange={handleProfileChange}
                      className="sr-only"
                    />

                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        profile.notificationsEnabled
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    saveProfile({
                      closeEditing: false,
                    })
                  }
                  disabled={savingProfile}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-5 text-sm font-bold text-teal-700 transition hover:-translate-y-0.5 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 xl:col-span-1"
                >
                  {savingProfile ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      {t.savePreferences}
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-xs text-white/60 backdrop-blur-xl sm:flex-row">
            <span>
              {t.personalInfoSecure}
            </span>

            <span className="inline-flex items-center gap-2">
              <Upload size={14} />
              {t.profileImageLimit}
            </span>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}

function PasswordInput({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete,
  t,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold text-slate-700"
      >
        {label}
      </label>

      <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-teal-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
        <Lock
          size={18}
          className="shrink-0 text-slate-400"
        />

        <input
          id={id}
          name={name}
          type={
            showPassword ? "text" : "password"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full min-w-0 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (currentValue) => !currentValue
            )
          }
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-teal-50 hover:text-teal-700"
          aria-label={
            showPassword
              ? `${t?.hide || "Hide"} ${label}`
              : `${t?.show || "Show"} ${label}`
          }
        >
          {showPassword ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}