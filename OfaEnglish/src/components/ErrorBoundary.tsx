import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-[100dvh] w-full flex items-center justify-center p-6 bg-[#F7F9FB] dark:bg-[#111B21] text-[#4B4B4B] dark:text-[#E2E8F0]">
          <div className="max-w-md w-full bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 border-2 border-gray-200 dark:border-[#334155] shadow-lg text-center flex flex-col items-center">
            <div className="bg-[#FFE5E5] dark:bg-[#7F1D1D]/30 text-[#FF4B4B] dark:text-[#F87171] p-4 rounded-2xl mb-4">
              <AlertTriangle size={36} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">Qualcosa è andato storto</h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">
              Si è verificato un problema imprevisto. Puoi riavviare l'applicazione in sicurezza.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
            >
              <RotateCcw size={18} strokeWidth={2.5} />
              Ricarica App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
