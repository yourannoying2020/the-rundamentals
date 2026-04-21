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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    {options.map((option) => (
      <label
        key={option.id}
        className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all font-bold text-xs uppercase tracking-tight gap-2 ${
          value === option.id
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
        }`}
      >
        <input
          type="radio"
          className="hidden"
          checked={value === option.id}
          onChange={() => onChange(option.id)}
        />
        <option.icon size={20} className={value === option.id ? 'text-blue-600' : 'text-slate-400'} />
        {option.label}
      </label>
    ))}
  </div>
);