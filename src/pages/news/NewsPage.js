import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card, {  CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { GET_ALL_NEWS } from "../../api/apiService";

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 6,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
  });

  useEffect(() => {
    GET_ALL_NEWS({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize })
      .then((response) => {
        setNewsItems(
          response.content.map((item) => ({
            ...item,
            author: "TechStore Editor", // Giả lập
            category: "Công nghệ", // Giả lập
            excerpt: item.content.slice(0, 100) + "...", // Tạo excerpt từ content
            date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
          }))
        );
        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements || response.content.length,
          totalPages: response.totalPages,
          lastPage: response.lastPage,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch news:", error);
        setLoading(false);
      });
  }, [pagination.pageNumber]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  if (loading) return <p className="text-center py-8">Đang tải...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Tin tức công nghệ</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {newsItems.length === 0 ? (
              <p className="text-center text-gray-600">Không có tin tức nào.</p>
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
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber === 0}
              className="disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Trang {pagination.pageNumber + 1} / {pagination.totalPages} (Tổng {pagination.totalElements || 0} tin tức)
            </span>
            <Button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages - 1}
              className="disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="mb-4 text-lg font-semibold md:text-xl">Danh mục</h3>
              <div className="space-y-2">
                {["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện", "Công nghệ", "Phần cứng", "Phần mềm"].map(
                  (category, index) => (
                    <Link
                      key={index}
                      to={`/news/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
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