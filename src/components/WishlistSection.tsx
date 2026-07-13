import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Trash2, 
  Edit3, 
  Check, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  ChevronRight,
  ArrowRightLeft,
  X,
  Package,
  Heart,
  Eye,
  Upload
} from 'lucide-react';
import { ShoppingItem } from '../types';

interface WishlistSectionProps {
  shoppingList: ShoppingItem[];
  onAdd: (item: Omit<ShoppingItem, 'id' | 'bought'>) => void;
  onDelete: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
}

export default function WishlistSection({ 
  shoppingList, 
  onAdd, 
  onDelete, 
  onEdit 
}: WishlistSectionProps) {
  // UI states
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('wishlist');
  const [imageUrl, setImageUrl] = useState('');
  const [size, setSize] = useState('');

  // Wishlist items filter: item.category is 'wishlist' OR name includes 'desejo' OR category is 'clothing'
  // Let's filter items that are bought = false to only show active wishes
  const wishlistItems = shoppingList.filter(item => {
    const cat = item.category?.toLowerCase() || '';
    const isWish = cat === 'wishlist' || cat === 'clothing' || item.name.toLowerCase().includes('desejo') || item.name.toLowerCase().includes('wish');
    return isWish && !item.bought;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price) || 0;

    if (editingItem) {
      onEdit({
        ...editingItem,
        name: name.trim(),
        estimatedPrice: parsedPrice,
        category,
        priority,
        imageUrl: imageUrl.trim() || undefined,
        size: size.trim() || undefined
      });
      setEditingItem(null);
    } else {
      onAdd({
        name: name.trim(),
        estimatedPrice: parsedPrice,
        category: 'wishlist',
        priority,
        imageUrl: imageUrl.trim() || undefined,
        size: size.trim() || undefined,
        quantity: 1,
        status: 'buy'
      });
    }

    setName('');
    setPrice('');
    setPriority('medium');
    setImageUrl('');
    setSize('');
    setShowAddModal(false);
  };

  const startEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.estimatedPrice.toString());
    setCategory(item.category || 'wishlist');
    setPriority(item.priority || 'medium');
    setImageUrl(item.imageUrl || '');
    setSize(item.size || '');
    setShowAddModal(true);
    setActiveMenuId(null);
  };

  const handleMoveToList = (item: ShoppingItem, newCat: string) => {
    onEdit({
      ...item,
      category: newCat
    });
    setActiveMenuId(null);
  };

  const handleMarkAsBought = (item: ShoppingItem) => {
    onEdit({
      ...item,
      bought: true,
      status: 'bought'
    });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header section */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-3xs">
        <div className="space-y-0.5">
          <h2 className="text-lg font-black tracking-tight text-slate-850 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-pink-50 dark:bg-pink-950/40 rounded-xl text-pink-500">
              <Heart size={18} fill="currentColor" />
            </span>
            Produtos Desejados
          </h2>
          <p className="text-xs text-slate-400 font-medium font-sans">
            Seu mapeador de sonhos de consumo, metas materiais e mimos para adquirir.
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowAddModal(true); }}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <Plus size={14} /> Novo Desejo
        </button>
      </div>

      {/* Grid displays */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-16 text-center rounded-3xl text-slate-400 italic text-xs font-bold shadow-3xs">
          Nenhum produto desejado cadastrado. Crie mimos e metas acima! 🌸
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {wishlistItems.map(item => {
            const isMenuOpen = activeMenuId === item.id;
            const itemPriority = item.priority || 'medium';
            
            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3.5xl p-4 shadow-3xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden h-72"
              >
                {/* Image panel or placeholder */}
                <div className="w-full h-36 rounded-2.5xl overflow-hidden bg-slate-50 border dark:border-slate-800 relative mb-3">
                  {item.imageUrl ? (
                    <button
                      onClick={() => {
                        setSelectedImageUrl(item.imageUrl || null);
                        setSelectedItemName(item.name);
                      }}
                      title="Ver imagem em destaque"
                      className="w-full h-full block relative group/img cursor-pointer"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye size={20} className="text-white drop-shadow-sm" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-pink-400/40 bg-pink-50/15 dark:bg-pink-950/5">
                      <Sparkles size={28} />
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">Desejo</span>
                    </div>
                  )}

                  {/* Priority indicator float badge */}
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    itemPriority === 'high' 
                      ? 'bg-rose-600 text-white shadow' 
                      : itemPriority === 'medium'
                        ? 'bg-amber-500 text-white shadow'
                        : 'bg-blue-500 text-white shadow'
                  }`}>
                    {itemPriority === 'high' ? 'Alta prioridade' : itemPriority === 'medium' ? 'Médio' : 'Baixa'}
                  </span>
                </div>

                {/* Info block */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left min-w-0 pr-2">
                    <h3 className="font-black text-xs text-slate-850 dark:text-slate-100 truncate block">
                      {item.name}
                    </h3>
                    <p className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-450">
                      R$ {item.estimatedPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Context Menu Ellipsis (⋮) */}
                  <div className="relative shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : item.id);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer"
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
                            className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-lg py-1.5 z-20 text-xs text-left font-bold"
                          >
                            <button
                              onClick={() => startEdit(item)}
                              className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2"
                            >
                              <Edit3 size={12} className="text-indigo-500" />
                              Editar Produto
                            </button>
                            <button
                              onClick={() => handleMarkAsBought(item)}
                              className="w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-2"
                            >
                              <Check size={12} className="text-emerald-500" />
                              Marcar Adquirido
                            </button>

                            <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                            <div className="px-3 py-1 text-[8px] uppercase font-black text-slate-400">Mover para Lista</div>
                            <button
                              onClick={() => handleMoveToList(item, 'clothing')}
                              className="w-full px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1"
                            >
                              👕 Roupas
                            </button>
                            <button
                              onClick={() => handleMoveToList(item, 'stationery')}
                              className="w-full px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1"
                            >
                              🏪 Papelaria
                            </button>
                            <button
                              onClick={() => handleMoveToList(item, 'others')}
                              className="w-full px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1"
                            >
                              🛍️ Geral
                            </button>

                            <div className="border-t border-slate-50 dark:border-slate-850 my-1" />
                            <button
                              onClick={() => onDelete(item.id)}
                              className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                            >
                              <Trash2 size={12} />
                              Excluir Desejo
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

      {/* ADD / EDIT DESEJO MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
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
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-xl relative z-20 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  {editingItem ? '✏️ Editar Desejo' : '📦 Registrar Sonho de Consumo'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Nintendo Switch OLED, Blazer Casual..."
                    className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Preço Estimado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Prioridade</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    >
                      <option value="high">🔴 Alta prioridade</option>
                      <option value="medium">🟡 Médio</option>
                      <option value="low">🔵 Baixa prioridade</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tamanho / Detalhe (Opcional)</label>
                    <input
                      type="text"
                      value={size}
                      onChange={e => setSize(e.target.value)}
                      placeholder="Ex: tamanho M, cor preta..."
                      className="w-full bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 focus:border-pink-500 rounded-xl p-3 text-xs focus:outline-none dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Imagem do Desejo (Upload ou URL) */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-4 font-sans">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Imagem do Desejo</label>
                  
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
                        className="px-2.5 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/60 text-pink-500 hover:text-pink-600 transition-colors cursor-pointer text-[10px] font-black uppercase"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Drag & Drop Local Upload box */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-pink-500/55 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 group/upload">
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

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-sm active:scale-98"
                >
                  {editingItem ? 'Salvar Alterações' : 'Adicionar aos Desejados'}
                </button>
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
                  🖼️ {selectedItemName || "Imagem do Desejo"}
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
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md hover:scale-[1.02]"
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
