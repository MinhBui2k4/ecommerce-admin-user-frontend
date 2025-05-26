import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Laptop",
    icon: "💻",
    link: "/products?category=laptop",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 2,
    name: "Điện thoại",
    icon: "📱",
    link: "/products?category=smartphone",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    name: "Máy tính bảng",
    icon: "📟",
    link: "/products?category=tablet",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    name: "Đồng hồ thông minh",
    icon: "⌚",
    link: "/products?category=smartwatch",
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 5,
    name: "Phụ kiện",
    icon: "🎧",
    link: "/products?category=accessories",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export default function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-8 text-center text-3xl font-bold">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group flex flex-col items-center rounded-lg p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${category.color}`}>
              <span className={`text-3xl ${category.iconColor}`}>{category.icon}</span>
            </div>
            <h3 className="text-lg font-medium group-hover:text-red-600">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}