import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';
import Slider from 'react-slick';

import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';

export function HomePage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(150000);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* ----------------------------- Fetch Products ----------------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await endpoints.search(1, 20);
        const adaptedProducts = response.data.data.map(adaptApiPhoneToProduct);

        if (mounted) {
          setProducts(adaptedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------ Handlers ------------------------------ */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/search?q=${encodeURIComponent(searchQuery)}&price=${priceRange}`
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  /* ------------------------------ Derived ------------------------------- */
  const trendingProducts =
    products.length > 0
      ? products.slice(0, 5).map(p => p.name)
      : ['iPhone 16', 'Samsung S25', 'Pixel 9'];

  /* ------------------------------ Reviews ------------------------------- */
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
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  /* --------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ============================ HERO ============================ */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 text-white py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center mb-4 text-4xl lg:text-5xl font-semibold tracking-tight">
            Find the Best Deals Across All Retailers
          </h1>
          <p className="text-center text-emerald-100 mb-16 text-lg">
            Compare prices, specifications, and ratings in one place
          </p>

          {/* Search Card */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-2xl max-w-5xl mx-auto overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_auto] gap-0">
              {/* Search Input */}
              <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-gray-200">
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2 font-medium">
                  Product Search
                </label>
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for smartphones..."
                    className="w-full pl-8 py-1 text-gray-900 focus:outline-none text-lg bg-transparent border-b-2 border-transparent focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Price Slider */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2">
                  Max Price:{' '}
                  <span className="text-emerald-700 font-semibold">
                    {formatPrice(priceRange)}
                  </span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={300000}
                  step={5000}
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 rounded-lg cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 md:px-8 py-4 md:py-6 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="md:hidden lg:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Trending */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-emerald-200 text-sm">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>

            {loading ? (
              <span className="text-white/60 text-sm">Loading trends…</span>
            ) : (
              trendingProducts.map(name => (
                <button
                  key={name}
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(name)}`)
                  }
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-all border border-white/20 text-white truncate max-w-[150px]"
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* =========================== REVIEWS =========================== */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <h2 className="text-3xl mb-8">Reviews</h2>

        <Slider {...sliderSettings}>
          {reviews.map((r, i) => (
            <div key={i} className="px-3">
              <div className="bg-white rounded-xl border hover:shadow-xl transition">
                <div className="aspect-video bg-gray-100">
                  <ImageWithFallback
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs uppercase text-gray-500">
                    Reviews
                  </span>
                  <h3 className="mt-2 mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-500">{r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <Footer />
    </div>
  );
}
