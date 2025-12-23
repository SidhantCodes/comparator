import { ExternalLink } from "lucide-react"
import { Product } from "../data/mockData"

type PriceComparisonProps = {
  price: number
  retailerName: string
  priceComparison: Product["priceComparison"]
  className?: string
}

export function PriceComparison({
  price,
  retailerName,
  priceComparison,
  className = "",
}: PriceComparisonProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="text-center sm:text-right text-white">
        <div className="text-3xl font-semibold">
          ₹{price.toLocaleString()}
        </div>
        <div className="text-sm text-white/80">{retailerName}</div>
      </div>

      {priceComparison.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            flex items-center justify-between
            bg-white
            px-3 py-2.5
            mt-2
            rounded-lg
            shadow-sm
            transition-all
            duration-200
            ease-out
            hover:-translate-y-0.5
            hover:shadow-md
            hover:ring-2
            hover:ring-emerald-600/30
          "
        >
          <img
            src={link.logo || "/placeholder.svg"}
            height={18}
            width={18}
            alt=""
          />
          <span className="text-emerald-700 font-semibold text-sm">
            ₹{link.price.toLocaleString()}
          </span>
          <ExternalLink className="w-4 h-4 text-gray-400 transition group-hover:text-emerald-600" />
        </a>
      ))}
    </div>
  )
}
