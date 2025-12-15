import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star, SlidersHorizontal, ChevronRight, Cpu, Monitor, Camera, Battery, HardDrive, ExternalLink, Search, Plus } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { getProductListings } from '../data/mockData';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  // Get products (in real app, this would filter based on query)
  const allProducts = getProductListings();
  const [comparisonProducts, setComparisonProducts] = useState(allProducts.slice(0, 5)); // Show 5 products for comparison
  const mainProduct = allProducts[0]; // Featured product
  
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Filter available products (exclude already selected ones)
  const availableProducts = allProducts.filter(
    p => !comparisonProducts.find(cp => cp.id === p.id)
  );
  
  // Filter products based on search input
  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const handleAddProduct = (product: typeof allProducts[0]) => {
    if (comparisonProducts.length < 5) {
      setComparisonProducts([...comparisonProducts, product]);
      setSearchInput('');
      setShowDropdown(false);
    }
  };

  const comparisonCategories = [
    {
      title: 'Pricing',
      rows: [
        { label: 'Current Price', getValue: (product: typeof comparisonProducts[0]) => `₹${product.price.toLocaleString()}` },
        { label: 'Best Deal', getValue: (product: typeof comparisonProducts[0]) => product.retailer.name },
      ]
    },
    {
      title: 'Performance',
      rows: [
        { label: 'Processor', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.processor.chipset },
        { label: 'CPU', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.processor.cpu },
        { label: 'AnTuTu Score', getValue: (product: typeof comparisonProducts[0]) => product.specs.antutu },
      ]
    },
    {
      title: 'Display',
      rows: [
        { label: 'Size', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.display.size },
        { label: 'Resolution', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.display.resolution },
        { label: 'HDR', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.display.hdr },
      ]
    },
    {
      title: 'Camera',
      rows: [
        { label: 'Rear Main', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.camera.rear.main },
        { label: 'Ultra Wide', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.camera.rear.ultraWide },
        { label: 'Front', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.camera.front.sensor },
      ]
    },
    {
      title: 'Battery & Storage',
      rows: [
        { label: 'Battery', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.battery.capacity },
        { label: 'Charging', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.battery.charging },
        { label: 'RAM', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.ramStorage.ram },
        { label: 'Storage', getValue: (product: typeof comparisonProducts[0]) => product.detailedSpecs.ramStorage.storage },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <div className="text-xs sm:text-sm text-gray-500 mb-2">
            Home / Search / <span className="text-gray-900">{query}</span>
          </div>
          <h1 className="text-gray-900 text-xl sm:text-3xl mb-1">"{query}"</h1>
          <p className="text-sm sm:text-base text-gray-600">{comparisonProducts.length} products from multiple retailers</p>
        </div>

        {/* Main Product Card */}
        <div className="rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-emerald-700 relative" style={{ backgroundColor: '#009966' }}>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            {/* Product Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-32 h-40 sm:w-40 sm:h-52 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                <div className="w-20 h-28 sm:w-24 sm:h-36 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 w-full">
              <h2 className="text-white mb-2 text-xl sm:text-2xl text-center sm:text-left">{mainProduct.name}</h2>
              <div className="text-xs sm:text-sm text-white/80 mb-4 text-center sm:text-left">Launched {mainProduct.launchDate}</div>

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
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Processor</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.specs.antutu}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Display</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.display.size.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Camera</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.camera.rear.main.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5">
                  <Battery className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Battery</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.battery.capacity.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border border-white/30 rounded-lg p-2 sm:p-3 bg-white/5 col-span-2 sm:col-span-1">
                  <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-white/80 mb-1">Storage</div>
                    <div className="text-xs sm:text-sm text-white font-medium">{mainProduct.detailedSpecs.ramStorage.storage}</div>
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
                {mainProduct.priceComparison.map((retailer, index) => (
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
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0"
            >
              View Full Specs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-gray-900 text-xl sm:text-2xl mb-1 sm:mb-2">Compare with Similar Products</h2>
            <p className="text-sm sm:text-base text-gray-600">Side-by-side comparison of specifications and pricing</p>
          </div>
          
          {/* Search and Add Product */}
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <label className="block text-gray-600 text-xs font-medium mb-2 font-bold">
              Add new phone to compare
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search phones..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  if (searchInput && filteredProducts.length > 0) {
                    handleAddProduct(filteredProducts[0]);
                  }
                }}
                disabled={!searchInput || filteredProducts.length === 0 || comparisonProducts.length >= 5}
                className="flex-shrink-0 w-10 h-10 bg-[rgb(0,153,102)] text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Dropdown */}
            {showDropdown && searchInput && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                {filteredProducts.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">₹{product.price.toLocaleString()}</div>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Horizontal scrollable comparison view for all screen sizes */}
          <div className="overflow-x-auto">
            {/* Product Headers */}
            <div className="grid gap-0 border-b border-gray-200 bg-gray-50 sticky top-16 z-10" style={{ gridTemplateColumns: `minmax(150px, 200px) repeat(${comparisonProducts.length}, minmax(180px, 1fr))` }}>
              <div className="p-3 sm:p-4 border-r border-gray-200"></div>
              {comparisonProducts.map((product) => (
                <div key={product.id} className="p-3 sm:p-4 text-center border-r border-gray-200 last:border-r-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center border border-gray-200">
                    <div className="w-10 h-14 sm:w-14 sm:h-20 bg-gray-300 rounded"></div>
                  </div>
                  <h3 className="text-gray-900 mb-2 font-medium text-xs sm:text-sm">{product.name}</h3>
                  <div className="text-lg sm:text-xl text-gray-900 mb-1 font-semibold">₹{product.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mb-3">{product.retailer.name}</div>
                  
                  {/* Basic Info Section */}
                  <div className="rounded-lg p-2 mb-3 border border-gray-200 bg-gray-50">
                    <div className="text-[10px] sm:text-xs text-gray-700 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Launch:</span>
                        <span className="font-medium">{product.launchDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-medium">{product.beebomScore}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">{product.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-xs px-2 sm:px-3 py-1.5 border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      View Specs
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <a
                      href={product.priceComparison[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 sm:px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      Buy Now
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            {comparisonCategories.map((category, catIndex) => (
              <div key={catIndex}>
                {/* Category Header */}
                <div className="bg-emerald-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  <h3 className="text-gray-900 font-medium text-xs sm:text-sm">{category.title}</h3>
                </div>

                {/* Category Rows */}
                {category.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    style={{ gridTemplateColumns: `minmax(150px, 200px) repeat(${comparisonProducts.length}, minmax(180px, 1fr))` }}
                  >
                    <div className="p-3 sm:p-4 text-gray-700 border-r border-gray-100 bg-gray-50/50 font-medium text-xs sm:text-sm">
                      {row.label}
                    </div>
                    {comparisonProducts.map((product) => (
                      <div key={product.id} className="p-3 sm:p-4 text-center text-gray-900 border-r border-gray-100 last:border-r-0 text-xs sm:text-sm">
                        {row.getValue(product)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}