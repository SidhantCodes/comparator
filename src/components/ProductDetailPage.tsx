"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Star, ChevronLeft, ExternalLink } from "lucide-react"

import { ImageWithFallback } from "./figma/ImageWithFallback"

import { endpoints } from "../api/client"
import { adaptApiPhoneToProduct } from "../utils/adapter"
import type { Product } from "../data/mockData"
import type { ApiPhone } from "../api/types"
import { CardDiscountPill } from "./CardDiscountPillProps"

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  /* ----------------------------- Fetch ----------------------------- */
  useEffect(() => {
    let mounted = true

    const fetchProduct = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await endpoints.search(1, 200)

        if (mounted && response.data?.data) {
          const apiPhones: ApiPhone[] = response.data.data
          const foundPhone = apiPhones.find((p) => p._id === id)

          if (foundPhone) {
            setProduct(adaptApiPhoneToProduct(foundPhone))
          }
        }
      } catch (e) {
        console.error("Failed to load product", e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      mounted = false
    }
  }, [id])

  /* ----------------------------- Guards ----------------------------- */
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product details…</div>
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 hover:text-emerald-700">
            Go back
          </button>
        </div>
      </div>
    )
  }

  /* --------------------------- Specs --------------------------- */
  const specSections = [
    {
      title: "Performance",
      items: [
        { label: "Chipset", value: product.detailedSpecs.processor.chipset },
        { label: "CPU", value: product.detailedSpecs.processor.cpu },
        { label: "AnTuTu Score", value: product.specs.antutu },
        { label: "RAM", value: product.detailedSpecs.ramStorage.ram },
        { label: "Storage", value: product.detailedSpecs.ramStorage.storage },
        { label: "Storage Type", value: product.detailedSpecs.ramStorage.type },
      ],
    },
    {
      title: "Display",
      items: [
        { label: "Screen Size", value: product.detailedSpecs.display.size },
        { label: "Resolution", value: product.detailedSpecs.display.resolution },
        {
          label: "Refresh Rate",
          value: product.specs.display.includes("Hz") ? product.specs.display.split(" ").pop() : "Standard",
        },
        { label: "HDR Support", value: product.detailedSpecs.display.hdr },
      ],
    },
    {
      title: "Camera (Rear)",
      items: [
        { label: "Main Sensor", value: product.detailedSpecs.camera.rear.main },
        { label: "Ultra-wide", value: product.detailedSpecs.camera.rear.ultraWide },
        { label: "Video Recording", value: product.detailedSpecs.camera.rear.video },
      ],
    },
    {
      title: "Camera (Front)",
      items: [
        { label: "Sensor", value: product.detailedSpecs.camera.front.sensor },
        { label: "Aperture / Video", value: product.detailedSpecs.camera.front.aperture },
      ],
    },
    {
      title: "Battery",
      items: [
        { label: "Capacity", value: product.detailedSpecs.battery.capacity },
        { label: "Charging", value: product.detailedSpecs.battery.charging },
        { label: "Charger in Box", value: product.detailedSpecs.battery.chargerInBox },
      ],
    },
    {
      title: "Design & Durability",
      items: [
        { label: "Front Protection", value: product.detailedSpecs.design.frontProtection },
        { label: "Back Material", value: product.detailedSpecs.design.backMaterial },
        { label: "IP Rating", value: product.detailedSpecs.design.ipRating },
      ],
    },
    {
      title: "Software",
      items: [
        { label: "Operating System", value: product.detailedSpecs.os.version },
        { label: "Update Policy", value: product.detailedSpecs.os.updates },
      ],
    },
  ]

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to results
        </button>
        {/* ================= HEADER CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-gray-100">
          <h1 className="font-semibold text-3xl mb-2 ml-1">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            {/* Score */}
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
              <span className="text-xl sm:text-3xl font-bold text-emerald-600">{product.beebomScore}</span>
              <span className="text-sm font-medium text-emerald-800/60 uppercase">Score</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-6 h-6 text-gray-300" />
                ))}
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-xl font-bold text-gray-900">{product.rating}/5</span>
              <span className="text-gray-400">({product.reviews} Ratings)</span>
            </div>

            {/* Stock */}
            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold border border-emerald-100">
              In Stock
            </div>
          </div>

          {/* Retailer Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Available at:</h3>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {product.priceComparison?.map((item, idx) => (
                <div key={idx} className="relative w-auto sm:w-[280px]">
                  <div className="absolute top-0 right-2 z-10">
                    <CardDiscountPill />
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2 hover:border-emerald-500 transition-all w-full mt-2 ml-1"
                  >
                    {/* Retailer info */}
                    <div className="flex items-center gap-3 pr-4">
                      <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm">
                        <img
                          src={item.logo || "/placeholder.svg"}
                          alt={item.retailer}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.retailer}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">In Stock</div>
                      </div>
                    </div>

                    {/* Price and icon */}
                    <div className="pl-4 flex items-center justify-between gap-2 flex-1">
                      <span className="text-xl font-black text-gray-900">₹{item.price.toLocaleString()}</span>
                      <ExternalLink className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                  </a>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* ================= IMAGE + SPECS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24">
              <div className="aspect-[3/4] bg-gray-50 rounded-xl mb-3 flex items-center justify-center border">
                <ImageWithFallback
                  src={product.image || ""}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className="
                      aspect-[3/4]
                      bg-gray-50
                      border
                      rounded-lg
                      flex items-center justify-center
                      hover:border-emerald-500
                      transition
                    "
                  >
                    <img
                      src="/placeholder.svg"
                      alt={`${i}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
              <div className="text-center pt-3 border-t border-gray-100">
                <div className="text-gray-900 font-medium">{product.daysAgo}</div>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="lg:col-span-3">
            <h2 className="text-gray-900 mb-3 text-2xl">Technical Specifications</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specSections.map((section) => (
                <div key={section.title} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-100">{section.title}</h3>

                  <div className="space-y-2.5">
                    {section.items.map((item) => (
                      <div key={item.label}>
                        <div className="text-xs text-gray-500 uppercase mb-0.5">{item.label}</div>
                        <div className="text-gray-900 text-sm">{item.value || "N/A"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Comparison Section at the Bottom */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Price Comparison
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {product.priceComparison?.map((item, i) => (
              <div
                key={i}
                className="
                  bg-white border border-gray-200 rounded-2xl
                  p-4 sm:p-6
                  flex flex-col sm:flex-row sm:items-center justify-between
                  gap-4 sm:gap-6
                  hover:border-emerald-500 hover:shadow-md transition-all
                "
              >

                {/* Left: Retailer Branding */}
                <div className="flex items-center gap-4 sm:w-auto w-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                    <img
                      src={item.logo || "/placeholder.svg"}
                      alt={item.retailer}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <div className="text-base font-bold text-gray-900">
                      {item.retailer}
                    </div>

                    <div className="flex items-center mt-1">
                      <span className="text-xs font-bold text-emerald-600 uppercase">
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>


                {/* Right: Price & CTA */}
                <div className="flex w-[280px] items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <CardDiscountPill />
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-4 sm:px-6 py-2
                      bg-emerald-600 text-white
                      rounded-xl
                      flex items-center gap-2
                      whitespace-nowrap
                      hover:bg-emerald-700 transition-all
                      shadow-emerald-200 shadow-lg
                    "
                  >
                    <span>View Deal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>
          <div>
          </div>
          {/* Trust Note */}
          <p className="mt-6 text-center text-xs text-gray-400 italic">
            * Prices include typical card discounts and are updated periodically from the retailers.
          </p>
        </div>
      </div>
    </div>
  )
}
