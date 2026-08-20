import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../../api/axios.js';
import { saveAuthentication } from '../../api/authStorage.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (message.text) {
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

      const response = await api.post('/auth/admin/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      const { token, user } = response.data;

      if (!token || !user || user.role !== 'admin') {
        throw new Error(
          'This account does not have administrator access.'
        );
      }

      saveAuthentication(token, user);

      setMessage({
        type: 'success',
        text: 'Administrator verified. Opening dashboard...',
      });

      setTimeout(() => {
        navigate('/admin/dashboard', {
          replace: true,
        });
      }, 700);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          error.message ||
          'Administrator login failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page admin-auth-background">
      <div className="auth-background-overlay admin-background-overlay" />

      <section className="auth-container">
        <aside className="auth-visual-panel admin-visual-panel">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon admin-logo-icon">
              <UserCog size={24} />
            </span>

            <span>
              <strong>OralVista Admin</strong>
              <small>System management portal</small>
            </span>
          </Link>

          <div className="auth-visual-content">
            <span className="auth-small-badge">
              <ShieldCheck size={15} />
              Authorised access only
            </span>

            <h1>Manage the oralVista-health platform securely.</h1>

            <p>
              Access users, clinics, newsletters, analytics and
              system settings from the administrator dashboard.
            </p>

            <div className="auth-benefit-list">
              <div>
                <Users size={20} />

                <span>
                  <strong>User management</strong>
                  Manage patient accounts and access.
                </span>
              </div>

              <div>
                <BarChart3 size={20} />

                <span>
                  <strong>Analytics dashboard</strong>
                  Review system activity and usage.
                </span>
              </div>

              <div>
                <Activity size={20} />

                <span>
                  <strong>Platform control</strong>
                  Manage clinics, newsletters and settings.
                </span>
              </div>
            </div>
          </div>

          <p className="auth-panel-footer">
            Only a MongoDB account with role “admin” can access the
            administrator dashboard.
          </p>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-mobile-icon">
              <UserCog size={23} />
            </span>

            <p className="auth-eyebrow admin-eyebrow">
              Administrator portal
            </p>

            <h2>Administrator sign in</h2>

            <p>Enter your authorised administrator credentials.</p>
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
              <label htmlFor="adminEmail">
                Administrator email
              </label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  placeholder="admin@oralhealth.lk"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="adminPassword">Password</label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  id="adminPassword"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="auth-password-button"
                  onClick={() =>
                    setShowPassword((current) => !current)
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
              <label htmlFor="adminConfirmPassword">
                Confirm password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={18} />

                <input
                  id="adminConfirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  placeholder="Repeat administrator password"
                  value={form.confirmPassword}
                  onChange={handleChange}
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
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="admin-login-note">
              <ShieldCheck size={18} />

              <span>
                Access is restricted to authorised administrators.
              </span>
            </div>

            <button
              type="submit"
              className="auth-primary-button admin-primary-button"
              disabled={loading}
            >
              {loading
                ? 'Verifying administrator...'
                : 'Open administrator dashboard'}
            </button>
          </form>

          <div className="auth-switch-link">
            <span>Are you a patient?</span>
            <Link to="/login">Open patient login</Link>
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