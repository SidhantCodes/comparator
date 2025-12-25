import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, X } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ImageWithFallback } from './figma/ImageWithFallback';

import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { TopProducts } from './TopProducts';
import { ReviewsCarousel } from './ReviewsCarousel';

import { incrementSearchCount, isSearchLimitReached } from '../utils/searchLimiter';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

import { MobilePriceInput } from "./MobilePriceInput"



export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(150000);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [randomProducts, setRandomProducts] = useState<Product[]>([]);


  /* ----------------------- Search Suggestion State ----------------------- */
  const [searchPool, setSearchPool] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  /* ----------------------------- Fetch Products ----------------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await endpoints.searchAll(1, 200);
        const adapted = response.data.data.map(adaptApiPhoneToProduct);

        if (mounted) {
          setProducts(adapted.slice(0, 200));
          setSearchPool(adapted);
          const shuffled = [...adapted].sort(() => 0.5 - Math.random());
          setRandomProducts(shuffled.slice(0, 200));
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

  /* ------------------------ Search Filtering Logic ------------------------ */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = searchPool
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8);

    setSearchResults(filtered);
  }, [searchQuery, searchPool]);

  /* -------------------------- Click Outside Logic -------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ------------------------------ UNIFORM Handlers ------------------------------ */

  /**
   * Centralized search function to ensure all paths go to /search
   */
  const performSearch = (queryText: string) => {
    if (!queryText.trim()) return;

    // ---------- SEARCH LIMIT LOGIC ----------
    if (!user && isSearchLimitReached()) {
      toast.info('Please sign in to continue searching.');
      navigate('/auth');
      return;
    }

    if (!user) {
      incrementSearchCount();
    }
    // ----------------------------------------

    navigate(
      `/search?q=${encodeURIComponent(queryText)}&price=${priceRange}`
    );

    setSearchQuery(queryText);
    setShowDropdown(false);
  };


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchResults.length > 0) {
      performSearch(searchResults[0].name);
    } else {
      performSearch(searchQuery);
    }
  };

  const handleSelectProduct = (name: string) => {
    performSearch(name);
  };

  /* ------------------------------ Helpers ------------------------------ */
  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const trendingProducts =
    products.length > 0
      ? products.slice(0, 5).map(p => p.name)
      : ['iPhone 16', 'Samsung S25', 'Pixel 9'];


  const chunkedProducts: Product[][] = [];
  for (let i = 0; i < randomProducts.length; i += 6) {
    chunkedProducts.push(randomProducts.slice(i, i + 6));
  }

  /* --------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 text-white py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center mb-4 text-4xl lg:text-5xl font-semibold tracking-tight">
            Find the Best Deals Across All Retailers
          </h1>
          <p className="text-center text-emerald-100 mb-16 text-lg">
            Compare prices, specifications, and ratings in one place
          </p>

          {/* ======================= Search Card ======================= */}
          <div
            className="max-w-5xl mx-auto relative"
            ref={searchContainerRef}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-xl shadow-2xl overflow-hidden"
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
                      onFocus={() => setShowDropdown(true)}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search for smartphones..."
                      className="w-full pl-8 py-1 text-gray-900 focus:outline-none text-lg bg-transparent"
                    />
                  </div>
                </div>

                {/* Price Slider */}
                {/* <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
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
                    onChange={e =>
                      setPriceRange(Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg cursor-pointer accent-emerald-600"
                  />
                </div> */}
                {/* ================= Price Control ================= */}

                {/* Desktop Slider */}
                <div className="hidden md:block p-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <label className="block text-gray-500 text-xs uppercase tracking-wide mb-2">
                    Max Price:{" "}
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

                {/* Mobile Numeric Control */}
                <div className="block md:hidden">
                  <MobilePriceInput
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>

                

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 md:px-8 py-4 md:py-6 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="md:hidden lg:inline">Search</span>
                </button>
              </div>
            </form>

            {/* ===================== Suggestions Dropdown ===================== */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 w-full md:w-[60%] mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  searchResults.map(p => (
                    <button
                      key={p.id}
                      onMouseDown={e => {
                        e.preventDefault();
                        handleSelectProduct(p.name);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-emerald-50 flex items-center gap-4 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <div className="w-12 h-12 flex-shrink-0">
                        <ImageWithFallback
                          src={p.image}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold">
                          {p.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {p.specs.processor} • {p.specs.ram} RAM
                        </div>
                      </div>
                      <div className="ml-auto text-emerald-600 font-bold">
                        ₹{p.price.toLocaleString()}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================== Trending ========================== */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-emerald-200 text-sm">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>

            {loading ? (
              <span className="text-white/60 text-sm">
                Loading trends…
              </span>
            ) : (
              trendingProducts.map(name => (
                <button
                  key={name}
                  onClick={() => performSearch(name)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-all border border-white/20 text-white truncate max-w-[150px] cursor-pointer"
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ======================= Top Products to Compare ======================= */}
      <TopProducts />
      
      {/* ======================= REVIEWS SECTION ======================= */}
      <ReviewsCarousel />
    </div>
  );
}