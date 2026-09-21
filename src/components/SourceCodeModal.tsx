import React, { useState, useMemo } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { getStandaloneHtml } from '../utils/standaloneHtml';
import { Question } from '../types';

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  redQuestions?: Question[];
  blueQuestions?: Question[];
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
  redQuestions,
  blueQuestions,
}) => {
  const [copied, setCopied] = useState(false);

  const htmlContent = useMemo(() => {
    return getStandaloneHtml(redQuestions, blueQuestions);
  }, [redQuestions, blueQuestions]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tug-of-war-game.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <div>
              <h3 className="text-base font-black text-white">Mã Nguồn Đơn Tệp (Single File HTML)</h3>
              <p className="text-xs text-slate-400">Gồm toàn bộ câu hỏi hiện tại, chạy trực tiếp không cần mạng</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file .html</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Code Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950/90 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="whitespace-pre">
            <code>{htmlContent}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>💡 Mã nguồn trên đã tự động nhúng các câu hỏi mới nhất bạn vừa tùy chỉnh!</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

