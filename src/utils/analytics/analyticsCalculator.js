import { calculateOverallSustainabilityScore } from "../sustainabilityCalculator";
import { analyzePeriodTrends, getTrendDirection } from "./trendAnalyzer";
import { detectHotspots } from "./hotspotDetector";
import { calculateKPIs } from "./kpiCalculator";
import { evaluateCampusBenchmark } from "./benchmarkCalculator";
import { generateAnalyticsInsights, identifyCategoryExtremes } from "./insightGenerator";

/**
 * Central Phase 2 Analytics Calculator Engine
 * 
 * Takes raw Firestore assessments array and returns a fully normalized, null-safe
 * analytics structure.
 */
export const calculateAnalytics = (assessments) => {
  const safe = Array.isArray(assessments) ? assessments : [];

  // Default empty normalized result
  if (safe.length === 0) {
    return {
      overall: { score: null, previousScore: null, change: null, changePct: null, status: "insufficient_data" },
      completeness: {
        activeCategories: 0,
        totalCategories: 5,
        percentage: 0,
        categoryChecklist: { energy: false, water: false, waste: false, transportation: false, food: false },
      },
      coverage: {
        totalAssessments: 0,
        representedCategories: 0,
        representedPeriods: 0,
        oldestPeriod: null,
        latestPeriod: null,
      },
      categoryScores: { energy: null, water: null, waste: null, transportation: null, food: null },
      periodTrends: { periodTrendList: [], overallTrendDirection: "insufficient_data", consecutiveDeclines: [], consecutiveImprovements: [] },
      kpis: calculateKPIs([]),
      hotspots: [],
      insights: [],
      benchmark: evaluateCampusBenchmark(null, {}),
      extremes: { bestCategory: null, weakestCategory: null, activeCount: 0 },
    };
  }

  // 1. Overall Sustainability Score & Category Scores
  const { overallScore, activeCategoryCount, categoryScores } = calculateOverallSustainabilityScore(safe);

  // 2. Period Trends
  const periodTrends = analyzePeriodTrends(safe);
  const trendList = periodTrends.periodTrendList || [];

  let previousOverallScore = null;
  let overallChange = null;
  let overallChangePct = null;
  let overallStatus = "insufficient_data";

  if (trendList.length >= 2) {
    previousOverallScore = trendList[trendList.length - 2].overallScore;
    overallChange = overallScore - previousOverallScore;
    overallChangePct = previousOverallScore !== 0 ? Number(((overallChange / previousOverallScore) * 100).toFixed(1)) : 0;
    overallStatus = getTrendDirection(overallScore, previousOverallScore, "score");
  }

  // 3. Data Completeness Calculation
  const categoriesList = ["energy", "water", "waste", "transportation", "food"];
  const categoryChecklist = {};
  let activeCount = 0;

  categoriesList.forEach((cat) => {
    const hasData = Boolean(categoryScores?.[cat] && categoryScores[cat].score !== null);
    categoryChecklist[cat] = hasData;
    if (hasData) activeCount += 1;
  });

  const completenessPercentage = Math.round((activeCount / 5) * 100);

  // 4. Assessment Coverage Metadata
  const periodsSet = new Set(safe.map((a) => a.period).filter(Boolean));
  const sortedPeriods = Array.from(periodsSet).sort((a, b) => new Date(a) - new Date(b));

  const coverage = {
    totalAssessments: safe.length,
    representedCategories: activeCount,
    representedPeriods: periodsSet.size,
    oldestPeriod: sortedPeriods.length > 0 ? sortedPeriods[0] : null,
    latestPeriod: sortedPeriods.length > 0 ? sortedPeriods[sortedPeriods.length - 1] : null,
  };

  // 5. KPIs Calculation
  const kpis = calculateKPIs(safe);

  // 6. Hotspots Detection
  const hotspots = detectHotspots(categoryScores, periodTrends.periodTrendList);

  // 7. Reference Benchmarking
  const benchmark = evaluateCampusBenchmark(overallScore, categoryScores);

  // 8. Deterministic Insights & Extremes
  const insights = generateAnalyticsInsights(kpis, periodTrends, categoryScores, hotspots);
  const extremes = identifyCategoryExtremes(categoryScores);

  return {
    overall: {
      score: overallScore,
      previousScore: previousOverallScore,
      change: overallChange,
      changePct: overallChangePct,
      status: overallStatus,
    },
    completeness: {
      activeCategories: activeCount,
      totalCategories: 5,
      percentage: completenessPercentage,
      categoryChecklist,
    },
    coverage,
    categoryScores,
    periodTrends,
    kpis,
    hotspots,
    insights,
    benchmark,
    extremes,
  };
};
