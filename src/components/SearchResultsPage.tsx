import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  X, 
  Star, 
  Cpu, 
  Monitor, 
  Camera, 
  Battery, 
  HardDrive, 
  ExternalLink, 
  ChevronRight, 
  Search,
} from 'lucide-react';

import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const priceMax = Number(searchParams.get('price')) || 0;

  /* ----------------------------- State ----------------------------- */
  const [directory, setDirectory] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- Fetch ----------------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await endpoints.search(1, 100);
        const adapted = response.data.data.map(adaptApiPhoneToProduct);
        if (!mounted) return;

        setDirectory(adapted);

        // 1. Filter products based on the User's Search Query (e.g., "iPhone 17")
        const filtered: Product[] = adapted.filter((p: Product): boolean => {
          const matchesQuery: boolean = query
            ? p.name.toLowerCase().includes(query.toLowerCase())
            : true;
          const matchesPrice: boolean = priceMax > 0 ? p.price <= priceMax : true;
          return matchesQuery && matchesPrice;
        });

        setDisplayedProducts(filtered);

        // ---------------------------------------------------------------
        // CHANGED LOGIC START: Comparison based on Price Range
        // ---------------------------------------------------------------
        
        if (filtered.length > 0) {
          // The "Main" product is the best match for the search term
          const mainProduct = filtered[0];
          
          const currentPrice = mainProduct.price;
          const minRange = currentPrice - 20000;
          const maxRange = currentPrice + 5000;

          // Find competitors from the FULL directory (adapted), not just the search results
          // We filter by price, exclude the main product itself, and take the top 3
          const priceCompetitors: Product[] = adapted.filter((p: Product): boolean => 
            p.id !== mainProduct.id && 
            p.price >= minRange && 
            p.price <= maxRange
          ).slice(0, 3);

          // Combine Main Product + Price Competitors
          setComparisonProducts([mainProduct, ...priceCompetitors]);
        } else {
          // Fallback if no search results found
          setComparisonProducts([]);
        }

        // ---------------------------------------------------------------
        // CHANGED LOGIC END
        // ---------------------------------------------------------------

      } catch (error) {
        console.error('Error fetching search results', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [query, priceMax]);

  /* ---------------------- Click Outside Dropdown ---------------------- */
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ----------------------------- Derived ----------------------------- */
  const mainProduct = displayedProducts[0];

  const filteredSuggestions = directory
    .filter(p => !comparisonProducts.some(cp => cp.id === p.id))
    .filter(p =>
      p.name.toLowerCase().includes(searchInput.toLowerCase())
    );

  /* ----------------------------- Handlers ----------------------------- */
  const handleAddProduct = (product: Product) => {
    if (comparisonProducts.length < 5) {
      setComparisonProducts(prev => [...prev, product]);
      setSearchInput('');
      setShowDropdown(false);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== id));
  };

  /* -------------------------- Comparison Rows ------------------------- */
  const comparisonCategories = [
    {
      title: 'Pricing',
      rows: [
        {
          label: 'Estimated Price',
          getValue: (p: Product) => `₹${p.price.toLocaleString()}`
        },
        {
          label: 'Retailer',
          getValue: (p: Product) => p.retailer.name
        }
      ]
    },

    {
      title: 'Performance',
      rows: [
        {
          label: 'Chipset',
          getValue: (p: Product) => p.detailedSpecs.processor.chipset
        },
        {
          label: 'CPU',
          getValue: (p: Product) => p.detailedSpecs.processor.cpu
        },
        {
          label: 'AnTuTu Score',
          getValue: (p: Product) => p.specs.antutu
        },
        {
          label: 'RAM',
          getValue: (p: Product) => p.specs.ram
        },
        {
          label: 'Storage',
          getValue: (p: Product) => p.specs.storage
        }
      ]
    },

    {
      title: 'Display',
      rows: [
        {
          label: 'Screen Size',
          getValue: (p: Product) => p.detailedSpecs.display.size
        },
        {
          label: 'Resolution',
          getValue: (p: Product) => p.detailedSpecs.display.resolution
        },
        {
          label: 'Refresh Rate',
          getValue: (p: Product) =>
            p.specs.display.includes('Hz')
              ? p.specs.display.split(' ').pop()
              : '-'
        },
        {
          label: 'HDR Support',
          getValue: (p: Product) => p.detailedSpecs.display.hdr
        }
      ]
    },

    {
      title: 'Camera',
      rows: [
        {
          label: 'Rear Camera',
          getValue: (p: Product) =>
            p.detailedSpecs.camera.rear.main.split('\n')[0]
        },
        {
          label: 'Ultrawide Camera',
          getValue: (p: Product) =>
            p.detailedSpecs.camera.rear.ultraWide
        },
        {
          label: 'Video Recording',
          getValue: (p: Product) =>
            p.detailedSpecs.camera.rear.video
        },
        {
          label: 'Front Camera',
          getValue: (p: Product) =>
            p.detailedSpecs.camera.front.sensor
        }
      ]
    },

    {
      title: 'Battery & Charging',
      rows: [
        {
          label: 'Battery Capacity',
          getValue: (p: Product) => p.specs.battery
        },
        {
          label: 'Charging',
          getValue: (p: Product) =>
            p.detailedSpecs.battery.charging
        },
        {
          label: 'Charger in Box',
          getValue: (p: Product) =>
            p.detailedSpecs.battery.chargerInBox
        }
      ]
    },

    {
      title: 'Design & Software',
      rows: [
        {
          label: 'Build Material',
          getValue: (p: Product) =>
            p.detailedSpecs.design.backMaterial || '-'
        },
        {
          label: 'Water / Dust Resistance',
          getValue: (p: Product) =>
            p.detailedSpecs.design.ipRating
        },
        {
          label: 'Operating System',
          getValue: (p: Product) =>
            p.detailedSpecs.os.version
        }
      ]
    }
  ];


  /* ----------------------------- States ----------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!mainProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl font-bold mb-2">
            No products found
            {query && ` for "${query}"`}
          </h2>
          {priceMax > 0 && (
            <p className="text-gray-500 mb-4">
              Under ₹{priceMax.toLocaleString()}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 underline"
          >
            Go Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">
            Home / Search /{' '}
            <span className="text-gray-900">
              {query || 'All Products'}
            </span>
          </div>
          <h1 className="text-3xl font-bold">
            {query ? `"${query}"` : 'All Products'}
          </h1>
          {/* <p className="text-gray-600">
            {displayedProducts.length} results
            {priceMax > 0 && ` (Max ₹${priceMax.toLocaleString()})`}
          </p> */}
        </div>

        {/* Featured Product - Updated UI */}
        <div className="rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-emerald-700 relative" style={{ backgroundColor: '#009966' }}>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            {/* Product Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-32 h-40 sm:w-40 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                 <ImageWithFallback
                    src={mainProduct.image || ''}
                    alt={mainProduct.name}
                    className="w-20 h-28 sm:w-24 sm:h-36 object-contain mix-blend-multiply"
                  />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 w-full">
              <h2 className="text-white mb-2 text-xl sm:text-2xl text-center sm:text-left">{mainProduct.name}</h2>
              <div className="text-xs sm:text-sm text-white/80 mb-4 text-center sm:text-left">{mainProduct.daysAgo}</div>

              {/* Score and Rating */}
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-white text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white">
                    <span className="text-lg sm:text-xl font-semibold">{mainProduct.beebomScore}</span>
                    <span className="text-xs ml-1">Score</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-medium text-base sm:text-lg">{mainProduct.rating}</span>
                  <span className="text-white/80 text-sm sm:text-base">({mainProduct.reviews} Ratings)</span>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Display</div>
                    <div className="text-xs sm:text-sm text-white font-medium">
                      {`${mainProduct.detailedSpecs.display.size.split(' ')[0]}"`}
                    </div>
                    <div className="text-xs text-white/60">
                      {`${mainProduct.detailedSpecs.display.resolution.split('pixels')[0]} p`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Main Camera</div>
                    <div className="text-xs sm:text-sm text-white font-medium">
                      {(m => (m ? `${m} MP` : 'N/A'))(mainProduct.detailedSpecs.camera.rear.main?.match(/(\d+)\s*MP/i)?.[1])}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Battery className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Battery</div>
                    <div className="text-xs sm:text-sm text-white font-medium">
                      {`${mainProduct.detailedSpecs.battery.capacity.match(/(\d+)\s*mAh/)?.[1] ?? 'N/A'} mAh`}
                    </div>
                    <div className="text-xs text-white/60 flex">
                      {(
                        w => (w ? `${Math.max(...w.map(Number))}W` : 'N/A')
                      )(mainProduct.detailedSpecs.battery.charging?.match(/\d+(?=W)/gi))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5 col-span-2 sm:col-span-1">
                  <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Storage</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.ramStorage.storage}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">RAM</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.ramStorage.ram}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Price Display */}
            <div className="flex-shrink-0 text-center sm:text-right w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl text-white mb-1 font-semibold">₹{mainProduct.price.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-white/80 mb-3 sm:mb-4">{mainProduct.retailer.name}</div>
            </div>
          </div>

          {/* Price Comparison Section */}
          <div className="border-t border-white/20 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white/90 mb-3 text-sm">Available at:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {mainProduct.priceComparison && mainProduct.priceComparison.map((retailer, index) => (
                  <a
                    key={index}
                    href={retailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-lg p-2.5 sm:p-3 border border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-emerald-700">{retailer.retailer.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-xs text-white/90 font-medium">{retailer.retailer}</div>
                        <div className="text-xs text-white font-semibold">₹{retailer.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-white/90 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* View Full Specs Button */}
            <button
              onClick={() => navigate(`/product/${mainProduct.id}`)}
              className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0"
            >
              View Full Specs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Tool */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-medium">
                Compare with Similar Products
              </h2>
              <h5 className='text-gray-700'>
                Side-by-side comparison of specifications and pricing
              </h5>
            </div>

            {/* Add Phone */}
            <div
              className="relative max-w-lg flex items-center border rounded-lg px-2"
              ref={searchContainerRef}
            >
              <Search className="text-gray-400" />
              <input
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Add phone to compare…"
                className="w-full rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none"
              />

              {showDropdown && searchInput && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-20 max-h-64 overflow-auto">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.slice(0, 10).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleAddProduct(p)}
                        className="w-full text-left p-3 hover:bg-emerald-50 flex gap-3"
                      >
                        <ImageWithFallback
                          src={p.image || ''}
                          alt={p.name}
                          className="w-8 h-10 object-contain"
                        />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-500">
                            ₹{p.price.toLocaleString()}
                          </div>
                        </div>
                        <Plus className="ml-auto text-emerald-600 w-4 h-4" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No phones found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border rounded-xl overflow-x-auto">
            <div className="min-w-[800px]">
              <div
                className="grid border-b bg-gray-50"
                style={{
                  gridTemplateColumns: `200px repeat(${comparisonProducts.length}, minmax(200px, 1fr))`
                }}
              >
                <div />
                {comparisonProducts.map(p => (
                  <div key={p.id} className="p-4 text-center relative">
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <ImageWithFallback
                      src={p.image || ''}
                      alt={p.name}
                      className="w-20 h-24 mx-auto mb-2 object-contain"
                    />
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-emerald-600 font-semibold text-sm">
                      ₹{p.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {comparisonCategories.map(cat => (
                <div key={cat.title}>
                  <div className="bg-emerald-50 px-4 py-2 font-semibold">
                    {cat.title}
                  </div>
                  {cat.rows.map(row => (
                    <div
                      key={row.label}
                      className="grid border-b"
                      style={{
                        gridTemplateColumns: `200px repeat(${comparisonProducts.length}, minmax(200px, 1fr))`
                      }}
                    >
                      <div className="p-3 font-medium text-gray-600">
                        {row.label}
                      </div>
                      {comparisonProducts.map(p => (
                        <div key={p.id} className="p-3 text-center">
                          {row.getValue(p) || '-'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}