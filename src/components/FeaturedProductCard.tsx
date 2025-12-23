"use client"

import { Cpu, Monitor, Camera, Battery, HardDrive, ChevronRight, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { ImageWithFallback } from "./figma/ImageWithFallback"
import type { Product } from "../data/mockData"
import { PriceComparison } from "./PriceComparison"

type FeaturedProductCardProps = {
  product: Product
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-emerald-700"
      style={{ backgroundColor: "#009966" }}
    >
      {/* TOP ROW */}
      <div className="flex flex-col sm:flex-row lg:flex-nowrap flex-wrap gap-6">
        {/* LEFT: Image */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="w-36 h-44 sm:w-40 sm:h-52 bg-white rounded-2xl flex items-center justify-center border border-white/20 p-4 shadow-inner">
            <ImageWithFallback
              src={product.image || ""}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* MOBILE ONLY: Price Comparison (before Quick Specs) */}
        <PriceComparison
          price={product.price}
          retailerName={product.retailer.name}
          priceComparison={product.priceComparison}
          className="md:hidden gap-2"
        />


        <div className="flex-1 min-w-0 text-center sm:text-left pb-6 order-2 sm:order-none">
          <h2 className="text-white mb-1 text-2xl sm:text-3xl font-bold">{product.name}</h2>
          <div className="text-xs sm:text-sm text-white/80 mb-4">{product.daysAgo}</div>

          {/* Score & Rating */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-6">
            <div className="bg-white text-emerald-700 px-4 py-2 rounded-xl border border-white">
              <span className="text-xl font-semibold">{product.beebomScore}</span>
              <span className="text-xs ml-1">Score</span>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-medium text-lg">{product.rating}</span>
              <span className="text-white/80">({product.reviews} Ratings)</span>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Spec icon={<Monitor />} label="Display">
              {product.detailedSpecs.display.size.split(" ")[0]}"
              <div className="text-sm text-white/60">
                {`${product.detailedSpecs.display.resolution.split("pixels")[0]}`}
              </div>
            </Spec>

            <Spec icon={<Camera />} label="Main Camera">
              {product.detailedSpecs.camera.rear.main?.match(/(\d+)\s*MP/i)?.[1] ?? "N/A"} MP
            </Spec>

            <Spec icon={<Battery />} label="Battery">
              {product.detailedSpecs.battery.capacity.match(/(\d+)\s*mAh/)?.[1] ?? "N/A"} mAh
              <div className="text-sm text-white/60 flex">
                {((w) => (w ? `${Math.max(...w.map(Number))}W` : "N/A"))(
                  product.detailedSpecs.battery.charging?.match(/\d+(?=W)/gi),
                )}
              </div>
            </Spec>
            <Spec icon={<HardDrive />} label="RAM">
              {product.detailedSpecs.ramStorage.ram}
            </Spec>
            <Spec icon={<Cpu />} label="Storage">
              {product.detailedSpecs.ramStorage.storage}
            </Spec>
          </div>
        </div>

        {/* RIGHT: Retailer Prices (Reduced Width) */}
        <PriceComparison
          price={product.price}
          retailerName={product.retailer.name}
          priceComparison={product.priceComparison}
          className="hidden md:block space-y-2"
        />

      </div>

      <div className="pt-6 mt-6 flex justify-center">
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="
            px-6 py-3
            bg-white
            text-emerald-700
            rounded-lg
            flex items-center gap-2
            whitespace-nowrap

            transition-all
            duration-200
            ease-out

            hover:bg-emerald-700
            hover:text-white
            cursor-pointer
          "
        >
          View Full Specs
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Spec Card                                                           */
/* ------------------------------------------------------------------ */
function Spec({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 border border-white/30 rounded-lg p-3 bg-white/5">
      <div className="text-white w-5 h-5">{icon}</div>
      <div>
        <div className="text-xs text-white/80 mb-1">{label}</div>
        <div className="text-sm text-white font-medium">{children}</div>
      </div>
    </div>
  )
}
