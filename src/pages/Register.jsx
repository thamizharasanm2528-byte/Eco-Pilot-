import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, Lock, Mail, User, Building2, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, currentUser, isDemo } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword || !organization) {
      setError("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, fullName, organization);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
                Join EcoPilot
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight leading-tight">
                Register Your Campus Account
              </h2>
              <p className="text-xs text-eco-border leading-relaxed font-sans pt-1">
                Start tracking energy, water, waste, transportation, and dining sustainability performance for your institution.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-8 relative z-10 border-t border-white/10 text-xs">
            {["Custom Institution Profile", "Deterministic Analytics Matrix", "AI Action Plans & RAG Sources"].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-eco-border">
                <CheckCircle2 className="w-4 h-4 text-eco-accent shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <div>
            <h3 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h3>
            <p className="text-xs font-sans text-eco-muted mt-1">
              Join your campus sustainability team on EcoPilot.
            </p>
          </div>

          {isDemo && (
            <div className="p-3 rounded-2xl bg-eco-soft border border-eco-border text-xs text-eco-primary">
              <span className="font-heading font-bold flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-eco-highlight" />
                Demo Mode Active:
              </span>
              <p className="text-[11px] font-sans">
                Registration creates a local user profile and redirects to your dashboard.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
            <div>
              <label className="block font-heading font-bold text-slate-800 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading font-bold text-slate-800 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arivera@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading font-bold text-slate-800 mb-1">
                Organization / College
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Green State University"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-heading font-bold text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-slate-800 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-eco-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-eco-bg border border-eco-border focus:bg-white focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/20 text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-eco-primary w-full py-3.5 text-xs"
              >
                <span>{submitting ? "Creating Account..." : "Complete Registration"}</span>
                {!submitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center border-t border-eco-border">
            <p className="text-xs text-eco-muted font-sans">
              Already have an account?{" "}
              <Link to="/login" className="font-heading font-bold text-eco-primary hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
