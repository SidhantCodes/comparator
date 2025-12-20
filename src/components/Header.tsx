import { Link, useNavigate } from 'react-router-dom';
import { Search, Layers, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPool, setSearchPool] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSearchPool = async () => {
      try {
        const res = await endpoints.search(1, 200);
        setSearchPool(res.data.data.map(adaptApiPhoneToProduct));
      } catch (error) {
        console.error('Failed to load search pool', error);
      }
    };
    if (user) loadSearchPool();
  }, [user]);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
    }
  };

  const handleSelectProduct = (name: string) => {
    setSearchQuery(name);
    navigate(`/search?q=${encodeURIComponent(name)}`);
    setSearchResults([]);
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-gray-900 text-xl font-bold tracking-tight">PriceCompare</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              {/* Icon positioned at the start */}
              {/* <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" /> */}
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for phones..."
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm placeholder:text-gray-400"
              />
            </form>

            {/* Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.name)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0">
                      <ImageWithFallback src={product.image} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-emerald-600 font-bold">₹{product.price.toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-9 w-9 border cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}