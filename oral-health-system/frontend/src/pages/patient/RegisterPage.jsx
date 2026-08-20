import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../../api/axios.js';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (message.text) {
      setMessage({
        type: '',
        text: '',
      });
    }
  };

  const validateForm = () => {
    if (form.fullName.trim().length < 2) {
      return 'Please enter your full name.';
    }

    if (!form.email.trim()) {
      return 'Please enter your email address.';
    }

    if (form.password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (form.password !== form.confirmPassword) {
      return 'Password and confirm password do not match.';
    }

    if (!form.acceptTerms) {
      return 'Please accept the terms and privacy policy.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage({
        type: 'error',
        text: validationError,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setMessage({
        type: 'success',
        text:
          response.data.message ||
          'Registration successful. Opening the login page...',
      });

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: {
            registeredEmail: form.email.trim().toLowerCase(),
            registrationSuccess: true,
          },
        });
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page patient-auth-background">
      <div className="auth-background-overlay" />

      <section className="auth-container auth-register-container">
        <aside className="auth-visual-panel patient-visual-panel">
          <Link to="/" className="auth-logo">
  <div className="auth-logo-image">
    <img
      src="/images/oralvista-logo.png"
      alt="OralVista Logo"
    />
  </div>

  <span>
    <strong>OralVista</strong>
    <small>AI Powered Smart Oral Vista Health Platform</small>
  </span>
</Link>

          <div className="auth-visual-content">
            <span className="auth-small-badge">
              <Sparkles size={15} />
              Secure patient registration
            </span>

            <h1>Create your personal oral-Vista account.</h1>

            <p>
              Register to access AI oralvista-health prediction, image
              analysis, dental education, clinic information and
              personalised guidance.
            </p>

            <div className="auth-benefit-list">
              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>Secure registration</strong>
                  Your password is encrypted before being saved.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>Personal dashboard</strong>
                  Access all your oral-Vista services in one place.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>AI-powered support</strong>
                  Receive preliminary and personalised guidance.
                </span>
              </div>
            </div>
          </div>

          <p className="auth-panel-footer">
            This platform provides preliminary guidance and does not
            replace professional dental diagnosis.
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

            <p className="auth-eyebrow">Patient registration</p>

            <h2>Create your account</h2>

            <p>
              Enter your personal details to register as a patient.
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
              <label htmlFor="fullName">Full name</label>

              <div className="auth-input-wrapper">
                <User size={18} />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="registerEmail">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="registerEmail"
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
              <label htmlFor="phone">Phone number</label>

              <div className="auth-input-wrapper">
                <Phone size={18} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="077 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-two-columns">
              <div className="auth-field">
                <label htmlFor="registerPassword">Password</label>

                <div className="auth-input-wrapper">
                  <Lock size={18} />

                  <input
                    id="registerPassword"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                <label htmlFor="registerConfirmPassword">
                  Confirm password
                </label>

                <div className="auth-input-wrapper">
                  <Lock size={18} />

                  <input
                    id="registerConfirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? 'text' : 'password'
                    }
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
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
            </div>

            <label className="auth-checkbox">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
              />

              <span>
                I agree to the terms of use and privacy policy.
              </span>
            </label>

            <button
              type="submit"
              className="auth-primary-button"
              disabled={loading}
            >
              {loading
                ? 'Creating your account...'
                : 'Create patient account'}
            </button>
          </form>

          <div className="auth-switch-link">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>

          <Link to="/" className="auth-back-link">
            <ArrowLeft size={15} />
            Return to home
          </Link>
        </section>
      </section>
    </main>
  );
}