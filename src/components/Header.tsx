import { Link, useNavigate } from 'react-router-dom';
import { Layers, LogOut, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

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

  const handleSelectProduct = (name: string) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
    setSearchQuery('');
    setSearchResults([]);
  };


  /**
   * Load search pool for BOTH guests and authenticated users
   */
  useEffect(() => {
    const loadSearchPool = async () => {
      try {
        // Default global search to 'phone'
        const res = await endpoints.searchAll(1, 200);
        setSearchPool(res.data.data.map(adaptApiPhoneToProduct));
      } catch (error) {
        console.error('Failed to load search pool', error);
      }
    };
    loadSearchPool();
  }, []);

  /**
   * Example search filtering logic
   * (adjust if you already have custom logic elsewhere)
   */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    setSearchResults(
      searchPool.filter(p =>
        p.name.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, searchPool]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <span className="hidden md:block text-gray-900 text-xl font-bold tracking-tight">
              PriceCompare
            </span>
          </Link>

          {/* Search Bar (available to everyone) */}
          <div
            className="flex-1 max-w-xl relative"
            ref={dropdownRef}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search phones..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {searchResults.slice(0, 8).map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.name)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0">
                      <ImageWithFallback
                        src={product.image}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-emerald-600 font-bold">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full bg-white px-2 py-1 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <span className="hidden sm:block max-w-[140px] truncate text-sm font-medium text-emerald-700">
                      {user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-2xl bg-white p-2 shadow-xl border"
                >
                  <DropdownMenuLabel className="px-4 py-3 font-normal">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <User className="h-4 w-4" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-muted-foreground">
                          Signed in as
                        </span>
                        <span className="text-sm font-medium truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700 transition-colors"
              >
                Sign in
              </Button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}