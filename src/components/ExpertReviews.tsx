import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface ExpertReviewsProps {
  data: {
    averageScore: number;
    sources: Array<{
      name: string;
      score: number;
      url: string;
    }>;
  };
}

export function ExpertReviews({ data }: ExpertReviewsProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex gap-0.5 justify-center mb-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={12}
            className="text-yellow-400"
            fill="currentColor"
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <StarHalf
            size={12}
            className="text-yellow-400"
            fill="currentColor"
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={12}
            className="text-gray-200"
          />
        ))}
      </div>
    )
  }

  const ReviewCard = ({ source }: { source: typeof data.sources[0] }) => (
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white rounded-xl p-4 sm:p-6 text-center border border-emerald-50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center group h-full"
    >
      <div className="w-10 h-8 sm:w-12 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3 text-emerald-700 font-bold text-xs sm:text-sm">
        {getInitials(source.name)}
      </div>
      <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
        {source.name}
      </h4>
      {renderStars(source.score)}
      <div className="text-[10px] sm:text-xs font-bold text-gray-500">{source.score}/5</div>
    </a>
  );

  return (
    <div className="bg-emerald-100 rounded-xl p-6 sm:p-10 mb-8 border border-emerald-300">
      {/* Header Score Box */}
      <div className="flex justify-center mb-6 sm:mb-10">
        <div className="bg-white rounded-2xl p-5 px-8 shadow-sm border border-emerald-300 border-2 flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Expert Score</span>
          <div className="flex items-center gap-3">
            <Star
              className="text-emerald-600 w-6 h-6 sm:w-8 sm:h-8"
              fill="currentColor"
            />
            <span className="text-3xl sm:text-4xl font-black text-emerald-700">{data.averageScore.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Responsive Grid: 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {data.sources.map((source, idx) => (
          <ReviewCard key={idx} source={source} />
        ))}
      </div>
    </div>
  );
}