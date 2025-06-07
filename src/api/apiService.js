import axiosInstance from "./axiosConfig";

function callApi(endpoint, method = "GET", body, params, requireAuth = true, isMultipart = false) {
    const token = localStorage.getItem("authToken");

    // Kiểm tra token nếu yêu cầu xác thực
    if (requireAuth && !token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    // Tạo query string
    const queryString = params && typeof params === "object" ? new URLSearchParams(params).toString() : "";
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;

    const config = {
        method,
        url,
        headers: {
            "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
        },
        data: body || null,
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
// Product APIs
export function GET_ALL_PRODUCTS(params) {
    return callApi("/products", "GET", null, params, false);
}

export function GET_PRODUCT_BY_ID(id) {
    return callApi(`/products/${id}`, "GET", null, null, false);
}

export function GET_PRODUCTS_BY_SEARCH(params) {
    return callApi("/products/search", "GET", null, params, false);
}

// News APIs
export function GET_ALL_NEWS(params) {
    return callApi("/news", "GET", null, params, false);
}

export function GET_NEWS_BY_ID(id) {
    return callApi(`/news/${id}`, "GET", null, null, false);
}

// Contact APIs
export function POST_CONTACT(data) {
    return callApi("/contacts", "POST", data, null, false);
}

// Brand APIs
export function GET_ALL_BRANDS(params = {}) {
    return callApi("/admin/brands", "GET", null, params, false);
}

// Category APIs
export function GET_ALL_CATEGORIES(params = {}) {
    return callApi("/admin/categories", "GET", null, params, false);
}

// Hero Section API
export function GET_HERO_SECTIONS(params = {}) {
    return callApi("/hero", "GET", null, params, false);
}

// Order APIs
export function GET_USER_ORDERS(params) {
    return callApi("/orders", "GET", null, params, true);
}


export function GET_ORDERS_BY_STATUS_AND_USERID(userId, status, params) {
    return callApi(`/orders/user/${userId}/status/${status.toUpperCase()}`, "GET", null, params, true);
}

export function GET_ORDER_BY_ID(id) {
    return callApi(`/orders/${id}`, "GET", null, null, true);
}

export function CANCEL_ORDER(id) {
    return callApi(`/orders/${id}/cancel`, "PUT", null, null, true);
}

export function CREATE_ORDER(data) {
    return callApi("/orders", "POST", data, null, true);
}

// Payment Method APIs
export function GET_PAYMENT_METHOD(id) {
    return callApi(`/admin/payment-methods/${id}`, "GET", null, null, true);
}

export function GET_ALL_PAYMENT_METHODS(params = {}) {
    return callApi("/admin/payment-methods", "GET", null, params, false);
}

// Address APIs
export function GET_SHIPPING_ADDRESS(id) {
    return callApi(`/users/addresses/${id}`, "GET", null, null, true);
}

export function GET_USER_ADDRESSES(params) {
    return callApi("/users/addresses", "GET", null, params, true);
}

export function CREATE_ADDRESS(data) {
    return callApi("/users/addresses", "POST", data, null, true);
}

export function UPDATE_ADDRESS(id, data) {
    return callApi(`/users/addresses/${id}`, "PUT", data, null, true);
}

export function DELETE_ADDRESS(id) {
    return callApi(`/users/addresses/${id}`, "DELETE", null, null, true);
}

export function SET_DEFAULT_ADDRESS(id) {
    return callApi(`/users/addresses/${id}/default`, "PUT", null, null, true);
}

// Profile APIs
export function GET_PROFILE() {
    return callApi("/users/profile", "GET", null, {}, true);
}

export function UPDATE_PROFILE(formData) {
    return callApi("/users/profile", "PUT", formData, null, true, true);
}

export function CHANGE_PASSWORD(data) {
    return callApi("/users/change-password", "POST", data, {}, true);
}

// Auth APIs
export function LOGIN(body) {
    return callApi("/auth/login", "POST", body, null, false);
}

export function REGISTER(body) {
    return callApi("/auth/register", "POST", body, null, false, true);
}

// Cart APIs
export function GET_CART() {
    return callApi("/users/cart", "GET", null, {}, true);
}

export function ADD_TO_CART(data) {
    return callApi("/users/cart/items", "POST", data, {}, true);
}

export function UPDATE_CART_ITEM(itemId, data) {
    return callApi(`/users/cart/items/${itemId}`, "PUT", data, {}, true);
}

export function REMOVE_FROM_CART(itemId) {
    return callApi(`/users/cart/items/${itemId}`, "DELETE", null, {}, true);
}

export function CLEAR_CART() {
    return callApi("/users/cart", "DELETE", null, {}, true);
}

// Wishlist APIs
export function ADD_TO_WISHLIST(data) {
    return callApi("/users/wishlist", "POST", data, {}, true);
}

export function GET_WISHLIST(params = {}) {
    return callApi("/users/wishlist", "GET", null, params, true);
}

export function REMOVE_FROM_WISHLIST(productId) {
    return callApi(`/users/wishlist/${productId}`, "DELETE", null, {}, true);
}


// MoMo APIs
export function CREATE_MOMO_PAYMENT(orderId, orderInfo, amount) {
    const body = { orderId, orderInfo, amount };
    return callApi("/momo/create", "POST", body, null, true);
}
