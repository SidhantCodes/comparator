import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, Plus, ExternalLink } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { getProductById } from '../data/mockData';
import Slider from 'react-slick';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2>Product not found</h2>
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

  const specSections = [
    {
      title: 'Processor',
      items: [
        { label: 'Chipset', value: product.detailedSpecs.processor.chipset },
        { label: 'CPU', value: product.detailedSpecs.processor.cpu },
      ]
    },
    {
      title: 'Display',
      items: [
        { label: 'Size', value: product.detailedSpecs.display.size },
        { label: 'Resolution', value: product.detailedSpecs.display.resolution },
        { label: 'HDR Support', value: product.detailedSpecs.display.hdr },
      ]
    },
    {
      title: 'Battery',
      items: [
        { label: 'Capacity', value: product.detailedSpecs.battery.capacity },
        { label: 'Charging', value: product.detailedSpecs.battery.charging },
        { label: 'Charger Included', value: product.detailedSpecs.battery.chargerInBox },
      ]
    },
    {
      title: 'Rear Camera',
      items: [
        { label: 'Main Sensor', value: product.detailedSpecs.camera.rear.main },
        { label: 'Ultra Wide', value: product.detailedSpecs.camera.rear.ultraWide },
        { label: 'Video', value: product.detailedSpecs.camera.rear.video },
      ]
    },
    {
      title: 'RAM/Storage',
      items: [
        { label: 'RAM', value: product.detailedSpecs.ramStorage.ram },
        { label: 'Storage', value: product.detailedSpecs.ramStorage.storage },
        { label: 'Type', value: product.detailedSpecs.ramStorage.type },
      ]
    },
    {
      title: 'Front Camera',
      items: [
        { label: 'Sensor', value: product.detailedSpecs.camera.front.sensor },
        { label: 'Aperture', value: product.detailedSpecs.camera.front.aperture },
      ]
    },
    {
      title: 'Design',
      items: [
        { label: 'Front Protection', value: product.detailedSpecs.design.frontProtection },
        { label: 'Back Material', value: product.detailedSpecs.design.backMaterial },
        { label: 'IP Rating', value: product.detailedSpecs.design.ipRating },
      ]
    },
    {
      title: 'Operating System',
      items: [
        { label: 'OS Version', value: product.detailedSpecs.os.version },
        { label: 'OS Updates', value: product.detailedSpecs.os.updates },
      ]
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to results
          </button>
          <div className="text-sm text-gray-500">
            Home / {product.category} / <span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5 border border-gray-100">
          <div className="mb-4">
            <h1 className="text-gray-900 mb-3 text-3xl">{product.name}</h1>
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
                  <span className="text-2xl font-semibold">{product.beebomScore}</span>
                  <span className="text-xs ml-2">Score</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-gray-900 font-medium">{product.rating}/5</span>
                <span className="text-gray-500">({product.reviews})</span>
              </div>
              <div className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-200 inline-block flex-shrink-0">
                In Stock
              </div>
            </div>
          </div>

          {/* Quick Price Comparison */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-gray-900 mb-3 text-sm font-medium">Available at:</h3>
            <div className="flex flex-wrap gap-2">
              {product.priceComparison.map((price, index) => (
                <a
                  key={index}
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-sm transition-all group bg-gray-50 relative overflow-visible w-full sm:w-auto"
                >
                  {/* Card Discount Badge */}
                  <div className="absolute -top-2.5 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span className="font-semibold">Card Discount</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="w-5 h-5 bg-emerald-100 rounded"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-900 font-medium">{price.retailer}</div>
                      <div className="text-xs text-gray-500">{price.availability}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-3 border-l border-gray-200 ml-auto">
                    <div className="text-lg text-gray-900 font-semibold">₹{price.price.toLocaleString()}</div>
                    <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Product Images and Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center border border-gray-200">
                <div className="w-32 h-44 bg-gray-300 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                  >
                    <div className="w-8 h-12 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">Launched</div>
                <div className="text-gray-900 font-medium">{product.launchDate}</div>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-gray-900 mb-3 text-2xl">Technical Specifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specSections.map((section) => (
                <div key={section.title} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-100">{section.title}</h3>
                  <div className="space-y-2.5">
                    {section.items.map((item) => (
                      <div key={item.label}>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{item.label}</div>
                        <div className="text-gray-900 text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expert Score Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl shadow-lg p-8 mb-5 border-2 border-emerald-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-emerald-300">
              <Star className="w-8 h-8 fill-emerald-600 text-emerald-600" />
              <div className="text-left">
                <div className="text-sm text-gray-600 font-medium">Expert Score</div>
                <div className="text-3xl text-emerald-700 font-bold">{product.rating}</div>
              </div>
            </div>
          </div>

          {/* Mobile Carousel - Shows 4 items in 2x2 grid per slide */}
          <div className="block lg:hidden carousel-expert-reviews">
            <Slider {...settings}>
              {[0, 1].map((slideIndex) => (
                <div key={slideIndex} className="px-2">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'CNET', rating: 4.5 },
                      { name: 'Tom\'s Guide', rating: 4.0 },
                      { name: 'PCMag', rating: 4.5 },
                      { name: 'WIRED', rating: 4.0 },
                      { name: 'TechRadar', rating: 4.5 },
                      { name: 'PhoneArena', rating: 4.0 },
                      { name: 'The Verge', rating: 4.5 },
                      { name: 'Smartprix', rating: 4.0 }
                    ].slice(slideIndex * 4, slideIndex * 4 + 4).map((review, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center border-2 border-emerald-200">
                            <span className="text-emerald-700 font-bold text-xs">{review.name.split(' ').map(w => w[0]).join('')}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-900 font-semibold mb-1 text-sm">{review.name}</div>
                            <div className="flex items-center justify-center gap-0.5 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= Math.floor(review.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : star === Math.ceil(review.rating) && review.rating % 1 !== 0
                                      ? 'fill-yellow-200 text-yellow-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">{review.rating}/5</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Desktop Grid - Hidden on mobile */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {[
              { name: 'CNET', rating: 4.5 },
              { name: 'Tom\'s Guide', rating: 4.0 },
              { name: 'PCMag', rating: 4.5 },
              { name: 'WIRED', rating: 4.0 },
              { name: 'TechRadar', rating: 4.5 },
              { name: 'PhoneArena', rating: 4.0 },
              { name: 'The Verge', rating: 4.5 },
              { name: 'Smartprix', rating: 4.0 }
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center border-2 border-emerald-200">
                    <span className="text-emerald-700 font-bold text-sm">{review.name.split(' ').map(w => w[0]).join('')}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-semibold mb-2">{review.name}</div>
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(review.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : star === Math.ceil(review.rating) && review.rating % 1 !== 0
                              ? 'fill-yellow-200 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{review.rating}/5</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Comparison Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-gray-900 mb-4 text-2xl">
            Price Comparison
          </h2>
          <div className="space-y-2.5">
            {product.priceComparison.map((price, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                    <div className="w-8 h-8 bg-emerald-100 rounded"></div>
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium mb-0.5">{price.retailer}</div>
                    <div className="text-sm text-gray-500">{price.availability}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="text-right">
                    <div className="text-lg sm:text-2xl text-gray-900 font-semibold">₹{price.price.toLocaleString()}</div>
                    <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full">
                      <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-white" />
                      <span className="font-semibold">Card Discount</span>
                    </div>
                  </div>
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
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