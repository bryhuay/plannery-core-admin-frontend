'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../../lib/navigation';
import { usePlanery } from '../../context/PlaneryContext';

type AuthStep =
  | 'login'
  | 'forgot-email'
  | 'forgot-code'
  | 'forgot-reset'
  | 'forgot-success';

const STEP_ORDER: Record<AuthStep, number> = {
  login: 0,
  'forgot-email': 1,
  'forgot-code': 2,
  'forgot-reset': 3,
  'forgot-success': 4,
};

const cardTransitionVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    y: 6,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    y: -4,
    scale: 0.985,
  }),
};

const errorAlertVariants = {
  initial: { opacity: 0, y: -8, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -6, height: 0 },
};

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = usePlanery();

  // Estado del paso actual y dirección de la animación (1 = avanza, -1 = retrocede)
  const [step, setStep] = useState<AuthStep>('login');
  const [direction, setDirection] = useState<number>(1);

  const navigateToStep = (nextStep: AuthStep) => {
    const newDir = STEP_ORDER[nextStep] >= STEP_ORDER[step] ? 1 : -1;
    setDirection(newDir);
    setStep(nextStep);
  };

  // Formulario Login
  const [email, setEmail] = useState('carlos.mendoza@planery.pe');
  const [password, setPassword] = useState('Planery2026*');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flujo Olvidé mi Contraseña
  const [recoveryEmail, setRecoveryEmail] = useState(
    'carlos.mendoza@planery.pe'
  );
  const [verificationCode, setVerificationCode] = useState('849201');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');

  // Validaciones de fortaleza de contraseña en tiempo real
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmNewPassword;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !email.includes('@')) {
      setLoginError(
        'Por favor ingresa un correo electrónico corporativo válido.'
      );
      return;
    }
    if (!password || password.length < 4) {
      setLoginError('La contraseña ingresada es demasiado corta.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Bienvenido de nuevo a Planery Core (${email.trim()}).`);
      router.push('/');
    }, 350);
  };

  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      setRecoveryError('Ingresa el correo electrónico asociado a tu cuenta.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Código de verificación enviado a ${recoveryEmail.trim()}.`);
      navigateToStep('forgot-code');
    }, 350);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (verificationCode.trim().length < 6) {
      setRecoveryError('Ingresa el código de seguridad de 6 dígitos.');
      return;
    }
    navigateToStep('forgot-reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setRecoveryError(
        'La nueva contraseña debe cumplir con todos los requisitos de seguridad.'
      );
      return;
    }
    if (!passwordsMatch) {
      setRecoveryError('Las contraseñas ingresadas no coinciden.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail(recoveryEmail);
      setPassword(newPassword);
      showToast('Tu contraseña ha sido actualizada correctamente.');
      navigateToStep('forgot-success');
    }, 350);
  };

  const handleQuickDemoAccount = (
    demoEmail: string,
    demoPass: string,
    roleLabel: string
  ) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError('');
    showToast(`Credenciales cargadas: ${roleLabel}`);
  };

  const recoveryProgressPercent =
    step === 'forgot-email'
      ? 33
      : step === 'forgot-code'
      ? 66
      : step === 'forgot-reset'
      ? 100
      : 0;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9FAFB] text-slate-900 overflow-x-hidden">
      {/* =====================================================================
       * PANEL IZQUIERDO: BRANDING E IDENTIDAD CORPORATIVA (Desktop lg:flex)
       * =================================================================== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[46%] xl:w-[48%] bg-[#1E222D] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden select-none"
      >
        {/* Elementos decorativos sutiles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F2C94C]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Logo Superior */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C] flex items-center justify-center text-[#241A00] font-extrabold text-xl shadow-md">
              P
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                Planery Core
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1 block">
                Event & Enterprise OS
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-[#F2C94C]">
            v2.6 Enterprise
          </span>
        </div>

        {/* Contenido Central con entrada escalonada sutil */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 my-auto py-8 space-y-6 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2C94C]/15 border border-[#F2C94C]/30 text-[#F2C94C] text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">
              verified_user
            </span>
            <span>Plataforma integral para productoras y planners</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Control absoluto de tus eventos, finanzas y proveedores en un solo
            lugar.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Gestiona presupuestos en tiempo real, cronogramas operativos,
            contratos verificados y membresías multi-empresa con trazabilidad de
            auditoría completa.
          </p>

          {/* Tarjetas de métricas destacadas */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="text-xl font-extrabold text-[#F2C94C] tabular-nums">
                99.9%
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Disponibilidad SLA
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="text-xl font-extrabold text-white tabular-nums">
                +110
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Agencias activas
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="text-xl font-extrabold text-emerald-400 tabular-nums">
                AES-256
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Seguridad bancaria
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pie izquierdo */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-5">
          <span>© 2026 Planery Core S.A.C. · Lima & Arequipa, Perú</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Todos los sistemas operativos
          </span>
        </div>
      </motion.div>

      {/* =====================================================================
       * PANEL DERECHO: FORMULARIO DE LOGIN Y RECUPERACIÓN DE CONTRASEÑA
       * =================================================================== */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto">
        {/* Barra superior móvil y botón de acceso directo al Dashboard */}
        <div className="flex items-center justify-between gap-3 mb-6 lg:mb-0">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#1E222D] flex items-center justify-center text-[#F2C94C] font-extrabold text-lg">
              P
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-none">
                Planery Core
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Gestión Empresarial
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <AnimatePresence mode="popLayout">
              {step !== 'login' && (
                <motion.button
                  key="back-to-login"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={() => {
                    setRecoveryError('');
                    navigateToStep('login');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_back
                  </span>
                  <span>Volver al Login</span>
                </motion.button>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <span>Ir al Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">
                open_in_new
              </span>
            </button>
          </div>
        </div>

        {/* Contenedor Central Responsivo con AnimatePresence */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ===============================================================
             * PASO 1: PANTALLA DE INICIAR SESIÓN (EMAIL + CONTRASEÑA)
             * ============================================================= */}
            {step === 'login' && (
              <motion.div
                key="step-login"
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6"
              >
                <div>
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="w-11 h-11 rounded-xl bg-[#FEF9E7] border border-[#F2C94C]/60 flex items-center justify-center text-[#745B00] mb-4"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      lock_open
                    </span>
                  </motion.div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Iniciar sesión
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Ingresa tus credenciales corporativas para acceder a tu
                    panel de eventos.
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {loginError && (
                    <motion.div
                      key="login-error"
                      variants={errorAlertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                          error
                        </span>
                        <span>{loginError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Campo Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        mail
                      </span>
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nombre@tuempresa.pe"
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña + Enlace Olvidé mi contraseña */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Contraseña
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setRecoveryEmail(email || 'carlos.mendoza@planery.pe');
                          setRecoveryError('');
                          navigateToStep('forgot-email');
                        }}
                        className="text-xs font-bold text-[#745B00] hover:text-slate-900 hover:underline transition-colors cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        key
                      </span>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Mostrar u ocultar contraseña"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Recordar sesión */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#745B00] focus:ring-[#F2C94C] cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 font-medium">
                        Mantener sesión iniciada por 30 días
                      </span>
                    </label>
                  </div>

                  {/* Botón Principal Iniciar Sesión */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {isSubmitting
                        ? 'Verificando acceso...'
                        : 'Iniciar sesión'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">
                      login
                    </span>
                  </motion.button>
                </form>

                {/* Acceso Rápido Cuentas Demo */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Acceso rápido con perfiles de demostración:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() =>
                        handleQuickDemoAccount(
                          'carlos.mendoza@planery.pe',
                          'Planery2026*',
                          'Carlos Mendoza (Company Admin)'
                        )
                      }
                      className="p-2 rounded-xl border border-slate-200 hover:border-[#F2C94C] hover:bg-[#FEF9E7]/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-800">
                        Company Admin
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        carlos.mendoza@
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() =>
                        handleQuickDemoAccount(
                          'jerson.huayta@planery.pe',
                          'Planner2026*',
                          'Jerson Huayta (Planner Líder)'
                        )
                      }
                      className="p-2 rounded-xl border border-slate-200 hover:border-[#F2C94C] hover:bg-[#FEF9E7]/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-800">
                        Planner Líder
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        jerson.huayta@
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() =>
                        handleQuickDemoAccount(
                          'superadmin@planery.pe',
                          'RootAdmin2026*',
                          'Super Admin Global'
                        )
                      }
                      className="p-2 rounded-xl border border-slate-200 hover:border-[#F2C94C] hover:bg-[#FEF9E7]/50 text-left transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-800">
                        Super Admin
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        superadmin@
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===============================================================
             * PASO 2: OLVIDÉ MI CONTRASEÑA — INGRESAR CORREO
             * ============================================================= */}
            {step === 'forgot-email' && (
              <motion.div
                key="step-forgot-email"
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6"
              >
                {/* Barra de progreso animada */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${recoveryProgressPercent}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="h-full bg-[#F2C94C] rounded-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        lock_reset
                      </span>
                    </motion.div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Paso 1 de 3
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    ¿Olvidaste tu contraseña?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Ingresa tu correo electrónico corporativo y te enviaremos un
                    código de verificación de 6 dígitos para restablecer tu
                    acceso.
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {recoveryError && (
                    <motion.div
                      key="recovery-error-1"
                      variants={errorAlertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                          error
                        </span>
                        <span>{recoveryError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Correo electrónico registrado
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="ejemplo@empresa.pe"
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-2 w-full">
                    <button
                      type="button"
                      onClick={() => navigateToStep('login')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 justify-center py-2.5 px-5 rounded-xl bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        forward_to_inbox
                      </span>
                      <span>Enviar código de recuperación</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ===============================================================
             * PASO 3: OLVIDÉ MI CONTRASEÑA — VERIFICAR CÓDIGO DE 6 DÍGITOS
             * ============================================================= */}
            {step === 'forgot-code' && (
              <motion.div
                key="step-forgot-code"
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6"
              >
                {/* Barra de progreso animada */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '33%' }}
                    animate={{ width: `${recoveryProgressPercent}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="h-full bg-[#F2C94C] rounded-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        mark_email_read
                      </span>
                    </motion.div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Paso 2 de 3
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Verifica tu identidad
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Hemos enviado un código de seguridad de 6 dígitos a{' '}
                    <strong className="text-slate-900">{recoveryEmail}</strong>.
                  </p>
                </div>

                {/* Aviso de código demo para pruebas */}
                <div className="p-3 rounded-xl bg-[#FEF9E7] border border-[#F2C94C]/60 flex items-center justify-between gap-2 text-xs text-[#584400]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#745B00]">
                      info
                    </span>
                    <span>
                      Código temporal generado: <strong>849201</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode('849201')}
                    className="text-[11px] font-bold underline cursor-pointer"
                  >
                    Usar código
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {recoveryError && (
                    <motion.div
                      key="recovery-error-2"
                      variants={errorAlertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                          error
                        </span>
                        <span>{recoveryError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Código de verificación (6 dígitos)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="849201"
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-center text-lg font-mono font-extrabold tracking-[0.35em] text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>¿No recibiste el correo?</span>
                    <button
                      type="button"
                      onClick={() =>
                        showToast(`Nuevo código reenviado a ${recoveryEmail}.`)
                      }
                      className="font-bold text-[#745B00] hover:underline cursor-pointer"
                    >
                      Reenviar código
                    </button>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-2 w-full">
                    <button
                      type="button"
                      onClick={() => navigateToStep('forgot-email')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Atrás
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      className="w-full sm:flex-1 justify-center py-2.5 px-5 rounded-xl bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Verificar código</span>
                      <span className="material-symbols-outlined text-[17px]">
                        arrow_forward
                      </span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ===============================================================
             * PASO 4: OLVIDÉ MI CONTRASEÑA — CREAR NUEVA CONTRASEÑA
             * ============================================================= */}
            {step === 'forgot-reset' && (
              <motion.div
                key="step-forgot-reset"
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6"
              >
                {/* Barra de progreso animada */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '66%' }}
                    animate={{ width: `${recoveryProgressPercent}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        password
                      </span>
                    </motion.div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Paso 3 de 3
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Crea una nueva contraseña
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Establece una nueva contraseña segura para la cuenta{' '}
                    <strong className="text-slate-900">{recoveryEmail}</strong>.
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {recoveryError && (
                    <motion.div
                      key="recovery-error-3"
                      variants={errorAlertVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
                        <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                          error
                        </span>
                        <span>{recoveryError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/30"
                    />
                  </div>

                  {/* Checklist de requisitos de seguridad */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Requisitos de seguridad:
                    </span>
                    <div
                      className={`flex items-center gap-2 transition-colors ${
                        hasMinLength
                          ? 'text-emerald-700 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {hasMinLength
                          ? 'check_circle'
                          : 'radio_button_unchecked'}
                      </span>
                      <span>Al menos 8 caracteres</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${
                        hasUpperCase
                          ? 'text-emerald-700 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {hasUpperCase
                          ? 'check_circle'
                          : 'radio_button_unchecked'}
                      </span>
                      <span>Al menos una letra mayúscula (A-Z)</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${
                        hasNumber
                          ? 'text-emerald-700 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>Al menos un número (0-9)</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${
                        passwordsMatch
                          ? 'text-emerald-700 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {passwordsMatch
                          ? 'check_circle'
                          : 'radio_button_unchecked'}
                      </span>
                      <span>Ambas contraseñas coinciden</span>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-2 w-full">
                    <button
                      type="button"
                      onClick={() => navigateToStep('forgot-code')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Atrás
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 justify-center py-2.5 px-5 rounded-xl bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        check_circle
                      </span>
                      <span>Actualizar contraseña</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ===============================================================
             * PASO 5: CONFIRMACIÓN DE CONTRASEÑA RESTABLECIDA
             * ============================================================= */}
            {step === 'forgot-success' && (
              <motion.div
                key="step-forgot-success"
                custom={direction}
                variants={cardTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-8 text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 18,
                    delay: 0.08,
                  }}
                  className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto"
                >
                  <span className="material-symbols-outlined text-[32px]">
                    verified
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.14 }}
                  className="space-y-1.5"
                >
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    ¡Contraseña actualizada!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Tu contraseña para{' '}
                    <strong className="text-slate-900">{recoveryEmail}</strong>{' '}
                    se ha restablecido con éxito. Ya puedes iniciar sesión con
                    tu nueva clave.
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => navigateToStep('login')}
                  className="w-full h-11 rounded-xl bg-[#F2C94C] hover:bg-[#E0B83B] text-[#241A00] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    login
                  </span>
                  <span>Volver a Iniciar sesión</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer de ayuda */}
        <div className="text-center text-xs text-slate-400 pt-4">
          ¿Problemas para ingresar? Contacta a{' '}
          <span className="font-semibold text-slate-600">
            soporte@planery.pe
          </span>
        </div>
      </div>
    </div>
  );
}
