import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link to="/">
          <Button variant="ghost" className="mr-4 flex items-center">
            <span className="mr-2 text-xl">←</span>
            Quay lại trang chủ
          </Button>
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Chính sách đổi trả</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg font-semibold">
          TechStore cam kết mang đến cho khách hàng trải nghiệm mua sắm tốt nhất. Chính sách đổi trả này được thiết kế
          để đảm bảo sự hài lòng của bạn với mọi sản phẩm mua từ chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. Điều kiện đổi trả</h2>
        <p>Chúng tôi chấp nhận đổi trả sản phẩm trong các trường hợp sau:</p>
        <ul className="list-disc pl-6">
          <li>Sản phẩm bị lỗi kỹ thuật hoặc hư hỏng do nhà sản xuất</li>
          <li>Sản phẩm không đúng với mô tả trên trang web</li>
          <li>Sản phẩm không đúng với đơn đặt hàng của bạn (sai mẫu mã, màu sắc, kích thước)</li>
          <li>Sản phẩm còn trong thời gian bảo hành và gặp vấn đề không thể sửa chữa</li>
          <li>Bạn đơn giản là không hài lòng với sản phẩm (áp dụng trong vòng 15 ngày kể từ ngày mua)</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">2. Thời hạn đổi trả</h2>
        <p>
          <strong>Đối với sản phẩm lỗi do nhà sản xuất:</strong> Thời hạn đổi trả là 30 ngày kể từ ngày nhận hàng.
        </p>
        <p>
          <strong>Đối với sản phẩm không đúng mô tả hoặc đơn hàng:</strong> Thời hạn đổi trả là 15 ngày kể từ ngày nhận
          hàng.
        </p>
        <p>
          <strong>Đối với trường hợp không hài lòng với sản phẩm:</strong> Thời hạn đổi trả là 15 ngày kể từ ngày nhận
          hàng.
        </p>

        <h2 className="mt-6 text-xl font-semibold">3. Điều kiện của sản phẩm đổi trả</h2>
        <p>Để đủ điều kiện đổi trả, sản phẩm phải đáp ứng các yêu cầu sau:</p>
        <ul className="list-disc pl-6">
          <li>Còn nguyên trạng, không có dấu hiệu đã qua sử dụng (trừ trường hợp sản phẩm bị lỗi)</li>
          <li>Còn đầy đủ bao bì, hộp đựng, phụ kiện đi kèm, tài liệu hướng dẫn, thẻ bảo hành</li>
          <li>Có hóa đơn mua hàng hoặc chứng từ chứng minh việc mua hàng tại TechStore</li>
          <li>Đối với sản phẩm điện tử, không được cài đặt phần mềm, jailbreak hoặc root</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">4. Quy trình đổi trả</h2>
        <p>Để đổi trả sản phẩm, vui lòng thực hiện theo các bước sau:</p>
        <ol className="list-decimal pl-6">
          <li>
            <strong>Liên hệ với chúng tôi:</strong> Thông báo về việc đổi trả qua email, điện thoại hoặc trực tiếp tại
            cửa hàng trong thời hạn quy định.
          </li>
          <li>
            <strong>Cung cấp thông tin:</strong> Cung cấp thông tin về đơn hàng, lý do đổi trả và hình ảnh sản phẩm (nếu
            có).
          </li>
          <li>
            <strong>Nhận mã đổi trả:</strong> Sau khi yêu cầu được chấp nhận, bạn sẽ nhận được mã đổi trả và hướng dẫn
            gửi sản phẩm.
          </li>
          <li>
            <strong>Gửi sản phẩm:</strong> Đóng gói sản phẩm cẩn thận và gửi về địa chỉ được cung cấp, kèm theo mã đổi
            trả.
          </li>
          <li>
            <strong>Kiểm tra sản phẩm:</strong> Chúng tôi sẽ kiểm tra sản phẩm khi nhận được và thông báo kết quả cho
            bạn.
          </li>
          <li>
            <strong>Hoàn tất đổi trả:</strong> Nếu yêu cầu đổi trả được chấp nhận, chúng tôi sẽ tiến hành đổi sản phẩm
            mới hoặc hoàn tiền theo yêu cầu của bạn.
          </li>
        </ol>

        <h2 className="mt-6 text-xl font-semibold">5. Hình thức hoàn tiền</h2>
        <p>Tùy thuộc vào phương thức thanh toán ban đầu, việc hoàn tiền sẽ được thực hiện như sau:</p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Thanh toán bằng thẻ tín dụng/ghi nợ:</strong> Hoàn tiền vào thẻ đã dùng để thanh toán (thời gian
            hoàn tiền tùy thuộc vào ngân hàng phát hành thẻ, thường từ 5-15 ngày làm việc).
          </li>
          <li>
            <strong>Thanh toán bằng chuyển khoản ngân hàng:</strong> Hoàn tiền vào tài khoản ngân hàng do bạn cung cấp
            (thời gian hoàn tiền từ 3-5 ngày làm việc).
          </li>
          <li>
            <strong>Thanh toán khi nhận hàng (COD):</strong> Hoàn tiền bằng chuyển khoản ngân hàng hoặc tiền mặt tại cửa
            hàng.
          </li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">6. Chi phí đổi trả</h2>
        <p>
          <strong>Đối với sản phẩm lỗi do nhà sản xuất hoặc giao sai:</strong> TechStore sẽ chịu toàn bộ chi phí vận
          chuyển cho việc đổi trả.
        </p>
        <p>
          <strong>Đối với trường hợp khách hàng đổi ý hoặc không hài lòng:</strong> Khách hàng sẽ chịu chi phí vận
          chuyển cho việc gửi sản phẩm về TechStore. Chi phí vận chuyển sản phẩm mới (nếu đổi) sẽ do TechStore chi trả.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. Sản phẩm không được đổi trả</h2>
        <p>Một số sản phẩm không thuộc diện được đổi trả, bao gồm:</p>
        <ul className="list-disc pl-6">
          <li>Phần mềm máy tính đã được kích hoạt hoặc mở seal</li>
          <li>Tai nghe đã mở seal vì lý do vệ sinh</li>
          <li>Sản phẩm được cá nhân hóa theo yêu cầu của khách hàng</li>
          <li>Thẻ quà tặng hoặc mã giảm giá</li>
          <li>Sản phẩm bị hư hỏng do lỗi sử dụng của người dùng</li>
        </ul>

        <h2 className="mt-6 text-xl font-semibold">8. Bảo hành sản phẩm</h2>
        <p>
          Chính sách đổi trả này không thay thế cho chính sách bảo hành của sản phẩm. Sau thời hạn đổi trả, sản phẩm vẫn
          được bảo hành theo chính sách bảo hành của nhà sản xuất.
        </p>
        <p>
          Để biết thêm thông tin về bảo hành, vui lòng tham khảo thẻ bảo hành đi kèm với sản phẩm hoặc liên hệ với chúng
          tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">9. Liên hệ hỗ trợ đổi trả</h2>
        <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách đổi trả hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua:</p>
        <ul className="list-disc pl-6">
          <li>Email: returns@techstore.com</li>
          <li>Điện thoại: (028) 1234 5678 (Phím 2 - Bộ phận đổi trả)</li>
          <li>Trực tiếp tại cửa hàng: Số 20 Tăng Nhơn Phú, Phường Phước Long B, TP Thủ Đức, TP. Hồ Chí Minh</li>
        </ul>

        <p className="text-sm text-gray-500 mt-8">Cập nhật lần cuối: 01/05/2025</p>
      </div>
    </div>
  );
}