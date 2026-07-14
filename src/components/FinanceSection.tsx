import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Trash2, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  BarChart4, 
  PieChart, 
  Briefcase, 
  User, 
  X,
  Calendar,
  Filter,
  MoreVertical,
  Copy,
  Edit3,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart as RePieChart, 
  Pie, 
  Cell
} from 'recharts';
import { FinanceTransaction } from '../types';

interface FinanceSectionProps {
  finance: FinanceTransaction[];
  onAdd: (transaction: Omit<FinanceTransaction, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (transaction: FinanceTransaction) => void;
}

export default function FinanceSection({ finance, onAdd, onDelete, onUpdate }: FinanceSectionProps) {
  // UI Panels states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Editing transaction state
  const [editingTransaction, setEditingTransaction] = useState<FinanceTransaction | null>(null);

  // Form states for Add/Edit
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'personal' | 'work' | 'stationery'>('stationery');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCat, setFilterCat] = useState<'all' | 'personal' | 'work' | 'stationery'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculations
  const totalIncome = finance
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = finance
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Monthly savings / profit calculation
  const currentMonthPrefix = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  const monthlyIncome = finance
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = finance
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpense;

  // Filter and sort transactions
  const filteredTransactions = finance
    .filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCat = filterCat === 'all' || t.category === filterCat;
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesCat && matchesSearch;
    })
    // Sort by date newest first, then id
    .sort((a, b) => b.date.localeCompare(a.date));

  // Limit display to recent transactions unless expanded
  const [displayCount, setDisplayCount] = useState(10);
  const visibleTransactions = filteredTransactions.slice(0, displayCount);

  // Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    onAdd({
      type,
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      category,
      date
    });

    // Reset Form & Close
    setDescription('');
    setAmount('');
    setCategory('stationery');
    setDate(new Date().toISOString().split('T')[0]);
    setType('income');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction || !description.trim() || !amount) return;

    onUpdate({
      ...editingTransaction,
      type,
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      category,
      date
    });

    setEditingTransaction(null);
    setShowEditModal(false);
  };

  const openAddModal = () => {
    setType('income');
    setDescription('');
    setAmount('');
    setCategory('stationery');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddModal(true);
  };

  const openEditModal = (t: FinanceTransaction) => {
    setEditingTransaction(t);
    setType(t.type);
    setDescription(t.description);
    setAmount(t.amount.toString());
    setCategory(t.category);
    setDate(t.date);
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleDuplicate = (t: FinanceTransaction) => {
    onAdd({
      type: t.type,
      description: `${t.description} (Cópia)`,
      amount: t.amount,
      category: t.category,
      date: new Date().toISOString().split('T')[0] // Set to today
    });
    setActiveMenuId(null);
  };

  const handleChangeCategory = (t: FinanceTransaction, newCat: 'personal' | 'work' | 'stationery') => {
    onUpdate({
      ...t,
      category: newCat
    });
    setActiveMenuId(null);
  };

  // Chart preparation data
  const getDailyAggData = () => {
    const datesMap: { [key: string]: { income: number, expense: number } } = {};
    
    // Sort transactions by date ascending for chronologically sound graphs
    const sortedTrans = [...finance].sort((a, b) => a.date.localeCompare(b.date));
    const uniqueDates = Array.from(new Set(sortedTrans.map(t => t.date))).slice(-10);

    uniqueDates.forEach(d => {
      datesMap[d] = { income: 0, expense: 0 };
    });

    sortedTrans.forEach(t => {
      if (datesMap[t.date]) {
        if (t.type === 'income') {
          datesMap[t.date].income += t.amount;
        } else {
          datesMap[t.date].expense += t.amount;
        }
      }
    });

    return Object.keys(datesMap).map(d => {
      const parts = d.split('-');
      const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
      return {
        name: formattedDate,
        Ganhos: Math.round(datesMap[d].income),
        Gastos: Math.round(datesMap[d].expense)
      };
    });
  };

  const barChartData = getDailyAggData();

  const getCategoryData = () => {
    const catsMap = { personal: 0, work: 0, stationery: 0 };
    finance.forEach(t => {
      if (catsMap[t.category] !== undefined) {
        catsMap[t.category] += t.amount;
      }
    });
    return [
      { name: 'Pessoal 👤', value: Math.round(catsMap.personal), color: '#3b82f6' },
      { name: 'Trabalho Geral 💼', value: Math.round(catsMap.work), color: '#f59e0b' },
      { name: 'Papelaria 🏪', value: Math.round(catsMap.stationery), color: '#10b981' }
    ];
  };

  const pieChartData = getCategoryData().filter(c => c.value > 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-3xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <DollarSign size={18} />
            </span>
            Controle Financeiro
          </h2>
        </div>
        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <Plus size={14} /> Registrar Transação
        </button>
      </div>

      {/* Main KPI Indicators Grid - SHOWS ONLY SALDO, RECEBIDO, GASTO, ECONOMIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Atual */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800/80 rounded-2.5xl relative overflow-hidden shadow-3xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-sans">Saldo Atual</span>
            <span className={`p-1 rounded-lg text-xs ${currentBalance >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'}`}>
              {currentBalance >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </span>
          </div>
          <span className={`text-2xl font-black font-mono tracking-tight block mt-2 ${currentBalance >= 0 ? 'text-slate-850 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total Recebido */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800/80 rounded-2.5xl relative overflow-hidden shadow-3xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-sans">Total Recebido</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <TrendingUp size={14} />
            </span>
          </div>
          <span className="text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 block mt-2">
            R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total Gasto */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800/80 rounded-2.5xl relative overflow-hidden shadow-3xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-sans">Total Gasto</span>
            <span className="p-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <ArrowDownRight size={14} />
            </span>
          </div>
          <span className="text-2xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-400 block mt-2">
            R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Economia do Mês */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800/80 rounded-2.5xl relative overflow-hidden shadow-3xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-sans">Economia do Mês</span>
            <span className={`p-1 rounded-lg text-xs ${monthlySavings >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'}`}>
              <CheckCircle2 size={14} />
            </span>
          </div>
          <span className={`text-2xl font-black font-mono tracking-tight block mt-2 ${monthlySavings >= 0 ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-500'}`}>
            R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Reports and Charts - Collapsible section to avoid clutter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xs">
        <button
          onClick={() => setShowReports(!showReports)}
          className="w-full flex justify-between items-center p-4 bg-slate-50/50 dark:bg-slate-950/10 hover:bg-slate-100/40 dark:hover:bg-slate-950/20 transition-all border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <BarChart4 size={14} className="text-emerald-600" />
            Relatórios e Gráficos do Caixa
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[11px] font-bold font-sans">{showReports ? 'Ocultar' : 'Visualizar'}</span>
            {showReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        <AnimatePresence>
          {showReports && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar chart */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Histórico de Movimentações Diárias (R$)</h4>
                  <div className="w-full h-64">
                    {barChartData.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center text-xs italic text-slate-400">
                        Nenhuma transação cadastrada para gerar gráfico.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} cursor={{ fill: 'rgba(226,232,240,0.1)' }} />
                          <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="Ganhos" fill="#10b981" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Gastos" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Pie chart */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Volume de Custo por Categoria (R$)</h4>
                  <div className="w-full h-44 relative flex items-center justify-center">
                    {pieChartData.length === 0 ? (
                      <div className="w-full h-full flex items-center justify-center text-xs italic text-slate-400">
                        Nenhuma despesa para gerar gráfico.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                        </RePieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {getCategoryData().map(c => (
                      <div key={c.name} className="flex justify-between items-center text-[11px] font-bold">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-mono text-slate-700 dark:text-stone-300">R$ {c.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters & Recent Transactions Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-3xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Últimas Movimentações
          </h3>

          {/* Collapsible search/filters inline to keep it super clean */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <input
                type="text"
                placeholder="Buscar movimentação..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-48 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-2 pl-3 text-xs focus:outline-none dark:text-white"
              />
            </div>
            
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none dark:text-white font-bold"
            >
              <option value="all">Tipos (Todos)</option>
              <option value="income">📈 Entradas</option>
              <option value="expense">📉 Saídas</option>
            </select>

            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs focus:outline-none dark:text-white font-bold"
            >
              <option value="all">Categorias (Todas)</option>
              <option value="personal">👤 Vida Pessoal</option>
              <option value="work">💼 Trabalho Geral</option>
              <option value="stationery">🏪 Papelaria</option>
            </select>
          </div>
        </div>

        {/* Transactions list - Extremely elegant, no bulky buttons */}
        <div className="space-y-2">
          {visibleTransactions.map(item => {
            const isMenuOpen = activeMenuId === item.id;
            
            return (
              <div 
                key={item.id} 
                className="group relative flex justify-between items-center p-3.5 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/15 dark:hover:bg-slate-950/30 border dark:border-slate-800/80 rounded-2xl transition-all font-sans"
              >
                <div className="flex items-center gap-3">
                  {/* Indicator Icon */}
                  <div className={`p-2 rounded-xl shrink-0 ${item.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'}`}>
                    {item.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  
                  {/* Text details */}
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-slate-900 transition-colors block">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className={`inline-flex items-center gap-0.5 uppercase px-1.5 py-0.2 rounded-md ${
                        item.category === 'stationery'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                          : item.category === 'personal'
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600'
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                      }`}>
                        {item.category === 'stationery' ? '🏪 Papelaria' : item.category === 'personal' ? '👤 Pessoal' : '💼 Trabalho'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount and Context Menu Trigger */}
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-black text-xs ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                  </span>
                  
                  {/* Contextual Ellipsis Menu (⋮) */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {/* Dropdown Menu Overlay */}
                    <AnimatePresence>
                      {isMenuOpen && (
                        <>
                          {/* Invisible click-away overlay */}
                          <div 
                            className="fixed inset-0 z-10 cursor-default" 
                            onClick={() => setActiveMenuId(null)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg py-1.5 z-20 text-xs"
                          >
                            <button
                              onClick={() => openEditModal(item)}
                              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 font-bold cursor-pointer"
                            >
                              <Edit3 size={13} className="text-indigo-500" />
                              Editar Lançamento
                            </button>
                            <button
                              onClick={() => handleDuplicate(item)}
                              className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 font-bold cursor-pointer"
                            >
                              <Copy size={13} className="text-amber-500" />
                              Duplicar Registro
                            </button>
                            
                            {/* Quick Categories Toggle */}
                            <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                            <div className="px-3 py-1 text-[9px] uppercase font-black text-slate-400 tracking-wider">Alterar Categoria</div>
                            <button
                              onClick={() => handleChangeCategory(item, 'personal')}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 font-semibold cursor-pointer ${item.category === 'personal' ? 'text-blue-500 bg-blue-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
                            >
                              <span className="text-[10px]">👤</span> Vida Pessoal
                            </button>
                            <button
                              onClick={() => handleChangeCategory(item, 'work')}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 font-semibold cursor-pointer ${item.category === 'work' ? 'text-amber-500 bg-amber-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
                            >
                              <span className="text-[10px]">💼</span> Trabalho Geral
                            </button>
                            <button
                              onClick={() => handleChangeCategory(item, 'stationery')}
                              className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 font-semibold cursor-pointer ${item.category === 'stationery' ? 'text-emerald-500 bg-emerald-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
                            >
                              <span className="text-[10px]">🏪</span> Papelaria
                            </button>

                            <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                            <button
                              onClick={() => {
                                onDelete(item.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 font-bold cursor-pointer"
                            >
                              <Trash2 size={13} />
                              Excluir Lançamento
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 italic font-medium">
              Nenhuma movimentação financeira encontrada.
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredTransactions.length > displayCount && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950/10 hover:bg-slate-100 dark:hover:bg-slate-950/25 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 rounded-xl transition-all border dark:border-slate-800"
            >
              Ver Mais Lançamentos
            </button>
          </div>
        )}
      </div>

      {/* ADD / REGISTER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-xl relative z-20 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  💵 Registrar Lançamento
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tipo de Fluxo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-2 text-xs font-black rounded-xl border transition-all flex justify-center items-center gap-1 ${
                        type === 'income'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingUp size={13} /> Entrada / Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-2 text-xs font-black rounded-xl border transition-all flex justify-center items-center gap-1 ${
                        type === 'expense'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowDownRight size={13} /> Saída / Despesa
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Descrição</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Ex: Venda de Caderno, Aluguel, Uber..."
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                {/* Amount and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      <option value="stationery">🏪 Papelaria / Loja</option>
                      <option value="personal">👤 Vida Pessoal</option>
                      <option value="work">💼 Trabalho / Outros</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-sm active:scale-98"
                  >
                    Registrar Lançamento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && editingTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-xl relative z-20 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  ✏️ Editar Lançamento
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tipo de Fluxo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-2 text-xs font-black rounded-xl border transition-all flex justify-center items-center gap-1 ${
                        type === 'income'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingUp size={13} /> Entrada / Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-2 text-xs font-black rounded-xl border transition-all flex justify-center items-center gap-1 ${
                        type === 'expense'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowDownRight size={13} /> Saída / Despesa
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Descrição</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                {/* Amount and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      <option value="stationery">🏪 Papelaria / Loja</option>
                      <option value="personal">👤 Vida Pessoal</option>
                      <option value="work">💼 Trabalho / Outros</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-sm active:scale-98"
                  >
                    Salvar Alterações
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
