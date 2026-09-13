import React, { useState, useMemo } from 'react';
import { 
  Shirt, 
  Edit3, 
  Plus, 
  Trash2, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  Layers, 
  Calendar,
  Truck
} from 'lucide-react';
import { RedeAdolescentesData, ShirtPlan, ShirtPriceCategory } from '../../types/redeAdolescentes';

interface RedeCamisasViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeCamisasView: React.FC<RedeCamisasViewProps> = ({ data, onUpdateData }) => {
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [specsForm, setSpecsForm] = useState<ShirtPlan>(data.shirts);

  // Calculations
  const productionCost = useMemo(() => {
    const rawShirtsCost = (data.shirts.estimatedQuantity || 0) * (data.shirts.unitCost || 0);
    const shipping = data.shirts.shippingCost || 0;
    const extra = data.shirts.otherCosts || 0;
    return rawShirtsCost + shipping + extra;
  }, [data.shirts]);

  const plannedRevenue = useMemo(() => {
    return data.shirts.priceCategories.reduce((acc, curr) => acc + (curr.quantity * curr.pricePerPerson), 0);
  }, [data.shirts.priceCategories]);

  const totalShirtsAllocated = useMemo(() => {
    return data.shirts.priceCategories.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [data.shirts.priceCategories]);

  const balance = plannedRevenue - productionCost;

  const handleSaveSpecs = () => {
    onUpdateData({
      ...data,
      shirts: {
        ...data.shirts,
        model: specsForm.model,
        color: specsForm.color,
        printDetails: specsForm.printDetails,
        supplier: specsForm.supplier,
        estimatedQuantity: specsForm.estimatedQuantity,
        unitCost: specsForm.unitCost,
        shippingCost: specsForm.shippingCost,
        otherCosts: specsForm.otherCosts,
        deadline: specsForm.deadline,
        notes: specsForm.notes
      }
    });
    setIsEditingSpecs(false);
  };

  const handleUpdateCategory = (catName: string, field: 'quantity' | 'pricePerPerson', val: number) => {
    const updated = data.shirts.priceCategories.map(c => {
      if (c.category !== catName) return c;
      const updatedCat = { ...c, [field]: val };
      updatedCat.totalCategory = updatedCat.quantity * updatedCat.pricePerPerson;
      return updatedCat;
    });

    onUpdateData({
      ...data,
      shirts: {
        ...data.shirts,
        priceCategories: updated
      }
    });
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
            <Shirt className="text-indigo-500" size={22} />
            <span>Camisas da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento de modelo, orçamento de confecção e política de subsídios por categoria.
          </p>
        </div>

        <button
          onClick={() => {
            setSpecsForm(data.shirts);
            setIsEditingSpecs(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Edit3 size={15} />
          <span>Editar Especificações & Custo</span>
        </button>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Total de Produção</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatBRL(productionCost)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {data.shirts.estimatedQuantity} unidades × {formatBRL(data.shirts.unitCost)} + frete
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Arrecadação Prevista</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatBRL(plannedRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {totalShirtsAllocated} camisas distribuídas por valor
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Balanço do Projeto</span>
          <div className={`text-2xl font-black font-mono ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatBRL(balance)}
          </div>
          <div className="text-[11px] font-semibold">
            {balance >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} /> Custo 100% coberto pelas vendas
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1">
                <AlertCircle size={12} /> Exige subsídio da igreja: {formatBRL(Math.abs(balance))}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Prazo de Confecção</span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {data.shirts.deadline || 'A definir'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Distribuição planejada no 1º Encontro
          </div>
        </div>
      </div>

      {/* Specifications Details Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Shirt size={16} className="text-indigo-500" /> Especificações do Modelo Oficial
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modelo & Tecido</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{data.shirts.model}</p>
            <p className="text-xs text-slate-400">Cor predominante: <strong className="text-slate-700 dark:text-slate-300">{data.shirts.color}</strong></p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estampa & Tema</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{data.shirts.printDetails}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fornecedor / Gráfica</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{data.shirts.supplier || 'Em cotação'}</p>
            <p className="text-xs text-slate-400">
              Frete: {formatBRL(data.shirts.shippingCost || 0)} • Outros: {formatBRL(data.shirts.otherCosts || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Distribution by Category Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Distribuição de Preço por Categoria & Subsídios
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Defina o valor a cobrar para adolescentes, líderes, convidados e subsídio da igreja.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-center">Quantidade</th>
                <th className="px-4 py-3 text-right">Preço por Pessoa</th>
                <th className="px-4 py-3 text-right">Subtotal Previsto</th>
                <th className="px-4 py-3">Política / Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.shirts.priceCategories.map(cat => (
                <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{cat.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      value={cat.quantity}
                      onChange={(e) => handleUpdateCategory(cat.category, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-16 p-1 rounded-lg text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-400">R$</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={cat.pricePerPerson}
                        onChange={(e) => handleUpdateCategory(cat.category, 'pricePerPerson', parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 rounded-lg text-right font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-black text-slate-900 dark:text-white">
                    {formatBRL(cat.quantity * cat.pricePerPerson)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 italic">
                    {cat.category.includes('Igreja') ? 'Totalmente subsidiado pela congregação' : 'Cobrança direta ou cota'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Specs Modal */}
      {isEditingSpecs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Editar Especificações das Camisas
              </h3>
              <button
                onClick={() => setIsEditingSpecs(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Modelo / Tipo</label>
                  <input
                    type="text"
                    value={specsForm.model}
                    onChange={(e) => setSpecsForm({ ...specsForm, model: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cor</label>
                  <input
                    type="text"
                    value={specsForm.color}
                    onChange={(e) => setSpecsForm({ ...specsForm, color: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Detalhes da Estampa</label>
                <textarea
                  rows={2}
                  value={specsForm.printDetails}
                  onChange={(e) => setSpecsForm({ ...specsForm, printDetails: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fornecedor / Gráfica</label>
                  <input
                    type="text"
                    value={specsForm.supplier || ''}
                    onChange={(e) => setSpecsForm({ ...specsForm, supplier: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Prazo de Entrega</label>
                  <input
                    type="text"
                    value={specsForm.deadline || ''}
                    onChange={(e) => setSpecsForm({ ...specsForm, deadline: e.target.value })}
                    placeholder="Ex: 20/01/2027"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qtd Total Estimada</label>
                  <input
                    type="number"
                    min="1"
                    value={specsForm.estimatedQuantity}
                    onChange={(e) => setSpecsForm({ ...specsForm, estimatedQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={specsForm.unitCost}
                    onChange={(e) => setSpecsForm({ ...specsForm, unitCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Frete / Extras (R$)</label>
                  <input
                    type="number"
                    step="1"
                    value={specsForm.shippingCost}
                    onChange={(e) => setSpecsForm({ ...specsForm, shippingCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsEditingSpecs(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSpecs}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
              >
                Salvar Especificações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
