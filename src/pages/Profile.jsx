import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  User,
  Building2,
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";

const Profile = () => {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || currentUser?.displayName || "");
      setOrganization(userProfile.organization || "");
    }
  }, [userProfile, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!fullName || !organization) {
      setErrorMessage("Full name and organization cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName,
        organization,
      });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const email = userProfile?.email || currentUser?.email || "N/A";
  const role = userProfile?.role || "student";
  const createdAt = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

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
              <User className="w-6 h-6 mr-2.5 text-eco-primary" />
              User Profile
            </h1>
            <p className="text-xs sm:text-sm font-sans text-eco-muted mt-1">
              Manage your personal account details and organization association.
            </p>
          </div>

          {/* Feedback banners */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-eco-soft border border-eco-border text-xs font-heading font-semibold text-eco-primary flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-eco-primary shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-heading font-semibold text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overview Profile Card */}
            <div className="card-eco p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-eco-soft text-eco-primary font-heading font-bold text-2xl flex items-center justify-center border-2 border-eco-border shadow-inner mb-4">
                {fullName.charAt(0).toUpperCase() || "U"}
              </div>

              <h2 className="text-lg font-heading font-bold text-slate-900">{fullName || "User"}</h2>
              <p className="text-xs font-sans text-eco-muted mt-0.5">{organization || "Campus"}</p>


              <div className="mt-6 w-full pt-4 border-t border-slate-100 space-y-3 text-xs text-left">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center text-slate-500">
                    <Shield className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Role
                  </span>
                  <span className="font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {role}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center text-slate-500">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Member Since
                  </span>
                  <span className="font-medium text-slate-800">{createdAt}</span>
                </div>
              </div>
            </div>

            {/* Editable Profile Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5">
                Account Information & Edits
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / College
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-400 flex items-center">
                      <Lock className="w-3 h-3 mr-0.5" /> Primary Account Email
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;
