/**
 * Centralized Metric Direction Configuration for EcoPilot Phase 2 Analytics
 * 
 * Defines whether a higher value or lower value indicates improved sustainability performance.
 */
export const METRIC_DIRECTIONS = {
  // Energy
  monthlyElectricityKwh: "lower_is_better",
  renewableEnergyPercentage: "higher_is_better",
  monthlyElectricityCost: "lower_is_better",

  // Water
  monthlyWaterLiters: "lower_is_better",
  recycledWaterPercentage: "higher_is_better",

  // Waste
  monthlyWasteKg: "lower_is_better",
  recycledWastePercentage: "higher_is_better",
  organicWastePercentage: "higher_is_better",

  // Transportation
  privateVehiclePercentage: "lower_is_better",
  publicTransportPercentage: "higher_is_better",
  cyclingWalkingPercentage: "higher_is_better",

  // Food
  monthlyFoodWasteKg: "lower_is_better",
  compostedPercentage: "higher_is_better",
};

/**
 * Returns whether a change is favorable (improving) based on metric direction
 */
export const isFavorableChange = (metricKey, changeValue) => {
  const direction = METRIC_DIRECTIONS[metricKey] || "higher_is_better";
  if (changeValue === 0) return true;
  return direction === "higher_is_better" ? changeValue > 0 : changeValue < 0;
};
