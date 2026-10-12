/**
 * Indian Rupee (INR) and Logistics Formatting Utilities
 * Tailored for Indian supply chain enterprises (Delhivery, Flipkart, Reliance, Blinkit, Amazon IN)
 */

/**
 * Formats a number according to the Indian numbering system (Lakhs & Crores)
 * e.g., 2328000 -> "23,28,000"
 */
export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return '0';
  const rounded = Math.round(num);
  return new Intl.NumberFormat('en-IN').format(rounded);
}

/**
 * Formats an amount in Indian Rupees (₹)
 * @param amount - Value in INR
 * @param compact - If true, formats large amounts into Lakhs (L) and Crores (Cr)
 */
export function formatINR(amount: number, compact = false): string {
  if (isNaN(amount)) return '₹0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) {
      // Crores (1 Cr = 10,000,000)
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      // Lakhs (1 L = 100,000)
      return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    }
  }

  // Standard Indian currency format
  return `₹${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount)}`;
}

/**
 * Major Indian Logistics & Fulfillment Hubs
 */
export interface IndianHub {
  id: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  defaultPickers: number;
  benchmarkCompany: string;
}

export const INDIAN_LOGISTICS_HUBS: IndianHub[] = [
  {
    id: 'BHIWANDI-01',
    name: 'DC-01 Bhiwandi Logistics Park',
    city: 'Mumbai MMR',
    state: 'Maharashtra',
    zone: 'West Region Hub',
    defaultPickers: 50,
    benchmarkCompany: 'Reliance Retail / Flipkart'
  },
  {
    id: 'BILASPUR-02',
    name: 'DC-02 Bilaspur Tauru Mega FC',
    city: 'Gurugram / NCR',
    state: 'Haryana',
    zone: 'North Region Hub',
    defaultPickers: 65,
    benchmarkCompany: 'Delhivery / Amazon India'
  },
  {
    id: 'HOSKOTE-03',
    name: 'DC-03 Hoskote Logistics Centre',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South Region Hub',
    defaultPickers: 45,
    benchmarkCompany: 'Blinkit / Zepto / Shadowfax'
  },
  {
    id: 'CHAKAN-04',
    name: 'DC-04 Chakan Industrial Depot',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'Automotive & Industrial Hub',
    defaultPickers: 40,
    benchmarkCompany: 'Tata / Blue Dart'
  },
  {
    id: 'SRIPERUMBUDUR-05',
    name: 'DC-05 Sriperumbudur Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South Coastal Hub',
    defaultPickers: 35,
    benchmarkCompany: 'Ecom Express / Flipkart'
  }
];
