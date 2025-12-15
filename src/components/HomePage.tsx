import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Smartphone } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Slider from 'react-slick';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(50000);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&price=${priceRange}`);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const trendingProducts = [
    'Apple iPhone 16',
    'Apple iPhone 17',
    'Google Pixel 10',
    'Samsung Galaxy S25 Edge',
    'OnePlus 13'
  ];

  const reviews = [
    { 
      title: 'RedMagic 10S Pro Review: built for hardcore gamers',
      date: 'Jun 20, 2025',
      image: 'https://images.unsplash.com/photo-1695028644151-1ec92bae9fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWRtYWdpYyUyMGdhbWluZyUyMHBob25lfGVufDF8fHx8MTc2NDE0NTE2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      title: 'Sony Xperia 1 VII Review: excellent hardware, mixed results',
      date: 'Jun 2, 2025',
      image: 'https://images.unsplash.com/photo-1657732214333-697a115ba263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIweHBlcmlhJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NjQxNDUxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      title: 'Samsung Galaxy S25 Edge Review: slim profile, slimmer battery',
      date: 'May 23, 2025',
      image: 'https://images.unsplash.com/photo-1721864428861-e4a9e9f9a5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwcGhvbmV8ZW58MXx8fHwxNzY0MTI0NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      title: 'OnePlus 13 Review: flagship performance at a fraction of the price',
      date: 'May 15, 2025',
      image: 'https://images.unsplash.com/photo-1628582091924-296b8ec1fffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmVwbHVzJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NjQxMzkzODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      title: 'Google Pixel 10 Pro Review: best camera phone of 2025',
      date: 'May 8, 2025',
      image: 'https://images.unsplash.com/photo-1598522017610-edbea54edd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBwaXhlbCUyMHBob25lfGVufDF8fHx8MTc2NDA5MjE1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      title: 'Apple iPhone 17 Pro Max Review: the pinnacle of smartphone design',
      date: 'Apr 29, 2025',
      image: 'https://images.unsplash.com/photo-1524466302651-a98b8b02c497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBtb2Rlcm58ZW58MXx8fHwxNzY0MTA5NzY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const newsArticles = [
    {
      title: 'iPhone 18 may shift to early 2027 under Apple\'s new release plan',
      category: 'News',
      date: 'Nov 20, 2025',
      image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG5ld3N8ZW58MXx8fHwxNzY0MTQ0NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: true
    },
    {
      title: 'Moto G 2026 launches with 32MP selfie camera and two-day battery life',
      category: 'News',
      date: 'Nov 6, 2025',
      image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMHNsZWVrJTIwZGVzaWdufGVufDF8fHx8MTc2NDE0NDQyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      title: 'Huawei Mate 70 Air leak reveals sleek design of the upcoming slim smartphone',
      category: 'News',
      date: 'Oct 30, 2025',
      image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwZGlzcGxheXxlbnwxfHx8fDE3NjQxNDQ0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    },
    {
      title: 'Xiaomi to keep making phones with rear displays after i7 Pro Max shatters sales records',
      category: 'News',
      date: 'Oct 17, 2025',
      image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMG5ld3N8ZW58MXx8fHwxNzY0MTQ0NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      featured: false
    }
  ];

  const compareProducts = [
    { name: 'iPhone 17', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'iPhone Air', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'iPhone 17 Pro', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'iPhone 17 Pro Max', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'iPhone 15 Pro Max', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'iPhone 15', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'iPhone 16', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'iPhone 15 Pro', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'Samsung Galaxy S24 Ultra', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'Realme C53', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'Vivo V29', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'Samsung Galaxy S23 Ultra', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'Xiaomi 13', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'Samsung Galaxy S24', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'Vivo V30', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'Xiaomi 14 Ultra', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'Google Pixel 8 Pro', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' },
    { name: 'Oppo A18', image: 'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?w=200' },
    { name: 'Honor 90', image: 'https://images.unsplash.com/photo-1760199789464-eff5ba507e32?w=200' },
    { name: 'Motorola Edge 40', image: 'https://images.unsplash.com/photo-1760443728405-b18c942417ef?w=200' }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 3000,
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 3000,
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 text-white py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center mb-4 text-4xl lg:text-5xl font-semibold tracking-tight">
            Find the Best Deals Across All Retailers
          </h1>
          <p className="text-center text-emerald-100 mb-16 text-lg">
            Compare prices, specifications, and ratings in one place
          </p>

          {/* Search Card */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_auto] gap-0">
              {/* Search Input */}
              <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-gray-200 relative">
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2 font-medium">
                  Product Search
                </label>
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for smartphones..."
                    className="w-full pl-8 text-gray-900 placeholder:text-gray-400 focus:outline-none text-base md:text-lg bg-transparent border-b-2 border-transparent focus:border-emerald-500 transition-all pb-1"
                  />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2">
                  Max Price: <span className="text-emerald-700 font-semibold">{formatPrice(priceRange)}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  style={{
                    background: `linear-gradient(to right, rgb(5 150 105) 0%, rgb(5 150 105) ${((priceRange - 5000) / (150000 - 5000)) * 100}%, rgb(229 231 235) ${((priceRange - 5000) / (150000 - 5000)) * 100}%, rgb(229 231 235) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹5K</span>
                  <span>₹150K</span>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 md:px-8 py-4 md:py-6 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="md:hidden lg:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Trending Tags */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-emerald-200 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </div>
            {trendingProducts.map((product) => (
              <button
                key={product}
                onClick={() => {
                  setSearchQuery(product);
                  navigate(`/search?q=${encodeURIComponent(product)}`);
                }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-all border border-white/20 text-white"
              >
                {product}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <h2 className="text-gray-900 text-3xl mb-8">Reviews</h2>

        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index} className="px-3">
              <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 cursor-pointer">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={review.image}
                    alt={review.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Reviews</span>
                  <h3 className="text-gray-900 mt-2 mb-3 leading-snug">{review.title}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Top Products to Compare Section */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-20">
        <h2 className="text-gray-900 text-3xl mb-2">Top products to compare</h2>
        <h3 className="text-emerald-600 text-xl mb-8">Smartphones</h3>

        {/* Mobile Carousel - Shows 6 items */}
        <div className="block lg:hidden carousel-top-products">
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={4000}
            pauseOnHover={true}
            pauseOnFocus={true}
            arrows={false}
          >
            {Array.from({ length: Math.ceil(compareProducts.length / 6) }, (_, slideIndex) => (
              <div key={slideIndex} className="px-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {compareProducts.slice(slideIndex * 6, slideIndex * 6 + 6).map((product, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(product.name);
                        navigate(`/search?q=${encodeURIComponent(product.name)}`);
                      }}
                      className="bg-white rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 group flex items-center gap-3 w-full"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-900 text-sm text-left truncate flex-1">{product.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {compareProducts.slice(0, 20).map((product, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(product.name);
                navigate(`/search?q=${encodeURIComponent(product.name)}`);
              }}
              className="bg-white rounded-lg p-4 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 group flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-900 text-sm text-left truncate flex-1">{product.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}