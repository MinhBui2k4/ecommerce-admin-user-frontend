import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">
                Tech<span className="text-gray-800">Store</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Cửa hàng điện tử với đa dạng sản phẩm chính hãng, dịch vụ hỗ trợ tận tâm.
            </p>
            <div className="mt-6 flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Danh mục</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/products?category=laptop" className="text-sm text-gray-600 hover:text-blue-600">
                  Laptop
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartphone" className="text-sm text-gray-600 hover:text-blue-600">
                  Điện thoại
                </Link>
              </li>
              <li>
                <Link to="/products?category=tablet" className="text-sm text-gray-600 hover:text-blue-600">
                  Máy tính bảng
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-sm text-gray-600 hover:text-blue-600">
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartwatch" className="text-sm text-gray-600 hover:text-blue-600">
                  Đồng hồ thông minh
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Thông tin</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/policy/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/policy/terms" className="text-sm text-gray-600 hover:text-blue-600">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/policy/return" className="text-sm text-gray-600 hover:text-blue-600">
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Liên hệ</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Số 20 Tăng Nhơn Phú, Phường Phước Long B, TP Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">(028) 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">info@techstore.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Đăng ký nhận tin</h4>
              <div className="mt-2 flex">
                <Input type="email" placeholder="Email của bạn" className="rounded-r-none" />
                <Button className="rounded-l-none">Đăng ký</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} TechStore. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}