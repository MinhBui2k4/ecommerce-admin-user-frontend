const filterCache = {
  brands: null,
  categories: null,
};

export async function getCachedBrands(GET_ALL_BRANDS) {
  if (filterCache.brands) {
    return filterCache.brands;
  }
  const brandsData = await GET_ALL_BRANDS();
  filterCache.brands = brandsData.content || [];
  return filterCache.brands;
}

export async function getCachedCategories(GET_ALL_CATEGORIES) {
  if (filterCache.categories) {
    return filterCache.categories;
  }
  const categoriesData = await GET_ALL_CATEGORIES();
  filterCache.categories = categoriesData.content || [];
  return filterCache.categories;
}

export function clearFilterCache() {
  filterCache.brands = null;
  filterCache.categories = null;
}