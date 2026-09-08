import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import { getAIHealth, generateAIAnalysis, askAIQuestion } from "../services/aiApi";
import { getUserAssessments } from "../services/assessmentService";
import { calculateAnalytics } from "../utils/analytics/analyticsCalculator";
import { saveAIAnalysis, getUserAIAnalyses } from "../services/aiHistoryService";
import MonthlyReportModal from "../components/MonthlyReportModal";
import { generateAIMonthlyReport } from "../services/aiApi";
import {
  Sparkles,
  Bot,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Layers,
  ShieldAlert,
  Calendar,
  ChevronRight,
  BookOpen,
  Send,
  HelpCircle,
  Award,
  Cpu,
  Info,
  History,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "energy", label: "Energy" },
  { id: "water", label: "Water" },
  { id: "waste", label: "Waste" },
  { id: "transportation", label: "Transportation" },
  { id: "food", label: "Food" },
];

const QUICK_QUESTIONS = [
  "How can we reduce electricity consumption?",
  "What should we prioritize first?",
  "How can we reduce water waste?",
  "What actions can we take in the next 30 days?",
  "How can campus dining minimize organic waste?",
];

const AIIntelligence = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // System & AI status
  const [aiHealth, setAiHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  // Data & Selection State
  const [userAssessments, setUserAssessments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userQuestion, setUserQuestion] = useState("");

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Monthly Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // History State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load AI Health & User Assessments
  useEffect(() => {
    let mounted = true;
    getAIHealth()
      .then((res) => {
        if (mounted) setAiHealth(res);
      })
      .catch((err) => {
        if (mounted) {
          setAiHealth({
            status: "error",
            configured: false,
            provider: "groq",
            model: "qwen/qwen3.8-27b",
            message: "Unable to connect to backend AI service.",
          });
        }
      })
      .finally(() => {
        if (mounted) setLoadingHealth(false);
      });

    if (currentUser) {
      getUserAssessments(currentUser.uid)
        .then((data) => {
          if (mounted) setUserAssessments(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error loading user assessments:", err));

      loadHistory();
    }
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const loadHistory = async () => {
    if (!currentUser) return;
    setLoadingHistory(true);
    try {
      const items = await getUserAIAnalyses(currentUser.uid);
      setHistory(items || []);
    } catch (err) {
      console.warn("Failed to load AI history:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  };


  // Run AI Sustainability Analysis
  const handleRunAnalysis = async (customQuestion = null) => {
    if (analyzing) return;
    setAnalyzing(true);
    setErrorMsg(null);
    setAiResult(null);

    const questionToAsk = customQuestion || userQuestion;

    try {
      // Step 1: Prep data
      const filteredAssessments =
        selectedCategory === "all"
          ? userAssessments
          : userAssessments.filter((a) => (a.category || "").toLowerCase() === selectedCategory);

      // Step 2: Compute analytics snapshot
      setAnalysisStep("Analyzing sustainability performance metrics...");
      const analyticsSnapshot = calculateAnalytics(filteredAssessments);

      // Step 3: Retrieve Evidence & Query AI
      setAnalysisStep("Searching sustainability evidence & generating AI recommendations...");
      
      const payload = {
        category: selectedCategory,
        campus_data: {
          assessment_count: filteredAssessments.length,
          category_scores: analyticsSnapshot.categoryScores,
          overall_score: analyticsSnapshot.overall.score,
          hotspots: analyticsSnapshot.hotspots,
        },
        user_question: userQuestion.trim() || null,
        assessments: filteredAssessments,
      };

      const result = await generateAIAnalysis(payload);
      setAiResult(result);

      // Save analysis to history asynchronously if user is logged in
      if (currentUser?.uid && result?.summary) {
        saveAIAnalysis(currentUser.uid, {
          category: selectedCategory,
          user_question: userQuestion.trim() || null,
          result: result,
        }).then(() => {
          loadHistory();
        }).catch(err => console.error("Failed to save analysis history:", err));
      }

    } catch (err) {
      console.error("AI Analysis error:", err);
      setErrorMsg(err.message || "Failed to generate AI analysis. Please verify system connection.");
    } finally {
      setAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const handleGenerateReport = async () => {
    if (generatingReport) return;
    setGeneratingReport(true);
    setShowReportModal(true);
    try {
      const res = await generateAIMonthlyReport({
        period: new Date().toISOString().substring(0, 7),
        assessments: userAssessments,
      });
      setReportData(res);
    } catch (err) {
      console.error("Monthly report error:", err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (authLoading || loadingHealth) {
    return <LoadingScreen label="Loading AI Sustainability Intelligence..." />;
  }

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* HEADER BANNER */}
          <div className="card-eco p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-eco-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Sustainability Intelligence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  AI Sustainability Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Evidence-grounded sustainability analysis combining campus assessments, historical performance trends, and verified sustainability guidelines.
                </p>
              </div>

              {/* Provider Badge */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 text-xs space-y-2 w-full lg:w-72 shrink-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-slate-300 flex items-center">
                    <Cpu className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    AI Sustainability Engine
                  </span>
                  <span className="font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Active & Operational
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Mode:</span>
                  <span className="font-sans text-white font-semibold text-[11px]">
                    Grounded Decision Support
                  </span>
                </div>

                <div className="flex justify-between text-slate-300 pt-1 border-t border-white/10">
                  <span>Status:</span>
                  <span className={`font-bold flex items-center ${aiHealth?.configured ? "text-emerald-400" : "text-amber-400"}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${aiHealth?.configured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    {aiHealth?.configured ? "AI Insights Ready" : "Unconfigured Key"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>All recommendations are grounded in verified sustainability guidelines.</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGenerateReport}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-eco-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Monthly AI Report</span>
                </button>

                {history.length > 0 && (
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center space-x-1.5 transition-colors border border-white/15"
                  >
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Previous ({history.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Unconfigured Alert Banner */}
          {!aiHealth?.configured && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">AI Service Unconfigured</p>
                <p className="mt-0.5 leading-relaxed text-amber-800">
                  AI service key is currently unconfigured in the server environment. Please verify backend environment setup to enable live AI recommendations.
                </p>
              </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* INTERACTIVE QUERY & ANALYSIS CONTROLS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            
            {/* Category Selector Pills */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select Sustainability Target Focus:
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Question Input Box */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Ask EcoPilot a Specific Campus Question (Optional):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., How can we reduce electricity consumption in dorms?"
                  className="w-full pl-11 pr-32 py-3 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-xs font-medium text-slate-900 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleRunAnalysis()}
                  disabled={analyzing || !aiHealth?.configured}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  {analyzing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Generate AI Insights</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                Quick Prompt Shortcuts:
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserQuestion(q);
                      handleRunAnalysis(q);
                    }}
                    disabled={analyzing || !aiHealth?.configured}
                    className="px-3 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ACTIVE LOADING STATE WITH STEP PROGRESS */}
          {analyzing && (
            <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-lg text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Generating AI Sustainability Intelligence...
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1 animate-pulse">
                  {analysisStep}
                </p>
              </div>
              <div className="w-64 bg-slate-100 rounded-full h-2 mx-auto overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {/* STRUCTURED AI RESULTS VIEW */}
          {aiResult && !analyzing && (
            <div className="space-y-6">
              
              {/* Executive Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      AI Executive Sustainability Summary
                    </h2>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        aiResult.overall_assessment?.status === "good"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : aiResult.overall_assessment?.status === "critical"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {aiResult.overall_assessment?.status?.replace("_", " ") || "Moderate"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        aiResult.overall_assessment?.priority === "high" || aiResult.overall_assessment?.priority === "critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {aiResult.overall_assessment?.priority || "Medium"} Priority
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {aiResult.summary}
                </p>
              </div>

              {/* Key Findings & Recommendations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Key Findings */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Key Evidence Findings ({aiResult.key_findings?.length || 0})
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {aiResult.key_findings?.map((kf, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{kf.title}</span>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              kf.severity === "high"
                                ? "bg-rose-100 text-rose-700"
                                : kf.severity === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {kf.severity} Severity
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{kf.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Strategic Recommendations ({aiResult.recommendations?.length || 0})
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {aiResult.recommendations?.map((rec, i) => (
                      <div key={i} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{rec.title}</span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-white border px-2 py-0.5 rounded">
                            {rec.timeframe}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Implementation Action Plan Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Target Implementation Action Plan
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded">
                    Implementation Roadmap
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {aiResult.action_plan?.map((stepItem) => (
                    <div key={stepItem.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          #{stepItem.step}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          {stepItem.timeframe}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 leading-snug">{stepItem.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Qualitative Impact */}
              {aiResult.expected_impact?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Expected Environmental & Operational Impact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {aiResult.expected_impact.map((imp, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                        <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RAG Source Citations Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Verified Evidence Sources ({aiResult.sources?.length || 0})
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                    Evidence Grounding
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {aiResult.sources?.map((src, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 text-xs line-clamp-1">{src.title}</span>
                        {src.url && src.url !== "#" && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline flex items-center text-[10px] font-semibold shrink-0 ml-2"
                          >
                            <span>Standard</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] leading-snug">{src.relevance}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* HISTORICAL ANALYSES MODAL / DRAWER */}
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    <History className="w-4 h-4 mr-2 text-emerald-600" />
                    Saved AI Sustainability Analyses
                  </h3>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {history.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-8">No previous AI analyses stored.</p>
                  ) : (
                    history.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          setAiResult(h);
                          setShowHistoryModal(false);
                        }}
                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all hover:bg-slate-50 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 capitalize">Category: {h.category}</span>
                          <span className="text-[10px] text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{h.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MONTHLY REPORT MODAL */}
          <MonthlyReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            reportData={reportData}
            loading={generatingReport}
          />

        </main>
      </div>
    </div>
  );
};

export default AIIntelligence;
