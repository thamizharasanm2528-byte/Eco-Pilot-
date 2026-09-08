import { METRIC_DIRECTIONS, isFavorableChange } from "./metricDirection";

const KPI_CONFIG = {
  monthlyElectricityKwh: { title: "Electricity Usage", unit: "kWh", category: "energy" },
  renewableEnergyPercentage: { title: "Renewable Energy Share", unit: "%", category: "energy" },
  monthlyWaterLiters: { title: "Water Consumption", unit: "Liters", category: "water" },
  recycledWaterPercentage: { title: "Recycled Water Share", unit: "%", category: "water" },
  monthlyWasteKg: { title: "Waste Generation", unit: "kg", category: "waste" },
  recycledWastePercentage: { title: "Recycling Rate", unit: "%", category: "waste" },
  organicWastePercentage: { title: "Organic Diversion", unit: "%", category: "waste" },
  publicTransportPercentage: { title: "Public Transit Commute", unit: "%", category: "transportation" },
  cyclingWalkingPercentage: { title: "Active Mobility (Walk/Bike)", unit: "%", category: "transportation" },
  monthlyFoodWasteKg: { title: "Food Waste Volume", unit: "kg", category: "food" },
  compostedPercentage: { title: "Food Composting Share", unit: "%", category: "food" },
};

export const calculateKPIs = (assessments) => {
  const safe = Array.isArray(assessments) ? assessments : [];
  const kpiResults = {};

  Object.keys(KPI_CONFIG).forEach((key) => {
    const conf = KPI_CONFIG[key];
    const cat = conf.category;

    // Filter assessments matching category and containing metric key
    const catAssessments = safe
      .filter((a) => a && (a.category || "").toLowerCase() === cat && a.data && a.data[key] !== undefined && a.data[key] !== null)
      .sort((a, b) => new Date(b.period || b.createdAt) - new Date(a.period || a.createdAt));

    if (catAssessments.length === 0) {
      kpiResults[key] = {
        ...conf,
        key,
        currentValue: null,
        previousValue: null,
        change: null,
        changePct: null,
        status: "no_data",
        direction: METRIC_DIRECTIONS[key] || "higher_is_better",
      };
      return;
    }

    const currentDoc = catAssessments[0];
    const currentValue = Number(currentDoc.data[key]);

    let previousValue = null;
    let change = null;
    let changePct = null;
    let status = "stable";

    if (catAssessments.length >= 2) {
      previousValue = Number(catAssessments[1].data[key]);
      change = currentValue - previousValue;
      changePct = previousValue !== 0 ? ((change / Math.abs(previousValue)) * 100).toFixed(1) : 0;

      if (Math.abs(changePct) < 2) {
        status = "stable";
      } else {
        const favorable = isFavorableChange(key, change);
        status = favorable ? "improving" : "declining";
      }
    }

    kpiResults[key] = {
      ...conf,
      key,
      currentValue,
      previousValue,
      change,
      changePct,
      status,
      period: currentDoc.period,
      direction: METRIC_DIRECTIONS[key] || "higher_is_better",
    };
  });

  return kpiResults;
};
