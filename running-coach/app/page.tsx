"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTrainingPlan } from './useTrainingPlan';
import { PlanOverlay } from './components/PlanOverlay';
import { PlanSettings } from './components/PlanSettings';
import { PlanDisplay } from './components/PlanDisplay';
import { Header } from './components/Header';
import { ViewMode } from './components/LayoutSelector';
import { SettingsSchema, DayOfWeekSchema } from './schemas';
import { storage } from './storage';

export default function RunningCoach() {
  const { plan, generatePlan, updateActivePlan, savedPlans, activeId, saveAsNewPlan, deletePlan, setActiveId, storageError } = useTrainingPlan();

  // Define server-safe initial settings
  const defaultSettings = SettingsSchema.parse({});

  const [currentTime, setCurrentTime] = useState(defaultSettings.currentTime);
  const [targetTime, setTargetTime] = useState(defaultSettings.targetTime);
  const [duration, setDuration] = useState(defaultSettings.duration);
  const [customDays, setCustomDays] = useState(defaultSettings.customDays);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultSettings.viewMode);
  const [startDay, setStartDay] = useState<DayOfWeekSchema>(defaultSettings.startDay);
  const [longRunDay, setLongRunDay] = useState<DayOfWeekSchema>((defaultSettings as any).longRunDay || 'Sunday');
  const [goalRaceDate, setGoalRaceDate] = useState<string | undefined>(defaultSettings.goalRaceDate); // New state for goal race date
  const [difficulty, setDifficulty] = useState(defaultSettings.difficulty);
  const [isDurationExpanded, setIsDurationExpanded] = useState(defaultSettings.isDurationExpanded);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(defaultSettings.isLayoutExpanded);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(defaultSettings.isAdvancedExpanded);
  const [settingsError, setSettingsError] = useState(false);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const isMounted = useRef(false);

  const handleResetSettings = useCallback(() => {
    // Parse empty object through schema to get all default values
    const defaults = SettingsSchema.parse({});
    setCurrentTime(defaults.currentTime);
    setTargetTime(defaults.targetTime);
    setDuration(defaults.duration);
    setCustomDays(defaults.customDays);
    setViewMode(defaults.viewMode);
    setDifficulty(defaults.difficulty);
    setStartDay(defaults.startDay);
    setLongRunDay(defaults.longRunDay);
    setGoalRaceDate(defaults.goalRaceDate); // Reset goalRaceDate
    setIsDurationExpanded(defaults.isDurationExpanded);
    setIsLayoutExpanded(defaults.isLayoutExpanded);
    setIsAdvancedExpanded(defaults.isAdvancedExpanded);
    setSettingsError(false);
  }, [setCurrentTime, setTargetTime, setDuration, setCustomDays, setViewMode, setDifficulty, setStartDay, setLongRunDay, setGoalRaceDate, setIsDurationExpanded, setIsLayoutExpanded, setIsAdvancedExpanded, setSettingsError]);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Load settings from storage on mount to avoid hydration mismatch
  useEffect(() => {
    const result = storage.get('running-coach-settings', SettingsSchema);
    if (result) {
      if (result.success) {
        const data = result.data;
        if (data) { // Check if data is not null or undefined
          React.startTransition(() => {
            setCurrentTime(data.currentTime ?? defaultSettings.currentTime);
            setTargetTime(data.targetTime ?? defaultSettings.targetTime);
            setDuration(data.duration ?? defaultSettings.duration);
            setCustomDays(data.customDays ?? defaultSettings.customDays);
            setViewMode(data.viewMode ?? defaultSettings.viewMode);
            setDifficulty(data.difficulty ?? defaultSettings.difficulty);
            setStartDay(data.startDay ?? defaultSettings.startDay);
            setLongRunDay(data.longRunDay ?? defaultSettings.longRunDay);
            setGoalRaceDate(data.goalRaceDate ?? defaultSettings.goalRaceDate); // Load goalRaceDate
            setIsDurationExpanded(data.isDurationExpanded ?? defaultSettings.isDurationExpanded);
            setIsLayoutExpanded(data.isLayoutExpanded ?? defaultSettings.isLayoutExpanded);
            setIsAdvancedExpanded(data.isAdvancedExpanded ?? defaultSettings.isAdvancedExpanded);
          });
        } else {
          // If data is null or undefined, trigger reset action
          React.startTransition(() => {
            handleResetSettings();
          });
        }
      } else {
        React.startTransition(() => {
          setSettingsError(true);
        });
      }
    }
  }, [handleResetSettings]);

  useEffect(() => {
    if (!isMounted.current) return;
    storage.set('running-coach-settings', {
      currentTime, targetTime, duration, customDays, viewMode, difficulty, startDay, longRunDay, goalRaceDate, isDurationExpanded, isLayoutExpanded, isAdvancedExpanded
    });
  }, [currentTime, targetTime, duration, customDays, viewMode, difficulty, startDay, longRunDay, goalRaceDate, isDurationExpanded, isLayoutExpanded, isAdvancedExpanded]);

  const handleExportPDF = async () => {
    // Native browser print is the most reliable way to preserve Tailwind styles 
    // and layout perfectly without server-side dependency issues.
    window.print();
  };

  // Calculate duration based on goalRaceDate if set
  const calculatedDuration = React.useMemo(() => {
    if (goalRaceDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date to start of day
      // Parse YYYY-MM-DD as local date to avoid UTC shifts
      const [year, month, day] = goalRaceDate.split('-').map(Number);
      const raceDate = new Date(year, month - 1, day);
      raceDate.setHours(0, 0, 0, 0); // Normalize race date to start of day

      const diffDays = Math.round((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      // We return the total count of days (inclusive)
      return String(diffDays + 1);
    }
    return duration; // Fallback to user-selected duration
  }, [goalRaceDate, duration]);

  // Custom days should reflect calculated duration if goalRaceDate is set
  const displayCustomDays = goalRaceDate ? calculatedDuration : customDays;
  const displayDuration = goalRaceDate ? 'custom' : duration; // Force 'custom' if goalRaceDate is active

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans print:bg-white print:p-0">
      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-no-break { break-inside: avoid !important; page-break-inside: avoid !important; display: block !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto print:hidden">
        <Header />

        {(storageError || settingsError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {storageError || "Some of your settings were reset because they were stored in an incompatible format."}
            </p>
          </div>
        )}

        <PlanSettings 
          currentTime={currentTime} setCurrentTime={setCurrentTime}
          targetTime={targetTime} setTargetTime={setTargetTime}
          duration={displayDuration} setDuration={setDuration}
          customDays={displayCustomDays} setCustomDays={setCustomDays}
          viewMode={viewMode} setViewMode={setViewMode}
          startDay={startDay} setStartDay={setStartDay}
          longRunDay={longRunDay} setLongRunDay={setLongRunDay}
          goalRaceDate={goalRaceDate} setGoalRaceDate={setGoalRaceDate}
          difficulty={difficulty} setDifficulty={setDifficulty}
          isDurationExpanded={isDurationExpanded} setIsDurationExpanded={setIsDurationExpanded}
          isLayoutExpanded={isLayoutExpanded} setIsLayoutExpanded={setIsLayoutExpanded}
          isAdvancedExpanded={isAdvancedExpanded} setIsAdvancedExpanded={setIsAdvancedExpanded}
          activeId={activeId}
          onGenerate={() => generatePlan({ currentTime, targetTime, duration: calculatedDuration, customDays: calculatedDuration, difficulty, startDay, longRunDay, goalRaceDate })}
          onSave={() => updateActivePlan({ currentTime, targetTime, duration: calculatedDuration, customDays: calculatedDuration, difficulty, startDay, longRunDay, goalRaceDate })}
          onReset={handleResetSettings}
          onOpenOverlay={() => setIsOverlayOpen(true)}
        />
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b-2 border-blue-600 pb-4">
        <h1 className="text-3xl font-black text-blue-600 italic">5K COACH TRAINING PLAN</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Generated for your next Personal Best</p>
      </div>

      <div className="print:hidden">
        <PlanOverlay 
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          savedPlans={savedPlans}
          activeId={activeId}
          onSave={(name) => {
            saveAsNewPlan(name, { currentTime, targetTime, duration: calculatedDuration, customDays: calculatedDuration, difficulty, startDay, longRunDay, goalRaceDate });
            setIsOverlayOpen(false);
          }}
          onLoad={(id) => {
            const selected = savedPlans[id];
            if (selected) {
              const { config } = selected;
              setCurrentTime(config.currentTime);
              setTargetTime(config.targetTime);
              setDuration(config.duration);
              setCustomDays(config.customDays);
              setStartDay(config.startDay);
              setLongRunDay(config.longRunDay || 'Sunday');
              setGoalRaceDate(config.goalRaceDate); // Load goalRaceDate
              setDifficulty(config.difficulty);
              generatePlan(config);
            }
            setActiveId(id);
            setIsOverlayOpen(false);
          }}
          onDelete={(id) => {
            deletePlan(id);
          }}
        />
      </div>

      <PlanDisplay 
        plan={plan}
        viewMode={viewMode}
        onExport={handleExportPDF}
        activeId={activeId}
        savedPlans={savedPlans}
      />
    </div>
  );
}