import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ isOpen, title, message, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(14, 18, 23, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          animation: slideUp 0.2s ease-out;
          position: relative;
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .modal-icon {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: rgba(226, 78, 60, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E24E3C;
          flex-shrink: 0;
        }
        .modal-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin-top: 4px;
        }
        .modal-body {
          font-size: 13.5px;
          color: var(--dim);
          line-height: 1.6;
          margin-left: 56px;
          margin-bottom: 24px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .modal-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .modal-btn.cancel {
          background: transparent;
          color: var(--dim);
          border-color: var(--border);
        }
        .modal-btn.cancel:hover {
          color: var(--text);
          border-color: var(--dim);
        }
        .modal-btn.danger {
          background: #E24E3C;
          color: #FFF;
        }
        .modal-btn.danger:hover {
          background: #C44333;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          color: var(--dim);
          cursor: pointer;
          padding: 4px;
        }
        .modal-close:hover {
          color: var(--text);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="modal-content">
        <div className="modal-close" onClick={onCancel}>
          <X size={18} />
        </div>
        <div className="modal-header">
          <div className="modal-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="modal-title">{title}</div>
        </div>
        <div className="modal-body">
          {message}
        </div>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
