import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Zap,
  Droplet,
  Trash2,
  Bus,
  Utensils,
  Wind,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
  Building2,
  Globe2,
  Users,
  Check,
  Layers,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const heroImages = [
  { url: "/eco_campus_hero.png", title: "Sustainable University Campus Architecture", altFallback: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80" },
  { url: "/eco_campus_detail.png", title: "High-Tech Glass Solar Roof & Vertical Gardens", altFallback: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80" },
  { url: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80", title: "Clean Solar Energy Technology" },
  { url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80", title: "Wind Energy Turbines & Green Fields" },
  { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80", title: "Eco-Friendly Green Building Design" },
  { url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80", title: "Environmental Protection & Reforestation" },
  { url: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80", title: "Water Conservation & Greywater Systems" },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80", title: "Zero-Waste Campus Sorting & Recycling" },
  { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", title: "Low-Emission Campus Transport & EV" },
  { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80", title: "Lush Evergreen Forest & Campus Canopy" },
];

const Landing = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000); // Rotates every 2 seconds
    return () => clearInterval(timer);
  }, []);
  const solutions = [
    {
      id: "assessment",
      name: "Sustainability Assessment",
      icon: Leaf,
      description: "Measure, track and improve your environmental impact with our smart assessment tools.",
      image: "/sustainabilityassessment.png",
    },
    {
      id: "energy",
      name: "Energy Management",
      icon: Zap,
      description: "Optimize energy usage, reduce waste and save resources efficiently with renewable insights.",
      image: "/energymanagement.png",
    },
    {
      id: "waste",
      name: "Waste Management",
      icon: Trash2,
      description: "Smart waste tracking and recycling solutions for a cleaner, zero-waste tomorrow.",
      image: "/wastemanagement.png",
    },
    {
      id: "water",
      name: "Water Conservation",
      icon: Droplet,
      description: "Monitor consumption rates, stormwater runoff, and greywater recycling efficacy.",
      image: "/waterconservation.png",
    },
    {
      id: "transport",
      name: "Transportation",
      icon: Bus,
      description: "Analyze campus commute patterns and identify lower-impact EV mobility opportunities.",
      image: "/transportation.png",
    },
    {
      id: "food",
      name: "Food Sustainability",
      icon: Utensils,
      description: "Evaluate dining hall food waste metrics, local farm sourcing, and organic composting.",
      image: "/foodsustainability.png",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Assess",
      description: "Evaluate your current environmental impact in just a few minutes.",
      icon: ClipboardListIcon,
    },
    {
      step: "02",
      title: "Analyze",
      description: "Our smart tools analyze data and provide valuable insights.",
      icon: BarChart3,
    },
    {
      step: "03",
      title: "Improve",
      description: "Take action with personalized recommendations and track your progress.",
      icon: PlantIcon,
    },
  ];

  const impactMetrics = [
    { label: "Active Users", value: "12K+", sub: "Growing eco-conscious community", icon: Users },
    { label: "Trees Saved", value: "85K+", sub: "Contributing to a greener planet", icon: Leaf },
    { label: "CO₂ Reduced", value: "42%", sub: "Reducing carbon footprint together", icon: Wind },
  ];

  return (
    <div className="min-h-screen bg-eco-bg text-eco-text flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-eco-border">
        {/* Soft background glow decoration */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-eco-soft/60 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-eco-soft border border-eco-border text-eco-primary text-xs font-heading font-semibold">
                <Leaf className="w-3.5 h-3.5 fill-current" />
                <span>Building a Sustainable Future</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-slate-900 leading-[1.1]">
                BUILD A <br />
                <span className="text-eco-primary font-black">GREENER</span> FUTURE
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-eco-muted font-sans leading-relaxed max-w-xl">
                Smart technology for a sustainable and environmentally responsible world. Measure your campus sustainability performance, analyze data with AI, and discover practical actions.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to="/register" className="btn-eco-primary text-sm px-7 py-3.5">
                  <Leaf className="w-4 h-4 mr-2 fill-current" />
                  <span>Get Started</span>
                </Link>

                <a href="#solutions" className="btn-eco-secondary text-sm px-7 py-3.5">
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center space-x-3 text-xs font-sans text-eco-muted">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User 1" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User 2" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User 3" />
                </div>
                <span className="font-medium text-slate-700">Join 12,000+ people making an impact</span>
              </div>

            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Floating EcoPilot Emblem Badge */}
                <div className="absolute -top-4 -left-4 z-30 w-12 h-12 rounded-2xl bg-white shadow-eco-md border border-eco-border flex items-center justify-center p-1 ring-4 ring-eco-soft">
                  <img src="/logo.png" alt="EcoPilot Logo" className="w-full h-full object-cover rounded-xl" />
                </div>

                {/* Single Hero Image Container */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-eco-lg bg-eco-soft p-2 border border-eco-border">
                  <img
                    src="/eco.png"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80";
                    }}
                    alt="EcoPilot Sustainable Campus"
                    className="w-full h-auto rounded-2xl object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* FLOATING STATISTICS BAR */}
          <div className="mt-16 bg-white rounded-3xl border border-eco-border p-6 shadow-eco-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-eco-border">
            {impactMetrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className={`flex items-center space-x-4 ${i !== 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}`}>
                  <div className="icon-pill w-12 h-12 text-eco-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                      {m.value}
                    </div>
                    <div className="text-xs font-heading font-bold text-slate-800">{m.label}</div>
                    <div className="text-[11px] font-sans text-eco-muted">{m.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SOLUTIONS SECTION */}
      <section id="solutions" className="py-20 bg-eco-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-heading font-bold uppercase tracking-wider text-eco-primary">
              <span>Our Solutions</span>
              <Leaf className="w-3.5 h-3.5 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Innovative Solutions for a Sustainable Tomorrow
            </h2>
            <p className="text-sm sm:text-base text-eco-muted font-sans">
              Everything you need to understand, improve, and monitor campus sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  className="card-eco group overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden bg-eco-soft">
                    <img
                      src={sol.image}
                      alt={sol.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 icon-pill bg-white/90 backdrop-blur-xs shadow-eco-sm">
                      <Icon className="w-5 h-5 text-eco-primary" />
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-eco-primary transition-colors">
                        {sol.name}
                      </h3>
                      <p className="mt-2 text-xs font-sans text-eco-muted leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to="/register"
                        className="inline-flex items-center text-xs font-heading font-semibold text-eco-primary hover:text-[#256829]"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-eco-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-heading font-bold uppercase tracking-wider text-eco-primary">
              <span>How It Works</span>
              <Leaf className="w-3.5 h-3.5 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Simple Steps, <span className="text-eco-primary">Big Impact</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorks.map((hw, idx) => {
              const Icon = hw.icon;
              return (
                <div key={hw.step} className="bg-eco-bg rounded-3xl p-8 border border-eco-border space-y-4 relative group hover:shadow-eco-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-heading font-black text-eco-primary/30 group-hover:text-eco-primary transition-colors">
                      {hw.step}
                    </span>
                    <div className="icon-pill bg-white shadow-eco-sm">
                      <Icon className="w-5 h-5 text-eco-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-slate-900">{hw.title}</h3>
                  <p className="text-xs font-sans text-eco-muted leading-relaxed">{hw.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* AI INTELLIGENCE HIGHLIGHT SECTION */}
      <section className="py-20 bg-eco-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-eco-soft border border-eco-border text-eco-primary text-xs font-heading font-semibold">
                <Bot className="w-4 h-4" />
                <span>AI Sustainability Intelligence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
                Turn Sustainability Data Into <span className="text-eco-primary">Intelligent Action</span>
              </h2>

              <p className="text-sm sm:text-base text-eco-muted font-sans leading-relaxed">
                EcoPilot combines campus data analytics and verified sustainability guidelines to generate evidence-based recommendations.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Automated campus sustainability performance scoring",
                  "Searchable repository of LEED & sustainability guidelines",
                  "AI-powered strategic decarbonization recommendations",
                  "Step-by-step implementation plans with clear source citations",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center space-x-3 text-xs font-sans text-slate-800 font-semibold">
                    <div className="w-5 h-5 rounded-full bg-eco-soft text-eco-primary flex items-center justify-center shrink-0 font-bold">
                      ✓
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/register" className="btn-eco-primary text-xs">
                  <span>Try AI Sustainability Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            {/* AI Preview Card */}
            <div className="lg:col-span-6">
              <div className="card-eco p-6 sm:p-8 space-y-5 border-2 border-eco-primary/30 relative">
                <div className="flex items-center justify-between border-b border-eco-border pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="icon-pill bg-eco-primary text-white w-9 h-9">
                      <Sparkles className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">AI Sustainability Insight</h4>
                      <span className="text-[10px] text-eco-muted font-sans">Campus Energy Efficiency Focus</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    High Priority
                  </span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div className="p-3 bg-eco-soft rounded-xl border border-eco-border flex justify-between items-center">
                    <span className="font-semibold text-eco-text">Energy Performance Score:</span>
                    <span className="font-heading font-bold text-eco-primary text-sm">31 / 100</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-heading font-bold text-slate-900 block">AI Strategic Recommendation:</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      "Increase renewable energy adoption and introduce energy-efficient HVAC infrastructure to reduce campus grid electricity reliance by up to 35%."
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-heading text-eco-muted pt-2 border-t border-eco-border">
                  <span className="flex items-center text-eco-primary font-bold">
                    <Bot className="w-3.5 h-3.5 mr-1" />
                    AI Decision Intelligence
                  </span>
                  <span>Evidence-Grounded Recommendations</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-20 bg-eco-dark text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 text-eco-accent text-xs font-heading font-semibold border border-white/15">
            <Leaf className="w-3.5 h-3.5 fill-current" />
            <span>Join the Movement for a Better Tomorrow</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight leading-tight">
            Ready to Build a More Sustainable Campus?
          </h2>

          <p className="text-sm sm:text-base text-eco-border font-sans max-w-xl mx-auto leading-relaxed">
            Start measuring your campus sustainability performance today. Simple, data-driven, and powered by AI intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn-eco-primary bg-eco-secondary hover:bg-eco-accent text-eco-dark px-8 py-3.5 font-bold">
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to="/login" className="btn-eco-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-3.5 font-bold">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

// Helper Icon Components for How It Works
const ClipboardListIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PlantIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default Landing;
