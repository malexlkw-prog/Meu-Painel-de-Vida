import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Plus, 
  Tag, 
  DollarSign, 
  Search,
  Filter,
  Layers,
  X,
  MoreVertical,
  Minus,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  Eye,
  ExternalLink,
  Upload
} from 'lucide-react';
import { ShoppingItem } from '../types';

interface ShoppingListSectionProps {
  shoppingList: ShoppingItem[];
  onAdd: (item: Omit<ShoppingItem, 'id' | 'bought'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
}

interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
}

export default function ShoppingListSection({ 
  shoppingList, 
  onAdd, 
  onToggle, 
  onDelete, 
  onEdit 
}: ShoppingListSectionProps) {
  // Custom categories with emoji support persisted in localStorage
  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('custom_shopping_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      { id: 'clothing', name: 'Roupas', emoji: '👕' },
      { id: 'stationery', name: 'Papelaria', emoji: '🏪' },
      { id: 'others', name: 'Geral', emoji: '🛍️' },
      { id: 'tech', name: 'Tecnologia', emoji: '💻' },
      { id: 'books', name: 'Livros', emoji: '📚' }
    ];
  });

  // UI States
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('clothing');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeItemMenuId, setActiveItemMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>('');

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'buy' | 'bought' | 'postponed'>('all');

  // Form State
  const [name, setName] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [category, setCategory] = useState('clothing');
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<'buy' | 'bought' | 'postponed'>('buy');

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📦');

  // Save categories helper
  const saveCategories = (updatedCats: CustomCategory[]) => {
    setCategories(updatedCats);
    localStorage.setItem('custom_shopping_categories', JSON.stringify(updatedCats));
  };

  // Add Custom Category handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newId = `cat-${Date.now()}`;
    const updated = [
      ...categories,
      { id: newId, name: newCatName.trim(), emoji: newCatEmoji }
    ];
    saveCategories(updated);
    setActiveCategoryTab(newId);
    setNewCatName('');
    setNewCatEmoji('📦');
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (catId: string) => {
    // Avoid deleting essential categories if they are needed, or allow it but check if items exist
    const hasItems = shoppingList.some(item => item.category === catId);
    if (hasItems) {
      alert('Esta categoria contém produtos cadastrados e não pode ser excluída.');
      return;
    }
    const updated = categories.filter(c => c.id !== catId);
    saveCategories(updated);
    if (activeCategoryTab === catId && updated.length > 0) {
      setActiveCategoryTab(updated[0].id);
    }
  };

  // Item Form handlers
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(estimatedPrice) || 0;

    if (editingItem) {
      onEdit({
        ...editingItem,
        name: name.trim(),
        estimatedPrice: parsedPrice,
        category,
        imageUrl: imageUrl.trim() || undefined,
        size: size.trim() || undefined,
        quantity,
        priority,
        status,
        bought: status === 'bought'
      });
      setEditingItem(null);
    } else {
      onAdd({
        name: name.trim(),
        estimatedPrice: parsedPrice,
        category,
        imageUrl: imageUrl.trim() || undefined,
        size: size.trim() || undefined,
        quantity,
        priority,
        status
      });
    }

    // Reset Form & Close
    setName('');
    setEstimatedPrice('');
    setImageUrl('');
    setSize('');
    setQuantity(1);
    setPriority('medium');
    setStatus('buy');
    setShowAddModal(false);
  };

  const startAddProduct = () => {
    setEditingItem(null);
    setName('');
    setEstimatedPrice('');
    setCategory(activeCategoryTab);
    setImageUrl('');
    setSize('');
    setQuantity(1);
    setPriority('medium');
    setStatus('buy');
    setShowAddModal(true);
  };

  const startEditProduct = (item: ShoppingItem) => {
    setEditingItem(item);
    setName(item.name);
    setEstimatedPrice(item.estimatedPrice ? item.estimatedPrice.toString() : '');
    setCategory(item.category || 'others');
    setImageUrl(item.imageUrl || '');
    setSize(item.size || '');
    setQuantity(item.quantity || 1);
    setPriority(item.priority || 'medium');
    setStatus(item.status || (item.bought ? 'bought' : 'buy'));
    setShowAddModal(true);
    setActiveItemMenuId(null);
  };

  const handleQuickStatusChange = (item: ShoppingItem, newStatus: 'buy' | 'bought' | 'postponed') => {
    onEdit({
      ...item,
      status: newStatus,
      bought: newStatus === 'bought'
    });
    setActiveItemMenuId(null);
  };

  const handleQuickQuantityChange = (item: ShoppingItem, diff: number) => {
    const currentQ = item.quantity || 1;
    const newQ = Math.max(1, currentQ + diff);
    if (newQ === currentQ) return;
    onEdit({
      ...item,
      quantity: newQ
    });
  };

  const handleMoveCategory = (item: ShoppingItem, destCatId: string) => {
    onEdit({
      ...item,
      category: destCatId
    });
    setActiveItemMenuId(null);
  };

  // Get active category details
  const activeCategory = categories.find(c => c.id === activeCategoryTab) || categories[0];

  // Filter items
  const filteredItems = shoppingList.filter(item => {
    // backward compat fallback
    const itemCat = item.category || 'others';
    const matchesCategory = itemCat === activeCategoryTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemPriority = item.priority || 'medium';
    const matchesPriority = filterPriority === 'all' || itemPriority === filterPriority;

    const itemStatus = item.status || (item.bought ? 'bought' : 'buy');
    const matchesStatus = filterStatus === 'all' || itemStatus === filterStatus;

    return matchesCategory && matchesSearch && matchesPriority && matchesStatus;
  });

  // Math/Costs
  const costToBuy = filteredItems
    .filter(i => (i.status || (i.bought ? 'bought' : 'buy')) !== 'bought')
    .reduce((sum, i) => sum + ((i.estimatedPrice || 0) * (i.quantity || 1)), 0);

  const costBought = filteredItems
    .filter(i => (i.status || (i.bought ? 'bought' : 'buy')) === 'bought')
    .reduce((sum, i) => sum + ((i.estimatedPrice || 0) * (i.quantity || 1)), 0);

  const totalFilteredCost = costToBuy + costBought;

  return (
    <div className="space-y-6 text-left">
      {/* Header card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500">
              <ShoppingBag size={18} />
            </span>
            Lista de Compras
          </h2>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 md:flex-none border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1.5"
          >
            <Tag size={13} /> Categorias
          </button>
          <button
            onClick={startAddProduct}
            className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-3xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus size={14} /> Adicionar Produto
          </button>
        </div>
      </div>

      {/* Horizontal Custom Categories Bar - SEPARATED VISUALLY */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 font-sans no-scrollbar">
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryTab;
          const count = shoppingList.filter(item => (item.category || 'others') === cat.id).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer shadow-3xs border ${
                isActive 
                  ? 'bg-rose-600 border-rose-600 text-white font-extrabold' 
                  : 'bg-white border-slate-150 dark:border-slate-800/80 text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats Summary Panel for active category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-3xs">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Restante (A Comprar)</span>
            <span className="text-base font-black font-mono text-rose-600 mt-1 block">R$ {costToBuy.toFixed(2)}</span>
          </div>
          <span className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl"><Clock size={16} /></span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-3xs">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Já Adquirido</span>
            <span className="text-base font-black font-mono text-emerald-600 mt-1 block">R$ {costBought.toFixed(2)}</span>
          </div>
          <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl"><Check size={16} /></span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-3xs">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Total Estimado</span>
            <span className="text-base font-black font-mono text-slate-700 dark:text-stone-300 mt-1 block">R$ {totalFilteredCost.toFixed(2)}</span>
          </div>
          <span className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl"><ShoppingBag size={16} /></span>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-3xl shadow-3xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <span className="absolute left-3 top-2.5 text-slate-400"><Search size={14} /></span>
          <input
            type="text"
            placeholder="Buscar produtos nesta categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-2.5 pl-9 text-xs focus:outline-none dark:text-white font-bold"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as any)}
            className="flex-1 md:flex-initial bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none dark:text-white font-bold"
          >
            <option value="all">Prioridades (Todas)</option>
            <option value="high">🔴 Alta</option>
            <option value="medium">🟡 Média</option>
            <option value="low">🔵 Baixa</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="flex-1 md:flex-initial bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none dark:text-white font-bold"
          >
            <option value="all">Status (Todos)</option>
            <option value="buy">⏳ Comprar</option>
            <option value="bought">✅ Comprado</option>
            <option value="postponed">💤 Adiado</option>
          </select>
        </div>
      </div>

      {/* Products list - SEPARATED VISUALLY, grouped by Status (Buy, Postponed, Bought) */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-12 text-center rounded-3xl text-slate-400 italic text-xs font-bold shadow-3xs">
            Nenhum produto encontrado nesta categoria com as opções de filtragem selecionadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const isMenuOpen = activeItemMenuId === item.id;
              const itemStatus = item.status || (item.bought ? 'bought' : 'buy');
              const itemPriority = item.priority || 'medium';
              const itemQty = item.quantity || 1;
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2.5xl p-4 shadow-3xs flex justify-between items-center gap-3 transition-all relative group ${
                    itemStatus === 'bought' ? 'opacity-70 bg-slate-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Optional Image */}
                    {item.imageUrl ? (
                      <button
                        onClick={() => {
                          setSelectedImageUrl(item.imageUrl || null);
                          setSelectedItemName(item.name);
                        }}
                        title="Ver imagem em destaque"
                        className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 group/img hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-3xs ring-2 ring-transparent hover:ring-rose-500/20 dark:hover:ring-rose-500/30"
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Eye size={14} className="text-white drop-shadow-sm" />
                        </div>
                      </button>
                    ) : (
                      <div className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center border font-bold text-base transition-colors ${
                        itemStatus === 'bought' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-500'
                      }`}>
                        {activeCategory.emoji}
                      </div>
                    )}

                    {/* Text Details */}
                    <div className="text-left min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-black text-xs text-slate-800 dark:text-slate-100 truncate ${itemStatus === 'bought' ? 'line-through opacity-60' : ''}`}>
                          {item.name}
                        </span>
                        {item.size && (
                          <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[9px] font-bold">
                            Tam: {item.size}
                          </span>
                        )}
                        {/* Priority Badge */}
                        <span className={`px-1.5 py-0.2 rounded-md font-sans text-[9px] font-bold uppercase ${
                          itemPriority === 'high' 
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' 
                            : itemPriority === 'medium'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                        }`}>
                          {itemPriority === 'high' ? 'Alta' : itemPriority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
                        <span className="text-slate-700 dark:text-slate-300">
                          R$ {item.estimatedPrice.toFixed(2)}
                        </span>
                        <span className="text-slate-350">•</span>
                        {/* Interactive satisfying quantity control */}
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/30 p-0.5 rounded-lg border dark:border-slate-800 font-mono">
                          <button 
                            onClick={() => handleQuickQuantityChange(item, -1)}
                            className="p-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-500"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-1 text-slate-800 dark:text-white text-[10px] font-black">{itemQty}x</span>
                          <button 
                            onClick={() => handleQuickQuantityChange(item, 1)}
                            className="p-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-500"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge clickable for quick rotation */}
                    <button
                      onClick={() => {
                        const nextStatus: Record<string, 'buy' | 'bought' | 'postponed'> = {
                          buy: 'bought',
                          bought: 'postponed',
                          postponed: 'buy'
                        };
                        handleQuickStatusChange(item, nextStatus[itemStatus]);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        itemStatus === 'bought'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : itemStatus === 'postponed'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                            : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500'
                      }`}
                    >
                      {itemStatus === 'bought' ? 'Comprado' : itemStatus === 'postponed' ? 'Adiado' : 'Comprar'}
                    </button>

                    {/* Ellipsis Menu ⋮ for Context Actions */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItemMenuId(isMenuOpen ? null : item.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Box */}
                      <AnimatePresence>
                        {isMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveItemMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-lg py-1.5 z-20 text-xs text-left font-sans font-bold"
                            >
                              <button
                                onClick={() => startEditProduct(item)}
                                className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2 font-bold cursor-pointer"
                              >
                                <Edit3 size={13} className="text-indigo-500" />
                                Editar Produto
                              </button>

                              {/* Quick status selection */}
                              <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                              <div className="px-3 py-1 text-[9px] uppercase font-black text-slate-400 tracking-wider">Alterar Status</div>
                              <button
                                onClick={() => handleQuickStatusChange(item, 'buy')}
                                className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 ${itemStatus === 'buy' ? 'text-indigo-500 bg-indigo-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                              >
                                ⏳ Para Comprar
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(item, 'bought')}
                                className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 ${itemStatus === 'bought' ? 'text-emerald-500 bg-emerald-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                              >
                                ✅ Já Comprado
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(item, 'postponed')}
                                className={`w-full px-3 py-1.5 text-left flex items-center gap-1.5 ${itemStatus === 'postponed' ? 'text-amber-500 bg-amber-500/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                              >
                                💤 Adiado
                              </button>

                              {/* Move category list */}
                              <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                              <div className="px-3 py-1 text-[9px] uppercase font-black text-slate-400 tracking-wider">Mover para Lista</div>
                              {categories.filter(c => c.id !== (item.category || 'others')).map(c => (
                                <button
                                  key={c.id}
                                  onClick={() => handleMoveCategory(item, c.id)}
                                  className="w-full px-3 py-1.5 text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1.5 font-semibold"
                                >
                                  <span>{c.emoji}</span> {c.name}
                                </button>
                              ))}

                              <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                              <button
                                onClick={() => {
                                  onDelete(item.id);
                                  setActiveItemMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 font-bold cursor-pointer"
                              >
                                <Trash2 size={13} />
                                Excluir Produto
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
          </div>
        )}
      </div>

      {/* CATEGORIES MANAGEMENT MODAL */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-xl relative z-20 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  🏷️ Gerenciar Categorias
                </h3>
                <button onClick={() => setShowCategoryModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Categories list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(c => {
                  const count = shoppingList.filter(item => (item.category || 'others') === c.id).length;
                  
                  return (
                    <div key={c.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/25 border dark:border-slate-800/80 rounded-xl">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-white">
                        <span className="text-base">{c.emoji}</span>
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({count} itens)</span>
                      </div>
                      
                      {/* Only allow deleting if count is 0 */}
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        disabled={count > 0}
                        className={`p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:hover:bg-transparent`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Form to add Category */}
              <form onSubmit={handleAddCategory} className="space-y-3 pt-3 border-t dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Criar Nova Categoria</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-400 text-center">Emoji</label>
                    <select
                      value={newCatEmoji}
                      onChange={e => setNewCatEmoji(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-base text-center focus:outline-none"
                    >
                      <option value="👕">👕</option>
                      <option value="👟">👟</option>
                      <option value="⌚">⌚</option>
                      <option value="💻">💻</option>
                      <option value="🏠">🏠</option>
                      <option value="🍔">🍔</option>
                      <option value="🏪">🏪</option>
                      <option value="🎮">🎮</option>
                      <option value="📚">📚</option>
                      <option value="🎁">🎁</option>
                      <option value="💎">💎</option>
                      <option value="🚗">🚗</option>
                      <option value="🛠️">🛠️</option>
                      <option value="🥦">🥦</option>
                      <option value="📦">📦</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1 col-span-3">
                    <label className="block text-[9px] font-bold uppercase text-slate-400">Nome da Categoria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Calçados, Acessórios..."
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-2.5 text-xs focus:outline-none dark:text-white font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} /> Criar Categoria
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
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
                  {editingItem ? '✏️ Editar Produto' : '🛒 Adicionar Produto'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="space-y-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Camiseta Nike, Livros de Algoritmos..."
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Preço Estimado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={estimatedPrice}
                      onChange={e => setEstimatedPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Prioridade</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      <option value="high">🔴 Alta</option>
                      <option value="medium">🟡 Média</option>
                      <option value="low">🔵 Baixa</option>
                    </select>
                  </div>
                </div>

                {/* Status and Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      <option value="buy">⏳ Comprar</option>
                      <option value="bought">✅ Comprado</option>
                      <option value="postponed">💤 Adiado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tamanho (Opcional)</label>
                    <input
                      type="text"
                      value={size}
                      onChange={e => setSize(e.target.value)}
                      placeholder="Ex: G, 41, M..."
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-rose-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Imagem do Produto (Upload ou URL) */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Imagem do Produto</label>
                  
                  {imageUrl ? (
                    <div className="flex items-center gap-3.5 p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl relative">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border dark:border-slate-800 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-black text-slate-700 dark:text-slate-200 truncate">Imagem Selecionada</span>
                        <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[180px]">{imageUrl.startsWith('data:') ? 'Arquivo Carregado (Dispositivo)' : imageUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer text-[10px] font-black uppercase"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Drag & Drop Local Upload box */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-rose-500/55 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 group/upload">
                        <Upload size={20} className="text-slate-400 mb-1 group-hover/upload:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">Carregar do Dispositivo</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 font-bold">Selecione uma foto do seu aparelho</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 3 * 1024 * 1024) {
                                alert("A imagem deve ter no máximo 3MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setImageUrl(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-sm active:scale-98"
                  >
                    {editingItem ? 'Salvar Alterações' : 'Adicionar Produto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for Highlighted Images */}
      <AnimatePresence>
        {selectedImageUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col font-sans"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40">
                <h3 className="text-sm font-black uppercase text-white truncate tracking-wide">
                  🖼️ {selectedItemName || "Imagem do Produto"}
                </h3>
                <button
                  onClick={() => setSelectedImageUrl(null)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-slate-950/20 max-h-[70vh] overflow-hidden">
                <img
                  src={selectedImageUrl}
                  alt={selectedItemName}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-md border border-slate-850"
                />
              </div>
              <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-center">
                <a
                  href={selectedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  <span>Abrir Imagem em Nova Aba</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
