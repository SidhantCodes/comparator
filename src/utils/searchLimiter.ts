// src/utils/searchLimiter.ts

const SEARCH_LIMIT = 4;
const STORAGE_KEY = 'search_performed_count';

export const getSearchCount = (): number => {
  const count = localStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementSearchCount = () => {
  const currentCount = getSearchCount();
  localStorage.setItem(STORAGE_KEY, (currentCount + 1).toString());
};

export const isSearchLimitReached = (): boolean => {
  return getSearchCount() >= SEARCH_LIMIT;
};

export const clearSearchCount = () => {
  localStorage.removeItem(STORAGE_KEY);
};