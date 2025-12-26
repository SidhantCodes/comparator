"use client"

import { Cpu, Monitor, Camera, Battery, HardDrive } from "lucide-react"
import type { Product } from "../data/mockData"

/* ------------------------------------------------------------------ */
/* Quick Specs                                                        */
/* ------------------------------------------------------------------ */
type QuickSpecsProps = {
  product: Product
}

export function QuickSpecs({ product }: QuickSpecsProps) {
  const displaySize =
    product.detailedSpecs.display.size.split(" ")[0]

  const displayResolution =
    `${product.detailedSpecs.display.resolution.split("pixels")[0]}p`

  const rearCameraMP =
    product.detailedSpecs.camera.rear.main?.match(/(\d+)\s*MP/i)?.[1] ?? "N/A"

  const batteryCapacity =
    product.detailedSpecs.battery.capacity.match(/(\d+)\s*mAh/)?.[1] ?? "N/A"

  const chargingWattage = (() => {
    const watts = product.detailedSpecs.battery.charging?.match(/\d+(?=W)/gi)
    return watts ? `${Math.max(...watts.map(Number))}W` : "N/A"
  })()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      <Spec icon={<Monitor />} label="Display">
        {displaySize}"
        <div className="text-sm text-white/60">{displayResolution}</div>
      </Spec>

      <Spec icon={<Camera />} label="Main Camera">
        {rearCameraMP} MP
      </Spec>

      <Spec icon={<Battery />} label="Battery">
        {batteryCapacity} mAh
        <div className="text-sm text-white/60">{chargingWattage}</div>
      </Spec>

      <Spec icon={<HardDrive />} label="RAM">
        {product.detailedSpecs.ramStorage.ram}
      </Spec>

      <Spec icon={<Cpu />} label="Storage">
        {product.detailedSpecs.ramStorage.storage}
      </Spec>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Spec Card (private to QuickSpecs)                                  */
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
    <div
      className="
        flex flex-col items-center text-center
        sm:flex-row sm:items-start sm:text-left
        gap-2
        border border-white/30 rounded-lg
        p-3 bg-white/5
        min-h-[88px]
      "
    >
      {/* Icon */}
      <div className="text-white w-6 h-6 flex-shrink-0">
        {icon}
      </div>

      {/* Text */}
      <div>
        <div className="text-xs text-white/80 mb-1">
          {label}
        </div>
        <div className="text-sm text-white font-medium leading-tight">
          {children}
        </div>
      </div>
    </div>
  )
}

