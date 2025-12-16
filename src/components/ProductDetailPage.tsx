import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft } from 'lucide-react';

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
  const [loading, setLoading] = useState<boolean>(true);

  /* ----------------------------- Fetch API ----------------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await endpoints.compare([id]);

        if (response.data?.phones?.length > 0 && mounted) {
          const adapted = adaptComparePhoneToProduct(response.data.phones[0]);
          setProduct(adapted);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* ------------------------------ Guards ------------------------------- */
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

  /* --------------------------- Spec Mapping ---------------------------- */
  const specSections = [
    {
      title: 'Performance',
      items: [
        { label: 'Processor', value: product.detailedSpecs.processor.chipset },
        { label: 'RAM', value: product.detailedSpecs.ramStorage.ram },
        { label: 'Storage', value: product.detailedSpecs.ramStorage.storage },
      ],
    },
    {
      title: 'Display',
      items: [
        { label: 'Size', value: product.detailedSpecs.display.size },
        { label: 'Resolution', value: product.detailedSpecs.display.resolution },
        { label: 'Type', value: product.detailedSpecs.display.hdr },
      ],
    },
    {
      title: 'Camera',
      items: [
        { label: 'Rear Camera', value: product.detailedSpecs.camera.rear.main },
        { label: 'Video', value: product.detailedSpecs.camera.rear.video },
        { label: 'Front Camera', value: product.detailedSpecs.camera.front.sensor },
      ],
    },
    {
      title: 'Battery',
      items: [
        { label: 'Capacity', value: product.detailedSpecs.battery.capacity },
        { label: 'Charging', value: product.detailedSpecs.battery.charging },
      ],
    },
  ];

  /* -------------------------------------------------------------------- */
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
          Back
        </button>

        {/* ======================= HEADER CARD ======================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
              <span className="text-2xl font-bold">{product.beebomScore}</span>{' '}
              Score
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {product.rating || 'N/A'}
              </span>
              <span className="text-gray-500">
                ({product.reviews || 0})
              </span>
            </div>
          </div>

          {/* Price (estimated) */}
          <div className="pt-4 border-t">
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

        {/* =================== IMAGE + SPECS =================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 h-fit">
            <div className="aspect-[3/4] flex items-center justify-center bg-gray-50 rounded-lg mb-4">
              <ImageWithFallback
                src={product.image || ''}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Released: {product.launchDate}
            </div>
          </div>

          {/* Specs */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">Specifications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specSections.map(section => (
                <div
                  key={section.title}
                  className="bg-white p-4 rounded-xl border border-gray-100"
                >
                  <h3 className="font-semibold border-b pb-2 mb-3">
                    {section.title}
                  </h3>

                  <div className="space-y-2">
                    {section.items.map(item => (
                      <div key={item.label}>
                        <div className="text-xs text-gray-500 uppercase">
                          {item.label}
                        </div>
                        <div className="font-medium">
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
      </div>

      <Footer />
    </div>
  );
}
