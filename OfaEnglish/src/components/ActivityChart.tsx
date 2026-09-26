import React from 'react';

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
    const dateStr = d.toISOString().split('T')[0];
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
    if (isFuture) return 'bg-gray-50/50 dark:bg-[#1E293B]/40 border-gray-100/50 dark:border-[#334155]/40 opacity-40';
    if (count === 0) return 'bg-gray-100 dark:bg-[#1E293B] border-gray-100 dark:border-[#334155]';
    if (count <= 5) return 'bg-[#D7FFB8] dark:bg-[#064E3B] border-[#58CC02] dark:border-[#059669]';
    if (count <= 15) return 'bg-[#58CC02] dark:bg-[#10B981] border-[#46A302] dark:border-[#047857]';
    return 'bg-[#46A302] dark:bg-[#047857] border-[#3D8F01] dark:border-[#065F46]';
  };

  return (
    <div className="h-full bg-white dark:bg-[#0F172A] rounded-xl sm:rounded-2xl p-2 sm:p-4 border-2 border-gray-200 dark:border-[#334155] border-b-4 shadow-sm transition-colors flex flex-col justify-between min-h-0">
      <div className="flex justify-between items-end mb-1 sm:mb-2 shrink-0">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-[#4B4B4B] dark:text-[#F8FAFC] leading-tight">Consistency</h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 mt-0.5">Last 28 Days</p>
        </div>
        <div className="text-right">
          <div className="text-sm sm:text-lg font-black text-[#58CC02] dark:text-[#10B981] leading-none">{activeDays}</div>
          <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Active</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-h-0 justify-center">
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 shrink-0">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-center text-[7px] sm:text-[9px] font-black text-gray-400 uppercase leading-none">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-4 gap-0.5 sm:gap-1 flex-1 min-h-0">
          {days.map((day, i) => (
            <div 
              key={day.date}
              title={`${day.date}: ${day.count} activity`}
              className={`w-full h-full min-h-[6px] sm:min-h-[12px] rounded-[2px] sm:rounded-sm border ${getColor(day.count, day.isFuture)} transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

