"use client"

import { X } from "lucide-react"
import type { Product } from "../data/mockData"
import { ImageWithFallback } from "./figma/ImageWithFallback"

export interface ComparisonCategory {
  title: string
  rows: {
    label: string
    getValue: (product: Product) => string
  }[]
}

interface ComparisonTableProps {
  products: Product[]
  categories: ComparisonCategory[]
  onRemoveProduct: (id: string) => void
}

export function ComparisonTable({ products, categories, onRemoveProduct }: ComparisonTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
        No products to compare. Add products to start comparing.
      </div>
    )
  }

  const gridTemplateColumns = `200px repeat(${products.length}, minmax(200px, 1fr))`

  return (
    <div className="bg-white border rounded-xl">
      {/* Sticky Header with Product Cards */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid bg-white" style={{ gridTemplateColumns }}>
            {/* Empty cell for label column */}
            <div className="border-r border-gray-200 bg-white" />

            {/* Product Cards */}
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 text-center relative border-r border-gray-200 last:border-r-0 bg-white"
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                  aria-label={`Remove ${product.name}`}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="mb-3">
                  <ImageWithFallback
                    src={product.image || ""}
                    alt={product.name}
                    className="w-20 h-24 mx-auto object-contain"
                  />
                </div>

                {/* Product Name */}
                <div className="font-bold text-sm mb-1 px-6">{product.name}</div>

                {/* Product Price */}
                <div className="text-emerald-600 font-semibold text-sm">₹{product.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Comparison Categories and Rows */}
      <div className="overflow-x-auto">
        <div className="w-max min-w-full">
          {/* Comparison Categories and Rows */}
          {categories.map((category) => (
            <div key={category.title}>
              {/* Category Header */}
              <div
                className="grid bg-emerald-50 border-b border-gray-200 font-semibold"
                style={{ gridTemplateColumns }}
              >
                <div className="px-4 py-3 text-sm text-emerald-900 border-r border-gray-200 bg-emerald-50">
                  {category.title}
                </div>
                {products.map((product) => (
                  <div key={product.id} className="bg-emerald-50 border-r border-gray-200 last:border-r-0" />
                ))}
              </div>

              {/* Category Rows */}
              {category.rows.map((row, rowIndex) => (
                <div key={row.label} className={`grid border-b border-gray-200`} style={{ gridTemplateColumns }}>
                  {/* Row Label */}
                  <div
                    className={`p-3 font-medium text-gray-700 text-sm border-r border-gray-200 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    {row.label}
                  </div>

                  {/* Row Values for each Product */}
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 text-center text-sm text-gray-900 border-r border-gray-200 last:border-r-0 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      {row.getValue(product) || "-"}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
