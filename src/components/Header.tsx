import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  if (!user) {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Search state
  const [searchPool, setSearchPool] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const loadSearchPool = async () => {
      try {
        const data = await endpoints.search();
        setSearchPool(data.data.map(adaptApiPhoneToProduct));
      } catch (error) {
        console.error('Failed to load search pool', error);
      }
    };
    loadSearchPool();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = searchPool.filter(product =>
      product.name.toLowerCase().includes(q)
    );

    setSearchResults(filtered.slice(0, 8));
  }, [searchQuery, searchPool]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (queryText: string) => {
    if (!queryText.trim()) return;
    navigate(`/search?q=${encodeURIComponent(queryText)}`);
    setSearchResults([]);
    setShowMobileSearch(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <Layers className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-gray-900 text-base md:text-lg font-semibold">
              PriceCompare
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:block relative flex-1 max-w-xl"
            ref={dropdownRef}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search phones..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {searchResults.length > 0 && (
              <SearchDropdown
                results={searchResults}
                onSelect={performSearch}
              />
            )}
          </form>

          {/* Right Section: Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full
                                  flex items-center justify-center border border-emerald-200
                                  hover:bg-emerald-200 transition-colors cursor-pointer">
                    <User className="w-5 h-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">My Account</span>
                      <span className="text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
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
    <div className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto z-50">
      {results.length > 0 ? (
        results.map(product => (
          <button
            key={product.id}
            onMouseDown={e => {
              e.preventDefault();
              onSelect(product.name);
            }}
            className="w-full text-left px-4 py-3 flex items-center gap-4 border-b border-gray-50 last:border-0
                       hover:bg-emerald-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
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
