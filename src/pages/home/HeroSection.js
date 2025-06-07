import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GET_HERO_SECTIONS } from "../../api/apiService";
import { getCachedHeroSlides } from "../../utils/homeCache";

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const fetchedSlides = await getCachedHeroSlides(GET_HERO_SECTIONS);
        setSlides(fetchedSlides);
      } catch (error) {
        console.error("Failed to fetch hero sections:", error);
        setSlides([
          {
            id: 1,
            image: "/images/hero-placeholder.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (loading) {
    return (
      <section className="w-full relative h-[500px] md:h-[600px] overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gray-200"></div>
      </section>
    );
  }

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
            <Link to="/products">
              <img
                src={slide.image}
                alt="Hero Slide"
                className="object-contain w-full h-full"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/images/hero-placeholder.jpg";
                }}
                style={{
                  objectFit: "contain", // Đảm bảo ảnh hiển thị đầy đủ
                  imageRendering: "auto",
                  maxWidth: "100%",
                  height: "100%",
                }}
              />
            </Link>
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
    </section>
  );
}