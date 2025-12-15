import { Link } from 'react-router-dom';
import { Layers, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const popularComparisons = [
    'Apple iPhone 17 vs Apple iPhone 17 Pro Max',
    'Apple iPhone 17 Pro Max vs Samsung Galaxy S25 Ultra',
    'Apple iPhone 17 vs Apple iPhone Air',
    'Samsung Galaxy S25 Ultra vs Samsung Galaxy S25 Plus',
    'Apple iPhone 17 vs Samsung Galaxy S25 Ultra',
    'Google Pixel 10 vs Samsung Galaxy S25 Ultra',
    'Apple iPhone 17 Air vs Samsung Galaxy S25 Plus',
    'Apple iPhone 17 Pro Max vs Google Pixel 10 Pro'
  ];

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-xl border border-white/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-white font-semibold text-lg">PriceCompare</span>
            </Link>
            <p className="text-sm text-emerald-100 mb-4">
              Find the best deals across all retailers. Compare prices, specifications, and ratings in one place.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Popular Comparisons */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4">Popular Comparisons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {popularComparisons.map((comparison, index) => (
                <Link
                  key={index}
                  to={`/compare?products=${encodeURIComponent(comparison)}`}
                  className="text-sm text-emerald-100 hover:text-white transition-colors"
                >
                  {comparison}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 text-sm text-center text-emerald-100">
          <p>&copy; 2025 PriceCompare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}