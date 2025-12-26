"use client"

import { ChevronRight, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { ImageWithFallback } from "./figma/ImageWithFallback"
import { PriceComparison } from "./PriceComparison"
import { QuickSpecs } from "./QuickSpecs"
import { FeaturedProductCardProps } from "../api/types"



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
              <span className="text-white/80">({product.reviews})</span>
            </div>
          </div>

          {/* Quick Specs */}
          <QuickSpecs product={product} />
        </div>

        {/* MOBILE ONLY: Price Comparison (before Quick Specs) */}
        <PriceComparison
          price={product.price}
          retailerName={product.retailer.name}
          priceComparison={product.priceComparison}
          className="md:hidden gap-2"
        />

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
