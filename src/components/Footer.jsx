import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Send, Globe, Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-eco-dark text-white pt-16 pb-8 border-t border-eco-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5">
              <img
                src="/logo.png"
                alt="EcoPilot Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-sm bg-white p-0.5 border border-white/20"
              />
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                EcoPilot
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-eco-border max-w-sm leading-relaxed font-sans">
              AI-Powered Sustainable Campus Intelligence. Measure environmental performance, analyze metrics with AI decision intelligence, and build a greener campus.
            </p>

            {/* Badges */}
            <div className="flex items-center space-x-2 pt-2 text-[11px] text-eco-accent">
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 font-heading">
                🌱 AI for Sustainability
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 font-heading">
                🎓 Campus Intelligence
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-eco-border font-sans">
              <li><Link to="/dashboard" className="hover:text-eco-accent transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/assessments" className="hover:text-eco-accent transition-colors">Sustainability Assessments</Link></li>
              <li><Link to="/analytics" className="hover:text-eco-accent transition-colors">Advanced Analytics</Link></li>
              <li><Link to="/knowledge" className="hover:text-eco-accent transition-colors">Knowledge Base</Link></li>
              <li><Link to="/ai" className="hover:text-eco-accent transition-colors">AI Intelligence</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-eco-border font-sans">
              <li><a href="#how-it-works" className="hover:text-eco-accent transition-colors">How It Works</a></li>
              <li><a href="#solutions" className="hover:text-eco-accent transition-colors">Campus Solutions</a></li>
              <li><a href="#impact" className="hover:text-eco-accent transition-colors">Impact Metrics</a></li>
              <li><Link to="/knowledge" className="hover:text-eco-accent transition-colors">LEED & Campus Standards</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-eco-border text-xs leading-relaxed font-sans">
              Subscribe for the latest campus sustainability tips and updates.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-10 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-eco-border text-xs focus:outline-none focus:ring-2 focus:ring-eco-secondary"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-eco-secondary text-white flex items-center justify-center hover:bg-eco-accent transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-eco-border font-sans gap-4">
          <p>© {new Date().getFullYear()} EcoPilot. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
