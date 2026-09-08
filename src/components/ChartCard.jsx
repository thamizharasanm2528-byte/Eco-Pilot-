import React from "react";

const ChartCard = ({ title, subtitle, badge = "Analytics Data", children, action }) => {
  return (
    <div className="card-eco p-6 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-eco-border">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-heading font-bold text-eco-text">{title}</h3>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-semibold bg-eco-soft text-eco-primary border border-eco-border">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-sans text-eco-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full flex-1 min-h-[260px]">{children}</div>
    </div>
  );
};

export default ChartCard;
