/**
 * Export Formatters for EcoPilot Sustainability Data
 */

// Clean Date Formatter: "08 Aug 2026, 01:43 PM"
export const formatDateClean = (dateValue) => {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const timeStr = d.toLocaleString("en-US", {
      hour: "02-digit",
      minute: "02-digit",
      hour12: true,
    });

    return `${day} ${month} ${year}, ${timeStr}`;
  } catch {
    return String(dateValue);
  }
};

// Integer / Number with commas: 12500 -> "12,500"
export const formatNumberWithCommas = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-IN");
};

// Currency INR: 96000 -> "₹96,000"
export const formatCurrencyINR = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  return `₹${num.toLocaleString("en-IN")}`;
};

// Percentage: 25 -> "25%"
export const formatPercentage = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  return `${num}%`;
};

// Human-readable summary of assessment data metrics (no raw JSON)
export const formatAssessmentSummary = (category, data) => {
  if (!data || typeof data !== "object") return "Data recorded";

  const cat = (category || "").toLowerCase();

  if (cat === "energy") {
    const kwh = data.monthlyKwh ? `${formatNumberWithCommas(data.monthlyKwh)} kWh` : null;
    const ren = data.renewablePercentage !== undefined ? `${data.renewablePercentage}% Renewable` : null;
    return [kwh, ren].filter(Boolean).join(" • ") || "Energy metrics logged";
  }

  if (cat === "water") {
    const liters = data.monthlyLiters ? `${formatNumberWithCommas(data.monthlyLiters)} Liters` : null;
    const rec = data.recycledWaterPercentage !== undefined ? `${data.recycledWaterPercentage}% Recycled` : null;
    return [liters, rec].filter(Boolean).join(" • ") || "Water metrics logged";
  }

  if (cat === "waste") {
    const kg = data.monthlyKg ? `${formatNumberWithCommas(data.monthlyKg)} kg` : null;
    const rec = data.recycledWastePercentage !== undefined ? `${data.recycledWastePercentage}% Recycled` : null;
    const comp = data.compostedPercentage !== undefined ? `${data.compostedPercentage}% Composted` : null;
    return [kg, rec, comp].filter(Boolean).join(" • ") || "Waste metrics logged";
  }

  if (cat === "transportation") {
    const ev = data.evSharePercentage !== undefined ? `${data.evSharePercentage}% EV Share` : null;
    const active = data.activeTransitPercentage !== undefined ? `${data.activeTransitPercentage}% Active Transit` : null;
    return [ev, active].filter(Boolean).join(" • ") || "Transportation metrics logged";
  }

  if (cat === "food") {
    const plant = data.plantBasedPercentage !== undefined ? `${data.plantBasedPercentage}% Plant-Based` : null;
    const comp = data.compostedPercentage !== undefined ? `${data.compostedPercentage}% Composted Waste` : null;
    return [plant, comp].filter(Boolean).join(" • ") || "Food metrics logged";
  }

  // Fallback for custom or unknown categories
  const keys = Object.keys(data).filter(k => typeof data[k] !== "object" && k !== "notes");
  if (keys.length > 0) {
    return keys.slice(0, 3).map(k => `${k}: ${data[k]}`).join(" • ");
  }

  return "Assessment recorded";
};
