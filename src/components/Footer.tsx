import { Link } from 'react-router-dom';
import { Layers} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const socialLinks = [
  {
    name: "Facebook",
    url: "#",
    icon: FaFacebook,
  },
  {
    name: "X",
    url: "#",
    icon: FaTwitter,
  },
  {
    name: "Instagram",
    url: "#",
    icon: FaInstagram,
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-teal-900 to-green-800 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-6 sm:gap-8">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-xl border border-white/20 group-hover:bg-white/20 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">PriceCompare</span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-emerald-100 text-center max-w-md">
            Find the best deals across all retailers. Compare prices, specifications, and ratings in one place.
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map(({ name, url, icon: Icon }) => (
              <a
                key={name}
                href={url}
                aria-label={name}
                className="w-9 h-9 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-6 mt-2 border-t border-white/20 w-full text-center">
            <p className="text-sm text-emerald-100 mt-2">
              &copy; 2025 PriceCompare. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
