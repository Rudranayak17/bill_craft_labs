import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rows: number, columns: number) => void;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Create Table</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rows
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Columns
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={columns}
              onChange={(e) => setColumns(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(rows, columns);
                onClose();
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};