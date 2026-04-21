"use client";

import React, { useState, useEffect, useRef } from 'react';
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

        <PlanSettings 
          currentTime={currentTime} setCurrentTime={setCurrentTime}
          targetTime={targetTime} setTargetTime={setTargetTime}
          duration={duration} setDuration={setDuration}
          customDays={customDays} setCustomDays={setCustomDays}
          viewMode={viewMode} setViewMode={setViewMode}
          startDay={startDay} setStartDay={setStartDay}
          difficulty={difficulty} setDifficulty={setDifficulty}
          isDurationExpanded={isDurationExpanded} setIsDurationExpanded={setIsDurationExpanded}
          isLayoutExpanded={isLayoutExpanded} setIsLayoutExpanded={setIsLayoutExpanded}
          activeId={activeId}
          onGenerate={() => generatePlan({ currentTime, targetTime, duration, customDays, difficulty, startDay })}
          onReset={handleResetSettings}
          onOpenOverlay={() => setIsOverlayOpen(true)}
        />
      </div>

      <PlanOverlay 
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        savedPlans={savedPlans}
        activeId={activeId}
        onSave={(name) => {
          saveAsNewPlan(name, { currentTime, targetTime, duration, customDays, difficulty, startDay });
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

      <PlanDisplay 
        plan={plan}
        viewMode={viewMode}
        isExporting={isExporting}
        onExport={handleExportPDF}
        activeId={activeId}
        savedPlans={savedPlans}
      />
    </div>
  );
}