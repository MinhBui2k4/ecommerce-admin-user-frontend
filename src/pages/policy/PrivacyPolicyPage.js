import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link to="/">
          <Button variant="ghost" className="mr-4 flex items-center">
            <span className="mr-2 text-xl">←</span>
            Quay lại trang chủ
          </Button>
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Chính sách bảo mật</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg font-semibold">
          Tại TechStore, chúng tôi coi trọng việc bảo vệ thông tin cá nhân của khách hàng. Chính sách bảo mật này mô tả
          cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. Thông tin chúng tôi thu thập</h2>
        <p>Chúng tôi có thể thu thập các loại thông tin sau đây:</p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng, thông tin thanh
            toán.
          </li>
          <li>
            <strong>Thông tin thiết bị:</strong> Địa chỉ IP, loại thiết bị, hệ điều hành, trình duyệt web, thời gian
            truy cập.
          </li>
          <li>
            <strong>Thông tin giao dịch:</strong> Chi tiết về sản phẩm bạn mua, phương thức thanh toán, lịch sử đơn
            hàng.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">2. Mục đích thu thập thông tin</h2>
        <p>Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>
        <ul className="list-disc pl-6">
          <li>Xử lý và giao hàng đơn hàng của bạn</li>
          <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
          <li>Gửi thông báo về tình trạng đơn hàng và tài khoản</li>
          <li>Cải thiện trải nghiệm mua sắm của bạn</li>
          <li>Gửi thông tin về sản phẩm, dịch vụ và khuyến mãi (nếu bạn đăng ký)</li>
          <li>Phòng chống gian lận và bảo mật tài khoản</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">3. Bảo vệ thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật thích hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép,
          thay đổi, tiết lộ hoặc phá hủy. Các biện pháp này bao gồm:
        </p>
        <ul className="list-disc pl-6">
          <li>Mã hóa dữ liệu nhạy cảm như thông tin thanh toán</li>
          <li>Hạn chế quyền truy cập vào thông tin cá nhân</li>
          <li>Sử dụng kết nối bảo mật (SSL/TLS) khi truyền dữ liệu</li>
          <li>Thường xuyên đánh giá và cập nhật các biện pháp bảo mật</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">4. Chia sẻ thông tin</h2>
        <p>Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Đối tác dịch vụ:</strong> Chúng tôi có thể chia sẻ thông tin với các đối tác cung cấp dịch vụ cho
            chúng tôi (như dịch vụ vận chuyển, thanh toán, hỗ trợ khách hàng).
          </li>
          <li>
            <strong>Tuân thủ pháp luật:</strong> Chúng tôi có thể tiết lộ thông tin khi được yêu cầu bởi pháp luật hoặc
            cơ quan nhà nước có thẩm quyền.
          </li>
          <li>
            <strong>Bảo vệ quyền lợi:</strong> Chúng tôi có thể chia sẻ thông tin để bảo vệ quyền lợi, tài sản hoặc an
            toàn của chúng tôi, khách hàng hoặc người khác.
          </li>
        </ul>
        <p>
          Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba cho mục đích tiếp thị mà
          không có sự đồng ý của bạn.
        </p>

        <h2 className="mt-6 text-xl font-semibold">5. Quyền của bạn</h2>
        <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
        <ul className="list-disc pl-6">
          <li>Quyền truy cập và nhận bản sao thông tin cá nhân của bạn</li>
          <li>Quyền yêu cầu chỉnh sửa thông tin không chính xác</li>
          <li>Quyền yêu cầu xóa thông tin trong một số trường hợp</li>
          <li>Quyền hạn chế hoặc phản đối việc xử lý thông tin</li>
          <li>Quyền rút lại sự đồng ý (nếu việc xử lý dựa trên sự đồng ý)</li>
        </ul>
        <p>Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi theo thông tin ở mục "Liên hệ" bên dưới.</p>

        <h2 className="mt-6 text-xl font-semibold">6. Cookie và công nghệ tương tự</h2>
        <p>
          Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn trên trang web của chúng
          tôi. Cookie là các tệp nhỏ được lưu trữ trên thiết bị của bạn để ghi nhớ thông tin về hoạt động của bạn.
        </p>
        <p>Chúng tôi sử dụng cookie cho các mục đích sau:</p>
        <ul className="list-disc pl-6">
          <li>Duy trì phiên đăng nhập của bạn</li>
          <li>Ghi nhớ các mặt hàng trong giỏ hàng của bạn</li>
          <li>Phân tích cách bạn sử dụng trang web của chúng tôi</li>
          <li>Cá nhân hóa trải nghiệm của bạn</li>
        </ul>
        <p>
          Bạn có thể quản lý cookie thông qua cài đặt trình duyệt của mình. Tuy nhiên, việc vô hiệu hóa cookie có thể
          ảnh hưởng đến trải nghiệm của bạn trên trang web của chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. Thay đổi chính sách bảo mật</h2>
        <p>
          Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh những thay đổi trong hoạt động
          kinh doanh hoặc để tuân thủ các yêu cầu pháp lý. Chúng tôi sẽ thông báo cho bạn về những thay đổi quan trọng
          bằng cách đăng thông báo trên trang web của chúng tôi hoặc gửi email trực tiếp cho bạn.
        </p>

        <h2 className="mt-6 text-xl font-semibold">8. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào liên quan đến chính sách bảo mật này hoặc cách chúng tôi
          xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi theo:
        </p>
        <ul className="list-disc pl-6">
          <li>Email: privacy@techstore.com</li>
          <li>Điện thoại: (028) 1234 5678</li>
          <li>Địa chỉ: Số 20 Tăng Nhơn Phú, Phường Phước Long B, TP Thủ Đức, TP. Hồ Chí Minh</li>
        </ul>

        <p className="text-sm text-gray-500 mt-8">Cập nhật lần cuối: 01/05/2025</p>
      </div>
    </div>
  );
}