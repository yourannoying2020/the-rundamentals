import React from 'react';
import { Timer, Target, Calendar, ChevronRight, LayoutList, ChevronDown, TrendingUp, Info, FolderOpen, RotateCcw } from 'lucide-react';
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
  difficulty: number;
  setDifficulty: (val: number) => void;
  isDurationExpanded: boolean;
  setIsDurationExpanded: (val: boolean) => void;
  isLayoutExpanded: boolean;
  setIsLayoutExpanded: (val: boolean) => void;
  activeId: string | null;
  onGenerate: () => void;
  onReset: () => void;
  onOpenOverlay: () => void;
}

export const PlanSettings = (props: PlanSettingsProps) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TimeInput label="Recent 5km Time (MM:SS)" icon={Timer} value={props.currentTime} onChange={props.setCurrentTime} />
      <TimeInput label="Target 5km Time (MM:SS)" icon={Target} value={props.targetTime} onChange={props.setTargetTime} isTarget />
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <button onClick={() => props.setIsDurationExpanded(!props.isDurationExpanded)} className="flex items-center justify-between w-full group">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
          <Calendar size={16} /> Plan Duration
        </span>
        {props.isDurationExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {props.isDurationExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="mt-4 flex gap-3">
              <select value={props.duration} onChange={(e) => props.setDuration(e.target.value)} className="flex-1 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                <option value="7">A week (7 days)</option>
                <option value="14">A fortnight (14 days)</option>
                <option value="28">A month (28 days)</option>
                <option value="custom">Custom days</option>
              </select>
              {props.duration === 'custom' && (
                <input type="number" value={props.customDays} onChange={(e) => props.setCustomDays(e.target.value)} placeholder="Days" className="w-24 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600 text-center" min="1" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
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
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed italic">* Controls the rate of weekly volume progression.</p>
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <button onClick={() => props.setIsLayoutExpanded(!props.isLayoutExpanded)} className="flex items-center justify-between w-full group">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
          <LayoutList size={16} /> Display Layout
        </span>
        {props.isLayoutExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {props.isLayoutExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
            <div className="mt-4">
              <LayoutSelector value={props.viewMode} onChange={props.setViewMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="mt-6 pt-6 border-t border-slate-100">
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
        <Calendar size={16} /> Plan Start Day
      </label>
      <select value={props.startDay} onChange={(e) => props.setStartDay(e.target.value as DayOfWeekSchema)} className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
      <button onClick={props.onGenerate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
        {props.activeId ? 'Update Plan' : 'Generate Plan'} <ChevronRight size={20} />
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