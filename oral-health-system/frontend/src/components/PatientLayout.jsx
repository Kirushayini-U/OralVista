import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  BellOff,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";

import { patientNav } from "./navConfig.js";
import { translations } from "../i18n/translations.js";
import api from "../api/axios.js";

import {
  clearAuthentication,
  getStoredUser,
  updateStoredUser,
} from "../api/authStorage.js";


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

const routeTranslationKey = {
  "/dashboard": "dashboard",
  "/symptom-prediction": "symptomPrediction",
  "/prediction-history": "predictionHistory",
  "/image-prediction": "imagePrediction",
  "/ai-tutor": "educationQuiz",
  "/chat-assistant": "aiAssistant",
  "/clinic-finder": "clinicFinder",
  "/newsletter": "newsletter",
  "/profile": "profile",
  "/settings": "settings",
};

export default function PatientLayout({
  children,
  title,
  breadcrumb,
}) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loggedInUser, setLoggedInUser] =
    useState(getStoredUser());

  const [changingLanguage, setChangingLanguage] =
    useState(false);

  /*
   * =========================================================
   * LOAD CURRENT LOGGED-IN PATIENT
   * =========================================================
   */
  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await api.get(
          "/profile/me"
        );

        if (!isMounted) {
          return;
        }

        const user = response.data.user;

        setLoggedInUser(user);

        updateStoredUser(user);
      } catch (error) {
        console.error(
          "Unable to load current patient:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          clearAuthentication();

          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  /*
   * =========================================================
   * KEEP PATIENT LAYOUT SYNCHRONISED WITH PROFILE CHANGES
   * =========================================================
   *
   * Profile.jsx can dispatch:
   *
   * window.dispatchEvent(
   *   new Event("oralvista-user-updated")
   * );
   *
   * after saving preferences.
   */
  useEffect(() => {
    const refreshStoredUser = () => {
      const latestUser =
        getStoredUser();

      if (latestUser) {
        setLoggedInUser(
          latestUser
        );
      }
    };

    window.addEventListener(
      "oralvista-user-updated",
      refreshStoredUser
    );

    /*
     * Also listen for browser storage changes.
     */
    window.addEventListener(
      "storage",
      refreshStoredUser
    );

    return () => {
      window.removeEventListener(
        "oralvista-user-updated",
        refreshStoredUser
      );

      window.removeEventListener(
        "storage",
        refreshStoredUser
      );
    };
  }, []);

  /*
   * =========================================================
   * USER INFORMATION
   * =========================================================
   */

  const userName =
    loggedInUser?.fullName?.trim() ||
    "Patient";

  const userEmail =
    loggedInUser?.email || "";

  const userRole =
    loggedInUser?.role === "patient"
      ? "Patient"
      : loggedInUser?.role ||
        "Patient";

  const profileImage =
    loggedInUser?.profileImage || "";

  /*
   * IMPORTANT:
   * This value belongs to the currently
   * authenticated patient.
   */
  const notificationsEnabled =
    loggedInUser
      ?.notificationsEnabled ??
    true;

  const selectedLanguage =
    loggedInUser?.language || "English";

  const selectedLanguageCode =
    languageNameToCode(
      selectedLanguage
    );

  const t =
    translations[selectedLanguageCode] ||
    translations.en;

  /*
   * =========================================================
   * USER INITIALS
   * =========================================================
   */

  const initials = useMemo(() => {
    const names = userName
      .split(" ")
      .filter(Boolean);

    if (names.length === 0) {
      return "P";
    }

    return names
      .slice(0, 2)
      .map((name) =>
        name[0].toUpperCase()
      )
      .join("");
  }, [userName]);

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    clearAuthentication();

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * =========================================================
   * SIDEBAR
   * =========================================================
   */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /*
   * =========================================================
   * LANGUAGE SWITCHER
   * =========================================================
   */

  const handleLanguageChange = async (
    event
  ) => {
    const newLanguage =
      event.target.value;

    if (
      !["English", "Sinhala", "Tamil"].includes(
        newLanguage
      )
    ) {
      return;
    }

    try {
      setChangingLanguage(true);

      const response = await api.patch(
        "/profile/me",
        {
          language: newLanguage,
        }
      );

      const updatedUser =
        response.data.user;

      setLoggedInUser(updatedUser);
      updateStoredUser(updatedUser);

      window.dispatchEvent(
        new Event(
          "oralvista-user-updated"
        )
      );
    } catch (error) {
      console.error(
        "Unable to update language:",
        error
      );
    } finally {
      setChangingLanguage(false);
    }
  };

  /*
   * =========================================================
   * NOTIFICATION BUTTON
   * =========================================================
   */

  const handleNotifications = () => {
    if (!notificationsEnabled) {
      return;
    }

    /*
     * We can later replace this with an actual
     * notification dropdown containing:
     *
     * - New newsletter available
     * - Oral-health reminders
     * - Account notifications
     */
    console.log(
      "Patient notifications opened."
    );
  };

  return (
    <div className="patient-layout-shell">

      {/* =====================================================
          MOBILE SIDEBAR BACKDROP
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="patient-sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`patient-modern-sidebar ${
          sidebarOpen
            ? "patient-sidebar-open"
            : ""
        }`}
      >
        <div className="patient-sidebar-image-overlay" />

        <div className="patient-sidebar-content">

          {/* Brand */}
          <div className="patient-sidebar-brand">

            <Link
              to="/dashboard"
              className="patient-sidebar-brand-link"
              onClick={closeSidebar}
            >
              <div className="patient-sidebar-logo-box">

                <img
                  src="/images/oralvista-logo.png"
                  alt="OralVista logo"
                />

              </div>

              <div>
                <h2>
                  OralVista
                </h2>

                <p>
                  {t.patientPortal}
                </p>
              </div>
            </Link>

            <button
              type="button"
              className="patient-sidebar-close"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>

          </div>

          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <div className="patient-sidebar-welcome">

            <div className="patient-sidebar-welcome-avatar">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={userName}
                />
              ) : (
                <span>
                  {initials}
                </span>
              )}

            </div>

            <div>
              <small>
                {t.welcomeBack}
              </small>

              <strong>
                {userName}
              </strong>

              <span>
                {loggedInUser?.role === "patient"
                  ? t.patient
                  : userRole}
              </span>
            </div>

          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="patient-sidebar-nav">

            <p className="patient-sidebar-label">
              {t.mainMenu}
            </p>

            {patientNav.map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={
                    closeSidebar
                  }
                  className={({
                    isActive,
                  }) =>
                    `patient-sidebar-link ${
                      isActive
                        ? "patient-sidebar-link-active"
                        : ""
                    }`
                  }
                >
                  <span className="patient-sidebar-link-icon">
                    <item.icon
                      size={19}
                    />
                  </span>

                  <span>
                    {t[
                      routeTranslationKey[
                        item.to
                      ]
                    ] || item.label}
                  </span>

                </NavLink>
              )
            )}

          </nav>

          {/* =================================================
              SIDEBAR FOOTER
          ================================================= */}

          <div className="patient-sidebar-footer">

            <div className="patient-sidebar-help-card">

              <strong>
                Need oral-health help?
              </strong>

              <p>
                Use the AI assistant or visit
                your nearest dental clinic.
              </p>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="patient-sidebar-logout"
            >
              <LogOut size={18} />

              {t.logout}
            </button>

          </div>

        </div>
      </aside>

      {/* =====================================================
          MAIN PATIENT AREA
      ===================================================== */}

      <div className="patient-layout-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="patient-layout-header">

          <div className="patient-header-left">

            <button
              type="button"
              className="patient-mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div>

              {breadcrumb && (
                <p className="patient-header-breadcrumb">
                  {breadcrumb}
                </p>
              )}

              <h1>
                {title}
              </h1>

            </div>
          </div>

          {/* =================================================
              HEADER RIGHT SIDE
          ================================================= */}

          <div className="patient-header-actions">

            {/* ===============================================
                LANGUAGE SWITCHER
            =============================================== */}

            <select
              value={selectedLanguage}
              onChange={
                handleLanguageChange
              }
              disabled={
                changingLanguage
              }
              aria-label="Select language"
              title="Language"
              style={{
                height: "42px",
                minWidth: "112px",
                padding:
                  "0 34px 0 12px",
                border:
                  "1px solid #dbeafe",
                borderRadius: "13px",
                background:
                  "rgba(255, 255, 255, 0.92)",
                color: "#35556a",
                fontSize: "12px",
                fontWeight: 700,
                outline: "none",
                cursor:
                  changingLanguage
                    ? "wait"
                    : "pointer",
              }}
            >
              <option value="English">
                English
              </option>

              <option value="Sinhala">
                සිංහල
              </option>

              <option value="Tamil">
                தமிழ்
              </option>
            </select>

            {/* ===============================================
                NOTIFICATION BUTTON
            =============================================== */}

            <button
              type="button"
              onClick={
                handleNotifications
              }
              disabled={
                !notificationsEnabled
              }
              className="patient-notification-button"
              aria-label={
                notificationsEnabled
                  ? "Notifications enabled"
                  : "Notifications disabled"
              }
              title={
                notificationsEnabled
                  ? "Notifications enabled"
                  : "Notifications are disabled in Profile settings"
              }

              /*
               * Inline styling means you do NOT
               * need additional index.css code.
               */
              style={
                !notificationsEnabled
                  ? {
                      opacity: 0.4,
                      cursor:
                        "not-allowed",
                    }
                  : {
                      opacity: 1,
                      cursor:
                        "pointer",
                    }
              }
            >

              {notificationsEnabled ? (
                <Bell size={20} />
              ) : (
                <BellOff size={20} />
              )}

              {notificationsEnabled && (
                <span />
              )}

            </button>

            {/* ===============================================
                PATIENT PROFILE
            =============================================== */}

            <Link
              to="/profile"
              className="patient-header-profile"
            >

              <div className="patient-header-avatar">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                  />
                ) : (
                  <span>
                    {initials}
                  </span>
                )}

              </div>

              <div className="patient-header-user-text">

                <strong>
                  {userName}
                </strong>

                <span>
                  {userRole}
                </span>

                {userEmail && (
                  <small>
                    {userEmail}
                  </small>
                )}

              </div>

            </Link>

          </div>

        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="patient-layout-content">
          {children}
        </main>

      </div>
    </div>
  );
}

/* ===========================================================
   OPTIONAL FLOATING ACTION BUTTON
=========================================================== */

export function FabHint() {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700"
      aria-label="Quick action"
    >
      <Plus size={22} />
    </button>
  );
}