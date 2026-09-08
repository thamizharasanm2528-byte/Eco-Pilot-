import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { validateAssessmentCSV } from "../utils/import/csvValidator";
import { createAssessment, updateAssessment } from "../services/assessmentService";

const ImportModal = ({ isOpen, onClose, existingAssessments = [], onSuccess }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [duplicateOption, setDuplicateOption] = useState("skip"); // "skip" or "update"
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile) => {
    setImportError("");
    if (!selectedFile) return;

    // Validate file extension
    const name = selectedFile.name || "";
    if (!name.toLowerCase().endsWith(".csv")) {
      setImportError("Invalid file type. Please upload a .csv file.");
      return;
    }

    // Validate file size (max 10 MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setImportError("File size exceeds 10 MB limit.");
      return;
    }

    setFile(selectedFile);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const result = validateAssessmentCSV(text, existingAssessments);
        setValidationResult(result);
      } catch (err) {
        console.error("CSV Parse error:", err);
        setImportError("Failed to parse CSV file. Please verify file encoding.");
      } finally {
        setParsing(false);
      }
    };
    reader.onerror = () => {
      setImportError("Failed to read file.");
      setParsing(false);
    };

    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const resetState = () => {
    setFile(null);
    setValidationResult(null);
    setImportError("");
    setDuplicateOption("skip");
  };

  const handleConfirmImport = async () => {
    if (!validationResult || !validationResult.isValid || validationResult.records.length === 0) {
      return;
    }

    setImporting(true);
    setImportError("");

    try {
      const recordsToProcess = validationResult.records.filter((rec) => {
        if (duplicateOption === "skip" && rec.isDuplicate) {
          return false;
        }
        return true;
      });

      if (recordsToProcess.length === 0) {
        setImportError("No new records to import based on your duplicate selection.");
        setImporting(false);
        return;
      }

      let successCount = 0;

      // Process batch
      for (const rec of recordsToProcess) {
        const existingRec = existingAssessments.find(
          (a) =>
            a &&
            (a.category || "").toUpperCase() === rec.category &&
            a.period === rec.period
        );

        if (existingRec && duplicateOption === "update") {
          await updateAssessment(existingRec.id, {
            category: rec.category,
            period: rec.period,
            data: rec.data,
          });
        } else {
          await createAssessment({
            category: rec.category,
            period: rec.period,
            data: rec.data,
          });
        }
        successCount++;
      }

      if (onSuccess) {
        onSuccess(successCount);
      }
      onClose();
    } catch (err) {
      console.error("Batch import error:", err);
      setImportError(
        err.message || "Import failed because you do not have permission to save these assessments."
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-dark/60 backdrop-blur-xs font-sans">
      <div className="bg-white max-w-2xl w-full rounded-3xl border border-eco-border shadow-eco-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-eco-border bg-eco-bg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="icon-pill w-10 h-10 bg-white border border-eco-border text-eco-primary">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-extrabold text-slate-900">
                Import Sustainability Data
              </h2>
              <p className="text-xs font-sans text-eco-muted">
                Upload a CSV file in EcoPilot assessment format.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-eco-muted hover:bg-eco-soft hover:text-eco-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs font-sans">
          
          {importError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-heading font-bold block">Import Issue</span>
                <p className="text-[11px] leading-relaxed">{importError}</p>
              </div>
            </div>
          )}

          {!file ? (
            /* Upload / Drag-Drop Zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-3xl p-10 text-center space-y-4 transition-all cursor-pointer ${
                dragging
                  ? "border-eco-primary bg-eco-soft/80 scale-[0.99]"
                  : "border-eco-border bg-eco-bg hover:bg-eco-soft/40"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="w-14 h-14 rounded-full bg-white border border-eco-border text-eco-primary flex items-center justify-center mx-auto shadow-eco-sm">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="font-heading font-bold text-sm text-slate-900">
                  Click to upload or drag and drop CSV file
                </p>
                <p className="text-[11px] text-eco-muted">
                  Supports EcoPilot Assessment CSV export files (.csv, max 10MB)
                </p>
              </div>
              <button
                type="button"
                className="btn-eco-secondary text-xs px-5 py-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse File
              </button>
            </div>
          ) : (
            /* Selected File & Validation Preview */
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-eco-soft border border-eco-border">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-eco-primary" />
                  <div>
                    <span className="font-heading font-bold text-slate-900 block line-clamp-1">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-eco-muted">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <button
                  onClick={resetState}
                  disabled={importing}
                  className="text-xs text-eco-muted hover:text-rose-600 font-heading font-bold underline"
                >
                  Change File
                </button>
              </div>

              {parsing ? (
                <div className="py-8 text-center space-y-2 text-eco-muted">
                  <RefreshCw className="w-6 h-6 animate-spin text-eco-primary mx-auto" />
                  <p>Parsing and validating CSV contents...</p>
                </div>
              ) : validationResult ? (
                validationResult.isValid ? (
                  <div className="space-y-4">
                    {/* Summary Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-eco-primary" />
                        {validationResult.records.length} Records Found
                      </span>
                      {validationResult.duplicateCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          {validationResult.duplicateCount} Existing Duplicates
                        </span>
                      )}
                    </div>

                    {/* Duplicate Options */}
                    {validationResult.duplicateCount > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                        <span className="font-heading font-bold text-amber-900 block text-xs">
                          Duplicate Assessment Strategy
                        </span>
                        <div className="space-y-1.5 text-xs text-amber-950">
                          <label className="flex items-center space-x-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="dupOption"
                              value="skip"
                              checked={duplicateOption === "skip"}
                              onChange={() => setDuplicateOption("skip")}
                              className="text-eco-primary focus:ring-eco-primary"
                            />
                            <span>Import New Records Only (Skip {validationResult.duplicateCount} existing)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="dupOption"
                              value="update"
                              checked={duplicateOption === "update"}
                              onChange={() => setDuplicateOption("update")}
                              className="text-eco-primary focus:ring-eco-primary"
                            />
                            <span>Import & Update All (Overwrite {validationResult.duplicateCount} existing)</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Parsed Record Preview List */}
                    <div className="space-y-2">
                      <span className="font-heading font-bold text-slate-800 text-xs uppercase tracking-wider block">
                        Validated Records Preview
                      </span>
                      <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                        {validationResult.records.map((rec, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                              rec.isDuplicate
                                ? "bg-amber-50/40 border-amber-200"
                                : "bg-white border-eco-border"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <CheckCircle2 className="w-4 h-4 text-eco-primary shrink-0" />
                              <span className="font-heading font-bold text-slate-900">
                                {rec.category}
                              </span>
                              <span className="text-eco-muted font-sans">—</span>
                              <span className="text-slate-700 font-medium">{rec.period}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary">
                                Score: {rec.score}
                              </span>
                            </div>
                            {rec.isDuplicate && (
                              <span className="text-[10px] font-heading font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                Existing
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Validation Errors List */
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 text-rose-900">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <h4 className="font-heading font-bold text-sm">CSV Validation Failed</h4>
                    </div>
                    <p className="text-xs text-rose-800">
                      {validationResult.error}
                    </p>
                    <div className="max-h-44 overflow-y-auto space-y-1.5 border-t border-rose-200 pt-2 text-xs font-mono text-rose-800">
                      {validationResult.errors.map((err, i) => (
                        <div key={i} className="flex items-start space-x-1">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : null}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-eco-border bg-eco-bg flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="btn-eco-secondary px-6 py-2.5 text-xs rounded-full"
          >
            Cancel
          </button>

          {validationResult && validationResult.isValid && (
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={importing}
              className="btn-eco-primary px-7 py-2.5 text-xs rounded-full disabled:opacity-50"
            >
              {importing ? (
                <span className="flex items-center">
                  <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Importing assessments...
                </span>
              ) : (
                <span className="flex items-center">
                  <span>
                    Import {duplicateOption === "skip" ? validationResult.newCount : validationResult.records.length} Records
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </span>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImportModal;
