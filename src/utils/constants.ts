import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export const BRAND_CONFIG: Record<string, { logo?: string; color?: string }> = {
  'the verge': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/The_Verge_logo.svg',
  },
  'techradar': {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/TechRadar_logo_%282023%29.svg',
  },
};


export const socialLinks = [
  {
    name: "Facebook",
    url: "#",
    icon: FaFacebook,
  },
  {
    name: "X",
    url: "#",
    icon: FaTwitter,
  },
  {
    name: "Instagram",
    url: "#",
    icon: FaInstagram,
  },
];

export const reviews = [
  {
    title: 'RedMagic 10S Pro Review: built for hardcore gamers',
    date: 'Jun 20, 2025',
    image:
      'https://images.unsplash.com/photo-1695028644151-1ec92bae9fb0?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Sony Xperia 1 VII Review: excellent hardware, mixed results',
    date: 'Jun 2, 2025',
    image:
      'https://images.unsplash.com/photo-1657732214333-697a115ba263?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Samsung Galaxy S25 Edge Review: slim profile, slimmer battery',
    date: 'May 23, 2025',
    image:
      'https://images.unsplash.com/photo-1721864428861-e4a9e9f9a5ee?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'OnePlus 13 Review: flagship performance at a fraction of the price',
    date: 'May 15, 2025',
    image:
      'https://images.unsplash.com/photo-1628582091924-296b8ec1fffe?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Google Pixel 10 Pro Review: best camera phone of 2025',
    date: 'May 8, 2025',
    image:
      'https://images.unsplash.com/photo-1598522017610-edbea54edd64?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Apple iPhone 17 Pro Max Review: the pinnacle of smartphone design',
    date: 'Apr 29, 2025',
    image:
      'https://images.unsplash.com/photo-1524466302651-a98b8b02c497?auto=format&fit=crop&w=1080&q=80',
  },
];