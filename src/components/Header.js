import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useMobile } from "../hooks/useMobile";
import { useUser } from "../contexts/UserContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/news", label: "Tin tức" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const renderAvatar = () => {
    if (user?.avatarUrl && !avatarError) {
      return (
        <img
          src={`http://localhost:8080/api/users/image/${user.avatarUrl}`}
          alt="User Avatar"
          className="h-6 w-6 rounded-full"
          onError={() => setAvatarError(true)}
        />
      );
    }
    return (
      <span className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-sm">
        {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
      </span>
    );
  };

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
              <span className="text-xl font-bold text-red-600 md:text-2xl">
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
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  location.pathname === link.href ? "text-red-600" : "text-gray-600"
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
              <span className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Wishlist */}
            {isLoggedIn && (
              <Link to="/wishlist" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Wishlist"
                  className="text-xl"
                >
                  <svg
                    className={wishlistItems.length > 0 ? "fill-red-500 stroke-red-500 h-5 w-5" : "fill-gray-300 stroke-gray-500 h-5 w-5"}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            {isLoggedIn && (
              <Link to="/cart" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Shopping Cart"
                  className="text-xl"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-500">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  {cartItems.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isLoggedIn && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {renderAvatar()}
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 z-50">
                    <div className="flex items-center gap-2 p-2">
                      {renderAvatar()}
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
                      <span className="mr-2 text-xl">👤</span>
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center p-2 hover:bg-gray-100 rounded"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="mr-2 text-xl">📦</span>
                      Đơn hàng của tôi
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded w-full text-left"
                    >
                      <span className="mr-2 text-xl">🚪</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="default" size="sm">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">Đăng ký</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              </Button>
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 z-50">
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                      </svg>
                    </span>
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
                          location.pathname === link.href ? "bg-gray-100 text-red-600" : "text-gray-600"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
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