import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import Card, { CardContent } from "../../components/ui/Card";
import { GET_NEWS_BY_ID, GET_ALL_NEWS } from "../../api/apiService";
import { getCachedNews, getCachedNewsById } from "../../utils/newsCache";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [newsData, allNews] = await Promise.all([
          getCachedNewsById(GET_NEWS_BY_ID, id),
          getCachedNews(GET_ALL_NEWS, { pageNumber: 0, pageSize: 3 }),
        ]);
        setNews({
          ...newsData,
          author: "TechStore Editor",
          category: "Công nghệ",
          tags: ["Công nghệ", "Tin tức"],
          date: new Date(newsData.createdAt).toLocaleDateString("vi-VN"),
        });
        setRelatedNews(
          allNews.content
            .filter((item) => item.id !== parseInt(id))
            .slice(0, 2)
            .map((item) => ({
              ...item,
              date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
            }))
        );
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Đã sao chép liên kết");
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="flex flex-wrap items-center gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 rounded w-20"></div>
                ))}
              </div>
              <div className="relative aspect-video w-full bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border rounded-lg p-4 md:p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex space-x-4 border rounded-lg p-3 animate-pulse">
                  <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Bài viết không tồn tại</h2>
          <p className="mb-6 text-gray-600">{error || "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}</p>
          <Link to="/news">
            <Button>Quay lại trang tin tức</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <span className="mr-2">←</span>
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article>
            <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">{news.title}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                <span>{news.date}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">👤</span>
                <span>{news.author}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🏷️</span>
                <span>{news.category}</span>
              </div>
            </div>

            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={`http://localhost:8080/api/news/image/${news.image}`}
                alt={news.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = "/images/news-placeholder.jpg";
                }}
              />
            </div>

            <div className="prose max-w-none">
              {news.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8">
              <h3 className="mb-2 text-lg font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/news/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8">
              <h3 className="mb-2 text-lg font-semibold">Chia sẻ bài viết</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="text-blue-600 text-xl">📘</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="text-blue-400 text-xl">🐦</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <span className="text-blue-700 text-xl">💼</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopyLink}>
                  {copied ? <span className="text-green-500 text-xl">✓</span> : <span className="text-xl">📋</span>}
                </Button>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Author */}
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  {/* <img
                    src="/images/author-placeholder.jpg"
                    alt={news.author}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  /> */}
                </div>
                <div>
                  <h3 className="font-semibold">{news.author}</h3>
                  <p className="text-sm text-gray-500">Biên tập viên công nghệ</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Chuyên gia công nghệ với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ thông tin và thiết bị di động.
              </p>
            </CardContent>
          </Card>

          {/* Related News */}
          <div>
            <h3 className="mb-4 text-lg font-semibold md:text-xl">Bài viết liên quan</h3>
            <div className="space-y-4">
              {relatedNews.map((item) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                  <div className="flex space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:8080/api/news/image/${item.image}`}
                        alt={item.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/images/news-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2 md:text-base">{item.title}</h4>
                      <p className="mt-1 text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}