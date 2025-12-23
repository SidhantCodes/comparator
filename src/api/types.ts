export type DeviceCategory = 'phone' | 'watch' | 'tablet';

export interface ApiPhoneSearchSpec {
  ram_gb: number;
  storage_gb: number;
  battery_mah: number;
  screen_size_inch: number;
  refresh_rate_hz: number;
  release_year: number;
  has_5g: boolean;
  price_inr: number;
  chipset: string;
}

export interface AffiliateLinks {
  amazon?: string;
  flipkart?: string;
}

export interface ApiPhone {
  _id: string;
  brand: string;
  url: string;
  model_name: string;
  image: string;
  search_specs: ApiPhoneSearchSpec;
  tech_score: number;
  specs?: Record<string, any>; 
  affiliate_links?: AffiliateLinks;
  category: DeviceCategory;
}

export interface ApiSearchResponse {
  page: number;
  limit: number;
  total: number;
  data: ApiPhone[];
}

export interface ApiComparePhone {
  id: string;
  model: string;
  image: string;
  tech_score: number;
  price_inr?: number;
  ratings: {
    expert_score: string | number;
    user_score: number;
    user_votes: number;
  };
  comparison_values: {
    ram: number;
    storage: number;
    battery: number;
    refresh_rate: number;
    screen_size: number;
    year: number;
  };
  display_text: {
    memory: string;
    camera: string;
    battery: string;
    processor: string;
    display?: string;
  };
}

export interface ApiCompareResponse {
  winner_model: string;
  phones: ApiComparePhone[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export interface UserProfile {
  email: string;
  role: string;
}
