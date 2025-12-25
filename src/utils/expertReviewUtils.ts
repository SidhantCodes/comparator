import { ExpertView, ExpertSource } from '../api/types';

/**
 * Normalizes a 0-10 scale score to a 0-5 star scale.
 */
export const normalizeToFiveStars = (score: number | undefined | null): number => {
  if (!score) return 0;
  // API typically returns 0-10, we want 0-5
  return Math.round((score / 2) * 10) / 10; 
};

/**
 * Formats the source data consistently for the UI
 */
export const formatExpertSources = (sources: ExpertSource[] = []) => {
  return sources.map(s => ({
    name: s.site,
    score: normalizeToFiveStars(s.score),
    originalScore: s.score,
    url: s.url
  }));
};

/**
 * Processes the raw ExpertView API response into the UI-ready ExpertData object
 */
export const processExpertView = (expertView?: ExpertView) => {
  if (!expertView || expertView.review_count === 0) return undefined;

  const averageScore = normalizeToFiveStars(expertView.score_avg);

  return {
    averageScore,
    count: expertView.review_count,
    sources: formatExpertSources(expertView.sources)
  };
};