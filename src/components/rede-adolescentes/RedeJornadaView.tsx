import React from 'react';
import { 
  Award, 
  ArrowDown, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Send,
  Compass
} from 'lucide-react';
import { RedeAdolescentesData } from '../../types/redeAdolescentes';

interface RedeJornadaViewProps {
  data: RedeAdolescentesData;
}

export const RedeJornadaView: React.FC<RedeJornadaViewProps> = ({ data }) => {
  const steps = [
    {
      num: 1,
      title: 'ALCANÇAR',
      subtitle: 'Evangelismo & Convite',
      desc: 'Atrair e despertar o interesse de adolescentes que ainda não conhecem a Cristo ou não frequentam a igreja.',
      color: 'from-amber-500 to-orange-500',
      icon: Target
    },
    {
      num: 2,
      title: 'ACOLHER',
      subtitle: 'Comunhão & Pertencimento',
      desc: 'Receber com carinho, amizade sincera, dinâmicas leves e ambiente acolhedor, integrando-o à turma.',
      color: 'from-rose-500 to-pink-500',
      icon: Heart
    },
    {
      num: 3,
      title: 'ENSINAR',
      subtitle: 'Fundamento Bíblico Sólido',
      desc: 'Ministrar as verdades da Palavra de Deus: Primeiros Passos, Evangelho de Mateus, Antigo Testamento e Sabedoria de Provérbios.',
      color: 'from-emerald-500 to-teal-500',
      icon: BookOpen
    },
    {
      num: 4,
      title: 'DESENVOLVER',
      subtitle: 'Maturidade & Liderança',
      desc: 'Fortalecer a vida de oração, carácter cristão, superação de desafios da adolescência e maturidade espiritual.',
      color: 'from-indigo-500 to-blue-500',
      icon: Sparkles
    },
    {
      num: 5,
      title: 'ENVIAR',
      subtitle: 'Testemunho & Multiplicação',
      desc: 'Capacitar os próprios adolescentes a compartilharem a Palavra (Marcos 16:15) e liderarem novos encontros.',
      color: 'from-purple-500 to-violet-600',
      icon: Send
    }
  ];

  return (
    <div className="space-y-8 text-left animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="text-rose-500" size={22} />
          <span>Jornada do Adolescente & Identidade Espiritual</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Visão formativa contínua: de um jovem alcançado a um discípulo que compartilha o Evangelho.
        </p>
      </div>

      {/* Main Spiritual Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-8 shadow-xl text-white space-y-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
            {data.identity.themeVerseRef}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white italic">
          “{data.identity.theme}”
        </h3>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
          “{data.identity.themeVerseText}”
        </p>

        <div className="pt-2 text-xs text-slate-400">
          <strong>Propósito Principal:</strong> {data.identity.purpose}
        </div>
      </div>

      {/* 5-Step Funnel Diagram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Compass size={16} className="text-indigo-500" /> Etapas do Desenvolvimento (Funil de Formação)
          </h3>
          <span className="text-[11px] text-slate-400">Jornada 2027</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div 
                key={st.num}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 relative group hover:border-indigo-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs flex items-center justify-center text-slate-600 dark:text-slate-300">
                      0{st.num}
                    </span>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${st.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon size={16} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {st.title}
                    </h4>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {st.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700 pointer-events-none">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Road of Cycles Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-500" /> A Linha do Tempo Espiritual em 2027
        </h3>

        <div className="relative pl-6 space-y-6 border-l-2 border-indigo-500/20 ml-2">
          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">Fevereiro e Março</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Ciclo 1: Primeiros Passos na Fé</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Construção das bases da fé cristã: Identidade em Deus, Trindade, Relacionamentos, Pecado, Fé e Maturidade. Conclui com o <strong>Cinema na Igreja</strong>.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">Abril e Maio</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Ciclo 2: O Evangelho de Mateus (1 a 28)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Conhecendo a vida, ensinamentos, milagres, morte e ressurreição de Jesus Cristo. Conclui com a empolgante <strong>1ª Gincana da Rede</strong>.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">Junho, Agosto e Setembro</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Ciclo 3: A Grande História da Bíblia (Antigo Testamento)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Criação, Patriarcas, Êxodo, Juízes, Reis e Profecias messiânicas. Interrompido pelas férias de Julho e selado com a <strong>Noite com Deus</strong>.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-slate-900" />
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">Setembro e Outubro</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Ciclo 4: Sabedoria Prática para a Vida (Provérbios 1 a 31)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Amizades, escolhas, palavras, disciplina e futuro sob a direção de Deus. Seguido do <strong>Passeio da Rede</strong>.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">Novembro e Dezembro</div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Ciclo 5 & O Grande Envio: Adolescentes em Ação</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Não se distraia e seja forte! Os adolescentes pregam a Palavra aos seus amigos (Mc 16:15), culminando na <strong>2ª Gincana + Confraternização Final</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
