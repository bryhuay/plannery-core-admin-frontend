'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, usePathname, useRouter } from '../../lib/navigation';
import { usePlanery } from '../../context/PlaneryContext';

export interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    events,
    providers,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    activeEventTab,
    setActiveEventTab,
    showToast,
  } = usePlanery();

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    initials: string;
    name: string;
    role: string;
  }>({
    initials: 'CM',
    name: 'Carlos Mendoza',
    role: 'Company Admin',
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEvents = searchQuery.trim()
    ? events.filter(
        (ev) =>
          ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.client.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredProviders = searchQuery.trim()
    ? providers.filter(
        (pr) =>
          pr.commercialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pr.ruc.includes(searchQuery) ||
          pr.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getBreadcrumbs = () => {
    if (pathname === '/') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Dashboard' },
      ];
    }
    if (pathname === '/eventos') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Eventos' },
      ];
    }
    if (pathname === '/eventos/nuevo') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Eventos', href: '/eventos' },
        { label: 'Nuevo evento' },
      ];
    }
    if (pathname.startsWith('/eventos/')) {
      const eventId = pathname.replace('/eventos/', '');
      const found = events.find((e) => e.id === eventId);
      const tabNames: Record<string, string> = {
        resumen: 'Resumen',
        proveedores: 'Proveedores',
        presupuesto: 'Presupuesto',
        pagos: 'Pagos',
        documentos: 'Documentos',
        tareas: 'Tareas',
        actividad: 'Actividad',
      };
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Eventos', href: '/eventos' },
        { label: found ? found.name : 'Boda de María y Carlos', href: pathname },
        { label: tabNames[activeEventTab] || 'Resumen' },
      ];
    }
    if (pathname === '/proveedores') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Proveedores' },
      ];
    }
    if (pathname === '/calendario') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Calendario' },
      ];
    }
    if (pathname === '/pagos') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Pagos' },
      ];
    }
    if (pathname === '/empresas') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Plataforma', href: '/empresas' },
        { label: 'Empresas' },
      ];
    }
    if (pathname === '/usuarios') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Plataforma', href: '/empresas' },
        { label: 'Usuarios' },
      ];
    }
    if (pathname === '/suscripciones') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Plataforma', href: '/suscripciones' },
        { label: 'Suscripciones' },
      ];
    }
    if (pathname === '/configuracion') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Plataforma', href: '/empresas' },
        { label: 'Configuración' },
      ];
    }
    if (pathname === '/ui-kit') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'UI Kit' },
      ];
    }
    if (pathname === '/notificaciones') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Notificaciones' },
      ];
    }
    return [
      { label: 'Inicio', href: '/' },
      { label: 'Configuración', href: '/configuracion' },
      { label: 'Mi perfil' },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="w-full h-16 sticky top-0 z-30 bg-white border-b border-[#E5E7EB] flex justify-between items-center px-4 sm:px-6 lg:px-8 gap-3 shadow-xs shrink-0">
      {/* Left: Hamburger Button (< lg), Contextual Breadcrumbs & Global Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú de navegación"
          className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <nav
          aria-label="Migas de pan"
          className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300 text-xs">/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    {idx === 0 && (
                      <span className="material-symbols-outlined text-[16px]">home</span>
                    )}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative max-w-md w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[19px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchResults(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            placeholder="Buscar eventos, proveedores, contratos..."
            className="w-full bg-[#F0F3FF]/60 pl-9 pr-12 py-1.5 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:bg-white focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>

          {/* Instant Search Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Eventos ({filteredEvents.length})
              </div>
              {filteredEvents.length === 0 ? (
                <div className="px-3 py-1.5 text-xs text-slate-400">
                  Sin eventos coincidentes
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => {
                      router.push(`/eventos/${ev.id}`);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{ev.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {ev.code} · {ev.dateFormatted} · {ev.client}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      arrow_forward
                    </span>
                  </button>
                ))
              )}

              <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Proveedores ({filteredProviders.length})
              </div>
              {filteredProviders.length === 0 ? (
                <div className="px-3 py-1.5 text-xs text-slate-400">
                  Sin proveedores coincidentes
                </div>
              ) : (
                filteredProviders.map((pr) => (
                  <button
                    key={pr.id}
                    type="button"
                    onClick={() => {
                      router.push('/proveedores');
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {pr.commercialName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {pr.category} · RUC {pr.ruc}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      storefront
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            aria-label="Notificaciones"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
              showNotifications || pathname === '/notificaciones'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F2C94C] text-[#241A00] text-[10px] font-bold flex items-center justify-center ring-2 ring-white tabular-nums">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute right-3 left-3 sm:left-auto sm:right-0 top-16 sm:top-12 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
              {/* Header */}
              <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notificaciones
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F2C94C]/30 text-[#241A00] border border-[#F2C94C]">
                      {unreadNotificationsCount} nuevas
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      markAllNotificationsAsRead();
                    }}
                    className="text-[11px] font-semibold text-[#745b00] hover:underline cursor-pointer"
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>

              {/* Recent Notifications List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notif) => {
                  const categoryIcons: Record<string, string> = {
                    Pagos: 'payments',
                    Proveedores: 'storefront',
                    Tareas: 'task_alt',
                    Eventos: 'celebration',
                    Documentos: 'description',
                    Sistema: 'shield_person',
                  };
                  const categoryBadgeColors: Record<string, string> = {
                    Pagos: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    Proveedores: 'bg-blue-50 text-blue-700 border-blue-200',
                    Tareas: 'bg-purple-50 text-purple-700 border-purple-200',
                    Eventos: 'bg-amber-50 text-amber-800 border-amber-200',
                    Documentos: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    Sistema: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.targetTab) {
                          setActiveEventTab(notif.targetTab);
                        }
                        setShowNotifications(false);
                        router.push(notif.targetHref);
                      }}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${
                        !notif.read
                          ? 'bg-[#FEFBF0]/70 hover:bg-[#FEFBF0]'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                          categoryBadgeColors[notif.category] ||
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {categoryIcons[notif.category] || 'notifications'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {notif.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">
                              {notif.timestamp}
                            </span>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#F2C94C]" />
                            )}
                          </div>
                        </div>
                        <div
                          className={`text-xs mt-0.5 line-clamp-1 ${
                            !notif.read
                              ? 'font-bold text-slate-900'
                              : 'font-medium text-slate-700'
                          }`}
                        >
                          {notif.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {notif.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Button: Ver todas las notificaciones */}
              <div className="p-3 bg-slate-50 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    router.push('/notificaciones');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#F2C94C] hover:bg-[#e0b83b] text-[#241A00] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Ver todas las notificaciones</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-1 cursor-pointer group text-left"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-[#F2C94C] flex items-center justify-center text-xs font-bold border border-slate-200 shadow-xs">
                {currentUser.initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#745b00] transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 leading-tight">
                {currentUser.role}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px] group-hover:text-slate-900 transition-colors">
              keyboard_arrow_down
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Cambiar Rol Activo (Demo RBAC)
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser({
                    initials: 'CM',
                    name: 'Carlos Mendoza',
                    role: 'Company Admin',
                  });
                  setShowUserMenu(false);
                  showToast('Vista cambiada a Carlos Mendoza (Company Admin).');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Carlos Mendoza</div>
                  <div className="text-[11px] text-slate-500">Company Admin</div>
                </div>
                {currentUser.initials === 'CM' && (
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    check
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser({
                    initials: 'JH',
                    name: 'Jerson Huayta',
                    role: 'Planner Principal',
                  });
                  setShowUserMenu(false);
                  showToast('Vista cambiada a Jerson Huayta (Planner Principal).');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Jerson Huayta</div>
                  <div className="text-[11px] text-slate-500">Planner Principal</div>
                </div>
                {currentUser.initials === 'JH' && (
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    check
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser({
                    initials: 'GA',
                    name: 'Admin Global',
                    role: 'Super Admin',
                  });
                  setShowUserMenu(false);
                  router.push('/suscripciones');
                  showToast('Vista cambiada a Admin Global (Super Admin).');
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Admin Global</div>
                  <div className="text-[11px] text-slate-500">Plataforma Super Admin</div>
                </div>
                {currentUser.initials === 'GA' && (
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    check
                  </span>
                )}
              </button>
              <div className="my-1 border-t border-slate-100" />
              <Link
                href="/perfil"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>Mi Perfil y Cuenta</span>
              </Link>
              <Link
                href="/login"
                onClick={() => {
                  setShowUserMenu(false);
                  showToast('Has cerrado sesión en Planery Core.');
                }}
                className="flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Cerrar sesión</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
