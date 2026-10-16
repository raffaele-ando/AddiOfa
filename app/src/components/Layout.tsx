import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-fondo text-testo font-['Inter',sans-serif] selection:bg-azione-tinta transition-colors duration-100 overflow-hidden sm:p-6 flex flex-col">
      <div className="w-full max-w-3xl mx-auto flex-1 min-h-0 sm:max-h-[800px] sm:my-auto flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
