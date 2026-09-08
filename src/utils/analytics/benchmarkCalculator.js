/**
 * EcoPilot Reference Benchmark Calculator
 * 
 * Provides configurable prototype benchmark targets (Default: 75/100)
 * and calculates current score gap against reference targets.
 */

export const DEFAULT_BENCHMARK_TARGETS = {
  overall: 75,
  energy: 75,
  water: 75,
  waste: 75,
  transportation: 75,
  food: 75,
};

export const calculateBenchmarkGap = (currentScore, targetScore = 75) => {
  if (currentScore === null || currentScore === undefined) {
    return { gap: null, text: "No benchmark comparison data", status: "no_data" };
  }

  const gap = currentScore - targetScore;
  let text = "";
  let status = "on_target";

  if (gap < 0) {
    text = `${Math.abs(gap)} points below reference target`;
    status = "below_target";
  } else if (gap > 0) {
    text = `${gap} points above reference target`;
    status = "above_target";
  } else {
    text = "Exactly meeting reference target";
    status = "on_target";
  }

  return {
    currentScore,
    targetScore,
    gap,
    text,
    status,
    label: "EcoPilot Reference Benchmark — prototype threshold",
  };
};

export const evaluateCampusBenchmark = (overallScore, categoryScores, targets = DEFAULT_BENCHMARK_TARGETS) => {
  const overallGap = calculateBenchmarkGap(overallScore, targets.overall);

  const categoryGaps = {};
  const validCategories = ["energy", "water", "waste", "transportation", "food"];

  validCategories.forEach((cat) => {
    const score = categoryScores?.[cat]?.score;
    categoryGaps[cat] = calculateBenchmarkGap(score, targets[cat] || 75);
  });

  return {
    overallGap,
    categoryGaps,
    targets,
  };
};
