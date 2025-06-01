import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetail from './pages/products/ProductDetailPage';
import Cart from './pages/cart/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Wishlist from './pages/wishlist/WishlistPage';
import NewsPage from './pages/news/NewsPage';
import AboutPage from './pages/about/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import ProductsPage from './pages/ProductsPage';
import SearchPage from './pages/products/SearchPage';
import ProfilePage from './pages/profile/ProfilePage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import OrderDetailPage from './pages/order/OrderDetailPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import PrivacyPolicyPage from './pages/policy/PrivacyPolicyPage';
import TermsOfServicePage from './pages/policy/TermsOfServicePage';
import ReturnPolicyPage from './pages/policy/ReturnPolicyPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Auth
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      // Products
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
       {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      // Cart
      {
        path: "/cart",
        element: <Cart />,
      },
      // Wishlist
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      // Contact
      {
        path: "/contact",
        element: <ContactPage />,
      },
      // News
      {
        path: "/news",
        element: <NewsPage />,
      },
      {
        path: "/news/:id",
        element: <NewsDetailPage />,
      },
      // About
      {
        path: "/about",
        element: <AboutPage />,
      },
      // Profile
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      // Order
      {
        path: "/orders",
        element: <OrderHistoryPage />,
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetailPage />,
      },
      // Checkout
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      // Policy
      {
        path: "/policy/privacy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/policy/terms",
        element: <TermsOfServicePage />,
      },
      {
        path: "/policy/return",
        element: <ReturnPolicyPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
    ],

  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
    />
  </React.StrictMode>
);
