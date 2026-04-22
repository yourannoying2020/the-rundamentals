import React from 'react';
import { TrainingDay } from '../training';
import { WorkoutCard } from './WorkoutCard';

interface VerticalPlanViewProps {
  plan: TrainingDay[];
}

export const VerticalPlanView = ({ plan }: VerticalPlanViewProps) => (
  <div className="grid gap-2 print:block">
    {plan.map((item, idx) => (
      <div key={idx} className="print-no-break print:mb-2">
        <WorkoutCard item={item} />
      </div>
    ))}
  </div>
);