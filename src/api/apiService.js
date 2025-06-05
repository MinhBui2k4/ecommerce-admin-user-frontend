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

export function GET_ORDERS_BY_STATUS(status, params) {
    return callApi(`/orders/status/${status.toUpperCase()}`, "GET", null, params, true);
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

// Admin APIs
// Product Management APIs
export function CREATE_PRODUCT(formData) {
    return callApi("/products", "POST", formData, null, true, true);
}

export function UPDATE_PRODUCT(id, formData) {
    return callApi(`/products/${id}`, "PUT", formData, null, true, true);
}

export function DELETE_PRODUCT(id) {
    return callApi(`/products/${id}`, "DELETE", null, null, true);
}

// Category Management APIs
export function CREATE_CATEGORY(data) {
    return callApi("/admin/categories", "POST", data, null, true);
}

export function GET_ALL_CATEGORIES_ADMIN(params = {}) {
    return callApi("/admin/categories", "GET", null, params, true);
}

export function UPDATE_CATEGORY(id, data) {
    return callApi(`/admin/categories/${id}`, "PUT", data, null, true);
}

export function DELETE_CATEGORY(id) {
    return callApi(`/admin/categories/${id}`, "DELETE", null, null, true);
}

// Brand Management APIs
export function CREATE_BRAND(data) {
    return callApi("/admin/brands", "POST", data, null, true);
}

export function UPDATE_BRAND(id, data) {
    return callApi(`/admin/brands/${id}`, "PUT", data, null, true);
}

export function DELETE_BRAND(id) {
    return callApi(`/admin/brands/${id}`, "DELETE", null, null, true);
}

// Payment Method Management APIs
export function CREATE_PAYMENT_METHOD(data) {
    return callApi("/admin/payment-methods", "POST", data, null, true);
}

export function UPDATE_PAYMENT_METHOD(id, data) {
    return callApi(`/admin/payment-methods/${id}`, "PUT", data, null, true);
}

export function DELETE_PAYMENT_METHOD(id) {
    return callApi(`/admin/payment-methods/${id}`, "DELETE", null, null, true);
}

// Order Management APIs
export function UPDATE_ORDER_STATUS(id, status) {
    return callApi(`/orders/admin/${id}/status`, "PUT", { status }, null, true);
}

// Contact Management APIs
export function GET_ALL_CONTACTS(params = {}) {
    return callApi("/contacts", "GET", null, params, true);
}

export function GET_CONTACT_BY_ID(id) {
    return callApi(`/contacts/${id}`, "GET", null, null, true);
}

export function UPDATE_CONTACT_STATUS(id, status) {
    return callApi(`/contacts/${id}/status`, "PUT", { status }, null, true);
}

export function DELETE_CONTACT(id) {
    return callApi(`/contacts/${id}`, "DELETE", null, null, true);
}

// News Management APIs
export function CREATE_NEWS(formData) {
    return callApi("/news", "POST", formData, null, true, true);
}

export function UPDATE_NEWS(id, formData) {
    return callApi(`/news/${id}`, "PUT", formData, null, true, true);
}

export function DELETE_NEWS(id) {
    return callApi(`/news/${id}`, "DELETE", null, null, true);
}

// Hero Section Management APIs
export function CREATE_HERO_SECTION(formData) {
    return callApi("/hero", "POST", formData, null, true, true);
}

export function UPDATE_HERO_SECTION(id, formData) {
    return callApi(`/hero/${id}`, "PUT", formData, null, true, true);
}

export function DELETE_HERO_SECTION(id) {
    return callApi(`/hero/${id}`, "DELETE", null, null, true);
}

// Role Management APIs
export function GET_ALL_ROLES() {
    return callApi("/admin/roles", "GET", null, null, true);
}

export function GET_ROLE_BY_ID(id) {
    return callApi(`/admin/roles/${id}`, "GET", null, null, true);
}

export function CREATE_ROLE(data) {
    return callApi("/admin/roles", "POST", data, null, true);
}

export function UPDATE_ROLE(id, data) {
    return callApi(`/admin/roles/${id}`, "PUT", data, null, true);
}

export function DELETE_ROLE(id) {
    return callApi(`/admin/roles/${id}`, "DELETE", null, null, true);
}

// User Management APIs
export function GET_ALL_USERS(params = {}) {
    return callApi("/users", "GET", null, params, true);
}

export function GET_USER_BY_ID(id, includeOrders = false) {
    return callApi(`/users/${id}`, "GET", null, { includeOrders }, true);
}

export function DELETE_USER(id) {
    return callApi(`/users/${id}`, "DELETE", null, null, true);
}