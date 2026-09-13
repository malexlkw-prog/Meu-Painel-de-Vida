import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Sun, CheckCircle2 } from 'lucide-react';

interface MonthFinalizeAnimationProps {
  monthName: string;
  year: number;
  onComplete: () => void;
}

export default function MonthFinalizeAnimation({
  monthName,
  year,
  onComplete
}: MonthFinalizeAnimationProps) {
  const [phase, setPhase] = useState<'finished' | 'welcome'>('finished');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('welcome');
    }, 1700);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none">
      <div className="max-w-md w-full text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'finished' ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl space-y-5 relative"
            >
              {/* Moon Glow */}
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-800 border border-indigo-400/40 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
                <Moon size={36} className="text-amber-200 fill-amber-100" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-1 -right-1 text-amber-300"
                >
                  <Sparkles size={18} />
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Mês finalizado! 🌙
                </h2>
                <p className="text-sm font-semibold text-indigo-200">
                  {monthName} de {year} arquivado com sucesso
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-950/60 border border-indigo-800/60 rounded-full text-xs text-indigo-300">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Dados de finanças e tarefas preservados</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-5 relative"
            >
              {/* Sun Glow */}
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-950 to-amber-700 border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/25 relative">
                <Sun size={38} className="text-amber-200 animate-spin-slow" />
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-amber-200"
                >
                  <Sparkles size={20} />
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Bem-vindo ao novo mês! ✨
                </h2>
                <p className="text-sm font-semibold text-amber-200">
                  Um novo ciclo pronto para novas conquistas e metas
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-950/60 border border-amber-800/60 rounded-full text-xs text-amber-300 font-medium">
                <span>Pronto para organizar seu painel</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
