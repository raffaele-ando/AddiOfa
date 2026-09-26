import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { firebaseConfig } from '../lib/firebase';

interface DebugModeProps {
  onBack: () => void;
}

export default function DebugMode({ onBack }: DebugModeProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-gray-800 dark:text-white">
          Firebase Debug Info
        </h1>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="bg-[#FFE5E5] dark:bg-[#7F1D1D]/30 border-2 border-[#FF4B4B] dark:border-[#EF4444] rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-start">
          <ShieldAlert className="text-[#FF4B4B] dark:text-[#FCA5A5] shrink-0" size={32} />
          <div>
            <h2 className="text-lg font-black text-[#D80000] dark:text-[#FCA5A5] uppercase tracking-widest mb-2">
              Configurazione Attuale
            </h2>
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-4 font-medium">
              Questi sono i dati esatti che l'app sta utilizzando per connettersi a Firebase in questo momento.
              Puoi verificare se corrispondono a quelli del tuo progetto.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                  Chiave
                </th>
                <th className="py-3 px-4 font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                  Valore Utilizzato
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(firebaseConfig).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                  <td className="py-3 px-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                    {key}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-[#1CB0F6] dark:text-[#38BDF8] break-all">
                    {value || <span className="text-gray-400 italic">Non impostato</span>}
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
