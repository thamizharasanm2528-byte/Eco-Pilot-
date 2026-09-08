import React from "react";
import { Leaf } from "lucide-react";

const LoadingScreen = ({ label = "Loading EcoPilot..." }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-700">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100/80 animate-pulse">
          <Leaf className="w-8 h-8 text-emerald-600 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex flex-col items-center space-y-1">
          <span className="text-lg font-semibold text-slate-800">EcoPilot</span>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
