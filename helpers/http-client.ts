import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function isTokenExpired(token: string) {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) return true;
    return decodedToken.exp < Math.floor(Date.now() / 1000);
}

function forceLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("academic_unit_id"); 
    if (window.location.pathname.indexOf("auth/sign-in") === -1) {
        window.location.href = "/auth/sign-in";
    }
}


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        
        
        if (token) {
            if (isTokenExpired(token)) {
                forceLogout();
                return Promise.reject(new Error("Token expirado localmente"));
            }
            config.headers.Authorization = "Bearer " + token;
        }

        
        
        


        const unitId = localStorage.getItem("academic_unit_id") || "1"; 

        if (unitId) {
            config.headers['X-Academic-Unit'] = unitId;
        }

        
        config.headers['Accept'] = 'application/json';

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