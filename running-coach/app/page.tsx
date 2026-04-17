"use client";

import React, { useState } from 'react';
import { Timer, Target, Calendar, ChevronRight, Info, Activity, Clock } from 'lucide-react';

// --- Coaching Logic Types ---
type PaceType = { min: number; sec: number; totalSec: number };
type TrainingDay = { day: string; title: string; workout: string; pace: string; distance: string; type: 'easy' | 'hard' | 'rest' };

export default function RunningCoach() {
  const [currentTime, setCurrentTime] = useState({ min: '25', sec: '00' });
  const [targetTime, setTargetTime] = useState({ min: '22', sec: '30' });
  const [plan, setPlan] = useState<TrainingDay[] | null>(null);

  const formatPace = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.round(totalSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s} /km`;
  };

  const generatePlan = () => {
    const currentTotal = parseInt(currentTime.min) * 60 + parseInt(currentTime.sec);
    const targetTotal = parseInt(targetTime.min) * 60 + parseInt(targetTime.sec);
    
    // Calculate Paces based on Target
    const targetPaceKm = targetTotal / 5;
    const easyPace = targetPaceKm + 100; // Target + 1:40 min/km
    const tempoPace = targetPaceKm + 35; // Target + 0:35 min/km

    const week: TrainingDay[] = [
      { day: 'Monday', title: 'Rest & Recovery', workout: 'Focus on mobility or light stretching.', pace: '-', distance: '-', type: 'rest' },
      { day: 'Tuesday', title: 'Foundation Run', workout: 'Easy aerobic building run.', pace: formatPace(easyPace), distance: '5 km', type: 'easy' },
      { day: 'Wednesday', title: 'Goal Pace Intervals', workout: '6 x 800m with 2:00 recovery walk.', pace: formatPace(targetPaceKm), distance: '4.8 km + WU/CD', type: 'hard' },
      { day: 'Thursday', title: 'Recovery or Rest', workout: 'Very light movement or total rest.', pace: formatPace(easyPace + 20), distance: '3 km', type: 'easy' },
      { day: 'Friday', title: 'Threshold (Tempo)', workout: 'Sustainable hard effort to build stamina.', pace: formatPace(tempoPace), distance: '4 km', type: 'hard' },
      { day: 'Saturday', title: 'Shakeout Run', workout: 'Keep heart rate low, legs moving.', pace: formatPace(easyPace), distance: '3 km', type: 'easy' },
      { day: 'Sunday', title: 'Endurance Long Run', workout: 'The weekly cornerstone for aerobic capacity.', pace: formatPace(easyPace), distance: '8 - 10 km', type: 'easy' },
    ];
    setPlan(week);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2 italic tracking-tighter">5K COACH</h1>
          <p className="text-slate-500 font-medium">Smart training plans for your next personal best.</p>
        </header>

        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                <Timer size={16} /> Recent 5km Time (MM:SS)
              </label>
              <div className="flex gap-2">
                <input type="number" value={currentTime.min} onChange={e => setCurrentTime({...currentTime, min: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                <span className="text-2xl pt-1">:</span>
                <input type="number" value={currentTime.sec} onChange={e => setCurrentTime({...currentTime, sec: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                <Target size={16} /> Target 5km Time (MM:SS)
              </label>
              <div className="flex gap-2">
                <input type="number" value={targetTime.min} onChange={e => setTargetTime({...targetTime, min: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600" />
                <span className="text-2xl pt-1">:</span>
                <input type="number" value={targetTime.sec} onChange={e => setTargetTime({...targetTime, sec: e.target.value})} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600" />
              </div>
            </div>
          </div>
          <button 
            onClick={generatePlan}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            Generate My Training Week <ChevronRight size={20} />
          </button>
        </div>

        {/* Generated Plan */}
        {plan && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="text-blue-600" /> Next 7 Days
            </h2>
            
            <div className="grid gap-4">
              {plan.map((item, idx) => (
                <div key={idx} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${item.type === 'hard' ? 'border-l-orange-500' : item.type === 'rest' ? 'border-l-slate-300' : 'border-l-green-500'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.day}</span>
                      <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    </div>
                    {item.type !== 'rest' && (
                      <div className="text-right">
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">{item.distance}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{item.workout}</p>
                  {item.type !== 'rest' && (
                    <div className="flex gap-4 border-t pt-3 mt-1">
                      <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
                        <Activity size={14} /> Pace: {item.pace}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold flex items-center gap-2 text-blue-800 mb-2">
                <Info size={18} /> Coach's Notes
              </h3>
              <ul className="text-sm text-blue-700 space-y-2 list-disc ml-4">
                <li><strong>Easy runs:</strong> Should feel like a 3/10 effort. You should be able to talk in full sentences.</li>
                <li><strong>Intervals:</strong> These prepare your body for the physical toll of 5km pace. Don't skip the warm-up!</li>
                <li><strong>Threshold:</strong> "Comfortably hard" - a 7/10 effort where you can only say single words.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}