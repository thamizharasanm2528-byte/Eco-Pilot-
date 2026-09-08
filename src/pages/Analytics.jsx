import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MetricCard from "../components/MetricCard";
import ChartCard from "../components/ChartCard";
import LoadingScreen from "../components/LoadingScreen";
import { checkBackendHealth } from "../services/api";
import { getUserAssessments } from "../services/assessmentService";
import { calculateAnalytics } from "../utils/analytics/analyticsCalculator";
import { exportAnalyticsToCSV } from "../utils/csvExporter";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Download,
  Filter,
  Layers,
  Award,
  Zap,
  Droplet,
  Trash2,
  Bus,
  Utensils,
  PlusCircle,
  RefreshCw,
  Info,
  Server,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

const Analytics = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, message: "Checking API..." });

  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [userAssessments, setUserAssessments] = useState([]);

  // Period comparison selectors state
  const [selectedPeriodA, setSelectedPeriodA] = useState("");
  const [selectedPeriodB, setSelectedPeriodB] = useState("");

  const loadAnalyticsData = async () => {
    if (!currentUser) {
      setLoadingAssessments(false);
      return;
    }
    setLoadingAssessments(true);
    setFetchError(null);
    try {
      const data = await getUserAssessments(currentUser.uid);
      const safeData = Array.isArray(data) ? data : [];
      setUserAssessments(safeData);

      // Pre-select comparison periods if data exists
      const periodsSet = new Set(safeData.map((a) => a.period).filter(Boolean));
      const sortedPeriods = Array.from(periodsSet).sort((a, b) => new Date(b) - new Date(a));
      if (sortedPeriods.length >= 1) setSelectedPeriodA(sortedPeriods[0]);
      if (sortedPeriods.length >= 2) setSelectedPeriodB(sortedPeriods[1]);
    } catch (err) {
      console.error("Error loading analytics data:", err);
      setFetchError(err.message || "Unable to load analytics data. Please check your connection.");
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    checkBackendHealth()
      .then((res) => {
        if (mounted && res?.status === "ok") {
          setBackendStatus({ online: true, message: "Analytics Ready" });
        }
      })
      .catch(() => {
        if (mounted) {
          setBackendStatus({ online: false, message: "System Initializing..." });
        }
      });

    if (currentUser) {
      loadAnalyticsData();
    } else if (!authLoading) {
      setLoadingAssessments(false);
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, authLoading]);

  // Compute central analytics safely
  const analytics = calculateAnalytics(userAssessments) || {};
  const overall = analytics.overall || { score: null, previousScore: null, change: null, changePct: null, status: "insufficient_data" };
  const completeness = analytics.completeness || { activeCategories: 0, totalCategories: 5, percentage: 0, categoryChecklist: {} };
  const coverage = analytics.coverage || { totalAssessments: 0, representedCategories: 0, representedPeriods: 0 };
  const categoryScores = analytics.categoryScores || {};
  const periodTrends = analytics.periodTrends || { periodTrendList: [] };
  const kpis = analytics.kpis || {};
  const hotspots = analytics.hotspots || [];
  const insights = analytics.insights || [];
  const benchmark = analytics.benchmark || { overallGap: { gap: null, text: "No benchmark comparison data" }, categoryGaps: {} };
  const extremes = analytics.extremes || { bestCategory: null, weakestCategory: null };

  // Prepare Recharts overall trend line data
  const overallTrendChartData = (periodTrends?.periodTrendList || []).map((pt) => ({
    period: pt.period,
    score: pt.overallScore,
  }));

  // Prepare Recharts category comparison against Reference Target (75)
  const categoryComparisonData = [
    { category: "Energy", score: categoryScores?.energy?.score ?? null, target: 75 },
    { category: "Water", score: categoryScores?.water?.score ?? null, target: 75 },
    { category: "Waste", score: categoryScores?.waste?.score ?? null, target: 75 },
    { category: "Transport", score: categoryScores?.transportation?.score ?? null, target: 75 },
    { category: "Food", score: categoryScores?.food?.score ?? null, target: 75 },
  ];

  // Period-over-Period comparison calculation
  const getAssessmentsByPeriod = (p) => userAssessments.filter((a) => a.period === p);
  const periodA_items = getAssessmentsByPeriod(selectedPeriodA);
  const periodB_items = getAssessmentsByPeriod(selectedPeriodB);

  const getMetricFromPeriod = (items, category, metricKey) => {
    const found = items.find((a) => (a.category || "").toLowerCase() === category.toLowerCase());
    return found?.data?.[metricKey] ?? null;
  };

  const popComparisonRows = [
    { label: "Electricity Usage", cat: "energy", key: "monthlyElectricityKwh", unit: "kWh", lowerBetter: true },
    { label: "Renewable Share", cat: "energy", key: "renewableEnergyPercentage", unit: "%", lowerBetter: false },
    { label: "Water Usage", cat: "water", key: "monthlyWaterLiters", unit: "Liters", lowerBetter: true },
    { label: "Water Recycling Share", cat: "water", key: "recycledWaterPercentage", unit: "%", lowerBetter: false },
    { label: "Waste Generation", cat: "waste", key: "monthlyWasteKg", unit: "kg", lowerBetter: true },
    { label: "Waste Recycling Rate", cat: "waste", key: "recycledWastePercentage", unit: "%", lowerBetter: false },
    { label: "Food Waste Volume", cat: "food", key: "monthlyFoodWasteKg", unit: "kg", lowerBetter: true },
    { label: "Food Composting Share", cat: "food", key: "compostedPercentage", unit: "%", lowerBetter: false },
  ];

  const [exporting, setExporting] = useState(false);
  const [exportStatusMessage, setExportStatusMessage] = useState("");

  const handleExport = async (format = "excel") => {
    if (!userAssessments || userAssessments.length === 0) {
      setExportStatusMessage("No assessment data available to export.");
      setTimeout(() => setExportStatusMessage(""), 4000);
      return;
    }

    setExporting(true);
    setExportStatusMessage("Preparing your export...");

    try {
      if (format === "csv") {
        const { exportAssessmentsToCSV } = await import("../utils/export/csvExporter");
        exportAssessmentsToCSV(userAssessments);
      } else {
        const { exportAssessmentsToExcel } = await import("../utils/export/excelExporter");
        await exportAssessmentsToExcel(userAssessments);
      }
      setExportStatusMessage("Export completed successfully.");
    } catch (err) {
      console.error("Export failed:", err);
      setExportStatusMessage("Unable to export assessments. Please try again.");
    } finally {
      setExporting(false);
      setTimeout(() => setExportStatusMessage(""), 4000);
    }
  };

  if (authLoading || loadingAssessments) {
    return <LoadingScreen label="Processing sustainability analytics baseline..." />;
  }

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Export status toast message */}
      {exportStatusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-eco-dark text-white px-5 py-3 rounded-2xl shadow-eco-lg border border-eco-deep flex items-center space-x-2 text-xs font-heading font-semibold animate-fade-in">
          <Sparkles className="w-4 h-4 text-eco-accent" />
          <span>{exportStatusMessage}</span>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* Header */}
          <div className="card-eco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-6 h-6 text-eco-primary shrink-0" />
                <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
                  Advanced Sustainability Analytics
                </h1>
                <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-soft border border-eco-border text-xs font-heading font-semibold text-eco-primary shrink-0">
                  <Server className="w-3.5 h-3.5" />
                  <span>{backendStatus.message}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-eco-muted">
                Understand campus sustainability performance, trends, hotspots, and improvement areas.
              </p>
            </div>

            <div className="flex flex-wrap items-center space-x-2 shrink-0">
              <span className="sm:hidden inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-soft border border-eco-border text-xs font-heading font-semibold text-eco-primary shrink-0 mb-2">
                <Server className="w-3.5 h-3.5" />
                <span>{backendStatus.message}</span>
              </span>

              <button
                onClick={() => navigate("/comparison")}
                className="btn-eco-secondary py-2 px-3 text-xs rounded-xl border border-eco-border"
              >
                <ArrowRight className="w-3.5 h-3.5 mr-1 text-eco-primary" />
                <span>Comparison</span>
              </button>

              <button
                onClick={() => handleExport("excel")}
                disabled={exporting}
                className="btn-eco-primary py-2 px-3.5 text-xs rounded-xl disabled:opacity-50"
                title="Export Professional Multi-Sheet Excel (.xlsx)"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>{exporting ? "..." : "Export Excel"}</span>
              </button>
            </div>
          </div>


          {/* Error Banner */}
          {fetchError && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button
                onClick={loadAnalyticsData}
                className="px-3 py-1 bg-white border border-rose-300 hover:bg-rose-100 rounded-lg text-rose-900 font-semibold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* EMPTY STATE IF ZERO ASSESSMENTS */}
          {userAssessments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold text-slate-900">Not enough data for advanced analytics</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Complete sustainability assessments to unlock trends, comparisons, and rule-based insights.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/assessments"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Assessment</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Analytics Header Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Current Overall Score"
                  value={overall.score !== null ? overall.score : "N/A"}
                  unit={overall.score !== null ? "/ 100" : ""}
                  change={
                    overall.change !== null
                      ? `${overall.change > 0 ? "+" : ""}${overall.changePct}% from prior period`
                      : "First assessment period"
                  }
                  changeType={
                    overall.status === "improving"
                      ? "positive"
                      : overall.status === "declining"
                      ? "negative"
                      : "neutral"
                  }
                  icon={Award}
                  badgeText="Analytics Engine"
                />

                <MetricCard
                  title="Data Completeness"
                  value={`${completeness.percentage}`}
                  unit="%"
                  subtitle={`${completeness.activeCategories} of 5 categories submitted`}
                  icon={CheckCircle2}
                  badgeText="Completeness"
                />

                <MetricCard
                  title="Assessment Coverage"
                  value={`${coverage.totalAssessments}`}
                  unit="Doc(s)"
                  subtitle={`${coverage.representedPeriods} period(s) across ${coverage.representedCategories} cat(s)`}
                  icon={Layers}
                  badgeText="Coverage"
                />

                <MetricCard
                  title="Reference Target Gap"
                  value={benchmark.overallGap.gap !== null ? `${benchmark.overallGap.gap > 0 ? "+" : ""}${benchmark.overallGap.gap}` : "N/A"}
                  unit="pts"
                  subtitle={benchmark.overallGap.text}
                  icon={TargetIcon}
                  badgeText="Benchmark 75"
                />
              </div>

              {/* Data Completeness Bar & Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Data Completeness Analysis
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completeness reflects data availability across all 5 campus categories (not performance score).
                    </p>
                  </div>
                  <span className="text-base font-extrabold text-slate-900">
                    {completeness.percentage}% Complete
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completeness.percentage}%` }}
                  />
                </div>

                {/* Category checklist pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {[
                    { id: "energy", label: "Energy" },
                    { id: "water", label: "Water" },
                    { id: "waste", label: "Waste" },
                    { id: "transportation", label: "Transportation" },
                    { id: "food", label: "Food" },
                  ].map((cat) => {
                    const isSubmitted = completeness.categoryChecklist[cat.id];
                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold ${
                          isSubmitted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-50 text-slate-400 border-slate-200/60"
                        }`}
                      >
                        {isSubmitted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                            ○
                          </span>
                        )}
                        <span>{cat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Charts Section: Overall Trend & Category Benchmark Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Overall Sustainability Score Trend (LineChart) */}
                <ChartCard
                  title="Overall Sustainability Score Trend"
                  subtitle="Historical score progression across periods"
                  badge={overallTrendChartData.length > 0 ? `${overallTrendChartData.length} Period(s)` : "No Trend"}
                >
                  {overallTrendChartData.length < 2 ? (
                    <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs space-y-2">
                      <BarChart3 className="w-8 h-8 text-slate-300" />
                      <p>Trend unavailable — add assessments for multiple periods to plot trend line.</p>
                      <Link to="/assessments" className="text-emerald-600 font-semibold hover:underline">
                        + Add Assessment Period
                      </Link>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={overallTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <ReferenceLine y={75} label={{ value: "Target 75", fill: "#10b981", fontSize: 10 }} stroke="#10b981" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="score" name="Overall Score" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: "#059669" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                {/* Category Performance vs Reference Benchmark Target (BarChart) */}
                <ChartCard
                  title="Category Performance vs Benchmark (75 Target)"
                  subtitle="Category scores compared against prototype target"
                  badge="Reference Target"
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={categoryComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                      <Bar dataKey="score" name="Campus Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="Reference Target (75)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

              </div>

              {/* Hotspot Detection Panel & Rule-Based Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Hotspots Panel */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Sustainability Hotspots
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      Analytics-based hotspot
                    </span>
                  </div>

                  {hotspots.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-semibold text-slate-700">Great work!</p>
                      <p className="text-slate-500">No major sustainability hotspots detected from available assessment data.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hotspots.map((hs) => (
                        <div
                          key={hs.category}
                          className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                            hs.status === "Critical"
                              ? "bg-rose-50/70 border-rose-200 text-rose-900"
                              : "bg-amber-50/70 border-amber-200 text-amber-900"
                          }`}
                        >
                          <span className="font-black text-sm px-2 py-1 rounded bg-white border shrink-0">
                            #{hs.priority}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm capitalize">{hs.category}</span>
                              <span className="font-bold">{hs.score} / 100</span>
                            </div>
                            <p className="text-xs mt-1 leading-snug">{hs.reason}</p>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5">
                              <span className="text-[10px] opacity-75">Period: {hs.period}</span>
                              <Link
                                to={`/knowledge?search=${encodeURIComponent(hs.category + " mitigation standards")}&category=${hs.category}`}
                                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                              >
                                <span>Explore Knowledge</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                </div>

                {/* Rule-Based Insights Panel */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Analytics Insights
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Automated Analysis
                    </span>
                  </div>

                  {/* Best & Weakest Category Summary */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        Best Performing
                      </span>
                      <span className="font-bold text-slate-900 text-sm capitalize block mt-0.5">
                        {extremes?.bestCategory ? `${extremes.bestCategory.category} (${extremes.bestCategory.score}/100)` : "N/A"}
                      </span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Requires Attention
                      </span>
                      <span className="font-bold text-slate-900 text-sm capitalize block mt-0.5">
                        {extremes?.weakestCategory ? `${extremes.weakestCategory.category} (${extremes.weakestCategory.score}/100)` : "N/A"}
                      </span>
                    </div>
                  </div>

                  {insights.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Submit more assessments across multiple periods to generate insights.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {insights.map((insight) => (
                        <div key={insight.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{insight.title}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                insight.priority === "High"
                                  ? "bg-rose-100 text-rose-700"
                                  : insight.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {insight.priority} Priority
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-snug">{insight.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Period-over-Period Comparison Module */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Period-over-Period Comparison
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Side-by-side operational metric comparison between any two assessment periods.
                    </p>
                  </div>

                  {/* Period Selectors */}
                  <div className="flex items-center space-x-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold mr-1.5">Period A:</span>
                      <select
                        value={selectedPeriodA}
                        onChange={(e) => setSelectedPeriodA(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 focus:ring-emerald-500 text-xs"
                      >
                        {Array.from(new Set((userAssessments || []).map((a) => a?.period).filter(Boolean))).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold mr-1.5">Period B:</span>
                      <select
                        value={selectedPeriodB}
                        onChange={(e) => setSelectedPeriodB(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 focus:ring-emerald-500 text-xs"
                      >
                        {Array.from(new Set((userAssessments || []).map((a) => a?.period).filter(Boolean))).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Metric</th>
                        <th className="py-2.5 px-3">{selectedPeriodA || "Period A"}</th>
                        <th className="py-2.5 px-3">{selectedPeriodB || "Period B"}</th>
                        <th className="py-2.5 px-3">Difference</th>
                        <th className="py-2.5 px-3 text-right">Directional Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {popComparisonRows.map((row) => {
                        const valA = getMetricFromPeriod(periodA_items, row.cat, row.key);
                        const valB = getMetricFromPeriod(periodB_items, row.cat, row.key);

                        let diffText = "N/A";
                        let statusText = "No comparison";
                        let statusColor = "text-slate-400";

                        if (valA !== null && valB !== null) {
                          const diff = valA - valB;
                          diffText = `${diff > 0 ? "+" : ""}${diff.toLocaleString()} ${row.unit}`;

                          const favorable = row.lowerBetter ? diff < 0 : diff > 0;
                          if (diff === 0) {
                            statusText = "Stable";
                            statusColor = "text-slate-500";
                          } else if (favorable) {
                            statusText = "Favorable Change";
                            statusColor = "text-emerald-600 font-semibold";
                          } else {
                            statusText = "Unfavorable Change";
                            statusColor = "text-rose-600 font-semibold";
                          }
                        }

                        return (
                          <tr key={row.label} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-semibold text-slate-900">{row.label}</td>
                            <td className="py-3 px-3">{valA !== null ? `${valA.toLocaleString()} ${row.unit}` : "No data"}</td>
                            <td className="py-3 px-3">{valB !== null ? `${valB.toLocaleString()} ${row.unit}` : "No data"}</td>
                            <td className="py-3 px-3 font-mono">{diffText}</td>
                            <td className={`py-3 px-3 text-right ${statusColor}`}>{statusText}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 11 KPI System Grid */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Campus Sustainability KPI Matrix (11 Indicators)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(kpis).map((kpiKey) => {
                    const item = kpis[kpiKey];
                    return (
                      <div key={kpiKey} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{item.title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-600">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-xl font-extrabold text-slate-900">
                            {item.currentValue !== null ? `${item.currentValue.toLocaleString()} ${item.unit}` : "No Data"}
                          </span>

                          {item.changePct !== null && (
                            <span
                              className={`text-xs font-semibold flex items-center ${
                                item.status === "improving"
                                  ? "text-emerald-600"
                                  : item.status === "declining"
                                  ? "text-rose-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {item.status === "improving" ? (
                                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                              ) : item.status === "declining" ? (
                                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                              ) : null}
                              {item.changePct}%
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-200/60 pt-1.5">
                          <span>Target: {item.direction === "lower_is_better" ? "Lower is better" : "Higher is better"}</span>
                          <span>{item.period ? `Period: ${item.period}` : "No period"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </>
          )}

        </main>
      </div>
    </div>
  );
};

// Simple icon for target gap card
const TargetIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <circle cx="12" cy="12" r="5" strokeWidth="2" />
    <circle cx="12" cy="12" r="1" strokeWidth="2" />
  </svg>
);

export default Analytics;
