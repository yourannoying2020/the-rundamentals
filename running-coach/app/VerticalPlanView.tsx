import React from 'react';
import { TrainingDay } from './training';
import { WorkoutCard } from './WorkoutCard';

interface VerticalPlanViewProps {
  plan: TrainingDay[];
}

export const VerticalPlanView = ({ plan }: VerticalPlanViewProps) => (
  <div className="grid gap-4">
    {plan.map((item, idx) => (
      <WorkoutCard key={idx} item={item} />
    ))}
  </div>
);