import { RawInventoryItem, CleanInventoryItem } from '../types';

export interface CleaningReport {
  totalItems: number;
  imputedCount: number;
  cleanedFieldsCount: {
    category: number;
    location: number;
    pickFrequency: number;
    demand: number;
    dimensions: number;
  };
  log: string[];
}

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function cleanAndValidateInventory(
  rawItems: RawInventoryItem[]
): { cleanItems: CleanInventoryItem[]; report: CleaningReport } {
  const log: string[] = [];
  let categoryFixes = 0;
  let locationFixes = 0;
  let pickFreqFixes = 0;
  let demandFixes = 0;
  let dimFixes = 0;

  // Step 1: Pre-collect category valid numbers to compute category medians
  const categoryPickFreqMap: Record<string, number[]> = {};
  const categoryDemandMap: Record<string, number[]> = {};
  const allPickFreqs: number[] = [];
  const allDemands: number[] = [];

  rawItems.forEach((item) => {
    const cat = item.Category && item.Category.trim() ? item.Category.trim() : 'Uncategorized';
    if (!categoryPickFreqMap[cat]) categoryPickFreqMap[cat] = [];
    if (!categoryDemandMap[cat]) categoryDemandMap[cat] = [];

    const pf = Number(item.Daily_Pick_Frequency);
    if (!isNaN(pf) && pf > 0) {
      categoryPickFreqMap[cat].push(pf);
      allPickFreqs.push(pf);
    }

    const dem = Number(item.Daily_Demand_Units);
    if (!isNaN(dem) && dem > 0) {
      categoryDemandMap[cat].push(dem);
      allDemands.push(dem);
    }
  });

  const globalMedianPickFreq = calculateMedian(allPickFreqs) || 25;
  const globalMedianDemand = calculateMedian(allDemands) || 50;

  const cleanItems: CleanInventoryItem[] = rawItems.map((item, index) => {
    const imputedFields: string[] = [];
    let isImputed = false;

    // Category
    let category = item.Category?.trim();
    if (!category) {
      category = 'Uncategorized';
      categoryFixes++;
      isImputed = true;
      imputedFields.push('Category (set to Uncategorized)');
      log.push(`[Item #${index + 1} ${item.Product_ID || 'Unknown'}]: Imputed missing category as 'Uncategorized'.`);
    }

    // Current_Location_ID
    let currentLocation = item.Current_Location_ID?.trim();
    if (!currentLocation) {
      currentLocation = 'UNASSIGNED';
      locationFixes++;
      isImputed = true;
      imputedFields.push('Location (set to UNASSIGNED)');
      log.push(`[Item #${index + 1} ${item.Product_ID}]: Imputed missing location as 'UNASSIGNED'.`);
    }

    // Daily_Pick_Frequency median transform
    let rawPickFreq = Number(item.Daily_Pick_Frequency);
    let pickFreq = rawPickFreq;
    if (isNaN(rawPickFreq) || rawPickFreq <= 0) {
      const catList = categoryPickFreqMap[category] || [];
      pickFreq = catList.length > 0 ? calculateMedian(catList) : globalMedianPickFreq;
      pickFreqFixes++;
      isImputed = true;
      imputedFields.push(`Pick Frequency (imputed median ${pickFreq})`);
      log.push(`[${item.Product_ID}]: Imputed missing/corrupted pick frequency with category median (${pickFreq}).`);
    }

    // Daily_Demand_Units median transform
    let rawDemand = Number(item.Daily_Demand_Units);
    let demand = rawDemand;
    if (isNaN(rawDemand) || rawDemand <= 0) {
      const catDemandList = categoryDemandMap[category] || [];
      demand = catDemandList.length > 0 ? calculateMedian(catDemandList) : globalMedianDemand;
      demandFixes++;
      isImputed = true;
      imputedFields.push(`Demand (imputed median ${demand})`);
      log.push(`[${item.Product_ID}]: Imputed missing/corrupted demand units with category median (${demand}).`);
    }

    // Dimensional metrics (standard box baselines: 30cm, 20cm, 15cm if missing or <= 0)
    let length = Number(item.Length_cm);
    let width = Number(item.Width_cm);
    let height = Number(item.Height_cm);

    let dimChanged = false;
    if (isNaN(length) || length <= 0) {
      length = 30.0;
      dimChanged = true;
    }
    if (isNaN(width) || width <= 0) {
      width = 20.0;
      dimChanged = true;
    }
    if (isNaN(height) || height <= 0) {
      height = 15.0;
      dimChanged = true;
    }

    if (dimChanged) {
      dimFixes++;
      isImputed = true;
      imputedFields.push(`Dimensions (re-baselined to L:${length} W:${width} H:${height})`);
      log.push(`[${item.Product_ID}]: Replaced invalid 3D dimensions with median box baseline (${length}x${width}x${height} cm).`);
    }

    // Compute cubic volume directly in m^3: (L * W * H) / 1,000,000
    const unitVolume = Number(((length * width * height) / 1000000.0).toFixed(6));

    return {
      Product_ID: item.Product_ID || `SKU_${index + 1}`,
      Product_Name: item.Product_Name || `Product ${index + 1}`,
      Category: category,
      Length_cm: length,
      Width_cm: width,
      Height_cm: height,
      Unit_Volume_m3: unitVolume,
      Daily_Demand_Units: demand,
      Daily_Pick_Frequency: pickFreq,
      Current_Location_ID: currentLocation,
      isImputed,
      imputedFields
    };
  });

  const report: CleaningReport = {
    totalItems: rawItems.length,
    imputedCount: cleanItems.filter((i) => i.isImputed).length,
    cleanedFieldsCount: {
      category: categoryFixes,
      location: locationFixes,
      pickFrequency: pickFreqFixes,
      demand: demandFixes,
      dimensions: dimFixes
    },
    log
  };

  return { cleanItems, report };
}
