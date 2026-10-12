import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Flag, RotateCcw } from 'lucide-react';
import StatoPagina from '../screens/extra/servizi/StatoPagina';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  /** Il browser non ha aperto la pagina «Segnala»: si mostra il testo da copiare. */
  mostraDettagli: boolean;
}

/** Testo breve dell'errore, senza traccia dello stack né dati dell'utente: è quello che finisce nella segnalazione. */
function dettaglio(error: Error | null): string {
  const t = `${error?.name ?? 'Error'}: ${error?.message ?? 'errore sconosciuto'}`.replace(/\s+/g, ' ').trim();
  return t.length > 200 ? `${t.slice(0, 199)}…` : t;
}

/**
 * Errore imprevisto: stessa pagina di stato del kit blu (concept 16/17), con «Riprova» (ricarica: i progressi sono sul dispositivo)
 * e «Segnala» (apre la schermata `segnala` con il dettaglio tecnico, che l'utente vede prima di salvare).
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      mostraDettagli: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleSegnala = () => {
    const url = `${window.location.pathname}?vista=segnala&tipo=app&errore=${encodeURIComponent(dettaglio(this.state.error))}`;
    try {
      window.location.assign(url);
    } catch {
      this.setState({ mostraDettagli: true });
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const testo = dettaglio(this.state.error);
      return (
        <div className="h-[100dvh] w-full bg-fondo">
          <StatoPagina
            illustrazione="suggerimenti-consigli"
            ruolo="alert"
            titolo="Qualcosa non ha funzionato"
            testo="Si è verificato un problema imprevisto. I tuoi progressi sono salvati su questo dispositivo: puoi riprovare in sicurezza."
            azioni={[
              { testo: 'Riprova', onClick: this.handleReset, icona: <RotateCcw size={18} strokeWidth={2.5} aria-hidden="true" /> },
              { testo: 'Segnala il problema', onClick: this.handleSegnala, tipo: 'secondaria', icona: <Flag size={18} aria-hidden="true" /> },
            ]}>
            {this.state.mostraDettagli && (
              <div>
                <p className="text-[13px] leading-[19px] text-testo-tenue">Non riesco ad aprire la pagina di segnalazione. Seleziona e copia questo testo:</p>
                <textarea readOnly rows={3} value={`Segnalazione AddiOFA · Problema dell'app\n\nDettaglio tecnico: ${testo}`} onFocus={e => e.currentTarget.select()}
                  className="mt-2 w-full resize-none rounded-[10px] bg-superficie-2 p-3 text-[12.5px] leading-[18px] text-testo" aria-label="Dettaglio tecnico da copiare" />
              </div>
            )}
          </StatoPagina>
        </div>
      );
    }

    return this.props.children;
  }
}
