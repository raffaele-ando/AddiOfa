import React from 'react';
import { Icona } from '../brand/icone/Icona';
import { firebaseConfig } from '../lib/firebase';

interface DebugModeProps {
  onBack: () => void;
}

export default function DebugMode({ onBack }: DebugModeProps) {
  return (
    <div className="min-h-screen bg-superficie text-testo flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b border-linea">
        <button
          onClick={onBack}
          className="p-2 hover:bg-linea rounded-full transition-colors duration-100"
        >
          <Icona nome="indietro" size={26} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-testo">
          Firebase Debug Info
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="bg-basso-tinta border border-basso/30 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-start">
          <Icona nome="stato-attenzione" size={34} className="text-basso-testo shrink-0" />
          <div>
            <h2 className="text-lg font-black text-basso-testo uppercase tracking-widest mb-2">
              Configurazione Attuale
            </h2>
            <p className="text-sm text-testo mb-4 font-medium">
              Questi sono i dati esatti che l'app sta utilizzando per connettersi a Firebase in questo momento.
              Puoi verificare se corrispondono a quelli del tuo progetto.
            </p>
          </div>
        </div>

        <div className="bg-superficie-2 rounded-2xl p-6 border border-linea shadow-sm dark:shadow-none overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-linea">
                <th className="py-3 px-4 font-bold text-testo-tenue uppercase tracking-wider text-xs">
                  Chiave
                </th>
                <th className="py-3 px-4 font-bold text-testo-tenue uppercase tracking-wider text-xs">
                  Valore Utilizzato
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(firebaseConfig).map(([key, value]) => (
                <tr key={key} className="border-b border-linea last:border-0 hover:bg-linea transition-colors duration-100">
                  <td className="py-3 px-4 text-sm font-bold text-testo">
                    {key}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-azione break-all">
                    {value || <span className="text-testo-tenue italic">Non impostato</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
