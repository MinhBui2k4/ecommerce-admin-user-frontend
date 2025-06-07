import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <span className="text-4xl text-red-600">🚫</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Trang không tìm thấy</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/">
          <Button className="flex items-center">
            <span className="mr-2 text-xl">🏠</span>
            Quay về trang chủ
          </Button>
        </Link>
        <Button variant="ghost" className="flex items-center" onClick={() => window.history.back()}>
          <span className="mr-2 text-xl">←</span>
          Quay lại
        </Button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p>
          Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi tại{" "}
          <a href="mailto:support@techstore.com" className="text-blue-600 hover:underline">
            support@techstore.com
          </a>
        </p>
      </div>
    </div>
  );
}