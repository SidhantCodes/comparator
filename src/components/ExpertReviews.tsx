import { Star, StarHalf } from 'lucide-react';
import { ExpertReviewsProps } from '../api/types';
import { BRAND_CONFIG } from '../utils/constants';




export function ExpertReviews({ data }: ExpertReviewsProps) {
  
  const renderSourceLogo = (name: string) => {
    const config = BRAND_CONFIG[name.toLowerCase()];

    if (config?.logo) {
      return (
        <img 
          src={config.logo} 
          alt={name} 
          className="w-full h-full object-contain p-1" 
        />
      );
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return <span className="font-black text-emerald-700 text-lg">{initials}</span>;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    
    return (
      <div className="flex gap-1 justify-center mb-1.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={16} className="text-yellow-400" fill="currentColor" />
        ))}
        {hasHalfStar && <StarHalf size={16} className="text-yellow-400" fill="currentColor" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-gray-200" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-emerald-100 rounded-lg p-8 sm:p-12 mb-8 border border-emerald-300">
      <div className="flex justify-center mb-10 sm:mb-14">
        <div className="bg-white rounded-2xl p-6 px-10 shadow-sm border-2 border-emerald-300 flex flex-col items-center">
          <span className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-1">Avg Expert Rating</span>
          <div className="flex items-center gap-4">
            <Star className="text-emerald-600 w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
            <span className="text-4xl sm:text-5xl font-black text-emerald-700">
                {data.averageScore > 0 ? data.averageScore.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 
          SCALABLE FLEX GRID:
          - justify-center: ensures 1, 2, or 4+ cards always look balanced.
          - max-w-[1100px]: ensures that once you hit 3 cards (approx 320px + gap), 
            the 4th one wraps.
      */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-10 max-w-[1100px] mx-auto">
        {data.sources.map((source, idx) => (
          <button
            key={idx}
            /* 
               CARD SIZE:
               - Mobile: flex-1 with min-w-[140px] and max-w-[48%] (2 per row)
               - Desktop: sm:w-[320px] (3 per row max)
            */
            className="bg-white rounded-xl mt-6 p-4 sm:p-10 text-center border border-2 border-emerald-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center group flex-1 min-w-[140px] max-w-[48%] sm:max-w-none sm:w-[320px] sm:flex-initial"
          >
            {/* Logo Box */}
            <div className="w-12 h-12 sm:w-24 sm:h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-5 overflow-hidden p-2 group-hover:bg-emerald-50 transition-colors">
              {renderSourceLogo(source.name)}
            </div>
            
            <h4 className="font-bold text-gray-900 text-sm sm:text-xl mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {source.name}
            </h4>
            
            {renderStars(source.score)}
            
            <div className="text-xs sm:text-lg font-bold text-gray-500 mt-2">
              {source.score.toFixed(1)} <span className="text-gray-300">/</span> 5
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}