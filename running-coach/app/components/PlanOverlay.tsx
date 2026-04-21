import React, { useState } from 'react';
import { X, Save, FolderOpen, Trash2, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlanOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: Record<string, { name: string; timestamp: number }>;
  activeId: string | null;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PlanOverlay = ({ isOpen, onClose, savedPlans, activeId, onSave, onLoad, onDelete }: PlanOverlayProps) => {
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const sortedPlans = Object.entries(savedPlans).sort((a, b) => b[1].timestamp - a[1].timestamp);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FolderOpen className="text-blue-600" /> My Saved Plans
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Save current as new plan</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Plan name (e.g. Sub-20 Goal)"
              className="flex-1 p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
            <button 
              onClick={() => { if(newName) { onSave(newName.trim().replace(/[<>]/g, "")); setNewName(''); } }}
              disabled={!newName}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 rounded-xl transition-all shadow-lg shadow-blue-200 font-bold"
            >
              <Save size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Load existing plan</label>
          {sortedPlans.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-4">No saved plans yet.</p>
          ) : (
            sortedPlans.map(([id, plan]) => (
              <div 
                key={id} 
                className={`group flex items-center justify-between p-4 border rounded-2xl transition-all ${
                  activeId === id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <button 
                  onClick={() => onLoad(id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-800">{plan.name}</span>
                    {activeId === id && <Check size={14} className="text-blue-600" />}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <Clock size={10} /> {new Date(plan.timestamp).toLocaleDateString()}
                  </div>
                </button>
                <button 
                  onClick={() => onDelete(id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};