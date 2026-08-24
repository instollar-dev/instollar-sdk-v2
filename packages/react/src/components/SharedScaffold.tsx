import {
  useState,
  FC,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import type { ReactElement } from "react";

export interface SharedScaffoldProps {
  sidebar: ReactNode;
  header: ReactNode;
  children?: ReactNode;
}

export const SharedScaffold: FC<SharedScaffoldProps> = ({
  sidebar,
  header,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarWithDismiss = isValidElement(sidebar)
    ? cloneElement(sidebar as ReactElement<{ onMobileNavDismiss?: () => void }>, {
      onMobileNavDismiss: () => setIsSidebarOpen(false),
    })
    : sidebar;

  return (
    <div className="flex flex-col h-screen w-full bg-background-db overflow-hidden font-spline relative">
      <div className="flex h-full w-full flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-60 lg:hidden backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed top-0 bottom-0 left-0 w-70 bg-primary transform transition-transform rounded-r-lg duration-300 ease-in-out lg:hidden shadow-2xl z-70 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="h-full overflow-y-auto w-full">{sidebarWithDismiss}</div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden h-full lg:flex lg:flex-col shrink-0 p-5 pr-0 relative z-20">
          <div className="h-full w-64 bg-primary text-white rounded-2xl transition-all duration-300 shadow-xl">
            {sidebarWithDismiss}
          </div>
        </aside>

        {/* Main Content Area */}
        <div
          id="main-scroll-container"
          className="flex flex-1 flex-col h-full overflow-y-auto custom-scrollbar pt-0 w-full"
        >
          <div className="w-full max-w-[1600px] mx-auto flex flex-col pb-12 h-full min-h-0">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-background lg:bg-background-db lg:px-8 lg:pt-5 lg:pb-7.5">
              <header className="w-full lg:flex lg:items-center lg:p-5 lg:bg-background lg:rounded-lg">
                {isValidElement(header)
                  ? cloneElement(header as any, {
                    onSidebarToggle: () => setIsSidebarOpen(true),
                  })
                  : header}
              </header>
            </div>

            {/* Page Content */}
            <main className="flex-1 mx-0 lg:mx-8 bg-background-db p-4 lg:p-0 pb-10 mt-0 lg:min-h-0 relative">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
