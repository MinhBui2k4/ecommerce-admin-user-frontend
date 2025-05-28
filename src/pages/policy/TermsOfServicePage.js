import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Link to="/">
          <Button variant="ghost" className="mr-4 flex items-center">
            <span className="mr-2 text-xl">←</span>
            Quay lại trang chủ
          </Button>
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Điều khoản sử dụng</h1>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg font-semibold">
          Chào mừng bạn đến với TechStore. Khi truy cập và sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và chịu
          ràng buộc bởi các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">1. Điều khoản sử dụng</h2>
        <p>
          Bằng việc truy cập và sử dụng trang web TechStore, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các
          điều khoản và điều kiện này, cũng như chính sách bảo mật của chúng tôi. Nếu bạn không đồng ý với bất kỳ phần
          nào của các điều khoản này, vui lòng không sử dụng trang web của chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">2. Tài khoản người dùng</h2>
        <p>
          Khi tạo tài khoản trên trang web của chúng tôi, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn
          chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu của mình, và bạn đồng ý chịu trách nhiệm cho
          tất cả các hoạt động diễn ra dưới tài khoản của mình.
        </p>
        <p>
          Chúng tôi có quyền từ chối dịch vụ, đóng tài khoản, xóa hoặc chỉnh sửa nội dung, hoặc hủy đơn hàng theo quyết
          định riêng của chúng tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">3. Sản phẩm và giá cả</h2>
        <p>
          Chúng tôi nỗ lực để cung cấp thông tin chính xác về sản phẩm và giá cả trên trang web của mình. Tuy nhiên,
          chúng tôi không đảm bảo rằng thông tin sản phẩm, mô tả, hình ảnh, giá cả hoặc bất kỳ nội dung nào khác trên
          trang web là chính xác, đầy đủ, đáng tin cậy, cập nhật hoặc không có lỗi.
        </p>
        <p>
          Chúng tôi có quyền giới hạn số lượng sản phẩm bán cho mỗi người, hộ gia đình hoặc đơn hàng. Các giới hạn này
          có thể áp dụng cho các đơn hàng được đặt bởi cùng một tài khoản khách hàng, cùng một thẻ tín dụng, và/hoặc các
          đơn hàng sử dụng cùng một địa chỉ thanh toán hoặc giao hàng.
        </p>

        <h2 className="mt-6 text-xl font-semibold">4. Đặt hàng và thanh toán</h2>
        <p>
          Khi đặt hàng trên trang web của chúng tôi, bạn đảm bảo rằng tất cả thông tin bạn cung cấp là chính xác và đầy
          đủ. Chúng tôi có quyền từ chối hoặc hủy đơn hàng của bạn vì bất kỳ lý do gì vào bất kỳ lúc nào, bao gồm nhưng
          không giới hạn ở việc không có sẵn sản phẩm, lỗi trong mô tả hoặc giá sản phẩm, hoặc nghi ngờ gian lận.
        </p>
        <p>
          Bạn đồng ý thanh toán đầy đủ cho tất cả các sản phẩm bạn mua, bao gồm tất cả các khoản phí vận chuyển và thuế
          áp dụng. Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau, như được nêu trên trang web của chúng
          tôi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">5. Vận chuyển và giao hàng</h2>
        <p>
          Chúng tôi sẽ nỗ lực để giao hàng đúng thời gian, nhưng không đảm bảo thời gian giao hàng. Chúng tôi không chịu
          trách nhiệm về bất kỳ sự chậm trễ nào ngoài tầm kiểm soát của chúng tôi.
        </p>
        <p>
          Bạn chịu trách nhiệm cung cấp địa chỉ giao hàng chính xác và đảm bảo rằng có người nhận hàng tại địa chỉ đó.
          Nếu gói hàng bị trả lại do địa chỉ không chính xác hoặc không có người nhận, bạn có thể phải chịu phí vận
          chuyển bổ sung.
        </p>

        <h2 className="mt-6 text-xl font-semibold">6. Chính sách đổi trả</h2>
        <p>
          Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 15 ngày kể từ ngày mua, với điều kiện sản phẩm còn nguyên
          trạng, chưa qua sử dụng và còn đầy đủ bao bì, phụ kiện. Vui lòng tham khảo{" "}
          <Link to="/policy/return" className="text-blue-600 hover:underline">
            Chính sách đổi trả
          </Link>{" "}
          của chúng tôi để biết thêm chi tiết.
        </p>

        <h2 className="mt-6 text-xl font-semibold">7. Quyền sở hữu trí tuệ</h2>
        <p>
          Tất cả nội dung trên trang web của chúng tôi, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, biểu
          tượng, hình ảnh, clip âm thanh, tải xuống kỹ thuật số, tổng hợp dữ liệu và phần mềm, đều là tài sản của
          TechStore hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ Việt Nam và quốc
          tế.
        </p>
        <p>
          Bạn không được sao chép, tái sản xuất, phân phối, xuất bản, hiển thị công khai, sửa đổi, tạo ra các tác phẩm
          phái sinh, bán hoặc khai thác bất kỳ nội dung nào từ trang web của chúng tôi mà không có sự cho phép rõ ràng
          bằng văn bản từ TechStore.
        </p>

        <h2 className="mt-6 text-xl font-semibold">8. Giới hạn trách nhiệm</h2>
        <p>
          TechStore và các giám đốc, nhân viên, đại lý, nhà cung cấp hoặc đối tác của chúng tôi sẽ không chịu trách
          nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng trang web hoặc các sản
          phẩm được mua thông qua trang web, bao gồm nhưng không giới hạn ở thiệt hại trực tiếp, gián tiếp, ngẫu nhiên,
          trừng phạt, đặc biệt hoặc hậu quả.
        </p>

        <h2 className="mt-6 text-xl font-semibold">9. Luật áp dụng và giải quyết tranh chấp</h2>
        <p>
          Các điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp Việt Nam. Bất kỳ tranh chấp nào phát sinh
          từ hoặc liên quan đến các điều khoản này sẽ được giải quyết thông qua thương lượng thiện chí. Nếu không thể
          giải quyết thông qua thương lượng, tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại Việt Nam.
        </p>

        <h2 className="mt-6 text-xl font-semibold">10. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được
          đăng trên trang web. Việc bạn tiếp tục sử dụng trang web sau khi đăng các thay đổi sẽ cấu thành sự chấp nhận
          của bạn đối với các điều khoản đã sửa đổi.
        </p>

        <h2 className="mt-6 text-xl font-semibold">11. Liên hệ</h2>
        <p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua:</p>
        <ul className="list-disc pl-6">
          <li>Email: terms@techstore.com</li>
          <li>Điện thoại: (028) 1234 5678</li>
          <li>Địa chỉ: Số 20 Tăng Nhơn Phú, Phường Phước Long B, TP Thủ Đức, TP. Hồ Chí Minh</li>
        </ul>

        <p className="text-sm text-gray-500 mt-8">Cập nhật lần cuối: 01/05/2025</p>
      </div>
    </div>
  );
}