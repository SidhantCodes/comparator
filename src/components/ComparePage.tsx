import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, Search, X } from 'lucide-react';

// import { Header } from './Header';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { endpoints } from '../api/client';
import { adaptComparePhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';
import { ApiPhone } from '../api/types'; // Assuming this exists from previous step

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get IDs from URL
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  // Main comparison data state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search/Add Product state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPool, setSearchPool] = useState<ApiPhone[]>([]); // The list we filter against
  const [searchResults, setSearchResults] = useState<ApiPhone[]>([]);
  const [isPoolLoading, setIsPoolLoading] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  /* ------------------- 1. Fetch Comparison Data ------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchComparison = async () => {
      if (ids.length === 0) {
        setLoading(false);
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch comparison data for the specific IDs in URL
        const response = await endpoints.compare(ids);
        const adapted = response.data?.phones?.map(adaptComparePhoneToProduct) || [];

        if (mounted) {
          setProducts(adapted);
        }
      } catch (err) {
        console.error('Failed to load comparison data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchComparison();

    return () => {
      mounted = false;
    };
  }, [ids.join(',')]); // Re-run when IDs in URL change

  /* ------------------- 2. Fetch Search Pool (Client Side Fuzzy) ------------------- */
  // We fetch a batch of phones once to perform client-side filtering
  useEffect(() => {
  const loadSearchPool = async () => {
    setIsPoolLoading(true);
    try {
      // If we already have products, fetch from that specific category
      const activeCategory = products.length > 0 ? products[0].category : 'phone';
      const response = await endpoints.search(activeCategory, 1, 100); 
      setSearchPool(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load search directory", err);
    } finally {
      setIsPoolLoading(false);
    }
  };

  if (isSearchOpen && searchPool.length === 0) {
    loadSearchPool();
  }
}, [isSearchOpen, products]);

  /* ------------------- 3. Search Logic ------------------- */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    
    // Client-side Fuzzy Search Logic
    const filtered = searchPool.filter(phone => {
      // Don't show products already in comparison
      if (ids.includes(phone._id)) return false;

      const fullName = `${phone.brand} ${phone.model_name}`.toLowerCase();
      return fullName.includes(lowerTerm);
    });

    setSearchResults(filtered.slice(0, 6)); // Limit results
  }, [searchTerm, searchPool, ids]);

  /* ------------------- 4. Handlers ------------------- */
  
  const handleAddProduct = (newId: string) => {
    const newIds = [...ids, newId];
    setSearchParams({ ids: newIds.join(',') });
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const handleRemoveProduct = (idToRemove: string) => {
    const newIds = ids.filter(id => id !== idToRemove);
    setSearchParams({ ids: newIds.join(',') });
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  /* ------------------- Comparison Data Definition ------------------- */
  const comparisonCategories = [
    {
      title: 'Overview',
      rows: [
        { label: 'Estimated Price', getValue: (p: Product) => `₹${p.price.toLocaleString()}` },
        { label: 'Tech Score', getValue: (p: Product) => p.beebomScore },
        { label: 'User Rating', getValue: (p: Product) => p.rating && p.rating > 0 ? `${p.rating}/5` : 'N/A' },
        { label: 'Launch Date', getValue: (p: Product) => p.launchDate },
      ],
    },
    {
      title: 'Performance',
      rows: [
        { label: 'Processor', getValue: (p: Product) => p.detailedSpecs.processor.chipset },
        { label: 'RAM', getValue: (p: Product) => p.detailedSpecs.ramStorage.ram },
        { label: 'Storage', getValue: (p: Product) => p.detailedSpecs.ramStorage.storage },
      ],
    },
    {
      title: 'Display & Camera',
      rows: [
        { label: 'Display Size', getValue: (p: Product) => p.detailedSpecs.display.size },
        { label: 'Resolution', getValue: (p: Product) => p.detailedSpecs.display.resolution },
        { label: 'Rear Camera', getValue: (p: Product) => p.detailedSpecs.camera.rear.main },
        { label: 'Battery', getValue: (p: Product) => p.detailedSpecs.battery.capacity },
      ],
    },
  ];

  /* ------------------- Render ------------------- */

  // Grid columns: Labels + Products + (Optional Add Button)
  // Max 4 products allowed
  const showAddColumn = products.length < 4;
  const gridColumns = `200px repeat(${products.length}, minmax(220px, 1fr)) ${showAddColumn ? 'minmax(220px, 1fr)' : ''}`;

  if (loading && products.length === 0) {
     return <div className="min-h-screen flex items-center justify-center">Loading comparison...</div>;
  }

  // If URL has no IDs (navigated directly), prompt to search
  if (!loading && products.length === 0) {
     navigate('/search');
     return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Search
        </button>

        <h1 className="text-3xl font-bold mb-8">Compare Products</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-visible"> {/* Allow overflow for search dropdown */}
          
          {/* ---------------- TABLE HEADER (Images & Names) ---------------- */}
          <div className="grid bg-gray-50 border-b sticky top-0 z-10" style={{ gridTemplateColumns: gridColumns }}>
            {/* 1. Empty Corner */}
            <div className="p-4 border-r border-gray-200 bg-gray-50"></div>

            {/* 2. Product Columns */}
            {products.map(p => (
              <div key={p.id} className="p-4 text-center border-r border-gray-200 relative group bg-white">
                <button 
                  onClick={() => handleRemoveProduct(p.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-24 h-32 mx-auto mb-3 bg-white flex items-center justify-center">
                  <ImageWithFallback
                    src={p.image || ''}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[40px] flex items-center justify-center">
                  {p.name}
                </h3>
                <div className="text-emerald-600 font-bold">
                  ₹{p.price.toLocaleString()}
                </div>
              </div>
            ))}

            {/* 3. Add Product Column (Dynamic) */}
            {showAddColumn && (
              <div className="p-4 flex flex-col items-center justify-center bg-gray-50/50 min-h-[200px]" ref={searchContainerRef}>
                {!isSearchOpen ? (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-300 w-full h-full justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Add Product</span>
                  </button>
                ) : (
                  <div className="w-full relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search phone..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button 
                        onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Fuzzy Search Dropdown */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-64 overflow-y-auto">
                      {isPoolLoading && searchPool.length === 0 ? (
                        <div className="p-3 text-xs text-center text-gray-500">Loading list...</div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map(result => (
                          <button
                            key={result._id} // ID used internally
                            onClick={() => handleAddProduct(result._id)} // ID sent to handler
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                               {/* Image displayed, no ID shown */}
                              <img src={result.image} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div>
                              {/* Name displayed, no ID shown */}
                              <div className="text-sm font-medium text-gray-900">{result.brand} {result.model_name}</div>
                            </div>
                          </button>
                        ))
                      ) : searchTerm ? (
                        <div className="p-3 text-xs text-center text-gray-500">No matches found</div>
                      ) : (
                        <div className="p-3 text-xs text-center text-gray-400">Type to search...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------- COMPARISON ROWS ---------------- */}
          {comparisonCategories.map((cat, i) => (
            <div key={i}>
              <div className="bg-emerald-50 px-4 py-2 font-semibold text-sm border-b border-emerald-100">
                {cat.title}
              </div>

              {cat.rows.map((row, r) => (
                <div
                  key={r}
                  className="grid border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  style={{ gridTemplateColumns: gridColumns }}
                >
                  {/* Label Column */}
                  <div className="p-4 text-sm font-medium text-gray-600 bg-gray-50/50 border-r border-gray-100 flex items-center">
                    {row.label}
                  </div>

                  {/* Product Values */}
                  {products.map(p => (
                    <div key={p.id} className="p-4 text-center border-r border-gray-100 text-sm flex items-center justify-center">
                      {row.getValue(p) || <span className="text-gray-300">-</span>}
                    </div>
                  ))}

                  {/* Empty Cell for Add Column (to keep grid structure) */}
                  {showAddColumn && <div className="bg-gray-50/30"></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}