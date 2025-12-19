import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Header() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Search state
  const [searchPool, setSearchPool] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Lazy-load search pool
  const handleFocus = async () => {
    setShowDropdown(true);

    if (searchPool.length === 0) {
      try {
        const response = await endpoints.search(1, 100);
        const adapted = response.data.data.map(adaptApiPhoneToProduct);
        setSearchPool(adapted);
      } catch (err) {
        console.error('Failed to load header search pool', err);
      }
    }
  };

  // Filter results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = searchPool
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6);

    setSearchResults(filtered);
  }, [searchQuery, searchPool]);

  // Click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        (searchRef.current && !searchRef.current.contains(target)) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(target))
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * UNIFORM BEHAVIOR: 
   * Always navigate to the Search Results Page with the product name
   */
  const performSearch = (queryText: string) => {
    if (!queryText.trim()) return;
    
    // Navigate to Search Results Page (which contains comparisons)
    navigate(`/search?q=${encodeURIComponent(queryText)}`);
    
    setSearchQuery(queryText);
    setShowDropdown(false);
    setShowMobileSearch(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we have results visible, pick the first one to ensure 
    // "Enter" takes the user to the most relevant product
    if (searchResults.length > 0) {
      performSearch(searchResults[0].name);
    } else {
      performSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0 group">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-2 md:p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <Layers className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-gray-900 text-lg md:text-xl font-semibold tracking-tight">
              PriceCompare
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block ml-auto relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  value={searchQuery}
                  onFocus={handleFocus}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 shadow-sm transition-all
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </form>

            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[100]">
                <SearchDropdown
                  results={searchResults}
                  onSelect={(name) => performSearch(name)}
                />
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => {
              setShowMobileSearch(prev => !prev);
              setShowDropdown(false);
            }}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="mt-4 relative md:hidden" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  autoFocus
                  value={searchQuery}
                  onFocus={handleFocus}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </form>

            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[100]">
                <SearchDropdown
                  results={searchResults}
                  onSelect={(name) => performSearch(name)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function SearchDropdown({
  results,
  onSelect,
}: {
  results: Product[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto">
      {results.length > 0 ? (
        results.map(product => (
          <button
            key={product.id}
            onMouseDown={e => {
              e.preventDefault();
              // Pass the product name instead of ID to trigger the search results page
              onSelect(product.name);
            }}
            className="w-full text-left px-4 py-3 flex items-center gap-4 border-b border-gray-50 last:border-0
                       hover:bg-emerald-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
              <ImageWithFallback
                src={product.image}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {product.name}
              </div>
              <div className="text-xs text-emerald-600 font-bold mt-0.5">
                ₹{product.price.toLocaleString()}
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className="p-6 text-center text-sm text-gray-500">
          No matches found for this search.
        </div>
      )}
    </div>
  );
}