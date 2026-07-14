import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    setLoading(false);
  };

  const handleModeChange = (mode: 'welcome' | 'login' | 'register') => {
    resetForm();
    setAuthMode(mode);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Preencha todos os campos!');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('E-mail ou senha inválidos.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('O endereço de e-mail é inválido.');
      } else {
        setErrorMsg('Erro ao conectar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Preencha todos os campos!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está em uso.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('O endereço de e-mail é inválido.');
      } else {
        setErrorMsg('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Falha na autenticação do Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans select-none overflow-y-auto p-4 md:p-6">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050814] via-[#0b0e1a] to-[#160d26] z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />

      {/* Auth Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/40 border border-white/5 shadow-2xl rounded-3xl backdrop-blur-xl z-10 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* WELCOME VIEW */}
          {authMode === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 py-4 text-center"
            >
              {/* Logo / Mascot Icon */}
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-550 to-indigo-650 flex items-center justify-center shadow-lg shadow-indigo-550/20">
                  <span className="text-3xl">🐑</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-indigo-105 to-white bg-clip-text text-transparent">
                    Meu Painel de Vida
                  </h1>
                  <p className="text-xs uppercase tracking-widest font-black text-indigo-400 mt-1.5">
                    Seu Hub Pessoal & Privativo
                  </p>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100">
                  Bem-vindo ao Meu Painel de Vida
                </h2>
                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                  Organize sua vida em um só lugar de forma 100% privativa e criptografada na nuvem.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleModeChange('login')}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-650 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-99 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Entrar</span>
                </button>

                <button
                  onClick={() => handleModeChange('register')}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all border border-white/5 active:scale-99 cursor-pointer"
                >
                  Criar Conta
                </button>
              </div>
            </motion.div>
          )}

          {/* LOGIN VIEW */}
          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <button
                  onClick={() => handleModeChange('welcome')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>
                <div className="text-left">
                  <h2 className="text-base font-black text-white">Fazer Login</h2>
                  <p className="text-[10px] text-slate-400">Acesse sua conta do Painel de Vida</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Endereço de E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="exemplo@gmail.com"
                      disabled={loading}
                    />
                    <Mail size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Senha de Acesso</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Sua senha secreta"
                      disabled={loading}
                    />
                    <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : 'Entrar no Painel'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">ou entre com</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                {/* Google Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.12C18.28 1.845 15.545 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.96 11.75-11.95 0-.805-.085-1.42-.19-1.965H12.24z"/>
                </svg>
                <span>Conectar com Google</span>
              </button>

              <div className="text-center">
                <button
                  onClick={() => handleModeChange('register')}
                  className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 hover:underline cursor-pointer"
                >
                  Não tem conta? Criar uma nova
                </button>
              </div>
            </motion.div>
          )}

          {/* REGISTER VIEW */}
          {authMode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <button
                  onClick={() => handleModeChange('welcome')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft size={14} />
                </button>
                <div className="text-left">
                  <h2 className="text-base font-black text-white">Criar Nova Conta</h2>
                  <p className="text-[10px] text-slate-400">Configure seu próprio painel exclusivo</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailRegister} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Nome Completo / Apelido</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Marcos Silva"
                      disabled={loading}
                    />
                    <User size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">E-mail de Cadastro</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="exemplo@gmail.com"
                      disabled={loading}
                    />
                    <Mail size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Senha Secreta</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Mínimo 6 caracteres"
                      disabled={loading}
                    />
                    <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Confirme a Senha</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#161c2a] border border-white/5 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Confirme sua senha"
                      disabled={loading}
                    />
                    <Lock size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : 'Criar Minha Conta'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => handleModeChange('login')}
                  className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 hover:underline cursor-pointer"
                >
                  Já tem conta? Fazer Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
