import ExcelJS from "exceljs";
import { sortAssessmentsDesc } from "./assessmentNormalizer";

/**
 * Final Clean Excel Exporter for EcoPilot Sustainability Assessments
 * 
 * Generates an Excel Workbook (.xlsx) with EXACTLY 6 sheets:
 * 1. Assessments
 * 2. Energy
 * 3. Water
 * 4. Waste
 * 5. Transportation
 * 6. Food
 * 
 * NO Summary sheet, NO raw JSON strings, NO empty column clutter.
 */
export const generateAssessmentWorkbook = async (rawAssessments = []) => {
  const normalizedList = sortAssessmentsDesc(rawAssessments);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "EcoPilot Platform";
  workbook.lastModifiedBy = "EcoPilot Sustainability Engine";
  workbook.created = new Date();

  // Color & Style Constants
  const COLOR_HEADER_BG = "123C25"; // Dark Green
  const COLOR_HEADER_TEXT = "FFFFFF";
  const COLOR_ROW_ALT = "F5FAF5"; // Soft Green Tint
  const COLOR_BORDER = "DCE8DE";

  const thinBorder = {
    top: { style: "thin", color: { argb: COLOR_BORDER } },
    left: { style: "thin", color: { argb: COLOR_BORDER } },
    bottom: { style: "thin", color: { argb: COLOR_BORDER } },
    right: { style: "thin", color: { argb: COLOR_BORDER } },
  };

  const applyHeaderStyle = (row) => {
    row.height = 28;
    row.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: COLOR_HEADER_TEXT } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER_BG } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = thinBorder;
    });
  };

  // =========================================================================
  // SHEET 1 — "Assessments" (Main Overview)
  // =========================================================================
  const sheetAssessments = workbook.addWorksheet("Assessments", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheetAssessments.columns = [
    { header: "Category", key: "category", width: 18 },
    { header: "Period", key: "period", width: 14 },
    { header: "Sustainability Score", key: "score", width: 22 },
    { header: "Key Metrics", key: "keyMetricsSummary", width: 68 },
    { header: "Created At", key: "createdAtFormatted", width: 24 },
    { header: "Updated At", key: "updatedAtFormatted", width: 24 },
  ];

  applyHeaderStyle(sheetAssessments.getRow(1));
  sheetAssessments.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 6 } };

  if (normalizedList.length === 0) {
    sheetAssessments.mergeCells("A2:F2");
    const emptyCell = sheetAssessments.getCell("A2");
    emptyCell.value = "No assessment data available.";
    emptyCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "52635A" } };
    emptyCell.alignment = { horizontal: "center", vertical: "middle" };
    emptyCell.border = thinBorder;
    sheetAssessments.getRow(2).height = 24;
  } else {
    normalizedList.forEach((item, index) => {
      const row = sheetAssessments.addRow({
        category: item.category,
        period: item.period,
        score: item.score !== null ? item.score : "",
        keyMetricsSummary: item.keyMetricsSummary,
        createdAtFormatted: item.createdAtFormatted,
        updatedAtFormatted: item.updatedAtFormatted,
      });

      row.height = 24;
      const isEven = index % 2 === 1;

      row.eachCell((cell, colNumber) => {
        cell.font = { name: "Arial", size: 9 };
        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber <= 3 || colNumber >= 5 ? "center" : "left",
          wrapText: colNumber === 4,
        };
        cell.border = thinBorder;
        if (isEven) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_ROW_ALT } };

        if (colNumber === 3 && typeof cell.value === "number") {
          cell.numFmt = "0";
        }
      });
    });
  }

  // Helper to build dedicated Category Sheet
  const buildCategorySheet = ({
    sheetName,
    categoryKey,
    columnsDef,
  }) => {
    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    sheet.columns = columnsDef;
    applyHeaderStyle(sheet.getRow(1));
    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columnsDef.length } };

    const categoryItems = normalizedList.filter((a) => a.category === categoryKey);

    if (categoryItems.length === 0) {
      sheet.mergeCells(`A2:${String.fromCharCode(64 + columnsDef.length)}2`);
      const emptyCell = sheet.getCell("A2");
      emptyCell.value = "No assessment data available.";
      emptyCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "52635A" } };
      emptyCell.alignment = { horizontal: "center", vertical: "middle" };
      emptyCell.border = thinBorder;
      sheet.getRow(2).height = 24;
      return;
    }

    categoryItems.forEach((item, index) => {
      const rowData = {};
      columnsDef.forEach((col) => {
        const val = item[col.key];
        rowData[col.key] = val !== null && val !== undefined ? val : "";
      });

      const row = sheet.addRow(rowData);
      row.height = 22;
      const isEven = index % 2 === 1;

      row.eachCell((cell, colNumber) => {
        cell.font = { name: "Arial", size: 9 };
        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber <= 2 || colNumber >= columnsDef.length - 1 ? "center" : "right",
        };
        cell.border = thinBorder;
        if (isEven) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_ROW_ALT } };

        // Number Formats based on column def numFmt
        const fmt = columnsDef[colNumber - 1]?.numFmt;
        if (fmt && typeof cell.value === "number") {
          cell.numFmt = fmt;
        }
      });
    });
  };

  // =========================================================================
  // SHEET 2 — "Energy"
  // =========================================================================
  buildCategorySheet({
    sheetName: "Energy",
    categoryKey: "ENERGY",
    columnsDef: [
      { header: "Period", key: "period", width: 14 },
      { header: "Sustainability Score", key: "score", width: 22, numFmt: "0" },
      { header: "Monthly Electricity (kWh)", key: "monthlyElectricityKwh", width: 26, numFmt: "#,##0" },
      { header: "Renewable Energy (%)", key: "renewableEnergyPercentage", width: 22, numFmt: '0"%"' },
      { header: "Electricity Cost (INR)", key: "monthlyElectricityCost", width: 22, numFmt: '"₹"#,##0' },
      { header: "Created At", key: "createdAtFormatted", width: 24 },
      { header: "Updated At", key: "updatedAtFormatted", width: 24 },
    ],
  });

  // =========================================================================
  // SHEET 3 — "Water"
  // =========================================================================
  buildCategorySheet({
    sheetName: "Water",
    categoryKey: "WATER",
    columnsDef: [
      { header: "Period", key: "period", width: 14 },
      { header: "Sustainability Score", key: "score", width: 22, numFmt: "0" },
      { header: "Monthly Water Consumption (L)", key: "monthlyWaterLiters", width: 28, numFmt: "#,##0" },
      { header: "Recycled Water (%)", key: "recycledWaterPercentage", width: 22, numFmt: '0"%"' },
      { header: "Created At", key: "createdAtFormatted", width: 24 },
      { header: "Updated At", key: "updatedAtFormatted", width: 24 },
    ],
  });

  // =========================================================================
  // SHEET 4 — "Waste"
  // =========================================================================
  buildCategorySheet({
    sheetName: "Waste",
    categoryKey: "WASTE",
    columnsDef: [
      { header: "Period", key: "period", width: 14 },
      { header: "Sustainability Score", key: "score", width: 22, numFmt: "0" },
      { header: "Monthly Waste (kg)", key: "monthlyWasteKg", width: 22, numFmt: "#,##0" },
      { header: "Organic Waste (%)", key: "organicWastePercentage", width: 20, numFmt: '0"%"' },
      { header: "Recycled Waste (%)", key: "recycledWastePercentage", width: 20, numFmt: '0"%"' },
      { header: "Created At", key: "createdAtFormatted", width: 24 },
      { header: "Updated At", key: "updatedAtFormatted", width: 24 },
    ],
  });

  // =========================================================================
  // SHEET 5 — "Transportation"
  // =========================================================================
  buildCategorySheet({
    sheetName: "Transportation",
    categoryKey: "TRANSPORTATION",
    columnsDef: [
      { header: "Period", key: "period", width: 14 },
      { header: "Sustainability Score", key: "score", width: 22, numFmt: "0" },
      { header: "Public Transport (%)", key: "publicTransportPercentage", width: 22, numFmt: '0"%"' },
      { header: "Private Vehicle (%)", key: "privateVehiclePercentage", width: 22, numFmt: '0"%"' },
      { header: "Cycling / Walking (%)", key: "cyclingWalkingPercentage", width: 22, numFmt: '0"%"' },
      { header: "Created At", key: "createdAtFormatted", width: 24 },
      { header: "Updated At", key: "updatedAtFormatted", width: 24 },
    ],
  });

  // =========================================================================
  // SHEET 6 — "Food"
  // =========================================================================
  buildCategorySheet({
    sheetName: "Food",
    categoryKey: "FOOD",
    columnsDef: [
      { header: "Period", key: "period", width: 14 },
      { header: "Sustainability Score", key: "score", width: 22, numFmt: "0" },
      { header: "Food Waste (kg)", key: "monthlyFoodWasteKg", width: 22, numFmt: "#,##0" },
      { header: "Composted Food (%)", key: "compostedPercentage", width: 20, numFmt: '0"%"' },
      { header: "Created At", key: "createdAtFormatted", width: 24 },
      { header: "Updated At", key: "updatedAtFormatted", width: 24 },
    ],
  });

  return workbook;
};

/**
 * Triggers Excel Download in Browser
 */
export const exportAssessmentsToExcel = async (rawAssessments = []) => {
  const safe = Array.isArray(rawAssessments) ? rawAssessments : [];
  if (safe.length === 0) {
    throw new Error("No assessment records available for export.");
  }

  const workbook = await generateAssessmentWorkbook(safe);
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const dateStamp = new Date().toISOString().substring(0, 10);
  const fileName = `EcoPilot_Sustainability_Assessments_${dateStamp}.xlsx`;

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
