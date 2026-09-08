import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, currentUser, isDemo } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-eco-bg flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-eco-border shadow-eco-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Sustainability Visual Banner */}
        <div className="lg:col-span-5 bg-eco-dark text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-eco-secondary/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-eco-secondary text-white flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight">EcoPilot</span>
            </Link>

            <div className="space-y-2 pt-6">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-eco-accent">
                Campus Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight">
                Measure & Improve Your Campus Impact
              </h2>
              <p className="text-xs text-eco-border leading-relaxed font-sans pt-1">
                Access your campus metrics, advanced analytics, verified sustainability knowledge, and AI decision intelligence.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-8 relative z-10 border-t border-white/10 text-xs">
            {["Secure Authentication", "Cloud Assessment Records", "AI Sustainability Recommendations"].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-eco-border">
                <CheckCircle2 className="w-4 h-4 text-eco-accent shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              Sign In to EcoPilot
            </h3>
            <p className="text-xs font-sans text-eco-muted mt-1">
              Enter your credentials to access your institution's dashboard.
            </p>
          </div>

          {isDemo && (
            <div className="p-3.5 rounded-2xl bg-eco-soft border border-eco-border text-xs text-eco-primary space-y-0.5">
              <span className="font-heading font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-eco-highlight" />
                Demo Mode Active:
              </span>
              <p className="text-[11px] font-sans">
                You can test login using any email (e.g. <code className="font-bold bg-white px-1 py-0.5 rounded border">admin@campus.edu</code>).
              </p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-heading font-bold text-slate-800 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campus.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading font-bold text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-eco-muted hover:text-eco-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-eco-primary w-full py-3.5 text-xs"
              >
                <span>{submitting ? "Signing In..." : "Sign In to Dashboard"}</span>
                {!submitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center border-t border-eco-border">
            <p className="text-xs text-eco-muted font-sans">
              Don't have a campus account?{" "}
              <Link to="/register" className="font-heading font-bold text-eco-primary hover:underline">
                Register Campus Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
