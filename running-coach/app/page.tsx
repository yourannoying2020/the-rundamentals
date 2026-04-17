"use client";

import React, { useState } from 'react';
import { Timer, Target, Calendar, ChevronRight, LayoutList, LayoutPanelLeft } from 'lucide-react';
import { Header } from './Header';
import { TimeInput } from './TimeInput';
import { WorkoutCard } from './WorkoutCard';
import { CoachNotes } from './CoachNotes';
import { TrainingDay } from './training';
import { VerticalPlanView } from './VerticalPlanView';
import { WeeklyHorizontalView } from './WeeklyHorizontalView';
import { CalendarPlanView } from './CalendarPlanView';
import { LayoutSelector, ViewMode } from './LayoutSelector';

export default function RunningCoach() {
  const [currentTime, setCurrentTime] = useState({ min: '25', sec: '00' });
  const [targetTime, setTargetTime] = useState({ min: '22', sec: '30' });
  const [plan, setPlan] = useState<TrainingDay[] | null>(null);
  const [duration, setDuration] = useState('7');
  const [customDays, setCustomDays] = useState('10');
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');

  const generatePlan = () => {
    const formatPace = (totalSeconds: number): string => {
      const m = Math.floor(totalSeconds / 60);
      const s = Math.round(totalSeconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s} /km`;
    };

    const currentTotal = parseInt(currentTime.min) * 60 + parseInt(currentTime.sec);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Header />

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimeInput 
              label="Recent 5km Time (MM:SS)" 
              icon={Timer} 
              value={currentTime} 
              onChange={setCurrentTime} 
            />
            <TimeInput 
              label="Target 5km Time (MM:SS)" 
              icon={Target} 
              value={targetTime} 
              onChange={setTargetTime} 
              isTarget 
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              <Calendar size={16} /> Plan Duration
            </label>
            <div className="flex gap-3">
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="flex-1 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              >
                <option value="7">A week (7 days)</option>
                <option value="14">A fortnight (14 days)</option>
                <option value="28">A month (28 days)</option>
                <option value="custom">Custom days</option>
              </select>
              {duration === 'custom' && (
                <input 
                  type="number" 
                  value={customDays} 
                  onChange={(e) => setCustomDays(e.target.value)} 
                  placeholder="Days"
                  className="w-24 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600 text-center" 
                  min="1"
                />
              )}
            </div>
          </div>

          <LayoutSelector value={viewMode} onChange={setViewMode} />

          <button 
            onClick={generatePlan}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            Generate My Training Plan <ChevronRight size={20} />
          </button>
        </div>

        {plan && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="text-blue-600" /> Next {plan.length} Days
            </h2>
            
            {viewMode === 'vertical' && <VerticalPlanView plan={plan} />}
            {viewMode === 'horizontal' && <WeeklyHorizontalView plan={plan} />}
            {viewMode === 'calendar' && <CalendarPlanView plan={plan} />}

            <CoachNotes />
          </div>
        )}
      </div>
    </div>
  );
}