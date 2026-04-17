import React from 'react';
import { LayoutList, LayoutPanelLeft, CalendarDays, LucideIcon } from 'lucide-react';

export type ViewMode = 'vertical' | 'horizontal' | 'calendar';

interface LayoutOption {
  id: ViewMode;
  label: string;
  icon: LucideIcon;
}

interface LayoutSelectorProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const options: LayoutOption[] = [
  { id: 'vertical', label: 'Vertical List', icon: LayoutList },
  { id: 'horizontal', label: 'Weekly Horizontal', icon: LayoutPanelLeft },
  { id: 'calendar', label: 'Monthly Calendar', icon: CalendarDays },
];

export const LayoutSelector = ({ value, onChange }: LayoutSelectorProps) => (
  <div className="mt-6 pt-6 border-t border-slate-100">
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
      <LayoutList size={16} /> Display Layout
    </label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {options.map((option) => (
        <label 
          key={option.id}
          className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
            value === option.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <option.icon size={20} className={value === option.id ? 'text-blue-600' : 'text-slate-400'} />
            <span className="font-bold text-slate-700 text-sm">{option.label}</span>
          </div>
          <input 
            type="radio" 
            name="viewMode" 
            value={option.id} 
            checked={value === option.id} 
            onChange={() => onChange(option.id)} 
            className="w-4 h-4 text-blue-600" 
          />
        </label>
      ))}
    </div>
  </div>
);