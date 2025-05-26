import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useMobile } from "../hooks/useMobile";
import { GET_PROFILE } from "../api/apiService";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isLoggedIn = !!localStorage.getItem("authToken");

  // Fetch user profile
  useEffect(() => {
    if (isLoggedIn) {
      GET_PROFILE()
        .then((data) => setUser(data))
        .catch((error) => console.error("Failed to fetch profile:", error));
    }
  }, [isLoggedIn]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/news", label: "Tin tức" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white/80 shadow-md backdrop-blur-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                Tech<span className="text-gray-800">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.href ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Wishlist, User */}
          <div className="flex items-center space-x-2">
            {/* Search Form - Desktop */}
            <form onSubmit={handleSearch} className="relative hidden md:block lg:w-[300px]">
              <span className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">🔍</span>
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <span>♥</span>
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-white">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                <span>🛒</span>
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-white">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="User menu"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span>👤</span>
              </Button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 z-50">
                  {isLoggedIn && user ? (
                    <>
                      <div className="flex items-center gap-2 p-2">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{user.fullName || "User"}</p>
                          <p className="text-xs text-gray-500">{user.email || "email@example.com"}</p>
                        </div>
                      </div>
                      <hr className="my-1" />
                      <Link
                        to="/profile"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">👤</span>
                        Thông tin tài khoản
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">📦</span>
                        Đơn hàng của tôi
                      </Link>
                      <Link
                        to="/orders/history"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">🕒</span>
                        Lịch sử đặt hàng
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">♥</span>
                        Sản phẩm yêu thích
                      </Link>
                      <Link
                        to="/cart"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">🛒</span>
                        Giỏ hàng
                      </Link>
                      <hr className="my-1" />
                      <Link
                        to="/settings"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">⚙️</span>
                        Cài đặt
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded w-full text-left"
                      >
                        <span className="mr-2">🚪</span>
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-2 font-medium">Tài khoản</div>
                      <hr className="my-1" />
                      <Link
                        to="/login"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">👤</span>
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center p-2 hover:bg-gray-100 rounded"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-2">👤</span>
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span>☰</span>
              </Button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 z-50">
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">🔍</span>
                    <Input
                      type="search"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 ${
                          location.pathname === link.href ? "bg-gray-100 text-blue-600" : "text-gray-600"
                        }`}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}