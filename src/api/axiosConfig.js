import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("401 Error for URL:", error.config.url);
            // Chỉ chuyển hướng cho các API cụ thể nếu cần
            if (error.config.url.includes("/users/profile")) {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
            } else {
                console.warn("Unauthorized request, but not redirecting:", error.config.url);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;