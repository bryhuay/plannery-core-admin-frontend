'use client';

import React, { useState, useMemo } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { useRouter } from '../../lib/navigation';
import { NotificationCategory, NotificationItem } from '../../types/planery';

export default function NotificacionesPage() {
  const {
    notifications,
    markNotificationAsRead,
    toggleNotificationRead,
    markAllNotificationsAsRead,
    deleteNotification,
    setActiveEventTab,
  } = usePlanery();
  const router = useRouter();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>(
    'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | NotificationCategory
  >('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;
  const paymentsAlertsCount = notifications.filter(
    (n) => n.category === 'Pagos'
  ).length;
  const operationsAlertsCount = notifications.filter(
    (n) => n.category === 'Tareas' || n.category === 'Proveedores'
  ).length;

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesRead =
        readFilter === 'all' ||
        (readFilter === 'unread' && !n.read) ||
        (readFilter === 'read' && n.read);

      const matchesCategory =
        categoryFilter === 'all' || n.category === categoryFilter;

      const matchesPriority =
        priorityFilter === 'all' || n.priority === priorityFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query) ||
        (n.eventName && n.eventName.toLowerCase().includes(query)) ||
        (n.eventCode && n.eventCode.toLowerCase().includes(query)) ||
        (n.actorName && n.actorName.toLowerCase().includes(query));

      return (
        matchesRead && matchesCategory && matchesPriority && matchesSearch
      );
    });
  }, [notifications, readFilter, categoryFilter, priorityFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / pageSize)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setReadFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
  };

  const handleNavigateNotification = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.targetTab) {
      setActiveEventTab(item.targetTab);
    }
    router.push(item.targetHref);
  };

  const getCategoryMeta = (category: NotificationCategory) => {
    switch (category) {
      case 'Pagos':
        return {
          icon: 'payments',
          iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'Proveedores':
        return {
          icon: 'storefront',
          iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'Tareas':
        return {
          icon: 'task_alt',
          iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'Eventos':
        return {
          icon: 'celebration',
          iconBg: 'bg-amber-50 text-[#745B00] border-amber-200',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      case 'Documentos':
        return {
          icon: 'description',
          iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'Sistema':
      default:
        return {
          icon: 'shield_person',
          iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  const categoriesList: {
    id: 'all' | NotificationCategory;
    label: string;
    icon: string;
  }[] = [
    { id: 'all', label: 'Todos los tipos', icon: 'apps' },
    { id: 'Pagos', label: 'Pagos', icon: 'payments' },
    { id: 'Proveedores', label: 'Proveedores', icon: 'storefront' },
    { id: 'Tareas', label: 'Tareas', icon: 'task_alt' },
    { id: 'Eventos', label: 'Eventos', icon: 'celebration' },
    { id: 'Documentos', label: 'Documentos', icon: 'description' },
    { id: 'Sistema', label: 'Sistema', icon: 'shield_person' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#151C27] tracking-tight">
              Centro de Notificaciones
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F2C94C]/25 text-[#241A00] border border-[#F2C94C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#745B00] animate-pulse" />
                {unreadCount} sin leer
              </span>
            )}
          </div>
          <p className="text-sm text-[#575E70] mt-1">
            Supervisa alertas de pagos, actualizaciones de proveedores, vencimientos de tareas y eventos en tiempo real.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/perfil')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-[#151C27] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Preferencias</span>
          </button>
          <button
            type="button"
            disabled={unreadCount === 0}
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2C94C] hover:bg-[#e0b83b] disabled:opacity-50 text-[#241A00] font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              done_all
            </span>
            <span>Marcar todas como leídas</span>
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Total registradas
            </span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums mt-1 block">
              {totalCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Bandeja corporativa activa
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              No leídas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-700 tabular-nums">
                {unreadCount}
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                Atención requerida
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Pendientes de revisión
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined">mark_email_unread</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Pagos y Presupuesto
            </span>
            <span className="text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">
              {paymentsAlertsCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Abonos, vencimientos y topes
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Tareas y Proveedores
            </span>
            <span className="text-2xl font-bold text-blue-700 tabular-nums mt-1 block">
              {operationsAlertsCount}
            </span>
            <span className="text-[11px] text-slate-400">
              Hitos operativos y cotizaciones
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined">assignment_late</span>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
        {/* Top Row: Search + Read/Unread Segmented Control + Priority Select */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[19px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por título, evento, proveedor, código..."
              className="w-full bg-[#F8F9FA] border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2C94C] focus:bg-white focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  close
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Read / Unread Segmented Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setReadFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  readFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setReadFilter('unread');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  readFilter === 'unread'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                No leídas ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setReadFilter('read');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  readFilter === 'read'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Leídas ({readCount})
              </button>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#F8F9FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
            >
              <option value="all">Todas las prioridades</option>
              <option value="Urgente">Prioridad: Urgente</option>
              <option value="Alta">Prioridad: Alta</option>
              <option value="Normal">Prioridad: Normal</option>
            </select>

            {/* Reset Filters */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-2 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                restart_alt
              </span>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Category Type Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Tipo:
          </span>
          {categoriesList.map((cat) => {
            const isSelected = categoryFilter === cat.id;
            const count =
              cat.id === 'all'
                ? notifications.length
                : notifications.filter((n) => n.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1E222D] text-[#F2C94C] border-[#1E222D] shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTIFICATIONS LIST CONTAINER */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
        {paginatedNotifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">
                notifications_off
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No se encontraron notificaciones
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No hay registros que coincidan con los filtros seleccionados ({readFilter !== 'all' ? (readFilter === 'unread' ? 'No leídas' : 'Leídas') : 'Todas'}, tipo: {categoryFilter}).
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-[#F2C94C] text-[#241A00] text-xs font-bold hover:brightness-95 transition-all cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80">
            {paginatedNotifications.map((item) => {
              const meta = getCategoryMeta(item.category);
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    !item.read
                      ? 'bg-[#FEFBF0]/55 border-l-4 border-l-[#F2C94C] hover:bg-[#FEFBF0]/80'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {/* Left: Icon + Content */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.iconBg}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {meta.icon}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {!item.read && (
                          <span
                            className="w-2 h-2 rounded-full bg-[#F2C94C] ring-2 ring-amber-200 shrink-0"
                            title="No leída"
                          />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            !item.read ? 'text-slate-950' : 'text-slate-700'
                          }`}
                        >
                          {item.title}
                        </span>

                        {/* Category Tag */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${meta.badgeClass}`}
                        >
                          {item.category}
                        </span>

                        {/* Priority Tag if Urgent or Alta */}
                        {item.priority === 'Urgente' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Urgente
                          </span>
                        )}
                        {item.priority === 'Alta' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Prioridad Alta
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Metadata Footer */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {item.timestamp} ({item.dateFormatted})
                        </span>

                        {item.eventName && (
                          <>
                            <span>·</span>
                            <span className="font-medium text-slate-600">
                              Evento:{' '}
                              <strong className="font-semibold text-slate-800">
                                {item.eventName}
                              </strong>{' '}
                              {item.eventCode && (
                                <span className="font-mono text-[10px] text-slate-500">
                                  ({item.eventCode})
                                </span>
                              )}
                            </span>
                          </>
                        )}

                        {item.actorName && (
                          <>
                            <span>·</span>
                            <span>Origen: {item.actorName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleNavigateNotification(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#F2C94C] text-slate-800 hover:text-[#241A00] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <span className="material-symbols-outlined text-[15px]">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleNotificationRead(item.id)}
                      title={
                        item.read
                          ? 'Marcar como no leída'
                          : 'Marcar como leída'
                      }
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.read ? 'mark_email_unread' : 'mark_email_read'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNotification(item.id)}
                      title="Eliminar notificación"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION FOOTER */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Mostrando{' '}
              <strong className="font-bold text-slate-900 tabular-nums">
                {filteredNotifications.length === 0 ? 0 : startIndex + 1} a{' '}
                {Math.min(
                  startIndex + pageSize,
                  filteredNotifications.length
                )}
              </strong>{' '}
              de{' '}
              <strong className="font-bold text-slate-900 tabular-nums">
                {filteredNotifications.length}
              </strong>{' '}
              notificaciones
            </span>
            <span className="text-slate-300">|</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#F2C94C] cursor-pointer"
            >
              <option value={5}>5 por página</option>
              <option value={8}>8 por página</option>
              <option value={15}>15 por página</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    safeCurrentPage === pageNum
                      ? 'bg-[#F2C94C] text-[#241A00] shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
