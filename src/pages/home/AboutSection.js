import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

const benefits = [
  "Sản phẩm chính hãng 100%",
  "Giao hàng nhanh chóng toàn quốc",
  "Đổi trả trong vòng 15 ngày",
  "Bảo hành chính hãng lên đến 24 tháng",
  "Tư vấn chuyên nghiệp 24/7",
  "Giá cả cạnh tranh nhất thị trường",
];

export default function AboutSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative h-[400px] overflow-hidden rounded-lg md:h-full">
          {/* <img
            src="/images/about-techstore.jpg"
            alt="TechStore Store"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = "/images/placeholder.jpg";
            }}
          /> */}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="mb-6 text-3xl font-bold">Về TechStore</h2>
          <p className="mb-6 text-gray-700">
            TechStore là cửa hàng điện tử hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm công nghệ chính hãng với
            chất lượng cao và giá cả cạnh tranh. Chúng tôi tự hào mang đến cho khách hàng những trải nghiệm mua sắm
            tuyệt vời nhất với dịch vụ chăm sóc khách hàng tận tâm.
          </p>
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2 h-5 w-5 text-red-600">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          <Link to="/about">
            <Button size="lg"  className="font-medium px-8 py-3">Tìm hiểu thêm</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}