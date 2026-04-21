import { useState, useEffect, useRef, startTransition } from 'react';
import { TrainingDay } from './training';
import { SavedPlansSchema, type PlanConfig, DayOfWeekSchema } from './schemas';
import { storage } from './storage';

export function useTrainingPlan() {
  const [savedPlans, setSavedPlans] = useState<Record<string, { name: string; config: PlanConfig; plan: TrainingDay[]; timestamp: number }>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [plan, setPlan] = useState<TrainingDay[] | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  const isMounted = useRef(false);

  useEffect(() => {
    // Load initial data on mount to avoid hydration mismatch
    const lastId = localStorage.getItem('running-coach-active-id');
    const result = storage.get('running-coach-saved-plans', SavedPlansSchema);
    
    if (result) {
      if (result.success) {
        startTransition(() => {
          const validated = result.data;
          setSavedPlans(validated);
          if (lastId && validated[lastId]) {
            setPlan(validated[lastId].plan);
            setActiveId(lastId);
          }
        });
      } else {
        startTransition(() => {
          setStorageError("Your saved plans appear to be corrupted and could not be loaded.");
        });
      }
    }
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    storage.set('running-coach-saved-plans', savedPlans);
    if (activeId) {
      localStorage.setItem('running-coach-active-id', activeId);
    }
  }, [savedPlans, activeId]);

  const generatePlan = ({ currentTime, targetTime, duration, customDays, difficulty, startDay }: PlanConfig) => {
    const formatPace = (totalSeconds: number): string => {
      const m = Math.floor(totalSeconds / 60);
      const s = Math.round(totalSeconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s} /km`;
    };

    const currentTotal = parseInt(currentTime.min) * 60 + parseInt(currentTime.sec);
    const targetTotal = parseInt(targetTime.min) * 60 + parseInt(targetTime.sec);
    const totalDays = duration === 'custom' ? parseInt(customDays) || 1 : parseInt(duration);
    const totalWeeks = Math.ceil(totalDays / 7);

    const currentPaceKm = currentTotal / 5;
    const targetPaceKm = targetTotal / 5;

    const daysOfWeekOrder: DayOfWeekSchema[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const startIndex = daysOfWeekOrder.indexOf(startDay);
    const reorderedDaysOfWeek = [
      ...daysOfWeekOrder.slice(startIndex),
      ...daysOfWeekOrder.slice(0, startIndex)
    ];

    // Base template, always starting with Monday's workout
    // The actual day will be mapped based on startDay
    const fullPlan: TrainingDay[] = [];
    for (let i = 0; i < totalDays; i++) {
      const weekNum = Math.floor(i / 7) + 1;
      const dayInWeek = i % 7;
      
      // Progression Logic: Every week we get closer to the target pace
      // We use a linear interpolation between current and target fitness
      const fitnessProgress = (weekNum - 1) / Math.max(1, totalWeeks - 1);
      const weeklyGoalPace = currentPaceKm - (currentPaceKm - targetPaceKm) * fitnessProgress;
      
      // Periodization Logic: 
      // 1. Taper Week: Final week of plans >= 4 weeks
      // 2. Deload Week: Every 4th week (unless it's a taper)
      const isTaperWeek = totalWeeks >= 4 && weekNum === totalWeeks;
      const isDeloadWeek = !isTaperWeek && weekNum % 4 === 0;
      
      let volumeModifier = 1 + (weekNum * (difficulty / 100));
      if (isTaperWeek) volumeModifier = 0.6; // Sharp drop to shed fatigue
      else if (isDeloadWeek) volumeModifier = 0.7; // Standard recovery drop

      const easyPace = weeklyGoalPace + 100;
      const tempoPace = weeklyGoalPace + 35;

      const template = [
        { day: 'Monday', title: 'Rest & Recovery', workout: isTaperWeek ? 'Complete rest. Stay off your feet.' : 'Focus on mobility or light stretching.', pace: '-', distance: '-', type: 'rest' },
        { day: 'Tuesday', title: 'Foundation Run', workout: 'Easy aerobic building run.', pace: formatPace(easyPace), distance: `${(5 * volumeModifier).toFixed(1)} km`, type: 'easy' },
        { day: 'Wednesday', title: 'Goal Pace Intervals', workout: isTaperWeek ? '3 x 800m at goal pace. Keep it sharp but short.' : `${Math.floor(6 * volumeModifier)} x 800m with 2:00 recovery walk.`, pace: formatPace(weeklyGoalPace), distance: isTaperWeek ? '2.4 km + WU/CD' : '4.8 km + WU/CD', type: 'hard' },
        { day: 'Thursday', title: 'Recovery or Rest', workout: 'Very light movement or total rest.', pace: formatPace(easyPace + 20), distance: `${(3 * volumeModifier).toFixed(1)} km`, type: 'easy' },
        { day: 'Friday', title: 'Threshold (Tempo)', workout: isTaperWeek ? 'Short 15 min tempo effort to keep legs moving.' : 'Sustainable hard effort to build stamina.', pace: formatPace(tempoPace), distance: `${(isTaperWeek ? 2.5 : 4 * volumeModifier).toFixed(1)} km`, type: 'hard' },
        { day: 'Saturday', title: 'Shakeout Run', workout: 'Keep heart rate low, legs moving.', pace: formatPace(easyPace), distance: '3 km', type: 'easy' },
        { day: 'Sunday', title: 'Endurance Long Run', workout: isTaperWeek ? 'Final 5km Time Trial! Push for your PB.' : isDeloadWeek ? 'Reduced volume for recovery.' : 'The weekly cornerstone for aerobic capacity.', pace: formatPace(isTaperWeek ? weeklyGoalPace : easyPace), distance: isTaperWeek ? '5.0 km' : `${(8 * volumeModifier).toFixed(1)} km`, type: 'easy' },
      ];

      const currentDayName = reorderedDaysOfWeek[dayInWeek];
      const dayInfo = template.find(t => t.day === currentDayName) || template[0];
      
      fullPlan.push({
        ...dayInfo,
        title: isTaperWeek ? `[Taper] ${dayInfo.title}` : isDeloadWeek ? `[Recovery] ${dayInfo.title}` : dayInfo.title,
        day: totalDays > 7 ? `W${weekNum}: ${currentDayName}` : currentDayName
      } as TrainingDay);
    }
    setPlan(fullPlan);
  };

  const updateActivePlan = (config: PlanConfig) => {
    if (!plan) return;
    
    let targetId = activeId;
    
    // If no active ID, try to find a "default" (the most recent one)
    if (!targetId) {
      const ids = Object.keys(savedPlans);
      if (ids.length > 0) {
        targetId = ids.sort((a, b) => savedPlans[b].timestamp - savedPlans[a].timestamp)[0];
      }
    }

    if (targetId && savedPlans[targetId]) {
      setSavedPlans(prev => ({
        ...prev,
        [targetId!]: { ...prev[targetId!], plan, config, timestamp: Date.now() }
      }));
      setActiveId(targetId);
    } else {
      saveAsNewPlan("Default Plan", config);
    }
  };

  const saveAsNewPlan = (name: string, config: PlanConfig) => {
    if (!plan) return;
    const id = Math.random().toString(36).substr(2, 9);
    setSavedPlans(prev => ({
      ...prev,
      [id]: { name, config, plan, timestamp: Date.now() }
    }));
    setActiveId(id);
  };

  const deletePlan = (id: string) => {
    const newPlans = { ...savedPlans };
    delete newPlans[id];
    setSavedPlans(newPlans);
    if (activeId === id) {
      setActiveId(null);
      setPlan(null);
    }
  };

  return { plan, generatePlan, updateActivePlan, savedPlans, activeId, setActiveId, saveAsNewPlan, deletePlan, storageError };
}
