import { FC, ReactNode } from "react";
import { Menu } from "./Icon"; // Using internal Icon component

export interface DashboardHeaderProps {
  title?: string;
  onSidebarToggle?: () => void;
  rightElement?: ReactNode; // Pass buttons, notifications, user profile here
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  title = "Dashboard",
  onSidebarToggle,
  rightElement,
}) => {
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden w-full flex items-center justify-between py-4 bg-background px-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="text-foreground hover:text-primary transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="text-xl font-bold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-4 text-foreground/60">
          {rightElement}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex w-full items-center justify-between">
        <h2 className="text-xl font-bold text-foreground leading-[28px] py-[10px]">
          {title}
        </h2>
        <div className="flex items-center gap-[40px]">
          {rightElement}
        </div>
      </div>
    </>
  );
};
