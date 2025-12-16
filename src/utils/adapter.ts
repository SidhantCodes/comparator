import { Product } from '../data/mockData';
import { ApiPhone, ApiComparePhone } from '../api/types';

// Helper to convert EUR to INR (approximate fixed rate for display)
const convertPrice = (eur: number) => Math.round(eur * 1);

/**
 * Adapts the Search API response to your Product interface
 */
export const adaptApiPhoneToProduct = (apiPhone: ApiPhone): Product => {
  const priceInr = convertPrice(apiPhone.search_specs.price_estimate_eur || 0);
  
  return {
    id: apiPhone._id,
    name: `${apiPhone.model_name}`,
    category: `${apiPhone.brand} Phones`,
    image: `${apiPhone.image}`,
    price: priceInr,
    oldPrice: Math.round(priceInr * 1.1), // Mock old price
    daysAgo: 'Recently',
    beebomScore: Math.round(apiPhone.tech_score),
    rating: 0, // Search API doesn't return user rating, need detail endpoint
    reviews: '0 Ratings',
    highlight: apiPhone.tech_score > 85 ? 'HIGH PERFORMANCE' : 'GOOD VALUE',
    launchDate: apiPhone.search_specs.release_year.toString(),
    retailer: {
      name: 'Global Import',
      logo: '🌍'
    },
    specs: {
      antutu: 'N/A', // Not in search response
      ram: `${apiPhone.search_specs.ram_gb}GB`,
      zoom: 'N/A',
      processor: apiPhone.search_specs.chipset,
      display: `${apiPhone.search_specs.screen_size_inch}" ${apiPhone.search_specs.refresh_rate_hz}Hz`,
      camera: 'See Details',
      battery: `${apiPhone.search_specs.battery_mah}mAh`,
      storage: `${apiPhone.search_specs.storage_gb}GB`
    },
    // We fill detailed specs with placeholders because search API is lightweight
    // The Compare/Detail page will fetch the rich data
    detailedSpecs: {
      processor: { chipset: apiPhone.search_specs.chipset, cpu: 'Octa-core' },
      display: { size: `${apiPhone.search_specs.screen_size_inch}"`, resolution: 'HD+', hdr: 'Supported' },
      battery: { capacity: `${apiPhone.search_specs.battery_mah}mAh`, charging: 'Fast Charging', chargerInBox: 'Region Dependent' },
      camera: { rear: { main: 'Main Sensor', ultraWide: 'Yes', video: '4K' }, front: { sensor: 'Selfie', aperture: 'f/2.0' } },
      ramStorage: { ram: `${apiPhone.search_specs.ram_gb}GB`, storage: `${apiPhone.search_specs.storage_gb}GB`, type: 'UFS' },
      design: { frontProtection: 'Glass', backMaterial: 'Glass/Plastic', ipRating: 'IP53+' },
      os: { version: 'Android/iOS', updates: 'Standard Support' }
    },
    priceComparison: [
      {
        retailer: 'Estimated Market Price',
        price: priceInr,
        logo: '🏷️',
        availability: 'Check Local Retailers',
        url: '#'
      }
    ]
  };
};

/**
 * Adapts the Compare API response to your Product interface
 * This endpoint returns richer data used for Detail and Compare pages
 */
export const adaptComparePhoneToProduct = (apiPhone: ApiComparePhone): Product => {
  // Price isn't strictly in compare object, so we mock or pass it in if available contextually
  // We'll use a placeholder since compare endpoint focuses on specs
  const estimatedPrice = 50000; 

  return {
    id: apiPhone.id,
    name: apiPhone.model,
    category: 'Smartphone',
    price: estimatedPrice,
    image: apiPhone.image,
    beebomScore: Math.round(apiPhone.tech_score),
    rating: apiPhone.ratings.user_score || 0,
    reviews: `${apiPhone.ratings.user_votes} Ratings`,
    highlight: 'Top Spec',
    launchDate: apiPhone.comparison_values.year.toString(),
    retailer: { name: 'Best Deal', logo: '🏷️' },
    specs: {
      antutu: 'High',
      ram: `${apiPhone.comparison_values.ram}GB`,
      zoom: 'See Specs',
      processor: apiPhone.display_text.processor,
      display: `${apiPhone.comparison_values.screen_size}" ${apiPhone.comparison_values.refresh_rate}Hz`,
      camera: apiPhone.display_text.camera,
      battery: apiPhone.display_text.battery,
      storage: `${apiPhone.comparison_values.storage}GB`
    },
    detailedSpecs: {
      processor: { 
        chipset: apiPhone.display_text.processor, 
        cpu: 'See manufacturer site' 
      },
      display: { 
        size: `${apiPhone.comparison_values.screen_size}"`, 
        resolution: apiPhone.display_text.display || 'High Res', 
        hdr: 'Yes' 
      },
      battery: { 
        capacity: apiPhone.display_text.battery, 
        charging: 'Supported', 
        chargerInBox: 'Check box' 
      },
      camera: { 
        rear: { 
          main: apiPhone.display_text.camera.split(',')[0] || 'Main', 
          ultraWide: 'Included', 
          video: '4K' 
        }, 
        front: { sensor: 'Included', aperture: 'f/2.2' } 
      },
      ramStorage: { 
        ram: `${apiPhone.comparison_values.ram}GB`, 
        storage: `${apiPhone.comparison_values.storage}GB`, 
        type: 'Standard' 
      },
      design: { frontProtection: 'Glass', backMaterial: 'Premium', ipRating: 'Standard' },
      os: { version: 'Latest', updates: 'Supported' }
    },
    priceComparison: [
        {
          retailer: 'Market Estimate',
          price: estimatedPrice,
          logo: '🏷️',
          availability: 'Check Availability',
          url: '#'
        }
    ]
  };
};