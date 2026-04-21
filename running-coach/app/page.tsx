"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Target, Calendar, ChevronRight, LayoutList, ChevronDown, TrendingUp, Info, FolderOpen, Download, AlertCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { TimeInput } from './TimeInput';
import { CoachNotes } from './CoachNotes';
import { VerticalPlanView } from './VerticalPlanView';
import { WeeklyHorizontalView } from './WeeklyHorizontalView';
import { CalendarPlanView } from './CalendarPlanView';
import { LayoutSelector, ViewMode } from './LayoutSelector';
import { useTrainingPlan } from './useTrainingPlan';
import { PlanOverlay } from './PlanOverlay';
import { SettingsSchema, DayOfWeekSchema } from './schemas';
import { storage } from './storage';

export default function RunningCoach() {
  const [currentTime, setCurrentTime] = useState({ min: '25', sec: '00' });
  const [targetTime, setTargetTime] = useState({ min: '22', sec: '30' });
  const [duration, setDuration] = useState('7');
  const [customDays, setCustomDays] = useState('10');
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const [startDay, setStartDay] = useState<DayOfWeekSchema>('Monday');
  const [difficulty, setDifficulty] = useState(5);
  const [isDurationExpanded, setIsDurationExpanded] = useState(false);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [settingsError, setSettingsError] = useState(false);
  const { plan, generatePlan, savedPlans, activeId, saveAsNewPlan, deletePlan, setActiveId, storageError } = useTrainingPlan();
  const isMounted = useRef(false);

  // Load settings on mount
  useEffect(() => {
    const result = storage.get('running-coach-settings', SettingsSchema);
    if (result) {
      if (result.success) {
        const data = result.data;
        setCurrentTime(data.currentTime);
        setTargetTime(data.targetTime);
        setDuration(data.duration);
        setCustomDays(data.customDays);
        setViewMode(data.viewMode);
        setDifficulty(data.difficulty);
        setIsDurationExpanded(data.isDurationExpanded);
        setIsLayoutExpanded(data.isLayoutExpanded);
      } else {
        setSettingsError(true);
      }
    }
    isMounted.current = true;
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (!isMounted.current) return;
    const settings = {
      currentTime,
      targetTime,
      duration,
      customDays,
      viewMode,
      difficulty,
      startDay,
      isDurationExpanded,
      isLayoutExpanded
    };
    storage.set('running-coach-settings', settings); // Note: startDay is implicitly included in settings
  }, [currentTime, targetTime, duration, customDays, viewMode, difficulty, startDay, isDurationExpanded, isLayoutExpanded]);

  // Load active plan settings when switched
  useEffect(() => {
    if (activeId && savedPlans[activeId]) {
      const { config } = savedPlans[activeId];
      setCurrentTime(config.currentTime);
      setTargetTime(config.targetTime);
      setDuration(config.duration);
      setCustomDays(config.customDays);
      setStartDay(config.startDay);
      setDifficulty(config.difficulty);
    }
  }, [activeId, savedPlans]);


  const handleResetSettings = () => {
    // Parse empty object through schema to get all default values
    const defaults = SettingsSchema.parse({});
    setCurrentTime(defaults.currentTime);
    setTargetTime(defaults.targetTime);
    setDuration(defaults.duration);
    setCustomDays(defaults.customDays);
    setViewMode(defaults.viewMode);
    setDifficulty(defaults.difficulty);
    setStartDay(defaults.startDay);
    setIsDurationExpanded(defaults.isDurationExpanded);
    setIsLayoutExpanded(defaults.isLayoutExpanded);
    setSettingsError(false);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('training-plan-content');
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#f8fafc', // Matches bg-slate-50
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: viewMode === 'vertical' ? 'portrait' : 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = activeId && savedPlans[activeId] 
        ? `5k-plan-${savedPlans[activeId].name.toLowerCase().replace(/\s+/g, '-')}` 
        : '5k-training-plan';
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Header />

        {(storageError || settingsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {storageError || "Some of your settings were reset because they were stored in an incompatible format."}
            </p>
          </div>
        )}

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
            <label className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                <TrendingUp size={16} /> Training Intensity
              </span>
              <Info size={16} className="text-slate-400 cursor-help" title="Determines how quickly your weekly mileage and interval counts increase." />
            </label>
            <div className="px-2">
              <input 
                type="range" 
                min="2" 
                max="10" 
                step="1"
                value={difficulty} 
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
                <span>GENTLE (2%)</span>
                <span className="text-blue-600 font-black">{difficulty}%</span>
                <span>AGGRESSIVE (10%)</span>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 leading-relaxed italic">
                * Controls the rate of weekly volume progression. Higher percentages result in faster mileage builds.
              </p>
            </div>
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

          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              <Calendar size={16} /> Plan Start Day
            </label>
            <select 
              value={startDay} 
              onChange={(e) => setStartDay(e.target.value as DayOfWeekSchema)}
              className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
            <button 
              onClick={() => generatePlan({ currentTime, targetTime, duration, customDays, difficulty, startDay })}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {activeId ? 'Update Plan' : 'Generate Plan'} <ChevronRight size={20} />
            </button>
            
            <button 
              onClick={handleResetSettings}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              title="Reset to Defaults"
            >
              <RotateCcw size={20} />
              <span className="md:hidden">Reset</span>
            </button>

            <button 
              onClick={() => setIsOverlayOpen(true)}
              className="bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 text-slate-400 font-bold px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              title="Saved Plans"
            >
              <FolderOpen size={20} />
              <span className="hidden md:inline">Plans</span>
            </button>
          </div>
        </div>
      </div>

      <PlanOverlay 
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        savedPlans={savedPlans}
        activeId={activeId}
        onSave={(name) => {
          saveAsNewPlan(name, { currentTime, targetTime, duration, customDays, difficulty });
          setIsOverlayOpen(false);
        }}
        onLoad={(id) => {
          setActiveId(id);
          setIsOverlayOpen(false);
        }}
        onDelete={(id) => {
          deletePlan(id);
        }}
      />

      {plan && (
        <div className={`${viewMode === 'vertical' ? 'max-w-3xl' : 'max-w-6xl'} mx-auto transition-all duration-500 ease-in-out`}>
          <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                <Calendar className="text-blue-600" /> Next {plan.length} Days
              </h2>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
              >
                {isExporting ? 'Generating...' : <><Download size={16} /> Export PDF</>}
              </button>
            </div>

            <div id="training-plan-content" className="p-1">
              {viewMode === 'vertical' && <VerticalPlanView plan={plan} />}
              {viewMode === 'horizontal' && <WeeklyHorizontalView plan={plan} />}
              {viewMode === 'calendar' && <CalendarPlanView plan={plan} />}
            </div>

            <CoachNotes />
          </div>
        </div>
      )}
    </div>
  );
}