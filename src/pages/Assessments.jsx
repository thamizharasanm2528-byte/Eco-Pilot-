import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  createAssessment,
  getUserAssessments,
  updateAssessment,
  deleteAssessment,
} from "../services/assessmentService";
import {
  calculateCategoryScore,
  getScoreExplanation,
} from "../utils/sustainabilityCalculator";
import { formatAssessmentSummary } from "../utils/export/formatters";
import ImportModal from "../components/ImportModal";
import {
  ClipboardList,
  Zap,
  Droplet,
  Trash2,
  Bus,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Eye,
  Edit2,
  Trash,
  X,
  Filter,
  ArrowUpDown,
  Info,
  Upload,
} from "lucide-react";

const Assessments = () => {
  const { currentUser } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("Energy");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userAssessments, setUserAssessments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter & Sort state
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  // Modal States
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessmentId, setDeletingAssessmentId] = useState(null);


  // Default period: Current Month (YYYY-MM)
  const currentPeriodDefault = new Date().toISOString().substring(0, 7);

  // Form State
  const [formData, setFormData] = useState({
    period: currentPeriodDefault,
    // Energy
    monthlyElectricityKwh: "",
    renewableEnergyPercentage: "",
    monthlyElectricityCost: "",
    // Water
    monthlyWaterLiters: "",
    recycledWaterPercentage: "",
    // Waste
    monthlyWasteKg: "",
    recycledWastePercentage: "",
    organicWastePercentage: "",
    // Transportation
    privateVehiclePercentage: "",
    publicTransportPercentage: "",
    cyclingWalkingPercentage: "",
    // Food
    monthlyFoodWasteKg: "",
    compostedPercentage: "",
  });

  const categories = [
    { id: "Energy", icon: Zap, label: "Energy" },
    { id: "Water", icon: Droplet, label: "Water" },
    { id: "Waste", icon: Trash2, label: "Waste" },
    { id: "Transportation", icon: Bus, label: "Transportation" },
    { id: "Food", icon: Utensils, label: "Food" },
  ];

  // Fetch assessments
  const fetchAssessments = async () => {
    if (!currentUser) return;
    setLoadingHistory(true);
    try {
      const data = await getUserAssessments();
      setUserAssessments(data);
    } catch (err) {
      console.error("Error fetching assessments:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form inputs for active category
  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      period: currentPeriodDefault,
      monthlyElectricityKwh: "",
      renewableEnergyPercentage: "",
      monthlyElectricityCost: "",
      monthlyWaterLiters: "",
      recycledWaterPercentage: "",
      monthlyWasteKg: "",
      recycledWastePercentage: "",
      organicWastePercentage: "",
      privateVehiclePercentage: "",
      publicTransportPercentage: "",
      cyclingWalkingPercentage: "",
      monthlyFoodWasteKg: "",
      compostedPercentage: "",
    }));
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!currentUser) {
      setErrorMessage("You must be logged in to submit an assessment.");
      return;
    }

    const period = formData.period || currentPeriodDefault;
    let payload = {};

    // Validate Category Specific Inputs
    if (activeCategory === "Energy") {
      const kwh = Number(formData.monthlyElectricityKwh);
      const renew = Number(formData.renewableEnergyPercentage || 0);
      const cost = formData.monthlyElectricityCost !== "" ? Number(formData.monthlyElectricityCost) : null;

      if (isNaN(kwh) || kwh < 0) {
        setErrorMessage("Monthly electricity consumption must be a positive number.");
        return;
      }
      if (isNaN(renew) || renew < 0 || renew > 100) {
        setErrorMessage("Renewable energy percentage must be between 0 and 100.");
        return;
      }
      if (cost !== null && (isNaN(cost) || cost < 0)) {
        setErrorMessage("Monthly electricity cost must be a positive number.");
        return;
      }

      payload = {
        monthlyElectricityKwh: kwh,
        renewableEnergyPercentage: renew,
        monthlyElectricityCost: cost,
      };
    } else if (activeCategory === "Water") {
      const liters = Number(formData.monthlyWaterLiters);
      const recycled = Number(formData.recycledWaterPercentage || 0);

      if (isNaN(liters) || liters < 0) {
        setErrorMessage("Monthly water consumption must be a positive number.");
        return;
      }
      if (isNaN(recycled) || recycled < 0 || recycled > 100) {
        setErrorMessage("Recycled water percentage must be between 0 and 100.");
        return;
      }

      payload = {
        monthlyWaterLiters: liters,
        recycledWaterPercentage: recycled,
      };
    } else if (activeCategory === "Waste") {
      const wasteKg = Number(formData.monthlyWasteKg);
      const recycled = Number(formData.recycledWastePercentage || 0);
      const organic = Number(formData.organicWastePercentage || 0);

      if (isNaN(wasteKg) || wasteKg < 0) {
        setErrorMessage("Total monthly waste must be a positive number.");
        return;
      }
      if (isNaN(recycled) || recycled < 0 || recycled > 100) {
        setErrorMessage("Recycled waste percentage must be between 0 and 100.");
        return;
      }
      if (isNaN(organic) || organic < 0 || organic > 100) {
        setErrorMessage("Organic waste percentage must be between 0 and 100.");
        return;
      }

      payload = {
        monthlyWasteKg: wasteKg,
        recycledWastePercentage: recycled,
        organicWastePercentage: organic,
      };
    } else if (activeCategory === "Transportation") {
      const pVeh = Number(formData.privateVehiclePercentage || 0);
      const pubTrans = Number(formData.publicTransportPercentage || 0);
      const cycleWalk = Number(formData.cyclingWalkingPercentage || 0);

      if (pVeh < 0 || pVeh > 100 || pubTrans < 0 || pubTrans > 100 || cycleWalk < 0 || cycleWalk > 100) {
        setErrorMessage("Percentages must be between 0% and 100%.");
        return;
      }

      const totalPct = pVeh + pubTrans + cycleWalk;
      if (totalPct > 100) {
        setErrorMessage(`Transportation commute percentages total ${totalPct}%, which exceeds 100%. Please adjust values.`);
        return;
      }

      payload = {
        privateVehiclePercentage: pVeh,
        publicTransportPercentage: pubTrans,
        cyclingWalkingPercentage: cycleWalk,
      };
    } else if (activeCategory === "Food") {
      const foodKg = Number(formData.monthlyFoodWasteKg);
      const composted = Number(formData.compostedPercentage || 0);

      if (isNaN(foodKg) || foodKg < 0) {
        setErrorMessage("Monthly food waste must be a positive number.");
        return;
      }
      if (isNaN(composted) || composted < 0 || composted > 100) {
        setErrorMessage("Composted percentage must be between 0 and 100.");
        return;
      }

      payload = {
        monthlyFoodWasteKg: foodKg,
        compostedPercentage: composted,
      };
    }

    setSubmitting(true);
    try {
      await createAssessment({
        category: activeCategory.toLowerCase(),
        period,
        data: payload,
      });
      setSuccessMessage(`${activeCategory} assessment saved successfully.`);
      resetForm();
      await fetchAssessments();
    } catch (err) {
      setErrorMessage(err.message || "Failed to save assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Assessment
  const handleDeleteConfirm = async () => {
    if (!deletingAssessmentId) return;
    try {
      await deleteAssessment(deletingAssessmentId);
      setSuccessMessage("Assessment deleted successfully.");
      setDeletingAssessmentId(null);
      await fetchAssessments();
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete assessment.");
    }
  };

  // Save Edit Assessment
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAssessment) return;

    try {
      await updateAssessment(editingAssessment.id, {
        category: editingAssessment.category,
        period: editingAssessment.period,
        data: editingAssessment.data,
      });
      setSuccessMessage("Assessment updated successfully.");
      setEditingAssessment(null);
      await fetchAssessments();
    } catch (err) {
      setErrorMessage(err.message || "Failed to update assessment.");
    }
  };

  // Filtered & Sorted Assessments list
  const filteredAssessments = userAssessments
    .filter((a) => {
      if (filterCategory === "All") return true;
      return (a.category || "").toLowerCase() === filterCategory.toLowerCase();
    })
    .sort((a, b) => {
      const dateA = new Date(a.period || a.createdAt);
      const dateB = new Date(b.period || b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const [exporting, setExporting] = useState(false);

  const handleExport = async (format = "excel") => {
    if (!userAssessments || userAssessments.length === 0) {
      setErrorMessage("No assessment records available to export.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setExporting(true);
    setSuccessMessage("Preparing your export...");

    try {
      if (format === "csv") {
        const { exportAssessmentsToCSV } = await import("../utils/export/csvExporter");
        exportAssessmentsToCSV(userAssessments);
      } else {
        const { exportAssessmentsToExcel } = await import("../utils/export/excelExporter");
        await exportAssessmentsToExcel(userAssessments);
      }
      setSuccessMessage("Export completed successfully.");
    } catch (err) {
      console.error("Export error:", err);
      setErrorMessage("Unable to export assessments. Please try again.");
    } finally {
      setExporting(false);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* Header */}
          <div className="card-eco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight flex items-center">
                <ClipboardList className="w-6 h-6 mr-2.5 text-eco-primary" />
                Sustainability Assessments
              </h1>
              <p className="text-xs sm:text-sm font-sans text-eco-muted mt-1">
                Log operational campus data for Energy, Water, Waste, Transportation, and Food to update your real baseline score.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="btn-eco-secondary py-2.5 px-4 text-xs rounded-2xl border border-eco-border"
                title="Import Sustainability Data from CSV"
              >
                <Upload className="w-4 h-4 mr-1.5 text-eco-primary" />
                <span>Import Data</span>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-eco-soft border border-eco-border text-xs font-heading font-semibold text-eco-primary flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-eco-primary shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-heading font-semibold text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Tabs & Form */}
          <div className="card-eco p-6 space-y-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-3 border-b border-eco-border">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-eco-primary text-white shadow-eco-sm"
                        : "bg-eco-bg text-eco-muted hover:bg-eco-soft"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-eco-primary"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>


            {/* Assessment Entry Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  {activeCategory} Assessment Form
                </h3>
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-semibold text-slate-600">Period:</label>
                  <input
                    type="month"
                    name="period"
                    required
                    value={formData.period}
                    onChange={handleChange}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* ENERGY FORM */}
              {activeCategory === "Energy" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monthly Electricity Consumption (kWh) *
                    </label>
                    <input
                      type="number"
                      name="monthlyElectricityKwh"
                      required
                      min="0"
                      value={formData.monthlyElectricityKwh}
                      onChange={handleChange}
                      placeholder="12500"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Approximate electricity consumed by campus.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Renewable Energy Percentage (%) *
                    </label>
                    <input
                      type="number"
                      name="renewableEnergyPercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.renewableEnergyPercentage}
                      onChange={handleChange}
                      placeholder="35"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Percentage from solar, wind, or green grid.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monthly Electricity Cost (INR)
                    </label>
                    <input
                      type="number"
                      name="monthlyElectricityCost"
                      min="0"
                      value={formData.monthlyElectricityCost}
                      onChange={handleChange}
                      placeholder="Optional e.g. 150000"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Optional utility bill cost in INR.</p>
                  </div>
                </div>
              )}

              {/* WATER FORM */}
              {activeCategory === "Water" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monthly Water Consumption (Liters) *
                    </label>
                    <input
                      type="number"
                      name="monthlyWaterLiters"
                      required
                      min="0"
                      value={formData.monthlyWaterLiters}
                      onChange={handleChange}
                      placeholder="45000"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Total fresh water used across facilities.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recycled Water Percentage (%) *
                    </label>
                    <input
                      type="number"
                      name="recycledWaterPercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.recycledWaterPercentage}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Greywater/rainwater recycled %.</p>
                  </div>
                </div>
              )}

              {/* WASTE FORM */}
              {activeCategory === "Waste" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Monthly Waste (kg) *
                    </label>
                    <input
                      type="number"
                      name="monthlyWasteKg"
                      required
                      min="0"
                      value={formData.monthlyWasteKg}
                      onChange={handleChange}
                      placeholder="1200"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Total solid waste generated.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recycled Waste Percentage (%) *
                    </label>
                    <input
                      type="number"
                      name="recycledWastePercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.recycledWastePercentage}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Paper, plastic, metal recycling %.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organic Waste Percentage (%) *
                    </label>
                    <input
                      type="number"
                      name="organicWastePercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.organicWastePercentage}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Composted organic waste %.</p>
                  </div>
                </div>
              )}

              {/* TRANSPORTATION FORM */}
              {activeCategory === "Transportation" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Private Vehicle Commute (%)
                    </label>
                    <input
                      type="number"
                      name="privateVehiclePercentage"
                      min="0"
                      max="100"
                      value={formData.privateVehiclePercentage}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Single-occupancy vehicles.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Public Transport Commute (%)
                    </label>
                    <input
                      type="number"
                      name="publicTransportPercentage"
                      min="0"
                      max="100"
                      value={formData.publicTransportPercentage}
                      onChange={handleChange}
                      placeholder="50"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Bus, train, shuttle ridership.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cycling & Walking (%)
                    </label>
                    <input
                      type="number"
                      name="cyclingWalkingPercentage"
                      min="0"
                      max="100"
                      value={formData.cyclingWalkingPercentage}
                      onChange={handleChange}
                      placeholder="20"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Active zero-emissions travel.</p>
                  </div>
                </div>
              )}

              {/* FOOD FORM */}
              {activeCategory === "Food" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Monthly Food Waste (kg) *
                    </label>
                    <input
                      type="number"
                      name="monthlyFoodWasteKg"
                      required
                      min="0"
                      value={formData.monthlyFoodWasteKg}
                      onChange={handleChange}
                      placeholder="350"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Estimated dining hall food waste.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Composted Percentage (%) *
                    </label>
                    <input
                      type="number"
                      name="compostedPercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.compostedPercentage}
                      onChange={handleChange}
                      placeholder="60"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Food waste diverted to compost %.</p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  {submitting ? (
                    <span>Saving Assessment...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Assessment History Controls & Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Assessment History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored in Cloud Firestore for user <code className="bg-slate-100 px-1 py-0.5 rounded">{currentUser?.uid?.substring(0, 8)}...</code>
                </p>
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-300 text-xs focus:ring-emerald-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Waste">Waste</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-300 text-xs focus:ring-emerald-500"
                  >
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {loadingHistory ? (
              <p className="text-xs text-slate-500 py-6 text-center">Loading assessment records...</p>
            ) : filteredAssessments.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs space-y-2">
                <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No assessments found.</p>
                <p className="text-slate-400">Complete an assessment above to record your campus sustainability data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Submitted Inputs</th>
                      <th className="py-2.5 px-3">Date Created</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssessments.map((item) => {
                      const score = calculateCategoryScore(item.category, item.data);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {item.period}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {score} / 100
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-xs truncate text-[11px] text-slate-700 font-medium font-sans">
                            {formatAssessmentSummary(item.category, item.data)}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => setViewingAssessment(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                title="View Details & Explanation"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingAssessment(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                                title="Edit Assessment"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingAssessmentId(item.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete Assessment"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 capitalize text-base">
                  {viewingAssessment.category} Assessment Details
                </span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {viewingAssessment.period}
                </span>
              </div>
              <button
                onClick={() => setViewingAssessment(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Calculated Category Score
                </span>
                <span className="text-2xl font-black">
                  {calculateCategoryScore(viewingAssessment.category, viewingAssessment.data)} / 100
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                  Calculation Explanation
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {getScoreExplanation(
                    viewingAssessment.category,
                    viewingAssessment.data,
                    calculateCategoryScore(viewingAssessment.category, viewingAssessment.data)
                  )}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                  Submitted Assessment Metrics
                </span>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 font-medium font-sans">
                  {formatAssessmentSummary(viewingAssessment.category, viewingAssessment.data)}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Created: {new Date(viewingAssessment.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(viewingAssessment.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingAssessment(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base capitalize">
                Edit {editingAssessment.category} Assessment
              </h3>
              <button
                onClick={() => setEditingAssessment(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
                <input
                  type="month"
                  value={editingAssessment.period}
                  onChange={(e) =>
                    setEditingAssessment({
                      ...editingAssessment,
                      period: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              {Object.keys(editingAssessment.data || {}).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    value={editingAssessment.data[key] ?? ""}
                    onChange={(e) =>
                      setEditingAssessment({
                        ...editingAssessment,
                        data: {
                          ...editingAssessment.data,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              ))}

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingAssessment(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAssessmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delete this assessment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Deleting this assessment cannot be undone and will recalculate your campus score.
              </p>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingAssessmentId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT DATA MODAL */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingAssessments={userAssessments}
        onSuccess={(count) => {
          setSuccessMessage(`✓ ${count} sustainability assessment(s) imported successfully!`);
          fetchAssessments();
          setTimeout(() => setSuccessMessage(""), 5000);
        }}
      />

    </div>
  );
};

export default Assessments;
