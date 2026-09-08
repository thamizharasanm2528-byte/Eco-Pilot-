/**
 * Robust Native CSV Parser for EcoPilot
 * 
 * Handles:
 * - UTF-8 BOM (\uFEFF)
 * - Quoted values with escaped quotes ("")
 * - Internal commas inside quoted cells
 * - Windows (\r\n) and Unix (\n) line breaks
 * - Trailing empty lines
 */

export const parseCSVString = (csvText) => {
  if (!csvText || typeof csvText !== "string") {
    return { headers: [], rows: [] };
  }

  // Strip UTF-8 BOM if present
  let cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) {
    return { headers: [], rows: [] };
  }

  const lines = [];
  let currentCell = "";
  let currentRow = [];
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote ("") inside quoted cell
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Cell delimiter
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      // Line break outside quotes
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  // Add final cell & row if remaining
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].map((h) => h.replace(/^["']|["']$/g, "").trim());
  const rows = lines.slice(1);

  return { headers, rows };
};
