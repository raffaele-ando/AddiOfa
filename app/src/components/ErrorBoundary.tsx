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
        <div className="h-[100dvh] w-full flex items-center justify-center p-6 bg-fondo text-testo">
          <div className="max-w-md w-full bg-superficie rounded-3xl p-6 sm:p-8 border border-linea shadow-lg dark:shadow-none text-center flex flex-col items-center">
            <div className="bg-basso-tinta text-basso-testo p-4 rounded-2xl mb-4">
              <AlertTriangle size={36} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">Qualcosa è andato storto</h2>
            <p className="text-sm font-bold text-testo-tenue mb-6">
              Si è verificato un problema imprevisto. Puoi riavviare l'applicazione in sicurezza.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-azione hover:bg-azione-scuro border-azione text-azione-su font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-100"
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
