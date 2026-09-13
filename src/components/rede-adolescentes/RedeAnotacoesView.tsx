import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Tag, 
  Edit3, 
  Trash2, 
  Calendar, 
  Lightbulb, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { RedeAdolescentesData, RedeProjectNote, NoteCategory } from '../../types/redeAdolescentes';

interface RedeAnotacoesViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeAnotacoesView: React.FC<RedeAnotacoesViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<RedeProjectNote | null>(null);

  const categories: NoteCategory[] = [
    'Ideias',
    'Decisões tomadas',
    'Sugestões',
    'Pesquisas',
    'Conversas com pais',
    'Observações'
  ];

  const filteredNotes = useMemo(() => {
    return data.notes.filter(n => {
      const matchSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchCategory = categoryFilter === 'todos' || n.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [data.notes, searchTerm, categoryFilter]);

  const handleOpenAdd = () => {
    const newNote: RedeProjectNote = {
      id: `note-${Date.now()}`,
      title: '',
      category: 'Ideias',
      date: new Date().toLocaleDateString('pt-BR'),
      content: '',
      tags: []
    };
    setEditingNote(newNote);
    setModalOpen(true);
  };

  const handleOpenEdit = (n: RedeProjectNote) => {
    setEditingNote({ ...n });
    setModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!editingNote || !editingNote.title.trim()) return;

    const exists = data.notes.some(n => n.id === editingNote.id);
    let updated = [];
    if (exists) {
      updated = data.notes.map(n => n.id === editingNote.id ? editingNote : n);
    } else {
      updated = [editingNote, ...data.notes];
    }

    onUpdateData({ ...data, notes: updated });
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Deseja excluir esta anotação?')) {
      onUpdateData({
        ...data,
        notes: data.notes.filter(n => n.id !== id)
      });
    }
  };

  const getCategoryColor = (cat: NoteCategory) => {
    switch (cat) {
      case 'Decisões tomadas':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Ideias':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Sugestões':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Conversas com pais':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Pesquisas':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-amber-500" size={22} />
            <span>Ideias & Anotações da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Espaço para brainstorm, decisões pastorais, conversas com pais e alinhamentos da equipe.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Nova Anotação</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar anotação ou tag..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['todos', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === c
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {c === 'todos' ? 'Todas' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map(n => (
          <div
            key={n.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(n.category)}`}>
                  {n.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {n.date}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {n.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {n.content}
              </p>

              {n.tags && n.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {n.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
              <button
                onClick={() => handleOpenEdit(n)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Editar anotação"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => handleDeleteNote(n.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                title="Excluir anotação"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            Nenhuma anotação encontrada para os filtros selecionados.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingNote.title ? 'Editar Anotação' : 'Nova Anotação'}
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Título *</label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="Título da anotação..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={editingNote.category}
                    onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value as NoteCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Data</label>
                  <input
                    type="text"
                    value={editingNote.date}
                    onChange={(e) => setEditingNote({ ...editingNote, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Conteúdo</label>
                <textarea
                  rows={5}
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  placeholder="Escreva detalhes, acordos, ideias, contatos..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={editingNote.tags?.join(', ') || ''}
                  onChange={(e) => setEditingNote({
                    ...editingNote,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="ex: cinema, pais, louvor, gincana"
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
                onClick={handleSaveNote}
                disabled={!editingNote.title.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Anotação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
