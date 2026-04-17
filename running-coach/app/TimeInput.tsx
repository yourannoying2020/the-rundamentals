import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TimeInputProps {
  label: string;
  icon: LucideIcon;
  value: { min: string; sec: string };
  onChange: (value: { min: string; sec: string }) => void;
  isTarget?: boolean;
}

export const TimeInput = ({ label, icon: Icon, value, onChange, isTarget }: TimeInputProps) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
      <Icon size={16} /> {label}
    </label>
    <div className="flex gap-2">
      <input 
        type="number" 
        value={value.min} 
        onChange={e => onChange({...value, min: e.target.value})} 
        className={`w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none ${isTarget ? 'font-bold text-blue-600' : ''}`} 
      />
      <span className="text-2xl pt-1">:</span>
      <input 
        type="number" 
        value={value.sec} 
        onChange={e => onChange({...value, sec: e.target.value})} 
        className={`w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none ${isTarget ? 'font-bold text-blue-600' : ''}`} 
      />
    </div>
  </div>
);