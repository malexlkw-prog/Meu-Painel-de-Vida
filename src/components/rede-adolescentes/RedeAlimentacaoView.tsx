import React, { useState, useMemo } from 'react';
import { 
  Pizza, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Coffee, 
  Utensils, 
  Layers, 
  DollarSign,
  UserCheck
} from 'lucide-react';
import { RedeAdolescentesData, MealPlanItem, MealCategory } from '../../types/redeAdolescentes';

interface RedeAlimentacaoViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeAlimentacaoView: React.FC<RedeAlimentacaoViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MealPlanItem | null>(null);

  const categories: MealCategory[] = ['Lanches', 'Bebidas', 'Doces', 'Salgados', 'Pipoca', 'Refeições', 'Outros'];

  const eventNames = useMemo(() => {
    const list = Array.from(new Set(data.meals.map(m => m.eventRelated)));
    return ['todos', ...list];
  }, [data.meals]);

  const totalMealCost = useMemo(() => {
    return data.meals.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  }, [data.meals]);

  const filteredMeals = useMemo(() => {
    return data.meals.filter(m => {
      const matchSearch = m.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.responsible && m.responsible.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchEvent = eventFilter === 'todos' || m.eventRelated === eventFilter;
      return matchSearch && matchEvent;
    });
  }, [data.meals, searchTerm, eventFilter]);

  const handleOpenAdd = () => {
    const newItem: MealPlanItem = {
      id: `meal-${Date.now()}`,
      item: '',
      category: 'Lanches',
      eventRelated: 'Sábados Normais',
      quantity: 1,
      unit: 'unidades',
      estimatedUnitCost: 0,
      totalCost: 0,
      responsible: 'Minha mãe / Equipe',
      notes: ''
    };
    setEditingItem(newItem);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MealPlanItem) => {
    setEditingItem({ ...m });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.item.trim()) return;

    const total = (editingItem.quantity || 1) * (editingItem.estimatedUnitCost || 0);
    const itemToSave: MealPlanItem = {
      ...editingItem,
      totalCost: total
    };

    const exists = data.meals.some(m => m.id === itemToSave.id);
    let updated = [];
    if (exists) {
      updated = data.meals.map(m => m.id === itemToSave.id ? itemToSave : m);
    } else {
      updated = [itemToSave, ...data.meals];
    }

    onUpdateData({
      ...data,
      meals: updated
    });
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Deseja excluir este item do planejamento de alimentação?')) {
      onUpdateData({
        ...data,
        meals: data.meals.filter(m => m.id !== id)
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
            <Pizza className="text-orange-500" size={22} />
            <span>Alimentação & Lanches da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento de cardápios, quantidades e orçamentos para encontros e eventos especiais.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Novo Item de Cardápio</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Total de Alimentação</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatBRL(totalMealCost)}
          </div>
          <div className="text-[11px] text-orange-500 font-semibold">
            {data.meals.length} itens planejados para o ano
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Responsáveis Principais</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            Minha mãe & Equipe de Apoio
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Acolhimento com carinho nos momentos de comunhão
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eventos Cobertos</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            Cinema, Vigília, Passeio e Confraternização
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Lanches semanais + ceias especiais
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
            placeholder="Buscar item alimentar..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {eventNames.map(evt => (
            <button
              key={evt}
              onClick={() => setEventFilter(evt)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                eventFilter === evt
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {evt === 'todos' ? 'Todos os Eventos' : evt}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Alimento / Item</th>
                <th className="px-4 py-3.5">Categoria</th>
                <th className="px-4 py-3.5">Evento Vinculado</th>
                <th className="px-4 py-3.5 text-center">Quantidade</th>
                <th className="px-4 py-3.5 text-right">Custo Unit.</th>
                <th className="px-4 py-3.5 text-right">Custo Total</th>
                <th className="px-4 py-3.5">Responsável</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMeals.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                    <div>{m.item}</div>
                    {m.notes && <div className="text-[11px] text-slate-400 font-normal">{m.notes}</div>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 font-semibold text-[10px]">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                    {m.eventRelated}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {m.quantity} {m.unit}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatBRL(m.estimatedUnitCost)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                    {formatBRL(m.totalCost)}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {m.responsible || 'Equipe'}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-orange-600 cursor-pointer"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(m.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
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
                {editingItem.item ? 'Editar Alimento' : 'Novo Alimento'}
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={editingItem.item}
                  onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value })}
                  placeholder="Ex: Pipoca doce, Refrigerante, Cachorro-quente..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MealCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Evento Relacionado</label>
                  <input
                    type="text"
                    value={editingItem.eventRelated}
                    onChange={(e) => setEditingItem({ ...editingItem, eventRelated: e.target.value })}
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
                      setEditingItem({ ...editingItem, quantity: q, totalCost: q * (editingItem.estimatedUnitCost || 0) });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unidade</label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    placeholder="Ex: pct, un, litros, kg"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.estimatedUnitCost}
                    onChange={(e) => {
                      const p = parseFloat(e.target.value) || 0;
                      setEditingItem({ ...editingItem, estimatedUnitCost: p, totalCost: (editingItem.quantity || 1) * p });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsável</label>
                <input
                  type="text"
                  value={editingItem.responsible || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, responsible: e.target.value })}
                  placeholder="Ex: Minha mãe, Lucas, Coordenação"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observações</label>
                <input
                  type="text"
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Cardápio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
