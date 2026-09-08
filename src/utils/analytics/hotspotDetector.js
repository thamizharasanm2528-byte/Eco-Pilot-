/**
 * Deterministic Hotspot Detector for EcoPilot Phase 2
 * 
 * Identifies operational categories requiring immediate campus management attention.
 * Label: "Analytics-based hotspot" (Deterministic, NOT AI).
 */

export const getPerformanceStatus = (score, trend = "stable") => {
  if (score === null || score === undefined) return "No Data";

  if (score < 40 || (score < 55 && trend === "declining")) {
    return "Critical";
  }
  if (score < 60 || (score < 70 && trend === "declining")) {
    return "Needs Attention";
  }
  if (score < 80) {
    return "Moderate";
  }
  return "Strong";
};

export const detectHotspots = (categoryScores, periodTrends) => {
  if (!categoryScores || Object.keys(categoryScores).length === 0) {
    return [];
  }

  const hotspots = [];
  const validCategories = ["energy", "water", "waste", "transportation", "food"];

  validCategories.forEach((cat) => {
    const item = categoryScores[cat];
    if (!item) return;

    const score = item.score;
    const trend = periodTrends?.[cat] || "stable";
    const status = getPerformanceStatus(score, trend);

    if (status === "Critical" || status === "Needs Attention") {
      let reason = "";
      if (score < 40 && trend === "declining") {
        reason = "Critically low performance combined with a declining trend.";
      } else if (score < 40) {
        reason = "Critically low baseline performance score below configured benchmark.";
      } else if (trend === "declining") {
        reason = "Declining performance trend over recent assessment periods.";
      } else {
        reason = "Sub-optimal category score requiring operational attention.";
      }

      hotspots.push({
        category: cat,
        score,
        trend,
        status,
        reason,
        priority: status === "Critical" ? 1 : 2,
        period: item.period || "Latest",
      });
    }
  });

  // Sort hotspots by priority (Critical first, then lowest score)
  return hotspots.sort((a, b) => a.priority - b.priority || a.score - b.score);
};
