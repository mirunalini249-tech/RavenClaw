/**
 * Comprehensive Goods & Goods Types (Categories & Handling Specs)
 * Formulated for modern Indian enterprise warehousing (Flipkart, Delhivery, Reliance Retail, Blinkit)
 */

export interface GoodsTypeInfo {
  id: string;
  name: string;
  code: string;
  handlingRequirement: 'Standard' | 'Fragile / Cushioning' | 'Cold-Chain / Dry' | 'Heavy / Forklift' | 'ESD-Protected' | 'Chemical / Leak-Proof' | 'High-Value Secure';
  storageZoneRecommendation: 'Zone_A' | 'Zone_B' | 'Zone_C';
  description: string;
  typicalVelocity: 'High' | 'Medium' | 'Low';
  pastelBadge: {
    bg: string;
    text: string;
    border: string;
    dotColor: string;
  };
  sampleGoods: {
    productName: string;
    suggestedIdPrefix: string;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    dailyDemand: number;
    pickFrequency: number;
    currentLocation: string;
  };
}

export const GOODS_TYPES_CATALOG: GoodsTypeInfo[] = [
  {
    id: 'electronics',
    name: 'Consumer Electronics',
    code: 'ELEC',
    handlingRequirement: 'ESD-Protected',
    storageZoneRecommendation: 'Zone_A',
    typicalVelocity: 'High',
    description: 'High-value portable devices, noise-cancelling earbuds, smart wearables, and fast chargers.',
    pastelBadge: {
      bg: 'bg-[#F0F9FF]',
      text: 'text-[#0369A1]',
      border: 'border-[#BAE6FD]',
      dotColor: '#0EA5E9'
    },
    sampleGoods: {
      productName: 'boAt Airdopes 141 ANC Earbuds',
      suggestedIdPrefix: 'ELC',
      lengthCm: 14,
      widthCm: 10,
      heightCm: 5,
      dailyDemand: 350,
      pickFrequency: 130,
      currentLocation: 'C01'
    }
  },
  {
    id: 'grocery',
    name: 'Grocery & Staples',
    code: 'GROC',
    handlingRequirement: 'Heavy / Forklift',
    storageZoneRecommendation: 'Zone_A',
    typicalVelocity: 'High',
    description: 'Daily food essentials, whole wheat flour (atta), refined sunflower oil, rice bags, and tea.',
    pastelBadge: {
      bg: 'bg-[#ECFDF5]',
      text: 'text-[#047857]',
      border: 'border-[#A7F3D0]',
      dotColor: '#10B981'
    },
    sampleGoods: {
      productName: 'Aashirvaad Shudh Chakki Atta 5kg',
      suggestedIdPrefix: 'GRC',
      lengthCm: 42,
      widthCm: 28,
      heightCm: 14,
      dailyDemand: 280,
      pickFrequency: 110,
      currentLocation: 'B01'
    }
  },
  {
    id: 'fmcg',
    name: 'FMCG & Confectionery',
    code: 'FMCG',
    handlingRequirement: 'Standard',
    storageZoneRecommendation: 'Zone_A',
    typicalVelocity: 'High',
    description: 'Packaged snacks, 2-minute noodles, biscuits, chocolates, and festive gift packs.',
    pastelBadge: {
      bg: 'bg-[#FEFCE8]',
      text: 'text-[#A16207]',
      border: 'border-[#FEF08A]',
      dotColor: '#F59E0B'
    },
    sampleGoods: {
      productName: 'Maggi 2-Minute Masala Noodles 24-Pack',
      suggestedIdPrefix: 'FMC',
      lengthCm: 30,
      widthCm: 22,
      heightCm: 14,
      dailyDemand: 450,
      pickFrequency: 175,
      currentLocation: 'C02'
    }
  },
  {
    id: 'pharma',
    name: 'Pharma & Healthcare',
    code: 'PHRM',
    handlingRequirement: 'Cold-Chain / Dry',
    storageZoneRecommendation: 'Zone_A',
    typicalVelocity: 'High',
    description: 'Critical OTC medications, digital thermometers, multivitamin supplements, and first-aid kits.',
    pastelBadge: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#15803D]',
      border: 'border-[#BBF7D0]',
      dotColor: '#22C55E'
    },
    sampleGoods: {
      productName: 'Digital Infrared Forehead Thermometer',
      suggestedIdPrefix: 'MED',
      lengthCm: 18,
      widthCm: 10,
      heightCm: 6,
      dailyDemand: 160,
      pickFrequency: 75,
      currentLocation: 'B02'
    }
  },
  {
    id: 'apparel',
    name: 'Fashion & Apparel',
    code: 'APRL',
    handlingRequirement: 'Standard',
    storageZoneRecommendation: 'Zone_B',
    typicalVelocity: 'Medium',
    description: 'Folded ethnic wear, cotton shirts, festive kurtas, denim jeans, and seasonal textiles.',
    pastelBadge: {
      bg: 'bg-[#F5F3FF]',
      text: 'text-[#6D28D9]',
      border: 'border-[#DDD6FE]',
      dotColor: '#8B5CF6'
    },
    sampleGoods: {
      productName: 'Manyavar Festive Silk Kurta Set',
      suggestedIdPrefix: 'FSH',
      lengthCm: 35,
      widthCm: 25,
      heightCm: 6,
      dailyDemand: 180,
      pickFrequency: 80,
      currentLocation: 'C01'
    }
  },
  {
    id: 'footwear',
    name: 'Footwear & Athletic Shoes',
    code: 'FOOT',
    handlingRequirement: 'Standard',
    storageZoneRecommendation: 'Zone_B',
    typicalVelocity: 'Medium',
    description: 'Rigid shoe boxes, running shoes, genuine leather formals, sneakers, and sports sandals.',
    pastelBadge: {
      bg: 'bg-[#FFF7ED]',
      text: 'text-[#C2410C]',
      border: 'border-[#FFEDD5]',
      dotColor: '#F97316'
    },
    sampleGoods: {
      productName: 'Campus Active Running Shoes Box',
      suggestedIdPrefix: 'SHS',
      lengthCm: 34,
      widthCm: 22,
      heightCm: 13,
      dailyDemand: 140,
      pickFrequency: 65,
      currentLocation: 'B02'
    }
  },
  {
    id: 'personal_care',
    name: 'Personal Care & Beauty',
    code: 'BEAU',
    handlingRequirement: 'Chemical / Leak-Proof',
    storageZoneRecommendation: 'Zone_B',
    typicalVelocity: 'Medium',
    description: 'Germ-protection liquid washes, cosmetic glamour kits, hair serums, and skincare bottles.',
    pastelBadge: {
      bg: 'bg-[#FDF2F8]',
      text: 'text-[#BE185D]',
      border: 'border-[#FBCFE8]',
      dotColor: '#EC4899'
    },
    sampleGoods: {
      productName: 'Dettol Germ Protection Handwash Refill 900ml',
      suggestedIdPrefix: 'PCR',
      lengthCm: 24,
      widthCm: 14,
      heightCm: 8,
      dailyDemand: 210,
      pickFrequency: 90,
      currentLocation: 'C02'
    }
  },
  {
    id: 'home_kitchen',
    name: 'Home & Kitchen Appliances',
    code: 'HOME',
    handlingRequirement: 'Fragile / Cushioning',
    storageZoneRecommendation: 'Zone_B',
    typicalVelocity: 'Medium',
    description: '750W mixer grinders, compact air purifiers, stainless insulated bottles, and electric kettles.',
    pastelBadge: {
      bg: 'bg-[#EEF2FF]',
      text: 'text-[#4338CA]',
      border: 'border-[#C7D2FE]',
      dotColor: '#6366F1'
    },
    sampleGoods: {
      productName: 'Prestige Iris 750W Mixer Grinder',
      suggestedIdPrefix: 'KIT',
      lengthCm: 40,
      widthCm: 30,
      heightCm: 30,
      dailyDemand: 95,
      pickFrequency: 38,
      currentLocation: 'A01'
    }
  },
  {
    id: 'tools',
    name: 'Industrial Hardware & Tools',
    code: 'TOOL',
    handlingRequirement: 'Heavy / Forklift',
    storageZoneRecommendation: 'Zone_C',
    typicalVelocity: 'Low',
    description: 'Heavy rotary power drills, angle grinders, socket wrench sets, and industrial equipment.',
    pastelBadge: {
      bg: 'bg-[#F1F5F9]',
      text: 'text-[#334155]',
      border: 'border-[#CBD5E1]',
      dotColor: '#64748B'
    },
    sampleGoods: {
      productName: 'Bosch Professional Impact Drill Kit',
      suggestedIdPrefix: 'IND',
      lengthCm: 42,
      widthCm: 28,
      heightCm: 18,
      dailyDemand: 65,
      pickFrequency: 24,
      currentLocation: 'C01'
    }
  },
  {
    id: 'automotive',
    name: 'Automotive Spares & Fluids',
    code: 'AUTO',
    handlingRequirement: 'Chemical / Leak-Proof',
    storageZoneRecommendation: 'Zone_C',
    typicalVelocity: 'Low',
    description: 'Fully synthetic engine oil cans, ceramic brake pad sets, automotive filters, and maintenance fluids.',
    pastelBadge: {
      bg: 'bg-[#FFF1F2]',
      text: 'text-[#BE123C]',
      border: 'border-[#FECDD3]',
      dotColor: '#F43F5E'
    },
    sampleGoods: {
      productName: 'Castrol Edge 5W-40 Synthetic Engine Oil 4L',
      suggestedIdPrefix: 'AUT',
      lengthCm: 30,
      widthCm: 20,
      heightCm: 25,
      dailyDemand: 45,
      pickFrequency: 18,
      currentLocation: 'B01'
    }
  },
  {
    id: 'fragile',
    name: 'Fragile Glassware & Ceramics',
    code: 'GLAS',
    handlingRequirement: 'Fragile / Cushioning',
    storageZoneRecommendation: 'Zone_C',
    typicalVelocity: 'Low',
    description: 'Borosilicate kitchenware, crystal drinking tumblers, bone china dinnerware, and delicate glass.',
    pastelBadge: {
      bg: 'bg-[#F0FDFA]',
      text: 'text-[#0F766E]',
      border: 'border-[#99F6E4]',
      dotColor: '#14B8A6'
    },
    sampleGoods: {
      productName: 'Borosilicate 6-Piece Heat-Resistant Bowl Set',
      suggestedIdPrefix: 'GLS',
      lengthCm: 28,
      widthCm: 28,
      heightCm: 18,
      dailyDemand: 40,
      pickFrequency: 16,
      currentLocation: 'A02'
    }
  },
  {
    id: 'heavy_bulky',
    name: 'Heavy & Bulky Pallets',
    code: 'BULK',
    handlingRequirement: 'Heavy / Forklift',
    storageZoneRecommendation: 'Zone_C',
    typicalVelocity: 'Low',
    description: 'Large commercial appliances, deep freezers, 55-inch smart LED panels, and heavy furniture.',
    pastelBadge: {
      bg: 'bg-[#FAF5FF]',
      text: 'text-[#7E22CE]',
      border: 'border-[#E9D5FF]',
      dotColor: '#A855F7'
    },
    sampleGoods: {
      productName: '55-Inch 4K UHD Commercial Display Panel',
      suggestedIdPrefix: 'BLK',
      lengthCm: 125,
      widthCm: 22,
      heightCm: 75,
      dailyDemand: 20,
      pickFrequency: 8,
      currentLocation: 'A01'
    }
  }
];

export function getGoodsTypeInfo(categoryName?: string): GoodsTypeInfo {
  if (!categoryName) return GOODS_TYPES_CATALOG[0];
  const normalized = categoryName.toLowerCase().trim();
  
  const found = GOODS_TYPES_CATALOG.find((g) => {
    return (
      g.name.toLowerCase() === normalized ||
      g.id.toLowerCase() === normalized ||
      normalized.includes(g.id.toLowerCase()) ||
      g.name.toLowerCase().includes(normalized) ||
      (normalized.includes('electronic') && g.id === 'electronics') ||
      (normalized.includes('groc') && g.id === 'grocery') ||
      (normalized.includes('snack') && g.id === 'fmcg') ||
      (normalized.includes('medic') && g.id === 'pharma') ||
      (normalized.includes('apparel') && g.id === 'apparel') ||
      (normalized.includes('cloth') && g.id === 'apparel') ||
      (normalized.includes('shoe') && g.id === 'footwear') ||
      (normalized.includes('beauty') && g.id === 'personal_care') ||
      (normalized.includes('home') && g.id === 'home_kitchen') ||
      (normalized.includes('tool') && g.id === 'tools') ||
      (normalized.includes('auto') && g.id === 'automotive') ||
      (normalized.includes('glass') && g.id === 'fragile')
    );
  });

  return found || GOODS_TYPES_CATALOG[0];
}
