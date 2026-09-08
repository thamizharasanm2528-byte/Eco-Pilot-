import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const MetricCard = ({
  title,
  value,
  unit = "",
  change,
  changeType = "positive", // positive, negative, neutral
  icon: Icon,
  badgeText = "Live Metric",
  subtitle,
}) => {
  return (
    <div className="card-eco p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-eco-muted">
          {title}
        </span>
        <div className="flex items-center space-x-1.5">
          {badgeText && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold bg-eco-soft text-eco-primary border border-eco-border">
              {badgeText}
            </span>
          )}
          {Icon && (
            <div className="icon-pill w-8 h-8">
              <Icon className="w-4 h-4 text-eco-primary" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline space-x-1">
        <span className="text-2xl sm:text-3xl font-heading font-extrabold text-eco-text tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-sans font-medium text-eco-muted">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="flex items-center space-x-2 text-xs font-sans border-t border-eco-border pt-2">
          {change && (
            <span
              className={`inline-flex items-center font-medium ${
                changeType === "positive"
                  ? "text-eco-primary"
                  : changeType === "negative"
                  ? "text-rose-600"
                  : "text-eco-muted"
              }`}
            >
              {changeType === "positive" ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ) : changeType === "negative" ? (
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              ) : null}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-eco-muted truncate text-[11px]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
