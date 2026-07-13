import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, ChevronRight, Camera, Key, Check, LogOut, ArrowLeft } from 'lucide-react';

interface OnboardingWizardProps {
  initialName: string;
  onComplete: (profile: { name: string; age: string; photo: string; pin: string }) => void;
  onSignOut: () => void;
}

export default function OnboardingWizard({ 
  initialName, 
  onComplete, 
  onSignOut 
}: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(0); // 0: Welcome, 1: Name, 2: Age, 3: Photo, 4: PIN choice, 5: PIN setup, 6: Conclusion
  
  // Answers state
  const [name, setName] = useState<string>(initialName || '');
  const [age, setAge] = useState<string>('25');
  const [photo, setPhoto] = useState<string>('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Profile image upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !name.trim()) return; // Require name
    if (step === 5) {
      // Validate PIN
      if (pin.length !== 4 || isNaN(Number(pin))) {
        setPinError('O PIN deve conter exatamente 4 números!');
        return;
      }
      if (pin !== confirmPin) {
        setPinError('Os PINs digitados não coincidem!');
        return;
      }
      setPinError(null);
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step === 5) {
      setStep(4);
      return;
    }
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleFinish = () => {
    onComplete({
      name,
      age,
      photo,
      pin: hasPin ? pin : ''
    });
  };

  const ageOptions = Array.from({ length: 83 }, (_, i) => String(i + 13)); // Ages 13 to 95

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-slate-100 select-none overflow-y-auto p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0f1d] via-[#111728] to-[#1e1530] z-0" />
      <div className="absolute top-12 left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Floating Header Actions */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <LogOut size={13} />
          <span>Sair</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-[#141b2d]/85 border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl backdrop-blur-xl z-10 p-6 md:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden text-center min-h-[480px]"
      >
        <AnimatePresence mode="wait">
          {/* STEP 0: WELCOME */}
          {step === 0 && (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 my-auto"
            >
              <div className="text-6xl animate-bounce">🐑</div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  Olá! Seja muito bem-vindo!
                </h2>
                <p className="text-sm text-slate-350 leading-relaxed max-w-sm mx-auto font-medium">
                  Eu sou o <strong className="text-indigo-400 font-extrabold">Sete</strong>, seu carneirinho assistente pessoal no Meu Painel de Vida.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mt-2">
                  Vou fazer algumas perguntas rápidas para personalizar seu novo painel em poucos minutos.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-650 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>Começar</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: NAME */}
          {step === 1 && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 my-auto text-left"
            >
              <div className="text-center">
                <div className="text-4xl">🐑</div>
                <h3 className="text-lg font-bold text-white mt-2">Como você gostaria de ser chamado?</h3>
                <p className="text-xs text-slate-400 mt-1">Este nome será exibido no topo do seu Painel de Vida.</p>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white font-bold text-center focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Seu nome de exibição (ex: Marcos)"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-center max-w-sm mx-auto pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!name.trim()}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
                >
                  <span>Continuar</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AGE */}
          {step === 2 && (
            <motion.div
              key="step-age"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 my-auto text-left"
            >
              <div className="text-center">
                <div className="text-4xl">🐑</div>
                <h3 className="text-lg font-bold text-white mt-2">Qual é a sua idade?</h3>
                <p className="text-xs text-slate-400 mt-1">Apenas para ajustar algumas preferências básicas de estudos e treinos.</p>
              </div>

              <div className="max-w-xs mx-auto">
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#1c2438] border border-white/10 rounded-xl px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  {ageOptions.map((v) => (
                    <option key={v} value={v}>
                      {v} anos
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-center max-w-sm mx-auto pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Continuar</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PHOTO */}
          {step === 3 && (
            <motion.div
              key="step-photo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 my-auto text-left"
            >
              <div className="text-center">
                <div className="text-4xl">🐑</div>
                <h3 className="text-lg font-bold text-white mt-2">Deseja adicionar uma foto de perfil?</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">A foto é totalmente opcional e pode ser pulada.</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-800 flex items-center justify-center shrink-0 shadow-lg">
                  {photo ? (
                    <img src={photo} alt="Visualização" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-indigo-400">{name[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-95 shadow-sm inline-flex items-center gap-1">
                    <Camera size={14} />
                    <span>Escolher foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  {photo && (
                    <button
                      onClick={() => setPhoto('')}
                      className="border border-white/10 hover:bg-white/5 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-all"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-center max-w-sm mx-auto pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <span>{photo ? 'Continuar' : 'Pular'}</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PIN CHOICE */}
          {step === 4 && (
            <motion.div
              key="step-pin-choice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 my-auto text-left"
            >
              <div className="text-center">
                <div className="text-4xl">🐑</div>
                <h3 className="text-lg font-bold text-white mt-2">Deseja proteger seu painel com um PIN de 4 dígitos?</h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  O PIN será solicitado sempre que você acessar sua conta neste dispositivo, mantendo seus dados protegidos de olhares curiosos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    setHasPin(true);
                    setStep(5);
                  }}
                  className="flex-1 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 border border-indigo-500/30"
                >
                  <Key size={14} />
                  <span>Criar PIN</span>
                </button>
                <button
                  onClick={() => {
                    setHasPin(false);
                    setPin('');
                    setStep(6);
                  }}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Agora não</span>
                </button>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Voltar</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: PIN SETUP */}
          {step === 5 && (
            <motion.div
              key="step-pin-setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 my-auto text-left"
            >
              <div className="text-center">
                <div className="text-4xl">🐑</div>
                <h3 className="text-lg font-bold text-white mt-2">Defina seu PIN de 4 dígitos</h3>
                <p className="text-xs text-slate-400 mt-1">Guarde esse número! Ele protege seu painel.</p>
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 block">Digite o PIN (4 números)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#1b233a] border border-white/10 rounded-xl px-3 py-2.5 text-center text-sm font-black tracking-widest text-white outline-none focus:border-indigo-500"
                    placeholder="••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 block">Confirme o PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#1b233a] border border-white/10 rounded-xl px-3 py-2.5 text-center text-sm font-black tracking-widest text-white outline-none focus:border-indigo-500"
                    placeholder="••••"
                  />
                </div>

                {pinError && (
                  <p className="text-[11px] text-rose-400 font-bold text-center bg-rose-500/10 py-1.5 px-3 rounded-lg border border-rose-500/20">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-center max-w-sm mx-auto pt-2">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={12} />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Salvar PIN</span>
                  <Check size={12} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CONCLUSION */}
          {step === 6 && (
            <motion.div
              key="step-conclusion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 my-auto"
            >
              <div className="text-6xl animate-bounce">🐑🎉</div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  Pronto! Tudo preparado!
                </h2>
                <p className="text-sm text-slate-300 max-w-sm mx-auto font-semibold mt-1">
                  Seu Painel de Vida está inteiramente preparado para você, <strong className="text-indigo-400 font-bold">{name}</strong>.
                </p>
                <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto mt-2">
                  Agora você tem um ambiente totalmente pessoal, privativo e criptografado na nuvem para organizar o seu dia a dia.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-650 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>Entrar no Painel</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
