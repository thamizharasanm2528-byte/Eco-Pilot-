import {
  formatDateClean,
  formatNumberWithCommas,
  formatCurrencyINR,
  formatPercentage,
} from "./formatters";

/**
 * Assessment Normalizer & Flattener for EcoPilot Export
 * 
 * Flattens raw Firebase assessment objects into human-readable data fields.
 * NEVER outputs raw JSON strings into export rows.
 */

export const getCategoryMetricsSummary = (item) => {
  if (!item) return "";
  const cat = (item.category || "").toUpperCase();

  const parts = [];
  if (cat === "ENERGY") {
    if (item.monthlyElectricityKwh !== null) parts.push(`Electricity: ${formatNumberWithCommas(item.monthlyElectricityKwh)} kWh`);
    if (item.renewableEnergyPercentage !== null) parts.push(`Renewable: ${formatPercentage(item.renewableEnergyPercentage)}`);
    if (item.monthlyElectricityCost !== null) parts.push(`Cost: ${formatCurrencyINR(item.monthlyElectricityCost)}`);
  } else if (cat === "WATER") {
    if (item.monthlyWaterLiters !== null) parts.push(`Water Consumption: ${formatNumberWithCommas(item.monthlyWaterLiters)} L`);
    if (item.recycledWaterPercentage !== null) parts.push(`Recycled: ${formatPercentage(item.recycledWaterPercentage)}`);
  } else if (cat === "WASTE") {
    if (item.monthlyWasteKg !== null) parts.push(`Waste: ${formatNumberWithCommas(item.monthlyWasteKg)} kg`);
    if (item.organicWastePercentage !== null) parts.push(`Organic: ${formatPercentage(item.organicWastePercentage)}`);
    if (item.recycledWastePercentage !== null) parts.push(`Recycled: ${formatPercentage(item.recycledWastePercentage)}`);
  } else if (cat === "TRANSPORTATION") {
    if (item.publicTransportPercentage !== null) parts.push(`Public Transport: ${formatPercentage(item.publicTransportPercentage)}`);
    if (item.privateVehiclePercentage !== null) parts.push(`Private Vehicle: ${formatPercentage(item.privateVehiclePercentage)}`);
    if (item.cyclingWalkingPercentage !== null) parts.push(`Cycling/Walking: ${formatPercentage(item.cyclingWalkingPercentage)}`);
  } else if (cat === "FOOD") {
    if (item.monthlyFoodWasteKg !== null) parts.push(`Food Waste: ${formatNumberWithCommas(item.monthlyFoodWasteKg)} kg`);
    if (item.compostedPercentage !== null) parts.push(`Composted: ${formatPercentage(item.compostedPercentage)}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "No key metrics recorded";
};

export const normalizeAssessment = (item) => {
  if (!item) return null;

  const categoryRaw = (item.category || "").toUpperCase();
  const period = item.period || "N/A";
  const score = item.score !== undefined && item.score !== null ? Number(item.score) : null;
  const data = item.data || {};

  // Safely extract numeric values or null (never undefined / [object Object])
  const getNum = (val) => {
    if (val === undefined || val === null || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const normalized = {
    id: item.id || "",
    category: categoryRaw,
    period,
    score,
    
    // ENERGY
    monthlyElectricityKwh: categoryRaw === "ENERGY" ? getNum(data.monthlyElectricityKwh) : null,
    renewableEnergyPercentage: categoryRaw === "ENERGY" ? getNum(data.renewableEnergyPercentage) : null,
    monthlyElectricityCost: categoryRaw === "ENERGY" ? getNum(data.monthlyElectricityCost) : null,
    
    // WATER
    monthlyWaterLiters: categoryRaw === "WATER" ? getNum(data.monthlyWaterLiters) : null,
    recycledWaterPercentage: categoryRaw === "WATER" ? getNum(data.recycledWaterPercentage) : null,
    
    // WASTE
    monthlyWasteKg: categoryRaw === "WASTE" ? getNum(data.monthlyWasteKg) : null,
    organicWastePercentage: categoryRaw === "WASTE" ? getNum(data.organicWastePercentage) : null,
    recycledWastePercentage: categoryRaw === "WASTE" ? getNum(data.recycledWastePercentage) : null,
    
    // FOOD
    monthlyFoodWasteKg: categoryRaw === "FOOD" ? getNum(data.monthlyFoodWasteKg) : null,
    compostedPercentage: categoryRaw === "FOOD" ? getNum(data.compostedPercentage) : null,
    
    // TRANSPORTATION
    publicTransportPercentage: categoryRaw === "TRANSPORTATION" ? getNum(data.publicTransportPercentage) : null,
    privateVehiclePercentage: categoryRaw === "TRANSPORTATION" ? getNum(data.privateVehiclePercentage) : null,
    cyclingWalkingPercentage: categoryRaw === "TRANSPORTATION" ? getNum(data.cyclingWalkingPercentage) : null,

    // Timestamps
    createdAtFormatted: formatDateClean(item.createdAt),
    updatedAtFormatted: formatDateClean(item.updatedAt || item.createdAt),
    rawCreatedAt: item.createdAt ? new Date(item.createdAt).getTime() : 0,
  };

  normalized.keyMetricsSummary = getCategoryMetricsSummary(normalized);

  return normalized;
};

/**
 * Sorts assessments by Period (descending), then CreatedAt (descending)
 */
export const sortAssessmentsDesc = (assessments = []) => {
  const safe = Array.isArray(assessments) ? assessments : [];
  return [...safe].map(normalizeAssessment).filter(Boolean).sort((a, b) => {
    if (a.period !== b.period) {
      return b.period.localeCompare(a.period);
    }
    return b.rawCreatedAt - a.rawCreatedAt;
  });
};

/**
 * Sorts assessments for CSV export:
 * 1. Period DESC
 * 2. Category Priority (ENERGY -> WATER -> WASTE -> TRANSPORTATION -> FOOD)
 * 3. CreatedAt DESC
 */
export const sortAssessmentsForCSV = (assessments = []) => {
  const categoryPriority = {
    ENERGY: 1,
    WATER: 2,
    WASTE: 3,
    TRANSPORTATION: 4,
    FOOD: 5,
  };

  const safe = Array.isArray(assessments) ? assessments : [];
  return [...safe].map(normalizeAssessment).filter(Boolean).sort((a, b) => {
    // 1. Period DESC
    if (a.period !== b.period) {
      return b.period.localeCompare(a.period);
    }

    // 2. Category Order: ENERGY -> WATER -> WASTE -> TRANSPORTATION -> FOOD
    const prioA = categoryPriority[a.category] || 99;
    const prioB = categoryPriority[b.category] || 99;
    if (prioA !== prioB) {
      return prioA - prioB;
    }

    // 3. CreatedAt DESC
    return b.rawCreatedAt - a.rawCreatedAt;
  });
};

/**
 * Computes Executive Summary statistics
 */
export const calculateSummaryStats = (normalizedList = []) => {
  if (normalizedList.length === 0) {
    return {
      totalAssessments: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      latestPeriod: "N/A",
      categorySummaries: [],
    };
  }

  const scores = normalizedList
    .map((a) => a.score)
    .filter((s) => s !== null && !isNaN(s));

  const totalAssessments = normalizedList.length;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const latestPeriod = normalizedList.length > 0 ? normalizedList[0].period : "N/A";

  const categories = ["Energy", "Water", "Waste", "Transportation", "Food"];
  const categorySummaries = categories.map((catLabel) => {
    const catUpper = catLabel.toUpperCase();
    const catItems = normalizedList.filter((a) => a.category === catUpper);
    const catScores = catItems.map((a) => a.score).filter((s) => s !== null && !isNaN(s));
    
    const count = catItems.length;
    const avgScore = catScores.length > 0 ? Math.round(catScores.reduce((a, b) => a + b, 0) / catScores.length) : "N/A";
    const latestItem = catItems.length > 0 ? catItems[0] : null;
    const latestScore = latestItem && latestItem.score !== null ? latestItem.score : "N/A";

    return {
      category: catLabel,
      count,
      averageScore: avgScore,
      latestScore,
    };
  });

  return {
    totalAssessments,
    averageScore,
    highestScore,
    lowestScore,
    latestPeriod,
    categorySummaries,
  };
};
