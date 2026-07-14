import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Check, HelpCircle } from 'lucide-react';

interface SeteTutorialProps {
  currentStepIndex: number;
  onStepIndexChange: (index: number) => void;
  onStepChange: (tabId: string) => void;
  onComplete: () => void;
}

interface Step {
  id: string;
  tabId: string;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    id: 'intro',
    tabId: 'dashboard',
    title: '🐑 Olá, que alegria te ver aqui!',
    text: 'Eu sou o Sete, seu carneirinho assistente! Estou aqui para te ajudar a gerenciar sua rotina. Vamos fazer um tour rápido para você conhecer seu novo Painel de Vida?'
  },
  {
    id: 'organization',
    tabId: 'organization',
    title: '📋 Organização',
    text: 'Aqui você organiza suas tarefas, cronogramas, calendário, lembretes e outras informações importantes do seu dia.'
  },
  {
    id: 'studies',
    tabId: 'studies',
    title: '📚 Estudos',
    text: 'Aqui você acompanha sua vida escolar, seus estudos pessoais e organiza tudo relacionado aos estudos.'
  },
  {
    id: 'gym',
    tabId: 'gym',
    title: '🏋️ Treino',
    text: 'Aqui você monta fichas de treino, registra sua evolução e acompanha suas metas.'
  },
  {
    id: 'finance',
    tabId: 'finance',
    title: '💰 Vida Financeira',
    text: 'Aqui você controla seus gastos, ganhos, compras e produtos desejados.'
  },
  {
    id: 'bible',
    tabId: 'bible',
    title: '⛪ Igreja',
    text: 'Aqui você acompanha sua leitura bíblica, planos de leitura e organiza seus compromissos da igreja.'
  },
  {
    id: 'entertainment',
    tabId: 'entertainment',
    title: '🎬 Entretenimento',
    text: 'Aqui você organiza filmes, séries, animes, músicas e outros conteúdos.'
  },
  {
    id: 'catalogs',
    tabId: 'catalogs',
    title: '📂 Catálogos',
    text: 'Aqui você organiza informações como repertórios da igreja, livros, filmes, músicas e qualquer outro catálogo personalizado.'
  },
  {
    id: 'sete',
    tabId: 'sete',
    title: '🤖 Sete IA',
    text: 'Aqui você conversa comigo! Posso ajudar a organizar seu painel, responder perguntas e auxiliar no dia a dia.'
  },
  {
    id: 'conclusion',
    tabId: 'dashboard',
    title: '🎉 Tudo Pronto!',
    text: 'Pronto! Agora você já conhece o seu Painel de Vida. Aproveite e personalize tudo do seu jeito!'
  }
];

export default function SeteTutorial({ currentStepIndex, onStepIndexChange, onStepChange, onComplete }: SeteTutorialProps) {
  const currentStep = STEPS[currentStepIndex];

  useEffect(() => {
    onStepChange(currentStep.tabId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      onStepIndexChange(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onStepIndexChange(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/55 dark:bg-slate-950/75 backdrop-blur-xs z-[10000] flex items-end justify-center p-4 md:p-6 md:items-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative flex flex-col md:flex-row items-center md:items-start gap-5 pointer-events-auto text-left"
        id="sete-tutorial-container"
      >
        {/* Floating sheep avatar */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-lg relative border-4 border-white dark:border-slate-900 overflow-hidden group">
          <motion.span 
            animate={{ 
              y: [0, -4, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="select-none"
          >
            🐑
          </motion.span>
          <div className="absolute inset-x-0 bottom-0 bg-black/25 py-0.5 text-center text-[9px] font-black uppercase text-indigo-200 tracking-wider">
            Sete
          </div>
        </div>

        {/* Content & Steps */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles size={11} className="animate-spin" />
                <span>Tutorial Guiado</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {currentStepIndex + 1} de {STEPS.length}
              </span>
            </div>
            
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-1">
              {currentStep.title}
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
              {currentStep.text}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`px-3 py-2 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-800 transition-all flex items-center gap-1 ${
                currentStepIndex === 0 
                  ? 'opacity-35 cursor-not-allowed text-slate-400' 
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 cursor-pointer active:scale-95'
              }`}
            >
              <ArrowLeft size={13} />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-black bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl shadow-md shadow-indigo-500/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {currentStepIndex === 0 ? (
                <>
                  <span>Vamos conhecer meu Painel de Vida</span>
                  <ArrowRight size={13} />
                </>
              ) : currentStepIndex === STEPS.length - 1 ? (
                <>
                  <span>🚀 Finalizar e Entrar no Painel</span>
                </>
              ) : (
                <>
                  <span>Próxima aba</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
