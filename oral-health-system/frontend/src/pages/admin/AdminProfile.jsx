import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import api from "../../api/axios.js";

import {
  updateStoredUser,
} from "../../api/authStorage.js";

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getInitials(fullName = "") {
  const names = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 0) {
    return "A";
  }

  return names
    .slice(0, 2)
    .map((name) =>
      name[0].toUpperCase()
    )
    .join("");
}

export default function AdminProfile() {
  const imageInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [fullName, setFullName] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [profileMessage, setProfileMessage] =
    useState({
      type: "",
      text: "",
    });

  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState({
    type: "",
    text: "",
  });

  const [passwordForm, setPasswordForm] =
    useState(initialPasswordForm);

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const loadAdminProfile =
    useCallback(async () => {
      try {
        setLoading(true);

        setProfileMessage({
          type: "",
          text: "",
        });

        const response = await api.get(
          "/profile/me"
        );

        const currentUser =
          response.data?.user;

        setUser(currentUser);
        setFullName(
          currentUser?.fullName || ""
        );
        setProfileImage(
          currentUser?.profileImage || ""
        );

        if (currentUser) {
          updateStoredUser(currentUser);
        }
      } catch (error) {
        console.error(
          "Load admin profile error:",
          error
        );

        setProfileMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Unable to load the administrator profile.",
        });
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAdminProfile();
  }, [loadAdminProfile]);

  const initials = useMemo(
    () => getInitials(fullName),
    [fullName]
  );

  const roleName =
    user?.role === "admin"
      ? "Super Admin"
      : user?.role || "Super Admin";

  const handleImageSelection = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setProfileMessage({
        type: "error",
        text:
          "Please select a JPG, PNG or WebP image.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({
        type: "error",
        text:
          "The profile image must be smaller than 2 MB.",
      });

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(
        String(reader.result)
      );

      setProfileMessage({
        type: "",
        text: "",
      });
    };

    reader.onerror = () => {
      setProfileMessage({
        type: "error",
        text:
          "The selected image could not be read.",
      });
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setProfileMessage({
      type: "",
      text: "",
    });
  };

  const handleProfileSubmit = async (
    event
  ) => {
    event.preventDefault();

    const normalizedName =
      fullName.trim();

    if (normalizedName.length < 2) {
      setProfileMessage({
        type: "error",
        text:
          "Please enter a valid administrator name.",
      });

      return;
    }

    try {
      setSavingProfile(true);

      setProfileMessage({
        type: "",
        text: "",
      });

      const response = await api.patch(
        "/profile/me",
        {
          fullName: normalizedName,
          profileImage,
        }
      );

      const updatedUser =
        response.data?.user;

      setUser(updatedUser);
      setFullName(
        updatedUser?.fullName || ""
      );
      setProfileImage(
        updatedUser?.profileImage || ""
      );

      updateStoredUser(updatedUser);

      /*
       * Allows AdminLayout to immediately
       * refresh its header information.
       */
      window.dispatchEvent(
        new Event("storage")
      );

      setProfileMessage({
        type: "success",
        text:
          response.data?.message ||
          "Profile updated successfully.",
      });
    } catch (error) {
      console.error(
        "Update admin profile error:",
        error
      );

      setProfileMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to update the profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordInputChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage({
      type: "",
      text: "",
    });
  };

  const handlePasswordSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "Please complete all password fields.",
      });

      return;
    }

    if (
      passwordForm.newPassword.length < 8
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "The new password must contain at least 8 characters.",
      });

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage({
        type: "error",
        text:
          "New password and confirmation do not match.",
      });

      return;
    }

    try {
      setChangingPassword(true);

      setPasswordMessage({
        type: "",
        text: "",
      });

      const response = await api.patch(
        "/profile/change-password",
        {
          currentPassword:
            passwordForm.currentPassword,
          newPassword:
            passwordForm.newPassword,
          confirmPassword:
            passwordForm.confirmPassword,
        }
      );

      setPasswordForm(
        initialPasswordForm
      );

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordMessage({
        type: "success",
        text:
          response.data?.message ||
          "Password changed successfully.",
      });
    } catch (error) {
      console.error(
        "Change admin password error:",
        error
      );

      setPasswordMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to change the password.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Admin Profile"
        subtitle="Manage your profile information"
      >
        <div className="admin-profile-loading">
          <LoaderCircle size={34} />

          <strong>
            Loading administrator profile
          </strong>

          <span>
            Retrieving information from
            MongoDB...
          </span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Admin Profile"
      subtitle="Manage your profile information"
    >
      <div className="admin-profile-page">
        <div className="admin-profile-page-overlay" />

        <div className="admin-profile-content">
          {/* Hero */}
          <section className="admin-profile-hero">
            <div className="admin-profile-hero-overlay" />

            <div className="admin-profile-hero-copy">
              <span className="admin-profile-hero-badge">
                <Sparkles size={15} />
                OralVista administrator
              </span>

              <h2>
                Manage your administrator identity
              </h2>

              <p>
                Update your personal information,
                upload a profile photograph and
                securely change your administrator
                password.
              </p>

              <div className="admin-profile-hero-tags">
                <span>
                  <ShieldCheck size={15} />
                  Super administrator
                </span>

                <span>
                  <User size={15} />
                  MongoDB profile
                </span>

                <span>
                  <LockKeyhole size={15} />
                  Secure password update
                </span>
              </div>
            </div>

            <div className="admin-profile-hero-account">
              <div className="admin-profile-hero-avatar">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div>
                <small>
                  Signed in administrator
                </small>

                <strong>
                  {fullName ||
                    "Administrator"}
                </strong>

                <span>
                  {user?.email ||
                    "admin@oralvista.lk"}
                </span>
              </div>
            </div>
          </section>

          <div className="admin-profile-main-grid">
            {/* Profile card */}
            <section className="admin-profile-picture-card">
              <div className="admin-profile-picture-background" />

              <div className="admin-profile-large-avatar">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                  />
                ) : (
                  <span>{initials}</span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  aria-label="Choose profile image"
                >
                  <Camera size={20} />
                </button>
              </div>

              <h3>
                {fullName ||
                  "Administrator"}
              </h3>

              <p>{roleName}</p>

              <span className="admin-profile-active-badge">
                <CheckCircle2 size={13} />
                Active account
              </span>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={
                  handleImageSelection
                }
              />

              <div className="admin-profile-image-actions">
                <button
                  type="button"
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                >
                  <ImagePlus size={17} />
                  Choose picture
                </button>

                <button
                  type="button"
                  className="admin-profile-remove-image"
                  onClick={removeProfileImage}
                  disabled={!profileImage}
                >
                  <Trash2 size={17} />
                  Remove
                </button>
              </div>

              <div className="admin-profile-image-note">
                <Camera size={17} />

                <p>
                  Upload a JPG, PNG or WebP
                  image. The maximum file size
                  is 2 MB.
                </p>
              </div>
            </section>

            {/* Profile details */}
            <section className="admin-profile-details-card">
              <div className="admin-profile-section-heading">
                <div>
                  <span>
                    Profile information
                  </span>

                  <h3>
                    Administrator Details
                  </h3>

                  <p>
                    Name and profile picture are
                    saved directly in MongoDB.
                  </p>
                </div>

                <div>
                  <User size={23} />
                </div>
              </div>

              {profileMessage.text && (
                <MessageBox
                  message={profileMessage}
                />
              )}

              <form
                className="admin-profile-form"
                onSubmit={
                  handleProfileSubmit
                }
              >
                <label>
                  <span>Full Name</span>

                  <div className="admin-profile-input">
                    <User size={19} />

                    <input
                      type="text"
                      value={fullName}
                      placeholder="Administrator name"
                      maxLength={80}
                      onChange={(event) => {
                        setFullName(
                          event.target.value
                        );

                        setProfileMessage({
                          type: "",
                          text: "",
                        });
                      }}
                    />
                  </div>
                </label>

                <label>
                  <span>
                    Administrator Email
                  </span>

                  <div className="admin-profile-input admin-profile-readonly-input">
                    <Mail size={19} />

                    <input
                      type="email"
                      value={
                        user?.email || ""
                      }
                      readOnly
                    />

                    <small>Settings</small>
                  </div>

                  <p>
                    Change the administrator
                    email from the Settings page.
                  </p>
                </label>

                <label>
                  <span>Role</span>

                  <div className="admin-profile-input admin-profile-readonly-input">
                    <ShieldCheck size={19} />

                    <input
                      type="text"
                      value={roleName}
                      readOnly
                    />

                    <small>Fixed</small>
                  </div>

                  <p>
                    The administrator role cannot
                    be changed from this page.
                  </p>
                </label>

                <button
                  type="submit"
                  className="admin-profile-save-button"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="admin-profile-spinner"
                      />
                      Saving profile...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* Password card */}
          <section className="admin-password-card">
            <div className="admin-profile-section-heading">
              <div>
                <span>
                  Account security
                </span>

                <h3>
                  Change Administrator Password
                </h3>

                <p>
                  Verify your existing password
                  before selecting a new one.
                </p>
              </div>

              <div className="admin-password-heading-icon">
                <KeyRound size={23} />
              </div>
            </div>

            {passwordMessage.text && (
              <MessageBox
                message={passwordMessage}
              />
            )}

            <form
              className="admin-password-form"
              onSubmit={
                handlePasswordSubmit
              }
            >
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={
                  passwordForm.currentPassword
                }
                placeholder="Enter current password"
                visible={
                  showCurrentPassword
                }
                onChange={
                  handlePasswordInputChange
                }
                onToggle={() =>
                  setShowCurrentPassword(
                    (previous) => !previous
                  )
                }
              />

              <PasswordInput
                label="New Password"
                name="newPassword"
                value={
                  passwordForm.newPassword
                }
                placeholder="Minimum 8 characters"
                visible={showNewPassword}
                onChange={
                  handlePasswordInputChange
                }
                onToggle={() =>
                  setShowNewPassword(
                    (previous) => !previous
                  )
                }
              />

              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={
                  passwordForm.confirmPassword
                }
                placeholder="Repeat new password"
                visible={
                  showConfirmPassword
                }
                onChange={
                  handlePasswordInputChange
                }
                onToggle={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
              />

              <div className="admin-password-information">
                <ShieldCheck size={19} />

                <p>
                  The new password will be
                  encrypted before it is stored
                  in MongoDB.
                </p>
              </div>

              <button
                type="submit"
                className="admin-password-save-button"
                disabled={
                  changingPassword
                }
              >
                {changingPassword ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="admin-profile-spinner"
                    />
                    Changing password...
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function PasswordInput({
  label,
  name,
  value,
  placeholder,
  visible,
  onChange,
  onToggle,
}) {
  const autoComplete =
    name === "currentPassword"
      ? "current-password"
      : "new-password";
  return (
    <label>
      <span>{label}</span>

      <div className="admin-profile-input">
        <LockKeyhole size={19} />

        <input
          type={
            visible ? "text" : "password"
          }
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </label>
  );
}

function MessageBox({ message }) {
  return (
    <div
      className={`admin-profile-message ${
        message.type === "success"
          ? "admin-profile-message-success"
          : "admin-profile-message-error"
      }`}
    >
      {message.type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertCircle size={18} />
      )}

      <span>{message.text}</span>
    </div>
  );
}