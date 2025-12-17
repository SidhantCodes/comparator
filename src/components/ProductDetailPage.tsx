import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ExternalLink } from 'lucide-react';

import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { endpoints } from '../api/client';
import { adaptComparePhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----------------------------- Fetch ----------------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await endpoints.compare([id]);
        if (response.data?.phones?.length && mounted) {
          setProduct(adaptComparePhoneToProduct(response.data.phones[0]));
        }
      } catch (e) {
        console.error('Failed to load product', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* ----------------------------- Guards ----------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product details…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-emerald-600 hover:text-emerald-700"
          >
            Go back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  /* --------------------------- Specs --------------------------- */
  const specSections = [
    {
      title: 'Performance',
      items: [
        { label: 'Chipset', value: product.detailedSpecs.processor.chipset },
        { label: 'CPU', value: product.detailedSpecs.processor.cpu },
        { label: 'AnTuTu Score', value: product.specs.antutu },
        { label: 'RAM', value: product.detailedSpecs.ramStorage.ram },
        { label: 'Storage', value: product.detailedSpecs.ramStorage.storage },
        { label: 'Storage Type', value: product.detailedSpecs.ramStorage.type },
      ],
    },
    {
      title: 'Display',
      items: [
        { label: 'Screen Size', value: product.detailedSpecs.display.size },
        { label: 'Resolution', value: product.detailedSpecs.display.resolution },
        {
          label: 'Refresh Rate',
          value: product.specs.display.includes('Hz')
            ? product.specs.display.split(' ').pop()
            : 'Standard',
        },
        { label: 'HDR Support', value: product.detailedSpecs.display.hdr },
      ],
    },
    {
      title: 'Camera (Rear)',
      items: [
        { label: 'Main Sensor', value: product.detailedSpecs.camera.rear.main },
        { label: 'Ultra-wide', value: product.detailedSpecs.camera.rear.ultraWide },
        { label: 'Video Recording', value: product.detailedSpecs.camera.rear.video },
      ],
    },
    {
      title: 'Camera (Front)',
      items: [
        { label: 'Sensor', value: product.detailedSpecs.camera.front.sensor },
        { label: 'Aperture / Video', value: product.detailedSpecs.camera.front.aperture },
      ],
    },
    {
      title: 'Battery',
      items: [
        { label: 'Capacity', value: product.detailedSpecs.battery.capacity },
        { label: 'Charging', value: product.detailedSpecs.battery.charging },
        { label: 'Charger in Box', value: product.detailedSpecs.battery.chargerInBox },
      ],
    },
    {
      title: 'Design & Durability',
      items: [
        { label: 'Front Protection', value: product.detailedSpecs.design.frontProtection },
        { label: 'Back Material', value: product.detailedSpecs.design.backMaterial },
        { label: 'IP Rating', value: product.detailedSpecs.design.ipRating },
      ],
    },
    {
      title: 'Software',
      items: [
        { label: 'Operating System', value: product.detailedSpecs.os.version },
        { label: 'Update Policy', value: product.detailedSpecs.os.updates },
      ],
    },
  ];

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to results
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-100">
          <h1 className="text-gray-900 mb-3 text-3xl">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-4">
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
              <span className="text-2xl font-semibold">{product.beebomScore}</span>
              <span className="text-xs ml-2">Score</span>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews})</span>
            </div>
          </div>

          {/* Price row */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
              <div>
                <div className="text-sm text-gray-500">Estimated Price</div>
                <div className="text-2xl font-bold">
                  ₹{product.price.toLocaleString()}
                </div>
              </div>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Check Availability
              </button>
            </div>
          </div>
        </div>

        {/* IMAGE + SPECS (CRITICAL FIX) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
          {/* Image column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24">
              <div className="aspect-[3/4] bg-gray-50 rounded-xl mb-3 flex items-center justify-center border">
                <ImageWithFallback
                  src={product.image || ''}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-center pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">Launched</div>
                <div className="text-gray-900 font-medium">
                  {product.launchDate}
                </div>
              </div>
            </div>
          </div>

          {/* Specs column */}
          <div className="lg:col-span-3">
            <h2 className="text-gray-900 mb-3 text-2xl">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specSections.map(section => (
                <div
                  key={section.title}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                >
                  <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-100">
                    {section.title}
                  </h3>

                  <div className="space-y-2.5">
                    {section.items.map(item => (
                      <div key={item.label}>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                          {item.label}
                        </div>
                        <div className="text-gray-900 text-sm break-words">
                          {item.value || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-gray-900 mb-4 text-2xl">Price Comparison</h2>

          <div className="space-y-3">
            {product.priceComparison?.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-500 transition-all"
              >
                <div>
                  <div className="font-medium">{p.retailer}</div>
                  <div className="text-sm text-gray-500">In Stock</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xl font-semibold">
                    ₹{p.price.toLocaleString()}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                  >
                    View Deal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
