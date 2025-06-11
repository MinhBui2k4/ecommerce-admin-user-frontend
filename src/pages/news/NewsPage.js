import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Card, { CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { GET_ALL_NEWS } from "../../api/apiService";
import { getCachedNews } from "../../utils/newsCache";

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pagination, setPagination] = useState({
    pageSize: 5,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
  });

  const fetchNews = useCallback(async (pageNumber, pageSize) => {
    try {
      setLoading(true);
      const response = await getCachedNews(GET_ALL_NEWS, { pageNumber, pageSize });
      console.log("API Response:", response);
      if (!response.content) {
        throw new Error("No content in API response");
      }
      setNewsItems(
        response.content.map((item) => ({
          ...item,
          author: "TechStore Editor",
          category: "Công nghệ",
          excerpt: item.content.slice(0, 100) + "...",
          date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
        }))
      );
      setPagination({
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 1,
        lastPage: response.lastPage || true,
      });
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setNewsItems([]);
      setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 1, lastPage: true }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(pageNumber, pagination.pageSize);
  }, [pageNumber, fetchNews]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPageNumber(newPage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl animate-pulse">Tin tức công nghệ</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-3 border rounded-lg">
                    <div className="relative h-48 md:h-64 bg-gray-200"></div>
                    <div className="md:col-span-2 p-4 md:p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="border rounded-lg p-4 md:p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-4 bg-gray-200 rounded w-2/3"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Tin tức công nghệ</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {newsItems.length === 0 ? (
              <p className="col-span-full text-center text-2xl font-semibold text-gray-600">
                Không có tin tức nào.
              </p>
            ) : (
              newsItems.map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="relative h-48 md:h-full">
                      <img
                        src={`http://localhost:8080/api/news/image/${news.image}`}
                        alt={news.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/images/news-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <CardContent className="p-4 md:p-6">
                        <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                        <Link to={`/news/${news.id}`}>
                          <h2 className="mb-2 text-lg font-bold hover:text-red-600 md:text-2xl">{news.title}</h2>
                        </Link>
                        <p className="mb-4 text-gray-600">{news.excerpt}</p>
                        <Link to={`/news/${news.id}`} className="group inline-flex items-center text-red-600 hover:underline">
                          Đọc thêm <span className="ml-1 text-xl transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          {newsItems.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <Button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 0}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Trang {pageNumber + 1} / {pagination.totalPages} (Tổng {pagination.totalElements || 0} tin tức)
              </span>
              <Button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber >= pagination.totalPages - 1}
                className="disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="mb-4 text-lg font-semibold md:text-xl">Danh mục</h3>
              <div className="space-y-2">
                {["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện", "Công nghệ", "Phần cứng", "Phần mềm"].map(
                  (category, index) => (
                    <Link
                      key={index}
                      // to={`/news`}
                      // to={`/news/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      {category}
                    </Link>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}