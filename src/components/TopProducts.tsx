import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ImageWithFallback } from './figma/ImageWithFallback';
import { endpoints } from '../api/client';
import { adaptApiPhoneToProduct } from '../utils/adapter';
import { Product } from '../data/mockData';

export function TopProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------- Carousel Settings ---------------------- */
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: false,
    swipe: true,
    touchMove: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          swipe: true,
          touchMove: true,
          adaptiveHeight: true,
        },
      },
    ],
};


  /* ---------------------- Fetch Products ---------------------- */
  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await endpoints.search('phone', 1, 200);
        const adapted = response.data.data.map(adaptApiPhoneToProduct);

        const shuffled = [...adapted].sort(() => 0.5 - Math.random());
        if (mounted) setProducts(shuffled.slice(0, 18));
      } catch (err) {
        console.error('Failed to load top products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------- Chunk for Mobile ---------------------- */
  const chunks: Product[][] = [];
  for (let i = 0; i < products.length; i += 6) {
    chunks.push(products.slice(i, i + 6));
  }

  /* ---------------------- Mini Card ---------------------- */
  const ProductMiniCard = ({ product }: { product: Product }) => (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition cursor-pointer h-[80px]"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <span className="text-sm font-medium text-gray-900 line-clamp-2">
        {product.name}
      </span>
    </div>
  );

  /* ---------------------- Render ---------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 pb-20">
      <div className="mb-10">
        <h2 className="text-gray-900 text-3xl font-semibold mb-2 mt-10">
          Top products to compare
        </h2>
        <p className="text-emerald-600 font-medium">Smartphones</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading gadgets…
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:grid grid-cols-5 gap-4 pb-8 mt-4">
            {products.map(p => (
              <ProductMiniCard key={p.id} product={p} />
            ))}
          </div>

          {/* Mobile / Tablet */}
          <div className="top-products-slider carousel-dots lg:hidden pb-12">
            <Slider {...carouselSettings}>
              {chunks.map((group, i) => (
                <div key={i} className="px-1">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {group.map(p => (
                      <ProductMiniCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </>
      )}
    </div>
  );
}