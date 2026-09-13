import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Heart, 
  UserCheck, 
  UserPlus, 
  Clock, 
  Phone, 
  User, 
  Shirt, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { RedeAdolescentesData, RedeParticipant, ParticipantFunnelStage } from '../../types/redeAdolescentes';

interface RedeParticipantesViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedeParticipantesView: React.FC<RedeParticipantesViewProps> = ({ data, onUpdateData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<RedeParticipant | null>(null);

  // Funnel Counts based strictly on real participant data
  const counts = useMemo(() => {
    const list = data.participants;
    return {
      convidados: list.filter(p => p.status === 'convidado').length,
      primeiroContato: list.filter(p => p.status === 'primeiro_contato').length,
      participaram: list.filter(p => p.status === 'participou').length,
      retornaram: list.filter(p => p.status === 'retornou').length,
      alcancados: list.filter(p => p.status === 'alcancado').length,
      integrados: list.filter(p => p.status === 'integrado').length,
      totalAlcancadosOuIntegrados: list.filter(p => p.status === 'alcancado' || p.status === 'integrado').length
    };
  }, [data.participants]);

  const filteredParticipants = useMemo(() => {
    return data.participants.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.guardian && p.guardian.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.invitedBy && p.invitedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.howDidTheyKnow && p.howDidTheyKnow.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStage = stageFilter === 'todos' || p.status === stageFilter;
      return matchSearch && matchStage;
    });
  }, [data.participants, searchTerm, stageFilter]);

  const handleOpenAdd = () => {
    const newP: RedeParticipant = {
      id: `part-${Date.now()}`,
      name: '',
      age: undefined,
      guardian: '',
      contact: '',
      entryDate: new Date().toLocaleDateString('pt-BR'),
      howDidTheyKnow: '',
      eventsAttended: [],
      status: 'primeiro_contato',
      invitedBy: '',
      shirtSize: '',
      paymentsStatus: 'Pendente',
      teamAssigned: '',
      frequency: 'Semanal',
      notes: ''
    };
    setEditingParticipant(newP);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: RedeParticipant) => {
    setEditingParticipant({ ...p });
    setModalOpen(true);
  };

  const handleSaveParticipant = () => {
    if (!editingParticipant || !editingParticipant.name.trim()) return;

    const exists = data.participants.some(p => p.id === editingParticipant.id);
    let updated = [];
    if (exists) {
      updated = data.participants.map(p => p.id === editingParticipant.id ? editingParticipant : p);
    } else {
      updated = [editingParticipant, ...data.participants];
    }

    onUpdateData({
      ...data,
      participants: updated
    });
    setModalOpen(false);
    setEditingParticipant(null);
  };

  const handleDeleteParticipant = (id: string) => {
    if (confirm('Tem certeza que deseja excluir o cadastro deste adolescente?')) {
      const updated = data.participants.filter(p => p.id !== id);
      onUpdateData({
        ...data,
        participants: updated
      });
    }
  };

  const getStageBadge = (stage: ParticipantFunnelStage) => {
    switch (stage) {
      case 'convidado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Convidado</span>;
      case 'primeiro_contato':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">1º Contato</span>;
      case 'participou':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Participou</span>;
      case 'retornou':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Retornou</span>;
      case 'alcancado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Alcançado para Cristo</span>;
      case 'integrado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Integrado à Igreja</span>;
      default:
        return null;
    }
  };

  const progressPercent = Math.min(100, Math.round((counts.totalAlcancadosOuIntegrados / data.reachGoal) * 100));

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-rose-500" size={22} />
            <span>Participantes & Meta de Alcance 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Acompanhamento individual de cada adolescente alcançado, acolhido e integrado à igreja.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <UserPlus size={15} />
          <span>Cadastrar Adolescente</span>
        </button>
      </div>

      {/* Meta de Alcance 2027 Card */}
      <div className="bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-md text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
              <Target size={14} className="text-rose-400" /> Meta Principal do Ano
            </span>
            <h3 className="text-xl font-black text-white">
              Alcançar 10 adolescentes para a igreja
            </h3>
            <p className="text-xs text-slate-300">
              O progresso é atualizado conforme adolescentes alcançados e integrados são registrados.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center justify-center shrink-0">
            <div className="text-3xl font-black text-rose-400 flex items-baseline gap-1">
              <span>{counts.totalAlcancadosOuIntegrados}</span>
              <span className="text-base text-slate-400">/ {data.reachGoal}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-300 mt-0.5">
              adolescentes alcançados ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>0</span>
            <span>Meta: {data.reachGoal} jovens</span>
          </div>
        </div>

        {/* Funnel Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Convidados</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.convidados}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-blue-400">1º Contato</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.primeiroContato}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-indigo-400">Participaram</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.participaram}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-amber-400">Retornaram</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.retornaram}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Alcançados</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.alcancados}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase font-bold text-purple-400">Integrados</div>
            <div className="text-lg font-black text-white mt-0.5">{counts.integrados}</div>
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
            placeholder="Buscar por nome, quem convidou, responsável..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['todos', 'convidado', 'primeiro_contato', 'participou', 'retornou', 'alcancado', 'integrado'].map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                stageFilter === st
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Participants List */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParticipants.map(participant => (
            <div
              key={participant.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {participant.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {participant.age ? `${participant.age} anos` : 'Idade não informada'} 
                      {participant.entryDate ? ` • Desde ${participant.entryDate}` : ''}
                    </p>
                  </div>
                  {getStageBadge(participant.status)}
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {participant.guardian && (
                    <p><strong className="text-slate-400">Responsável:</strong> {participant.guardian}</p>
                  )}
                  {participant.contact && (
                    <p className="flex items-center gap-1.5"><Phone size={12} className="text-emerald-500" /> {participant.contact}</p>
                  )}
                  {participant.invitedBy && (
                    <p><strong className="text-slate-400">Convidado por:</strong> {participant.invitedBy}</p>
                  )}
                  {participant.howDidTheyKnow && (
                    <p><strong className="text-slate-400">Como conheceu:</strong> {participant.howDidTheyKnow}</p>
                  )}
                  {participant.shirtSize && (
                    <p className="flex items-center gap-1.5"><Shirt size={12} className="text-indigo-500" /> Camisa: {participant.shirtSize}</p>
                  )}
                </div>

                {participant.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    {participant.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-mono">Frequência:</span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{participant.frequency || 'Livre'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(participant)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Editar participante"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteParticipant(participant.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Excluir participante"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Nenhum adolescente cadastrado ainda
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            A lista está limpa conforme solicitado, pronta para receber os registros reais conforme o projeto for iniciado em 2027.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            <UserPlus size={14} />
            <span>Cadastrar Primeiro Adolescente</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingParticipant.name ? 'Editar Participante' : 'Novo Adolescente'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={editingParticipant.name}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                    placeholder="Nome do adolescente"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Idade</label>
                  <input
                    type="number"
                    value={editingParticipant.age || ''}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, age: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Ex: 14"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Status / Acompanhamento</label>
                <select
                  value={editingParticipant.status}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, status: e.target.value as ParticipantFunnelStage })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="convidado">Convidado</option>
                  <option value="primeiro_contato">Primeiro Contato</option>
                  <option value="participou">Participou de Encontro</option>
                  <option value="retornou">Retornou aos Encontros</option>
                  <option value="alcancado">Alcançado para Cristo</option>
                  <option value="integrado">Integrado à Igreja</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editingParticipant.guardian || ''}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, guardian: e.target.value })}
                    placeholder="Nome do pai / mãe / responsável"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contato / Telefone</label>
                  <input
                    type="text"
                    value={editingParticipant.contact || ''}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, contact: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Convidado Por</label>
                  <input
                    type="text"
                    value={editingParticipant.invitedBy || ''}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, invitedBy: e.target.value })}
                    placeholder="Quem convidou"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tamanho da Camisa</label>
                  <input
                    type="text"
                    value={editingParticipant.shirtSize || ''}
                    onChange={(e) => setEditingParticipant({ ...editingParticipant, shirtSize: e.target.value })}
                    placeholder="Ex: P, M, G, GG"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Como conheceu a Rede?</label>
                <input
                  type="text"
                  value={editingParticipant.howDidTheyKnow || ''}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, howDidTheyKnow: e.target.value })}
                  placeholder="Ex: Colega de escola, convite no culto, vizinho..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observações Pessoais</label>
                <textarea
                  rows={2}
                  value={editingParticipant.notes || ''}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, notes: e.target.value })}
                  placeholder="Pedidos de oração, histórico, observações de acolhimento..."
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
                onClick={handleSaveParticipant}
                disabled={!editingParticipant.name.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm disabled:opacity-50"
              >
                Salvar Participante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
