import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Edit3, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar, 
  Bus, 
  Pizza, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { RedeAdolescentesData, TripPlan } from '../../types/redeAdolescentes';

interface RedePasseiosViewProps {
  data: RedeAdolescentesData;
  onUpdateData: (newData: RedeAdolescentesData) => void;
}

export const RedePasseiosView: React.FC<RedePasseiosViewProps> = ({ data, onUpdateData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<TripPlan>(data.trip);

  const people = data.trip.estimatedPeople || 1;
  const ticketTotal = (data.trip.ticketPerPerson || 0) * people;
  const transport = data.trip.transportCost || 0;
  const food = data.trip.foodCost || 0;
  const other = data.trip.otherCosts || 0;

  const totalCost = ticketTotal + transport + food + other;
  const costPerPerson = people > 0 ? totalCost / people : 0;
  const plannedRevenue = people * (data.trip.plannedFeePerPerson || 0);
  const balance = plannedRevenue - totalCost;

  const handleSave = () => {
    onUpdateData({
      ...data,
      trip: {
        ...form,
        totalCost,
        costPerPerson,
        estimatedRevenue: plannedRevenue,
        balance
      }
    });
    setIsEditing(false);
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
            <Compass className="text-sky-500" size={22} />
            <span>Passeio da Rede 2027</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento do grande passeio do ano (06/11/2027) com rateio e controle de despesas.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(data.trip);
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Edit3 size={15} />
          <span>Editar Planejamento do Passeio</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Total Previsto</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatBRL(totalCost)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Ingressos + Transporte + Comida + Outros
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Real por Pessoa</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatBRL(costPerPerson)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Rateio entre {people} participantes previstos
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">Arrecadação Prevista</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
            {formatBRL(plannedRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Cobrando {formatBRL(data.trip.plannedFeePerPerson || 0)} por pessoa
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saldo Estimado</span>
          <div className={`text-2xl font-black font-mono ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatBRL(balance)}
          </div>
          <div className="text-[11px] font-semibold">
            {balance >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} /> Saldo positivo / coberto
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1">
                <AlertCircle size={12} /> Déficit / Subsídio necessário
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Destination & Date details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin size={16} className="text-sky-500" /> Detalhes do Destino & Opções
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              📅 {data.trip.date}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Destino Selecionado</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {data.trip.destination}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {data.trip.notes || 'Local de lazer com piscina ou área verde para esportes, banho e comunhão cristã.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Opções Pré-avaliadas:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.trip.destinationOptions.map(dest => (
                <div 
                  key={dest}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    data.trip.destination.includes(dest)
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {dest}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <DollarSign size={16} className="text-teal-500" /> Composição dos Custos
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Entrada / Ingresso ({people}x)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBRL(ticketTotal)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Bus size={13} className="text-sky-500" /> Transporte / Vans</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBRL(transport)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Pizza size={13} className="text-orange-500" /> Alimentação / Churrasco</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBRL(food)}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Outros custos / Emergência</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBRL(other)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold">
              <span className="text-slate-900 dark:text-white">Total Estimado</span>
              <span className="font-mono text-sm text-sky-600 dark:text-sky-400">{formatBRL(totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Editar Planejamento do Passeio
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Destino</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Data</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pessoas Previstas</label>
                  <input
                    type="number"
                    min="1"
                    value={form.estimatedPeople}
                    onChange={(e) => setForm({ ...form, estimatedPeople: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ingresso p/ Pessoa (R$)</label>
                  <input
                    type="number"
                    step="1"
                    value={form.ticketPerPerson}
                    onChange={(e) => setForm({ ...form, ticketPerPerson: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Valor Cobrado p/ Pessoa (R$)</label>
                  <input
                    type="number"
                    step="1"
                    value={form.plannedFeePerPerson}
                    onChange={(e) => setForm({ ...form, plannedFeePerPerson: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Transporte / Vans (R$)</label>
                  <input
                    type="number"
                    step="10"
                    value={form.transportCost}
                    onChange={(e) => setForm({ ...form, transportCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alimentação Total (R$)</label>
                  <input
                    type="number"
                    step="10"
                    value={form.foodCost}
                    onChange={(e) => setForm({ ...form, foodCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Outros Custos (R$)</label>
                  <input
                    type="number"
                    step="5"
                    value={form.otherCosts}
                    onChange={(e) => setForm({ ...form, otherCosts: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Observações do Passeio</label>
                <textarea
                  rows={2}
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer shadow-sm"
              >
                Salvar Passeio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
