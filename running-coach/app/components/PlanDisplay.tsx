import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { VerticalPlanView } from './VerticalPlanView';
import { WeeklyHorizontalView } from './WeeklyHorizontalView';
import { CalendarPlanView } from './CalendarPlanView';
import { CoachNotes } from './CoachNotes';
import { TrainingDay } from '../training';
import { ViewMode } from './LayoutSelector';

interface PlanDisplayProps {
  plan: TrainingDay[] | null;
  viewMode: ViewMode;
  isExporting: boolean;
  onExport: () => void;
  activeId: string | null;
  savedPlans: any;
}

export const PlanDisplay = ({ plan, viewMode, isExporting, onExport }: PlanDisplayProps) => {
  if (!plan) return null;

  return (
    <div className={`${viewMode === 'vertical' ? 'max-w-3xl' : 'max-w-6xl'} mx-auto transition-all duration-500 ease-in-out`}>
      <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Calendar className="text-blue-600" /> Next {plan.length} Days
          </h2>
          <button
            onClick={onExport}
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
  );
};