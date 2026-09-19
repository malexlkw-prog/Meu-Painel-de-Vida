import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Filter,
  Flame,
  Info,
  ChevronRight
} from 'lucide-react';
import { RedeAdolescentesData } from '../../types/redeAdolescentes';

interface RedeCronogramaViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  cycleName?: string;
  cycleNumber?: number;
  description?: string;
  readings?: string;
  isSpecial: boolean;
  specialEventId?: string;
  month: string;
}

export const RedeCronogramaView: React.FC<RedeCronogramaViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('todos');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'ciclos' | 'especiais'>('todos');
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  // Compile all meetings chronologically
  const timeline: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [];

    // Add cycles
    (data.cycles || []).forEach(cycle => {
      (cycle.weeks || []).forEach(w => {
        let month = 'Outro';
        const dateStr = w.date || '';
        if (dateStr.includes('/02/')) month = 'Fevereiro';
        else if (dateStr.includes('/03/')) month = 'Março';
        else if (dateStr.includes('/04/')) month = 'Abril';
        else if (dateStr.includes('/05/')) month = 'Maio';
        else if (dateStr.includes('/06/')) month = 'Junho';
        else if (dateStr.includes('07') || dateStr.includes('Julho')) month = 'Julho';
        else if (dateStr.includes('/08/')) month = 'Agosto';
        else if (dateStr.includes('/09/')) month = 'Setembro';
        else if (dateStr.includes('/10/')) month = 'Outubro';
        else if (dateStr.includes('/11/')) month = 'Novembro';
        else if (dateStr.includes('/12/')) month = 'Dezembro';

        list.push({
          id: w.id,
          date: w.date || '',
          title: w.theme,
          cycleName: cycle.name,
          cycleNumber: cycle.number,
          description: w.description,
          readings: w.readings,
          isSpecial: false,
          month
        });
      });
    });

    // Add special events
    (data.specialEvents || []).forEach(evt => {
      let month = 'Outro';
      const evtDate = evt.date || '';
      if (evtDate.includes('/04/')) month = 'Abril';
      else if (evtDate.includes('/05/')) month = 'Maio';
      else if (evtDate.includes('/09/')) month = 'Setembro';
      else if (evtDate.includes('/11/')) month = 'Novembro';
      else if (evtDate.includes('/12/')) month = 'Dezembro';

      list.push({
        id: evt.id,
        date: evt.date || '',
        title: `🎉 ${evt.name}`,
        description: `${evt.description} • Responsável: ${evt.responsible || 'Equipe'}`,
        isSpecial: true,
        specialEventId: evt.id,
        month
      });
    });

    // Sort chronologically by 2027 date
    const parseDateForSort = (dStr: string) => {
      if (!dStr) return 0;
      if (dStr.includes('10/07')) return new Date(2027, 6, 10).getTime();
      const parts = dStr.split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
      }
      return 0;
    };

    return list.sort((a, b) => parseDateForSort(a.date) - parseDateForSort(b.date));
  }, [data.cycles, data.specialEvents]);

  const filteredTimeline = useMemo(() => {
    return timeline.filter(item => {
      const q = (searchTerm || '').toLowerCase();
      const matchSearch = !q || (item.title || '').toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.date && item.date.includes(searchTerm));
      
      const matchMonth = selectedMonth === 'todos' || item.month === selectedMonth;
      
      const matchType = typeFilter === 'todos' ||
        (typeFilter === 'ciclos' && !item.isSpecial) ||
        (typeFilter === 'especiais' && item.isSpecial);

      return matchSearch && matchMonth && matchType;
    });
  }, [timeline, searchTerm, selectedMonth, typeFilter]);

  const months = ['todos', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-500" size={22} />
            <span>Cronograma Completo 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento cronológico de todos os sábados, ciclos e eventos especiais de 06/02 a 04/12/2027.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Clock size={14} />
          <span>Datas futuras (Planejado)</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tema, leitura ou data..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs w-full md:w-auto justify-center">
          <button
            onClick={() => setTypeFilter('todos')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${typeFilter === 'todos' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Todos ({timeline.length})
          </button>
          <button
            onClick={() => setTypeFilter('ciclos')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${typeFilter === 'ciclos' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Ciclos (29)
          </button>
          <button
            onClick={() => setTypeFilter('especiais')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${typeFilter === 'especiais' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Sábados Especiais (6)
          </button>
        </div>
      </div>

      {/* Month Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {months.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMonth === m
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {m === 'todos' ? 'Todos os Meses' : m}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredTimeline.map((item, index) => {
          const isSpecial = item.isSpecial;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSpecial
                  ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/40 hover:border-amber-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Date Tag */}
                <div className={`shrink-0 w-24 px-2.5 py-1.5 rounded-xl text-center font-mono font-bold text-xs ${
                  isSpecial
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}>
                  {item.date}
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {item.cycleName && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                        {item.cycleName}
                      </span>
                    )}
                    {isSpecial && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase tracking-wider">
                        Sábado Especial
                      </span>
                    )}
                  </div>

                  {item.readings && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      📖 Leitura: {item.readings}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Circle size={10} className={isSpecial ? 'text-amber-500 fill-amber-500' : 'text-blue-400 fill-blue-400'} />
                  Planejado
                </span>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          );
        })}

        {filteredTimeline.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs">
            Nenhum encontro encontrado para os filtros selecionados.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {selectedItem.date}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
                  {selectedItem.title}
                </h3>
                {selectedItem.cycleName && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ciclo: {selectedItem.cycleName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedItem.readings && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                📖 Leitura Bíblica Semanal: {selectedItem.readings}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Descrição & Objetivo</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                {selectedItem.description || 'Sem anotações adicionais cadastradas para esta data.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
