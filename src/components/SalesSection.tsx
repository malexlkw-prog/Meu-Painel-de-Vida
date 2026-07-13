import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Trash2, 
  Edit3, 
  X, 
  MoreVertical, 
  Calendar, 
  User, 
  DollarSign, 
  Copy,
  Info,
  ChevronRight,
  Filter,
  Search,
  Tag
} from 'lucide-react';
import { FinanceTransaction } from '../types';

interface SalesSectionProps {
  finance: FinanceTransaction[];
  onAdd: (transaction: Omit<FinanceTransaction, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (transaction: FinanceTransaction) => void;
}

export default function SalesSection({ 
  finance, 
  onAdd, 
  onDelete, 
  onUpdate 
}: SalesSectionProps) {
  // Filter only income transactions (which represent sales)
  const sales = finance.filter(t => t.type === 'income');

  // UI States
  const [selectedSale, setSelectedSale] = useState<FinanceTransaction | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSale, setEditingSale] = useState<FinanceTransaction | null>(null);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | 'personal' | 'work' | 'stationery'>('all');

  // Form states for Edit
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCat, setEditCat] = useState<'personal' | 'work' | 'stationery'>('stationery');
  const [editDate, setEditDate] = useState('');

  // Helper to parse Client from description (e.g., "Venda de Caderno para Marcos" or "[Cliente: Marcos]")
  const parseClient = (desc: string) => {
    // Look for patterns like "para [Name]" or "Cliente: [Name]"
    const paraMatch = desc.match(/para\s+([^,\[\]\(\)\-\.]+)/i);
    if (paraMatch && paraMatch[1]) {
      return paraMatch[1].trim();
    }
    const clienteMatch = desc.match(/cliente:\s*([^,\[\]\(\)\-\.]+)/i);
    if (clienteMatch && clienteMatch[1]) {
      return clienteMatch[1].trim();
    }
    // Check inside brackets [Marcos]
    const bracketMatch = desc.match(/\[([^\]]+)\]/);
    if (bracketMatch && bracketMatch[1]) {
      return bracketMatch[1].trim();
    }
    return null;
  };

  // Filter sales
  const filteredSales = sales
    .filter(s => {
      const matchesSearch = s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCat === 'all' || s.category === filterCat;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Edit Handlers
  const startEdit = (sale: FinanceTransaction) => {
    setEditingSale(sale);
    setEditDesc(sale.description);
    setEditAmount(sale.amount.toString());
    setEditCat(sale.category);
    setEditDate(sale.date);
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale || !editDesc.trim() || !editAmount) return;

    onUpdate({
      ...editingSale,
      description: editDesc.trim(),
      amount: parseFloat(editAmount) || 0,
      category: editCat,
      date: editDate
    });

    setEditingSale(null);
    setShowEditModal(false);
  };

  const handleDuplicate = (sale: FinanceTransaction) => {
    onAdd({
      type: 'income',
      description: `${sale.description} (Cópia)`,
      amount: sale.amount,
      category: sale.category,
      date: new Date().toISOString().split('T')[0]
    });
    setActiveMenuId(null);
  };

  const totalSalesVolume = filteredSales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header section */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-black tracking-tight text-slate-850 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
              <TrendingUp size={18} />
            </span>
            Vendas da Papelaria
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Visualize as receitas e vendas registradas da papelaria e outros serviços.
          </p>
        </div>
        
        {/* Total volume indicator */}
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-right shrink-0">
          <span className="text-[9px] uppercase font-black text-blue-600 block tracking-wider">Faturamento Filtrado</span>
          <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">R$ {totalSalesVolume.toFixed(2)}</span>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-3xl shadow-3xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></span>
          <input
            type="text"
            placeholder="Buscar vendas por nome, produto ou cliente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl p-2.5 pl-9 text-xs focus:outline-none dark:text-white font-bold"
          />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value as any)}
            className="w-full md:w-44 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none dark:text-white font-bold"
          >
            <option value="all">Categorias (Todas)</option>
            <option value="stationery">🏪 Papelaria / Loja</option>
            <option value="personal">👤 Vida Pessoal</option>
            <option value="work">💼 Trabalho / Outros</option>
          </select>
        </div>
      </div>

      {/* Clean Table/Grid list - EXPORTS ONLY PRODUCT, CLIENT, VALUE, DATE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25 text-slate-400 font-black uppercase font-mono text-[9px] tracking-wider">
                <th className="p-4 pl-6">Data</th>
                <th className="p-4">Produto / Descrição</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Valor</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredSales.map(sale => {
                const isMenuOpen = activeMenuId === sale.id;
                const client = parseClient(sale.description);
                
                return (
                  <tr 
                    key={sale.id} 
                    onClick={() => setSelectedSale(sale)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/15 transition-colors cursor-pointer"
                  >
                    {/* Date */}
                    <td className="p-4 pl-6 font-mono text-slate-400 whitespace-nowrap">{sale.date}</td>
                    
                    {/* Product */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100 max-w-[280px] break-words">
                        {sale.description.replace(/\[[^\]]+\]/g, '').split('para')[0].trim()}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      {client ? (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-stone-300 font-bold">
                          <User size={12} className="text-slate-400" />
                          <span>{client}</span>
                        </div>
                      ) : (
                        <span className="text-slate-350 italic text-[10px]">Não informado</span>
                      )}
                    </td>

                    {/* Value */}
                    <td className="p-4 font-mono font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      R$ {sale.amount.toFixed(2)}
                    </td>

                    {/* Context menu actions */}
                    <td className="p-4 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : sale.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer"
                        >
                          <MoreVertical size={14} />
                        </button>

                        <AnimatePresence>
                          {isMenuOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-lg py-1.5 z-20 text-xs text-left font-sans font-bold"
                              >
                                <button
                                  onClick={() => setSelectedSale(sale)}
                                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2"
                                >
                                  <Info size={12} className="text-blue-500" />
                                  Ver Detalhes
                                </button>
                                <button
                                  onClick={() => startEdit(sale)}
                                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2"
                                >
                                  <Edit3 size={12} className="text-indigo-500" />
                                  Editar Registro
                                </button>
                                <button
                                  onClick={() => handleDuplicate(sale)}
                                  className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2"
                                >
                                  <Copy size={12} className="text-amber-500" />
                                  Duplicar Registro
                                </button>

                                <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                                <button
                                  onClick={() => {
                                    onDelete(sale.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                                >
                                  <Trash2 size={12} />
                                  Excluir Venda
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic font-bold">
                    Nenhuma venda registrada encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS DIALOG / MODAL */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSale(null)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-xl relative z-20 space-y-4 text-left font-sans"
            >
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  🔍 Detalhes da Venda
                </h3>
                <button onClick={() => setSelectedSale(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Details table */}
              <div className="space-y-3 text-xs font-bold">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 border rounded-2xl space-y-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Descrição / Produto</span>
                  <p className="text-slate-800 dark:text-white text-xs font-black">{selectedSale.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-2xl">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Valor Registrado</span>
                    <span className="text-sm font-black font-mono text-emerald-600 block mt-1">R$ {selectedSale.amount.toFixed(2)}</span>
                  </div>

                  <div className="p-3 border rounded-2xl">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Data do Lançamento</span>
                    <span className="text-xs font-black font-mono text-slate-700 dark:text-stone-300 block mt-1">{selectedSale.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-2xl">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Categoria Fluxo</span>
                    <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-black uppercase ${
                      selectedSale.category === 'stationery'
                        ? 'text-emerald-500'
                        : selectedSale.category === 'personal'
                          ? 'text-blue-500'
                          : 'text-amber-500'
                    }`}>
                      {selectedSale.category === 'stationery' ? '🏪 Papelaria' : selectedSale.category === 'personal' ? '👤 Vida Pessoal' : '💼 Outros'}
                    </span>
                  </div>

                  <div className="p-3 border rounded-2xl">
                    <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Identificador ID</span>
                    <span className="text-[9px] font-black font-mono text-slate-400 block mt-1 truncate">{selectedSale.id}</span>
                  </div>
                </div>

                {/* Cliente se houver */}
                {parseClient(selectedSale.description) && (
                  <div className="p-3.5 bg-blue-500/5 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center gap-2.5">
                    <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg shrink-0"><User size={14} /></span>
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-450 block tracking-wider">Cliente Vinculado</span>
                      <span className="text-xs font-black text-slate-700 dark:text-stone-300">{parseClient(selectedSale.description)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedSale(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-black text-xs py-2.5 rounded-xl transition-all"
              >
                Fechar Detalhes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && editingSale && (
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
                  ✏️ Editar Registro de Venda
                </h3>
                <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Descrição / Produto / Cliente</label>
                  <input
                    type="text"
                    required
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                {/* Amount and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Valor Recebido (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select
                      value={editCat}
                      onChange={e => setEditCat(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
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
                    value={editDate}
                    onChange={e => setEditDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-sm active:scale-98"
                >
                  Salvar Alterações
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
