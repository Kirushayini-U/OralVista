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
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

import {
  clearAuthentication,
  getStoredUser,
} from "../api/authStorage.js";

/* =====================================================
   ADMIN NAVIGATION
===================================================== */

const adminNavigation = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    to: "/admin/users",
    icon: Users,
  },
  {
    label: "Clinic Management",
    to: "/admin/clinics",
    icon: Building2,
  },
  {
    label: "Newsletter Management",
    to: "/admin/newsletters",
    icon: Mail,
  },
  {
    label: "Analytics Dashboard",
    to: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Profile",
    to: "/admin/profile",
    icon: User,
  },
];

/* =====================================================
   CREATE INITIALS
===================================================== */

const createInitials = (name = "") => {
  const words = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) {
    return "AD";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

export default function AdminLayout({
  children,
  title,
  subtitle,
}) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [adminUser, setAdminUser] = useState(
    getStoredUser()
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * Refresh the administrator details immediately after
   * the Admin Profile page updates local storage.
   *
   * AdminProfile.jsx dispatches:
   * window.dispatchEvent(new Event("storage"));
   */
  useEffect(() => {
    const refreshStoredAdmin = () => {
      setAdminUser(getStoredUser());
    };

    window.addEventListener(
      "storage",
      refreshStoredAdmin
    );

    window.addEventListener(
      "focus",
      refreshStoredAdmin
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshStoredAdmin
      );

      window.removeEventListener(
        "focus",
        refreshStoredAdmin
      );
    };
  }, []);

  const adminName =
    adminUser?.fullName?.trim() ||
    "Administrator";

  const adminEmail =
    adminUser?.email || "";

  const adminInitials = useMemo(
    () => createInitials(adminName),
    [adminName]
  );

  const handleLogout = () => {
    clearAuthentication();

    navigate("/admin/login", {
      replace: true,
    });
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =================================================
          ADMIN SIDEBAR
      ================================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[285px] flex-col overflow-hidden border-r border-sky-100 shadow-xl shadow-slate-900/5 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Sidebar background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("/images/admin-sidebar-bg.jpg")',
          }}
        />

        {/* White/light-blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/93 to-sky-50/96 backdrop-blur-[2px]" />

        {/* Decorative shapes */}
        <div className="absolute -right-20 top-24 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {/* Logo and website name */}
          <div className="border-b border-sky-100/80 px-5 py-5">
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-lg shadow-sky-100/70 backdrop-blur-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-md">
                <img
                  src="/images/oralvista-logo.png"
                  alt="OralVista logo"
                  className="h-full w-full object-contain p-1.5"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    event.currentTarget
                      .parentElement
                      .classList.add(
                        "bg-gradient-to-br",
                        "from-sky-600",
                        "to-teal-600"
                      );

                    event.currentTarget.parentElement.innerHTML =
                      '<span style="color:white;font-weight:900;font-size:18px">O</span>';
                  }}
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-black tracking-tight text-slate-900">
                  OralVista
                </h2>

                <p className="mt-0.5 text-xs font-medium text-sky-700">
                  Admin Control Panel
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileSidebar}
                className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
                aria-label="Close navigation"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Admin badge */}
          <div className="px-5 pt-4">
            <div className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/95 to-cyan-50/95 p-3 shadow-sm">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-md">
                <ShieldCheck size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">
                  Administrator Access
                </p>

                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                  Secure management portal
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto px-4 pb-5">
            {adminNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex min-h-[52px] items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-100 to-cyan-50 text-teal-800 shadow-md shadow-sky-100/70 ring-1 ring-sky-100"
                        : "text-slate-600 hover:translate-x-1 hover:bg-white/80 hover:text-sky-800 hover:shadow-sm"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                          isActive
                            ? "bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow-md"
                            : "bg-white/70 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-700"
                        }`}
                      >
                        <Icon size={18} />
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      <ChevronRight
                        size={15}
                        className={`transition ${
                          isActive
                            ? "translate-x-0 text-teal-600 opacity-100"
                            : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-sky-100/80 bg-white/45 p-4 backdrop-blur">
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-[50px] w-full items-center gap-3 rounded-2xl border border-red-100 bg-white/80 px-4 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-500">
                <LogOut size={18} />
              </span>

              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="min-h-screen lg:pl-[285px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                {title || "Dashboard"}
              </h1>

              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              aria-label="Notifications"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-teal-500" />
            </button>

            {/* Admin role badge */}
            <div className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 md:flex">
              <ShieldCheck size={15} />
              Super Admin
            </div>

            {/* Admin profile */}
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-slate-900 to-teal-900 text-sm font-black text-white shadow-md">
                {adminUser?.profileImage ? (
                  <img
                    src={adminUser.profileImage}
                    alt={adminName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  adminInitials
                )}
              </div>

              <div className="hidden min-w-0 text-left xl:block">
                <p className="max-w-40 truncate text-xs font-bold text-slate-800">
                  {adminName}
                </p>

                {adminEmail && (
                  <p className="mt-0.5 max-w-40 truncate text-[10px] text-slate-400">
                    {adminEmail}
                  </p>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-76px)] overflow-x-hidden bg-slate-50 p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
