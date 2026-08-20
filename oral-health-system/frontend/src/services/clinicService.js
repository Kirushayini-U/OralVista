import api from "../api/axios";

/* =====================================================
   PATIENT: SEARCH DENTAL CLINICS
===================================================== */

export const searchClinics = async (
  data
) => {
  const response = await api.post(
    "/clinics/search",
    data
  );

  return response.data;
};

/* =====================================================
   PATIENT: GET PERSONAL SEARCH HISTORY
===================================================== */

export const getMyClinicSearchHistory =
  async () => {
    const response = await api.get(
      "/clinics/my-history"
    );

    return response.data;
  };

/* =====================================================
   ADMIN: GET ALL PATIENT CLINIC SEARCHES
===================================================== */

export const getAdminClinicSearches =
  async (params = {}) => {
    const response = await api.get(
      "/clinics/admin/searches",
      {
        params,
      }
    );

    return response.data;
  };

/* =====================================================
   ADMIN: GET ONE CLINIC SEARCH RECORD
===================================================== */

export const getAdminClinicSearch =
  async (id) => {
    if (!id) {
      throw new Error(
        "Clinic-search record ID is required."
      );
    }

    const response = await api.get(
      `/clinics/admin/searches/${id}`
    );

    return response.data;
  };