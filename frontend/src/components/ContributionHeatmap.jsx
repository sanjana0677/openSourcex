import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip.jsx';

const LEVEL_COLORS = {
  0: 'bg-slate-900 hover:bg-slate-800 border border-slate-900/50',
  1: 'bg-indigo-950 hover:bg-indigo-900 border border-indigo-950/50',
  2: 'bg-indigo-800 hover:bg-indigo-700 border border-indigo-800/50',
  3: 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-600/50',
  4: 'bg-indigo-400 hover:bg-indigo-350 border border-indigo-400/50',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ContributionHeatmap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-900/50 rounded-xl border border-slate-800">
        <p className="text-slate-500 text-sm">No contribution data available.</p>
      </div>
    );
  }

  
  const weeks = [];
  let currentWeek = [];

  const firstDate = new Date(data[0].date);
  const firstDayOfWeek = firstDate.getDay();

  
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  data.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const validDay = week.find((day) => day !== null);
    if (validDay) {
      const date = new Date(validDay.date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: date.toLocaleString('default', { month: 'short' }),
          colIndex: weekIndex,
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      <div className="min-w-[760px] p-2 bg-slate-900/40 rounded-xl border border-slate-800/60">
        {}
        <div className="relative h-6 text-[10px] text-slate-500 font-mono mb-1">
          {monthLabels.map((ml, idx) => (
            <span
              key={idx}
              className="absolute"
              style={{ left: `${ml.colIndex * 13.5 + 32}px` }}
            >
              {ml.label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {}
          <div className="flex flex-col justify-between text-[9px] text-slate-600 font-mono pr-2 select-none h-[95px] pt-1">
            {DAYS_OF_WEEK.map((day, idx) => (
              <span key={day} className={idx % 2 === 0 ? 'invisible' : ''}>
                {day}
              </span>
            ))}
          </div>

          {}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dayIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIdx}
                        className="w-[10px] h-[10px] bg-transparent"
                      />
                    );
                  }

                  const colorClass = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
                  const formattedDate = new Date(day.date).toLocaleDateString('default', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-[10px] h-[10px] rounded-[1.5px] cursor-pointer transition-colors duration-150 ${colorClass}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] p-2">
                        <span className="font-semibold text-slate-200">{day.count} {day.count === 1 ? 'contribution' : 'contributions'}</span>
                        <br />
                        <span className="text-slate-400 text-[10px]">{formattedDate}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="flex items-center justify-end gap-1.5 mt-3 pr-2 text-[10px] text-slate-500 font-mono select-none">
          <span>Less</span>
          <div className="w-[8px] h-[8px] rounded-[1.5px] bg-slate-900 border border-slate-800" />
          <div className="w-[8px] h-[8px] rounded-[1.5px] bg-indigo-950" />
          <div className="w-[8px] h-[8px] rounded-[1.5px] bg-indigo-800" />
          <div className="w-[8px] h-[8px] rounded-[1.5px] bg-indigo-600" />
          <div className="w-[8px] h-[8px] rounded-[1.5px] bg-indigo-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
