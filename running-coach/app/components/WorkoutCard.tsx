import React from 'react';
import { Activity } from 'lucide-react';
import { TrainingDay } from '../training';

export const WorkoutCard = ({ item }: { item: TrainingDay }) => (
  <div className={`bg-white p-3 rounded-xl shadow-sm border-l-4 print:border-2 print:shadow-none print:no-break ${
    item.type === 'hard' ? 'border-l-orange-500' : 
    item.type === 'rest' ? 'border-l-slate-300' : 
    'border-l-green-500'
  }`}>
    <div className="flex justify-between items-start mb-1">
      <div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.day}</span>
        <h3 className="text-base font-bold text-slate-800 leading-tight">{item.title}</h3>
      </div>
      {item.type !== 'rest' && (
        <div className="text-right">
          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-600">{item.distance}</span>
        </div>
      )}
    </div>
    <p className="text-xs text-slate-600 mb-2 leading-tight">{item.workout}</p>
    {item.type !== 'rest' && (
      <div className="flex gap-4 border-t pt-2 mt-1">
        <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
          <Activity size={14} /> Pace: {item.pace}
        </div>
      </div>
    )}
  </div>
);