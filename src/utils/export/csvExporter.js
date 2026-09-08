import { sortAssessmentsForCSV } from "./assessmentNormalizer";
import { formatPercentage } from "./formatters";

/**
 * Clean CSV Exporter for EcoPilot Sustainability Assessments
 * 
 * Flattens assessment records into readable category columns.
 * NEVER puts raw JSON strings or summary blocks into CSV cells.
 */
export const exportAssessmentsToCSV = (rawAssessments = []) => {
  const safe = Array.isArray(rawAssessments) ? rawAssessments : [];
  if (safe.length === 0) {
    throw new Error("No assessment records available to export.");
  }

  // Sort by Period DESC, then Category Priority (ENERGY -> WATER -> WASTE -> TRANSPORTATION -> FOOD)
  const normalizedList = sortAssessmentsForCSV(safe);

  const headers = [
    "Category",
    "Period",
    "Sustainability Score",
    "Monthly Electricity (kWh)",
    "Renewable Energy (%)",
    "Electricity Cost (INR)",
    "Monthly Water Consumption (L)",
    "Recycled Water (%)",
    "Monthly Waste (kg)",
    "Organic Waste (%)",
    "Recycled Waste (%)",
    "Public Transport (%)",
    "Private Vehicle (%)",
    "Cycling / Walking (%)",
    "Monthly Food Waste (kg)",
    "Composted Food Waste (%)",
  ];

  const escapeCSVCell = (val) => {
    if (val === null || val === undefined || val === "") return "";
    const str = String(val);
    // If text contains comma, quote, or newline, enclose in quotes and escape quotes
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [headers.map(escapeCSVCell).join(",")];

  normalizedList.forEach((item) => {
    const rowValues = [
      item.category,
      item.period,
      item.score !== null ? item.score : "",
      item.monthlyElectricityKwh !== null ? item.monthlyElectricityKwh : "",
      item.renewableEnergyPercentage !== null ? formatPercentage(item.renewableEnergyPercentage) : "",
      item.monthlyElectricityCost !== null ? item.monthlyElectricityCost : "",
      item.monthlyWaterLiters !== null ? item.monthlyWaterLiters : "",
      item.recycledWaterPercentage !== null ? formatPercentage(item.recycledWaterPercentage) : "",
      item.monthlyWasteKg !== null ? item.monthlyWasteKg : "",
      item.organicWastePercentage !== null ? formatPercentage(item.organicWastePercentage) : "",
      item.recycledWastePercentage !== null ? formatPercentage(item.recycledWastePercentage) : "",
      item.publicTransportPercentage !== null ? formatPercentage(item.publicTransportPercentage) : "",
      item.privateVehiclePercentage !== null ? formatPercentage(item.privateVehiclePercentage) : "",
      item.cyclingWalkingPercentage !== null ? formatPercentage(item.cyclingWalkingPercentage) : "",
      item.monthlyFoodWasteKg !== null ? item.monthlyFoodWasteKg : "",
      item.compostedPercentage !== null ? formatPercentage(item.compostedPercentage) : "",
    ];

    rows.push(rowValues.map(escapeCSVCell).join(","));
  });

  const csvContent = "\uFEFF" + rows.join("\r\n"); // Add UTF-8 BOM for seamless Excel double-click opening
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const dateStamp = new Date().toISOString().substring(0, 7);
  const fileName = `EcoPilot_Sustainability_Assessments_${dateStamp}.csv`;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);

  return fileName;
};
