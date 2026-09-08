import { exportAssessmentsToExcel } from "./export/excelExporter";
import { exportAssessmentsToCSV } from "./export/csvExporter";

/**
 * Backward Compatible Export Service for EcoPilot
 */

export { exportAssessmentsToExcel, exportAssessmentsToCSV };

// Main entry point called by Analytics & Assessments page
export const exportAnalyticsToCSV = async (assessments) => {
  try {
    return await exportAssessmentsToExcel(assessments);
  } catch (err) {
    console.error("Export Error:", err);
    throw err;
  }
};
