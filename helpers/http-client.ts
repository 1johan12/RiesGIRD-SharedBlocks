import axios from "axios";

const viteEnv =
  typeof import.meta !== "undefined" && (import.meta as any).env
    ? (import.meta as any).env
    : {};

const axiosInstance = axios.create({
  baseURL: viteEnv.VITE_API_BASE_URL || viteEnv.VITE_API_URL || "",
  withCredentials: true,
});

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string) {
  const decodedToken = parseJwt(token);
  if (!decodedToken || !decodedToken.exp) return true;
  return decodedToken.exp < Math.floor(Date.now() / 1000);
}

function forceLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("academic_unit_id");
  if (!window.location.pathname.includes("auth/sign-in")) {
    window.location.href = "/auth/sign-in";
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        if (isTokenExpired(token)) {
          forceLogout();
          return Promise.reject(new Error("Token expirado localmente"));
        }
        config.headers.Authorization = "Bearer " + token;
      }

      const unitId = localStorage.getItem("academic_unit_id");
      if (unitId && unitId !== "undefined" && unitId !== "null") {
        config.headers["X-Academic-Unit"] = unitId;
      }
    }

    config.headers["Accept"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

const HttpClient = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  patch: axiosInstance.patch,
};

export default HttpClient;
