import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card, { CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { GET_ALL_NEWS } from "../../api/apiService";
import { getCachedNews } from "../../utils/newsCache";
import techstoreImage from "../../assets/images/img_home.png";


export default function AboutPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getCachedNews(GET_ALL_NEWS, { pageNumber: 0, pageSize: 3 });
        setNewsItems(response.content || []);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Our Story */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                TechStore được thành lập vào năm 2015 với sứ mệnh mang đến cho người dùng Việt Nam những sản phẩm công
                nghệ chính hãng với giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
              </p>
              <p>
                Từ một cửa hàng nhỏ tại Thành phố Hồ Chí Minh, chúng tôi đã phát triển thành một trong những chuỗi cửa
                hàng điện tử uy tín nhất tại Việt Nam với hơn 20 chi nhánh trên toàn quốc.
              </p>
              <p>
                Chúng tôi tự hào là đối tác chính thức của nhiều thương hiệu công nghệ hàng đầu thế giới như Apple,
                Samsung, Dell, HP, Asus và nhiều thương hiệu khác. Điều này đảm bảo rằng khách hàng của chúng tôi luôn
                nhận được sản phẩm chính hãng với chất lượng tốt nhất.
              </p>
            </div>
          </div>
          <div className="relative max-w-[500px] w-full rounded-lg overflow-hidden">
            <img
              src={techstoreImage}
              alt="TechStore Store"
              className="object-cover w-full h-auto"
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12 md:mb-16">
        <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">👥</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Khách hàng là trọng tâm</h3>
              <p className="text-gray-600">
                Chúng tôi luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu trong mọi quyết định.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">✓</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Chất lượng và uy tín</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết cung cấp sản phẩm chính hãng với chất lượng tốt nhất và dịch vụ đáng tin cậy.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">🎯</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Đổi mới và sáng tạo</h3>
              <p className="text-gray-600">
                Chúng tôi không ngừng cải tiến và áp dụng công nghệ mới để nâng cao trải nghiệm mua sắm.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">🏆</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Chuyên nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ nhân viên được đào tạo chuyên nghiệp, am hiểu sản phẩm và tận tâm với khách hàng.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">📈</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Phát triển bền vững</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết phát triển bền vững, có trách nhiệm với cộng đồng và môi trường.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <span className="mb-4 text-3xl text-blue-600">⏰</span>
              <h3 className="mb-2 text-lg font-semibold md:text-xl">Dịch vụ nhanh chóng</h3>
              <p className="text-gray-600">
                Chúng tôi cung cấp dịch vụ giao hàng, bảo hành và hỗ trợ kỹ thuật nhanh chóng, hiệu quả.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="rounded-lg bg-blue-100 p-6 text-center md:p-8">
        <h2 className="mb-4 text-2xl font-bold md:text-3xl">Liên hệ với chúng tôi</h2>
        <p className="mx-auto mb-6 max-w-2xl text-gray-700">
          Bạn có câu hỏi hoặc cần tư vấn về sản phẩm? Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>
        <Link to="/contact">
          <Button size="lg" className="px-8 py-3">Liên hệ ngay</Button>
        </Link>
      </section>
    </div>
  );
}