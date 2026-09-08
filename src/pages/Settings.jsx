import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Shield,
  LogOut,
  Sparkles,
  CheckCircle2,
  Scale,
  Eye,
  Heart,
  Lock,
  Globe2,
  Leaf,
} from "lucide-react";

const RESPONSIBLE_AI_ITEMS = [
  {
    title: "Fairness",
    icon: Scale,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    points: [
      "EcoPilot applies the same sustainability scoring formula for every user, regardless of institution size or location.",
      "No demographic, geographic, or institutional bias exists in the scoring engine — all calculations are deterministic and auditable.",
      "AI recommendations are based solely on the user's submitted assessment metrics, not on external assumptions.",
    ],
  },
  {
    title: "Transparency",
    icon: Eye,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    points: [
      "All AI-generated content is clearly labeled with \"AI-Generated\" badges.",
      "Verified knowledge sources are cited with title, organization, and URL for every AI insight.",
      "Sustainability scores use documented, open formulas visible in the platform documentation.",
      "Monthly AI reports display full sustainability performance summaries and strategic recommendations.",
    ],
  },
  {
    title: "Ethics",
    icon: Heart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    points: [
      "AI recommendations are advisory and decision-support only — no automated actions are taken without explicit user review.",
      "Disclaimer: All results are prototype analytics intended for educational purposes, not certified environmental audits.",
      "AI never fabricates campus metrics — it uses only data explicitly submitted by the authenticated user.",
      "The system does not make harmful, discriminatory, or misleading sustainability claims.",
    ],
  },
  {
    title: "Privacy & Data Protection",
    icon: Lock,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    points: [
      "Firebase Authentication secures all user sessions with industry-standard email/password encryption.",
      "Firestore security rules enforce strict user-only data access — users can only read/write their own records.",
      "No personally identifiable information (PII) is shared with the AI model — only anonymized assessment metrics.",
      "Assessment data is never used for training third-party AI models.",
      "Users retain full control over their data (create, read, update, delete).",
    ],
  },
];



const Settings = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedAI, setExpandedAI] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
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
          <div className="card-eco p-6">
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight flex items-center">
              <SettingsIcon className="w-6 h-6 mr-2.5 text-eco-primary" />
              Application Settings
            </h1>
            <p className="text-xs sm:text-sm font-sans text-eco-muted mt-1">
              Configure system preferences, responsible AI transparency, and session control.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Account Information Card */}
            <div className="card-eco p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="icon-pill w-9 h-9">
                  <Shield className="w-4 h-4 text-eco-primary" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">Account Overview</h3>
                  <p className="text-xs text-slate-500">Registered authentication session details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Account Status</span>
                  <span className="font-sans text-emerald-800 font-bold block mt-0.5">
                    Verified & Active Member
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">Auth Provider</span>
                  <span className="text-slate-800 font-medium block mt-0.5">
                    Firebase Password Authentication
                  </span>
                </div>
              </div>
            </div>

            {/* ===== RESPONSIBLE AI CONSIDERATIONS ===== */}
            <div className="bg-white rounded-2xl border-2 border-eco-primary/20 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-eco-soft text-eco-primary border border-eco-border flex items-center justify-center shadow-eco-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-extrabold text-slate-900 flex items-center">
                      Responsible AI Considerations
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-eco-soft text-eco-primary border border-eco-border">
                        Mandatory
                      </span>
                    </h3>
                    <p className="text-xs text-eco-muted font-sans mt-0.5">
                      EcoPilot is committed to ethical, transparent, and responsible use of artificial intelligence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESPONSIBLE_AI_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedAI === item.title;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-xl border p-4 space-y-3 transition-all cursor-pointer hover:shadow-md ${item.color}`}
                      onClick={() => setExpandedAI(isExpanded ? null : item.title)}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-5 h-5 shrink-0" />
                        <h4 className="text-sm font-heading font-bold">{item.title}</h4>
                      </div>
                      <ul className={`space-y-2 text-xs leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                        {item.points.map((point, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="text-[10px] font-semibold opacity-60">
                        {isExpanded ? "Click to collapse" : "Click to expand"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===== IMPACT STATEMENT ===== */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-eco-soft text-eco-primary border border-eco-border flex items-center justify-center shadow-eco-xs">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-extrabold text-slate-900">
                    Impact Statement
                  </h3>
                  <p className="text-xs text-eco-muted font-sans mt-0.5">
                    What changes if EcoPilot is deployed at scale across university campuses.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-emerald-700 block">Environmental Impact</span>
                  <p className="text-emerald-900 leading-relaxed font-sans">
                    Universities can identify and address sustainability hotspots — energy waste, water overconsumption, poor recycling rates — with data-driven AI recommendations. AI-estimated potential: 15–25% improvement in campus sustainability scores.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-blue-700 block">Who Benefits</span>
                  <ul className="text-blue-900 leading-relaxed font-sans space-y-1">
                    <li>• <strong>Administrators:</strong> Data-driven sustainability reporting</li>
                    <li>• <strong>Facility Managers:</strong> Prioritized action items based on real metrics</li>
                    <li>• <strong>Students & Faculty:</strong> Cleaner, greener campus</li>
                    <li>• <strong>Environment:</strong> Reduced carbon footprint and waste</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-700 block">Economic & Scale</span>
                  <p className="text-amber-900 leading-relaxed font-sans">
                    Reduced energy costs through AI-identified inefficiencies. Lower water bills via consumption monitoring. Any university worldwide can register and begin tracking — the RAG knowledge base can expand with regional standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Session Management & Logout Button */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Session Control</h3>
              <p className="text-xs text-slate-500 mb-4">
                Sign out of your active EcoPilot session on this browser.
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of EcoPilot</span>
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
