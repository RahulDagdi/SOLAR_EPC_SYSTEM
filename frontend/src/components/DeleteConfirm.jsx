import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, isBulk, count }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isBulk ? `Delete ${count} Records?` : 'Delete Record?'}
            </h3>
            <p className="text-sm text-gray-500">
              This action will soft-delete the record(s). You can restore them later.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {isBulk ? `Delete ${count} Records` : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
