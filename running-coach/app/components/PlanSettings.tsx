import React from 'react';
import { Timer, Target, Calendar, ChevronRight, LayoutList, ChevronDown, TrendingUp, Info, FolderOpen, RotateCcw, Save, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeInput } from '../TimeInput';
import { LayoutSelector, ViewMode } from './LayoutSelector';
import { DayOfWeekSchema, TimeSchema } from '../schemas';
import { z } from 'zod';

interface PlanSettingsProps {
  currentTime: z.infer<typeof TimeSchema>;
  setCurrentTime: React.Dispatch<React.SetStateAction<z.infer<typeof TimeSchema>>>;
  targetTime: z.infer<typeof TimeSchema>;
  setTargetTime: React.Dispatch<React.SetStateAction<z.infer<typeof TimeSchema>>>;
  duration: string;
  setDuration: (val: string) => void;
  customDays: string;
  setCustomDays: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  startDay: DayOfWeekSchema;
  setStartDay: (val: DayOfWeekSchema) => void;
  longRunDay: DayOfWeekSchema;
  setLongRunDay: (val: DayOfWeekSchema) => void;
  goalRaceDate: string | undefined; // New prop
  setGoalRaceDate: (val: string | undefined) => void; // New prop
  difficulty: number;
  setDifficulty: (val: number) => void;
  isAdvancedExpanded: boolean;
  setIsAdvancedExpanded: (val: boolean) => void;
  activeId: string | null;
  onSave: () => void;
  onGenerate: () => void;
  onReset: () => void;
  onOpenOverlay: () => void;
}

export const PlanSettings = (props: PlanSettingsProps) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  return (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TimeInput label="Recent 5km Time (MM:SS)" icon={Timer} value={props.currentTime} onChange={props.setCurrentTime} />
      <TimeInput label="Target 5km Time (MM:SS)" icon={Target} value={props.targetTime} onChange={props.setTargetTime} isTarget />
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <p className="text-sm text-slate-500 mb-6 font-medium italic">
        Start by entering a goal race date or a select a duration below to create the plan for, then click <strong>Generate Plan</strong> to view your schedule.
        <span className="block mt-2">Once generated, use <strong>Save</strong> to keep your plan, or open <strong>Plans</strong> to restore a previously created one.</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goal Race Date Column */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
            <Calendar size={16} /> Goal Race Date
          </label>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={props.goalRaceDate || ''}
              onChange={(e) => props.setGoalRaceDate(e.target.value || undefined)}
              min={today}
              className="flex-1 p-3 border rounded-xl bg-slate-50 focus:border-blue-500 outline-none font-bold text-blue-600"
            />
            {props.goalRaceDate && (
              <button
                onClick={() => props.setGoalRaceDate(undefined)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
                title="Clear Goal Race Date"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 italic font-medium">
            * Picking a date overrides manual duration.
          </p>
        </div>

        {/* Plan Duration Column */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
            <Calendar size={16} /> Plan Duration
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: '7', label: '1 Week' },
                { id: '14', label: '2 Weeks' },
                { id: '28', label: '1 Month' },
                { id: 'custom', label: 'Custom' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all font-bold text-xs uppercase tracking-tight ${props.duration === opt.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'} ${props.goalRaceDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input type="radio" className="hidden" checked={props.duration === opt.id} onChange={() => props.setDuration(opt.id)} disabled={!!props.goalRaceDate} />
                  {opt.label}
                </label>
              ))}
            </div>
            {props.duration === 'custom' && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Days:</span>
                <input 
                  type="number" 
                  value={props.customDays} 
                  onChange={(e) => props.setCustomDays(e.target.value)} 
                  className={`flex-1 p-2 border-b-2 border-blue-200 bg-transparent focus:border-blue-500 outline-none font-bold text-blue-600 text-center ${props.goalRaceDate ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  min="1" 
                  disabled={!!props.goalRaceDate} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
        <LayoutList size={16} /> Display Layout
      </label>
      <div className="mt-4">
        <LayoutSelector value={props.viewMode} onChange={props.setViewMode} />
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <button onClick={() => props.setIsAdvancedExpanded(!props.isAdvancedExpanded)} className="flex items-center justify-between w-full group">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
          <Settings size={16} /> Advanced Options
        </span>
        {props.isAdvancedExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {props.isAdvancedExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="mt-4 space-y-6">
              <div>
                <label className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                    <TrendingUp size={16} /> Training Intensity
                  </span>
                  <span title="Determines how quickly your weekly mileage and interval counts increase.">
                    <Info size={16} className="text-slate-400 cursor-help" />
                  </span>
                </label>
                <div className="px-2">
                  <input type="range" min="2" max="10" step="1" value={props.difficulty} onChange={(e) => props.setDifficulty(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                    <span>GENTLE (2%)</span>
                    <span className="text-blue-600 font-black">{props.difficulty}%</span>
                    <span>AGGRESSIVE (10%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                  <Calendar size={16} /> Long Run Day
                </label>
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <label key={d} className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all font-bold text-[10px] uppercase tracking-tighter ${props.longRunDay === d ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      <input type="radio" className="hidden" checked={props.longRunDay === d} onChange={() => props.setLongRunDay(d as DayOfWeekSchema)} />
                      {d.substring(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                  <Calendar size={16} /> Plan Start Day
                </label>
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                    <label key={d} className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all font-bold text-[10px] uppercase tracking-tighter ${props.startDay === d ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      <input type="radio" className="hidden" checked={props.startDay === d} onChange={() => props.setStartDay(d as DayOfWeekSchema)} />
                      {d.substring(0, 3)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
      <button onClick={props.onGenerate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
        Generate Plan <ChevronRight size={20} />
      </button>
      <button onClick={props.onSave} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100" title="Save to Selected or Default Plan">
        <Save size={20} /><span className="hidden md:inline">Save</span>
      </button>
      <button onClick={props.onReset} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2" title="Reset to Defaults">
        <RotateCcw size={20} /><span className="md:hidden">Reset</span>
      </button>
      <button onClick={props.onOpenOverlay} className="bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 text-slate-400 font-bold px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm" title="Saved Plans">
        <FolderOpen size={20} /><span className="hidden md:inline">Plans</span>
      </button>
    </div>
  </div>
);
};