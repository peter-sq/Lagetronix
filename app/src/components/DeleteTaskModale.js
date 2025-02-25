'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';

export default function DeleteTaskModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg text-center mb-4 bg-slate-300 h-6 w-6 mx-24 text-red-600 p-1"><Trash size={16} /></h2>
        <p className="text-gray-600">you want to delete this task?</p>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg- bg-blue-500 text-white rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
