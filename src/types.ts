export interface RawInventoryItem {
  Product_ID: string;
  Product_Name: string;
  Category?: string;
  Length_cm?: number | string;
  Width_cm?: number | string;
  Height_cm?: number | string;
  Unit_Volume_m3?: number | string;
  Daily_Demand_Units?: number | string;
  Daily_Pick_Frequency?: number | string;
  Current_Location_ID?: string;
}

export interface CleanInventoryItem {
  Product_ID: string;
  Product_Name: string;
  Category: string;
  Length_cm: number;
  Width_cm: number;
  Height_cm: number;
  Unit_Volume_m3: number;
  Daily_Demand_Units: number;
  Daily_Pick_Frequency: number;
  Current_Location_ID: string;
  Cluster?: number;
  Demand_Zone?: 'Zone_A' | 'Zone_B' | 'Zone_C';
  isImputed?: boolean;
  imputedFields?: string[];
}

export interface WarehouseLocation {
  Location_ID: string;
  Zone: string;
  Length_cm: number;
  Width_cm: number;
  Height_cm: number;
  Max_Volume_m3: number;
  Distance_to_Dock_m: number;
  Accessibility_Score: number;
  // Dynamic runtime state
  Is_Occupied?: boolean;
  Occupied_Volume_m3?: number;
  Assigned_Product_ID?: string;
  Assigned_Product_Name?: string;
  gridX?: number; // for 2D floorplan rendering
  gridY?: number;
}

export interface SlottingAssignment {
  Product_ID: string;
  Product_Name: string;
  Category: string;
  Dimensions: { length: number; width: number; height: number; volume: number };
  Demand_Zone: 'Zone_A' | 'Zone_B' | 'Zone_C';
  Pick_Frequency: number;
  Daily_Demand: number;
  Baseline_Location: string;
  Baseline_Distance_m: number;
  Optimized_Location: string;
  Optimized_Zone: string;
  Optimized_Distance_m: number;
  Distance_Saved_m: number;
  Daily_Travel_Delta_m: number; // Distance_Saved_m * Pick_Frequency
  Allocation_Status: 'ASSIGNED' | 'OVERFLOW';
  Reasoning: string;
  Constraint_Validation: {
    lengthFits: boolean;
    widthFits: boolean;
    heightFits: boolean;
    volumeFits: boolean;
  };
}

export interface OptimizationMetrics {
  baselineDailyTravelMeters: number;
  optimizedDailyTravelMeters: number;
  travelDistanceSavedMeters: number;
  travelReductionPct: number;
  dailyLaborSavingsINR: number;
  annualLaborSavingsINR: number;
  // Backwards compatibility alias
  dailyLaborSavingsUSD?: number;
  annualLaborSavingsUSD?: number;
  laborCostPerMeter: number;
  workerCount: number;
  usableRackVolumeTotalM3: number;
  usableRackVolumeOccupiedM3: number;
  rackVolumeUtilizationPct: number;
  baselineVolumeUtilizationPct: number;
  feasibilityRatePct: number;
  totalSKUs: number;
  assignedSKUs: number;
  overflowSKUs: number;
  baselineAveragePickDistanceM: number;
  optimizedAveragePickDistanceM: number;
  baselinePPH: number;
  optimizedPPH: number;
  pphIncreasePct: number;
}

export interface KMeansClusterData {
  clusterIndex: number;
  zone: 'Zone_A' | 'Zone_B' | 'Zone_C';
  centroidPickFreq: number;
  centroidDemand: number;
  skuCount: number;
  skus: string[];
}

export interface TestCase {
  id: string;
  name: string;
  failureScenario: string;
  inputAnomalyCondition: string;
  expectedBehavior: string;
  verificationOutcome: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  inventoryOverride: RawInventoryItem[];
  locationOverride?: WarehouseLocation[];
}

export interface JudgeQA {
  questionNumber: number;
  question: string;
  answer: string;
  category: 'AI & Math' | 'Physics & Geometry' | 'Operational & Human' | 'Strategy & WMS';
  keyTakeaway: string;
}
