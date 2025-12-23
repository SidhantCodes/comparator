import Slider from 'react-slick';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Slick CSS (already global, but safe if component-level)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    title: 'RedMagic 10S Pro Review: built for hardcore gamers',
    date: 'Jun 20, 2025',
    image:
      'https://images.unsplash.com/photo-1695028644151-1ec92bae9fb0?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Sony Xperia 1 VII Review: excellent hardware, mixed results',
    date: 'Jun 2, 2025',
    image:
      'https://images.unsplash.com/photo-1657732214333-697a115ba263?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Samsung Galaxy S25 Edge Review: slim profile, slimmer battery',
    date: 'May 23, 2025',
    image:
      'https://images.unsplash.com/photo-1721864428861-e4a9e9f9a5ee?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'OnePlus 13 Review: flagship performance at a fraction of the price',
    date: 'May 15, 2025',
    image:
      'https://images.unsplash.com/photo-1628582091924-296b8ec1fffe?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Google Pixel 10 Pro Review: best camera phone of 2025',
    date: 'May 8, 2025',
    image:
      'https://images.unsplash.com/photo-1598522017610-edbea54edd64?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Apple iPhone 17 Pro Max Review: the pinnacle of smartphone design',
    date: 'Apr 29, 2025',
    image:
      'https://images.unsplash.com/photo-1524466302651-a98b8b02c497?auto=format&fit=crop&w=1080&q=80',
  },
];

export function ReviewsCarousel() {
  const sliderSettings = {
    dots: true,                 // ✅ dots on desktop
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,            // desktop
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
          slidesToShow: 1,      // ✅ one card on mobile
          dots: true,           // ✅ dots on mobile
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 carousel-dots mb-10">
      <h2 className="text-gray-900 text-3xl mb-8">Reviews</h2>
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
