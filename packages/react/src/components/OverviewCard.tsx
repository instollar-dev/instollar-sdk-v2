import { FC, ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface OverviewCardProps {
  title: string;
  amount: number;
  isCurrency?: boolean;
  currencyPrefix?: string;
  unit?: string;
  trendValue?: string;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "none";
  statusText?: string;
  statusColorClass?: string;
  icon: ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  className?: string;
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

export const OverviewCard: FC<OverviewCardProps> = ({
  title,
  amount,
  isCurrency = false,
  currencyPrefix = "₦",
  unit = "",
  trendValue,
  trendLabel,
  trendDirection = "none",
  statusText,
  statusColorClass = "text-accent-yellow",
  icon,
  iconBgClass = "bg-green-50",
  iconColorClass = "text-green-500",
  className,
}) => {
  const displayAmount = isCurrency
    ? `${currencyPrefix}${formatAmount(amount)}`
    : `${formatAmount(amount)}${unit ? ` ${unit}` : ""}`;

  return (
    <div
      className={cn(
        "bg-white rounded-[12px] p-6 flex flex-col justify-between w-full border border-[#F2F4F7] shadow-[0px_4px_8px_rgba(0,0,0,0.02)] min-h-[160px]",
        className,
      )}
    >
      {/* Icon Box */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl shrink-0 flex items-center justify-center mb-4",
          iconBgClass,
          iconColorClass,
        )}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-2">
        {/* Label */}
        <span className="text-sm font-normal text-secondary-text">{title}</span>

        {/* Amount and Trend/Status Row */}
        <div className="flex items-end justify-between">
          <h3 className="text-[28px] font-bold text-[#101828] leading-none">
            {displayAmount}
          </h3>

          <div className="flex items-center gap-1.5 pb-1">
            {trendValue && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[13px] font-medium transition-colors",
                  trendDirection === "up"
                    ? "text-accentsuccessgreen"
                    : trendDirection === "down"
                      ? "text-accent-error"
                      : "text-secondary-text",
                )}
              >
                {trendDirection === "up" && <TrendingUp size={16} />}
                {trendDirection === "down" && <TrendingDown size={16} />}
                <span>{trendValue}</span>
                {trendLabel && (
                  <span className="font-normal text-secondary-text ml-1">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}

            {statusText && (
              <span className={cn("text-[13px] font-medium", statusColorClass)}>
                {statusText}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
