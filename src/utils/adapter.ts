import { Product } from '../data/mockData';
import { ApiPhone, ApiComparePhone } from '../api/types';
import { normalizeToFiveStars, processExpertView } from './expertReviewUtils';

/**
 * Extract INR price from misc.price if available, fallback to EUR estimate
 */
const getPriceInInr = (
  apiPhone: ApiPhone
): number | 'unavailable' => {
  const price = apiPhone.search_specs?.price_inr;

  if (typeof price === 'number' && price > 0) {
    return price;
  }

  return 'unavailable';
};

/**
 * Extract Antutu score safely
 */
const extractAntutu = (apiPhone: ApiPhone): string => {
  const perf = apiPhone.specs?.['our tests']?.performance;
  if (!perf) return 'N/A';

  const match = perf.match(/AnTuTu:\s([\d]+)/i);
  return match ? match[1] : 'N/A';
};

/**
 * Extract IP rating from body notes
 */
const extractIpRating = (apiPhone: ApiPhone): string => {
  const bodyNotes = apiPhone.specs?.body?.[''];
  if (!bodyNotes) return 'No official rating';

  const match = bodyNotes.match(/IP\d+[A-Z]*/i);
  return match ? match[0] : 'No official rating';
};

/**
 * Extract main rear camera string
 */
const extractMainCamera = (apiPhone: ApiPhone): string => {
  return (
    apiPhone.specs?.['main camera']?.triple ||
    apiPhone.specs?.['main camera']?.dual ||
    'Camera details unavailable'
  );
};

/**
 * ================================
 * SEARCH → PRODUCT ADAPTER
 * ================================
 */
export const adaptApiPhoneToProduct = (apiPhone: ApiPhone): Product => {
  const priceResult = getPriceInInr(apiPhone);
  const price = typeof priceResult === 'number' ? priceResult : 0;
  const antutu = extractAntutu(apiPhone);
  const mainCamera = extractMainCamera(apiPhone);

  const priceComparison = [];
  
  if (apiPhone.affiliate_links?.amazon) {
    priceComparison.push({
      retailer: 'Amazon',
      price: price,
      logo: 'https://www.google.com/s2/favicons?domain=amazon.in&sz=128',
      availability: 'In Stock',
      url: apiPhone.affiliate_links.amazon
    });
  }

  if (apiPhone.affiliate_links?.flipkart) {
    priceComparison.push({
      retailer: 'Flipkart',
      price: price,
      logo: 'https://www.google.com/s2/favicons?domain=flipkart.com&sz=128',
      availability: 'In Stock',
      url: apiPhone.affiliate_links.flipkart
    });
  }

  if (priceComparison.length === 0) {
    priceComparison.push({
      retailer: 'Market Price',
      price: price,
      logo: '🏷️',
      availability: 'Check Local',
      url: apiPhone.url
    });
  }

  const expertData = processExpertView(apiPhone.expert_view)

  return {
    id: apiPhone._id,
    name: apiPhone.model_name,
    category: apiPhone.category,
    image: apiPhone.image,
    price,
    oldPrice: Math.round(price * 1.1),

    daysAgo: apiPhone.specs?.launch?.status || 'Recently',
    beebomScore: Math.round(apiPhone.tech_score),

    rating: expertData ? expertData.averageScore : 0, 
    reviews: expertData ? `${expertData.count} Expert Reviews` : 'No reviews yet',
    

    highlight:
      apiPhone.tech_score >= 92
        ? 'FLAGSHIP'
        : apiPhone.tech_score >= 85
        ? 'HIGH PERFORMANCE'
        : 'GOOD VALUE',

    launchDate: apiPhone.search_specs.release_year.toString(),

    retailer: {
      name: priceComparison[0].retailer,
      logo: priceComparison[0].logo
    },

    specs: {
      antutu,
      ram: `${apiPhone.search_specs.ram_gb}GB`,
      zoom: mainCamera.toLowerCase().includes('telephoto')
        ? 'Optical Zoom'
        : 'Standard',
      processor: apiPhone.search_specs.chipset,
      display: `${apiPhone.search_specs.screen_size_inch}" ${apiPhone.search_specs.refresh_rate_hz}Hz`,
      camera: mainCamera.split('\n')[0],
      battery: `${apiPhone.search_specs.battery_mah}mAh`,
      storage: `${apiPhone.search_specs.storage_gb}GB`
    },

    detailedSpecs: {
      processor: {
        chipset: apiPhone.search_specs.chipset,
        cpu: apiPhone.specs?.platform?.cpu || 'Octa-core'
      },

      display: {
        size: apiPhone.specs?.display?.size || '',
        resolution: apiPhone.specs?.display?.resolution || '',
        hdr: apiPhone.specs?.display?.type?.includes('HDR') ? 'Yes' : 'No'
      },

      battery: {
        capacity: apiPhone.specs?.battery?.type || '',
        charging: apiPhone.specs?.battery?.charging || 'Standard charging',
        chargerInBox: 'Region dependent'
      },

      camera: {
        rear: {
          main: mainCamera,
          ultraWide: mainCamera.toLowerCase().includes('ultrawide')
            ? 'Yes'
            : 'No',
          video: apiPhone.specs?.['main camera']?.video || 'Standard'
        },
        front: {
          sensor: apiPhone.specs?.['selfie camera']?.single || '',
          aperture: 'Refer manufacturer specs'
        }
      },

      ramStorage: {
        ram: `${apiPhone.search_specs.ram_gb}GB`,
        storage: `${apiPhone.search_specs.storage_gb}GB`,
        type: apiPhone.specs?.memory?.[''] || 'UFS'
      },

      design: {
        frontProtection: apiPhone.specs?.display?.protection || 'Glass',
        backMaterial: apiPhone.specs?.body?.build || '',
        ipRating: extractIpRating(apiPhone)
      },

      os: {
        version: apiPhone.specs?.platform?.os || 'Android',
        updates: apiPhone.specs?.platform?.os?.includes('up to')
          ? 'Long-term support'
          : 'Standard support'
      }
    },

    priceComparison,
    
    expertData,
  };
};

/**
 * ================================
 * COMPARE → PRODUCT ADAPTER
 * ================================
 * (Compare endpoint already normalized, so minimal mocking)
 */
export const adaptComparePhoneToProduct = (
  apiPhone: ApiComparePhone
): Product => {
  const price = apiPhone.price_inr || 0; 
  const rating = normalizeToFiveStars(Number(apiPhone.ratings.expert_score || apiPhone.ratings.user_score));
  return {
    id: apiPhone.id,
    name: apiPhone.model,
    category: 'Smartphone',
    image: apiPhone.image,

    price: price,
    oldPrice: price > 0 ? Math.round(price * 1.1) : 0,

    beebomScore: Math.round(apiPhone.tech_score),
    rating: rating,
    reviews: `${apiPhone.ratings.user_votes || 0} Ratings`,

    highlight: 'TOP SPEC',
    launchDate: apiPhone.comparison_values.year.toString(),

    retailer: {
      name: 'Market Estimate',
      logo: '🏷️'
    },

    specs: {
      antutu: 'High',
      ram: `${apiPhone.comparison_values.ram}GB`,
      zoom: 'See specs',
      processor: apiPhone.display_text.processor,
      display: `${apiPhone.comparison_values.screen_size}" ${apiPhone.comparison_values.refresh_rate}Hz`,
      camera: apiPhone.display_text.camera,
      battery: apiPhone.display_text.battery,
      storage: `${apiPhone.comparison_values.storage}GB`
    },

    detailedSpecs: {
      processor: {
        chipset: apiPhone.display_text.processor,
        cpu: 'Refer manufacturer'
      },
      display: {
        size: `${apiPhone.comparison_values.screen_size}"`,
        resolution: apiPhone.display_text.display || '',
        hdr: 'Yes'
      },
      battery: {
        capacity: apiPhone.display_text.battery,
        charging: 'Supported',
        chargerInBox: 'Check retail box'
      },
      camera: {
        rear: {
          main: apiPhone.display_text.camera.split(',')[0],
          ultraWide: 'Included',
          video: '4K'
        },
        front: {
          sensor: 'Included',
          aperture: 'Refer specs'
        }
      },
      ramStorage: {
        ram: `${apiPhone.comparison_values.ram}GB`,
        storage: `${apiPhone.comparison_values.storage}GB`,
        type: 'UFS'
      },
      design: {
        frontProtection: 'Glass',
        backMaterial: 'Premium',
        ipRating: 'Standard'
      },
      os: {
        version: 'Latest Android',
        updates: 'Supported'
      }
    },

    priceComparison: [
      {
        retailer: 'Market Estimate',
        price: price,
        logo: '🏷️',
        availability: 'Check availability',
        url: '#'
      }
    ]
  };
};
