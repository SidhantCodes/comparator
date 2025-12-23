"use client"

import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Plus, Search } from "lucide-react"

import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ComparisonTable, type ComparisonCategory } from "./ComparisonTable"

import { endpoints } from "../api/client"
import { adaptApiPhoneToProduct } from "../utils/adapter"
import type { Product } from "../data/mockData"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { Button } from "./ui/button"

import { FeaturedProductCard } from "./FeaturedProductCard"
export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const query = searchParams.get("q") || ""
  const priceMax = Number(searchParams.get("price")) || 0

  /* ----------------------------- State ----------------------------- */
  const [directory, setDirectory] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  /* ----------------------------- Fetch ----------------------------- */
  useEffect(() => {
  let mounted = true;
  const fetchData = async () => {
    setLoading(true);
    try {
      // Since we don't know the category of the user's query yet,
      // we might need to search across categories or default to phones.
      // For this implementation, we fetch phones first. 
      const response = await endpoints.searchAll(1, 200);
      const adapted = response.data.data.map(adaptApiPhoneToProduct);
      
      if (!mounted) return;
      setDirectory(adapted);

      const filtered = adapted.filter((p:any) => {
        const matchesQuery = query ? p.name.toLowerCase().includes(query.toLowerCase()) : true;
        const matchesPrice = priceMax > 0 ? p.price <= priceMax : true;
        return matchesQuery && matchesPrice;
      });

      setDisplayedProducts(filtered);

      if (filtered.length > 0) {
        const mainProduct = filtered[0];
        
        // IMPORTANT: Filter competitors based on the SAME category as the main product
        const competitors = adapted.filter((p: any) => 
          p.id !== mainProduct.id && 
          p.category === mainProduct.category && // Category Match Constraint
          p.price >= mainProduct.price - 20000 && 
          p.price <= mainProduct.price + 5000
        ).slice(0, 3);

        setComparisonProducts([mainProduct, ...competitors]);
      }
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      if (mounted) setLoading(false);
    }
  };
  fetchData();
  return () => { mounted = false; };
}, [query, priceMax]);

  /* ---------------------- Click Outside Dropdown ---------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ----------------------------- Derived ----------------------------- */
  const mainProduct = displayedProducts[0]

  const filteredSuggestions = directory
    .filter((p) => !comparisonProducts.some((cp) => cp.id === p.id))
    .filter((p) => p.name.toLowerCase().includes(searchInput.toLowerCase()))

  /* ----------------------------- Handlers ----------------------------- */
  const handleAddProduct = (product: Product) => {
    if (comparisonProducts.length < 5) {
      setComparisonProducts((prev) => [...prev, product])
      setSearchInput("")
      setShowDropdown(false)
    }
  }

  const handleRemoveProduct = (id: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== id))
  }

  /* -------------------------- Comparison Rows ------------------------- */
  const comparisonCategories: ComparisonCategory[] = [
    {
      title: "Performance",
      rows: [
        {
          label: "Chipset",
          getValue: (p: Product) => p.detailedSpecs.processor.chipset,
        },
        {
          label: "CPU",
          getValue: (p: Product) => p.detailedSpecs.processor.cpu,
        },
        {
          label: "AnTuTu Score",
          getValue: (p: Product) => p.specs.antutu,
        },
        {
          label: "RAM",
          getValue: (p: Product) => p.specs.ram,
        },
        {
          label: "Storage",
          getValue: (p: Product) => p.specs.storage,
        },
      ],
    },

    {
      title: "Display",
      rows: [
        {
          label: "Screen Size",
          getValue: (p: Product) => p.detailedSpecs.display.size,
        },
        {
          label: "Resolution",
          getValue: (p: Product) => p.detailedSpecs.display.resolution,
        },
        {
          label: "Refresh Rate",
          getValue: (p: Product) => (p.specs.display.includes("Hz") ? p.specs.display.split(" ").pop() || "-" : "-"),
        },
        {
          label: "HDR Support",
          getValue: (p: Product) => p.detailedSpecs.display.hdr,
        },
      ],
    },

    {
      title: "Camera",
      rows: [
        {
          label: "Rear Camera",
          getValue: (p: Product) => p.detailedSpecs.camera.rear.main.split("\n")[0],
        },
        {
          label: "Ultrawide Camera",
          getValue: (p: Product) => p.detailedSpecs.camera.rear.ultraWide,
        },
        {
          label: "Video Recording",
          getValue: (p: Product) => p.detailedSpecs.camera.rear.video,
        },
        {
          label: "Front Camera",
          getValue: (p: Product) => p.detailedSpecs.camera.front.sensor,
        },
      ],
    },

    {
      title: "Battery & Charging",
      rows: [
        {
          label: "Battery Capacity",
          getValue: (p: Product) => p.specs.battery,
        },
        {
          label: "Charging",
          getValue: (p: Product) => p.detailedSpecs.battery.charging,
        },
        {
          label: "Charger in Box",
          getValue: (p: Product) => p.detailedSpecs.battery.chargerInBox,
        },
      ],
    },

    {
      title: "Design & Software",
      rows: [
        {
          label: "Build Material",
          getValue: (p: Product) => p.detailedSpecs.design.backMaterial || "-",
        },
        {
          label: "Water / Dust Resistance",
          getValue: (p: Product) => p.detailedSpecs.design.ipRating,
        },
        {
          label: "Operating System",
          getValue: (p: Product) => p.detailedSpecs.os.version,
        },
      ],
    },
    
    {
      title: "Pricing",
      rows: [
        {
          label: "Estimated Price",
          getValue: (p: Product) => `₹${p.price.toLocaleString()}`,
        },
        {
          label: "Retailer",
          getValue: (p: Product) => p.retailer.name,
        },
      ],
    },
    {
      title: "", // Empty title so it looks like a footer action
      rows: [
        {
          label: "Full Details",
          getValue: (p: Product) => (
            <Button
              variant="link"
              onClick={() => navigate(`/product/${p.id}`)}
              className="cursor-pointer border border-black rounded-lg hover:bg-emerald-700 hover:text-white transition-all duration-200 ease-out"
              // className="w-full py-2 px-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-sm"
            >
              View Full Specs
            </Button>
          ),
        },
      ],
    },
  ]

  /* ----------------------------- States ----------------------------- */
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  if (!mainProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl font-bold mb-2">
            No products found
            {query && ` for "${query}"`}
          </h2>
          {priceMax > 0 && <p className="text-gray-500 mb-4">Under ₹{priceMax.toLocaleString()}</p>}
          <button onClick={() => navigate("/")} className="text-emerald-600 underline">
            Go Home
          </button>
        </div>
      </div>
    )
  }
  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Search</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{query || "All Products"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold mt-2">{query ? `"${query}"` : "All Products"}</h1>
        </div>

        {/* Featured Product - Updated UI */}
        <FeaturedProductCard product={mainProduct} />

        {/* Comparison Tool */}
        <div>
          <div className="flex justify-between items-center mb-4 gap-2">
            <div>
              <h2 className="text-sm sm:text-xl font-medium mr-1">Compare with Similar Products</h2>
              <h5 className="hidden md:block text-gray-700 text-sm">
                Side-by-side comparison of specifications and pricing
              </h5>
            </div>

            {/* CHANGE: Added z-30 here */}
            <div className="relative z-30 max-w-lg flex items-center border rounded-lg px-2" ref={searchContainerRef}>
              <Search className="text-gray-400 h-5 w-5" />
              <input
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Add phone to compare"
                className="w-full rounded-lg px-4 py-2 placeholder:text-gray-400 focus:outline-none"
              />

              {showDropdown && searchInput && (
                /* CHANGE: Removed z-100 and z-20, added z-50 */
                <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-auto">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleAddProduct(p)}
                        className="w-full text-left p-3 hover:bg-emerald-50 flex gap-3"
                      >
                        <ImageWithFallback src={p.image || ""} alt={p.name} className="w-8 h-10 object-contain" />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-500">₹{p.price.toLocaleString()}</div>
                        </div>
                        <Plus className="ml-auto text-emerald-600 w-4 h-4" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No phones found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <ComparisonTable
            products={comparisonProducts}
            categories={comparisonCategories}
            onRemoveProduct={handleRemoveProduct}
          />
        </div>
      </div>
    </div>
  )
}
