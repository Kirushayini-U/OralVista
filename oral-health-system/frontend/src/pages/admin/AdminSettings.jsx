import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import api from "../../api/axios.js";

import {
  getStoredUser,
  updateStoredUser,
} from "../../api/authStorage.js";

export default function AdminSettings() {
  const storedUser = getStoredUser();

  const [adminEmail, setAdminEmail] =
    useState(storedUser?.email || "");

  const [originalEmail, setOriginalEmail] =
    useState(storedUser?.email || "");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      const response = await api.get(
        "/admin/settings"
      );

      const email =
        response.data?.settings?.adminEmail ||
        "";

      setAdminEmail(email);
      setOriginalEmail(email);

      if (response.data?.admin) {
        updateStoredUser(
          response.data.admin
        );
      }
    } catch (error) {
      console.error(
        "Load admin settings error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to load administrator settings.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const emailChanged =
    adminEmail.trim().toLowerCase() !==
    originalEmail.trim().toLowerCase();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = adminEmail
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setMessage({
        type: "error",
        text:
          "Administrator email is required.",
      });

      return;
    }

    try {
      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      const response = await api.patch(
        "/admin/settings",
        {
          adminEmail: normalizedEmail,
        }
      );

      const updatedEmail =
        response.data?.settings?.adminEmail;

      setAdminEmail(updatedEmail);
      setOriginalEmail(updatedEmail);

      if (response.data?.user) {
        updateStoredUser(
          response.data.user
        );

        window.dispatchEvent(
          new Event("storage")
        );
      }

      setMessage({
        type: "success",
        text:
          response.data?.message ||
          "Administrator email updated successfully.",
      });
    } catch (error) {
      console.error(
        "Save admin settings error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to save administrator settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Settings"
      subtitle="Manage administrator account settings"
    >
      <div className="admin-settings-page">
        <section className="admin-settings-intro">
          <div className="admin-settings-intro-copy">
            <span className="admin-settings-label">
              <Sparkles size={15} />
              OralVista configuration
            </span>

            <h2>
              Administrator Settings
            </h2>

            <p>
              Review the OralVista system identity
              and update the administrator login
              email stored in MongoDB.
            </p>
          </div>

          <div className="admin-settings-security-card">
            <div>
              <ShieldCheck size={24} />
            </div>

            <span>
              <small>Access level</small>
              <strong>Super Administrator</strong>
              <p>Protected account settings</p>
            </span>
          </div>
        </section>

        {message.text && (
          <div
            className={`admin-settings-message ${
              message.type === "success"
                ? "admin-settings-message-success"
                : "admin-settings-message-error"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={19} />
            ) : (
              <AlertCircle size={19} />
            )}

            <span>{message.text}</span>
          </div>
        )}

        <section className="admin-settings-card">
          <div className="admin-settings-card-heading">
            <div>
              <span>
                Administrator configuration
              </span>

              <h3>
                System and Login Information
              </h3>

              <p>
                The administrator email is saved
                directly in the MongoDB users
                collection.
              </p>
            </div>

            <div className="admin-settings-heading-icon">
              <Settings2 size={23} />
            </div>
          </div>

          {loading ? (
            <div className="admin-settings-loading">
              <LoaderCircle size={28} />

              <span>
                Loading administrator settings...
              </span>
            </div>
          ) : (
            <form
              className="admin-settings-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-setting-field">
                <label htmlFor="siteName">
                  Site Name
                </label>

                <div className="admin-setting-input">
                  <LockKeyhole size={19} />

                  <input
                    id="siteName"
                    type="text"
                    value="OralVista System"
                    readOnly
                  />

                  <span>Fixed</span>
                </div>

                <p>
                  The site name is fixed and cannot be
                  changed from this page.
                </p>
              </div>

              <div className="admin-setting-field">
                <label htmlFor="adminEmail">
                  Administrator Email
                </label>

                <div className="admin-setting-input">
                  <Mail size={19} />

                  <input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    placeholder="admin@oralvista.lk"
                    autoComplete="email"
                    onChange={(event) => {
                      setAdminEmail(
                        event.target.value
                      );

                      setMessage({
                        type: "",
                        text: "",
                      });
                    }}
                  />
                </div>

                <p>
                  This email is used for administrator
                  login. Changing it updates the admin
                  document in MongoDB.
                </p>
              </div>

              <div className="admin-settings-warning">
                <ShieldCheck size={19} />

                <div>
                  <strong>
                    Important login information
                  </strong>

                  <p>
                    After changing the email, use the
                    new address during your next
                    administrator login. Your password
                    remains unchanged.
                  </p>
                </div>
              </div>

              <div className="admin-settings-actions">
                <button
                  type="button"
                  className="admin-settings-reset-button"
                  onClick={() => {
                    setAdminEmail(originalEmail);

                    setMessage({
                      type: "",
                      text: "",
                    });
                  }}
                  disabled={
                    saving || !emailChanged
                  }
                >
                  <RefreshCcw size={17} />
                  Reset
                </button>

                <button
                  type="submit"
                  className="admin-settings-save-button"
                  disabled={
                    saving ||
                    !emailChanged ||
                    !adminEmail.trim()
                  }
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="admin-settings-spinner"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}