import { FC, ReactNode } from "react";

export interface SidebarShellProps {
  nav: ReactNode;
  footer: ReactNode;
  logo: ReactNode;
  onMobileNavDismiss?: () => void;
}

export const SidebarShell: FC<SidebarShellProps> = ({
  nav,
  footer,
  logo,
}) => {
  return (
    <div className="flex flex-col h-full min-h-0 py-8 relative">
      <div className="shrink-0 px-4 mb-6">
        <div className="px-3.5">
          {logo}
        </div>
        <div className="h-px w-full bg-border-light mt-6 opacity-20" />
      </div>

      <nav className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {nav}
      </nav>

      <div className="shrink-0 px-4">
        {footer}
      </div>
    </div>
  );
};
