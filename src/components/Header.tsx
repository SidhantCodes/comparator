import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-2 md:p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <Layers className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-gray-900 text-lg md:text-xl font-semibold tracking-tight">PriceCompare</span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block ml-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all shadow-sm hover:border-gray-300"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-8">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Mobile Search Bar - Slides down when icon clicked */}
        {showMobileSearch && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>
    </header>
  );
}