const productCache = new Map();

export async function fetchProductsByIds(productIds, GET_PRODUCT_BY_ID) {
  const uniqueProductIds = [...new Set(productIds)]; // Loại bỏ trùng lặp
  const productsToFetch = uniqueProductIds.filter((id) => !productCache.has(id));
  const cachedProducts = uniqueProductIds
    .filter((id) => productCache.has(id))
    .map((id) => productCache.get(id));

  if (productsToFetch.length > 0) {
    // Giả lập batch request: gọi từng sản phẩm (có thể thay bằng API batch nếu backend hỗ trợ)
    const productPromises = productsToFetch.map((id) =>
      GET_PRODUCT_BY_ID(id).catch((error) => {
        console.error(`Error fetching product ${id}:`, error);
        return null;
      })
    );
    const fetchedProducts = await Promise.all(productPromises);
    fetchedProducts.forEach((product) => {
      if (product) {
        productCache.set(product.id, product);
      }
    });
    return [...cachedProducts, ...fetchedProducts.filter((p) => p !== null)];
  }

  return cachedProducts;
}

export function clearProductCache() {
  productCache.clear();
}