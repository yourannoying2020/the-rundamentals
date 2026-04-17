import React from 'react';
import { Activity } from 'lucide-react';
import { TrainingDay } from './training';

export const WorkoutCard = ({ item }: { item: TrainingDay }) => (
  <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${
    item.type === 'hard' ? 'border-l-orange-500' : 
    item.type === 'rest' ? 'border-l-slate-300' : 
    'border-l-green-500'
  }`}>
    <div className="flex justify-between items-start mb-2">
      <div>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.day}</span>
        <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
      </div>
      {item.type !== 'rest' && (
        <div className="text-right">
          <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">{item.distance}</span>
        </div>
      )}
    </div>
    <p className="text-slate-600 mb-3">{item.workout}</p>
    {item.type !== 'rest' && (
      <div className="flex gap-4 border-t pt-3 mt-1">
        <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
          <Activity size={14} /> Pace: {item.pace}
        </div>
      </div>
    )}
  </div>
);