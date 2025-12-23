export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  daysAgo?: string;
  beebomScore: number;
  rating: number;
  reviews: string;
  highlight: string;
  launchDate: string;
  retailer: {
    name: string;
    logo: string;
  };
  image?: string
  specs: {
    antutu: string;
    ram: string;
    zoom: string;
    processor: string;
    display: string;
    camera: string;
    battery: string;
    storage: string;
  };
  detailedSpecs: {
    processor: {
      chipset: string;
      cpu: string;
    };
    display: {
      size: string;
      resolution: string;
      hdr: string;
    };
    battery: {
      capacity: string;
      charging: string;
      chargerInBox: string;
    };
    camera: {
      rear: {
        main: string;
        ultraWide: string;
        video: string;
      };
      front: {
        sensor: string;
        aperture: string;
      };
    };
    ramStorage: {
      ram: string;
      storage: string;
      type: string;
    };
    design: {
      frontProtection: string;
      backMaterial: string;
      ipRating: string;
    };
    os: {
      version: string;
      updates: string;
    };
  };
  priceComparison: Array<{
    retailer: string;
    price: number;
    logo: string;
    availability: string;
    url: string;
  }>;
  expertData?: {
    averageScore: number;
    count: number;
    sources: Array<{
      name: string;
      score: number; // Normalized to 5-star scale for UI
      originalScore: number;
      url: string;
    }>;
  };
}
