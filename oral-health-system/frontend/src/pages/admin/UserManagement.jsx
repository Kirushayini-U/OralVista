import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import AdminLayout from "../../components/AdminLayout.jsx";
import api from "../../api/axios.js";

/* =====================================================
   SETTINGS
===================================================== */

const USERS_PER_PAGE = 5;

/* =====================================================
   FORMAT NORMAL DATE
===================================================== */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/* =====================================================
   FORMAT PASSWORD CHANGE ACTIVITY
===================================================== */

const formatPasswordChangeMessage = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const changedDate = new Date(dateValue);

  if (Number.isNaN(changedDate.getTime())) {
    return "";
  }

  const currentDate = new Date();

  const differenceInMilliseconds =
    currentDate.getTime() - changedDate.getTime();

  if (differenceInMilliseconds < 0) {
    return "Password changed recently";
  }

  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );

  if (differenceInMinutes < 1) {
    return "Password changed just now";
  }

  if (differenceInMinutes < 60) {
    return `Password changed ${differenceInMinutes} minute${
      differenceInMinutes === 1 ? "" : "s"
    } ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60
  );

  if (differenceInHours < 24) {
    return `Password changed ${differenceInHours} hour${
      differenceInHours === 1 ? "" : "s"
    } ago`;
  }

  const differenceInDays = Math.floor(
    differenceInHours / 24
  );

  if (differenceInDays <= 7) {
    return `Password changed ${differenceInDays} day${
      differenceInDays === 1 ? "" : "s"
    } ago`;
  }

  return `Password changed on ${formatDate(changedDate)}`;
};

/* =====================================================
   CREATE USER INITIALS
===================================================== */

const getInitials = (fullName = "") => {
  const names = fullName
    .trim()
    .split(" ")
    .filter(Boolean);

  if (names.length === 0) {
    return "U";
  }

  return names
    .slice(0, 2)
    .map((name) => name[0].toUpperCase())
    .join("");
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [deleteCandidate, setDeleteCandidate] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState("");

  const [changingStatusId, setChangingStatusId] =
    useState("");

  /*
   * Used to refresh messages such as:
   * "Password changed 5 minutes ago".
   */
  const [, setTimeRefresh] = useState(0);

  /* =====================================================
     LOAD USERS FROM MONGODB
  ===================================================== */

  const fetchUsers = useCallback(
    async (showRefreshingState = false) => {
      try {
        if (showRefreshingState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await api.get("/admin/users");

        setUsers(response.data.users || []);

        setMessage({
          type: "",
          text: "",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Unable to load registered users.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRefresh((current) => current + 1);
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* =====================================================
     SEARCH USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const searchValue = searchText
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      const fullName =
        user.fullName?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const phone =
        user.phone?.toLowerCase() || "";

      return (
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)
      );
    });
  }, [searchText, users]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length / USERS_PER_PAGE
    )
  );

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(
      startIndex,
      startIndex + USERS_PER_PAGE
    );
  }, [currentPage, filteredUsers]);

  const firstVisibleUser =
    filteredUsers.length === 0
      ? 0
      : (currentPage - 1) * USERS_PER_PAGE + 1;

  const lastVisibleUser = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =====================================================
     DELETE USER
  ===================================================== */

  const requestDelete = (user) => {
    setDeleteCandidate(user);
  };

  const cancelDelete = () => {
    if (!deletingId) {
      setDeleteCandidate(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate?._id) {
      return;
    }

    try {
      setDeletingId(deleteCandidate._id);

      const response = await api.delete(
        `/admin/users/${deleteCandidate._id}`
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) =>
            user._id !== deleteCandidate._id
        )
      );

      setMessage({
        type: "success",
        text:
          response.data.message ||
          "User deleted successfully.",
      });

      setDeleteCandidate(null);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to delete the user.",
      });
    } finally {
      setDeletingId("");
    }
  };

  /* =====================================================
     BLOCK OR ACTIVATE USER
  ===================================================== */

  const toggleUserStatus = async (user) => {
    try {
      setChangingStatusId(user._id);

      const response = await api.patch(
        `/admin/users/${user._id}/status`,
        {
          isActive: !user.isActive,
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id
            ? response.data.user
            : currentUser
        )
      );

      setMessage({
        type: "success",
        text:
          response.data.message ||
          "User status updated successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to update the user status.",
      });
    } finally {
      setChangingStatusId("");
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="admin-users-modern-page">
        {/* Background banner */}
        <section className="admin-users-banner">
          <div className="admin-users-banner-overlay" />

          <div className="admin-users-banner-content">
            <div>
              <span className="admin-users-eyebrow">
                Administrator control panel
              </span>

              <h2>Registered Users</h2>

              <p>
                Search, review and manage patient accounts
                stored securely in MongoDB.
              </p>
            </div>

            <div className="admin-users-banner-actions">
              <button
                type="button"
                onClick={() => fetchUsers(true)}
                disabled={refreshing}
                className="admin-users-refresh-button"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                className="admin-users-add-button"
                onClick={() => {
                  setMessage({
                    type: "error",
                    text:
                      "Use the patient registration page to create a new patient account.",
                  });
                }}
              >
                <Plus size={17} />
                Add User
              </button>
            </div>
          </div>
        </section>

        {/* Success or error message */}
        {message.text && (
          <div
            className={`admin-users-message ${
              message.type === "success"
                ? "admin-users-message-success"
                : "admin-users-message-error"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={19} />
            ) : (
              <AlertCircle size={19} />
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
              aria-label="Close message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Table card */}
        <section className="admin-users-table-card">
          <div className="admin-users-toolbar">
            <div className="admin-users-search">
              <Search size={18} />

              <input
                type="search"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search by name, email or phone..."
              />
            </div>

            <div className="admin-users-summary">
              <Users size={17} />

              <span>
                {filteredUsers.length} patient
                {filteredUsers.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="admin-users-loading">
              <RefreshCw
                size={30}
                className="animate-spin"
              />

              <p>Loading registered users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-users-empty">
              <div>
                <Users size={27} />
              </div>

              <h3>No registered users found</h3>

              <p>
                Registered patient accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Password Activity</th>
                    <th className="admin-users-actions-heading">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user._id}>
                      {/* User */}
                      <td>
                        <div className="admin-user-identity">
                          <div className="admin-user-avatar">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                              />
                            ) : (
                              <span>
                                {getInitials(
                                  user.fullName
                                )}
                              </span>
                            )}
                          </div>

                          <div>
                            <strong>
                              {user.fullName}
                            </strong>

                            <small>
                              ID:{" "}
                              {user._id.slice(-6)}
                            </small>

                            {user.passwordChangedAt && (
                              <span className="admin-user-password-updated">
                                <ShieldCheck size={11} />
                                Password updated
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="admin-users-normal-text">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="admin-users-normal-text">
                        {user.phone ||
                          "Not provided"}
                      </td>

                      {/* Role */}
                      <td>
                        <span className="admin-users-role-badge">
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={
                            user.isActive
                              ? "admin-users-status-active"
                              : "admin-users-status-blocked"
                          }
                        >
                          {user.isActive
                            ? "Active"
                            : "Blocked"}
                        </span>
                      </td>

                      {/* Registered */}
                      <td className="admin-users-normal-text">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* Password activity */}
                      <td>
                        {user.passwordChangedAt ? (
                          <div className="admin-users-password-activity">
                            <span>
                              <Lock size={12} />
                              Changed
                            </span>

                            <small>
                              {formatPasswordChangeMessage(
                                user.passwordChangedAt
                              )}
                            </small>
                          </div>
                        ) : (
                          <span className="admin-users-no-password-change">
                            No change recorded
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="admin-users-actions-cell">
                        <div className="admin-users-actions">
                          <button
                            type="button"
                            title="Edit user"
                            onClick={() =>
                              setMessage({
                                type: "error",
                                text:
                                  "User editing can be added in the next step.",
                              })
                            }
                            className="admin-user-edit-action"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title={
                              user.isActive
                                ? "Block user"
                                : "Activate user"
                            }
                            disabled={
                              changingStatusId ===
                              user._id
                            }
                            onClick={() =>
                              toggleUserStatus(user)
                            }
                            className="admin-user-status-action"
                          >
                            {changingStatusId ===
                            user._id ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : user.isActive ? (
                              <Lock size={16} />
                            ) : (
                              <LockOpen size={16} />
                            )}
                          </button>

                          <button
                            type="button"
                            title="Delete user permanently"
                            onClick={() =>
                              requestDelete(user)
                            }
                            className="admin-user-delete-action"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading &&
            filteredUsers.length > 0 && (
              <div className="admin-users-pagination">
                <span>
                  Showing {firstVisibleUser} to{" "}
                  {lastVisibleUser} of{" "}
                  {filteredUsers.length} users
                </span>

                <div>
                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page - 1
                      )
                    }
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page + 1
                      )
                    }
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
        </section>
      </div>

      {/* Delete confirmation dialog */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-ink">
              Delete registered user?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              You are about to permanently delete{" "}
              <strong className="text-slate-700">
                {deleteCandidate.fullName}
              </strong>
              . This account will be removed from the
              admin panel and MongoDB.
            </p>

            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-700">
                {deleteCandidate.email}
              </p>

              <p className="mt-1 text-xs font-medium text-red-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={Boolean(deletingId)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}