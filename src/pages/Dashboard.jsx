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
import { calculateOverallSustainabilityScore } from "../utils/sustainabilityCalculator";
import { formatAssessmentSummary } from "../utils/export/formatters";

import {
  Zap,
  Droplet,
  Trash2,
  Bus,
  Utensils,
  Award,
  PlusCircle,
  FileText,
  RefreshCw,
  User,
  Activity,
  Server,
  Info,
  Sparkles,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  Bot,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Target,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState({ online: false, message: "Checking API..." });

  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [userAssessments, setUserAssessments] = useState([]);

  const userName = userProfile?.fullName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Campus Leader";

  const loadDashboardData = async () => {
    if (!currentUser) {
      setLoadingAssessments(false);
      return;
    }
    setLoadingAssessments(true);
    setFetchError(null);
    try {
      const data = await getUserAssessments(currentUser.uid);
      setUserAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading dashboard assessments:", err);
      setFetchError(err.message || "Unable to load sustainability data. Please check your connection and try again.");
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    checkBackendHealth()
      .then((res) => {
        if (mounted && res?.status === "ok") {
          setBackendStatus({ online: true, message: "AI Insights Ready" });
        }
      })
      .catch(() => {
        if (mounted) {
          setBackendStatus({ online: false, message: "System Initializing..." });
        }
      });

    if (currentUser) {
      loadDashboardData();
    } else if (!authLoading) {
      setLoadingAssessments(false);
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, authLoading]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const safeAssessments = Array.isArray(userAssessments) ? userAssessments : [];

  const {
    overallScore,
    activeCategoryCount,
    categoryScores,
    latestByCategory,
  } = calculateOverallSustainabilityScore(safeAssessments);

  const safeLatest = latestByCategory || {
    energy: null,
    water: null,
    waste: null,
    transportation: null,
    food: null,
  };

  const safeScores = categoryScores || {
    energy: null,
    water: null,
    waste: null,
    transportation: null,
    food: null,
  };

  const energyAssessments = safeAssessments
    .filter((a) => a && (a.category || "").toLowerCase() === "energy")
    .sort((a, b) => new Date(a.period || a.createdAt) - new Date(b.period || b.createdAt));

  const energyTrendData = energyAssessments.map((item) => ({
    period: item.period || "N/A",
    kwh: item.data?.monthlyElectricityKwh || 0,
    renewables: item.data?.renewableEnergyPercentage || 0,
  }));

  const waterAssessments = safeAssessments
    .filter((a) => a && (a.category || "").toLowerCase() === "water")
    .sort((a, b) => new Date(a.period || a.createdAt) - new Date(b.period || b.createdAt));

  const waterTrendData = waterAssessments.map((item) => ({
    period: item.period || "N/A",
    liters: item.data?.monthlyWaterLiters || 0,
  }));

  const latestWasteData = safeLatest.waste?.data || null;
  const wasteDistributionData = latestWasteData
    ? [
        { name: "Recycled", value: Number(latestWasteData.recycledWastePercentage || 0), color: "#2E7D32" },
        { name: "Organic", value: Number(latestWasteData.organicWastePercentage || 0), color: "#4CAF50" },
        {
          name: "Landfill",
          value: Math.max(0, 100 - (Number(latestWasteData.recycledWastePercentage || 0) + Number(latestWasteData.organicWastePercentage || 0))),
          color: "#E53935",
        },
      ]
    : [];

  const scoreCategoryRows = [
    { name: "Energy", key: "energy", color: "bg-eco-highlight" },
    { name: "Water", key: "water", color: "bg-eco-secondary" },
    { name: "Waste", key: "waste", color: "bg-eco-primary" },
    { name: "Transportation", key: "transportation", color: "bg-eco-accent" },
    { name: "Food", key: "food", color: "bg-eco-dark" },
  ];

  if (authLoading || loadingAssessments) {
    return <LoadingScreen label="Loading EcoPilot Sustainability Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-eco-dark text-white px-5 py-3 rounded-2xl shadow-eco-lg border border-eco-deep flex items-center space-x-2 text-xs font-heading font-semibold">
          <Sparkles className="w-4 h-4 text-eco-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* Welcome Banner */}
          <div className="card-eco p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
                  Good morning, {userName}
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-sans text-eco-muted mt-1">
                Track your campus sustainability performance, analyze metrics with AI, and build a greener campus.
              </p>
            </div>

            {/* Backend Sync Indicator */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-eco-soft border border-eco-border text-xs font-heading font-semibold shrink-0">
              <Server className="w-3.5 h-3.5 text-eco-primary" />
              <span className="text-eco-text">{backendStatus.message}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus.online ? "bg-eco-primary animate-pulse" : "bg-amber-400"
                }`}
              />
            </div>
          </div>

          {/* Error Alert Box */}
          {fetchError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between font-sans">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button
                onClick={loadDashboardData}
                className="px-3 py-1 bg-white border border-rose-300 hover:bg-rose-100 rounded-xl text-rose-900 font-heading font-bold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="card-eco p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-eco-muted">
                Quick Actions
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate("/assessments")}
                className="btn-eco-primary py-2.5 text-xs rounded-2xl"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>New Assessment</span>
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="btn-eco-secondary py-2.5 text-xs rounded-2xl"
              >
                <BarChart3 className="w-4 h-4 mr-1.5 text-eco-primary" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => navigate("/knowledge")}
                className="btn-eco-secondary py-2.5 text-xs rounded-2xl"
              >
                <BookOpen className="w-4 h-4 mr-1.5 text-eco-primary" />
                <span>Knowledge Base</span>
              </button>
            </div>
          </div>

          {/* AI SUSTAINABILITY ADVISOR WIDGET */}
          <div className="card-eco p-6 space-y-4 border-eco-accent/30 bg-gradient-to-r from-white via-eco-soft/30 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-eco-soft text-eco-primary border border-eco-border flex items-center justify-center shadow-eco-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center">
                    AI Sustainability Advisor
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border">
                      AI Insights Ready
                    </span>
                  </h3>
                  <p className="text-xs text-eco-muted font-sans">
                    Get clear sustainability insights based on your campus assessment data.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/ai")}
                  className="btn-eco-primary text-xs py-2 px-4 rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Analyze My Sustainability</span>
                </button>
              </div>
            </div>

            {/* Assessment Insights Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-white border border-eco-border space-y-2">
                <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                  AI Performance Assessment
                </span>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {safeAssessments.length > 0
                    ? `Your current overall score is ${overallScore}/100. Prioritize categories with lowest historical metrics to boost your baseline.`
                    : "No assessments completed yet. Complete your first assessment to unlock AI Sustainability Intelligence."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-eco-border space-y-2">
                <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                  Priority Action Areas
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    🔴 Waste Management
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    🟠 Water Conservation
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    🟢 Energy & Transport
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-eco-border space-y-2">
                <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                  Top Recommended Actions
                </span>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li className="flex items-center space-x-1">
                    <span className="text-eco-primary font-bold">•</span>
                    <span>Increase recycling rate from 25% to 40%</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <span className="text-eco-primary font-bold">•</span>
                    <span>Reduce monthly water usage by 10%</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <span className="text-eco-primary font-bold">•</span>
                    <span>Expand dining compost to 60%</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* EMPTY STATE IF ZERO ASSESSMENTS EXIST */}
          {safeAssessments.length === 0 ? (
            <div className="card-eco p-10 text-center space-y-4">
              <div className="icon-pill w-16 h-16 bg-eco-soft text-eco-primary mx-auto">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h2 className="text-xl font-heading font-extrabold text-slate-900">
                  Your Campus Sustainability Journey Starts Here
                </h2>
                <p className="text-xs sm:text-sm font-sans text-eco-muted">
                  Complete your first sustainability assessment to calculate your campus score.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/assessments" className="btn-eco-primary text-xs">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  <span>Start Assessment</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Category Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Overall Sustainability"
                  value={overallScore !== null ? overallScore : "N/A"}
                  unit={overallScore !== null ? "/ 100" : ""}
                  subtitle={
                    activeCategoryCount > 0
                      ? `Based on ${activeCategoryCount} of 5 categories`
                      : "No assessment data yet"
                  }
                  icon={Award}
                  badgeText="Live Score"
                />

                <MetricCard
                  title="Energy Usage"
                  value={
                    safeLatest.energy?.data?.monthlyElectricityKwh !== undefined
                      ? Number(safeLatest.energy.data.monthlyElectricityKwh).toLocaleString()
                      : "No data"
                  }
                  unit={safeLatest.energy ? "kWh" : ""}
                  subtitle={
                    safeLatest.energy
                      ? `Renewables: ${safeLatest.energy.data?.renewableEnergyPercentage || 0}%`
                      : "Complete an assessment to see your score."
                  }
                  icon={Zap}
                  badgeText={safeLatest.energy ? safeLatest.energy.period : null}
                />

                <MetricCard
                  title="Water Usage"
                  value={
                    safeLatest.water?.data?.monthlyWaterLiters !== undefined
                      ? Number(safeLatest.water.data.monthlyWaterLiters).toLocaleString()
                      : "No data"
                  }
                  unit={safeLatest.water ? "Liters" : ""}
                  subtitle={
                    safeLatest.water
                      ? `Recycled: ${safeLatest.water.data?.recycledWaterPercentage || 0}%`
                      : "Complete an assessment to see your score."
                  }
                  icon={Droplet}
                  badgeText={safeLatest.water ? safeLatest.water.period : null}
                />

                <MetricCard
                  title="Waste Generated"
                  value={
                    safeLatest.waste?.data?.monthlyWasteKg !== undefined
                      ? Number(safeLatest.waste.data.monthlyWasteKg).toLocaleString()
                      : "No data"
                  }
                  unit={safeLatest.waste ? "kg" : ""}
                  subtitle={
                    safeLatest.waste
                      ? `Recycled: ${safeLatest.waste.data?.recycledWastePercentage || 0}%`
                      : "Complete an assessment to see your score."
                  }
                  icon={Trash2}
                  badgeText={safeLatest.waste ? safeLatest.waste.period : null}
                />
              </div>

              {/* Real Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Monthly Energy Usage Chart */}
                <ChartCard
                  title="Monthly Electricity Usage (kWh)"
                  subtitle="Actual user assessments logged in Firestore"
                  badge={energyTrendData.length > 0 ? `${energyTrendData.length} Period(s)` : null}
                >
                  {energyTrendData.length === 0 ? (
                    <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 text-eco-muted text-xs space-y-2 font-sans">
                      <Zap className="w-8 h-8 text-eco-primary" />
                      <p>Add assessments for multiple months to see your trend.</p>
                      <Link to="/assessments" className="text-eco-primary font-heading font-bold hover:underline">
                        + Add Energy Assessment
                      </Link>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={energyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE8DE" />
                        <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#52635A" }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#52635A" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#123C25", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="kwh" name="Electricity (kWh)" stroke="#2E7D32" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnergy)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                {/* Monthly Water Consumption Chart */}
                <ChartCard
                  title="Monthly Water Consumption (Liters)"
                  subtitle="Actual user assessments logged in Firestore"
                  badge={waterTrendData.length > 0 ? `${waterTrendData.length} Period(s)` : null}
                >
                  {waterTrendData.length === 0 ? (
                    <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 text-eco-muted text-xs space-y-2 font-sans">
                      <Droplet className="w-8 h-8 text-eco-secondary" />
                      <p>Add assessments for multiple months to see your trend.</p>
                      <Link to="/assessments" className="text-eco-primary font-heading font-bold hover:underline">
                        + Add Water Assessment
                      </Link>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={waterTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE8DE" />
                        <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#52635A" }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#52635A" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#123C25", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                        <Bar dataKey="liters" name="Water (Liters)" fill="#4CAF50" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

              </div>

              {/* Bottom Row: Score Breakdown & Waste Diversion */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Score Breakdown Card */}
                <div className="card-eco p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-eco-border pb-3">
                      <h3 className="text-base font-heading font-bold text-slate-900">
                        Campus Score Breakdown
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border">
                        {activeCategoryCount} / 5 Active
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-2 my-2">
                      <span className="text-4xl font-heading font-black text-slate-900">
                        {overallScore !== null ? overallScore : "N/A"}
                      </span>
                      <span className="text-sm font-heading font-semibold text-eco-muted">/ 100</span>
                    </div>
                    <p className="text-xs font-sans text-eco-muted">
                      Based on {activeCategoryCount} of 5 sustainability categories
                    </p>

                    <div className="space-y-3 mt-5">
                      {scoreCategoryRows.map((cat) => {
                        const item = safeScores[cat.key];
                        return (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-heading font-semibold text-slate-800">
                              <span>{cat.name}</span>
                              <span className="text-eco-muted">
                                {item ? `${item.score} / 100` : "No data"}
                              </span>
                            </div>
                            <div className="w-full bg-eco-soft rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${item ? cat.color : "bg-eco-border"}`}
                                style={{ width: `${item ? item.score : 0}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-eco-border text-[11px] font-sans text-eco-muted flex items-start space-x-1.5">
                    <Info className="w-4 h-4 text-eco-primary shrink-0 mt-0.5" />
                    <span>
                      Scores are estimates derived from submitted category assessments.
                    </span>
                  </div>
                </div>

                {/* Waste Distribution Chart */}
                <div className="card-eco p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 border-b border-eco-border pb-3">
                      <h3 className="text-base font-heading font-bold text-slate-900">
                        Waste Diversion Breakdown
                      </h3>
                      {safeLatest.waste && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border">
                          {safeLatest.waste.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-sans text-eco-muted mb-4">Recycling vs Landfill (%)</p>

                    {wasteDistributionData.length === 0 ? (
                      <div className="h-[180px] flex flex-col items-center justify-center text-center text-eco-muted text-xs space-y-1 font-sans">
                        <Trash2 className="w-6 h-6 text-eco-primary" />
                        <p>No waste assessment data logged.</p>
                      </div>
                    ) : (
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={wasteDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {wasteDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#123C25", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {wasteDistributionData.length > 0 && (
                    <div className="flex items-center justify-around border-t border-eco-border pt-3 text-xs font-heading font-semibold">
                      {wasteDistributionData.map((item) => (
                        <div key={item.name} className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-700">{item.name} ({item.value}%)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Assessments Feed */}
                <div className="card-eco p-6">
                  <div className="flex items-center justify-between mb-4 border-b border-eco-border pb-3">
                    <h3 className="text-base font-heading font-bold text-slate-900 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-eco-primary" />
                      Assessment Activity
                    </h3>
                    <span className="text-[10px] font-heading font-bold text-eco-muted uppercase tracking-wider">
                      Firestore
                    </span>
                  </div>

                  {safeAssessments.length === 0 ? (
                    <div className="text-eco-muted text-xs font-sans text-center py-8">
                      No recent assessment activity.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {safeAssessments.slice(0, 5).map((act) => (
                        <div key={act.id} className="flex items-start space-x-3 text-xs font-sans p-2.5 rounded-xl bg-eco-soft/50 border border-eco-border">
                          <div className="icon-pill w-7 h-7 bg-white border border-eco-border text-eco-primary shrink-0 mt-0.5">
                            <ClipboardList className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-slate-900 capitalize">
                              {act.category} Assessment ({act.period})
                            </h4>
                            <p className="text-slate-700 text-[11px] font-medium mt-0.5 font-sans line-clamp-1">
                              {formatAssessmentSummary(act.category, act.data)}
                            </p>
                            <span className="text-[10px] text-eco-muted block mt-1">
                              {new Date(act.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
