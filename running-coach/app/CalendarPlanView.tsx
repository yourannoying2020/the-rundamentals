import React from 'react';
import { TrainingDay } from './training';
import { WorkoutCard } from './WorkoutCard';

interface CalendarPlanViewProps {
  plan: TrainingDay[];
}

export const CalendarPlanView = ({ plan }: CalendarPlanViewProps) => {
  // Derive the header sequence from the first 7 days of the plan
  const daysOfWeek = plan.slice(0, 7).map(item => {
    // Extract day name even if it's in "W1: Monday" format
    const dayName = item.day.includes(': ') ? item.day.split(': ')[1] : item.day;
    return dayName.substring(0, 3);
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1400px]">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest pb-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {plan.map((item, idx) => (
            <div key={idx} className="h-full">
              <WorkoutCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};