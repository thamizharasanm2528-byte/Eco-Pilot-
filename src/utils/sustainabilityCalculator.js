/**
 * EcoPilot Phase 1B Sustainability Calculation Engine
 * 
 * Provides simplified, transparent educational scoring models (0 - 100 scale)
 * for campus energy, water, waste, transportation, and food assessments.
 */

/**
 * Calculate Energy Score (0 - 100)
 * Inputs: monthlyElectricityKwh (kWh), renewableEnergyPercentage (0-100%)
 */
export const calculateEnergyScore = (data) => {
  if (!data) return 0;
  const kwh = Number(data.monthlyElectricityKwh || 0);
  const renewables = Math.min(100, Math.max(0, Number(data.renewableEnergyPercentage || 0)));

  // Benchmark: 15,000 kWh monthly campus baseline benchmark
  // Lower electricity consumption improves base score
  const baseKwhScore = Math.max(0, Math.min(100, 100 - (kwh / 200)));

  // Renewable energy percentage accounts for 50% of the energy category score
  const score = baseKwhScore * 0.5 + renewables * 0.5;
  return Math.round(Math.min(100, Math.max(0, score)));
};

/**
 * Calculate Water Score (0 - 100)
 * Inputs: monthlyWaterLiters (Liters), recycledWaterPercentage (0-100%)
 */
export const calculateWaterScore = (data) => {
  if (!data) return 0;
  const liters = Number(data.monthlyWaterLiters || 0);
  const recycled = Math.min(100, Math.max(0, Number(data.recycledWaterPercentage || 0)));

  // Benchmark: 50,000 Liters monthly baseline
  const baseLitersScore = Math.max(0, Math.min(100, 100 - (liters / 750)));
  const score = baseLitersScore * 0.5 + recycled * 0.5;
  return Math.round(Math.min(100, Math.max(0, score)));
};

/**
 * Calculate Waste Score (0 - 100)
 * Inputs: monthlyWasteKg (kg), recycledWastePercentage (0-100%), organicWastePercentage (0-100%)
 */
export const calculateWasteScore = (data) => {
  if (!data) return 0;
  const wasteKg = Number(data.monthlyWasteKg || 0);
  const recycled = Math.min(100, Math.max(0, Number(data.recycledWastePercentage || 0)));
  const organic = Math.min(100, Math.max(0, Number(data.organicWastePercentage || 0)));

  // Total landfill diversion rate
  const diversionRate = Math.min(100, recycled + organic);
  
  // Benchmark: 1,500 kg monthly waste
  const baseWasteScore = Math.max(0, Math.min(100, 100 - (wasteKg / 30)));
  const score = baseWasteScore * 0.3 + diversionRate * 0.7;
  return Math.round(Math.min(100, Math.max(0, score)));
};

/**
 * Calculate Transportation Score (0 - 100)
 * Inputs: privateVehiclePercentage, publicTransportPercentage, cyclingWalkingPercentage
 */
export const calculateTransportationScore = (data) => {
  if (!data) return 0;
  const privateVeh = Math.min(100, Math.max(0, Number(data.privateVehiclePercentage || 0)));
  const publicTrans = Math.min(100, Math.max(0, Number(data.publicTransportPercentage || 0)));
  const cyclingWalk = Math.min(100, Math.max(0, Number(data.cyclingWalkingPercentage || 0)));

  // Weighting: Cycling/Walking (1.0), Public Transit (0.75), Private Vehicle (0.1)
  const weightedScore = (cyclingWalk * 1.0) + (publicTrans * 0.75) + (privateVeh * 0.1);
  return Math.round(Math.min(100, Math.max(0, weightedScore)));
};

/**
 * Calculate Food Score (0 - 100)
 * Inputs: monthlyFoodWasteKg (kg), compostedPercentage (0-100%)
 */
export const calculateFoodScore = (data) => {
  if (!data) return 0;
  const foodWaste = Number(data.monthlyFoodWasteKg || 0);
  const composted = Math.min(100, Math.max(0, Number(data.compostedPercentage || 0)));

  // Benchmark: 500 kg monthly food waste
  const baseFoodScore = Math.max(0, Math.min(100, 100 - (foodWaste / 10)));
  const score = baseFoodScore * 0.5 + composted * 0.5;
  return Math.round(Math.min(100, Math.max(0, score)));
};

/**
 * Generic Score Calculator by Category
 */
export const calculateCategoryScore = (category, data) => {
  const cat = (category || "").toLowerCase();
  switch (cat) {
    case "energy":
      return calculateEnergyScore(data);
    case "water":
      return calculateWaterScore(data);
    case "waste":
      return calculateWasteScore(data);
    case "transportation":
    case "transit":
      return calculateTransportationScore(data);
    case "food":
      return calculateFoodScore(data);
    default:
      return 0;
  }
};

/**
 * Calculate Overall Sustainability Score based ONLY on categories that have user assessment data.
 * Does NOT treat missing categories as 0.
 * Returns { overallScore, activeCategoryCount, categoryScores }
 */
export const calculateOverallSustainabilityScore = (assessments) => {
  const validCategories = ["energy", "water", "waste", "transportation", "food"];

  const latestByCategory = {
    energy: null,
    water: null,
    waste: null,
    transportation: null,
    food: null,
  };

  const categoryScores = {
    energy: null,
    water: null,
    waste: null,
    transportation: null,
    food: null,
  };

  const safeAssessments = Array.isArray(assessments) ? assessments : [];

  if (safeAssessments.length === 0) {
    return {
      overallScore: null,
      activeCategoryCount: 0,
      categoryScores,
      latestByCategory,
    };
  }

  // Find the latest assessment document per category
  safeAssessments.forEach((item) => {
    if (!item) return;
    const cat = (item.category || "").toLowerCase();
    if (validCategories.includes(cat)) {
      if (
        !latestByCategory[cat] ||
        new Date(item.period || item.createdAt) >
          new Date(latestByCategory[cat].period || latestByCategory[cat].createdAt)
      ) {
        latestByCategory[cat] = item;
      }
    }
  });

  let totalScoreSum = 0;
  let activeCategoryCount = 0;

  validCategories.forEach((cat) => {
    if (latestByCategory[cat]) {
      const score = calculateCategoryScore(cat, latestByCategory[cat].data);
      categoryScores[cat] = {
        score,
        assessment: latestByCategory[cat],
        period: latestByCategory[cat].period,
        updatedAt: latestByCategory[cat].updatedAt || latestByCategory[cat].createdAt,
      };
      totalScoreSum += score;
      activeCategoryCount += 1;
    }
  });

  const overallScore = activeCategoryCount > 0 ? Math.round(totalScoreSum / activeCategoryCount) : null;

  return {
    overallScore,
    activeCategoryCount,
    categoryScores,
    latestByCategory,
  };
};

/**
 * Human readable score explanation for View Modal
 */
export const getScoreExplanation = (category, data, score) => {
  const cat = (category || "").toLowerCase();
  switch (cat) {
    case "energy":
      return `Calculated from ${data?.monthlyElectricityKwh || 0} kWh electricity consumption and ${data?.renewableEnergyPercentage || 0}% renewable energy adoption. Higher renewable energy share improves this score.`;
    case "water":
      return `Calculated from ${data?.monthlyWaterLiters || 0} Liters water consumption and ${data?.recycledWaterPercentage || 0}% recycled water. Higher water reuse improves score.`;
    case "waste":
      return `Calculated from ${data?.monthlyWasteKg || 0} kg total waste with ${data?.recycledWastePercentage || 0}% recycled and ${data?.organicWastePercentage || 0}% organic composting diversion.`;
    case "transportation":
      return `Calculated from commute modal split: ${data?.cyclingWalkingPercentage || 0}% zero-emissions, ${data?.publicTransportPercentage || 0}% public transit, and ${data?.privateVehiclePercentage || 0}% private vehicles.`;
    case "food":
      return `Calculated from ${data?.monthlyFoodWasteKg || 0} kg monthly dining food waste and ${data?.compostedPercentage || 0}% composting diversion.`;
    default:
      return `Score of ${score}/100 calculated from submitted operational metrics.`;
  }
};
