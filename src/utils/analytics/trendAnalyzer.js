import { isFavorableChange } from "./metricDirection";
import { calculateCategoryScore } from "../sustainabilityCalculator";

/**
 * Determines trend direction between two values using a 2% threshold to avoid noise.
 * Returns: 'improving' | 'declining' | 'stable' | 'insufficient_data'
 */
export const getTrendDirection = (currentVal, previousVal, metricKey = "score") => {
  if (previousVal === null || previousVal === undefined || currentVal === null || currentVal === undefined) {
    return "insufficient_data";
  }

  const diff = currentVal - previousVal;
  const pctChange = previousVal !== 0 ? (diff / Math.abs(previousVal)) * 100 : diff;

  // Threshold: absolute change under 2% is considered stable
  if (Math.abs(pctChange) < 2) {
    return "stable";
  }

  const favorable = isFavorableChange(metricKey, diff);
  return favorable ? "improving" : "declining";
};

/**
 * Analyzes multi-period trends and groups data chronologically
 */
export const analyzePeriodTrends = (assessments) => {
  const safe = Array.isArray(assessments) ? assessments : [];
  if (safe.length === 0) {
    return {
      periodTrendList: [],
      overallTrendDirection: "insufficient_data",
      consecutiveDeclines: [],
      consecutiveImprovements: [],
    };
  }

  // Group assessments by period
  const periodsMap = {};
  safe.forEach((item) => {
    if (!item) return;
    const p = item.period || "Unknown";
    if (!periodsMap[p]) {
      periodsMap[p] = [];
    }
    periodsMap[p].push(item);
  });

  // Sort periods chronologically
  const sortedPeriods = Object.keys(periodsMap).sort((a, b) => new Date(a) - new Date(b));

  const periodTrendList = sortedPeriods.map((p) => {
    const list = periodsMap[p];
    const catScores = {};
    let sum = 0;
    let count = 0;

    list.forEach((item) => {
      const cat = (item.category || "").toLowerCase();
      const score = calculateCategoryScore(cat, item.data);
      catScores[cat] = score;
      sum += score;
      count += 1;
    });

    const overallScore = count > 0 ? Math.round(sum / count) : 0;

    return {
      period: p,
      overallScore,
      categoryScores: catScores,
      assessmentCount: count,
    };
  });

  // Determine overall trend direction
  let overallTrendDirection = "insufficient_data";
  if (periodTrendList.length >= 2) {
    const last = periodTrendList[periodTrendList.length - 1].overallScore;
    const prev = periodTrendList[periodTrendList.length - 2].overallScore;
    overallTrendDirection = getTrendDirection(last, prev, "score");
  }

  // Detect 2+ consecutive declines / improvements per category
  const consecutiveDeclines = [];
  const consecutiveImprovements = [];
  const categories = ["energy", "water", "waste", "transportation", "food"];

  categories.forEach((cat) => {
    const catHistory = periodTrendList
      .filter((pt) => pt.categoryScores[cat] !== undefined)
      .map((pt) => pt.categoryScores[cat]);

    if (catHistory.length >= 3) {
      const len = catHistory.length;
      const last = catHistory[len - 1];
      const mid = catHistory[len - 2];
      const first = catHistory[len - 3];

      if (last < mid && mid < first) {
        consecutiveDeclines.push({
          category: cat,
          periods: [sortedPeriods[len - 3], sortedPeriods[len - 2], sortedPeriods[len - 1]],
          drop: first - last,
        });
      } else if (last > mid && mid > first) {
        consecutiveImprovements.push({
          category: cat,
          periods: [sortedPeriods[len - 3], sortedPeriods[len - 2], sortedPeriods[len - 1]],
          gain: last - first,
        });
      }
    }
  });

  return {
    periodTrendList,
    overallTrendDirection,
    consecutiveDeclines,
    consecutiveImprovements,
  };
};
