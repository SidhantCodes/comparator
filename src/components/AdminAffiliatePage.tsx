import React, { useState, useEffect, useRef } from 'react';
import { Search, Link as LinkIcon, Save, Loader2, Package, ExternalLink, X } from 'lucide-react';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function AdminAffiliatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPool, setSearchPool] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<'amazon' | 'flipkart' | null>(null);

  const [urls, setUrls] = useState({ amazon: '', flipkart: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load products for search
  useEffect(() => {
    const loadPool = async () => {
      try {
        const res = await endpoints.searchAll(1, 300);
        setSearchPool(res.data.data.map(adaptApiPhoneToProduct));
      } catch (err) {
        toast.error('Failed to load product directory');
      }
    };
    loadPool();
  }, []);

  // Fuzzy search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(searchPool.filter(p => p.name.toLowerCase().includes(q)));
  }, [searchQuery, searchPool]);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    // Prefill URLs from existing data
    const amz = product.priceComparison.find(p => p.retailer.toLowerCase() === 'amazon')?.url || '';
    const flk = product.priceComparison.find(p => p.retailer.toLowerCase() === 'flipkart')?.url || '';
    setUrls({ amazon: amz, flipkart: flk });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleUpdate = async (retailer: 'amazon' | 'flipkart') => {
    if (!selectedProduct) return;
    const url = urls[retailer];

    if (!url.startsWith('http')) {
      toast.error('Please enter a valid URL');
      return;
    }

    setUpdating(retailer);
    try {
      await endpoints.updateAffiliate(selectedProduct.id, retailer, url);
      toast.success(`${retailer.charAt(0).toUpperCase() + retailer.slice(1)} link updated!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update link');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 mt-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Link Manager</h1>
          <p className="text-gray-500">Search for a product to update its retailer links</p>
        </div>

        {/* Search Section */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-12 h-14 text-lg bg-white shadow-sm border-gray-200 focus-visible:ring-emerald-500 rounded-lg mt-6"
              placeholder="Search product by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              {searchResults.slice(0, 8).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="w-full text-left px-6 py-4 hover:bg-emerald-50 flex items-center gap-4 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded p-1">
                    <ImageWithFallback src={p.image} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{p.id}</div>
                  </div>
                  <div className="text-emerald-600 font-bold">₹{p.price.toLocaleString()}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Edit Section */}
        {selectedProduct && (
          <Card className="border-emerald-100 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 mt-10">
            <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg w-16 h-20 flex items-center justify-center flex-shrink-0">
                  <ImageWithFallback src={selectedProduct.image} className="w-full h-full object-contain" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedProduct.name}</CardTitle>
                  <CardDescription className="text-emerald-100">ID: {selectedProduct.id}</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-emerald-700 h-10 w-10 p-0 rounded-full"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <CardContent className="p-8 space-y-8">

              {/* Flipkart Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <img src="https://www.google.com/s2/favicons?domain=flipkart.com&sz=32" className="w-5 h-5" alt="" />
                    Flipkart URL
                  </Label>
                  {urls.flipkart && (
                    <a href={urls.flipkart} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      Test Link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      value={urls.flipkart}
                      onChange={(e) => setUrls({...urls, flipkart: e.target.value})}
                      placeholder="https://flipkart.com/p/..." 
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg" 
                    onClick={() => handleUpdate('flipkart')}
                    disabled={updating !== null}
                  >
                    {updating === 'flipkart' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedProduct && (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-20 text-center space-y-4 mt-10 px-3 pb-3 p-2">
            <Package className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 px-3">No product selected. Use the search bar above to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}