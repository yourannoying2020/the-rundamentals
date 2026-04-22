import React from 'react';
import { TrainingDay } from '../training';
import { WorkoutCard } from './WorkoutCard';

interface WeeklyHorizontalViewProps {
  plan: TrainingDay[];
}

export const WeeklyHorizontalView = ({ plan }: WeeklyHorizontalViewProps) => (
  <div className="space-y-8">
    {Array.from({ length: Math.ceil(plan.length / 7) }).map((_, weekIdx) => (
      <div key={weekIdx} className="space-y-3">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">
          Week {weekIdx + 1}
        </h3>
        <div className="flex print:flex-wrap gap-4 overflow-x-auto print:overflow-visible pb-4 snap-x">
          {plan.slice(weekIdx * 7, (weekIdx + 1) * 7).map((item, idx) => (
            <div key={idx} className="min-w-[220px] md:min-w-[260px] print:min-w-[45%] print:flex-1 snap-start print:no-break">
              <WorkoutCard item={item} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);