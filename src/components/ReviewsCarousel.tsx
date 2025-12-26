import Slider from 'react-slick';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Slick CSS (already global, but safe if component-level)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { reviews } from '../utils/constants';

export function ReviewsCarousel() {
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: true,           
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 carousel-dots pb-10">
      <h2 className="text-gray-900 text-3xl font-semibold mb-8 mt-10">Reviews</h2>
      <Slider {...sliderSettings}>
        {reviews.map((review, index) => (
          <div key={index} className="px-3">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={review.image}
                  alt={review.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Reviews
                </span>
                <h3 className="text-gray-900 mt-2 mb-3 leading-snug">
                  {review.title}
                </h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
