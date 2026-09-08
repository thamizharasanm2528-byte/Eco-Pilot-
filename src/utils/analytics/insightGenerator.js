/**
 * Deterministic Rule-Based Insight Generator for EcoPilot Phase 2
 * 
 * Generates prioritized campus sustainability insights.
 * (NOT AI-generated; purely deterministic analytics engine output).
 */

export const generateAnalyticsInsights = (kpis, periodTrends, categoryScores, hotspots) => {
  const insights = [];

  // Rule 1: Consecutive decline detection
  if (periodTrends?.consecutiveDeclines && periodTrends.consecutiveDeclines.length > 0) {
    periodTrends.consecutiveDeclines.forEach((cd) => {
      insights.push({
        id: `consec-decline-${cd.category}`,
        category: cd.category,
        priority: "High",
        title: `${cd.category.toUpperCase()} Performance Declining`,
        message: `${cd.category.charAt(0).toUpperCase() + cd.category.slice(1)} performance has declined for 3 consecutive periods (dropped ${cd.drop} points).`,
      });
    });
  }

  // Rule 2: Critical Hotspot rule
  if (Array.isArray(hotspots)) {
    hotspots.forEach((hs) => {
      if (hs.priority === 1) {
        insights.push({
          id: `hotspot-critical-${hs.category}`,
          category: hs.category,
          priority: "High",
          title: `Critical Attention Needed: ${hs.category.toUpperCase()}`,
          message: hs.reason,
        });
      }
    });
  }

  // Rule 3: Energy usage reduction
  if (kpis?.monthlyElectricityKwh?.status === "improving" && kpis.monthlyElectricityKwh.changePct) {
    insights.push({
      id: "energy-kwh-improving",
      category: "energy",
      priority: "Medium",
      title: "Electricity Consumption Decreased",
      message: `Electricity usage decreased by ${Math.abs(kpis.monthlyElectricityKwh.changePct)}% compared with the previous assessment period.`,
    });
  }

  // Rule 4: Renewable energy increase
  if (kpis?.renewableEnergyPercentage?.change > 0) {
    insights.push({
      id: "renewable-share-increase",
      category: "energy",
      priority: "Medium",
      title: "Renewable Energy Share Growth",
      message: `Renewable energy adoption increased by ${kpis.renewableEnergyPercentage.change} percentage points.`,
    });
  }

  // Rule 5: Water consumption change
  if (kpis?.monthlyWaterLiters?.status === "improving" && kpis.monthlyWaterLiters.changePct) {
    insights.push({
      id: "water-liters-improving",
      category: "water",
      priority: "Medium",
      title: "Water Conservation Milestone",
      message: `Water consumption dropped by ${Math.abs(kpis.monthlyWaterLiters.changePct)}% relative to the prior period.`,
    });
  }

  // Rule 6: Recycling rate check
  if (kpis?.recycledWastePercentage?.currentValue !== null && kpis.recycledWastePercentage.currentValue < 30) {
    insights.push({
      id: "recycling-below-threshold",
      category: "waste",
      priority: "Medium",
      title: "Recycling Below Baseline Threshold",
      message: `Campus waste recycling rate (${kpis.recycledWastePercentage.currentValue}%) remains below the 30% baseline target.`,
    });
  }

  // Rule 7: Active mobility positive trend
  if (kpis?.cyclingWalkingPercentage?.status === "improving") {
    insights.push({
      id: "active-mobility-improving",
      category: "transportation",
      priority: "Low",
      title: "Active Mobility Uptick",
      message: `Zero-emissions commute (cycling & walking) share is expanding on campus.`,
    });
  }

  // Deduplicate and sort by priority (High -> Medium -> Low), max 5 items
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const uniqueMap = {};
  insights.forEach((item) => {
    if (!uniqueMap[item.id]) uniqueMap[item.id] = item;
  });

  const sortedInsights = Object.values(uniqueMap).sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return sortedInsights.slice(0, 5);
};

/**
 * Identify Best Performing and Weakest Category
 */
export const identifyCategoryExtremes = (categoryScores) => {
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return { bestCategory: null, weakestCategory: null };
  }

  const validEntries = Object.keys(categoryScores)
    .filter((cat) => categoryScores[cat] && categoryScores[cat].score !== null)
    .map((cat) => ({
      category: cat,
      score: categoryScores[cat].score,
      period: categoryScores[cat].period,
    }));

  if (validEntries.length === 0) {
    return { bestCategory: null, weakestCategory: null };
  }

  // Sort by score descending
  validEntries.sort((a, b) => b.score - a.score);

  const bestCategory = validEntries[0];
  const weakestCategory = validEntries.length > 1 ? validEntries[validEntries.length - 1] : null;

  return {
    bestCategory,
    weakestCategory,
    activeCount: validEntries.length,
  };
};
