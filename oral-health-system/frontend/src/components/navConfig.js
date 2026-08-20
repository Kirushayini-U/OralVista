import {
  LayoutDashboard,
  Stethoscope,
  History,
  ScanLine,
  GraduationCap,
  MessageCircle,
  MapPin,
  Mail,
  User,
  Settings,
  LogOut,
  Users,
  Building2,
  BarChart3,
} from "lucide-react";

/* =====================================================
   PATIENT NAVIGATION
===================================================== */

export const patientNav = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/symptom-prediction",
    label: "Symptom Prediction",
    icon: Stethoscope,
  },

  {
    to: "/prediction-history",
    label: "Prediction History",
    icon: History,
  },

  {
    to: "/image-prediction",
    label: "Image Prediction",
    icon: ScanLine,
  },

  {
    to: "/ai-tutor",
    label: "Oral and dental health Education & Quiz",
    icon: GraduationCap,
  },

  {
    to: "/chat-assistant",
    label: "OralVista AI Chat Assistant",
    icon: MessageCircle,
  },

  {
    to: "/clinic-finder",
    label: "Clinic Finder",
    icon: MapPin,
  },

  {
    to: "/newsletter",
    label: "Oral and dental Health Newsletter and Subscription",
    icon: Mail,
  },

  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },

  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

/* =====================================================
   ADMIN NAVIGATION
===================================================== */

export const adminNav = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/admin/users",
    label: "User Management",
    icon: Users,
  },

  {
    to: "/admin/clinics",
    label: "Clinic Management",
    icon: Building2,
  },

  {
    to: "/admin/newsletters",
    label: "Newsletter Management",
    icon: Mail,
  },

  {
    to: "/admin/analytics",
    label: "Analytics Dashboard",
    icon: BarChart3,
  },

  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },

  {
    to: "/admin/profile",
    label: "Profile",
    icon: User,
  },
];

/* =====================================================
   BOTTOM NAVIGATION
===================================================== */

export const bottomLink = {
  label: "Logout",
  icon: LogOut,
};