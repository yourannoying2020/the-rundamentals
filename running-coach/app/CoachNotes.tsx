import React from 'react';
import { Info } from 'lucide-react';

export const CoachNotes = () => (
  <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
    <h3 className="font-bold flex items-center gap-2 text-blue-800 mb-2">
      <Info size={18} /> {"Coach's Notes"}
    </h3>
    <ul className="text-sm text-blue-700 space-y-2 list-disc ml-4">
      <li><strong>Easy runs:</strong> Should feel like a 3/10 effort. You should be able to talk in full sentences.</li>
      <li><strong>Intervals:</strong> These prepare your body for the physical toll of 5km pace. {"Don't skip the warm-up!"}</li>
      <li><strong>Threshold:</strong> {"\"Comfortably hard\""} - a 7/10 effort where you can only say single words.</li>
    </ul>
  </div>
);