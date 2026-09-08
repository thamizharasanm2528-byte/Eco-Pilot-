import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Sun,
  LayoutDashboard,
  Bell,
} from "lucide-react";

const Navbar = ({ toggleMobileSidebar }) => {
  const { currentUser, userProfile, logout, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = userProfile?.fullName || currentUser?.displayName || currentUser?.email || "User";
  const organization = userProfile?.organization || "Campus Leader";

  const publicNavLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Solutions", path: "/#solutions" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Impact", path: "/#impact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-eco-border shadow-eco-sm py-2.5"
          : "bg-white border-b border-eco-border py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Logo & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            {currentUser && toggleMobileSidebar && (
              <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 rounded-xl text-eco-text hover:bg-eco-soft transition-colors"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5 text-eco-primary" />
              </button>
            )}

            <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-full bg-eco-primary flex items-center justify-center text-white shadow-eco-sm group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-slate-900 text-xl tracking-tight flex items-center">
                  EcoPilot
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Public Nav Links (When on public pages or desktop) */}
          {!currentUser && (
            <nav className="hidden md:flex items-center space-x-7 text-xs font-heading font-medium text-eco-muted">
              {publicNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="hover:text-eco-primary transition-colors py-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* RIGHT: User Actions / Auth Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Demo Badge */}
            {isDemo && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-heading font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 mr-1 text-eco-highlight" />
                Demo Mode
              </span>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold text-white bg-eco-primary hover:bg-[#256829] shadow-eco-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-eco-soft transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-eco-soft text-eco-primary font-heading font-bold flex items-center justify-center text-xs border border-eco-border">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left pr-1">
                    <span className="text-xs font-heading font-bold text-eco-text line-clamp-1">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-eco-muted line-clamp-1">
                      {organization}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-eco-muted hover:text-eco-text hover:bg-eco-soft transition-colors border border-eco-border"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-xs font-heading font-semibold text-eco-text hover:bg-eco-soft transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-eco-primary px-5 py-2 text-xs"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-eco-text hover:bg-eco-soft"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Navigation Drawer for Unauthenticated Visitors */}
        {!currentUser && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-eco-border mt-3 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-heading font-medium text-eco-text">
              {publicNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-eco-soft"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
