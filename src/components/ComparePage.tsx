import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Header } from './Header';
import { getProductById } from '../data/mockData';

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ids = searchParams.get('ids')?.split(',') || [];
  const products = ids.map(id => getProductById(id)).filter(Boolean);

  if (products.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2>Please select at least 2 products to compare</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const comparisonCategories = [
    {
      title: 'Price & Availability',
      rows: [
        { label: 'Current Price', getValue: (p: any) => `₹${p.price.toLocaleString()}` },
        { label: 'Launch Date', getValue: (p: any) => p.launchDate },
        { label: 'Best Deal', getValue: (p: any) => p.retailer.name },
        { label: 'Beebom Score', getValue: (p: any) => p.beebomScore },
        { label: 'User Rating', getValue: (p: any) => `${p.rating}/5` },
      ]
    },
    {
      title: 'Display',
      rows: [
        { label: 'Size & Type', getValue: (p: any) => p.detailedSpecs.display.size },
        { label: 'Resolution', getValue: (p: any) => p.detailedSpecs.display.resolution },
        { label: 'HDR Support', getValue: (p: any) => p.detailedSpecs.display.hdr },
      ]
    },
    {
      title: 'Performance',
      rows: [
        { label: 'Processor', getValue: (p: any) => p.detailedSpecs.processor.chipset },
        { label: 'CPU', getValue: (p: any) => p.detailedSpecs.processor.cpu },
        { label: 'Antutu Score', getValue: (p: any) => p.specs.antutu },
      ]
    },
    {
      title: 'Memory',
      rows: [
        { label: 'RAM', getValue: (p: any) => p.detailedSpecs.ramStorage.ram },
        { label: 'Storage', getValue: (p: any) => p.detailedSpecs.ramStorage.storage },
        { label: 'Type', getValue: (p: any) => p.detailedSpecs.ramStorage.type },
      ]
    },
    {
      title: 'Camera',
      rows: [
        { label: 'Main Camera', getValue: (p: any) => p.detailedSpecs.camera.rear.main },
        { label: 'Ultra Wide', getValue: (p: any) => p.detailedSpecs.camera.rear.ultraWide },
        { label: 'Front Camera', getValue: (p: any) => p.detailedSpecs.camera.front.sensor },
        { label: 'Video Recording', getValue: (p: any) => p.detailedSpecs.camera.rear.video },
        { label: 'Zoom Capability', getValue: (p: any) => p.specs.zoom },
      ]
    },
    {
      title: 'Battery',
      rows: [
        { label: 'Capacity', getValue: (p: any) => p.detailedSpecs.battery.capacity },
        { label: 'Charging Speed', getValue: (p: any) => p.detailedSpecs.battery.charging },
        { label: 'Charger in Box', getValue: (p: any) => p.detailedSpecs.battery.chargerInBox },
      ]
    },
    {
      title: 'Design & Build',
      rows: [
        { label: 'Front Protection', getValue: (p: any) => p.detailedSpecs.design.frontProtection },
        { label: 'Back Material', getValue: (p: any) => p.detailedSpecs.design.backMaterial },
        { label: 'IP Rating', getValue: (p: any) => p.detailedSpecs.design.ipRating },
      ]
    },
    {
      title: 'Software',
      rows: [
        { label: 'Operating System', getValue: (p: any) => p.detailedSpecs.os.version },
        { label: 'OS Updates', getValue: (p: any) => p.detailedSpecs.os.updates },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to results
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2 text-3xl">Product Comparison</h1>
          <p className="text-gray-600">
            Side-by-side comparison of {products.length} products
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Product Headers - Sticky */}
          <div className={`grid ${products.length === 2 ? 'grid-cols-[220px_1fr_1fr]' : 'grid-cols-[220px_repeat(auto-fit,minmax(280px,1fr))]'} gap-0 border-b border-gray-200 bg-gray-50 sticky top-16 z-10`}>
            <div className="p-4 border-r border-gray-200"></div>
            {products.map((product) => (
              <div key={product!.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center border border-gray-200">
                  <div className="w-14 h-20 bg-gray-300 rounded"></div>
                </div>
                <h3 className="text-gray-900 mb-2 font-medium text-sm">{product!.name}</h3>
                <div className="text-xl text-gray-900 mb-1 font-semibold">₹{product!.price.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mb-3">{product!.retailer.name}</div>
                <button
                  onClick={() => navigate(`/product/${product!.id}`)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          {comparisonCategories.map((category, catIndex) => (
            <div key={catIndex}>
              {/* Category Header */}
              <div className="bg-emerald-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-gray-900 font-medium text-sm">{category.title}</h3>
              </div>

              {/* Category Rows */}
              {category.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`grid ${products.length === 2 ? 'grid-cols-[220px_1fr_1fr]' : 'grid-cols-[220px_repeat(auto-fit,minmax(280px,1fr))]'} gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
                >
                  <div className="p-4 text-gray-700 border-r border-gray-100 bg-gray-50/50 font-medium text-sm">
                    {row.label}
                  </div>
                  {products.map((product) => (
                    <div key={product!.id} className="p-4 text-center text-gray-900 border-r border-gray-100 last:border-r-0 text-sm">
                      {row.getValue(product)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          {products.map((product) => (
            <a
              key={product!.id}
              href={product!.priceComparison[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              Buy {product!.name.split(' ')[0]}
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}