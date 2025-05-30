import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { GET_HERO_SECTIONS } from "../../api/apiService";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GET_HERO_SECTIONS({ pageNumber: 0, pageSize: 5 })
      .then((response) => {
        const fetchedSlides = response.content.map((item) => ({
          id: item.id,
          title: item.heading,
          description: item.subheading,
          image: `http://localhost:8080/api/hero/image/${item.backgroundImage}`,
          cta: "Mua ngay",
          link: "/products",
        }));
        setSlides(fetchedSlides);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch hero sections:", error);
        setSlides([
          {
            id: 1,
            title: "Khám phá công nghệ đỉnh cao",
            description: "Trải nghiệm sản phẩm mới nhất",
            image: "/images/hero-placeholder.jpg",
            cta: "Mua ngay",
            link: "/products",
          },
        ]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (loading)
    return <p className="text-center py-16">Đang tải...</p>;

  return (
    <section className="w-full relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative h-full w-full">
            {/* <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-full h-full"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = "/images/hero-placeholder.jpg";
              }}
              style={{
                objectFit: "cover",
                imageRendering: "auto",
                maxWidth: "100%",
                height: "100%"
              }}
            /> */}
            <div className="absolute inset-0 bg-black/40">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full container mx-auto px-4">
                  <div
                    className={`max-w-xl text-white animate-slide-up`}
                    style={{
                      animation:
                        index === currentSlide ? "slideUp 0.8s ease-in-out" : "none",
                    }}
                  >
                    <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mb-8 text-lg md:text-xl">{slide.description}</p>
                    <Link to={slide.link}>
                      <Button size="lg" className="font-medium px-8 py-3">
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicator buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-8 rounded-full transition-colors ${
              index === currentSlide ? "bg-red-600" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Inline animation style */}
      <style jsx="true">{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}
