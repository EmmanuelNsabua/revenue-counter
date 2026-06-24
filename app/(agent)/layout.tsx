import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AgentAccessWrapper } from "@/components/layout/AgentAccessWrapper";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Sidebar hidden on mobile and during print */}
      <div className="hidden md:block print:hidden">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0 print:pb-0">
        <div className="print:hidden">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 print:p-0 print:overflow-visible">
          <AgentAccessWrapper>
            {children}
          </AgentAccessWrapper>
        </main>
      </div>

      {/* Bottom Navigation for mobile - hidden during print */}
      <div className="print:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
