import { CleanInventoryItem, KMeansClusterData } from '../types';

export interface KMeansEngineResult {
  items: CleanInventoryItem[];
  clusters: KMeansClusterData[];
  iterationsRun: number;
}

export function runKMeansClustering(items: CleanInventoryItem[], k = 3): KMeansEngineResult {
  if (items.length === 0) {
    return { items: [], clusters: [], iterationsRun: 0 };
  }

  const effectiveK = Math.min(k, items.length);

  // Feature vector: [Daily_Pick_Frequency, Daily_Demand_Units]
  // Normalize features to [0, 1] for balanced geometric clustering
  let minPF = Infinity;
  let maxPF = -Infinity;
  let minDem = Infinity;
  let maxDem = -Infinity;

  items.forEach((item) => {
    if (item.Daily_Pick_Frequency < minPF) minPF = item.Daily_Pick_Frequency;
    if (item.Daily_Pick_Frequency > maxPF) maxPF = item.Daily_Pick_Frequency;
    if (item.Daily_Demand_Units < minDem) minDem = item.Daily_Demand_Units;
    if (item.Daily_Demand_Units > maxDem) maxDem = item.Daily_Demand_Units;
  });

  const rangePF = maxPF - minPF || 1;
  const rangeDem = maxDem - minDem || 1;

  const points = items.map((item) => ({
    rawPF: item.Daily_Pick_Frequency,
    rawDem: item.Daily_Demand_Units,
    normPF: (item.Daily_Pick_Frequency - minPF) / rangePF,
    normDem: (item.Daily_Demand_Units - minDem) / rangeDem,
    item
  }));

  // Initial centroid selection (spaced out along pick frequency axis for deterministic stability)
  const sortedPoints = [...points].sort((a, b) => b.rawPF - a.rawPF);
  const centroids: { normPF: number; normDem: number; rawPF: number; rawDem: number }[] = [];

  for (let i = 0; i < effectiveK; i++) {
    const idx = Math.floor((i * (sortedPoints.length - 1)) / Math.max(1, effectiveK - 1));
    centroids.push({
      normPF: sortedPoints[idx].normPF,
      normDem: sortedPoints[idx].normDem,
      rawPF: sortedPoints[idx].rawPF,
      rawDem: sortedPoints[idx].rawDem
    });
  }

  let assignments = new Array(points.length).fill(0);
  let iterationsRun = 0;
  const maxIterations = 20;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterationsRun++;
    let changed = false;

    // Assignment step
    for (let pIdx = 0; pIdx < points.length; pIdx++) {
      const p = points[pIdx];
      let bestDist = Infinity;
      let bestCluster = 0;

      for (let cIdx = 0; cIdx < effectiveK; cIdx++) {
        const c = centroids[cIdx];
        const distSq = Math.pow(p.normPF - c.normPF, 2) + Math.pow(p.normDem - c.normDem, 2);
        if (distSq < bestDist) {
          bestDist = distSq;
          bestCluster = cIdx;
        }
      }

      if (assignments[pIdx] !== bestCluster) {
        assignments[pIdx] = bestCluster;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Update centroids
    for (let cIdx = 0; cIdx < effectiveK; cIdx++) {
      const clusterPoints = points.filter((_, idx) => assignments[idx] === cIdx);
      if (clusterPoints.length > 0) {
        const avgNormPF = clusterPoints.reduce((s, cp) => s + cp.normPF, 0) / clusterPoints.length;
        const avgNormDem = clusterPoints.reduce((s, cp) => s + cp.normDem, 0) / clusterPoints.length;
        const avgRawPF = clusterPoints.reduce((s, cp) => s + cp.rawPF, 0) / clusterPoints.length;
        const avgRawDem = clusterPoints.reduce((s, cp) => s + cp.rawDem, 0) / clusterPoints.length;
        centroids[cIdx] = {
          normPF: avgNormPF,
          normDem: avgNormDem,
          rawPF: avgRawPF,
          rawDem: avgRawDem
        };
      }
    }
  }

  // Calculate mean pick frequency per cluster to rank them: Zone_A (highest), Zone_B, Zone_C
  const clusterMetrics = centroids.map((c, idx) => {
    const members = points.filter((_, pIdx) => assignments[pIdx] === idx);
    const meanPF = members.length > 0 ? members.reduce((s, m) => s + m.rawPF, 0) / members.length : 0;
    const meanDem = members.length > 0 ? members.reduce((s, m) => s + m.rawDem, 0) / members.length : 0;
    return {
      originalIndex: idx,
      meanPF,
      meanDem,
      memberCount: members.length,
      memberSkus: members.map((m) => m.item.Product_ID)
    };
  });

  // Sort clusters descending by mean pick frequency
  clusterMetrics.sort((a, b) => b.meanPF - a.meanPF);

  const zoneLabels: ('Zone_A' | 'Zone_B' | 'Zone_C')[] = ['Zone_A', 'Zone_B', 'Zone_C'];
  const clusterIndexToZoneMap = new Map<number, 'Zone_A' | 'Zone_B' | 'Zone_C'>();

  clusterMetrics.forEach((cm, rank) => {
    clusterIndexToZoneMap.set(cm.originalIndex, zoneLabels[rank] || 'Zone_C');
  });

  // Stamp items with Cluster and Demand_Zone
  const updatedItems = items.map((item, idx) => {
    const rawCluster = assignments[idx];
    const demandZone = clusterIndexToZoneMap.get(rawCluster) || 'Zone_C';
    return {
      ...item,
      Cluster: rawCluster,
      Demand_Zone: demandZone
    };
  });

  const finalClusters: KMeansClusterData[] = clusterMetrics.map((cm, rank) => ({
    clusterIndex: cm.originalIndex,
    zone: zoneLabels[rank] || 'Zone_C',
    centroidPickFreq: Math.round(cm.meanPF * 10) / 10,
    centroidDemand: Math.round(cm.meanDem * 10) / 10,
    skuCount: cm.memberCount,
    skus: cm.memberSkus
  }));

  return {
    items: updatedItems,
    clusters: finalClusters,
    iterationsRun
  };
}
