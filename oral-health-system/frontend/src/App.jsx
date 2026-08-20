import React from "react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* =====================================================
   PUBLIC PATIENT PAGES
===================================================== */

import LandingPage from "./pages/patient/LandingPage.jsx";
import RegisterPage from "./pages/patient/RegisterPage.jsx";
import LoginPage from "./pages/patient/LoginPage.jsx";

/* =====================================================
   PROTECTED PATIENT PAGES
===================================================== */

import Dashboard from "./pages/patient/Dashboard.jsx";
import SymptomPrediction from "./pages/patient/SymptomPrediction.jsx";
import PredictionResult from "./pages/patient/PredictionResult.jsx";
import PredictionHistory from "./pages/patient/PredictionHistory.jsx";
import ImagePrediction from "./pages/patient/ImagePrediction.jsx";
import AIChatAssistant from "./pages/patient/AIChatAssistant.jsx";
import AIOralHealthTutor from "./pages/patient/AIOralHealthTutor.jsx";
import ClinicFinder from "./pages/patient/ClinicFinder.jsx";
import Newsletter from "./pages/patient/Newsletter.jsx";
import Profile from "./pages/patient/Profile.jsx";

/* =====================================================
   ADMIN PAGES
===================================================== */

import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import ClinicManagement from "./pages/admin/ClinicManagement.jsx";
import NewsletterManagement from "./pages/admin/NewsletterManagement.jsx";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

/* =====================================================
   404 PAGE
===================================================== */

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div>
        <h1>404</h1>

        <p>
          The requested page could not be found.
        </p>

        <Link to="/">
          Return to home
        </Link>
      </div>
    </main>
  );
}

/* =====================================================
   APPLICATION ROUTES
===================================================== */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />


        {/* =================================================
            PROTECTED PATIENT ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["patient"]}
            />
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/symptom-prediction"
            element={<SymptomPrediction />}
          />

          <Route
            path="/prediction-result"
            element={<PredictionResult />}
          />

          <Route
            path="/prediction-history"
            element={<PredictionHistory />}
          />

          <Route
            path="/image-prediction"
            element={<ImagePrediction />}
          />

          <Route
            path="/chat-assistant"
            element={<AIChatAssistant />}
          />

          <Route
            path="/ai-tutor"
            element={<AIOralHealthTutor />}
          />

          <Route
            path="/clinic-finder"
            element={<ClinicFinder />}
          />

          <Route
            path="/newsletter"
            element={<Newsletter />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Profile />}
          />

        </Route>


        {/* =================================================
            PROTECTED ADMIN ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<UserManagement />}
          />

          <Route
            path="/admin/clinics"
            element={<ClinicManagement />}
          />

          <Route
            path="/admin/newsletters"
            element={<NewsletterManagement />}
          />

          <Route
            path="/admin/analytics"
            element={<AnalyticsDashboard />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />

        </Route>


        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}