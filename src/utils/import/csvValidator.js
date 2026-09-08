import { parseCSVString } from "./csvParser";

/**
 * EcoPilot Assessment CSV Validator & Normalizer
 */

// Helper to normalize header string for matching
const normalizeHeaderStr = (str = "") =>
  str.toLowerCase().replace(/[\s\-_/()]+/g, "").trim();

// Expected Column Definitions with aliases
const REQUIRED_HEADERS_DEF = [
  { key: "category", name: "Category", aliases: ["category"] },
  { key: "period", name: "Period", aliases: ["period"] },
  { key: "score", name: "Sustainability Score", aliases: ["sustainabilityscore", "score"] },
  { key: "monthlyElectricityKwh", name: "Monthly Electricity (kWh)", aliases: ["monthlyelectricitykwh", "monthlyelectricity"] },
  { key: "renewableEnergyPercentage", name: "Renewable Energy (%)", aliases: ["renewableenergypercentage", "renewableenergy"] },
  { key: "monthlyElectricityCost", name: "Electricity Cost (INR)", aliases: ["electricitycostinr", "monthlyelectricitycost", "electricitycost"] },
  { key: "monthlyWaterLiters", name: "Monthly Water Consumption (L)", aliases: ["monthlywaterconsumptionl", "monthlywaterliters", "waterconsumption"] },
  { key: "recycledWaterPercentage", name: "Recycled Water (%)", aliases: ["recycledwaterpercentage", "recycledwater"] },
  { key: "monthlyWasteKg", name: "Monthly Waste (kg)", aliases: ["monthlywastekg", "monthlywaste"] },
  { key: "organicWastePercentage", name: "Organic Waste (%)", aliases: ["organicwastepercentage", "organicwaste"] },
  { key: "recycledWastePercentage", name: "Recycled Waste (%)", aliases: ["recycledwastepercentage", "recycledwaste"] },
  { key: "publicTransportPercentage", name: "Public Transport (%)", aliases: ["publictransportpercentage", "publictransport"] },
  { key: "privateVehiclePercentage", name: "Private Vehicle (%)", aliases: ["privatevehiclepercentage", "privatevehicle"] },
  { key: "cyclingWalkingPercentage", name: "Cycling / Walking (%)", aliases: ["cyclingwalkingpercentage", "cyclingwalking"] },
  { key: "monthlyFoodWasteKg", name: "Monthly Food Waste (kg)", aliases: ["monthlyfoodwastekg", "foodwastekg", "foodwaste"] },
  { key: "compostedPercentage", name: "Composted Food Waste (%)", aliases: ["compostedfoodwastepercentage", "compostedfoodpercentage", "compostedpercentage", "compostedfood"] },
];

/**
 * Safely parses numeric string: "12,500" -> 12500, "25%" -> 25, "₹96,000" -> 96000
 */
const parseCleanNumber = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const cleanStr = String(val)
    .replace(/[₹$,%\s]/g, "")
    .replace(/,/g, "")
    .trim();
  if (cleanStr === "") return null;
  const num = Number(cleanStr);
  return isNaN(num) ? null : num;
};

/**
 * Validates and parses uploaded CSV text
 */
export const validateAssessmentCSV = (csvText, existingAssessments = []) => {
  const { headers, rows } = parseCSVString(csvText);

  if (headers.length === 0 || rows.length === 0) {
    return {
      isValid: false,
      error: "The uploaded CSV file is empty or unreadable.",
      headers: [],
      records: [],
      errors: [],
    };
  }

  // Header Map Construction
  const headerMap = {};
  const missingHeaders = [];

  REQUIRED_HEADERS_DEF.forEach((def) => {
    let foundIndex = -1;
    for (let i = 0; i < headers.length; i++) {
      const normH = normalizeHeaderStr(headers[i]);
      if (def.aliases.some((alias) => normH.includes(alias))) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      headerMap[def.key] = foundIndex;
    } else {
      missingHeaders.push(def.name);
    }
  });

  // Check critical header requirements
  if (!("category" in headerMap) || !("period" in headerMap)) {
    return {
      isValid: false,
      error: `Invalid CSV format. Please upload an EcoPilot assessment CSV. Missing columns: ${missingHeaders.join(", ")}`,
      headers,
      records: [],
      errors: [`Missing required columns: ${missingHeaders.join(", ")}`],
    };
  }

  const validCategories = ["ENERGY", "WATER", "WASTE", "TRANSPORTATION", "FOOD"];
  const records = [];
  const errors = [];

  // Build map of existing user records for duplicate detection (category + period)
  const existingMap = new Set();
  (Array.isArray(existingAssessments) ? existingAssessments : []).forEach((a) => {
    if (a && a.category && a.period) {
      existingMap.add(`${(a.category || "").toUpperCase()}_${a.period}`);
    }
  });

  let duplicateCount = 0;
  let newCount = 0;

  // Process data rows (Row 1 is headers, so first data row is Row 2)
  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2;

    // Extract cell values safely
    const getCellVal = (key) => {
      const idx = headerMap[key];
      return idx !== undefined && idx < row.length ? row[idx] : "";
    };

    const categoryRaw = getCellVal("category").trim().toUpperCase();
    const periodRaw = getCellVal("period").trim();
    const scoreRaw = getCellVal("score").trim();

    // Skip completely empty rows
    if (!categoryRaw && !periodRaw && row.every((c) => !c.trim())) {
      return;
    }

    // 1. Validate Category
    if (!categoryRaw || !validCategories.includes(categoryRaw)) {
      errors.push(`Row ${rowNum}: Invalid category '${categoryRaw || "BLANK"}'. Allowed: ENERGY, WATER, WASTE, TRANSPORTATION, FOOD.`);
      return;
    }

    // 2. Validate Period (YYYY-MM)
    const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!periodRaw || !periodRegex.test(periodRaw)) {
      errors.push(`Row ${rowNum}: Invalid period '${periodRaw || "BLANK"}'. Must be YYYY-MM (e.g. 2026-08).`);
      return;
    }

    // 3. Validate Score
    let parsedScore = parseCleanNumber(scoreRaw);
    if (parsedScore === null || parsedScore < 0 || parsedScore > 100) {
      errors.push(`Row ${rowNum}: Invalid Sustainability Score '${scoreRaw || "BLANK"}'. Must be between 0 and 100.`);
      return;
    }

    // 4. Construct Category Specific Payload
    const dataPayload = {};
    if (categoryRaw === "ENERGY") {
      dataPayload.monthlyElectricityKwh = parseCleanNumber(getCellVal("monthlyElectricityKwh")) || 0;
      dataPayload.renewableEnergyPercentage = parseCleanNumber(getCellVal("renewableEnergyPercentage")) || 0;
      dataPayload.monthlyElectricityCost = parseCleanNumber(getCellVal("monthlyElectricityCost")) || 0;
    } else if (categoryRaw === "WATER") {
      dataPayload.monthlyWaterLiters = parseCleanNumber(getCellVal("monthlyWaterLiters")) || 0;
      dataPayload.recycledWaterPercentage = parseCleanNumber(getCellVal("recycledWaterPercentage")) || 0;
    } else if (categoryRaw === "WASTE") {
      dataPayload.monthlyWasteKg = parseCleanNumber(getCellVal("monthlyWasteKg")) || 0;
      dataPayload.organicWastePercentage = parseCleanNumber(getCellVal("organicWastePercentage")) || 0;
      dataPayload.recycledWastePercentage = parseCleanNumber(getCellVal("recycledWastePercentage")) || 0;
    } else if (categoryRaw === "TRANSPORTATION") {
      dataPayload.publicTransportPercentage = parseCleanNumber(getCellVal("publicTransportPercentage")) || 0;
      dataPayload.privateVehiclePercentage = parseCleanNumber(getCellVal("privateVehiclePercentage")) || 0;
      dataPayload.cyclingWalkingPercentage = parseCleanNumber(getCellVal("cyclingWalkingPercentage")) || 0;
    } else if (categoryRaw === "FOOD") {
      dataPayload.monthlyFoodWasteKg = parseCleanNumber(getCellVal("monthlyFoodWasteKg")) || 0;
      dataPayload.compostedPercentage = parseCleanNumber(getCellVal("compostedPercentage")) || 0;
    }

    const dupKey = `${categoryRaw}_${periodRaw}`;
    const isDuplicate = existingMap.has(dupKey);
    if (isDuplicate) {
      duplicateCount++;
    } else {
      newCount++;
    }

    records.push({
      rowNum,
      category: categoryRaw,
      period: periodRaw,
      score: parsedScore,
      data: dataPayload,
      isDuplicate,
    });
  });

  const isValid = errors.length === 0 && records.length > 0;

  return {
    isValid,
    error: errors.length > 0 ? "CSV validation failed. Please fix the errors listed below." : null,
    totalRows: records.length,
    newCount,
    duplicateCount,
    records,
    errors,
  };
};
