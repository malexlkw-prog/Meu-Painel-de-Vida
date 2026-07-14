import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, Watch, Gift, Heart, ShoppingBag, Smartphone, Gamepad2, 
  Briefcase, Sparkles, Backpack, Trash2, Edit3, Plus, Search, 
  Filter, ArrowLeft, ExternalLink, Star, Check, X, ChevronRight, 
  MoreVertical, Calendar, Store, Link as LinkIcon, User, Layers, Info, Trash, Copy, Upload
} from 'lucide-react';
import { PainelData, WishlistItem, GiftPerson, QueroComprarState, CustomCategory, SpecialDate } from '../types';
import { getDaysUntil } from '../utils/dateUtils';

interface QueroComprarSectionProps {
  data: PainelData;
  onUpdateData: (newData: PainelData) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'clothes', name: 'Roupas', icon: Shirt, desc: 'Camisas, camisas de time, calças, shorts e casacos.', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40', defaultSubs: ['Camisas', 'Camisas de Time', 'Calças', 'Shorts', 'Jaquetas', 'Camisas Sociais', 'Bonés', 'Meias'] },
  { id: 'shoes', name: 'Calçados', icon: Layers, desc: 'Tênis esportivos, sapatos, botas e chinelos.', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
  { id: 'accessories', name: 'Acessórios', icon: Watch, desc: 'Relógios, óculos de sol, carteiras, cintos e joias.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'caps', name: 'Bonés e Chapéus', icon: Sparkles, desc: 'Bonés de aba curva ou reta, gorros e chapéus.', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
  { id: 'bags', name: 'Mochilas e Bolsas', icon: Backpack, desc: 'Mochilas de viagem, bolsas transversais e malas.', color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
  { id: 'electronics', name: 'Eletrônicos', icon: Smartphone, desc: 'Fones, carregadores, caixas de som e periféricos.', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
  { id: 'games', name: 'Games', icon: Gamepad2, desc: 'Consoles, mouses, teclados gamer e jogos.', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40' },
  { id: 'personal', name: 'Objetos Pessoais', icon: User, desc: 'Perfumes, cosméticos, fones, celulares e livros.', color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40', defaultTypes: ['Perfumes', 'Relógios', 'Carteiras', 'Mochilas', 'Óculos', 'Fones', 'Celulares', 'Tablets', 'Livros'] },
  { id: 'professional', name: 'Artigos Profissionais', icon: Briefcase, desc: 'Equipamentos de trabalho, impressoras e ferramentas.', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40', defaultTypes: ['Impressoras', 'Computadores', 'Equipamentos', 'Materiais', 'Ferramentas'] },
  { id: 'gifts', name: 'Presentes', icon: Gift, desc: 'Controle de presentes e surpresas para familiares e amigos.', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
  { id: 'favorites', name: 'Favoritos', icon: Heart, desc: 'Desejos mais cobiçados de todas as categorias.', color: 'text-red-500 bg-red-50 dark:bg-red-950/40' },
  { id: 'all', name: 'Todos os Desejos', icon: ShoppingBag, desc: 'Lista global unificada para pesquisa e filtros rápidos.', color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/40' }
];

export default function QueroComprarSection({ data, onUpdateData, onClose }: QueroComprarSectionProps) {
  // Safe initial state setup
  const state: QueroComprarState = useMemo(() => {
    return data.queroComprar || { items: [], people: [], customCategories: [], customSubCategories: {} };
  }, [data.queroComprar]);

  // UI Views: 'home' | 'category' | 'people' | 'person_detail' | 'favorites' | 'all' | 'agenda'
  const [view, setView] = useState<'home' | 'category' | 'people' | 'person_detail' | 'favorites' | 'all' | 'agenda'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  
  // Custom Category State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🎁');
  const [newCatColor, setNewCatColor] = useState('indigo');

  // Success Feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Special Dates for Person Creator
  const [personSpecialDates, setPersonSpecialDates] = useState<SpecialDate[]>([]);

  // Gift Scheduling states
  const [formOccasion, setFormOccasion] = useState('Aniversário');
  const [formGiftDate, setFormGiftDate] = useState('');
  const [formGiftStatus, setFormGiftStatus] = useState<'planned' | 'buying' | 'bought' | 'delivered'>('planned');

  // Agenda Filter states
  const [agendaPersonFilter, setAgendaPersonFilter] = useState('all');
  const [agendaOccasionFilter, setAgendaOccasionFilter] = useState('all');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState('all');
  const [agendaYearFilter, setAgendaYearFilter] = useState('all');
  const [agendaSearchDate, setAgendaSearchDate] = useState('');

  // Custom clothing subcategory state
  const [clothingSubCategory, setClothingSubCategory] = useState<string>('all');
  const [showAddSubCatModal, setShowAddSubCatModal] = useState(false);
  const [newSubCatName, setNewSubCatName] = useState('');

  // Search & Filter State
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | ''>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals & Action States
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<GiftPerson | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<WishlistItem | null>(null);

  // Form States (Item)
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStore, setFormStore] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formDesireLevel, setFormDesireLevel] = useState<number>(3);
  const [formSize, setFormSize] = useState('');
  const [formColor, setFormColor] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<any>('want');
  const [formCategory, setFormCategory] = useState('clothes');
  const [formSubCategory, setFormSubCategory] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formGiftPersonId, setFormGiftPersonId] = useState('');
  const [formPersonalType, setFormPersonalType] = useState('');
  const [formProfessionalType, setFormProfessionalType] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Form States (Person)
  const [personName, setPersonName] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [personBirthday, setPersonBirthday] = useState('');
  const [personRelationship, setPersonRelationship] = useState('');
  const [personNotes, setPersonNotes] = useState('');
  const [personImageUrl, setPersonImageUrl] = useState('');

  // MUTATE CORE STATE HELPER
  const updateModuleState = (updater: (prev: QueroComprarState) => QueroComprarState) => {
    const updated = updater(state);
    onUpdateData({
      ...data,
      queroComprar: updated
    });
  };

  // Drag and Drop Base64 converter
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas arquivos de imagem.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Drag and drop for Person Image
  const handlePersonDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPersonImageUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // RIGHT CLICK HANDLERS FOR PC CATEGORY / SUBCATEGORY DELETION
  const handleRightClickCategory = (e: React.MouseEvent, catId: string, catName: string) => {
    e.preventDefault();
    if (confirm(`Deseja realmente excluir a categoria "${catName}"? Esta ação ocultará a categoria e todos os seus itens.`)) {
      updateModuleState(prev => {
        const deleted = prev.deletedCategories || [];
        if (deleted.includes(catId)) return prev;
        return {
          ...prev,
          deletedCategories: [...deleted, catId]
        };
      });
      triggerSuccess(`Categoria "${catName}" excluída!`);
    }
  };

  const handleRightClickSubCategory = (e: React.MouseEvent, subName: string) => {
    e.preventDefault();
    const catId = selectedCategoryId || 'clothes';
    if (confirm(`Deseja realmente excluir a subcategoria "${subName}"? Isso ocultará todos os itens pertencentes a ela.`)) {
      updateModuleState(prev => {
        const delMap = prev.deletedSubCategories || {};
        const currentList = delMap[catId] || [];
        if (currentList.includes(subName)) return prev;
        return {
          ...prev,
          deletedSubCategories: {
            ...delMap,
            [catId]: [...currentList, subName]
          }
        };
      });
      if (clothingSubCategory === subName) {
        setClothingSubCategory('all');
      }
      triggerSuccess(`Subcategoria "${subName}" excluída!`);
    }
  };

  // COMBINED FILTERED ITEMS FOR LISTING
  const itemsToDisplay = useMemo(() => {
    let list = [...state.items];

    // Filter out items of deleted categories
    const deletedCats = state.deletedCategories || [];
    list = list.filter(item => !deletedCats.includes(item.category));

    // Filter out items of deleted subcategories
    const deletedSubCatsMap = state.deletedSubCategories || {};
    list = list.filter(item => {
      if (!item.subCategory) return true;
      const delSubs = deletedSubCatsMap[item.category] || [];
      return !delSubs.includes(item.subCategory);
    });

    // Category / View filter
    if (view === 'category' && selectedCategoryId) {
      list = list.filter(item => item.category === selectedCategoryId);
      // Extra subcategory filter for clothes or custom categories
      if (clothingSubCategory !== 'all') {
        list = list.filter(item => item.subCategory === clothingSubCategory);
      }
    } else if (view === 'favorites') {
      list = list.filter(item => item.isFavorite);
    } else if (view === 'person_detail' && selectedPersonId) {
      list = list.filter(item => item.category === 'gifts' && item.giftPersonId === selectedPersonId);
    }

    // Global Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.store && item.store.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q))
      );
    }

    // Advanced Filters
    if (statusFilter !== 'all') {
      list = list.filter(item => item.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      list = list.filter(item => item.priority === priorityFilter);
    }
    if (storeFilter !== 'all') {
      list = list.filter(item => item.store === storeFilter);
    }

    // Price sorting
    if (priceSort === 'asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [state.items, view, selectedCategoryId, clothingSubCategory, selectedPersonId, searchQuery, statusFilter, priorityFilter, storeFilter, priceSort, state.deletedCategories, state.deletedSubCategories]);

  // COMBINE DEFAULT AND USER-CREATED CUSTOM CATEGORIES
  const mergedCategories = useMemo(() => {
    const customCats = state.customCategories || [];
    const mappedCustoms = customCats.map(cc => ({
      id: cc.id,
      name: cc.name,
      icon: Gift,
      emoji: cc.emoji || '🎁',
      desc: `Categoria personalizada criada pelo usuário.`,
      color: `text-${cc.color}-500 bg-${cc.color}-50 dark:bg-${cc.color}-950/40`,
      isCustom: true
    }));

    // Inject before favorites and all
    const baseList = [...CATEGORIES];
    const footerCats = baseList.slice(-2); // favorites, all
    const mainCats = baseList.slice(0, -2); // everything else
    
    const combined = [...mainCats, ...mappedCustoms, ...footerCats];
    const deleted = state.deletedCategories || [];
    return combined.filter(c => !deleted.includes(c.id));
  }, [state.customCategories, state.deletedCategories]);

  // NEXT SPECIAL DATE COUNTDOWN FOR DETAILED PERSON VIEW
  const activePerson = useMemo(() => {
    return state.people.find(p => p.id === selectedPersonId);
  }, [state.people, selectedPersonId]);

  const nextSpecialDate = useMemo(() => {
    if (!activePerson) return null;
    const dates = activePerson.specialDates || [];
    const allDates = dates.length > 0 ? dates : (activePerson.birthday ? [{
      id: 'legacy_bday',
      label: 'Aniversário',
      date: activePerson.birthday,
      type: 'birthday' as const
    }] : []);

    if (allDates.length === 0) return null;

    let closestDate: any = null;
    let minDays = 999;

    allDates.forEach(d => {
      const { days, targetDate } = getDaysUntil(d.date);
      if (days < minDays) {
        minDays = days;
        closestDate = {
          ...d,
          days,
          targetDate
        };
      }
    });

    return closestDate;
  }, [activePerson]);

  // COLLECT ALL GIFTS AND SORT THEM CHRONOLOGICALLY FOR AGENDA
  const agendaItems = useMemo(() => {
    const gifts = state.items.filter(item => item.category === 'gifts' && item.giftDate);
    return gifts.map(item => {
      const { days, targetDate } = getDaysUntil(item.giftDate || '');
      const person = state.people.find(p => p.id === item.giftPersonId);
      return {
        ...item,
        days,
        targetDate,
        person
      };
    }).sort((a, b) => a.days - b.days);
  }, [state.items, state.people]);

  // FILTERED AGENDA FOR THE AGENDA TAB
  const filteredAgendaItems = useMemo(() => {
    let list = agendaItems;

    if (agendaPersonFilter !== 'all') {
      list = list.filter(item => item.giftPersonId === agendaPersonFilter);
    }
    if (agendaOccasionFilter !== 'all') {
      list = list.filter(item => item.occasion === agendaOccasionFilter);
    }
    if (agendaStatusFilter !== 'all') {
      list = list.filter(item => item.giftStatus === agendaStatusFilter);
    }
    if (agendaYearFilter !== 'all') {
      list = list.filter(item => {
        if (!item.giftDate) return false;
        return item.giftDate.includes(agendaYearFilter);
      });
    }
    if (agendaSearchDate.trim()) {
      const q = agendaSearchDate.toLowerCase().trim();
      list = list.filter(item => item.giftDate && item.giftDate.toLowerCase().includes(q));
    }

    return list;
  }, [agendaItems, agendaPersonFilter, agendaOccasionFilter, agendaStatusFilter, agendaYearFilter, agendaSearchDate]);

  // Dynamic Stores Filter Options
  const storesList = useMemo(() => {
    const list = state.items.map(i => i.store).filter((s): s is string => !!s);
    return Array.from(new Set(list));
  }, [state.items]);

  // GLOBAL STATS CALCULATIONS
  const stats = useMemo(() => {
    const totalCount = state.items.length;
    const totalVal = state.items.reduce((acc, i) => acc + (i.status !== 'cancelled' ? i.price : 0), 0);
    const boughtCount = state.items.filter(i => i.status === 'bought').length;
    const pendingCount = state.items.filter(i => i.status === 'want' || i.status === 'buying').length;
    
    // Most popular category
    const counts: { [key: string]: number } = {};
    state.items.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    let maxCat = '';
    let maxNum = 0;
    Object.entries(counts).forEach(([cat, num]) => {
      if (num > maxNum) {
        maxNum = num;
        maxCat = cat;
      }
    });
    const popularCategory = mergedCategories.find(c => c.id === maxCat)?.name || 'Nenhuma';

    return {
      totalCount,
      totalVal,
      boughtCount,
      pendingCount,
      popularCategory,
      peopleCount: state.people.length
    };
  }, [state.items, state.people, mergedCategories]);

  // CATEGORY CARD COMPACT COUNTERS
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return state.items.length;
    if (catId === 'favorites') return state.items.filter(i => i.isFavorite).length;
    return state.items.filter(i => i.category === catId).length;
  };

  // Clothing Subcategories lookup
  const clothingSubcategories = useMemo(() => {
    const defaultSubs = mergedCategories.find(c => c.id === 'clothes')?.defaultSubs || [];
    const custom = state.customSubCategories?.['clothes'] || [];
    return [...defaultSubs, ...custom];
  }, [state.customSubCategories, mergedCategories]);

  // Active Category Subcategories lookup
  const activeCategorySubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    const cat = mergedCategories.find(c => c.id === selectedCategoryId);
    const defaultSubs = cat?.defaultSubs || CATEGORIES.find(c => c.id === selectedCategoryId)?.defaultSubs || [];
    const custom = state.customSubCategories?.[selectedCategoryId] || [];
    const combined = [...defaultSubs, ...custom];
    
    // Filter out deleted subcategories
    const deletedSubs = state.deletedSubCategories?.[selectedCategoryId] || [];
    return combined.filter(s => !deletedSubs.includes(s));
  }, [state.customSubCategories, mergedCategories, selectedCategoryId, state.deletedSubCategories]);

  // Personal custom types lookup
  const personalTypes = useMemo(() => {
    const defaultT = mergedCategories.find(c => c.id === 'personal')?.defaultTypes || [];
    const custom = state.customSubCategories?.['personal'] || [];
    return [...defaultT, ...custom];
  }, [state.customSubCategories, mergedCategories]);

  // Professional custom types lookup
  const professionalTypes = useMemo(() => {
    const defaultT = mergedCategories.find(c => c.id === 'professional')?.defaultTypes || [];
    const custom = state.customSubCategories?.['professional'] || [];
    return [...defaultT, ...custom];
  }, [state.customSubCategories, mergedCategories]);

  // ADD CUSTOM SUBCATEGORY
  const handleAddSubCategory = () => {
    if (!newSubCatName.trim()) return;
    const catKey = selectedCategoryId || 'clothes';
    updateModuleState(prev => {
      const currentMap = prev.customSubCategories || {};
      const list = currentMap[catKey] || [];
      if (list.includes(newSubCatName.trim())) return prev;
      return {
        ...prev,
        customSubCategories: {
          ...currentMap,
          [catKey]: [...list, newSubCatName.trim()]
        }
      };
    });
    setNewSubCatName('');
    setShowAddSubCatModal(false);
  };

  // SAVE PRODUCT (Add or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseFloat(formPrice) || 0;

    const targetCategory = formCategory;

    const itemData: WishlistItem = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 9),
      name: formName.trim(),
      description: formDesc.trim() || undefined,
      price: parsedPrice,
      store: formStore.trim() || undefined,
      link: formLink.trim() || undefined,
      dateAdded: editingItem?.dateAdded || new Date().toISOString().split('T')[0],
      priority: formPriority,
      desireLevel: formDesireLevel,
      size: formSize.trim() || undefined,
      color: formColor.trim() || undefined,
      notes: formNotes.trim() || undefined,
      status: formStatus,
      category: targetCategory,
      subCategory: targetCategory === 'clothes' ? formSubCategory : undefined,
      personalType: targetCategory === 'personal' ? formPersonalType : undefined,
      professionalType: targetCategory === 'professional' ? formProfessionalType : undefined,
      giftPersonId: targetCategory === 'gifts' ? formGiftPersonId : undefined,
      occasion: targetCategory === 'gifts' ? formOccasion : undefined,
      giftDate: targetCategory === 'gifts' ? formGiftDate : undefined,
      giftStatus: targetCategory === 'gifts' ? formGiftStatus : undefined,
      imageUrl: formImageUrl.trim() || undefined,
      isFavorite: editingItem?.isFavorite || false
    };

    updateModuleState(prev => {
      const filtered = prev.items.filter(i => i.id !== itemData.id);
      return {
        ...prev,
        items: [itemData, ...filtered]
      };
    });

    // Reset Form
    setEditingItem(null);
    setShowItemModal(false);
    clearItemForm();
    triggerSuccess('Item salvo com sucesso!');
  };

  const clearItemForm = () => {
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormStore('');
    setFormLink('');
    setFormPriority('medium');
    setFormDesireLevel(3);
    setFormSize('');
    setFormColor('');
    setFormNotes('');
    setFormStatus('want');
    setFormCategory(selectedCategoryId && selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites' ? selectedCategoryId : 'clothes');
    setFormSubCategory('');
    setFormPersonalType('');
    setFormProfessionalType('');
    setFormGiftPersonId(selectedPersonId || '');
    setFormImageUrl('');
    setFormOccasion('Aniversário');
    setFormGiftDate('');
    setFormGiftStatus('planned');
  };

  const startEditItem = (item: WishlistItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormPrice(item.price ? item.price.toString() : '');
    setFormStore(item.store || '');
    setFormLink(item.link || '');
    setFormPriority(item.priority);
    setFormDesireLevel(item.desireLevel);
    setFormSize(item.size || '');
    setFormColor(item.color || '');
    setFormNotes(item.notes || '');
    setFormStatus(item.status);
    setFormCategory(item.category);
    setFormSubCategory(item.subCategory || '');
    setFormPersonalType(item.personalType || '');
    setFormProfessionalType(item.professionalType || '');
    setFormGiftPersonId(item.giftPersonId || '');
    setFormImageUrl(item.imageUrl || '');
    setFormOccasion(item.occasion || 'Aniversário');
    setFormGiftDate(item.giftDate || '');
    setFormGiftStatus(item.giftStatus || 'planned');
    setShowItemModal(true);
    setActiveMenuId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza de que deseja remover este item de desejos?')) {
      updateModuleState(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== id)
      }));
      setActiveMenuId(null);
    }
  };

  const handleToggleFavorite = (item: WishlistItem) => {
    updateModuleState(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i)
    }));
  };

  // SAVE PERSON
  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    // Build the list of special dates including the birthday if not already represented
    const finalSpecialDates = [...personSpecialDates];
    if (personBirthday.trim()) {
      const containsBirthday = finalSpecialDates.some(sd => sd.type === 'birthday' && sd.date === personBirthday.trim());
      if (!containsBirthday) {
        finalSpecialDates.unshift({
          id: 'bday_' + Math.random().toString(36).substring(2, 7),
          type: 'birthday',
          date: personBirthday.trim(),
          label: 'Aniversário'
        });
      }
    }

    const personData: GiftPerson = {
      id: editingPerson?.id || Math.random().toString(36).substring(2, 9),
      name: personName.trim(),
      age: parseInt(personAge) || undefined,
      birthday: personBirthday.trim() || undefined,
      relationship: personRelationship.trim() || undefined,
      notes: personNotes.trim() || undefined,
      imageUrl: personImageUrl.trim() || undefined,
      specialDates: finalSpecialDates
    };

    updateModuleState(prev => {
      const filtered = prev.people.filter(p => p.id !== personData.id);
      return {
        ...prev,
        people: [...filtered, personData]
      };
    });

    setEditingPerson(null);
    setShowPersonModal(false);
    setPersonName('');
    setPersonAge('');
    setPersonBirthday('');
    setPersonRelationship('');
    setPersonNotes('');
    setPersonImageUrl('');
    setPersonSpecialDates([]);
    triggerSuccess('Pessoa cadastrada com sucesso!');
  };

  const startEditPerson = (p: GiftPerson) => {
    setEditingPerson(p);
    setPersonName(p.name);
    setPersonAge(p.age ? p.age.toString() : '');
    setPersonBirthday(p.birthday || '');
    setPersonRelationship(p.relationship || '');
    setPersonNotes(p.notes || '');
    setPersonImageUrl(p.imageUrl || '');
    setPersonSpecialDates(p.specialDates || []);
    setShowPersonModal(true);
  };

  const handleDeletePerson = (id: string) => {
    if (confirm('Excluir esta pessoa também removerá todos os presentes associados a ela. Continuar?')) {
      updateModuleState(prev => ({
        ...prev,
        people: prev.people.filter(p => p.id !== id),
        items: prev.items.filter(i => !(i.category === 'gifts' && i.giftPersonId === id))
      }));
      if (selectedPersonId === id) {
        setView('people');
      }
    }
  };

  // UTILITY RENDER HELPERS
  const formatPrice = (v: number) => {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusBadge = (status: WishlistItem['status']) => {
    const map = {
      want: { text: 'Quero Comprar', style: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-350 border border-indigo-200/50' },
      buying: { text: 'Comprando', style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-350 border border-amber-200/50' },
      bought: { text: 'Comprado', style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border border-emerald-200/50' },
      cancelled: { text: 'Cancelado', style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-350 border border-rose-200/50' }
    };
    const current = map[status] || { text: 'Quero Comprar', style: 'bg-indigo-50 text-indigo-700' };
    return <span className={`text-[10px] font-black tracking-tight px-2.5 py-1 rounded-full uppercase ${current.style}`}>{current.text}</span>;
  };

  const getPriorityBadge = (prio: WishlistItem['priority']) => {
    const map = {
      high: { text: 'Alta prioridade', color: 'text-rose-500 fill-rose-500' },
      medium: { text: 'Média prioridade', color: 'text-amber-500 fill-amber-500' },
      low: { text: 'Baixa prioridade', color: 'text-slate-400 fill-slate-400' }
    };
    const c = map[prio] || map.medium;
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <Star size={11} className={c.color} /> {c.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans pb-16 flex flex-col">
      {/* 1. APP BAR HEADER */}
      <div className="w-full bg-white dark:bg-[#111726] border-b border-slate-100 dark:border-slate-850 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-4">
            <button 
              onClick={onClose}
              className="group flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-850 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-200 shadow-3xs transition-all active:scale-95"
              title="Voltar ao Painel Geral"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="space-y-0.5">
              <span className="text-[10px] bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">Desejos & Wishlist</span>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                👕 Tudo que Quero Comprar
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => { clearItemForm(); setShowItemModal(true); }}
              className="hidden sm:flex bg-pink-650 hover:bg-pink-700 text-white text-xs font-black tracking-wide uppercase px-5 py-3 rounded-2xl shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:scale-95 transition-all items-center gap-1.5"
            >
              <Plus size={15} /> Adicionar Item
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTAINER AREA */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-6 md:px-8 flex-1">
        
        {/* VIEW: HOME (CATEGORY GRID & STATS) */}
        {view === 'home' && (
          <div className="space-y-8">
            
            {/* STATS BENTO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Desejos Ativos</span>
                <div className="mt-2.5">
                  <span className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">{stats.pendingCount}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Ainda pendentes</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Valor Estimado</span>
                <div className="mt-2.5">
                  <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 block truncate">{formatPrice(stats.totalVal)}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Soma dos valores</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Comprados</span>
                <div className="mt-2.5">
                  <span className="text-2xl md:text-3xl font-black text-emerald-500 block">{stats.boughtCount}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Adquiridos com sucesso</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Categorias</span>
                <div className="mt-2.5">
                  <span className="text-xl md:text-2xl font-black text-purple-500 dark:text-purple-400 block truncate">{stats.popularCategory}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Maior volume</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between animate-pulse">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Seus Favoritos</span>
                <div className="mt-2.5">
                  <span className="text-2xl md:text-3xl font-black text-red-500 block">{getCategoryCount('favorites')}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Desejos ⭐</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111726] p-5 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs text-left flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Pessoas</span>
                <div className="mt-2.5">
                  <span className="text-2xl md:text-3xl font-black text-indigo-500 block">{stats.peopleCount}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Gestão de presentes</span>
                </div>
              </div>
            </div>

            {/* CATEGORIES SECTION */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">Categorias de Desejos</h2>
                  <p className="text-xs text-slate-400 font-bold">Selecione uma área para gerenciar os itens ou agende presentes.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 relative">
                  <button
                    onClick={() => setView('agenda')}
                    className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-black tracking-wide uppercase px-4 py-2.5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    📅 Agenda de Presentes
                  </button>

                  {/* Discreet options menu (⋮) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-all border border-slate-250/60 dark:border-slate-800 cursor-pointer flex items-center justify-center shadow-2xs"
                      title="Mais opções"
                    >
                      <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                      {showMoreMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowMoreMenu(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-150 dark:border-slate-800 py-1.5 z-20"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddCategoryModal(true);
                                setShowMoreMenu(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
                            >
                              <span>➕</span> Criar Nova Categoria
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mergedCategories.map((cat) => {
                  const Icon = cat.icon;
                  const count = getCategoryCount(cat.id);
                  const isCustom = 'isCustom' in cat;
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      onClick={() => {
                        if (cat.id === 'all') setView('all');
                        else if (cat.id === 'favorites') setView('favorites');
                        else if (cat.id === 'gifts') setView('people');
                        else {
                          setSelectedCategoryId(cat.id);
                          setView('category');
                        }
                      }}
                      onContextMenu={(e) => handleRightClickCategory(e, cat.id, cat.name)}
                      title="Clique esquerdo para abrir, clique direito no PC para excluir esta categoria"
                      className="bg-white dark:bg-[#111726] p-6 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs hover:shadow-xs transition-all text-left cursor-pointer flex flex-col justify-between h-56 group relative overflow-hidden"
                    >
                      {/* Top section icon & counter */}
                      <div className="flex justify-between items-start">
                        <span className={`p-3.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-black px-3 py-1.5 rounded-xl border border-slate-200/45 dark:border-slate-800">
                          {count} {count === 1 ? 'item' : 'itens'}
                        </span>
                      </div>

                      {/* Bottom title & description */}
                      <div className="space-y-1.5 mt-6 relative z-10">
                        <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-pink-650 transition-colors">
                          {cat.name}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal font-sans line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>

                      {/* Decorative backdrop mesh */}
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-radial from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-xl pointer-events-none" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* QUICK GLOBAL VIEW AREA */}
            <div className="bg-white dark:bg-[#111726] p-8 border border-slate-150 dark:border-slate-850 rounded-3xl text-center space-y-4 shadow-3xs">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">🛍️ Procurando por algo específico?</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
                Acesse a lista unificada para realizar buscas globais de itens por palavra-chave, marcas, status, tamanhos e valores.
              </p>
              <button 
                onClick={() => setView('all')}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-black uppercase px-6 py-3 rounded-2xl transition-all"
              >
                Abrir Busca Global e Filtros
              </button>
            </div>
          </div>
        )}

        {/* VIEW: CATEGORY / FAVORITES / ALL LIST */}
        {(view === 'category' || view === 'favorites' || view === 'all') && (
          <div className="space-y-6 text-left">
            
            {/* Header back & title bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111726] p-5 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-3xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setView('home'); setSelectedCategoryId(''); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 dark:text-slate-450 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    {view === 'category' 
                      ? `${mergedCategories.find(c => c.id === selectedCategoryId)?.name || 'Categoria'}` 
                      : view === 'favorites' 
                        ? '⭐ Favoritos Autênticos' 
                        : '🛍️ Todos os Desejos'}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {view === 'category' 
                      ? mergedCategories.find(c => c.id === selectedCategoryId)?.desc 
                      : view === 'favorites' 
                        ? 'Sua galeria com as mimos, eletros e metas que possuem destaque absoluto.' 
                        : 'Mapeamento global de desejos de compra cadastrados.'}
                  </p>
                </div>
              </div>

              {/* Category / Subcategory Actions */}
              <div className="flex items-center gap-2">
                {view !== 'home' && view !== 'agenda' && (
                  <button
                    onClick={() => {
                      clearItemForm();
                      if (view === 'category') {
                        setFormCategory(selectedCategoryId);
                      }
                      setShowItemModal(true);
                    }}
                    className="bg-pink-650 hover:bg-pink-700 text-white text-xs font-black tracking-wide uppercase px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Adicionar Item
                  </button>
                )}

              </div>
            </div>

            {/* Subtabs for current category */}
            {view === 'category' && activeCategorySubcategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-[#111726]/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-850 overflow-x-auto w-full">
                <button
                  onClick={() => setClothingSubCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${clothingSubCategory === 'all' ? 'bg-white dark:bg-[#111726] text-pink-650 dark:text-pink-400 shadow-3xs' : 'text-slate-500 hover:text-slate-850 dark:hover:text-white'}`}
                >
                  Todos
                </button>
                {activeCategorySubcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setClothingSubCategory(sub)}
                    onContextMenu={(e) => handleRightClickSubCategory(e, sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${clothingSubCategory === sub ? 'bg-white dark:bg-[#111726] text-pink-650 dark:text-pink-400 shadow-3xs' : 'text-slate-550 hover:text-slate-850 dark:hover:text-white'}`}
                    title="Clique com o botão direito para excluir esta subcategoria"
                  >
                    {sub}
                  </button>
                ))}
                
                {/* Nova Subcategoria Button placed here inside the subcategories box! */}
                <button
                  onClick={() => setShowAddSubCatModal(true)}
                  className="ml-auto px-4 py-2 rounded-xl text-xs font-black uppercase bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/45 dark:hover:bg-pink-900/60 text-pink-650 dark:text-pink-400 border border-pink-100/30 dark:border-pink-900/40 transition-all flex items-center gap-1 cursor-pointer"
                  title="Criar nova subcategoria nesta seção"
                >
                  <Plus size={13} /> Nova Subcategoria
                </button>
              </div>
            )}

            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 p-4 rounded-3xl shadow-3xs space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                
                {/* Search field */}
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar desejos por nome, loja, marca, cor, observações..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-[#111726] text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border ${isFilterOpen ? 'bg-pink-50 border-pink-200 text-pink-700 dark:bg-pink-950/40 dark:border-pink-900/60 dark:text-pink-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}
                  >
                    <Filter size={14} /> Filtrar {isFilterOpen ? 'Fechar' : 'Abrir'}
                  </button>

                  <select
                    value={priceSort}
                    onChange={(e: any) => setPriceSort(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="">Ordenar Valor</option>
                    <option value="asc">Menor Preço</option>
                    <option value="desc">Maior Preço</option>
                  </select>
                </div>
              </div>

              {/* Collapsible advanced filters */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850 overflow-hidden"
                  >
                    {/* Status Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Filtrar por Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="all">Todos os Status</option>
                        <option value="want">Quero Comprar</option>
                        <option value="buying">Comprando</option>
                        <option value="bought">Comprado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Prioridade</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="all">Todas as prioridades</option>
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                      </select>
                    </div>

                    {/* Store Filter */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Loja / Fornecedor</label>
                      <select
                        value={storeFilter}
                        onChange={(e) => setStoreFilter(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="all">Todas as Lojas</option>
                        {storesList.map(store => (
                          <option key={store} value={store}>{store}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST GRID DISPLAY */}
            {itemsToDisplay.length === 0 ? (
              <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 p-16 text-center rounded-3xl text-slate-400 italic text-xs font-bold shadow-3xs space-y-2">
                <div>Nenhum item de desejo corresponde aos filtros atuais. 🔍</div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setStoreFilter('all');
                    setPriceSort('');
                    setClothingSubCategory('all');
                  }}
                  className="text-pink-650 hover:underline font-extrabold cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemsToDisplay.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      className="bg-white dark:bg-[#111726] rounded-3xl border border-slate-150 dark:border-slate-850 shadow-3xs overflow-hidden flex flex-col hover:shadow-xs transition-shadow relative text-left"
                    >
                      {/* Product Image Stage */}
                      <div className="h-48 w-full bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={() => setLightboxItem(item)}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-350 dark:text-slate-600 bg-slate-100 dark:bg-[#111726]/60">
                            <ShoppingBag size={42} className="opacity-40" />
                          </div>
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          {getStatusBadge(item.status)}
                        </div>

                        {/* Favorite Heart Star Overlay */}
                        <button
                          onClick={() => handleToggleFavorite(item)}
                          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-[#111726]/80 backdrop-blur-md rounded-full text-red-500 border border-slate-200/40 dark:border-slate-850 shadow-3xs hover:scale-110 active:scale-90 transition-all z-10"
                        >
                          <Heart size={14} fill={item.isFavorite ? 'currentColor' : 'none'} />
                        </button>

                        {/* Extra indicators overlay (Tamanho / Cor) */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          {item.size && (
                            <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-black tracking-wide px-2 py-0.5 rounded-lg font-mono">T: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-black tracking-wide px-2 py-0.5 rounded-lg">C: {item.color}</span>
                          )}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          {/* Top Tag category/subcategory */}
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                            <span>{mergedCategories.find(c => c.id === item.category)?.name}</span>
                            {item.subCategory && (
                              <>
                                <span>/</span>
                                <span className="text-pink-650 dark:text-pink-400">{item.subCategory}</span>
                              </>
                            )}
                            {item.personalType && (
                              <>
                                <span>/</span>
                                <span className="text-pink-650 dark:text-pink-400">{item.personalType}</span>
                              </>
                            )}
                            {item.professionalType && (
                              <>
                                <span>/</span>
                                <span className="text-pink-650 dark:text-pink-400">{item.professionalType}</span>
                              </>
                            )}
                          </div>

                          <h4 
                            onClick={() => setLightboxItem(item)}
                            className="text-base font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight hover:text-pink-650 dark:hover:text-pink-400 cursor-pointer transition-colors"
                          >
                            {item.name}
                          </h4>

                          {item.description && (
                            <p className="text-xs text-slate-450 dark:text-slate-500 font-medium leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Price, Store, and Heart scale bar */}
                        <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-3.5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                              {formatPrice(item.price)}
                            </span>
                            {item.store && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-550 dark:text-slate-400">
                                <Store size={11} className="text-slate-400" /> {item.store}
                              </span>
                            )}
                          </div>

                          {/* Heart level / Priority */}
                          <div className="flex justify-between items-center text-xs">
                            {getPriorityBadge(item.priority)}
                            <div className="flex items-center gap-0.5" title={`Desejo nível ${item.desireLevel}/5`}>
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Heart
                                  key={idx}
                                  size={10}
                                  className={idx < item.desireLevel ? 'text-red-500 fill-red-500' : 'text-slate-200 dark:text-slate-800'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Item Footer Options (Absolute corner edit/delete) */}
                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-850 pt-3">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <ExternalLink size={12} /> Ir para loja
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Sem link cadastrado</span>
                          )}

                          <div className="flex items-center gap-1 relative">
                            <button
                              onClick={() => startEditItem(item)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                              title="Editar item"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 rounded-lg transition-colors"
                              title="Excluir item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: AGENDA DE PRESENTES (CALENDAR & SCHEDULE VIEW) */}
        {view === 'agenda' && (
          <div className="space-y-6 text-left">
            {/* Header banner */}
            <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 rounded-3xl p-6 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView('home')}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 transition-colors cursor-pointer"
                  title="Voltar ao Início"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">Agenda de Presentes</h2>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Cronograma organizado de presentes vinculados a datas comemorativas</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    clearItemForm();
                    setFormCategory('gifts');
                    setShowItemModal(true);
                  }}
                  className="bg-pink-650 hover:bg-pink-700 text-white text-xs font-black tracking-wide uppercase px-4.5 py-3 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Agendar Novo Presente
                </button>
              </div>
            </div>

            {/* FILTERS PANEL */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 font-mono flex items-center gap-1.5">
                  <Filter size={13} /> Filtrar Agendamentos
                </span>
                <button
                  onClick={() => {
                    setAgendaPersonFilter('all');
                    setAgendaOccasionFilter('all');
                    setAgendaStatusFilter('all');
                    setAgendaYearFilter('all');
                    setAgendaSearchDate('');
                  }}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Limpar Filtros
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                {/* Search Date */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono">Buscar por data</label>
                  <input
                    type="text"
                    value={agendaSearchDate}
                    onChange={(e) => setAgendaSearchDate(e.target.value)}
                    placeholder="Ex: 15/08"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Filter Person */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono">Pessoa</label>
                  <select
                    value={agendaPersonFilter}
                    onChange={(e) => setAgendaPersonFilter(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="all">Todas as pessoas</option>
                    {state.people.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Occasion */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono">Ocasião</label>
                  <select
                    value={agendaOccasionFilter}
                    onChange={(e) => setAgendaOccasionFilter(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="all">Todas as ocasiões</option>
                    <option value="Aniversário">🎂 Aniversário</option>
                    <option value="Natal">🎄 Natal</option>
                    <option value="Dia das Mães">👩 Dia das Mães</option>
                    <option value="Dia dos Pais">👨 Dia dos Pais</option>
                    <option value="Dia dos Namorados">❤️ Dia dos Namorados</option>
                    <option value="Casamento">💍 Casamento</option>
                    <option value="Formatura">🎓 Formatura</option>
                    <option value="Outro">⭐ Outro</option>
                  </select>
                </div>

                {/* Filter Status */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono">Status</label>
                  <select
                    value={agendaStatusFilter}
                    onChange={(e) => setAgendaStatusFilter(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="all">Todos os status</option>
                    <option value="planned">📋 Planejado</option>
                    <option value="buying">🛒 Comprar</option>
                    <option value="bought">✅ Comprado</option>
                    <option value="delivered">🎁 Entregue</option>
                  </select>
                </div>

                {/* Filter Year */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-mono">Ano</label>
                  <select
                    value={agendaYearFilter}
                    onChange={(e) => setAgendaYearFilter(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="all">Todos os anos</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AGENDA ITEMS LIST */}
            {filteredAgendaItems.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#111726] border border-slate-200/60 dark:border-slate-850 rounded-3xl space-y-3 shadow-3xs">
                <Calendar size={48} className="mx-auto text-slate-300 dark:text-slate-700 animate-bounce" />
                <h3 className="text-base font-black text-slate-800 dark:text-white">Nenhum presente agendado encontrado</h3>
                <p className="text-xs text-slate-450 dark:text-slate-550 max-w-md mx-auto font-sans">Tente ajustar seus filtros de busca ou adicione um novo presente com data limite definida para exibi-lo aqui.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAgendaItems.map((item) => {
                  const closenessColor = item.days <= 7 
                    ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-600 dark:text-rose-400' 
                    : item.days <= 30 
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 text-amber-600 dark:text-amber-400' 
                      : 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400';

                  const occasionEmoji = item.occasion === 'Aniversário' ? '🎂' 
                    : item.occasion === 'Natal' ? '🎄' 
                    : item.occasion === 'Casamento' ? '💍' 
                    : item.occasion === 'Dia das Mães' ? '👩' 
                    : item.occasion === 'Dia dos Pais' ? '👨' 
                    : item.occasion === 'Dia dos Namorados' ? '❤️' 
                    : item.occasion === 'Formatura' ? '🎓' 
                    : '🎁';

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 rounded-3xl p-5 hover:shadow-3xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      {/* Event Column (Emoji + Date + Days remaining) */}
                      <div className="flex items-center gap-4 min-w-[210px]">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center font-black shrink-0 border border-slate-200/50 dark:border-slate-800 shadow-4xs">
                          <span className="text-xl leading-none">{occasionEmoji}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-1">{item.giftDate}</span>
                        </div>

                        <div className="space-y-1">
                          <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider font-mono inline-block ${closenessColor}`}>
                            Faltam {item.days} {item.days === 1 ? 'dia' : 'dias'}
                          </div>
                          <span className="text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider block font-mono">{item.occasion || 'Data Especial'}</span>
                        </div>
                      </div>

                      {/* Recipient & Gift info */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Person Profile */}
                        <button
                          onClick={() => {
                            if (item.person) {
                              setSelectedPersonId(item.person.id);
                              setView('person_detail');
                            }
                          }}
                          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left shrink-0 cursor-pointer"
                        >
                          <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950 rounded-full overflow-hidden flex items-center justify-center text-indigo-500 font-extrabold text-xs shrink-0 border border-indigo-100/55 dark:border-indigo-900/60 shadow-3xs">
                            {item.person?.imageUrl ? (
                              <img src={item.person.imageUrl} alt={item.person.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span>{item.person?.name[0] || 'P'}</span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-400 dark:text-slate-550 font-bold block uppercase tracking-wider font-mono">Para:</span>
                            <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 hover:underline">{item.person?.name || 'Alguém especial'}</span>
                          </div>
                        </button>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-850 hidden sm:block" />

                        {/* Gift Details */}
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded-xl border border-slate-200/50 dark:border-slate-800 shrink-0" referrerPolicy="no-referrer" />
                          )}
                          <div className="space-y-0.5">
                            <span className="text-xs font-black text-slate-800 dark:text-white block hover:text-pink-650 transition-colors cursor-pointer" onClick={() => setLightboxItem(item)}>{item.name}</span>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono">
                              <span>Preço: R$ {item.price.toFixed(2)}</span>
                              {item.store && (
                                <>
                                  <span>•</span>
                                  <span>Loja: {item.store}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
                        {/* Status badge */}
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border font-mono ${
                          item.giftStatus === 'delivered' ? 'bg-emerald-50 border-emerald-150 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' :
                          item.giftStatus === 'bought' ? 'bg-sky-50 border-sky-150 text-sky-600 dark:bg-sky-950/20 dark:border-sky-900 dark:text-sky-400' :
                          item.giftStatus === 'buying' ? 'bg-amber-50 border-amber-150 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400' :
                          'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                        }`}>
                          {item.giftStatus === 'delivered' ? '🎁 Entregue' :
                           item.giftStatus === 'bought' ? '✅ Comprado' :
                           item.giftStatus === 'buying' ? '🛒 Comprar' : '📋 Planejado'}
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditItem(item)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 hover:text-indigo-650 dark:hover:text-indigo-400 transition-all cursor-pointer"
                            title="Editar Presente"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 hover:text-rose-600 transition-all cursor-pointer"
                            title="Excluir Presente"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: PEOPLE (GIFTS PEOPLE LIST) */}
        {view === 'people' && (
          <div className="space-y-6 text-left">
            
            {/* Header toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111726] p-5 border border-slate-150 dark:border-slate-850 rounded-3xl shadow-3xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('home')}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 dark:text-slate-450 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    🎁 Controle de Presentes
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-550 font-medium">
                    Planeje presentes de aniversários, datas especiais e ideias para surpreender as pessoas que você ama.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setEditingPerson(null); setPersonName(''); setPersonAge(''); setPersonBirthday(''); setPersonRelationship(''); setPersonNotes(''); setPersonImageUrl(''); setShowPersonModal(true); }}
                className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black tracking-wide uppercase px-5 py-3 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={14} /> Cadastrar Pessoa
              </button>
            </div>

            {/* PEOPLE CARDS GRID */}
            {state.people.length === 0 ? (
              <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 p-16 text-center rounded-3xl text-slate-450 italic text-xs font-bold shadow-3xs">
                Nenhuma pessoa cadastrada para controle de presentes. Cadastre acima! 🎁
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.people.map(person => {
                  const personGifts = state.items.filter(i => i.category === 'gifts' && i.giftPersonId === person.id);
                  const boughtGifts = personGifts.filter(g => g.status === 'bought' || g.status === 'cancelled').length;
                  return (
                    <motion.div
                      key={person.id}
                      whileHover={{ y: -3 }}
                      className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 rounded-3xl p-6 shadow-3xs flex flex-col justify-between hover:shadow-xs transition-all text-left"
                    >
                      <div className="flex gap-4">
                        {/* Person Avatar Profile Pic */}
                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shrink-0 border-2 border-indigo-50 dark:border-indigo-950">
                          {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-indigo-500 font-extrabold text-lg">
                              {person.name[0]}
                            </div>
                          )}
                        </div>

                        {/* Person Identity details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">{person.name}</h3>
                            {person.relationship && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-100/60 dark:border-indigo-900/65">{person.relationship}</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs font-medium">
                            {person.age && <span>🎂 {person.age} anos</span>}
                            {person.birthday && <span>🎉 Aniversário: {person.birthday}</span>}
                          </div>

                          {person.notes && (
                            <p className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal line-clamp-2 italic font-sans pt-1">
                              "{person.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gifts control totals */}
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase block font-mono">Presentes Planejados</span>
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                            {personGifts.length} {personGifts.length === 1 ? 'ideia' : 'ideias'} 
                            <span className="text-xs font-semibold text-slate-450 ml-1">({boughtGifts} adquiridos)</span>
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setSelectedPersonId(person.id); setView('person_detail'); }}
                            className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                          >
                            Ver presentes
                          </button>
                          
                          <button
                            onClick={() => startEditPerson(person)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                            title="Editar pessoa"
                          >
                            <Edit3 size={13} />
                          </button>
                          
                          <button
                            onClick={() => handleDeletePerson(person.id)}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 rounded-lg transition-colors"
                            title="Excluir pessoa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: PERSON DETAIL (GIFTS OF A SPECIFIC PERSON) */}
        {view === 'person_detail' && activePerson && (
          <div className="space-y-6 text-left">
            
            {/* Header Person Banner */}
            <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 rounded-3xl p-6 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setView('people'); setSelectedPersonId(''); }}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shrink-0 border-2 border-indigo-50 dark:border-indigo-950">
                  {activePerson.imageUrl ? (
                    <img src={activePerson.imageUrl} alt={activePerson.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-indigo-500 font-extrabold text-xl">
                      {activePerson.name[0]}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">Presentes de {activePerson.name}</h2>
                    {activePerson.relationship && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-md border border-indigo-100/50 dark:border-indigo-900">{activePerson.relationship}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-slate-400 text-xs font-semibold">
                    {activePerson.age && <span>🎂 {activePerson.age} anos</span>}
                    {activePerson.birthday && <span>🎉 Aniversário: {activePerson.birthday}</span>}
                  </div>
                </div>
              </div>

              {/* Header Action present link */}
              <button
                onClick={() => {
                  clearItemForm();
                  setFormCategory('gifts');
                  setFormGiftPersonId(activePerson.id);
                  setShowItemModal(true);
                }}
                className="bg-pink-650 hover:bg-pink-700 text-white text-xs font-black tracking-wide uppercase px-5 py-3 rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={14} /> Novo Presente para {activePerson.name}
              </button>
            </div>

            {/* PERSON SPECIFIC NOTES & DATES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePerson.notes && (
                <div className="bg-amber-50/55 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/40 p-4.5 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <Info size={16} className="shrink-0 text-amber-500" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] block font-mono">Dicas e preferências de presentes:</span>
                    <p className="leading-relaxed italic">"{activePerson.notes}"</p>
                  </div>
                </div>
              )}

              {/* SPECIAL DATES COUNTDOWNS */}
              {((activePerson.specialDates && activePerson.specialDates.length > 0) || activePerson.birthday) && (
                <div className="bg-indigo-50/55 dark:bg-indigo-950/15 border border-indigo-200/50 dark:border-indigo-900/40 p-4.5 rounded-2xl text-xs text-indigo-800 dark:text-indigo-300 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] block font-mono">Próximos Compromissos & Datas:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {/* Birthday */}
                    {activePerson.birthday && (
                      (() => {
                        const { days } = getDaysUntil(activePerson.birthday);
                        return (
                          <div className="flex justify-between items-center bg-white/70 dark:bg-slate-950/70 px-3 py-1.5 rounded-xl border border-indigo-100/40 dark:border-indigo-950/40">
                            <span className="font-semibold text-slate-700 dark:text-stone-350">🎂 Aniversário ({activePerson.birthday})</span>
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                              {days === 0 ? 'É HOJE! 🎉' : `Faltam ${days} dias`}
                            </span>
                          </div>
                        );
                      })()
                    )}

                    {/* Other special dates */}
                    {activePerson.specialDates?.map(sd => {
                      const { days } = getDaysUntil(sd.date);
                      const icon = sd.type === 'birthday' ? '🎂' 
                        : sd.type === 'christmas' ? '🎄' 
                        : sd.type === 'wedding' ? '💍' 
                        : sd.type === 'mothers_day' ? '👩' 
                        : sd.type === 'fathers_day' ? '👨' 
                        : sd.type === 'valentines' ? '❤️' 
                        : sd.type === 'graduation' ? '🎓' 
                        : '⭐';
                      return (
                        <div key={sd.id} className="flex justify-between items-center bg-white/70 dark:bg-slate-950/70 px-3 py-1.5 rounded-xl border border-indigo-100/40 dark:border-indigo-950/40">
                          <span className="font-semibold text-slate-700 dark:text-stone-350">{icon} {sd.label} ({sd.date})</span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                            {days === 0 ? 'É HOJE! 🎉' : `Faltam ${days} dias`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SPECIFIC PRESENTS WISHLIST GRID */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Lista de Ideias & Presentes Planejados</h3>

              {itemsToDisplay.length === 0 ? (
                <div className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 p-16 text-center rounded-3xl text-slate-400 italic text-xs font-bold shadow-3xs">
                  Nenhum presente ou ideia planejado para {activePerson.name}. Cadastre acima! 🎁
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itemsToDisplay.map(item => (
                    <motion.div
                      key={item.id}
                      className="bg-white dark:bg-[#111726] border border-slate-150 dark:border-slate-850 rounded-3xl overflow-hidden flex flex-col justify-between shadow-3xs hover:shadow-xs transition-shadow text-left"
                    >
                      {/* Present image header */}
                      <div className="h-44 w-full bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover cursor-pointer" referrerPolicy="no-referrer" onClick={() => setLightboxItem(item)} />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-350 dark:text-slate-650 bg-slate-100 dark:bg-[#111726]/40">
                            <Gift size={42} className="opacity-30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      {/* Info area */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white hover:text-pink-650 cursor-pointer" onClick={() => setLightboxItem(item)}>{item.name}</h4>
                          {item.description && <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>}
                        </div>

                        {/* Store / Price */}
                        <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-baseline">
                          <span className="text-base font-black text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                          {item.store && <span className="text-xs text-slate-500 font-bold flex items-center gap-1"><Store size={11} /> {item.store}</span>}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center text-xs">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noreferrer" className="text-pink-650 hover:underline flex items-center gap-1 cursor-pointer font-bold">
                              <ExternalLink size={12} /> Link do presente
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Sem link</span>
                          )}

                          <div className="flex items-center gap-1">
                            <button onClick={() => startEditItem(item)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" title="Editar presente"><Edit3 size={13} /></button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-500" title="Remover presente"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 3. LIGHTBOX COMPONENT */}
      <AnimatePresence>
        {lightboxItem && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111726] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200/20 text-left flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 bg-black relative max-h-[400px] md:max-h-full flex items-center justify-center">
                {lightboxItem.imageUrl ? (
                  <img src={lightboxItem.imageUrl} alt={lightboxItem.name} className="w-full h-full object-contain md:object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="p-16 text-slate-500 flex items-center justify-center h-full"><ShoppingBag size={56} /></div>
                )}
              </div>

              <div className="p-6 md:w-1/2 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider">
                        {mergedCategories.find(c => c.id === lightboxItem.category)?.name}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{lightboxItem.name}</h3>
                    </div>
                    <button onClick={() => setLightboxItem(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full text-slate-500"><X size={15} /></button>
                  </div>

                  {lightboxItem.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{lightboxItem.description}</p>
                  )}

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs font-medium text-slate-550 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valor Estimado:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{formatPrice(lightboxItem.price)}</span>
                    </div>
                    {lightboxItem.store && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Loja / Vendedor:</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">{lightboxItem.store}</span>
                      </div>
                    )}
                    {lightboxItem.size && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tamanho:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{lightboxItem.size}</span>
                      </div>
                    )}
                    {lightboxItem.color && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cor:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{lightboxItem.color}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status atual:</span>
                      <span>{getStatusBadge(lightboxItem.status)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-400">Desejo de compra:</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Heart
                            key={idx}
                            size={10}
                            className={idx < lightboxItem.desireLevel ? 'text-red-500 fill-red-500' : 'text-slate-200 dark:text-slate-800'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {lightboxItem.notes && (
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-xs font-sans text-slate-500 leading-normal italic">
                      " {lightboxItem.notes} "
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                  {lightboxItem.link && (
                    <a
                      href={lightboxItem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-pink-650 hover:bg-pink-700 text-white text-xs font-black uppercase text-center py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={13} /> Ir para loja oficial
                    </a>
                  )}
                  <button
                    onClick={() => { startEditItem(lightboxItem); setLightboxItem(null); }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-white px-4 py-3 rounded-xl text-xs font-extrabold"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. ITEM ADD/EDIT MODAL */}
      <AnimatePresence>
        {showItemModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111726] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-150 dark:border-slate-850 text-left space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag size={18} className="text-pink-600" />
                  {editingItem ? 'Editar Desejo de Compra' : 'Novo Desejo de Compra'}
                </h3>
                <button onClick={() => setShowItemModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500"><X size={16} /></button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-medium">
                
                {/* Drag and Drop Image Stage */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Foto do Produto</label>
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all ${dragActive ? 'border-pink-500 bg-pink-50/20' : 'border-slate-200 dark:border-slate-800 hover:border-pink-400/60'} relative`}
                  >
                    {formImageUrl ? (
                      <div className="space-y-3 w-full">
                        <img src={formImageUrl} alt="Preview" className="h-28 mx-auto object-cover rounded-xl shadow-3xs" referrerPolicy="no-referrer" />
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => setFormImageUrl('')}
                            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5"
                          >
                            <Trash size={12} /> Remover Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-slate-400 block">Arraste e solte uma imagem aqui</span>
                          <span className="text-[10px] text-slate-450 block font-sans">ou clique no botão abaixo para escolher do seu dispositivo</span>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer text-xs font-bold transition-all">
                          <Upload size={12} className="text-pink-600" />
                          <span>Selecionar Arquivo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageFile(file);
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Nome do produto *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Tênis Air Max Pulse, Livro Filosofia..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Preço estimado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="Ex: 899.90"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Main Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Categoria Principal</label>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryModal(true)}
                        className="text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        ➕ Criar Categoria
                      </button>
                    </div>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        setFormCategory(e.target.value);
                        setFormSubCategory('');
                        setFormPersonalType('');
                        setFormProfessionalType('');
                        setFormGiftPersonId('');
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    >
                      {mergedCategories
                        .filter(c => c.id !== 'all' && c.id !== 'favorites')
                        .map(c => {
                          const emoji = 'emoji' in c ? c.emoji : '📦';
                          return (
                            <option key={c.id} value={c.id}>
                              {emoji} {c.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* Context-specific category fields */}
                  {formCategory === 'clothes' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Subcategoria de Roupas</label>
                      <select
                        value={formSubCategory}
                        onChange={(e) => setFormSubCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      >
                        <option value="">Selecione...</option>
                        {clothingSubcategories.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formCategory === 'personal' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Tipo de Objeto Pessoal</label>
                      <select
                        value={formPersonalType}
                        onChange={(e) => setFormPersonalType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      >
                        <option value="">Selecione...</option>
                        {personalTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formCategory === 'professional' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Tipo de Artigo Profissional</label>
                      <select
                        value={formProfessionalType}
                        onChange={(e) => setFormProfessionalType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      >
                        <option value="">Selecione...</option>
                        {professionalTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formCategory === 'gifts' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Para Quem é o Presente? *</label>
                        <select
                          required
                          value={formGiftPersonId}
                          onChange={(e) => setFormGiftPersonId(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none font-bold"
                        >
                          <option value="">Selecione uma pessoa...</option>
                          {state.people.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Ocasião do Presente</label>
                        <select
                          value={formOccasion}
                          onChange={(e) => setFormOccasion(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none font-bold"
                        >
                          <option value="Aniversário">🎂 Aniversário</option>
                          <option value="Natal">🎄 Natal</option>
                          <option value="Dia das Mães">👩 Dia das Mães</option>
                          <option value="Dia dos Pais">👨 Dia dos Pais</option>
                          <option value="Dia dos Namorados">❤️ Dia dos Namorados</option>
                          <option value="Casamento">💍 Casamento</option>
                          <option value="Formatura">🎓 Formatura</option>
                          <option value="Outro">⭐ Outro</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Data Limite de Compra / Entrega (DD/MM/AAAA)</label>
                        <input
                          type="text"
                          value={formGiftDate}
                          onChange={(e) => setFormGiftDate(e.target.value)}
                          placeholder="Ex: 15/08/2026"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Size and Color (Optional parameters) */}
                {(formCategory === 'clothes' || formCategory === 'shoes') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Tamanho (Opcional)</label>
                      <input
                        type="text"
                        value={formSize}
                        onChange={(e) => setFormSize(e.target.value)}
                        placeholder="Ex: G, M, 41, 42..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Cor / Especificação (Opcional)</label>
                      <input
                        type="text"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        placeholder="Ex: Preto, Azul, Titânio..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Loja & link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Loja ou Site Recomendado</label>
                    <input
                      type="text"
                      value={formStore}
                      onChange={(e) => setFormStore(e.target.value)}
                      placeholder="Ex: Nike, Zara, Amazon..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Link do Produto (URL)</label>
                    <input
                      type="url"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="Ex: https://..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Priority, desire level & status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Prioridade de Compra</label>
                    <select
                      value={formPriority}
                      onChange={(e: any) => setFormPriority(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    >
                      <option value="low">Baixa prioridade</option>
                      <option value="medium">Média prioridade</option>
                      <option value="high">Alta prioridade</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Nível de Desejo (1 a 5) ❤️</label>
                    <select
                      value={formDesireLevel}
                      onChange={(e) => setFormDesireLevel(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    >
                      <option value="1">1 coração (Gostei)</option>
                      <option value="2">2 corações (Quero)</option>
                      <option value="3">3 corações (Bastante)</option>
                      <option value="4">4 corações (Desejo muito)</option>
                      <option value="5">5 corações (Meta de consumo absoluto!)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Status do Desejo</label>
                    <select
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                    >
                      {formCategory === 'gifts' ? (
                        <>
                          <option value="want">Ideia</option>
                          <option value="buying">Quero comprar</option>
                          <option value="bought">Comprado</option>
                          <option value="cancelled">Entregue</option>
                        </>
                      ) : (
                        <>
                          <option value="want">Quero comprar</option>
                          <option value="buying">Comprando</option>
                          <option value="bought">Comprado</option>
                          <option value="cancelled">Cancelado</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Descrição & Obs */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Descrição curta do produto</label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Ex: Caimento perfeito, ótimo acabamento..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Anotações e Observações Pessoais</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ex: Esperar promoção de Natal, conferir cupom..."
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-650 hover:bg-pink-700 text-white text-xs font-black uppercase tracking-wide py-3 rounded-xl transition-all"
                  >
                    {editingItem ? 'Salvar Alterações' : 'Cadastrar Desejo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-white px-5 py-3 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PERSON ADD/EDIT MODAL */}
      <AnimatePresence>
        {showPersonModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111726] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-150 dark:border-slate-850 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <User size={18} className="text-indigo-600" />
                  {editingPerson ? 'Editar Pessoa' : 'Cadastrar Pessoa'}
                </h3>
                <button onClick={() => setShowPersonModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500"><X size={16} /></button>
              </div>

              <form onSubmit={handleSavePerson} className="space-y-4 text-xs font-medium">
                
                {/* Person avatar Drag Drop */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Foto do Perfil</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handlePersonDrop}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center flex flex-col items-center justify-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-450/60'} relative`}
                  >
                    {personImageUrl ? (
                      <div className="space-y-2">
                        <img src={personImageUrl} alt="Preview Avatar" className="h-20 w-20 rounded-full object-cover mx-auto border-2 border-indigo-100 shadow-3xs" referrerPolicy="no-referrer" />
                        <button type="button" onClick={() => setPersonImageUrl('')} className="text-[11px] font-bold text-rose-500 hover:underline">Remover Foto</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-slate-400 block">Solte a foto da pessoa aqui</span>
                          <span className="text-[10px] text-slate-450 block font-sans">ou clique no botão abaixo para escolher do dispositivo</span>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer text-xs font-bold transition-all">
                          <Upload size={12} className="text-indigo-600" />
                          <span>Selecionar Arquivo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setPersonImageUrl(reader.result);
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
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Nome Completo / Apelido *</label>
                  <input
                    type="text"
                    required
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Ex: João, Mamãe, Maria, Priminho Lucas..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Idade (anos)</label>
                    <input
                      type="number"
                      value={personAge}
                      onChange={(e) => setPersonAge(e.target.value)}
                      placeholder="Ex: 12"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Data de Aniversário</label>
                    <input
                      type="text"
                      value={personBirthday}
                      onChange={(e) => setPersonBirthday(e.target.value)}
                      placeholder="Ex: 20/10 ou 15 de Maio"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Grau de Parentesco / Relação</label>
                  <input
                    type="text"
                    value={personRelationship}
                    onChange={(e) => setPersonRelationship(e.target.value)}
                    placeholder="Ex: Irmão, Mãe, Amigo, Esposa..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* SUBFORM: SPECIAL DATES SCHEDULER */}
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 font-mono">📅 Datas Comemorativas</span>
                    <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold">Agendamento Múltiplo</span>
                  </div>

                  {/* Registered dates list */}
                  {personSpecialDates.length > 0 ? (
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {personSpecialDates.map((sd) => {
                        const icon = sd.type === 'birthday' ? '🎂' 
                          : sd.type === 'christmas' ? '🎄' 
                          : sd.type === 'wedding' ? '💍' 
                          : sd.type === 'mothers_day' ? '👩' 
                          : sd.type === 'fathers_day' ? '👨' 
                          : sd.type === 'valentines' ? '❤️' 
                          : sd.type === 'graduation' ? '🎓' 
                          : '⭐';
                        return (
                          <div key={sd.id} className="bg-white dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <span>{icon}</span>
                              <span className="font-bold text-slate-700 dark:text-stone-300">{sd.label}</span>
                              <span className="text-[10px] font-mono text-slate-400">({sd.date})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPersonSpecialDates(prev => prev.filter(x => x.id !== sd.id))}
                              className="text-rose-500 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              title="Remover data"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic pl-1 font-medium">Nenhuma data especial registrada para esta pessoa.</p>
                  )}

                  {/* New date creator input block */}
                  <div className="border-t border-slate-200/50 dark:border-slate-800 pt-3 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-450 dark:text-slate-400 tracking-wider font-mono">Tipo da Data</label>
                        <select
                          id="new_date_type"
                          defaultValue="birthday"
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
                          onChange={(e) => {
                            const val = e.target.value;
                            const labelInput = document.getElementById('new_date_label') as HTMLInputElement;
                            if (labelInput) {
                              if (val === 'birthday') labelInput.value = 'Aniversário';
                              else if (val === 'christmas') labelInput.value = 'Natal';
                              else if (val === 'mothers_day') labelInput.value = 'Dia das Mães';
                              else if (val === 'fathers_day') labelInput.value = 'Dia dos Pais';
                              else if (val === 'valentines') labelInput.value = 'Dia dos Namorados';
                              else if (val === 'wedding') labelInput.value = 'Casamento';
                              else if (val === 'graduation') labelInput.value = 'Formatura';
                              else labelInput.value = '';
                            }
                          }}
                        >
                          <option value="birthday">Aniversário</option>
                          <option value="christmas">Natal</option>
                          <option value="mothers_day">Dia das Mães</option>
                          <option value="fathers_day">Dia dos Pais</option>
                          <option value="valentines">Dia dos Namorados</option>
                          <option value="wedding">Casamento</option>
                          <option value="graduation">Formatura</option>
                          <option value="other">Outro</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-450 dark:text-slate-400 tracking-wider font-mono">Data (DD/MM)</label>
                        <input
                          type="text"
                          id="new_date_val"
                          placeholder="Ex: 15/08"
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2 py-1 text-[11px] font-mono text-center focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-450 dark:text-slate-400 tracking-wider font-mono">Nome da Data (Label personalizado)</label>
                      <input
                        type="text"
                        id="new_date_label"
                        defaultValue="Aniversário"
                        placeholder="Ex: Aniversário de Namoro, Aniversário..."
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const typeSelect = document.getElementById('new_date_type') as HTMLSelectElement;
                        const dateInput = document.getElementById('new_date_val') as HTMLInputElement;
                        const labelInput = document.getElementById('new_date_label') as HTMLInputElement;
                        
                        if (dateInput && dateInput.value.trim() && labelInput && labelInput.value.trim()) {
                          const newDate: SpecialDate = {
                            id: Math.random().toString(36).substring(2, 9),
                            type: (typeSelect?.value as any) || 'birthday',
                            date: dateInput.value.trim(),
                            label: labelInput.value.trim()
                          };
                          setPersonSpecialDates(prev => [...prev, newDate]);
                          
                          // Clear only the date value
                          dateInput.value = '';
                        }
                      }}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer text-center block"
                    >
                      ➕ Adicionar Data Especial
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase">Dicas, Gostos e Observações importantes</label>
                  <textarea
                    value={personNotes}
                    onChange={(e) => setPersonNotes(e.target.value)}
                    placeholder="Ex: Gosta de ler, ama café, tamanho de camisa G, calça 42..."
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wide py-3 rounded-xl transition-all"
                  >
                    Salvar Dados
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPersonModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-white px-5 py-3 rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CLOTHING ADD SUBCATEGORY MODAL */}
      <AnimatePresence>
        {showAddSubCatModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-150 dark:border-slate-850 text-left space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <Plus size={16} className="text-pink-650" />
                  Nova Subcategoria
                </h3>
                <p className="text-[11px] text-slate-450">Adicione uma subcategoria personalizada para as suas roupas.</p>
              </div>

              <div className="space-y-1.5 text-xs font-medium">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Nome da Subcategoria</label>
                <input
                  type="text"
                  value={newSubCatName}
                  onChange={(e) => setNewSubCatName(e.target.value)}
                  placeholder="Ex: Bonés de Time, Meias, Moletons..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(); }}
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={handleAddSubCategory}
                  className="flex-1 bg-pink-650 hover:bg-pink-700 text-white text-xs font-black uppercase py-2.5 rounded-xl transition-all"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddSubCatModal(false); setNewSubCatName(''); }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* 7. CUSTOM CATEGORY ADD MODAL */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111726] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-150 dark:border-slate-850 text-left space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <Plus size={16} className="text-pink-650" />
                  Nova Categoria
                </h3>
                <p className="text-[11px] text-slate-450 dark:text-slate-500">Crie uma nova categoria para a sua lista de desejos.</p>
              </div>
 
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCatName.trim()) return;
                  const newCat: CustomCategory = {
                    id: 'custom_' + Math.random().toString(36).substring(2, 9),
                    name: newCatName.trim(),
                    emoji: newCatEmoji.trim() || '🎁',
                    color: newCatColor || 'pink'
                  };
                  updateModuleState(prev => {
                    const list = prev.customCategories || [];
                    return {
                      ...prev,
                      customCategories: [...list, newCat]
                    };
                  });
                  setNewCatName('');
                  setNewCatEmoji('🎁');
                  setNewCatColor('pink');
                  setShowAddCategoryModal(false);
                  triggerSuccess('Categoria criada com sucesso!');
                }}
                className="space-y-4 text-xs font-medium"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase">Nome da Categoria</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ex: Livros, Livros de Cabeceira, Decoração..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
 
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Emoji representativo</label>
                    <input
                      type="text"
                      required
                      value={newCatEmoji}
                      onChange={(e) => setNewCatEmoji(e.target.value)}
                      placeholder="Ex: 📚"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-center focus:ring-1 focus:ring-pink-500 focus:outline-none font-mono"
                    />
                  </div>
 
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Cor da Categoria</label>
                    <select
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none font-bold"
                    >
                      <option value="pink">Pink / Rosa 🌸</option>
                      <option value="purple">Roxo / Violeta 🍇</option>
                      <option value="indigo">Indigo / Azul Escuro 🌌</option>
                      <option value="blue">Azul / Ciano 🧊</option>
                      <option value="emerald">Verde Esmeralda 🌿</option>
                      <option value="amber">Ambar / Amarelo 🍯</option>
                      <option value="rose">Rose / Vermelho 🌹</option>
                    </select>
                  </div>
                </div>
 
                <div className="flex gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-650 hover:bg-pink-700 text-white text-xs font-black uppercase py-2.5 rounded-xl transition-all"
                  >
                    Criar Categoria
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCatName('');
                      setNewCatEmoji('🎁');
                      setNewCatColor('pink');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <button
          onClick={() => {
            clearItemForm();
            setShowItemModal(true);
          }}
          className="bg-pink-650 hover:bg-pink-700 text-white text-xs font-black tracking-wide uppercase px-5 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-pink-500/30"
          id="floating-add-item-btn"
        >
          <span>➕ Adicionar Item</span>
        </button>
      </div>
    </div>
  );
}
