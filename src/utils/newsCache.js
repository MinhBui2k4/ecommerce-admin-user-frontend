const newsCache = {};

export async function getCachedNews(GET_ALL_NEWS, params) {
  const cacheKey = `${params.pageNumber}-${params.pageSize}`;
  if (newsCache[cacheKey]) {
    return newsCache[cacheKey];
  }
  const response = await GET_ALL_NEWS(params);
  newsCache[cacheKey] = response;
  return newsCache[cacheKey];
}

export async function getCachedNewsById(GET_NEWS_BY_ID, id) {
  if (newsCache[id]) {
    return newsCache[id];
  }
  const response = await GET_NEWS_BY_ID(id);
  newsCache[id] = response;
  return newsCache[id];
}

export function clearNewsCache() {
  Object.keys(newsCache).forEach((key) => {
    delete newsCache[key];
  });
}