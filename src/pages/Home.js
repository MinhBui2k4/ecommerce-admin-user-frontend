import HeroSection from "./home/HeroSection";
import CategorySection from "./home/CategorySection";
import FeaturedProducts from "./home/FeaturedProducts";
import AboutSection from "./home/AboutSection";

export default function Home() {
  return (
    <div>
      {/* FULL WIDTH SECTION */}
      <HeroSection />

      {/* CONTAINER WRAPPED SECTION */}
      <div className="container mx-auto px-4">
        <CategorySection />
        <FeaturedProducts />
        <AboutSection />
      </div>
    </div>
  );
}
