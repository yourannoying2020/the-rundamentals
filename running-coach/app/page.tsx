"use client";

import React, { useState } from 'react';
import { Timer, Target, Calendar, ChevronRight, LayoutList, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { TimeInput } from './TimeInput';
import { CoachNotes } from './CoachNotes';
import { VerticalPlanView } from './VerticalPlanView';
import { WeeklyHorizontalView } from './WeeklyHorizontalView';
import { CalendarPlanView } from './CalendarPlanView';
import { LayoutSelector, ViewMode } from './LayoutSelector';
import { useTrainingPlan } from './useTrainingPlan';

export default function RunningCoach() {
  const [currentTime, setCurrentTime] = useState({ min: '25', sec: '00' });
  const [targetTime, setTargetTime] = useState({ min: '22', sec: '30' });
  const [duration, setDuration] = useState('7');
  const [customDays, setCustomDays] = useState('10');
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const [isDurationExpanded, setIsDurationExpanded] = useState(false);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  const { plan, generatePlan } = useTrainingPlan();

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
            <button 
              onClick={() => setIsDurationExpanded(!isDurationExpanded)}
              className="flex items-center justify-between w-full group"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                <Calendar size={16} /> Plan Duration
              </span>
              {isDurationExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>
            <AnimatePresence>
              {isDurationExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex gap-3">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button 
              onClick={() => setIsLayoutExpanded(!isLayoutExpanded)}
              className="flex items-center justify-between w-full group"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                <LayoutList size={16} /> Display Layout
              </span>
              {isLayoutExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
            </button>
            <AnimatePresence>
              {isLayoutExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <LayoutSelector value={viewMode} onChange={setViewMode} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => generatePlan({ currentTime, targetTime, duration, customDays })}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            Generate My Training Plan <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {plan && (
        <div className={`${viewMode === 'vertical' ? 'max-w-3xl' : 'max-w-6xl'} mx-auto transition-all duration-500 ease-in-out`}>
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="text-blue-600" /> Next {plan.length} Days
            </h2>

            {viewMode === 'vertical' && <VerticalPlanView plan={plan} />}
            {viewMode === 'horizontal' && <WeeklyHorizontalView plan={plan} />}
            {viewMode === 'calendar' && <CalendarPlanView plan={plan} />}

            <CoachNotes />
          </div>
        </div>
      )}
    </div>
  );
}