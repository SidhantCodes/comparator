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
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Moto G35 5G',
    category: 'Motorola Phones',
    price: 9999,
    oldPrice: 8999,
    daysAgo: '28 days',
    beebomScore: 95,
    rating: 4.2,
    reviews: '106.6K Ratings',
    highlight: 'GAMING WITH GREAT CAMERA',
    launchDate: '10 Dec 2024',
    retailer: {
      name: 'Flipkart',
      logo: '🛒'
    },
    specs: {
      antutu: '472,470',
      ram: 'LPDDR4X',
      zoom: '2-10X',
      processor: 'Unisoc T760 | Android 14 (Motorola MyUx) | 1 year(s) of OS Update',
      display: '6.72" | FHD+ LCD | 120Hz',
      camera: '50MP (Wide-angle) | 8MP (Ultra-wide) | 16MP (Front)',
      battery: '5000mAh | 18Watt | Charger in the box',
      storage: '4GB (LPDDR4X) | 128GB'
    },
    detailedSpecs: {
      processor: {
        chipset: 'Unisoc T760',
        cpu: 'Mali-G57 MC4'
      },
      display: {
        size: '6.72" (120Hz)',
        resolution: 'FHD+ LCD',
        hdr: 'HDR10'
      },
      battery: {
        capacity: '5000mAh (Lithium Polymer)',
        charging: '18Watt (wired)',
        chargerInBox: 'Charger in the box'
      },
      camera: {
        rear: {
          main: '50MP (Wide-angle)',
          ultraWide: '8MP (Ultra-wide)',
          video: '4K@30fps'
        },
        front: {
          sensor: '16MP (Wide)',
          aperture: '1080@30fps'
        }
      },
      ramStorage: {
        ram: '4GB (LPDDR4X)',
        storage: '128GB (UFS 2.2)',
        type: 'LPDDR4X'
      },
      design: {
        frontProtection: 'Gorilla Glass 3 (Front)',
        backMaterial: 'Vegan Leather (Back), Plastic Frame (Side)',
        ipRating: 'IP52 (Dust and Splash Resistant)'
      },
      os: {
        version: 'Android (Motorola MyUx)',
        updates: '1 year(s) of OS Update'
      }
    },
    priceComparison: [
      {
        retailer: 'Flipkart',
        price: 9999,
        logo: '🛒',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Amazon',
        price: 10299,
        logo: '📦',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Motorola Official Store',
        price: 10499,
        logo: '🏪',
        availability: 'In Stock',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    name: 'Redmi A4 5G',
    category: 'Xiaomi Phones',
    price: 7949,
    oldPrice: 7499,
    daysAgo: '16 days',
    beebomScore: 93,
    rating: 4.3,
    reviews: '11.5K Ratings',
    highlight: 'RECOMMENDED FOR CLEAN EXPERIENCE',
    launchDate: '20 Nov 2024',
    retailer: {
      name: 'Flipkart',
      logo: '🛒'
    },
    specs: {
      antutu: '398,250',
      ram: 'LPDDR4X',
      zoom: '2-10X',
      processor: 'Qualcomm Snapdragon 4s Gen 2 | Android 14 (Xiaomi HyperOS) | 2 year(s) of OS Update',
      display: '6.88" | HD+ LCD | 120Hz',
      camera: '50MP (Wide-angle) | 8MP (Front)',
      battery: '5160mAh | 18Watt | Charger in the box',
      storage: '4GB (LPDDR4X) | 128GB'
    },
    detailedSpecs: {
      processor: {
        chipset: 'Qualcomm Snapdragon 4s Gen 2',
        cpu: 'Adreno 619'
      },
      display: {
        size: '6.88" (120Hz)',
        resolution: 'HD+ LCD',
        hdr: 'No HDR'
      },
      battery: {
        capacity: '5160mAh (Lithium Polymer)',
        charging: '18Watt (wired)',
        chargerInBox: 'Charger in the box'
      },
      camera: {
        rear: {
          main: '50MP (Wide-angle)',
          ultraWide: 'N/A',
          video: '1080p@30fps'
        },
        front: {
          sensor: '8MP (Wide)',
          aperture: '1080@30fps'
        }
      },
      ramStorage: {
        ram: '4GB (LPDDR4X)',
        storage: '128GB (UFS 2.2)',
        type: 'LPDDR4X'
      },
      design: {
        frontProtection: 'Glass (Front)',
        backMaterial: 'Plastic Frame (Side)',
        ipRating: 'IP52 (Dust and Splash Resistant)'
      },
      os: {
        version: 'Android (Xiaomi HyperOS)',
        updates: '2 year(s) of OS Update'
      }
    },
    priceComparison: [
      {
        retailer: 'Flipkart',
        price: 7949,
        logo: '🛒',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Amazon',
        price: 8199,
        logo: '📦',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Mi Store',
        price: 8299,
        logo: '🏪',
        availability: 'In Stock',
        url: '#'
      }
    ]
  },
  {
    id: '3',
    name: 'Samsung Galaxy M35 5G',
    category: 'Samsung Phones',
    price: 15999,
    oldPrice: 17999,
    daysAgo: '45 days',
    beebomScore: 92,
    rating: 4.4,
    reviews: '89.2K Ratings',
    highlight: 'BEST DISPLAY IN SEGMENT',
    launchDate: '15 Aug 2024',
    retailer: {
      name: 'Amazon',
      logo: '📦'
    },
    specs: {
      antutu: '512,890',
      ram: 'LPDDR4X',
      zoom: '2-10X',
      processor: 'Samsung Exynos 1380 | Android 14 (One UI 6) | 4 year(s) of OS Update',
      display: '6.6" | FHD+ Super AMOLED | 120Hz',
      camera: '50MP (Wide) | 8MP (Ultra-wide) | 5MP (Macro) | 13MP (Front)',
      battery: '6000mAh | 25Watt | Charger NOT in the box',
      storage: '6GB (LPDDR4X) | 128GB'
    },
    detailedSpecs: {
      processor: {
        chipset: 'Samsung Exynos 1380',
        cpu: 'Mali-G68 MP5'
      },
      display: {
        size: '6.6" (120Hz)',
        resolution: 'FHD+ Super AMOLED',
        hdr: 'HDR10+'
      },
      battery: {
        capacity: '6000mAh (Lithium Ion)',
        charging: '25Watt (wired)',
        chargerInBox: 'NO Charger in the box'
      },
      camera: {
        rear: {
          main: '50MP (Wide-angle)',
          ultraWide: '8MP (Ultra-wide) | 5MP (Macro)',
          video: '4K@30fps'
        },
        front: {
          sensor: '13MP (Wide)',
          aperture: '1080@30fps'
        }
      },
      ramStorage: {
        ram: '6GB (LPDDR4X)',
        storage: '128GB (UFS 2.2)',
        type: 'LPDDR4X'
      },
      design: {
        frontProtection: 'Gorilla Glass Victus+ (Front)',
        backMaterial: 'Plastic (Back), Plastic Frame (Side)',
        ipRating: 'IP67 (Dust and Water Resistant)'
      },
      os: {
        version: 'Android (One UI 6)',
        updates: '4 year(s) of OS Update'
      }
    },
    priceComparison: [
      {
        retailer: 'Amazon',
        price: 15999,
        logo: '📦',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Flipkart',
        price: 16299,
        logo: '🛒',
        availability: 'In Stock',
        url: '#'
      },
      {
        retailer: 'Samsung Store',
        price: 16999,
        logo: '🏪',
        availability: 'In Stock',
        url: '#'
      }
    ]
  }
];

export function getProductListings(): Product[] {
  return mockProducts;
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id);
}

export function getProductsByIds(ids: string[]): Product[] {
  return mockProducts.filter(p => ids.includes(p.id));
}
