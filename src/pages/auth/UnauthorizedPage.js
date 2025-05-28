import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <span className="text-4xl text-red-600">🚫</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Không có quyền truy cập</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập bằng tài khoản có quyền truy cập hoặc
        liên hệ với quản trị viên để được hỗ trợ.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/login">
          <Button className="flex items-center">
            <span className="mr-2 text-xl">🔑</span>
            Đăng nhập
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="flex items-center">
            <span className="mr-2 text-xl">🏠</span>
            Trang chủ
          </Button>
        </Link>
        <Button variant="ghost" className="flex items-center" onClick={() => window.history.back()}>
          <span className="mr-2 text-xl">←</span>
          Quay lại
        </Button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p>
          Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với chúng tôi tại{" "}
          <a href="mailto:support@techstore.com" className="text-blue-600 hover:underline">
            support@techstore.com
          </a>
        </p>
      </div>
    </div>
  );
}