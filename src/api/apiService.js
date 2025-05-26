import axiosInstance from "./axiosConfig";

function callApi(endpoint, method = "GET", body, params, requireAuth = true) {
    const token = localStorage.getItem("authToken");

    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;

    const config = {
        method,
        url,
        headers: {
            "Content-Type": "application/json",
        },
        data: body ? body : null,
    };

    if (requireAuth && token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return axiosInstance(config)
        .then((response) => {
            console.log("API response:", response.data);
            return response.data;
        })
        .catch((error) => {
            console.error("API call error:", error.response?.data || error.message);
            throw error;
        });
}

// Public APIs
export function GET_ALL_PRODUCTS(params) {
    return callApi("/products", "GET", null, params, false);
}

export function GET_PRODUCT_BY_ID(id) {
    return callApi(`/products/${id}`, "GET", null, null, false);
}

// Auth APIs
export function LOGIN(body) {
    return axiosInstance.post("/auth/login", body, {
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Login error:", error);
            throw error;
        });
}

export function REGISTER(body) {
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
        formData.append(key, body[key]);
    });
    return axiosInstance.post("/auth/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Registration error:", error);
            throw error;
        });
}

// Cart APIs
export function GET_CART() {
    return callApi("/users/cart", "GET", null, null, true);
}

export function ADD_TO_CART(data) {
    return callApi("/users/cart/items", "POST", data, null, true);
}

export function UPDATE_CART_ITEM(itemId, data) {
    return callApi(`/users/cart/items/${itemId}`, "PUT", data, null, true);
}

export function REMOVE_FROM_CART(itemId) {
    return callApi(`/users/cart/items/${itemId}`, "DELETE", null, null, true);
}

export function CLEAR_CART() {
    return callApi("/users/cart", "DELETE", null, null, true);
}

// Wishlist APIs
export function ADD_TO_WISHLIST(data) {
    return callApi("/users/wishlist", "POST", data, null, true);
}

export function GET_WISHLIST(params) {
    return callApi("/users/wishlist", "GET", null, params, true);
}

export function REMOVE_FROM_WISHLIST(productId) {
    return callApi(`/users/wishlist/${productId}`, "DELETE", null, null, true);
}

// User Profile API
export function GET_PROFILE() {
    return callApi("/users/profile", "GET", null, null, true);
}