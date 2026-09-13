import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Shield, 
  Heart, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';
import { RedeAdolescentesData, TeamMember } from '../../types/redeAdolescentes';

interface RedeEquipeViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeEquipeView: React.FC<RedeEquipeViewProps> = ({ data, onUpdateData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleOpenAdd = () => {
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: '',
      role: 'Equipe de Apoio',
      responsibility: '',
      contact: '',
      notes: ''
    };
    setEditingMember(newMember);
    setModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setModalOpen(true);
  };

  const handleSaveMember = () => {
    if (!editingMember || !editingMember.name.trim()) return;

    const exists = data.team.some(m => m.id === editingMember.id);
    let updated = [];
    if (exists) {
      updated = data.team.map(m => m.id === editingMember.id ? editingMember : m);
    } else {
      updated = [...data.team, editingMember];
    }

    onUpdateData({
      ...data,
      team: updated
    });
    setModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Deseja realmente remover este integrante da equipe da Rede?')) {
      const updated = data.team.filter(m => m.id !== id);
      onUpdateData({
        ...data,
        team: updated
      });
    }
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-purple-500" size={22} />
            <span>Equipe da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organização, liderança, acolhimento e atribuições para o projeto.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus size={15} />
          <span>Adicionar Integrante</span>
        </button>
      </div>

      {/* Info note */}
      <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info size={18} className="text-purple-500 shrink-0 mt-0.5" />
        <p>
          Equipe inicial pré-cadastrada conforme planejamento: <strong>Eu, Meu pai, Minha mãe, Líderes, Lucas e Guilherme</strong>. Todos os nomes, funções e responsabilidades são editáveis e novos membros podem ser integrados a qualquer momento.
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.team.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black text-sm flex items-center justify-center shrink-0 border border-purple-500/20">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Editar integrante"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Excluir integrante"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Responsibility */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Responsabilidades
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {member.responsibility || 'Sem atribuições específicas detalhadas.'}
                </p>
              </div>

              {/* Contact / Notes */}
              {member.contact && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone size={12} className="text-emerald-500" />
                  <span>{member.contact}</span>
                </p>
              )}

              {member.notes && (
                <p className="text-[11px] text-slate-400 italic">
                  Obs: {member.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Liderança & Organização</span>
              <span>2027</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingMember.name ? 'Editar Integrante' : 'Novo Integrante da Equipe'}
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="Nome do integrante"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Função / Papel</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="Ex: Coordenação Geral, Apoio, Louvor, Lanches"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsabilidades</label>
                <textarea
                  rows={3}
                  value={editingMember.responsibility}
                  onChange={(e) => setEditingMember({ ...editingMember, responsibility: e.target.value })}
                  placeholder="O que esta pessoa lidera ou cuida nos encontros e eventos..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contato / Telefone</label>
                <input
                  type="text"
                  value={editingMember.contact || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, contact: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observações</label>
                <input
                  type="text"
                  value={editingMember.notes || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  placeholder="Anotações gerais..."
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
                onClick={handleSaveMember}
                disabled={!editingMember.name.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Integrante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
