import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Database,
  Trash2,
  Search,
  Filter,
  Download,
  Boxes,
  CheckCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { RawInventoryItem, CleanInventoryItem } from '../types';
import { CleaningReport } from '../engine/cleaner';
import { GOODS_TYPES_CATALOG, getGoodsTypeInfo, GoodsTypeInfo } from '../data/goodsTypes';

interface DataIngestionStudioProps {
  rawInventory: RawInventoryItem[];
  cleanInventory: CleanInventoryItem[];
  cleaningReport: CleaningReport;
  onUpdateInventory: (items: RawInventoryItem[]) => void;
  onLoadPreset: (presetKey: string) => void;
}

export const DataIngestionStudio: React.FC<DataIngestionStudioProps> = ({
  rawInventory,
  cleanInventory,
  cleaningReport,
  onUpdateInventory,
  onLoadPreset
}) => {
  const [selectedGoodsType, setSelectedGoodsType] = useState<string>(GOODS_TYPES_CATALOG[0].name);
  const [tableCategoryFilter, setTableCategoryFilter] = useState<string>('ALL');
  const [tableSearchTerm, setTableSearchTerm] = useState<string>('');

  const [newSKU, setNewSKU] = useState<Partial<RawInventoryItem>>({
    Product_ID: 'P125',
    Product_Name: 'boAt Airdopes 141 ANC Earbuds',
    Category: GOODS_TYPES_CATALOG[0].name,
    Length_cm: 14,
    Width_cm: 10,
    Height_cm: 5,
    Daily_Demand_Units: 320,
    Daily_Pick_Frequency: 120,
    Current_Location_ID: 'C01'
  });

  const activeGoodsTypeInfo = useMemo(() => {
    return getGoodsTypeInfo(newSKU.Category || selectedGoodsType);
  }, [newSKU.Category, selectedGoodsType]);

  // Handle template selection into form
  const handleSelectGoodsTypeTemplate = (goodsType: GoodsTypeInfo) => {
    setSelectedGoodsType(goodsType.name);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setNewSKU({
      Product_ID: `${goodsType.sampleGoods.suggestedIdPrefix}_${randomSuffix}`,
      Product_Name: goodsType.sampleGoods.productName,
      Category: goodsType.name,
      Length_cm: goodsType.sampleGoods.lengthCm,
      Width_cm: goodsType.sampleGoods.widthCm,
      Height_cm: goodsType.sampleGoods.heightCm,
      Daily_Demand_Units: goodsType.sampleGoods.dailyDemand,
      Daily_Pick_Frequency: goodsType.sampleGoods.pickFrequency,
      Current_Location_ID: goodsType.sampleGoods.currentLocation
    });
  };

  // Immediate 1-click Quick Inject
  const handleQuickInjectGoodsType = (goodsType: GoodsTypeInfo) => {
    const nextNum = rawInventory.length + 101;
    const newItem: RawInventoryItem = {
      Product_ID: `SKU_${goodsType.code}_${nextNum}`,
      Product_Name: goodsType.sampleGoods.productName,
      Category: goodsType.name,
      Length_cm: goodsType.sampleGoods.lengthCm,
      Width_cm: goodsType.sampleGoods.widthCm,
      Height_cm: goodsType.sampleGoods.heightCm,
      Daily_Demand_Units: goodsType.sampleGoods.dailyDemand,
      Daily_Pick_Frequency: goodsType.sampleGoods.pickFrequency,
      Current_Location_ID: goodsType.sampleGoods.currentLocation
    };

    onUpdateInventory([...rawInventory, newItem]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
      const items: RawInventoryItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });

        items.push({
          Product_ID: row['Product_ID'] || `SKU_${i}`,
          Product_Name: row['Product_Name'] || `Product ${i}`,
          Category: row['Category'] || 'Consumer Electronics',
          Length_cm: parseFloat(row['Length_cm']) || 20,
          Width_cm: parseFloat(row['Width_cm']) || 15,
          Height_cm: parseFloat(row['Height_cm']) || 10,
          Daily_Demand_Units: parseFloat(row['Daily_Demand_Units']) || 50,
          Daily_Pick_Frequency: parseFloat(row['Daily_Pick_Frequency']) || 20,
          Current_Location_ID: row['Current_Location_ID'] || 'C01'
        });
      }

      onUpdateInventory(items);
    };

    reader.readAsText(file);
  };

  const handleAddSKU = () => {
    if (!newSKU.Product_ID || !newSKU.Product_Name) return;
    const item: RawInventoryItem = {
      Product_ID: newSKU.Product_ID.toUpperCase(),
      Product_Name: newSKU.Product_Name,
      Category: newSKU.Category || 'Consumer Electronics',
      Length_cm: Number(newSKU.Length_cm) || 20,
      Width_cm: Number(newSKU.Width_cm) || 15,
      Height_cm: Number(newSKU.Height_cm) || 10,
      Daily_Demand_Units: Number(newSKU.Daily_Demand_Units) || 50,
      Daily_Pick_Frequency: Number(newSKU.Daily_Pick_Frequency) || 20,
      Current_Location_ID: newSKU.Current_Location_ID || 'C01'
    };

    onUpdateInventory([...rawInventory, item]);

    const nextId = `P${rawInventory.length + 126}`;
    setNewSKU({
      Product_ID: nextId,
      Product_Name: '',
      Category: item.Category,
      Length_cm: 20,
      Width_cm: 15,
      Height_cm: 10,
      Daily_Demand_Units: 100,
      Daily_Pick_Frequency: 40,
      Current_Location_ID: 'C01'
    });
  };

  const handleDeleteItem = (id: string) => {
    onUpdateInventory(rawInventory.filter((i) => i.Product_ID !== id));
  };

  // Filtered inventory for table
  const filteredInventory = useMemo(() => {
    return cleanInventory.filter((item) => {
      const matchesSearch =
        item.Product_ID.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.Product_Name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.Category.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.Current_Location_ID.toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesCat =
        tableCategoryFilter === 'ALL' ||
        item.Category.toLowerCase() === tableCategoryFilter.toLowerCase() ||
        getGoodsTypeInfo(item.Category).id === tableCategoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [cleanInventory, tableSearchTerm, tableCategoryFilter]);

  // Breakdown counts by Goods Type
  const goodsTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cleanInventory.forEach((item) => {
      const typeInfo = getGoodsTypeInfo(item.Category);
      counts[typeInfo.name] = (counts[typeInfo.name] || 0) + 1;
    });
    return counts;
  }, [cleanInventory]);

  const handleExportCSV = () => {
    const headers = [
      'Product_ID',
      'Product_Name',
      'Category',
      'Length_cm',
      'Width_cm',
      'Height_cm',
      'Unit_Volume_m3',
      'Daily_Demand_Units',
      'Daily_Pick_Frequency',
      'Current_Location_ID',
      'Demand_Zone'
    ];

    const rows = cleanInventory.map((i) => [
      i.Product_ID,
      `"${i.Product_Name.replace(/"/g, '""')}"`,
      `"${i.Category}"`,
      i.Length_cm,
      i.Width_cm,
      i.Height_cm,
      i.Unit_Volume_m3.toFixed(4),
      i.Daily_Demand_Units,
      i.Daily_Pick_Frequency,
      i.Current_Location_ID,
      i.Demand_Zone || 'Zone_C'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `optiware_goods_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Ingestion Studio, Presets, and File Upload */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" /> Automated Goods Ingestion & Imputation Studio
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Input goods across 12 distinct industrial types. Upload enterprise CSV files, load Indian supply chain presets, or inject custom SKUs with handling protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="min-h-[40px] flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border-slate-300 dark:border-slate-700"
              title="Download catalog CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <label className="min-h-[40px] flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-xs transition-all focus-within:ring-2 focus-within:ring-emerald-400">
              <UploadCloud className="w-4 h-4" />
              <span>Upload CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" aria-label="Upload CSV file" />
            </label>
          </div>
        </div>

        {/* Indian Enterprise & Benchmark Presets */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mr-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Indian Enterprise Presets:
            </span>
            <button
              onClick={() => onLoadPreset('flipkart')}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl border bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700/60 text-xs font-bold transition-all shadow-xs"
            >
              Flipkart Festive Rush (Bhiwandi Hub)
            </button>
            <button
              onClick={() => onLoadPreset('blinkit')}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl border bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700/60 text-xs font-bold transition-all shadow-xs"
            >
              Blinkit 10-Min Dark Store (NCR)
            </button>
            <button
              onClick={() => onLoadPreset('delhivery')}
              className="min-h-[36px] px-3.5 py-1.5 rounded-xl border bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-700/60 text-xs font-bold transition-all shadow-xs"
            >
              Delhivery Cross-Dock Express (BLR)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
              Edge-Case Scenarios:
            </span>
            <button
              onClick={() => onLoadPreset('benchmark')}
              className="min-h-[34px] px-3 py-1 rounded-xl border bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
            >
              Standard 24-SKU Multi-Category (Default)
            </button>
            <button
              onClick={() => onLoadPreset('TC-01')}
              className="min-h-[34px] px-3 py-1 rounded-xl border bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
            >
              TC-01: Oversized Physical SKU (150cm)
            </button>
            <button
              onClick={() => onLoadPreset('TC-02')}
              className="min-h-[34px] px-3 py-1 rounded-xl border bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
            >
              TC-02: Corrupted Input Data & Imputation
            </button>
            <button
              onClick={() => onLoadPreset('TC-03')}
              className="min-h-[34px] px-3 py-1 rounded-xl border bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
            >
              TC-03: Volume Overcapacity
            </button>
            <button
              onClick={() => onLoadPreset('TC-04')}
              className="min-h-[34px] px-3 py-1 rounded-xl border bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 transition-colors"
            >
              TC-04: Length Overhang Boundary
            </button>
          </div>
        </div>
      </div>

      {/* Cleaning Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <span>Total Goods in Catalog</span>
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black font-mono">
            {cleaningReport.totalItems} Active SKUs
          </div>
          <div className="text-[11px] text-slate-500 mt-1">12 Goods Types Registered</div>
        </div>

        <div className="rounded-2xl p-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <span>Imputed Records</span>
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl font-black font-mono text-teal-600 dark:text-cyan-400">
            {cleaningReport.imputedCount} Repaired
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Via category medians</div>
        </div>

        <div className="rounded-2xl p-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <span>Missing Pick Frequency</span>
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
            {cleaningReport.cleanedFieldsCount.pickFrequency} Repaired
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Median non-zero baseline</div>
        </div>

        <div className="rounded-2xl p-4 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
            <span>Invalid Dimensions</span>
            <AlertCircle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
            {cleaningReport.cleanedFieldsCount.dimensions} Re-baselined
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Category median standard</div>
        </div>
      </div>

      {/* Goods & Goods Types Quick-Inject Palette */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Goods & Goods Types Quick-Input Palette
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click &quot;+ Quick Add&quot; to inject a representative SKU directly into inventory, or &quot;Load Template&quot; to customize.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            12 Standard Types
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {GOODS_TYPES_CATALOG.map((gt) => {
            const count = goodsTypeCounts[gt.name] || 0;
            return (
              <div
                key={gt.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFC] dark:bg-slate-950/60 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${gt.pastelBadge.bg} ${gt.pastelBadge.text} ${gt.pastelBadge.border}`}>
                      {gt.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {count} loaded
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {gt.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span>Handling:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{gt.handlingRequirement}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
                  <button
                    onClick={() => handleQuickInjectGoodsType(gt)}
                    className="flex-1 min-h-[32px] flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Quick Add</span>
                  </button>
                  <button
                    onClick={() => handleSelectGoodsTypeTemplate(gt)}
                    className="px-2.5 min-h-[32px] flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                    title="Load into custom SKU form"
                  >
                    Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Custom SKU Input Form */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" /> Custom Goods Parameter Input Form
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Handling Rule:</span>
            <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {activeGoodsTypeInfo.handlingRequirement}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-xs">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="sku-id-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              SKU ID
            </label>
            <input
              id="sku-id-input"
              type="text"
              placeholder="e.g. ELC_451"
              value={newSKU.Product_ID}
              onChange={(e) => setNewSKU({ ...newSKU, Product_ID: e.target.value })}
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-mono font-bold"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="sku-name-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Product Description
            </label>
            <input
              id="sku-name-input"
              type="text"
              placeholder="e.g. Sony Wireless Active Headphones"
              value={newSKU.Product_Name}
              onChange={(e) => setNewSKU({ ...newSKU, Product_Name: e.target.value })}
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-medium"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="sku-cat-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Goods Type
            </label>
            <select
              id="sku-cat-input"
              value={newSKU.Category}
              onChange={(e) => {
                const cat = e.target.value;
                const info = getGoodsTypeInfo(cat);
                setNewSKU({
                  ...newSKU,
                  Category: cat,
                  Length_cm: info.sampleGoods.lengthCm,
                  Width_cm: info.sampleGoods.widthCm,
                  Height_cm: info.sampleGoods.heightCm
                });
              }}
              className="w-full min-h-[38px] px-2 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-semibold"
            >
              {GOODS_TYPES_CATALOG.map((gt) => (
                <option key={gt.id} value={gt.name}>
                  {gt.name} ({gt.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sku-l-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Length (cm)
            </label>
            <input
              id="sku-l-input"
              type="number"
              value={newSKU.Length_cm}
              onChange={(e) => setNewSKU({ ...newSKU, Length_cm: parseFloat(e.target.value) })}
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-mono"
            />
          </div>

          <div>
            <label htmlFor="sku-w-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Width (cm)
            </label>
            <input
              id="sku-w-input"
              type="number"
              value={newSKU.Width_cm}
              onChange={(e) => setNewSKU({ ...newSKU, Width_cm: parseFloat(e.target.value) })}
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-mono"
            />
          </div>

          <div>
            <label htmlFor="sku-h-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Height (cm)
            </label>
            <input
              id="sku-h-input"
              type="number"
              value={newSKU.Height_cm}
              onChange={(e) => setNewSKU({ ...newSKU, Height_cm: parseFloat(e.target.value) })}
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-mono"
            />
          </div>

          <div>
            <label htmlFor="sku-picks-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Daily Picks
            </label>
            <input
              id="sku-picks-input"
              type="number"
              value={newSKU.Daily_Pick_Frequency}
              onChange={(e) =>
                setNewSKU({ ...newSKU, Daily_Pick_Frequency: parseFloat(e.target.value) })
              }
              className="w-full min-h-[38px] px-2.5 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-mono font-bold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddSKU}
              disabled={!newSKU.Product_ID || !newSKU.Product_Name}
              className="w-full min-h-[38px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-1.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Add SKU
            </button>
          </div>
        </div>
      </div>

      {/* Active Ingested Goods Catalog Table */}
      <div className="rounded-2xl p-5 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-500" /> Ingested Goods Master Catalog ({filteredInventory.length} of {cleanInventory.length} SKUs)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validated with category-median box baselines and K-Means demand tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search good or SKU..."
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                aria-label="Filter goods by keyword"
                className="w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-medium"
              />
            </div>

            {/* Goods Type Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={tableCategoryFilter}
                onChange={(e) => setTableCategoryFilter(e.target.value)}
                aria-label="Filter goods table by Goods Type"
                className="min-h-[38px] px-3 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 font-semibold"
              >
                <option value="ALL">All Goods Types ({cleanInventory.length})</option>
                {GOODS_TYPES_CATALOG.map((gt) => {
                  const cnt = goodsTypeCounts[gt.name] || 0;
                  return (
                    <option key={gt.id} value={gt.name}>
                      {gt.name} ({cnt})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Goods Type Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto pb-1">
          <button
            onClick={() => setTableCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
              tableCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            All Types ({cleanInventory.length})
          </button>
          {GOODS_TYPES_CATALOG.filter((gt) => (goodsTypeCounts[gt.name] || 0) > 0).map((gt) => {
            const isSelected = tableCategoryFilter.toLowerCase() === gt.name.toLowerCase();
            return (
              <button
                key={gt.id}
                onClick={() => setTableCategoryFilter(gt.name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? `${gt.pastelBadge.bg} ${gt.pastelBadge.text} ${gt.pastelBadge.border} ring-2 ring-emerald-500/40`
                    : 'bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: gt.pastelBadge.dotColor }}
                />
                <span>{gt.name}</span>
                <span className="font-mono text-[10px] opacity-80">({goodsTypeCounts[gt.name]})</span>
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wider font-bold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <th scope="col" className="py-3 px-3.5">SKU ID</th>
                <th scope="col" className="py-3 px-3.5">Product Name</th>
                <th scope="col" className="py-3 px-3.5">Goods Type & Handling</th>
                <th scope="col" className="py-3 px-3.5 text-right">L × W × H (cm)</th>
                <th scope="col" className="py-3 px-3.5 text-right">Unit Vol (m³)</th>
                <th scope="col" className="py-3 px-3.5 text-right">Daily Demand</th>
                <th scope="col" className="py-3 px-3.5 text-right">Pick Freq</th>
                <th scope="col" className="py-3 px-3.5 text-center">Baseline Loc</th>
                <th scope="col" className="py-3 px-3.5 text-center">Data Status</th>
                <th scope="col" className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 italic">
                    No goods match the selected Goods Type filter or search keyword.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const typeInfo = getGoodsTypeInfo(item.Category);
                  return (
                    <tr key={item.Product_ID} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.Product_ID}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-800 dark:text-slate-200">
                        {item.Product_Name}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.pastelBadge.bg} ${typeInfo.pastelBadge.text} ${typeInfo.pastelBadge.border}`}>
                            {item.Category}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {typeInfo.handlingRequirement}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-medium">
                        {item.Length_cm} × {item.Width_cm} × {item.Height_cm}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-500 dark:text-slate-400">
                        {item.Unit_Volume_m3.toFixed(4)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono">
                        {item.Daily_Demand_Units}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.Daily_Pick_Frequency}
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono text-slate-500 dark:text-slate-400 font-semibold">
                        {item.Current_Location_ID}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        {item.isImputed ? (
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            Imputed
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => handleDeleteItem(item.Product_ID)}
                          className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove SKU"
                          aria-label={`Remove SKU ${item.Product_ID}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
