import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getUserAssessments } from "../services/assessmentService";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertCircle,
  Zap,
  Droplet,
  Trash2,
  Bus,
  Utensils,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

const CATEGORY_MAP = [
  { id: "ENERGY", label: "Energy", icon: Zap },
  { id: "WATER", label: "Water", icon: Droplet },
  { id: "WASTE", label: "Waste", icon: Trash2 },
  { id: "TRANSPORTATION", label: "Transportation", icon: Bus },
  { id: "FOOD", label: "Food", icon: Utensils },
];

const Comparison = () => {
  const { currentUser } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userAssessments, setUserAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [periodA, setPeriodA] = useState("");
  const [periodB, setPeriodB] = useState("");

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getUserAssessments(currentUser.uid)
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setUserAssessments(list);

          const periods = Array.from(new Set(list.map((a) => a.period).filter(Boolean))).sort(
            (a, b) => new Date(a) - new Date(b)
          );

          if (periods.length >= 2) {
            setPeriodA(periods[0]);
            setPeriodB(periods[periods.length - 1]);
          } else if (periods.length === 1) {
            setPeriodA(periods[0]);
            setPeriodB(periods[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  // Compute metrics for Period A and Period B
  const getPeriodData = (periodStr) => {
    const items = userAssessments.filter((a) => a.period === periodStr);
    const scoresMap = {};
    let totalScore = 0;
    let count = 0;

    CATEGORY_MAP.forEach((cat) => {
      const found = items.find((a) => (a.category || "").toUpperCase() === cat.id);
      if (found && found.score !== null && found.score !== undefined) {
        scoresMap[cat.id] = found.score;
        totalScore += found.score;
        count += 1;
      } else {
        scoresMap[cat.id] = null;
      }
    });

    const avgScore = count > 0 ? Math.round(totalScore / count) : 0;
    return { avgScore, scoresMap, count };
  };

  const dataA = getPeriodData(periodA);
  const dataB = getPeriodData(periodB);

  const overallDiff = dataB.avgScore - dataA.avgScore;
  const overallPctChange =
    dataA.avgScore > 0 ? Number(((overallDiff / dataA.avgScore) * 100).toFixed(1)) : 0;

  const availablePeriods = Array.from(
    new Set(userAssessments.map((a) => a.period).filter(Boolean))
  ).sort((a, b) => new Date(b) - new Date(a));

  const improvedCategories = [];
  const declinedCategories = [];

  CATEGORY_MAP.forEach((cat) => {
    const sA = dataA.scoresMap[cat.id];
    const sB = dataB.scoresMap[cat.id];
    if (sA !== null && sB !== null) {
      if (sB > sA) improvedCategories.push({ ...cat, diff: sB - sA, sA, sB });
      else if (sB < sA) declinedCategories.push({ ...cat, diff: sB - sA, sA, sB });
    }
  });

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* Header Banner */}
          <div className="card-eco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight flex items-center">
                <ArrowUpDown className="w-6 h-6 mr-2.5 text-eco-primary" />
                Performance Comparison
              </h1>
              <p className="text-xs sm:text-sm text-eco-muted mt-1 font-sans">
                Compare campus sustainability performance across two evaluation periods.
              </p>
            </div>

            {/* Period Selectors */}
            <div className="flex items-center space-x-2 bg-eco-soft p-2 rounded-2xl border border-eco-border shrink-0 text-xs">
              <div className="flex items-center space-x-1">
                <span className="font-heading font-bold text-eco-muted">Period A:</span>
                <select
                  value={periodA}
                  onChange={(e) => setPeriodA(e.target.value)}
                  className="bg-white border border-eco-border rounded-xl px-2 py-1 font-heading font-bold text-slate-800"
                >
                  {availablePeriods.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <span className="font-heading font-bold text-eco-primary">vs</span>

              <div className="flex items-center space-x-1">
                <span className="font-heading font-bold text-eco-muted">Period B:</span>
                <select
                  value={periodB}
                  onChange={(e) => setPeriodB(e.target.value)}
                  className="bg-white border border-eco-border rounded-xl px-2 py-1 font-heading font-bold text-slate-800"
                >
                  {availablePeriods.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {availablePeriods.length < 2 ? (
            <div className="card-eco p-10 text-center space-y-3">
              <div className="icon-pill w-14 h-14 bg-eco-soft text-eco-primary mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Multiple Periods Required
              </h3>
              <p className="text-xs text-eco-muted max-w-md mx-auto">
                Complete assessments for at least two different periods (months) to unlock historical performance comparison.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overall Comparison Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="card-eco p-5 text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                    Period A ({periodA})
                  </span>
                  <div className="text-3xl font-heading font-black text-slate-900">
                    {dataA.avgScore} / 100
                  </div>
                  <span className="text-[11px] text-eco-muted">Baseline Score</span>
                </div>

                <div className="card-eco p-5 text-center space-y-1 bg-eco-soft border-eco-primary/30">
                  <span className="text-[10px] font-heading font-bold text-eco-primary uppercase">
                    Period B ({periodB})
                  </span>
                  <div className="text-3xl font-heading font-black text-eco-primary">
                    {dataB.avgScore} / 100
                  </div>
                  <span className="text-[11px] text-eco-muted">Current Score</span>
                </div>

                <div className="card-eco p-5 text-center space-y-1">
                  <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                    Net Score Difference
                  </span>
                  <div className={`text-3xl font-heading font-black flex items-center justify-center ${
                    overallDiff > 0 ? "text-emerald-600" : overallDiff < 0 ? "text-rose-600" : "text-slate-700"
                  }`}>
                    {overallDiff > 0 ? `+${overallDiff}` : overallDiff}
                    <span className="text-sm font-bold ml-1.5 font-sans">
                      ({overallPctChange > 0 ? `+${overallPctChange}%` : `${overallPctChange}%`})
                    </span>
                  </div>
                  <span className="text-[11px] text-eco-muted">
                    {overallDiff > 0 ? "Overall Performance Improved" : "Performance Declined"}
                  </span>
                </div>

              </div>

              {/* Before vs After Visual Comparison Section */}
              <div className="card-eco p-6 space-y-5">
                <h3 className="text-base font-heading font-extrabold text-slate-900 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-eco-primary" />
                  Before vs After Comparison Matrix
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* BEFORE */}
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="font-heading font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                        BEFORE ({periodA})
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-slate-200 text-slate-800">
                        Score: {dataA.avgScore}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {CATEGORY_MAP.map((cat) => {
                        const score = dataA.scoresMap[cat.id];
                        const Icon = cat.icon;
                        return (
                          <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4 text-slate-600" />
                              <span className="font-heading font-bold text-slate-800">{cat.label}</span>
                            </div>
                            <span className="font-heading font-extrabold text-slate-900">
                              {score !== null ? `${score} / 100` : "N/A"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AFTER */}
                  <div className="p-5 rounded-3xl bg-eco-soft border border-eco-border space-y-4">
                    <div className="flex items-center justify-between border-b border-eco-border pb-3">
                      <span className="font-heading font-extrabold text-eco-primary text-xs uppercase tracking-wider">
                        AFTER ({periodB})
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-white text-eco-primary border border-eco-border">
                        Score: {dataB.avgScore}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {CATEGORY_MAP.map((cat) => {
                        const sA = dataA.scoresMap[cat.id];
                        const sB = dataB.scoresMap[cat.id];
                        const diff = sA !== null && sB !== null ? sB - sA : null;
                        const Icon = cat.icon;
                        return (
                          <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-eco-border text-xs">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4 text-eco-primary" />
                              <span className="font-heading font-bold text-slate-800">{cat.label}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-heading font-extrabold text-slate-900">
                                {sB !== null ? `${sB} / 100` : "N/A"}
                              </span>
                              {diff !== null && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold ${
                                  diff > 0 ? "bg-emerald-100 text-emerald-800" : diff < 0 ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"
                                }`}>
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Improved vs Needs Attention Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h4 className="font-heading font-bold text-sm">Improved Categories ({improvedCategories.length})</h4>
                  </div>
                  {improvedCategories.length === 0 ? (
                    <p className="text-xs text-emerald-800">No categories improved between these periods.</p>
                  ) : (
                    <div className="space-y-2">
                      {improvedCategories.map((c) => (
                        <div key={c.id} className="p-3 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between text-xs">
                          <span className="font-heading font-bold text-slate-900">{c.label}</span>
                          <span className="font-heading font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            {c.sA} → {c.sB} (+{c.diff} pts)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <h4 className="font-heading font-bold text-sm">Needs Attention / Declined ({declinedCategories.length})</h4>
                  </div>
                  {declinedCategories.length === 0 ? (
                    <p className="text-xs text-rose-800">Great job! No category scores declined between these periods.</p>
                  ) : (
                    <div className="space-y-2">
                      {declinedCategories.map((c) => (
                        <div key={c.id} className="p-3 rounded-2xl bg-white border border-rose-200 flex items-center justify-between text-xs">
                          <span className="font-heading font-bold text-slate-900">{c.label}</span>
                          <span className="font-heading font-extrabold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                            {c.sA} → {c.sB} ({c.diff} pts)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Comparison;
