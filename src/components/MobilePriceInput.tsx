type MobilePriceInputProps = {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
}

export function MobilePriceInput({
  value,
  min = 5000,
  max = 300000,
  step = 5000,
  onChange,
}: MobilePriceInputProps) {
  const increment = () => onChange(Math.min(max, value + step))
  const decrement = () => onChange(Math.max(min, value - step))

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`
    return `₹${(price / 1000).toFixed(0)}K`
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <label className="block text-gray-500 text-xs uppercase tracking-wide mb-3">
        Max Price
      </label>

      <div className="flex items-center gap-3">
        {/* Decrement */}
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease price"
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-lg
            bg-gray-100
            text-gray-600
            text-2xl
            disabled:opacity-30
            disabled:cursor-not-allowed
            active:bg-gray-200
          "
        >
          −
        </button>

        {/* Price Display (non-editable) */}
        <div
          className="
            flex-1
            h-12
            flex items-center justify-center
            rounded-lg
            border border-gray-300
            bg-gray-50
            text-emerald-600
            font-bold
            text-lg
            select-none
          "
          aria-live="polite"
        >
          {formatPrice(value)}
        </div>

        {/* Increment */}
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase price"
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-lg
            bg-gray-100
            text-gray-600
            text-2xl
            disabled:opacity-30
            disabled:cursor-not-allowed
            active:bg-gray-200
          "
        >
          +
        </button>
      </div>
    </div>
  )
}
