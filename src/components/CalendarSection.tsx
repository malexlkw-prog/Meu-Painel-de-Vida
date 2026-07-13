import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Trash2, 
  Plus, 
  X, 
  Sparkles,
  Star,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Check,
  ChevronDown
} from 'lucide-react';
import { CalendarMarkedDay } from '../types';

interface CalendarSectionProps {
  markedDays: CalendarMarkedDay[];
  onMarkDay: (markedDay: CalendarMarkedDay) => void;
  onUnmarkDay: (date: string) => void;
}

const PRESET_COLORS = [
  { hex: '#8b5cf6', name: 'Violeta', bgClass: 'bg-violet-500', borderClass: 'border-violet-300', textClass: 'text-violet-600' },
  { hex: '#ef4444', name: 'Vermelho', bgClass: 'bg-red-500', borderClass: 'border-red-300', textClass: 'text-red-600' },
  { hex: '#10b981', name: 'Esmeralda', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-300', textClass: 'text-emerald-600' },
  { hex: '#3b82f6', name: 'Azul', bgClass: 'bg-blue-500', borderClass: 'border-blue-300', textClass: 'text-blue-600' },
  { hex: '#f59e0b', name: 'Âmbar', bgClass: 'bg-amber-500', borderClass: 'border-amber-300', textClass: 'text-amber-600' },
  { hex: '#ec4899', name: 'Rosa', bgClass: 'bg-pink-500', borderClass: 'border-pink-300', textClass: 'text-pink-600' }
];

const PRESET_CATEGORIES = [
  { id: 'Pessoal', label: 'Pessoal', color: '#3b82f6' },
  { id: 'Trabalho', label: 'Trabalho', color: '#8b5cf6' },
  { id: 'Escola', label: 'Escola', color: '#ec4899' },
  { id: 'Igreja', label: 'Igreja', color: '#f59e0b' },
  { id: 'Academia', label: 'Academia', color: '#ef4444' },
  { id: 'Outros', label: 'Outros', color: '#10b981' }
];

export default function CalendarSection({ markedDays, onMarkDay, onUnmarkDay }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected state for Modal/Dialog
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [textInput, setTextInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].hex);
  const [selectedCategory, setSelectedCategory] = useState(PRESET_CATEGORIES[0].id);
  const [notesInput, setNotesInput] = useState('');
  
  // Advanced Form States (hidden in "Mais opções")
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [repeatInput, setRepeatInput] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('none');
  const [isImportant, setIsImportant] = useState(false);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<boolean | 'all'>('all');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthsBR = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysOfWeekBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Calculate days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Calculate first day of the week offset for current month
  const getFirstDayOfMonthOffset = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getFirstDayOfMonthOffset(currentYear, currentMonth);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatDateString = (dayNum: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const handleDaySelect = (dayNum: number) => {
    const dateStr = formatDateString(dayNum);
    setSelectedDateStr(dateStr);
    
    // Autofill event if already exists
    const existing = markedDays.find(d => d.date === dateStr);
    if (existing) {
      setTextInput(existing.text || '');
      setTimeInput(existing.time || '');
      setSelectedColor(existing.color);
      setSelectedCategory(existing.category || PRESET_CATEGORIES[0].id);
      setNotesInput(existing.notes || '');
      setRepeatInput(existing.repeat || 'none');
      setIsImportant(existing.important || false);
    } else {
      setTextInput('');
      setTimeInput('');
      setSelectedColor(PRESET_COLORS[0].hex);
      setSelectedCategory(PRESET_CATEGORIES[0].id);
      setNotesInput('');
      setRepeatInput('none');
      setIsImportant(false);
    }
    setShowAdvanced(false);
    setIsModalOpen(true);
  };

  const handleSaveMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateStr || !textInput.trim()) return;

    onMarkDay({
      date: selectedDateStr,
      color: selectedColor,
      text: textInput.trim(),
      time: timeInput,
      category: selectedCategory,
      notes: notesInput.trim(),
      repeat: repeatInput,
      important: isImportant
    });

    setIsModalOpen(false);
    setSelectedDateStr(null);
  };

  const handleRemoveMark = () => {
    if (selectedDateStr) {
      onUnmarkDay(selectedDateStr);
      setIsModalOpen(false);
      setSelectedDateStr(null);
    }
  };

  // Prepare calendar cells
  const cells: Array<{ dayNum: number | null, dateStr: string | null, mark?: CalendarMarkedDay }> = [];
  
  for (let i = 0; i < startOffset; i++) {
    cells.push({ dayNum: null, dateStr: null });
  }

  for (let d = 1; d <= daysCount; d++) {
    const dStr = formatDateString(d);
    const existingMark = markedDays.find(m => m.date === dStr);
    cells.push({
      dayNum: d,
      dateStr: dStr,
      mark: existingMark
    });
  }

  const getReadableSelectedDate = () => {
    if (!selectedDateStr) return '';
    const [y, m, d] = selectedDateStr.split('-');
    return `${d} de ${monthsBR[parseInt(m) - 1]} de ${y}`;
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return today.getDate() === dayNum && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  // Filter logic
  const filteredMarkedDays = markedDays.filter(day => {
    const matchesCategory = categoryFilter === 'all' || day.category === categoryFilter;
    const matchesImportance = importanceFilter === 'all' || day.important === importanceFilter;
    return matchesCategory && matchesImportance;
  });

  return (
    <div className="space-y-6">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CalendarIcon size={22} />
            </span>
            <span>Calendário Mensal</span>
          </h2>

        </div>

        {/* Filters Panel - Minimal & Clean */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Filtrar:</span>
            
            {/* Category selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              {PRESET_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setImportanceFilter(prev => prev === 'all' ? true : prev === true ? false : 'all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              importanceFilter === 'all'
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200/50 dark:border-slate-800'
                : importanceFilter === true
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                  : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-950 dark:text-slate-600 dark:border-slate-900'
            }`}
          >
            <Star size={12} className={importanceFilter === true ? 'fill-amber-500 stroke-amber-500' : ''} />
            <span>
              {importanceFilter === 'all' ? 'Importância' : importanceFilter === true ? 'Importantes' : 'Normais'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-4 shadow-xs">
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {monthsBR[currentMonth]}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
              {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrevMonth}
              className="p-2 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-slate-600 dark:text-slate-350 transition-all cursor-pointer"
              title="Mês Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-[10px] font-bold px-3 py-2 uppercase border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-slate-600 dark:text-slate-350 transition-all cursor-pointer leading-none"
            >
              Hoje
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-slate-600 dark:text-slate-350 transition-all cursor-pointer"
              title="Próximo Mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center py-2 mb-1 bg-slate-50/50 dark:bg-slate-950/25 rounded-2xl">
          {daysOfWeekBR.map((day, idx) => (
            <span 
              key={day} 
              className={`text-[10px] font-black uppercase tracking-wider ${
                idx === 0 ? 'text-rose-500/80' : idx === 6 ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 bg-slate-100/40 dark:bg-slate-950/20 p-1 rounded-2xl border border-slate-100 dark:border-slate-850/50">
          {cells.map((cell, index) => {
            const { dayNum, dateStr, mark } = cell;
            
            if (dayNum === null) {
              return (
                <div 
                  key={`empty-${index}`} 
                  className="bg-transparent min-h-[85px] md:min-h-[100px]" 
                />
              );
            }

            const currentIsToday = isToday(dayNum);
            
            // Check if matches the filters
            const isVisible = !mark || (
              (categoryFilter === 'all' || mark.category === categoryFilter) &&
              (importanceFilter === 'all' || mark.important === importanceFilter)
            );

            const displayMark = isVisible ? mark : undefined;

            return (
              <button
                key={dateStr}
                onClick={() => handleDaySelect(dayNum)}
                className={`min-h-[85px] md:min-h-[100px] p-2 bg-white dark:bg-slate-900 rounded-xl text-left flex flex-col justify-between transition-all relative border border-slate-150/40 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-850/55 group ${
                  currentIsToday ? 'ring-2 ring-indigo-500/80 ring-offset-2 dark:ring-offset-slate-900' : ''
                }`}
              >
                {/* Day Indicator */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-mono font-bold ${
                    currentIsToday 
                      ? 'bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-black shadow-xs text-[10px]'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {dayNum}
                  </span>

                  {/* Indicator icons */}
                  <div className="flex items-center gap-1">
                    {displayMark?.important && (
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                    )}
                    {displayMark?.repeat && displayMark.repeat !== 'none' && (
                      <RefreshCw size={8} className="text-slate-400" />
                    )}
                    {displayMark && (
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: displayMark.color }} 
                      />
                    )}
                  </div>
                </div>

                {/* Event snip preview */}
                {displayMark && (
                  <div className="w-full mt-2 space-y-1">
                    <div 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate border text-ellipsis"
                      style={{ 
                        backgroundColor: `${displayMark.color}12`, 
                        color: displayMark.color,
                        borderColor: `${displayMark.color}25`
                      }}
                      title={displayMark.text}
                    >
                      {displayMark.time && <span className="font-mono opacity-80 mr-1">{displayMark.time}</span>}
                      {displayMark.text}
                    </div>
                    {displayMark.category && (
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block px-1 truncate">
                        {displayMark.category}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* REFORMULATED ELEGANT MODAL POPUP */}
      <AnimatePresence>
        {isModalOpen && selectedDateStr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Highlight Colored Top Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              />

              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-0.5">
                    {getReadableSelectedDate()}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                    {markedDays.some(m => m.date === selectedDateStr) ? 'Editar Compromisso' : 'Agendar Compromisso'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveMark} className="space-y-4">
                
                {/* Event Title */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Título do Evento</label>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Ex: Reunião de Planejamento..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none dark:text-white font-medium"
                    required
                    autoFocus
                  />
                </div>

                {/* Time & Color Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Horário (Opcional)</label>
                    <input
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Categoria</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        // Automatically pair with preset color if customizable
                        const matchedCat = PRESET_CATEGORIES.find(c => c.id === e.target.value);
                        if (matchedCat) setSelectedColor(matchedCat.color);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs focus:outline-none dark:text-white font-semibold cursor-pointer"
                    >
                      {PRESET_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color presets selection row */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Cor Temática</label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setSelectedColor(color.hex)}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-all relative ${color.bgClass} hover:scale-110 active:scale-95`}
                        title={color.name}
                      >
                        {selectedColor === color.hex && (
                          <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white block shadow-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Observação */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Observação / Detalhes</label>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Adicione notas ou lembretes adicionais para este dia..."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white resize-none leading-relaxed font-medium"
                  />
                </div>

                {/* COLLAPSIBLE ADVANCED DRAWER "Mais opções" */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-slate-450 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal size={13} /> Mais opções avançadas
                    </span>
                    <ChevronDown size={14} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 space-y-3.5"
                      >
                        {/* Recurrence Repeat dropdown */}
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Repetir Evento</span>
                            <select
                              value={repeatInput}
                              onChange={(e) => setRepeatInput(e.target.value as any)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none dark:text-white cursor-pointer"
                            >
                              <option value="none">Não repetir</option>
                              <option value="daily">Diariamente</option>
                              <option value="weekly">Semanalmente</option>
                              <option value="monthly">Mensalmente</option>
                              <option value="yearly">Anualmente</option>
                            </select>
                          </div>

                          {/* Important Mark Checkbox Toggle */}
                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id="modalImportant"
                              checked={isImportant}
                              onChange={(e) => setIsImportant(e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="modalImportant" className="text-xs font-semibold text-slate-600 dark:text-slate-400 select-none cursor-pointer flex items-center gap-1">
                              <Star size={12} className="text-amber-500 fill-amber-500" /> Marcar como Importante
                            </label>
                          </div>
                        </div>

                        {/* Action buttons when editing inside drawer */}
                        {markedDays.some(m => m.date === selectedDateStr) && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleRemoveMark}
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-500 dark:border-rose-950 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              <Trash2 size={13} /> Excluir Evento
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Primary Action Buttons (Always visible as mandated) */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs tracking-wide transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold rounded-xl text-xs tracking-wide transition-all cursor-pointer shadow-sm text-center"
                  >
                    Salvar
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
