import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  RotateCcw,
  Download,
  Upload,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Play,
  Filter,
  Check,
  AlertTriangle,
  X
} from 'lucide-react';
import { Question } from '../types';
import { QuestionFormModal } from './QuestionFormModal';

interface QuestionManagerProps {
  redQuestions: Question[];
  blueQuestions: Question[];
  onAddQuestion: (data: {
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
    explanation: string;
    team: 'red' | 'blue' | 'both';
  }) => void;
  onEditQuestion: (
    teamTarget: 'red' | 'blue' | 'both',
    id: number,
    data: {
      question: string;
      options: string[];
      correctIndex: number;
      category: string;
      explanation: string;
      team: 'red' | 'blue' | 'both';
    }
  ) => void;
  onDeleteQuestion: (teamTarget: 'red' | 'blue', id: number) => void;
  onDuplicateQuestion: (teamTarget: 'red' | 'blue', id: number) => void;
  onResetDefaults: () => void;
  onImportQuestions: (imported: { red?: Question[]; blue?: Question[] }) => void;
  onSwitchToBattle: () => void;
}

type FilterTeam = 'all' | 'red' | 'blue';

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  redQuestions,
  blueQuestions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onResetDefaults,
  onImportQuestions,
  onSwitchToBattle,
}) => {
  const [filterTeam, setFilterTeam] = useState<FilterTeam>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    question: Question;
    teamSource: 'red' | 'blue';
  } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    team: 'red' | 'blue';
    id: number;
    questionText: string;
  } | null>(null);

  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    redQuestions.forEach((q) => q.category && set.add(q.category));
    blueQuestions.forEach((q) => q.category && set.add(q.category));
    return Array.from(set).sort();
  }, [redQuestions, blueQuestions]);

  // Combined list for display
  const displayQuestions = useMemo(() => {
    let list: Array<{ item: Question; team: 'red' | 'blue' }> = [];

    if (filterTeam === 'all' || filterTeam === 'red') {
      list = list.concat(redQuestions.map((q) => ({ item: q, team: 'red' as const })));
    }
    if (filterTeam === 'all' || filterTeam === 'blue') {
      list = list.concat(blueQuestions.map((q) => ({ item: q, team: 'blue' as const })));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (entry) =>
          entry.item.question.toLowerCase().includes(q) ||
          entry.item.options.some((opt) => opt.toLowerCase().includes(q)) ||
          (entry.item.category && entry.item.category.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      list = list.filter((entry) => entry.item.category === categoryFilter);
    }

    return list;
  }, [redQuestions, blueQuestions, filterTeam, searchQuery, categoryFilter]);

  // Handle Export to JSON file
  const handleExportJson = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      gameTitle: 'Kéo Co Đố Vui - Danh Sách Câu Hỏi',
      redQuestions,
      blueQuestions,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `keo-co-cau-hoi-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Import JSON from file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.redQuestions || parsed.blueQuestions || Array.isArray(parsed)) {
          let red = parsed.redQuestions;
          let blue = parsed.blueQuestions;
          if (Array.isArray(parsed)) {
            red = parsed;
          }
          onImportQuestions({ red, blue });
          setImportSuccess(`Đã nạp thành công câu hỏi từ tệp!`);
          setTimeout(() => {
            setImportModalOpen(false);
            setImportSuccess(null);
          }, 1200);
        } else {
          setImportError('Định dạng JSON không hợp lệ! Cần chứa redQuestions hoặc blueQuestions.');
        }
      } catch (err) {
        setImportError('Lỗi đọc tệp JSON. Vui lòng kiểm tra lại cấu trúc cú pháp!');
      }
    };
    reader.readAsText(file);
  };

  // Handle Manual JSON Import
  const handleManualImport = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      let red = parsed.redQuestions;
      let blue = parsed.blueQuestions;
      if (Array.isArray(parsed)) {
        red = parsed;
      }
      if (!red && !blue) {
        setImportError('JSON phải có trường redQuestions hoặc blueQuestions (hoặc là 1 mảng câu hỏi).');
        return;
      }
      onImportQuestions({ red, blue });
      setImportSuccess('Nhập dữ liệu thành công!');
      setTimeout(() => {
        setImportModalOpen(false);
        setImportSuccess(null);
        setImportJsonText('');
      }, 1000);
    } catch {
      setImportError('Cú pháp JSON không hợp lệ. Vui lòng kiểm tra dấu phẩy hoặc ngoặc kép!');
    }
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (question: Question, teamSource: 'red' | 'blue') => {
    setEditingQuestion({ question, teamSource });
    setIsFormModalOpen(true);
  };

  const handleSaveQuestion = (
    data: {
      question: string;
      options: string[];
      correctIndex: number;
      category: string;
      explanation: string;
      team: 'red' | 'blue' | 'both';
    },
    editId?: number
  ) => {
    if (editId !== undefined && editingQuestion) {
      onEditQuestion(editingQuestion.teamSource, editId, data);
    } else {
      onAddQuestion(data);
    }
  };

  return (
    <section className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Top Banner & Management Stats */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-lg sm:text-xl font-black text-stone-100 tracking-tight">
              Quản Lý Bộ Câu Hỏi Đố Vui
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Thêm mới, chỉnh sửa, xóa và tùy biến ngân hàng câu hỏi cho Đội Đỏ và Đội Xanh.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-bold text-stone-300">
            <span>Tổng:</span>
            <span className="text-amber-400 font-mono font-black">
              {redQuestions.length + blueQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs font-bold text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Đội Đỏ:</span>
            <span className="font-mono font-black">{redQuestions.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/60 border border-sky-800/60 text-xs font-bold text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Đội Xanh:</span>
            <span className="font-mono font-black">{blueQuestions.length}</span>
          </div>

          {/* Switch to battle */}
          <button
            type="button"
            onClick={onSwitchToBattle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Vào đấu ngay</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar & Filters */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-md flex flex-col gap-3">
        {/* Row 1: Add Button & Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Primary Add Button */}
          <button
            id="btn-add-question"
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs sm:text-sm font-black rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>THÊM CÂU HỎI MỚI</span>
          </button>

          {/* Secondary Utilities: Import, Export, Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold transition-colors cursor-pointer"
              title="Nạp câu hỏi từ file JSON"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Nhập JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold transition-colors cursor-pointer"
              title="Xuất danh sách câu hỏi ra file JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xuất JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-950/60 text-stone-300 hover:text-rose-300 border border-stone-700 hover:border-rose-800 text-xs font-bold transition-colors cursor-pointer"
              title="Khôi phục về bộ câu hỏi mặc định ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Khôi phục gốc</span>
            </button>
          </div>
        </div>

        {/* Row 2: Filter Tabs, Category Select & Search Box */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
          {/* Team Filter Tabs */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
            <button
              type="button"
              onClick={() => setFilterTeam('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTeam === 'all'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tất cả ({redQuestions.length + blueQuestions.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterTeam('red')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTeam === 'red'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-red-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Đội Đỏ ({redQuestions.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterTeam('blue')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterTeam === 'blue'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-sky-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Đội Xanh ({blueQuestions.length})
            </button>
          </div>

          {/* Search Box & Category Select */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-bold bg-stone-950 text-stone-300 border border-stone-700 rounded-xl px-2.5 py-1.5 outline-none focus:border-amber-500 shrink-0 cursor-pointer"
            >
              <option value="all">Tất cả chủ đề</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo nội dung, đáp án..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-xl text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {displayQuestions.length > 0 ? (
          displayQuestions.map(({ item, team }, index) => {
            const isRed = team === 'red';
            const letterLabels = ['A', 'B', 'C', 'D'];

            return (
              <div
                key={`${team}-${item.id}-${index}`}
                className={`bg-stone-900/90 rounded-2xl p-4 sm:p-5 border transition-all hover:border-stone-600 flex flex-col gap-3 shadow-md ${
                  isRed ? 'border-red-900/30' : 'border-sky-900/30'
                }`}
              >
                {/* Card Header: Team Badge, Category, ID & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    {/* Team Badge */}
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isRed
                          ? 'bg-red-950/80 text-red-300 border-red-700/60'
                          : 'bg-sky-950/80 text-sky-300 border-sky-700/60'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${isRed ? 'bg-red-500' : 'bg-sky-500'}`}
                      />
                      {isRed ? 'ĐỘI ĐỎ' : 'ĐỘI XANH'}
                    </span>

                    {/* Category */}
                    <span className="text-[11px] font-bold text-stone-400 px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800">
                      {item.category || 'Đố vui'}
                    </span>

                    <span className="text-xs text-stone-500 font-mono">#{item.id}</span>
                  </div>

                  {/* Actions: Edit, Duplicate, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item, team)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa câu hỏi này"
                    >
                      <Edit2 className="w-3 h-3 text-amber-400" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateQuestion(team, item.id)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors cursor-pointer"
                      title="Nhân bản tạo câu hỏi mới"
                    >
                      <Copy className="w-3 h-3 text-sky-400" />
                      <span>Nhân bản</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirm({
                          team,
                          id: item.id,
                          questionText: item.question,
                        })
                      }
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-sm sm:text-base font-bold text-stone-100 leading-snug">
                  {item.question}
                </h4>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((optText, optIdx) => {
                    const isCorrect = item.correctIndex === optIdx;

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/70 border border-emerald-500/70 text-emerald-200 font-semibold'
                            : 'bg-stone-950/60 border border-stone-800 text-stone-300'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center font-bold text-[11px] ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {letterLabels[optIdx]}
                        </span>
                        <span className="flex-1 leading-snug">{optText}</span>
                        {isCorrect && (
                          <span className="text-[10px] font-black text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-900/80 shrink-0">
                            ĐÚNG ✓
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation (if any) */}
                {item.explanation && (
                  <div className="text-xs text-stone-400 bg-stone-950/50 p-2.5 rounded-xl border border-stone-800/80 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-stone-300">Giải thích:</strong> {item.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty Search Results */
          <div className="bg-stone-900/60 border border-dashed border-stone-700 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-200 mb-1">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mb-4">
              Không có câu hỏi nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setFilterTeam('all');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Xóa bộ lọc
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black transition-colors cursor-pointer"
              >
                + Thêm câu hỏi mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Form Thêm / Sửa câu hỏi */}
      <QuestionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialQuestion={editingQuestion ? editingQuestion.question : null}
        defaultTeam={filterTeam === 'blue' ? 'blue' : 'red'}
        onSave={handleSaveQuestion}
      />

      {/* Modal: Xác nhận Xóa câu hỏi */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-center text-stone-100 mb-1">
              Xác Nhận Xóa Câu Hỏi?
            </h3>
            <p className="text-xs text-stone-400 text-center mb-3">
              Hành động này sẽ xóa câu hỏi này khỏi danh sách của{' '}
              <strong className={deleteConfirm.team === 'red' ? 'text-red-400' : 'text-sky-400'}>
                {deleteConfirm.team === 'red' ? 'Đội Đỏ' : 'Đội Xanh'}
              </strong>
              .
            </p>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 italic mb-4 line-clamp-3">
              "{deleteConfirm.questionText}"
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteQuestion(deleteConfirm.team, deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>XÓA CÂU HỎI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận Khôi phục mặc định */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-2xl text-stone-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800/80 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-center text-stone-100 mb-1">
              Khôi Phục Về Mặc Định?
            </h3>
            <p className="text-xs text-stone-400 text-center mb-4">
              Toàn bộ các câu hỏi đã thêm/sửa sẽ được thay thế bằng bộ câu hỏi gốc ban đầu (10 câu Đội Đỏ & 10 câu Đội Xanh).
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-bold text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDefaults();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>KHÔI PHỤC NGAY</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nhập dữ liệu JSON */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl text-stone-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-black text-stone-100">Nhập Câu Hỏi Từ File JSON</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success notification */}
            {importError && (
              <div className="p-3 bg-rose-950/80 border border-rose-700 rounded-xl text-rose-300 text-xs font-bold">
                {importError}
              </div>
            )}
            {importSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {importSuccess}
              </div>
            )}

            {/* Option 1: Upload File */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-stone-300">
                Cách 1: Chọn tệp tin JSON từ máy tính:
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-xs text-stone-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 file:cursor-pointer"
              />
            </div>

            {/* Option 2: Paste JSON */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-300">
                Cách 2: Hoặc dán trực tiếp đoạn mã JSON vào đây:
              </label>
              <textarea
                rows={5}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"redQuestions": [...], "blueQuestions": [...]}'
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs font-mono text-stone-200 placeholder-stone-600 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-stone-400 hover:text-stone-200 bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleManualImport}
                disabled={!importJsonText.trim()}
                className="px-4 py-1.5 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer"
              >
                Nạp JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
