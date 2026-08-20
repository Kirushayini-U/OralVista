import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import api from '../../api/axios.js';
import {
  getStoredToken,
  getStoredUser,
  saveAuthentication,
} from '../../api/authStorage.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const registeredEmail =
    location.state?.registeredEmail ||
    localStorage.getItem('rememberedPatientEmail') ||
    '';

  const [form, setForm] = useState({
    email: registeredEmail,
    password: '',
    confirmPassword: '',
    rememberEmail: Boolean(
      localStorage.getItem('rememberedPatientEmail')
    ),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: location.state?.registrationSuccess ? 'success' : '',
    text: location.state?.registrationSuccess
      ? 'Registration successful. Sign in using your registered email and password.'
      : '',
  });

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user?.role === 'patient') {
      navigate('/dashboard', {
        replace: true,
      });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (message.type === 'error') {
      setMessage({
        type: '',
        text: '',
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Password and confirm password do not match.',
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error(
          'The server did not return valid login information.'
        );
      }

      if (user.role !== 'patient') {
        throw new Error(
          'This account is not registered as a patient.'
        );
      }

      saveAuthentication(token, user);

      if (form.rememberEmail) {
        localStorage.setItem(
          'rememberedPatientEmail',
          user.email
        );
      } else {
        localStorage.removeItem('rememberedPatientEmail');
      }

      setMessage({
        type: 'success',
        text: 'Login successful. Opening your dashboard...',
      });

      setTimeout(() => {
        navigate('/dashboard', {
          replace: true,
        });
      }, 700);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          error.message ||
          'Incorrect email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    /*
     * Force the browser to load the public root route.
     * This avoids any stale React Router state.
     */
    window.location.assign("/");
  };

  return (
    <main className="auth-page patient-auth-background">
      <div className="auth-background-overlay" />

      <section className="auth-container">
        <aside className="auth-visual-panel patient-visual-panel">
        <Link to="/" className="auth-logo">
  <div className="auth-logo-image">
    <img
      src="/images/oralvista-logo.png"
      alt="OralVista logo"
    />
  </div>

  <span>
    <strong>OralVista</strong>
    <small>AI Powered Smart OralVista Health Platform</small>
  </span>
</Link>

          <div className="auth-visual-content">
            <span className="auth-small-badge">
              <Sparkles size={15} />
              Secure patient portal
            </span>

            <h1>Welcome back to your healthier smile.</h1>

            <p>
              Sign in to access oral Vista-health prediction, image
              analysis, AI guidance, dental education and clinic
              information.
            </p>

            <div className="auth-statistics">
              <div>
                <strong>AI</strong>
                <span>Powered guidance</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Digital access</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Languages</span>
              </div>
            </div>
          </div>

          <p className="auth-panel-footer">
            Only a patient registered in MongoDB with the correct
            email and password can access the patient dashboard.
          </p>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-mobile-icon">
  <img
    src="/images/oralvista-logo.png"
    alt="OralVista"
    className="mobile-logo"
  />
</span>

            <p className="auth-eyebrow">Patient portal</p>

            <h2>Sign in to your account</h2>

            <p>
              Enter the email and password used during registration.
            </p>
          </div>

          {message.text && (
            <div
              className={`auth-message ${
                message.type === 'success'
                  ? 'auth-message-success'
                  : 'auth-message-error'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}

              <span>{message.text}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="loginEmail">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="loginPassword">Password</label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  id="loginPassword"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="loginConfirmPassword">
                Confirm password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  id="loginConfirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  placeholder="Enter the same password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-form-options">
              <label className="auth-checkbox">
                <input
                  name="rememberEmail"
                  type="checkbox"
                  checked={form.rememberEmail}
                  onChange={handleChange}
                />

                <span>Remember my email</span>
              </label>

              <span className="auth-security-text">
                Keep your password private
              </span>
            </div>

            <button
              type="submit"
              className="auth-primary-button"
              disabled={loading}
            >
              {loading
                ? 'Verifying your account...'
                : 'Sign in to dashboard'}
            </button>
          </form>

          <div className="auth-switch-link">
            <span>Do not have an account?</span>

            <Link to="/register" className="auth-register-link">
              Create patient account
            </Link>
          </div>

          <div className="auth-secondary-link">
            <span>Are you an administrator?</span>

            <Link to="/admin/login">
              Open administrator login
            </Link>
          </div>

          <button
            type="button"
            className="auth-back-link"
            onClick={handleReturnHome}
          >
            <ArrowLeft size={15} />
            Return to home
          </button>
        </section>
      </section>
    </main>
  );
}