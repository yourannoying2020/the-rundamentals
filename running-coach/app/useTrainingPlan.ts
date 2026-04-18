import { useState } from 'react';
import { TrainingDay } from './training';

export interface PlanConfig {
  currentTime: { min: string; sec: string };
  targetTime: { min: string; sec: string };
  duration: string;
  customDays: string;
}

export function useTrainingPlan() {
  const [plan, setPlan] = useState<TrainingDay[] | null>(null);

  const generatePlan = ({ currentTime, targetTime, duration, customDays }: PlanConfig) => {
    const formatPace = (totalSeconds: number): string => {
      const m = Math.floor(totalSeconds / 60);
      const s = Math.round(totalSeconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s} /km`;
    };

    const targetTotal = parseInt(targetTime.min) * 60 + parseInt(targetTime.sec);

    const totalDays = duration === 'custom' ? parseInt(customDays) || 1 : parseInt(duration);

    const targetPaceKm = targetTotal / 5;
    const easyPace = targetPaceKm + 100; // Target + 1:40 min/km
    const tempoPace = targetPaceKm + 35; // Target + 0:35 min/km

    const template = [
      { day: 'Monday', title: 'Rest & Recovery', workout: 'Focus on mobility or light stretching.', pace: '-', distance: '-', type: 'rest' },
      { day: 'Tuesday', title: 'Foundation Run', workout: 'Easy aerobic building run.', pace: formatPace(easyPace), distance: '5 km', type: 'easy' },
      { day: 'Wednesday', title: 'Goal Pace Intervals', workout: '6 x 800m with 2:00 recovery walk.', pace: formatPace(targetPaceKm), distance: '4.8 km + WU/CD', type: 'hard' },
      { day: 'Thursday', title: 'Recovery or Rest', workout: 'Very light movement or total rest.', pace: formatPace(easyPace + 20), distance: '3 km', type: 'easy' },
      { day: 'Friday', title: 'Threshold (Tempo)', workout: 'Sustainable hard effort to build stamina.', pace: formatPace(tempoPace), distance: '4 km', type: 'hard' },
      { day: 'Saturday', title: 'Shakeout Run', workout: 'Keep heart rate low, legs moving.', pace: formatPace(easyPace), distance: '3 km', type: 'easy' },
      { day: 'Sunday', title: 'Endurance Long Run', workout: 'The weekly cornerstone for aerobic capacity.', pace: formatPace(easyPace), distance: '8 - 10 km', type: 'easy' },
    ];

    const fullPlan: TrainingDay[] = [];
    for (let i = 0; i < totalDays; i++) {
      const dayInfo = template[i % 7];
      const weekNum = Math.floor(i / 7) + 1;
      fullPlan.push({
        ...dayInfo,
        day: totalDays > 7 ? `W${weekNum}: ${dayInfo.day}` : dayInfo.day
      } as TrainingDay);
    }
    setPlan(fullPlan);
  };

  return { plan, generatePlan };
}
