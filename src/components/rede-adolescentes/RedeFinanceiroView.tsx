import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Tag,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { RedeAdolescentesData, RedeFinanceItem, RedeFinanceCategory } from '../../types/redeAdolescentes';

interface RedeFinanceiroViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeFinanceiroView: React.FC<RedeFinanceiroViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RedeFinanceItem | null>(null);

  const categories: RedeFinanceCategory[] = [
    'Camisas',
    'Alimentação',
    'Passeios',
    'Transporte',
    'Materiais',
    'Decoração',
    'Brindes',
    'Gincanas',
    'Cinema',
    'Noite com Deus',
    'Confraternização',
    'Outros'
  ];

  // Calculations
  const metrics = useMemo(() => {
    let totalEstimated = 0;
    let totalConfirmedOrPaid = 0;
    let totalPendingOrPlanned = 0;

    data.finance.forEach(item => {
      const total = item.totalPrice || 0;
      totalEstimated += total;
      if (item.status === 'confirmado' || item.status === 'pago') {
        totalConfirmedOrPaid += total;
      } else {
        totalPendingOrPlanned += total;
      }
    });

    // Planned revenue from shirts
    const shirtRevenue = data.shirts.priceCategories.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerPerson), 0);
    // Planned revenue from trip
    const tripRevenue = (data.trip.estimatedPeople || 0) * (data.trip.plannedFeePerPerson || 0);
    const plannedRevenue = shirtRevenue + tripRevenue;

    const estimatedDifference = plannedRevenue - totalEstimated;

    return {
      totalEstimated,
      totalConfirmedOrPaid,
      totalPendingOrPlanned,
      plannedRevenue,
      estimatedDifference
    };
  }, [data.finance, data.shirts, data.trip]);

  const filteredItems = useMemo(() => {
    return data.finance.filter(item => {
      const matchSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.eventRelated && item.eventRelated.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.responsible && item.responsible.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchCategory = categoryFilter === 'todos' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'todos' || item.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [data.finance, searchTerm, categoryFilter, statusFilter]);

  const handleOpenAdd = () => {
    const newItem: RedeFinanceItem = {
      id: `fin-${Date.now()}`,
      item: '',
      category: 'Alimentação',
      eventRelated: 'Boas-vindas (06/02/2027)',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      responsible: 'Equipe',
      status: 'planejado',
      notes: ''
    };
    setEditingItem(newItem);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: RedeFinanceItem) => {
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.item.trim()) return;

    const calculatedTotal = (editingItem.quantity || 1) * (editingItem.unitPrice || 0);
    const finalItem: RedeFinanceItem = {
      ...editingItem,
      totalPrice: calculatedTotal
    };

    const exists = data.finance.some(f => f.id === finalItem.id);
    let updated = [];
    if (exists) {
      updated = data.finance.map(f => f.id === finalItem.id ? finalItem : f);
    } else {
      updated = [finalItem, ...data.finance];
    }

    onUpdateData({
      ...data,
      finance: updated
    });
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item orçamentário?')) {
      onUpdateData({
        ...data,
        finance: data.finance.filter(f => f.id !== id)
      });
    }
  };

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="text-teal-500" size={22} />
            <span>Orçamento do Projeto Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento financeiro exclusivo da Rede de Adolescentes (isolado do Controle Financeiro geral).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Novo Item Orçamentário</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Estimado Total</div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {formatBRL(metrics.totalEstimated)}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
            {data.finance.length} itens cadastrados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Valor Já Definido</div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatBRL(metrics.totalConfirmedOrPaid)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Confirmado ou pago</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Ainda Não Definido</div>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1">
            {formatBRL(metrics.totalPendingOrPlanned)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Estimativas a cotar</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Arrecadação Prevista</div>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {formatBRL(metrics.plannedRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Camisas + Passeio</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diferença Estimada</div>
          <div className={`text-lg font-black mt-1 ${metrics.estimatedDifference >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatBRL(metrics.estimatedDifference)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            {metrics.estimatedDifference >= 0 ? 'Saldo superavitário' : 'Necessita subsídio/oferta'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar item, evento ou responsável..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="todos">Todas Categorias</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="todos">Todos Status</option>
            <option value="planejado">Planejado</option>
            <option value="confirmado">Confirmado</option>
            <option value="pago">Pago</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item & Descrição</th>
                <th className="px-4 py-3.5">Categoria</th>
                <th className="px-4 py-3.5">Evento</th>
                <th className="px-3 py-3.5 text-center">Qtd</th>
                <th className="px-4 py-3.5 text-right">Unitário</th>
                <th className="px-4 py-3.5 text-right">Total</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                    <div>{item.item}</div>
                    {item.notes && <div className="text-[11px] text-slate-400 font-normal">{item.notes}</div>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60 font-semibold text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {item.eventRelated || 'Geral'}
                  </td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatBRL(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                    {formatBRL(item.totalPrice)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'pago' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : item.status === 'confirmado'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-teal-600 cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Nenhum item orçamentário encontrado. Clique em <strong>"Novo Item Orçamentário"</strong> para cadastrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingItem.item ? 'Editar Item Orçamentário' : 'Novo Item Orçamentário'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Item / Despesa *</label>
                <input
                  type="text"
                  value={editingItem.item}
                  onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
                  placeholder="Ex: Pipoca doce e salgada, Torta na cara, Ônibus..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as RedeFinanceCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Evento Relacionado</label>
                  <input
                    type="text"
                    value={editingItem.eventRelated || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, eventRelated: e.target.value })}
                    placeholder="Ex: Cinema, 1ª Gincana, Geral"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => {
                      const q = parseInt(e.target.value) || 1;
                      setEditingItem({ ...editingItem, quantity: q, totalPrice: q * (editingItem.unitPrice || 0) });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Valor Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.unitPrice}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value) || 0;
                      setEditingItem({ ...editingItem, unitPrice: p, totalPrice: (editingItem.quantity || 1) * p });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Valor Total (Auto)</label>
                  <div className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold">
                    {formatBRL((editingItem.quantity || 1) * (editingItem.unitPrice || 0))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editingItem.responsible || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, responsible: e.target.value })}
                    placeholder="Quem comprará ou fará a cotação"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="planejado">Planejado (Estimativa)</option>
                    <option value="confirmado">Confirmado (Valor fechado)</option>
                    <option value="pago">Pago (Efetivado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observações</label>
                <input
                  type="text"
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="Detalhes adicionais..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                disabled={!editingItem.item.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
