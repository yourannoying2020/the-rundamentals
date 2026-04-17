import React from 'react';
import { TrainingDay } from './training';
import { WorkoutCard } from './WorkoutCard';

interface CalendarPlanViewProps {
  plan: TrainingDay[];
}

export const CalendarPlanView = ({ plan }: CalendarPlanViewProps) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
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