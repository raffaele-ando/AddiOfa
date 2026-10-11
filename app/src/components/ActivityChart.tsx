import React from 'react';
import { chiaveGiorno } from '../lib/utils';

interface ActivityChartProps {
  dailyActivity?: Record<string, number>;
}

export function ActivityChart({ dailyActivity }: ActivityChartProps) {
  // Generate 28 days (4 complete weeks) aligned to Monday - Sunday
  const days = [];
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  
  // Start date: Monday 3 weeks ago (4 weeks total = 28 days ending this Sunday)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek - 21);

  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = chiaveGiorno(d);
    const isFuture = d > today;
    
    days.push({
      date: dateStr,
      count: isFuture ? 0 : (dailyActivity?.[dateStr] || 0),
      isFuture
    });
  }

  // Calculate stats based on past and today's activity
  const activeDays = days.filter(d => !d.isFuture && d.count > 0).length;

  const getColor = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-superficie/50 border-linea/50 opacity-40';
    if (count === 0) return 'bg-superficie-2 border-linea';
    if (count <= 5) return 'bg-alto-tinta border-alto/30';
    if (count <= 15) return 'bg-alto-pieno/60 border-alto-pieno/60';
    return 'bg-alto-pieno border-alto-pieno';
  };

  return (
    <div className="h-full bg-superficie-2 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-linea  shadow-sm dark:shadow-none transition-colors duration-100 flex flex-col justify-between min-h-0">
      <div className="flex justify-between items-end mb-1 sm:mb-2 shrink-0">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-testo leading-tight">Costanza</h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-testo-tenue mt-0.5">Ultimi 28 giorni</p>
        </div>
        <div className="text-right">
          <div className="text-sm sm:text-lg font-black text-alto-testo leading-none">{activeDays}</div>
          <div className="text-[8px] sm:text-[10px] font-bold text-testo-tenue uppercase tracking-widest mt-0.5">Giorni attivi</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-h-0 justify-center">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 shrink-0">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-center text-[7px] sm:text-[9px] font-black text-testo-tenue uppercase leading-none">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-4 gap-0.5 sm:gap-1 flex-1 min-h-0">
          {days.map((day, i) => (
            <div 
              key={day.date}
              title={`${day.date}: ${day.count} ${day.count === 1 ? 'domanda' : 'domande'}`}
              className={`w-full h-full min-h-[6px] sm:min-h-[12px] rounded-[2px] sm:rounded-sm border ${getColor(day.count, day.isFuture)} transition-colors duration-100 `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

