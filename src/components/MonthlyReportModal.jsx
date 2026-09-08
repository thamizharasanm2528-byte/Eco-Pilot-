import React, { useRef, useState } from "react";
import {
  FileText,
  X,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";

const MonthlyReportModal = ({ isOpen, onClose, reportData, loading }) => {
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = reportRef.current;
      const periodLabel = reportData?.period || "Report";

      const opt = {
        margin: [12, 12, 12, 12],
        filename: `EcoPilot_Sustainability_Report_${periodLabel}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-dark/60 backdrop-blur-xs font-sans">
      <div className="bg-white max-w-3xl w-full rounded-3xl border border-eco-border shadow-eco-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-eco-border bg-eco-bg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="icon-pill w-10 h-10 bg-white border border-eco-border text-eco-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-extrabold text-slate-900">
                Monthly AI Sustainability Report
              </h2>
              <p className="text-xs font-sans text-eco-muted">
                {reportData?.period ? `Period: ${reportData.period}` : "AI Grounded Performance Summary"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {reportData && !loading && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="btn-eco-primary px-4 py-2 text-xs rounded-full flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download PDF
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-eco-muted hover:bg-eco-soft hover:text-eco-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans" ref={reportRef}>
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-eco-soft text-eco-primary flex items-center justify-center mx-auto animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading font-bold text-slate-900 text-sm">
                  Generating Monthly AI Sustainability Report...
                </p>
                <p className="text-xs text-eco-muted mt-1">
                  Analyzing campus data across Energy, Water, Waste, Transportation, and Food metrics.
                </p>
              </div>
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              
              {/* Executive Summary Card */}
              <div className="p-5 rounded-3xl bg-eco-soft border border-eco-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-eco-primary">
                    EcoPilot AI Assessment Report — {reportData.period}
                  </span>
                  <h3 className="text-base font-heading font-extrabold text-slate-900">
                    Executive Performance Overview
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                    {reportData.summary}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-eco-border text-center min-w-[120px] shadow-eco-sm shrink-0">
                  <div className="text-3xl font-heading font-black text-eco-primary">
                    {reportData.overall_score || 0}
                  </div>
                  <span className="text-[10px] font-heading font-bold text-eco-muted uppercase">
                    Overall Score
                  </span>
                </div>
              </div>

              {/* Grid: Improvements & Attention Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Top Improvements */}
                <div className="p-4 rounded-2xl bg-white border border-eco-border space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="font-heading font-bold text-xs">Top Improvements</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {(reportData.top_improvements || []).map((imp, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas Requiring Attention */}
                <div className="p-4 rounded-2xl bg-white border border-eco-border space-y-3">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <h4 className="font-heading font-bold text-xs">Areas Requiring Attention</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {(reportData.areas_requiring_attention || []).map((area, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Plan Weeks */}
              {reportData.action_plan_weeks && reportData.action_plan_weeks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Next Month 4-Week Action Plan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reportData.action_plan_weeks.map((w, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-eco-bg border border-eco-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-eco-primary text-xs">
                            {w.week}
                          </span>
                          <Calendar className="w-3.5 h-3.5 text-eco-muted" />
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {(w.actions || []).map((act, aIdx) => (
                            <li key={aIdx} className="flex items-start space-x-1.5">
                              <ArrowRight className="w-3 h-3 text-eco-primary shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              {reportData.recommendations && reportData.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-heading font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Strategic AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {reportData.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="p-4 rounded-2xl bg-white border border-eco-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-slate-900 text-xs">
                            {rec.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border">
                            Impact: {rec.expectedImpact || "HIGH"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rec.action || rec.description}
                        </p>
                        {rec.estimatedImprovement && (
                          <span className="inline-block text-[10px] font-heading font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Estimated Improvement: {rec.estimatedImprovement}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-eco-muted italic text-center border-t border-eco-border pt-4">
                Generated by EcoPilot AI Advisor using verified campus assessment metrics.
              </p>

            </div>
          ) : (
            <div className="py-12 text-center text-eco-muted">
              Unable to load report data.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-eco-border bg-eco-bg flex items-center justify-end">
          <button
            onClick={onClose}
            className="btn-eco-secondary text-xs px-6 py-2 rounded-full"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default MonthlyReportModal;
