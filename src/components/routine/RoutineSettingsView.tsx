import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { RoutineActivity, RoutineSettings } from '../../types';
import { requestNotificationPermission, triggerBrowserNotification } from '../../utils/routineUtils';

interface RoutineSettingsViewProps {
  settings: RoutineSettings;
  activities: RoutineActivity[];
  onUpdateSettings: (newSettings: RoutineSettings) => void;
  onOpenAddActivity: () => void;
  onOpenEditActivity: (activity: RoutineActivity) => void;
  onDeleteActivity: (id: string) => void;
  onReorderActivity: (index: number, direction: 'up' | 'down') => void;
}

const WEEKDAYS = [
  { id: 0, label: 'Dom', fullName: 'Domingo' },
  { id: 1, label: 'Seg', fullName: 'Segunda-feira' },
  { id: 2, label: 'Ter', fullName: 'Terça-feira' },
  { id: 3, label: 'Qua', fullName: 'Quarta-feira' },
  { id: 4, label: 'Qui', fullName: 'Quinta-feira' },
  { id: 5, label: 'Sex', fullName: 'Sexta-feira' },
  { id: 6, label: 'Sáb', fullName: 'Sábado' }
];

export default function RoutineSettingsView({
  settings,
  activities,
  onUpdateSettings,
  onOpenAddActivity,
  onOpenEditActivity,
  onDeleteActivity,
  onReorderActivity
}: RoutineSettingsViewProps) {

  const handleToggleNotifications = async () => {
    if (!settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        onUpdateSettings({ ...settings, notificationsEnabled: true });
        triggerBrowserNotification('Notificações de Rotina Ativadas', 'Você receberá avisos quando chegar o horário de cada atividade!');
      } else {
        alert('Permissão para notificações não foi autorizada no navegador. Verifique as configurações de permissão da página.');
      }
    } else {
      onUpdateSettings({ ...settings, notificationsEnabled: false });
    }
  };

  const toggleDayRoutine = (dayId: number) => {
    const activeDays = settings.activeRoutineDays || [0, 1, 2, 3, 4, 5, 6];
    if (activeDays.includes(dayId)) {
      if (activeDays.length > 1) {
        onUpdateSettings({
          ...settings,
          activeRoutineDays: activeDays.filter(d => d !== dayId)
        });
      }
    } else {
      onUpdateSettings({
        ...settings,
        activeRoutineDays: [...activeDays, dayId].sort()
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. NOTIFICAÇÕES E LEMBRETES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-indigo-500" />
              Notificações e Avisos de Atividades
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receba alertas no horário exato de cada atividade da sua rotina
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleNotifications}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
              settings.notificationsEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
            }`}
          >
            {settings.notificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
            <span>{settings.notificationsEnabled ? 'Notificações Ativas' : 'Ativar Notificações'}</span>
          </button>
        </div>

        {/* Antecedência e Som */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Antecedência */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-500" />
              Antecedência do Lembrete:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, leadTimeMinutes: mins })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    settings.leadTimeMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {mins === 0 ? 'Na hora' : `${mins} min antes`}
                </button>
              ))}
            </div>
          </div>

          {/* Som de Alerta */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Volume2 size={14} className="text-indigo-500" />
                Alerta Sonoro Suave
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Toca um tom harmonioso ao disparar o aviso
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Technical Transparency Note (Requirement 3) */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold block">Como as notificações funcionam no seu navegador:</span>
            <p>
              As notificações emitem alertas em segundo plano com som enquanto o aplicativo estiver aberto em uma aba (mesmo minimizado ou em outra janela).
              Por limitações de segurança e arquitetura dos navegadores Web (sem servidor push externo dedicado conectado a tokens FCM), notificações <strong>não disparam com o navegador 100% encerrado/fechado</strong>. Mantenha o navegador aberto para não perder nenhum horário!
            </p>
          </div>
        </div>
      </div>

      {/* 2. DIAS ATIVOS DA ROTINA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            Dias da Semana com Rotina Ativa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dias desativados não quebram sua ofensiva e não geram atividades pendentes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {WEEKDAYS.map((w) => {
            const isActive = (settings.activeRoutineDays || [0, 1, 2, 3, 4, 5, 6]).includes(w.id);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => toggleDayRoutine(w.id)}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                }`}
              >
                <span className="block font-black">{w.label}</span>
                <span className="text-[10px] opacity-80">{isActive ? 'Ativo' : 'Folga'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. GERENCIADOR DE ATIVIDADES DA ROTINA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-indigo-500" />
              Editar Modelo de Atividades ({activities.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Altere horários, adicione novas etapas ou reordene conforme seu ritmo diário.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddActivity}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Adicionar Atividade</span>
          </button>
        </div>

        {/* Activities Table/List */}
        <div className="space-y-2">
          {activities.map((act, index) => (
            <div
              key={act.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 flex items-center justify-between gap-3 transition-colors hover:border-indigo-500/40"
            >
              {/* Order buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onReorderActivity(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Mover para cima"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  disabled={index === activities.length - 1}
                  onClick={() => onReorderActivity(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Mover para baixo"
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              {/* Time & Title */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                    {act.startTime} {act.endTime ? `– ${act.endTime}` : ''}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {act.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{act.durationMinutes || 30} min</span>
                  <span>•</span>
                  <span>{act.daysOfWeek.length === 7 ? 'Todos os dias' : `${act.daysOfWeek.length} dias/sem`}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenEditActivity(act)}
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Excluir "${act.name}" da rotina diária?`)) {
                      onDeleteActivity(act.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
