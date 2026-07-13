import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Lock, Delete, RotateCcw, AlertTriangle, ShieldCheck, HelpCircle, Eye, EyeOff, LogOut } from 'lucide-react';

interface LockScreenProps {
  correctPin: string;
  onUnlock: () => void;
  onResetPinWithPassword: (password: string) => Promise<boolean>;
  onSignOut: () => void;
  isGoogleUser?: boolean;
}

export default function LockScreen({ 
  correctPin, 
  onUnlock, 
  onResetPinWithPassword, 
  onSignOut,
  isGoogleUser = false
}: LockScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState<boolean>(false);
  const [recoveryPassword, setRecoveryPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingRecovery, setLoadingRecovery] = useState<boolean>(false);
  const controls = useAnimation(); // For the shake animation
  const containerRef = useRef<HTMLDivElement>(null);

  // Key listeners for physical typing
  useEffect(() => {
    // Initial mount animation
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showRecovery) return; // Disable PIN typing on password recovery screen
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, showRecovery]);

  const handleDigitPress = (digit: string) => {
    if (errorMsg) setErrorMsg(null);
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (errorMsg) setErrorMsg(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (errorMsg) setErrorMsg(null);
    setPin('');
  };

  const handleConfirm = async () => {
    const currentPin = pin;
    if (currentPin === correctPin) {
      // Save unlock state to sessionStorage
      sessionStorage.setItem('lifehub_unlocked', 'true');
      onUnlock();
    } else {
      // Trigger errored state shake
      setErrorMsg('PIN incorreto. Tente novamente.');
      setPin(''); // Automatically clear PIN digits
      
      // Execute shaking effect via motion
      await controls.start({
        x: [-8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.4, ease: 'easeInOut' }
      });
    }
  };

  // Perform auto-confirmation if exactly 4 digits are completed
  useEffect(() => {
    if (pin.length === 4) {
      const timeout = setTimeout(() => {
        handleConfirm();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [pin]);

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!recoveryPassword.trim()) {
      setErrorMsg('Por favor, digite a sua senha.');
      return;
    }

    setLoadingRecovery(true);
    try {
      const success = await onResetPinWithPassword(recoveryPassword);
      if (success) {
        sessionStorage.setItem('lifehub_unlocked', 'true');
        onUnlock();
      } else {
        setErrorMsg('Senha incorreta! Não foi possível redefinir o PIN.');
        await controls.start({
          x: [-6, 6, -4, 4, 0],
          transition: { duration: 0.3 }
        });
      }
    } catch (err) {
      setErrorMsg('Falha ao autenticar. Tente novamente.');
    } finally {
      setLoadingRecovery(false);
    }
  };

  const KEYBOARD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white select-none overflow-hidden"
    >
      {/* Background Animated Gradient / Blob elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animate-duration-[10s]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animate-duration-[8s]" />

      {/* Main Container Glassmorphism Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={controls}
        className="w-full max-w-sm px-6 py-8 mx-4 bg-white/5 dark:bg-slate-900/40 border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl backdrop-blur-xl z-10 text-center space-y-6 flex flex-col justify-between"
      >
        {/* Header Branding Logo */}
        <div className="space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Lock className="text-white shrink-0 animate-bounce" size={24} />
          </div>
          
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
              Meu Painel de Vida
            </h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
              PAINEL EXCLUSIVO • ACESSO PROTEGIDO
            </p>
          </div>
        </div>

        {/* Dynamic Warning Message banner */}
        <div className="h-7 flex items-center justify-center">
          {errorMsg ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/25"
            >
              <AlertTriangle size={12} />
              <span>{errorMsg}</span>
            </motion.div>
          ) : (
            <span className="text-xs text-slate-400 font-semibold block">
              {showRecovery ? "Confirme sua conta para redefinir o PIN" : "Insira seu PIN de 4 dígitos para acessar"}
            </span>
          )}
        </div>

        {showRecovery ? (
          /* RECOVERY VIEW - exige reautenticação por senha ou conta */
          <div className="space-y-4 py-2 text-left">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 block">Redefinição de PIN:</span>
              <p className="text-xs font-semibold leading-relaxed text-slate-200">
                {isGoogleUser 
                  ? "Como você entrou com o Google, pode desconectar para fazer login novamente e resetar seu PIN de forma segura." 
                  : "Digite a senha da sua conta para redefinir seu PIN de acesso com total segurança."}
              </p>
            </div>

            {isGoogleUser ? (
              <div className="space-y-2">
                <button 
                  type="button"
                  onClick={onSignOut}
                  className="w-full bg-rose-600 hover:bg-rose-700 font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <LogOut size={14} />
                  <span>Sair da Conta & Resetar PIN</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowRecovery(false);
                    setErrorMsg(null);
                  }}
                  className="w-full hover:bg-white/5 font-extrabold text-[10px] text-slate-450 uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Voltar ao PIN
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordRecovery} className="space-y-3">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha da conta..."
                    value={recoveryPassword}
                    onChange={(e) => setRecoveryPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pr-10 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
                    disabled={loadingRecovery}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                
                <button 
                  type="submit"
                  disabled={loadingRecovery}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {loadingRecovery ? 'Autenticando...' : 'Redefinir PIN & Entrar'}
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setShowRecovery(false);
                    setErrorMsg(null);
                    setRecoveryPassword('');
                  }}
                  className="w-full hover:bg-white/5 font-extrabold text-[10px] text-slate-450 uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center"
                >
                  Voltar ao PIN
                </button>
              </form>
            )}
          </div>
        ) : (
          /* STANDARD PIN CODE KEYBOARD VIEW */
          <div className="space-y-5">
            {/* Four Digit Indicators (● ● ● ●) with scale animations */}
            <div className="flex items-center justify-center gap-5.5 py-1">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <motion.div
                    key={index}
                    animate={{
                      scale: isFilled ? [1, 1.25, 1.1] : 1,
                      backgroundColor: isFilled ? '#6366f1' : '#475569'
                    }}
                    transition={{ duration: 0.18 }}
                    className={`w-4.5 h-4.5 rounded-full border border-slate-700/60 shadow-inner ${
                      isFilled ? 'shadow-indigo-500/20' : ''
                    }`}
                  />
                );
              })}
            </div>

            {/* Keyboard Layout */}
            <div className="space-y-3">
              {/* Main Numbers 1-9 Grid */}
              <div className="grid grid-cols-3 gap-3.5">
                {KEYBOARD_KEYS.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    className="w-full h-13 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-indigo-600/35 border border-white/5 text-xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                  >
                    {digit}
                  </button>
                ))}

                {/* Bottom Row - Clear (Limpar), 0, and Backspace */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full h-13 rounded-2xl hover:bg-white/10 active:bg-slate-700 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border border-transparent transition-all flex flex-col items-center justify-center cursor-pointer"
                  title="Limpar todos os campos"
                >
                  <RotateCcw size={14} className="mb-0.5" />
                  <span>Limpar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  className="w-full h-13 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-indigo-600/35 border border-white/5 text-xl font-bold font-mono transition-all flex items-center justify-center cursor-pointer"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  className="w-full h-13 rounded-2xl hover:bg-white/10 active:bg-rose-600/20 text-rose-400 border border-transparent transition-all flex flex-col items-center justify-center cursor-pointer"
                  title="Apagar último número"
                >
                  <Delete size={16} className="mb-0.5" />
                  <span className="text-[9px] uppercase font-bold text-slate-400">Apagar</span>
                </button>
              </div>

              {/* Forgot PIN Recovery Link button */}
              <div className="pt-2 text-center flex justify-between items-center px-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowRecovery(true);
                    setErrorMsg(null);
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  Esqueci meu PIN
                </button>

                <button 
                  type="button"
                  onClick={onSignOut}
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={11} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Small privacy helper footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-sans mt-3 border-t border-white/5 pt-4">
          <ShieldCheck size={12} className="text-indigo-400" />
          <span>Sua sessão é totalmente pessoal e segura</span>
        </div>
      </motion.div>
    </div>
  );
}
