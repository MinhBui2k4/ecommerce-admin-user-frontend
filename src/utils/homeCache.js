const homeCache = {
  heroSlides: null,
  featuredProducts: null,
};

export async function getCachedHeroSlides(GET_HERO_SECTIONS) {
  if (homeCache.heroSlides) {
    return homeCache.heroSlides;
  }
  const response = await GET_HERO_SECTIONS({ pageNumber: 0, pageSize: 5 });
  const fetchedSlides = response.content.map((item) => ({
    id: item.id,
    title: item.heading,
    description: item.subheading,
    image: `http://localhost:8080/api/hero/image/${item.backgroundImage}`,
    cta: "Mua ngay",
    link: "/products",
  }));
  homeCache.heroSlides = fetchedSlides;
  return homeCache.heroSlides;
}

export async function getCachedFeaturedProducts(GET_ALL_PRODUCTS) {
  if (homeCache.featuredProducts) {
    return homeCache.featuredProducts;
  }
  const response = await GET_ALL_PRODUCTS({ pageNumber: 0, pageSize: 8 });
  homeCache.featuredProducts = response.content;
  return homeCache.featuredProducts;
}

export function clearHomeCache() {
  homeCache.heroSlides = null;
  homeCache.featuredProducts = null;
}