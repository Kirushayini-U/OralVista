import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

/* =====================================================
   REQUEST INTERCEPTOR
   Attach the saved JWT token to protected requests.
===================================================== */

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      /*
       * Ensure the headers object exists before
       * adding the Authorization header.
       */
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/* =====================================================
   RESPONSE INTERCEPTOR
   Clear authentication only when the login token
   is invalid or expired.
===================================================== */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url || "";

    const responseMessage =
      String(
        error.response?.data?.message || ""
      ).toLowerCase();

    const isAuthenticationRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes(
        "/auth/admin/login"
      ) ||
      requestUrl.includes("/auth/register");

    /*
     * An incorrect current password can return 401.
     * That must not remove the administrator's JWT.
     */
    const isPasswordChangeRequest =
      requestUrl.includes(
        "/profile/change-password"
      );

    /*
     * These messages normally indicate that the
     * actual JWT session is no longer valid.
     */
    const tokenIsInvalid =
      responseMessage.includes(
        "token was not provided"
      ) ||
      responseMessage.includes(
        "authentication token is invalid"
      ) ||
      responseMessage.includes(
        "login session has expired"
      ) ||
      responseMessage.includes(
        "token has expired"
      ) ||
      responseMessage.includes(
        "jwt expired"
      ) ||
      responseMessage.includes(
        "account connected to this token no longer exists"
      );

    if (
      status === 401 &&
      !isAuthenticationRequest &&
      !isPasswordChangeRequest &&
      tokenIsInvalid
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      /*
       * Inform layouts and protected components
       * that authentication information changed.
       */
      window.dispatchEvent(
        new Event("storage")
      );
    }

    return Promise.reject(error);
  }
);

export default api;