import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  Layers, 
  ChevronDown, 
  MoreVertical,
  Briefcase,
  Printer,
  FileSpreadsheet,
  PenTool,
  Cpu,
  Package,
  PlusCircle,
  Copy,
  Edit3,
  X,
  Settings
} from 'lucide-react';
import { FinanceTransaction } from '../types';

interface StationerySuiteProps {
  transactions: FinanceTransaction[];
  onAddTransaction: (type: 'income' | 'expense', description: string, amount: number, category: 'personal' | 'work' | 'stationery') => void;
  onDeleteTransaction: (id: string) => void;
  mode: 'papelaria' | 'sales';
}

interface MaterialItem {
  id: string;
  name: string;
  category: 'printing' | 'paper' | 'ink' | 'equipment' | 'stock';
  quantity: number;
  unit: string;
  minAlertQty: number;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

export default function StationerySuite({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  mode
}: StationerySuiteProps) {
  
  // Tabs within stationery based on the mode
  const [subView, setSubView] = useState<'logger' | 'calculator' | 'materials' | 'sales_history' | 'services'>(() => {
    return mode === 'papelaria' ? 'materials' : 'logger';
  });

  // Active category inside materials view
  const [activeMaterialCat, setActiveMaterialCat] = useState<'printing' | 'paper' | 'ink' | 'equipment' | 'stock'>('printing');

  // Sales Logger fields
  const [itemName, setItemName] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('Pix');

  // Pricing calculator fields
  const [costPrice, setCostPrice] = useState('');
  const [markupPercent, setMarkupPercent] = useState('50');

  // Services State (Persisted)
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('stationery_services');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Xerox Preto e Branco', price: 0.50 },
      { id: '2', name: 'Xerox Colorida', price: 1.50 },
      { id: '3', name: 'Impressão Simples', price: 1.00 },
      { id: '4', name: 'Segunda Via de Boleto', price: 2.00 },
      { id: '5', name: 'Encadernação Espiral', price: 5.00 },
      { id: '6', name: 'Plastificação A4', price: 4.00 }
    ];
  });

  // New service form state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Materials / Inventory State (persisted in localStorage for durability)
  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem('stationery_materials');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Impressão Colorida Jato de Tinta', category: 'printing', quantity: 1500, unit: 'folhas', minAlertQty: 100 },
      { id: '2', name: 'Impressão Preto e Branco Laser', category: 'printing', quantity: 5000, unit: 'folhas', minAlertQty: 300 },
      { id: '3', name: 'Papel Fotográfico Glossy A4 180g', category: 'paper', quantity: 50, unit: 'folhas', minAlertQty: 10 },
      { id: '4', name: 'Papel Offset 90g A4', category: 'paper', quantity: 500, unit: 'folhas', minAlertQty: 100 },
      { id: '5', name: 'Tinta Corante Amarela 100ml', category: 'ink', quantity: 2, unit: 'unidades', minAlertQty: 1 },
      { id: '6', name: 'Tinta Pigmentada Preta 100ml', category: 'ink', quantity: 3, unit: 'unidades', minAlertQty: 1 },
      { id: '7', name: 'Prensa Térmica Múltipla 5 em 1', category: 'equipment', quantity: 1, unit: 'unidade', minAlertQty: 1 },
      { id: '8', name: 'Impressora Epson L3250', category: 'equipment', quantity: 1, unit: 'unidade', minAlertQty: 1 },
      { id: '9', name: 'Bobina de Adesivo Vinil Transparente', category: 'stock', quantity: 5, unit: 'metros', minAlertQty: 2 },
      { id: '10', name: 'Envelopes Kraft Ofício', category: 'stock', quantity: 120, unit: 'unidades', minAlertQty: 20 }
    ];
  });

  // New material form state
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMatName, setNewMatName] = useState('');
  const [newMatCat, setNewMatCat] = useState<'printing' | 'paper' | 'ink' | 'equipment' | 'stock'>('printing');
  const [newMatQty, setNewMatQty] = useState('');
  const [newMatUnit, setNewMatUnit] = useState('unidades');
  const [newMatMin, setNewMatMin] = useState('');

  // Math/Calculations
  const calCost = parseFloat(costPrice) || 0;
  const calPercent = parseFloat(markupPercent) || 0;
  const recommendedPrice = calCost * (1 + calPercent / 100);
  const projectedProfit = recommendedPrice - calCost;

  // Filter stationery specific faturamento from history
  const stationerySales = transactions.filter(t => t.category === 'stationery' && t.type === 'income');
  const stationeryExpenses = transactions.filter(t => t.category === 'stationery' && t.type === 'expense');

  const totalSalesVolume = stationerySales.reduce((acc, t) => acc + t.amount, 0);
  const totalExpensesVolume = stationeryExpenses.reduce((acc, t) => acc + t.amount, 0);
  const netStationeryBalance = totalSalesVolume - totalExpensesVolume;

  const saveMaterials = (updated: MaterialItem[]) => {
    setMaterials(updated);
    localStorage.setItem('stationery_materials', JSON.stringify(updated));
  };

  const saveServices = (updated: ServiceItem[]) => {
    setServices(updated);
    localStorage.setItem('stationery_services', JSON.stringify(updated));
  };

  const handleLogSale = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(salePrice) || 0;
    const qtyNum = parseInt(quantity) || 1;
    const totalAmount = priceNum * qtyNum;

    if (!itemName || totalAmount <= 0) return;

    onAddTransaction(
      'income',
      `Venda de Papelaria: ${itemName} (Qtd: ${qtyNum}) [${paymentMethod}]`,
      totalAmount,
      'stationery'
    );

    setItemName('');
    setSalePrice('');
    setQuantity('1');
    alert('Venda registrada com sucesso!');
  };

  const handleLogQuickServiceSale = (service: ServiceItem) => {
    const qtyInput = prompt(`Quantidade de "${service.name}" a registrar venda:`, '1');
    if (qtyInput === null) return;
    const qtyNum = parseInt(qtyInput) || 1;
    const totalAmount = service.price * qtyNum;

    onAddTransaction(
      'income',
      `Venda de Serviço: ${service.name} (Qtd: ${qtyNum}) [Pix]`,
      totalAmount,
      'stationery'
    );
    alert(`Venda registrada: ${qtyNum}x ${service.name} no valor total de R$ ${totalAmount.toFixed(2)}`);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) return;

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      price: parseFloat(newServicePrice) || 0
    };

    const updated = [...services, newService];
    saveServices(updated);

    setNewServiceName('');
    setNewServicePrice('');
    setShowAddService(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      const updated = services.filter(s => s.id !== id);
      saveServices(updated);
    }
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim() || !newMatQty) return;

    const newMaterial: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: newMatName.trim(),
      category: newMatCat,
      quantity: parseFloat(newMatQty) || 0,
      unit: newMatUnit,
      minAlertQty: parseFloat(newMatMin) || 0
    };

    const updated = [...materials, newMaterial];
    saveMaterials(updated);

    setNewMatName('');
    setNewMatQty('');
    setNewMatMin('');
    setShowAddMaterial(false);
  };

  const handleAdjustQty = (id: string, diff: number) => {
    const updated = materials.map(m => {
      if (m.id === id) {
        return { ...m, quantity: Math.max(0, m.quantity + diff) };
      }
      return m;
    });
    saveMaterials(updated);
  };

  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    saveMaterials(updated);
  };

  // Material categories details
  const matCategories = [
    { value: 'printing', label: 'Impressão', emoji: '🖨️', icon: Printer },
    { value: 'paper', label: 'Papéis', emoji: '📄', icon: FileSpreadsheet },
    { value: 'ink', label: 'Tintas', emoji: '🖋️', icon: PenTool },
    { value: 'equipment', label: 'Equipamentos', emoji: '🧾', icon: Cpu },
    { value: 'stock', label: 'Estoque / Outros', emoji: '📦', icon: Package }
  ] as const;

  const currentCategoryObj = matCategories.find(c => c.value === activeMaterialCat)!;

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Tab Navigation header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-black tracking-tight text-slate-850 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500">
              <Package size={18} />
            </span>
            {mode === 'papelaria' ? 'Papelaria' : 'Vendas da Papelaria'}
          </h2>
        </div>

        {/* Tab Controls based on Mode */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border dark:border-slate-800 font-sans text-xs font-bold w-full md:w-auto overflow-x-auto no-scrollbar">
          {mode === 'papelaria' ? (
            <>
              <button 
                onClick={() => setSubView('materials')}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${subView === 'materials' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Estoque / Materiais
              </button>
              <button 
                onClick={() => setSubView('services')}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${subView === 'services' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Serviços
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setSubView('logger')}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${subView === 'logger' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Registrar Vendas
              </button>
              <button 
                onClick={() => setSubView('calculator')}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${subView === 'calculator' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Markup Lucro
              </button>
              <button 
                onClick={() => setSubView('sales_history')}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${subView === 'sales_history' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Histórico contábil
              </button>
            </>
          )}
        </div>
      </div>

      {/* RENDER Services View (Only for Papelaria mode) */}
      {mode === 'papelaria' && subView === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Meus Serviços de Papelaria
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                Adicione ou gerencie os serviços que você oferece (xerox, emissão de boletos, encadernações, etc).
              </p>
            </div>

            <button
              onClick={() => setShowAddService(!showAddService)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              {showAddService ? <X size={14} /> : <PlusCircle size={14} />}
              {showAddService ? 'Cancelar' : 'Novo Serviço'}
            </button>
          </div>

          {/* Add Service Drawer */}
          {showAddService && (
            <form onSubmit={handleAddServiceSubmit} className="bg-slate-50 dark:bg-slate-950/30 border dark:border-slate-800 rounded-3xl p-5 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-black uppercase text-slate-550">Adicionar Novo Tipo de Serviço</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Nome do Serviço / Atividade</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Xerox Preto e Branco, Emissão de Boleto, etc."
                    value={newServiceName}
                    onChange={e => setNewServiceName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Preço / Valor Cobrado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 0.50, 2.00, etc."
                    value={newServicePrice}
                    onChange={e => setNewServicePrice(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  Confirmar Serviço
                </button>
              </div>
            </form>
          )}

          {/* List of Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4.5 rounded-2xl flex flex-col justify-between shadow-3xs hover-scale">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-left">
                    <h4 className="text-xs font-black text-slate-800 dark:text-white tracking-tight">{s.name}</h4>
                    <p className="text-sm font-black text-amber-500 font-mono mt-1">R$ {s.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteService(s.id)}
                    className="p-1.5 text-slate-450 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleLogQuickServiceSale(s)}
                  className="mt-4 bg-slate-50 hover:bg-amber-500 dark:bg-slate-950/40 dark:hover:bg-amber-500 text-slate-600 hover:text-white dark:text-slate-350 dark:hover:text-white text-[10px] font-black uppercase tracking-wider py-2 rounded-xl transition-all border dark:border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <DollarSign size={11} /> Registrar Venda Rápida
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER Logger View */}
      {mode === 'sales' && subView === 'logger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Logger Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Registrar Venda Rápida
            </h3>
            
            <form onSubmit={handleLogSale} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Selecionar Produto / Serviço</label>
                <select
                  value={services.find(s => s.name === itemName)?.id || ''}
                  onChange={(e) => {
                    const selectedSrv = services.find(s => s.id === e.target.value);
                    if (selectedSrv) {
                      setItemName(selectedSrv.name);
                      setSalePrice(selectedSrv.price.toString());
                    } else {
                      setItemName('');
                      setSalePrice('');
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  required
                >
                  <option value="">-- Escolha um produto da Papelaria de Serviços --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} - R$ {s.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preço Unitário (R$)</label>
                  <div className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold select-none cursor-not-allowed">
                    {salePrice ? `R$ ${parseFloat(salePrice).toFixed(2)}` : 'Nenhum selecionado'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quantidade</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Forma de Recebimento</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                >
                  <option value="Pix">Pix (Instantâneo)</option>
                  <option value="Dinheiro">Dinheiro vivo</option>
                  <option value="Cartão">Cartão de Débito/Crédito</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <Plus size={15} /> Registrar Entrada de Caixa
              </button>
            </form>
          </div>

          {/* Side metrics card */}
          <div className="bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs space-y-4 h-fit text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Resumo de Caixa</h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">Faturamento Total</span>
                <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">R$ {totalSalesVolume.toFixed(2)}</p>
              </div>

              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-rose-600 block tracking-wider">Custos / Despesas</span>
                <p className="text-xl font-black font-mono text-rose-600 mt-1">R$ {totalExpensesVolume.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/25 border rounded-2xl text-xs space-y-2.5 font-bold">
              <div className="flex justify-between items-center text-slate-500">
                <span>Vendas Realizadas</span>
                <span className="text-slate-800 dark:text-white font-mono">{stationerySales.length} registros</span>
              </div>
              <div className="border-t dark:border-slate-800 pt-2 flex justify-between items-center font-black">
                <span className="text-slate-600 dark:text-slate-300">Margem Líquida</span>
                <span className={netStationeryBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                  R$ {netStationeryBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER Materials View - CATEGORIZED CLEARLY */}
      {mode === 'papelaria' && subView === 'materials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
            {/* Visual categories tabs for materials */}
            <div className="flex bg-slate-50 dark:bg-slate-950/25 border dark:border-slate-800 rounded-2xl p-1 gap-1 text-[11px] font-bold w-full sm:w-auto overflow-x-auto no-scrollbar">
              {matCategories.map(cat => {
                const isActive = cat.value === activeMaterialCat;
                const count = materials.filter(m => m.category === cat.value).length;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveMaterialCat(cat.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                      isActive 
                        ? 'bg-amber-500 text-white font-extrabold shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddMaterial(!showAddMaterial)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              {showAddMaterial ? <X size={14} /> : <PlusCircle size={14} />}
              {showAddMaterial ? 'Cancelar' : 'Cadastrar Material'}
            </button>
          </div>

          {/* Add Material Drawer */}
          {showAddMaterial && (
            <form onSubmit={handleAddMaterialSubmit} className="bg-slate-50 dark:bg-slate-950/30 border dark:border-slate-800 rounded-3xl p-5 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-black uppercase text-slate-550">Cadastrar Novo Insumo / Material</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Nome do Material</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Papel Glossy, Canetas Esferográficas..."
                    value={newMatName}
                    onChange={e => setNewMatName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Categoria</label>
                  <select
                    value={newMatCat}
                    onChange={e => setNewMatCat(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white"
                  >
                    {matCategories.map(c => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Quantidade em Estoque</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newMatQty}
                    onChange={e => setNewMatQty(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Unidade (ex: fls, unid, m)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: folhas, rolos, ml"
                    value={newMatUnit}
                    onChange={e => setNewMatUnit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400">Alerta de Estoque Baixo</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50"
                    value={newMatMin}
                    onChange={e => setNewMatMin(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-bold focus:outline-none dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          )}

          {/* List of Materials inside active category */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl overflow-hidden shadow-3xs">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-950/10 border-b flex justify-between items-center text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <span>Materiais Registrados — {currentCategoryObj.label}</span>
              <span>Quantidades</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {materials.filter(m => m.category === activeMaterialCat).length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 italic">
                  Nenhum material cadastrado nesta categoria de insumos.
                </div>
              ) : (
                materials.filter(m => m.category === activeMaterialCat).map(m => {
                  const isLow = m.quantity <= m.minAlertQty;
                  
                  return (
                    <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{m.name}</span>
                          {isLow && (
                            <span className="px-1.5 py-0.2 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-500 text-[8px] font-black uppercase tracking-wider">
                              Estoque Baixo!
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Unidade: {m.unit} • Mín: {m.minAlertQty}</span>
                      </div>

                      {/* Interactive inventory updater */}
                      <div className="flex items-center gap-4 self-end sm:self-center font-mono">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/20 p-1 rounded-xl border dark:border-slate-800 text-xs font-bold">
                          <button 
                            onClick={() => handleAdjustQty(m.id, -10)}
                            className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] text-slate-400 hover:text-slate-800"
                          >
                            -10
                          </button>
                          <button 
                            onClick={() => handleAdjustQty(m.id, -1)}
                            className="px-1.5 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] text-slate-400 hover:text-slate-800"
                          >
                            -1
                          </button>
                          <span className={`px-3 text-xs font-black ${isLow ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
                            {m.quantity} {m.unit}
                          </span>
                          <button 
                            onClick={() => handleAdjustQty(m.id, 1)}
                            className="px-1.5 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] text-slate-450 hover:text-slate-800"
                          >
                            +1
                          </button>
                          <button 
                            onClick={() => handleAdjustQty(m.id, 10)}
                            className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] text-slate-450 hover:text-slate-800"
                          >
                            +10
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteMaterial(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER Markup Calculator */}
      {mode === 'sales' && subView === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Calculadora de Markup
            </h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
              Descubra o preço sugerido de venda de seus cadernos, capas, chaveiros ou impressões adicionando uma margem ideal.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preço de Custo (Insumos) (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Ex: 0.50 (Sulfite + tinta)" 
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Margem de Lucro Desejada (%)</label>
                <input 
                  type="number" 
                  placeholder="100" 
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Results calculation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl shadow-3xs space-y-4 flex flex-col justify-between h-full text-left">
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Calculator size={13} className="text-amber-500" /> Resultados do Markup
              </h4>
              
              <div className="space-y-2.5 text-xs font-bold text-slate-500">
                <div className="flex justify-between border-b dark:border-slate-800 pb-2">
                  <span>Custo Unitário</span>
                  <span className="font-mono text-slate-800 dark:text-white">R$ {calCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b dark:border-slate-800 pb-2">
                  <span>Margem Aplicada</span>
                  <span className="font-mono text-indigo-500">+{calPercent}%</span>
                </div>
                <div className="flex justify-between border-b dark:border-slate-800 pb-2 pt-1 font-black text-slate-800 dark:text-white">
                  <span>Preço Sugerido</span>
                  <span className="font-mono text-emerald-500 text-sm">R$ {recommendedPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold pt-1">
                  <span>Lucro Unitário</span>
                  <span className="font-mono text-emerald-500">R$ {projectedProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {recommendedPrice > 0 && (
              <button 
                onClick={() => {
                  setItemName('Produto Markup');
                  setSalePrice(recommendedPrice.toFixed(2));
                  setSubView('logger');
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2.5 rounded-xl text-center shadow transition-all block mt-4 cursor-pointer"
              >
                Copiar Preço para o Logger
              </button>
            )}
          </div>
        </div>
      )}

      {/* RENDER Contábil Sales History */}
      {mode === 'sales' && subView === 'sales_history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-3xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Histórico Contábil — Papelaria
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono px-2.5 py-1 rounded-xl font-bold">
              {stationerySales.length + stationeryExpenses.length} Lançamentos
            </span>
          </div>

          {[...stationerySales, ...stationeryExpenses].length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              Nenhuma movimentação da Papelaria encontrada no caixa contábil.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...stationerySales, ...stationeryExpenses]
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(t => (
                  <div key={t.id} className="p-3.5 bg-slate-50/65 dark:bg-slate-950/15 hover:bg-slate-50 dark:hover:bg-slate-950/25 rounded-2xl flex justify-between items-center text-xs font-bold border dark:border-slate-800/80 transition-all">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <div className="text-left space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-white">{t.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{t.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-550'}`}>
                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
