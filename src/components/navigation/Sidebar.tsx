'use client';

import React, { useEffect } from 'react';
import { Link, usePathname } from '../../lib/navigation';
import { usePlanery } from '../../context/PlaneryContext';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();
  const { events, providers, showToast } = usePlanery();

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    if (onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const renderSidebarContent = (isMobileDrawer: boolean) => (
    <>
      <div className="flex flex-col gap-y-4">
        {/* Header / Brand Logo */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 pb-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-x-3 group min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F2C94C] flex items-center justify-center text-[#241a00] font-bold text-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[19px] font-bold text-white tracking-tight leading-tight truncate">
                Planery Core
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5 truncate">
                Gestión Empresarial
              </span>
            </div>
          </Link>

          {isMobileDrawer && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú lateral"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* CTA Button: + Nuevo Evento */}
        <div className="px-2 pt-1">
          <Link
            href="/eventos/nuevo"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#F2C94C] hover:bg-[#ebc246] text-[#241a00] text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Nuevo Evento</span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav
          aria-label="Navegación principal"
          className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[calc(100vh-235px)] pr-1 custom-scroll"
        >
          {/* Section: Gestión */}
          <div className="px-3 pt-2 pb-1">
            <span className="uppercase tracking-wider text-slate-400 text-[11px] font-semibold">
              Gestión
            </span>
          </div>

          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              dashboard
            </span>
            <span className="flex-1">Dashboard</span>
          </Link>

          <Link
            href="/eventos"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all ${
              pathname === '/eventos' || pathname === '/eventos/nuevo'
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  pathname === '/eventos' || pathname === '/eventos/nuevo'
                    ? 'text-[#F2C94C] fill'
                    : 'text-slate-400'
                }`}
              >
                calendar_today
              </span>
              <span>Eventos</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/70 text-slate-200 tabular-nums">
              {events.length + 17}
            </span>
          </Link>

          <Link
            href="/proveedores"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/proveedores')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive('/proveedores') ? 'text-[#F2C94C] fill' : 'text-slate-400'
                }`}
              >
                storefront
              </span>
              <span>Proveedores</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/70 text-slate-200 tabular-nums">
              {providers.length + 120}
            </span>
          </Link>

          <Link
            href="/calendario"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/calendario')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/calendario') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              calendar_month
            </span>
            <span>Calendario</span>
          </Link>

          <Link
            href="/pagos"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/pagos')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/pagos') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              payments
            </span>
            <span>Pagos</span>
          </Link>

          {/* Section: EVENTO ACTIVO (DEMO) */}
          <div className="px-3 pt-4 pb-1">
            <span className="uppercase tracking-wider text-slate-400 text-[11px] font-semibold">
              Evento Activo (Demo)
            </span>
          </div>

          <Link
            href="/eventos/EV-2026-084"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all ${
              pathname.startsWith('/eventos/EV-')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <span className="material-symbols-outlined text-[#F2C94C] text-[20px]">
                celebration
              </span>
              <span className="truncate">Boda María y Carlos</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-700/70 text-slate-200 shrink-0">
              EV-084
            </span>
          </Link>

          {/* Section: PLATAFORMA (SUPER ADMIN) */}
          <div className="px-3 pt-4 pb-1">
            <span className="uppercase tracking-wider text-slate-400 text-[11px] font-semibold">
              Plataforma (Super Admin)
            </span>
          </div>

          <Link
            href="/empresas"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/empresas')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/empresas') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              domain
            </span>
            <span>Empresas</span>
          </Link>

          <Link
            href="/usuarios"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/usuarios')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/usuarios') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              group
            </span>
            <span>Usuarios</span>
          </Link>

          <Link
            href="/suscripciones"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/suscripciones')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/suscripciones') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              loyalty
            </span>
            <span>Planes y suscripciones</span>
          </Link>

          {/* Section: CONFIGURACIÓN */}
          <div className="px-3 pt-4 pb-1">
            <span className="uppercase tracking-wider text-slate-400 text-[11px] font-semibold">
              Configuración
            </span>
          </div>

          <Link
            href="/perfil"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/perfil')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive('/perfil') ? 'text-[#F2C94C] fill' : 'text-slate-400'
                }`}
              >
                account_circle
              </span>
              <span>Perfil</span>
            </div>
            {isActive('/perfil') && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#F2C94C]" />
            )}
          </Link>

          <Link
            href="/configuracion"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/configuracion')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/configuracion') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              settings
            </span>
            <span>Configuración</span>
          </Link>

          <Link
            href="/ui-kit"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/ui-kit')
                ? 'text-white border-l-4 border-[#F2C94C] bg-slate-800/80 rounded-r-lg font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive('/ui-kit') ? 'text-[#F2C94C] fill' : 'text-slate-400'
              }`}
            >
              palette
            </span>
            <span>UI Kit & Design System</span>
          </Link>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-1 pt-3 border-t border-slate-800 px-1 mt-auto">
        <button
          type="button"
          onClick={() =>
            showToast('Centro de soporte empresarial Planery Core disponible 24/7.')
          }
          className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">help</span>
          <span>Centro de ayuda</span>
        </button>
        <Link
          href="/login"
          onClick={() => {
            if (onClose) onClose();
            showToast('Sesión cerrada correctamente.');
          }}
          className="flex items-center gap-3 px-3 py-2 text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">logout</span>
          <span>Cerrar sesión (Ir a Login)</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (lg:flex w-[280px]) */}
      <aside className="hidden lg:flex w-[280px] h-screen sticky left-0 top-0 bg-[#1E222D] border-r border-slate-800 flex-col justify-between py-4 px-2.5 z-40 shrink-0 select-none">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile / Tablet Interactive Drawer (< lg) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Sliding Sidebar Drawer */}
          <aside className="relative w-[280px] max-w-[85vw] h-full bg-[#1E222D] border-r border-slate-800 flex flex-col justify-between py-4 px-2.5 z-10 select-none shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
