import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-[#F6F8FC] dark:bg-[#111B21] text-[#0F172A] dark:text-[#E2E8F0] font-['Inter',sans-serif] selection:bg-[#DBEAFE] dark:selection:bg-[#1E3A8A] transition-colors duration-300 overflow-hidden sm:overflow-y-auto sm:p-6 flex flex-col">
      <div className="w-full max-w-3xl mx-auto h-full sm:h-[800px] sm:min-h-[800px] sm:my-auto sm:flex-none flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
