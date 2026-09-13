import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Tag,
  CheckSquare
} from 'lucide-react';
import { RedeAdolescentesData, MaterialItem } from '../../types/redeAdolescentes';

interface RedeMateriaisViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeMateriaisView: React.FC<RedeMateriaisViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'comprado' | 'pendente'>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialItem | null>(null);

  const totalEstimated = useMemo(() => {
    return data.materials.reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);
  }, [data.materials]);

  const totalPurchased = useMemo(() => {
    return data.materials.filter(m => m.purchased).reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);
  }, [data.materials]);

  const filteredMaterials = useMemo(() => {
    return data.materials.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.eventRelated && m.eventRelated.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = statusFilter === 'todos' ||
        (statusFilter === 'comprado' && m.purchased) ||
        (statusFilter === 'pendente' && !m.purchased);

      return matchSearch && matchStatus;
    });
  }, [data.materials, searchTerm, statusFilter]);

  const handleTogglePurchased = (id: string) => {
    const updated = data.materials.map(m => m.id === id ? { ...m, purchased: !m.purchased } : m);
    onUpdateData({ ...data, materials: updated });
  };

  const handleOpenAdd = () => {
    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: '',
      quantity: 1,
      category: 'Gincanas',
      eventRelated: '1ª Gincana (29/05/2027)',
      estimatedPrice: 0,
      purchased: false,
      notes: ''
    };
    setEditingItem(newItem);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MaterialItem) => {
    setEditingItem({ ...m });
    setModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.name.trim()) return;

    const exists = data.materials.some(m => m.id === editingItem.id);
    let updated = [];
    if (exists) {
      updated = data.materials.map(m => m.id === editingItem.id ? editingItem : m);
    } else {
      updated = [editingItem, ...data.materials];
    }

    onUpdateData({ ...data, materials: updated });
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Deseja excluir este material da lista?')) {
      onUpdateData({
        ...data,
        materials: data.materials.filter(m => m.id !== id)
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
            <Package className="text-slate-500" size={22} />
            <span>Materiais & Logística da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de itens para gincanas, dinâmicas de acolhimento, estudos bíblicos e premiações.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Novo Material</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total de Itens</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.materials.length} itens
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {data.materials.filter(m => m.purchased).length} já providenciados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Estimado dos Materiais</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatBRL(totalEstimated)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Estimativa geral de compras
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Já Adquirido / Providenciado</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatBRL(totalPurchased)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Materiais prontos no estoque
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar material..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${statusFilter === 'todos' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
          >
            Todos ({data.materials.length})
          </button>
          <button
            onClick={() => setStatusFilter('comprado')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${statusFilter === 'comprado' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
          >
            Comprados ({data.materials.filter(m => m.purchased).length})
          </button>
          <button
            onClick={() => setStatusFilter('pendente')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${statusFilter === 'pendente' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
          >
            Pendentes ({data.materials.filter(m => !m.purchased).length})
          </button>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMaterials.map(m => (
            <div 
              key={m.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                m.purchased ? 'bg-emerald-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <button
                  onClick={() => handleTogglePurchased(m.id)}
                  className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  title={m.purchased ? 'Marcar como pendente' : 'Marcar como comprado/providenciado'}
                >
                  {m.purchased ? (
                    <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold ${m.purchased ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {m.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {m.quantity} un
                    </span>
                    {m.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {m.category}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Evento: {m.eventRelated} {m.notes ? `• ${m.notes}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {formatBRL(m.estimatedPrice || 0)}
                  </div>
                  <span className={`text-[10px] font-semibold ${m.purchased ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {m.purchased ? 'Providenciado' : 'A comprar'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum material encontrado para este filtro.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingItem.name ? 'Editar Material' : 'Novo Material'}
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
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Ex: Pratos descartáveis, Buzina, Cartolina..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Gincanas, Acolhimento, Estudo"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preço Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.estimatedPrice || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, estimatedPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="purchased-check"
                  checked={editingItem.purchased}
                  onChange={(e) => setEditingItem({ ...editingItem, purchased: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="purchased-check" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Já adquirido / providenciado
                </label>
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
                disabled={!editingItem.name.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
