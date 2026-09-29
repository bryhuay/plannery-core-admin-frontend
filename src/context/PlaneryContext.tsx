'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  EventItem,
  Provider,
  EventProviderRelation,
  BudgetCategory,
  PaymentItem,
  DocumentItem,
  TaskItem,
  AuditLogItem,
  SubscriptionItem,
  SubscriptionInvoiceItem,
  CalendarEntry,
  ClientItem,
  PlannerItem,
  EventDetailTab,
  PlatformUser,
  PlatformUserRole,
  PlatformUserStatus,
  PlatformCompany,
  PlatformCompanyStatus,
  GlobalCatalogItem,
  NotificationItem,
} from '../types/planery';

interface ToastState {
  visible: boolean;
  message: string;
  type?: 'success' | 'warning' | 'error';
}

interface PlaneryContextValue {
  events: EventItem[];
  providers: Provider[];
  eventProviders: EventProviderRelation[];
  budgetCategories: BudgetCategory[];
  payments: PaymentItem[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  auditLogs: AuditLogItem[];
  subscriptions: SubscriptionItem[];
  calendarEntries: CalendarEntry[];
  clients: ClientItem[];
  planners: PlannerItem[];
  platformUsers: PlatformUser[];
  companies: PlatformCompany[];
  globalCatalogs: GlobalCatalogItem[];
  notifications: NotificationItem[];
  activeEventTab: EventDetailTab;
  setActiveEventTab: (tab: EventDetailTab) => void;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'warning' | 'error') => void;
  hideToast: () => void;
  // Mutations
  addEvent: (newEvent: Omit<EventItem, 'id' | 'code' | 'paidAmount' | 'committedAmount'>) => EventItem;
  updateEvent: (eventId: string, updated: Partial<EventItem>) => void;
  duplicateEvent: (eventId: string) => void;
  archiveEvent: (eventId: string) => void;
  addClient: (name: string, email: string) => ClientItem;
  addProvider: (provider: Omit<Provider, 'id' | 'code' | 'eventsCount' | 'registeredDate' | 'initials' | 'avatarColor'>) => void;
  updateProvider: (id: string, updated: Partial<Provider>) => void;
  toggleProviderStatus: (id: string, forceStatus?: 'Activo' | 'Inactivo') => void;
  bulkUpdateProvidersStatus: (ids: string[], status: 'Activo' | 'Inactivo') => void;
  linkProviderToEvent: (relation: Omit<EventProviderRelation, 'id'>) => void;
  removeProviderFromEvent: (relationId: string) => void;
  updateEventProviderStatus: (relationId: string, status: EventProviderRelation['status']) => void;
  addBudgetCategory: (cat: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (id: string, allocated: number, notes?: string) => void;
  registerPayment: (payment: Omit<PaymentItem, 'id'>) => void;
  uploadDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  deleteDocument: (docId: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateSubscriptionStatus: (subId: string, status: SubscriptionItem['status']) => void;
  updateSubscriptionPlan: (
    subId: string,
    plan: SubscriptionItem['plan'],
    amount: number,
    billingCycle?: SubscriptionItem['billingCycle'],
    status?: SubscriptionItem['status'],
    nextBillingDate?: string,
    paymentMethod?: string,
    recordInvoice?: boolean
  ) => void;
  registerSubscriptionInvoice: (
    subId: string,
    invoice: Omit<SubscriptionInvoiceItem, 'id' | 'code'>
  ) => void;
  retryRejectedSubscriptionInvoice: (subId: string, invoiceId: string) => void;
  // Super Admin Users, Companies & Catalogs Mutations
  addPlatformUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyId: string;
    role: PlatformUserRole;
    sendInvite: boolean;
    activateImmediately: boolean;
  }) => void;
  updatePlatformUser: (id: string, updated: Partial<PlatformUser>) => void;
  changePlatformUserRole: (id: string, role: PlatformUserRole) => void;
  togglePlatformUserStatus: (id: string, status: PlatformUserStatus, reason?: string) => void;
  resendPlatformUserInvitation: (id: string) => void;
  addPlatformCompany: (company: Omit<PlatformCompany, 'id' | 'code' | 'usersTotal' | 'usersActive' | 'usersInactive' | 'registeredDate' | 'registeredDateLong'>) => void;
  updatePlatformCompany: (id: string, updated: Partial<PlatformCompany>) => void;
  togglePlatformCompanyStatus: (id: string, status: PlatformCompanyStatus) => void;
  addGlobalCatalogItem: (item: Omit<GlobalCatalogItem, 'id'>) => void;
  updateGlobalCatalogItem: (id: string, updated: Partial<GlobalCatalogItem>) => void;
  toggleGlobalCatalogItemStatus: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const INITIAL_PLANNERS: PlannerItem[] = [
  { id: 'jerson_h', name: 'Jerson Huayta', shortName: 'Jerson H.', initials: 'JH', role: 'Planner Líder / Coordinador Senior', email: 'jerson.huayta@planerycore.pe', avatarBg: 'bg-slate-800 text-white' },
  { id: 'sofia_r', name: 'Sofía Ramírez', shortName: 'Sofía R.', initials: 'SR', role: 'Coordinadora Senior', email: 'sofia.ramirez@planerycore.pe', avatarBg: 'bg-[#dce2f7] text-[#141b2b]' },
  { id: 'martin_l', name: 'Martín Lozada', shortName: 'Martín L.', initials: 'ML', role: 'Planner Corporativo', email: 'martin.lozada@planerycore.pe', avatarBg: 'bg-[#d9e3f6] text-[#121c2a]' },
  { id: 'carlos_m', name: 'Carlos Mendoza', shortName: 'Carlos M.', initials: 'CM', role: 'Admin de Empresa', email: 'carlos.mendoza@planerycore.pe', avatarBg: 'bg-[#f2c94c] text-[#241a00]' },
];

const INITIAL_CLIENTS: ClientItem[] = [
  { id: 'maria_lopez', name: 'María López', type: 'Matrimonio Social', email: 'marialopez@email.com', phone: '+51 987 654 321' },
  { id: 'tech_corp', name: 'Tech Innovations Corp', type: 'Corporativo', email: 'eventos@techinnovations.com', phone: '+51 998 112 233' },
  { id: 'santander', name: 'Banco Santander', type: 'Institucional', email: 'relaciones@santander.com.pe', phone: '+51 945 882 109' },
  { id: 'delgado', name: 'Familia Delgado', type: 'Social', email: 'contacto@familiadelgado.pe', phone: '+51 984 332 100' },
  { id: 'grupo_prisma', name: 'Grupo Prisma', type: 'Corporativo', email: 'gerencia@grupoprisma.pe', phone: '+51 955 441 220' },
  { id: 'lucia_andres', name: 'Lucía & Andrés', type: 'Boda', email: 'lucia.andres@gmail.com', phone: '+51 971 203 948' },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'EV-2026-084',
    code: 'EV-2026-084',
    name: 'Boda de María y Carlos',
    subtitle: 'Matrimonio Social',
    type: 'Matrimonio',
    date: '2026-11-18',
    dateFormatted: '18 Nov 2026',
    startTime: '17:00',
    endTime: '03:00',
    location: 'Arequipa, Perú',
    venueDetail: 'Hacienda Los Álamos, Tiabaya, Arequipa',
    client: 'María López',
    clientEmail: 'marialopez@email.com',
    clientPhone: '+51 987 654 321',
    planner: 'Jerson Huayta',
    plannerInitials: 'JH',
    plannerRole: 'Coordinador Senior',
    budget: 42500,
    paidAmount: 18000,
    committedAmount: 30500,
    status: 'Planificación',
    description: 'Boda civil y religiosa para 180 invitados con banquete de 4 tiempos, coctelería de autor y música en vivo.',
  },
  {
    id: 'EV-2024-081',
    code: 'EV-2024-081',
    name: 'Gala Corporativa Anual 2024',
    subtitle: 'Cena & Premiaciones',
    type: 'Corporativo',
    date: '2024-11-18',
    dateFormatted: '18 Nov 2024',
    startTime: '19:30',
    endTime: '01:30',
    location: 'Hotel Alvear Palace',
    venueDetail: 'Salón Imperial, Hotel Alvear Palace',
    client: 'Tech Innovations Corp',
    clientEmail: 'eventos@techinnovations.com',
    clientPhone: '+51 998 112 233',
    planner: 'Sofía R.',
    plannerInitials: 'SR',
    plannerRole: 'Coordinadora Senior',
    budget: 42500,
    paidAmount: 28000,
    committedAmount: 38000,
    status: 'En progreso',
    description: 'Cena anual de premiación para directivos y partners estratégicos de Tech Innovations Corp.',
  },
  {
    id: 'EV-2024-082',
    code: 'EV-2024-082',
    name: 'Convención Anual de Finanzas',
    subtitle: 'Congreso Ejecutivo',
    type: 'Conferencia',
    date: '2024-12-02',
    dateFormatted: '02 Dic 2024',
    startTime: '08:30',
    endTime: '19:00',
    location: 'Centro de Convenciones 28 de Julio',
    venueDetail: 'Auditorio Principal, Miraflores, Lima',
    client: 'Banco Santander',
    clientEmail: 'relaciones@santander.com.pe',
    clientPhone: '+51 945 882 109',
    planner: 'Carlos M.',
    plannerInitials: 'CM',
    plannerRole: 'Admin de Empresa',
    budget: 85000,
    paidAmount: 65000,
    committedAmount: 82000,
    status: 'Confirmado',
    description: 'Cumbre financiera regional con más de 450 participantes y transmisión simultánea.',
  },
  {
    id: 'EV-2024-083',
    code: 'EV-2024-083',
    name: 'Boda Sofía & Felipe',
    subtitle: 'Recepción Nupcial',
    type: 'Matrimonio',
    date: '2024-12-14',
    dateFormatted: '14 Dic 2024',
    startTime: '16:30',
    endTime: '02:00',
    location: 'Hacienda Villa Verde, Lurín',
    venueDetail: 'Jardines Principales, Hacienda Villa Verde',
    client: 'Familia Delgado',
    clientEmail: 'contacto@familiadelgado.pe',
    clientPhone: '+51 984 332 100',
    planner: 'Martín L.',
    plannerInitials: 'ML',
    plannerRole: 'Planner Corporativo',
    budget: 35000,
    paidAmount: 14000,
    committedAmount: 29000,
    status: 'Planificación',
    description: 'Ceremonia al aire libre y recepción para 220 invitados.',
  },
  {
    id: 'EV-2025-085',
    code: 'EV-2025-085',
    name: 'Cumbre Global de Innovación 2025',
    subtitle: 'Congreso Tecnológico',
    type: 'Conferencia',
    date: '2025-01-10',
    dateFormatted: '10 Ene 2025',
    startTime: '09:00',
    endTime: '20:00',
    location: 'Centro de Convenciones Norte',
    venueDetail: 'Pabellón A & B, Centro de Convenciones Norte',
    client: 'Tech Innovations Corp',
    planner: 'Sofía R.',
    plannerInitials: 'SR',
    budget: 95000,
    paidAmount: 52000,
    committedAmount: 88000,
    status: 'En progreso',
  },
  {
    id: 'EV-2025-086',
    code: 'EV-2025-086',
    name: 'Lanzamiento Corporativo Q1',
    subtitle: 'Presentación de Producto',
    type: 'Corporativo',
    date: '2025-01-15',
    dateFormatted: '15 Ene 2025',
    startTime: '18:00',
    endTime: '23:00',
    location: 'Auditorio Westin Lima',
    venueDetail: 'Gran Salón Limatambo, Hotel Westin',
    client: 'Grupo Prisma',
    planner: 'Sofía R.',
    plannerInitials: 'SR',
    budget: 120000,
    paidAmount: 120000,
    committedAmount: 120000,
    status: 'Completado',
  },
  {
    id: 'EV-2025-087',
    code: 'EV-2025-087',
    name: 'Matrimonio Civil Lucía & Andrés',
    subtitle: 'Ceremonia Civil',
    type: 'Matrimonio',
    date: '2025-02-28',
    dateFormatted: '28 Feb 2025',
    startTime: '13:00',
    endTime: '20:00',
    location: 'Terraza Club Suizo',
    venueDetail: 'Terraza Panorámica, Miraflores',
    client: 'Lucía & Andrés',
    planner: 'Martín L.',
    plannerInitials: 'ML',
    budget: 18200,
    paidAmount: 0,
    committedAmount: 0,
    status: 'Cancelado',
  },
];

const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'PRV-2024-0012',
    code: 'PRV-2024-0012',
    commercialName: 'Catering Gourmet Del Sur',
    legalName: 'Del Sur Banquetes S.A.C.',
    ruc: '20601928371',
    category: 'Catering',
    description: 'Servicio integral de banquetería gourmet, bocaditos de autor y estaciones en vivo para bodas y galas corporativas.',
    contactName: 'Roberto Valdivia',
    phone: '+51 958 221 443',
    email: 'contacto@gourmetdelsur.pe',
    address: 'Av. Las Quintas 340, Cayma',
    city: 'Arequipa',
    eventsCount: 14,
    status: 'Activo',
    registeredDate: '10 Feb 2024',
    initials: 'CG',
    avatarColor: 'bg-amber-100 text-amber-900',
    internalNotes: 'Proveedor homologado nivel A. Tiempos de respuesta menores a 24h. Capacidad hasta 800 comensales.',
    viewed: true,
  },
  {
    id: 'PRV-2024-0013',
    code: 'PRV-2024-0013',
    commercialName: 'Visual Studio Arequipa',
    legalName: 'Visual Studio Fotografía E.I.R.L.',
    ruc: '10459203912',
    category: 'Fotografía',
    description: 'Cobertura fotográfica documental, cine de bodas 4K, tomas aéreas con drone y álbumes editoriales.',
    contactName: 'Andrea Morales',
    phone: '+51 984 110 998',
    email: 'produccion@visualstudioaqp.com',
    address: 'Calle Mercaderes 215, Cercado',
    city: 'Arequipa',
    eventsCount: 9,
    status: 'Activo',
    registeredDate: '22 Mar 2024',
    initials: 'VS',
    avatarColor: 'bg-sky-100 text-sky-900',
    internalNotes: 'Excelente entrega de material editado en 10 días hábiles.',
  },
  {
    id: 'PRV-2024-0014',
    code: 'PRV-2024-0014',
    commercialName: 'DecoFlor Ambientes',
    legalName: 'Flores & Diseños Perú S.A.',
    ruc: '20491029341',
    category: 'Decoración',
    description: 'Diseño floral de alto impacto, estructuras aéreas, mobiliario lounge y ambientación temática.',
    contactName: 'Lucía Gómez',
    phone: '+51 954 876 123',
    email: 'lucia@decoflor.pe',
    address: 'Av. Ejército 710, Yanahuara',
    city: 'Arequipa',
    eventsCount: 12,
    status: 'Activo',
    registeredDate: '05 Abr 2024',
    initials: 'DF',
    avatarColor: 'bg-pink-100 text-pink-900',
  },
  {
    id: 'PRV-2024-0015',
    code: 'PRV-2024-0015',
    commercialName: 'Luces & Sonido Andino',
    legalName: 'Andino Pro Eventos S.A.C.',
    ruc: '20455891024',
    category: 'Música & Sonido',
    description: 'Sistemas line-array, consolas digitales, cabezas móviles beam y pantallas LED de alta resolución.',
    contactName: 'Jorge Quispe',
    phone: '+51 984 112 900',
    email: 'jorge@sonidoandino.pe',
    address: 'Parque Industrial Río Seco Mz D',
    city: 'Arequipa',
    eventsCount: 7,
    status: 'Activo',
    registeredDate: '18 Jun 2024',
    initials: 'LS',
    avatarColor: 'bg-purple-100 text-purple-900',
  },
  {
    id: 'PRV-2024-0016',
    code: 'PRV-2024-0016',
    commercialName: 'Hacienda San José Venues',
    legalName: 'Inversiones Rústicas S.A.',
    ruc: '20556781290',
    category: 'Venue / Locación',
    description: 'Casona histórica y jardines de 4,000 m² con capilla privada y estacionamiento para 120 vehículos.',
    contactName: 'Camila Benavides',
    phone: '+51 977 443 219',
    email: 'eventos@haciendasanjose.pe',
    address: 'Km 12 Vía Paisajista, Tiabaya',
    city: 'Arequipa',
    eventsCount: 16,
    status: 'Activo',
    registeredDate: '11 Ene 2024',
    initials: 'HS',
    avatarColor: 'bg-emerald-100 text-emerald-900',
  },
  {
    id: 'PRV-2024-0017',
    code: 'PRV-2024-0017',
    commercialName: 'Transportes & Logística Express',
    legalName: 'LogiTrans Perú S.A.C.',
    ruc: '20100492811',
    category: 'Transporte',
    description: 'Flota de vans ejecutivas Mercedes-Benz Sprinter y buses turísticos para traslado seguro de invitados.',
    contactName: 'Fernando Silva',
    phone: '+51 940 332 109',
    email: 'transportes@express.pe',
    address: 'Av. Parra 208, Cercado',
    city: 'Arequipa',
    eventsCount: 4,
    status: 'Inactivo',
    registeredDate: '09 Ago 2024',
    initials: 'TL',
    avatarColor: 'bg-gray-200 text-gray-700',
  },
  {
    id: 'PRV-2024-0018',
    code: 'PRV-2024-0018',
    commercialName: 'DJ & Orquesta Sabor Real',
    legalName: 'Sabor Real Producciones S.A.C.',
    ruc: '10839201948',
    category: 'Música & Sonido',
    description: 'Orquesta digital de 12 músicos en escena y DJ residente especializado en bodas y eventos corporativos.',
    contactName: 'Marco Díaz',
    phone: '+51 987 654 321',
    email: 'eventos@saborreal.pe',
    address: 'Av. Dolores 145, JLByR',
    city: 'Arequipa',
    eventsCount: 8,
    status: 'Activo',
    registeredDate: '14 Nov 2024',
    initials: 'DJ',
    avatarColor: 'bg-indigo-100 text-indigo-900',
  },
  {
    id: 'PRV-2024-0019',
    code: 'PRV-2024-0019',
    commercialName: 'Pastelería & Alta Repostería Dulce Arte',
    legalName: 'Dulce Arte Boutique S.A.C.',
    ruc: '20549281921',
    category: 'Catering',
    description: 'Tortas nupciales escultóricas y mesas de postres de vanguardia con insumos importados.',
    contactName: 'Elena Pinto',
    phone: '+51 954 112 334',
    email: 'contacto@dulcearte.pe',
    address: 'Calle San Francisco 301',
    city: 'Arequipa',
    eventsCount: 3,
    status: 'Activo',
    registeredDate: '03 Dic 2024',
    initials: 'DA',
    avatarColor: 'bg-yellow-100 text-yellow-900',
  },
];

const INITIAL_EVENT_PROVIDERS: EventProviderRelation[] = [
  {
    id: 'EPR-01',
    eventId: 'EV-2026-084',
    providerId: 'PRV-2024-0012',
    providerName: 'Catering Gourmet Del Sur',
    email: 'contacto@gourmetdelsur.pe',
    phone: '+51 958 221 443',
    category: 'Catering',
    icon: 'restaurant',
    iconBg: 'bg-amber-50 text-amber-800 border-amber-200/60',
    serviceDescription: 'Banquete 3 tiempos (180 pax) + Estación de cócteles',
    serviceSubtext: 'Incluye menajería y personal',
    status: 'Confirmado',
    budget: 18500,
    budgetNote: 'Contrato firmado',
    paymentStatus: 'Pagado',
  },
  {
    id: 'EPR-02',
    eventId: 'EV-2026-084',
    providerId: 'PRV-2024-0013',
    providerName: 'Visual Studio Arequipa',
    email: 'produccion@visualstudioaqp.com',
    phone: '+51 984 110 998',
    category: 'Fotografía',
    icon: 'photo_camera',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    serviceDescription: 'Cobertura completa 10h + Video 4K Drone',
    serviceSubtext: '2 cámaras principales',
    status: 'Seleccionado',
    budget: 4800,
    budgetNote: 'Adelanto requerido: 30%',
    paymentStatus: 'Pendiente',
  },
  {
    id: 'EPR-03',
    eventId: 'EV-2026-084',
    providerId: 'PRV-2024-0014',
    providerName: 'Flores & Ambientes Perú',
    email: 'contacto@floresyambientes.com',
    phone: '+51 954 876 123',
    category: 'Decoración',
    icon: 'local_florist',
    iconBg: 'bg-pink-50 text-pink-700 border-pink-200/60',
    serviceDescription: 'Arreglos florales ceremonia y mesas',
    serviceSubtext: 'Incluye estructura y desmontaje',
    status: 'En evaluación',
    budget: 7200,
    budgetNote: 'Propuesta v2 recibida',
    paymentStatus: 'Pendiente',
  },
  {
    id: 'EPR-04',
    eventId: 'EV-2026-084',
    providerId: 'PRV-2024-0018',
    providerName: 'DJ & Orquesta Sabor Real',
    email: 'eventos@saborreal.pe',
    phone: '+51 987 654 321',
    category: 'Música & Sonido',
    icon: 'music_note',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    serviceDescription: 'DJ en vivo 6 horas + Luces inteligentes',
    serviceSubtext: 'Sonido lineal line-array',
    status: 'Propuesto',
    budget: 0,
    budgetNote: 'Esperando cotización',
    paymentStatus: 'Pendiente',
  },
];

const INITIAL_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'BC-01',
    eventId: 'EV-2026-084',
    name: 'Catering',
    icon: 'restaurant',
    iconBg: 'bg-amber-50 text-amber-800 border-amber-200/60',
    linkedProvidersCount: 1,
    primaryProviderName: 'Catering Gourmet Del Sur',
    primaryProviderService: 'Banquete 3 tiempos (180 pax)',
    primaryProviderStatus: 'Confirmado',
    allocated: 18000,
    committed: 18500,
    paid: 10000,
    pending: 8500,
    status: 'Sobre presupuesto',
    notes: 'Ampliación de barra libre de autor solicitada por el cliente.',
  },
  {
    id: 'BC-02',
    eventId: 'EV-2026-084',
    name: 'Fotografía',
    icon: 'photo_camera',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    linkedProvidersCount: 1,
    primaryProviderName: 'Visual Studio Arequipa',
    primaryProviderService: 'Cobertura completa 10h + Drone',
    primaryProviderStatus: 'Seleccionado',
    allocated: 5000,
    committed: 4800,
    paid: 3000,
    pending: 1800,
    status: 'Dentro del presupuesto',
  },
  {
    id: 'BC-03',
    eventId: 'EV-2026-084',
    name: 'Decoración',
    icon: 'local_florist',
    iconBg: 'bg-pink-50 text-pink-700 border-pink-200/60',
    linkedProvidersCount: 1,
    primaryProviderName: 'Flores & Ambientes Perú',
    primaryProviderService: 'Arreglos florales y centros de mesa',
    primaryProviderStatus: 'En evaluación',
    allocated: 8000,
    committed: 7200,
    paid: 5000,
    pending: 2200,
    status: 'Cerca del límite',
  },
  {
    id: 'BC-04',
    eventId: 'EV-2026-084',
    name: 'Música & Sonido',
    icon: 'music_note',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    linkedProvidersCount: 1,
    primaryProviderName: 'DJ & Orquesta Sabor Real',
    primaryProviderService: 'DJ Set + Luces inteligentes',
    primaryProviderStatus: 'Propuesto',
    allocated: 4000,
    committed: 3500,
    paid: 2000,
    pending: 1500,
    status: 'Dentro del presupuesto',
  },
  {
    id: 'BC-05',
    eventId: 'EV-2026-084',
    name: 'Venue (Local)',
    icon: 'location_city',
    iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
    linkedProvidersCount: 1,
    primaryProviderName: 'Hacienda El Carmen',
    primaryProviderService: 'Alquiler exclusivo de jardines y salón',
    primaryProviderStatus: 'Confirmado',
    allocated: 6500,
    committed: 6500,
    paid: 3000,
    pending: 3500,
    status: 'Dentro del presupuesto',
  },
  {
    id: 'BC-06',
    eventId: 'EV-2026-084',
    name: 'Transporte',
    icon: 'airport_shuttle',
    iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    linkedProvidersCount: 0,
    primaryProviderName: 'Sin proveedores asignados',
    primaryProviderService: 'Pendiente de cotización',
    primaryProviderStatus: 'Propuesto',
    allocated: 1000,
    committed: 0,
    paid: 0,
    pending: 0,
    status: 'Dentro del presupuesto',
  },
];

const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: 'PAY-01',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    providerName: 'Catering Gourmet Del Sur',
    providerRuc: '20601839201',
    concept: 'Adelanto catering (reserva 50%)',
    category: 'Catering',
    icon: 'restaurant',
    iconBg: 'bg-amber-50 text-amber-800 border-amber-200/60',
    amount: 10000,
    date: '24 Oct 2026',
    method: 'Transferencia (BCP)',
    methodIcon: 'account_balance',
    status: 'Pagado',
    receiptCode: 'REC-2026-001',
  },
  {
    id: 'PAY-02',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    providerName: 'Catering Gourmet Del Sur',
    providerRuc: '20601839201',
    concept: 'Segundo abono menajería y banquete',
    category: 'Catering',
    icon: 'restaurant',
    iconBg: 'bg-amber-50 text-amber-800 border-amber-200/60',
    amount: 5000,
    date: '05 Nov 2026',
    method: 'Transferencia (BCP)',
    methodIcon: 'account_balance',
    status: 'Pagado',
    receiptCode: 'REC-2026-002',
  },
  {
    id: 'PAY-03',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    providerName: 'Visual Studio Arequipa',
    providerRuc: '10459203912',
    concept: 'Adelanto fotografía y cobertura video',
    category: 'Fotografía',
    icon: 'photo_camera',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    amount: 3000,
    date: '28 Oct 2026',
    method: 'Tarjeta de crédito',
    methodIcon: 'credit_card',
    status: 'Pagado',
    receiptCode: 'REC-2026-003',
  },
  {
    id: 'PAY-04',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    providerName: 'Flores & Ambientes Perú',
    providerRuc: '20491029341',
    concept: 'Señal de reserva arreglos florales',
    category: 'Decoración',
    icon: 'local_florist',
    iconBg: 'bg-pink-50 text-pink-700 border-pink-200/60',
    amount: 2000,
    date: '15 Nov 2026',
    method: 'Yape / Plin',
    methodIcon: 'phone_android',
    status: 'Programado',
  },
  {
    id: 'PAY-05',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    providerName: 'DJ & Orquesta Sabor Real',
    providerRuc: '10839201948',
    concept: 'Pago total servicio DJ y luces',
    category: 'Música & Sonido',
    icon: 'music_note',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    amount: 2500,
    date: '18 Nov 2026',
    method: 'Transferencia (BBVA)',
    methodIcon: 'account_balance',
    status: 'Pendiente',
  },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-01',
    eventId: 'EV-2026-084',
    fileName: 'Contrato_Catering_Gourmet_Del_Sur_vFinal.pdf',
    fileSize: '2.4 MB',
    fileFormat: 'PDF',
    type: 'Contrato',
    category: 'Catering',
    relatedTo: 'Catering Gourmet Del Sur',
    relatedSubtext: 'Catering',
    uploadDate: '12 Oct 2026',
    uploadedBy: 'Jerson Huayta (Planner)',
    verified: true,
    icon: 'picture_as_pdf',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
    description: 'Contrato firmado electrónicamente por ambas partes con anexo de menú de 4 tiempos y menajería.',
  },
  {
    id: 'DOC-02',
    eventId: 'EV-2026-084',
    fileName: 'Comprobante_Abono_Reserva_Catering_OP59201.pdf',
    fileSize: '840 KB',
    fileFormat: 'PDF',
    type: 'Comprobante',
    category: 'Catering',
    relatedTo: 'Pago #01 (S/ 10,000.00)',
    relatedSubtext: 'Transferencia BCP',
    uploadDate: '14 Oct 2026',
    uploadedBy: 'Carlos Mendoza (Admin)',
    icon: 'picture_as_pdf',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200/60',
  },
  {
    id: 'DOC-03',
    eventId: 'EV-2026-084',
    fileName: 'Cotizacion_Fotografia_VisualStudio_2026.pdf',
    fileSize: '1.8 MB',
    fileFormat: 'PDF',
    type: 'Cotización',
    category: 'Fotografía',
    relatedTo: 'Visual Studio Arequipa',
    relatedSubtext: 'Fotografía',
    uploadDate: '28 Oct 2026',
    uploadedBy: 'Jerson Huayta (Planner)',
    icon: 'description',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
  },
  {
    id: 'DOC-04',
    eventId: 'EV-2026-084',
    fileName: 'Plano_Distribucion_Mesas_Hacienda_Los_Alamos.pdf',
    fileSize: '3.5 MB',
    fileFormat: 'PDF',
    type: 'Técnico / Plano',
    category: 'Venue',
    relatedTo: 'General del evento',
    relatedSubtext: 'Venue & Distribución',
    uploadDate: '02 Nov 2026',
    uploadedBy: 'María López (Cliente)',
    icon: 'architecture',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
  },
  {
    id: 'DOC-05',
    eventId: 'EV-2026-084',
    fileName: 'Acuerdo_Servicio_DecoFlor_Firmado.pdf',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    type: 'Contrato',
    category: 'Decoración',
    relatedTo: 'DecoFlor Arequipa',
    relatedSubtext: 'Decoración',
    uploadDate: '05 Nov 2026',
    uploadedBy: 'Jerson Huayta (Planner)',
    verified: true,
    icon: 'assignment_turned_in',
    iconBg: 'bg-pink-50 text-pink-700 border-pink-200/60',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'TSK-01',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    title: 'Degustación de menú de 4 tiempos',
    description: 'Prueba final de aperitivos, platos de fondo y maridaje de vinos en showroom.',
    relation: 'Catering',
    relationColor: 'bg-amber-50 text-amber-800 border-amber-200',
    assigneeName: 'Jerson Huayta',
    assigneeRole: 'Planner',
    assigneeInitials: 'JH',
    assigneeColor: 'bg-slate-800 text-white',
    dueDate: '12 Oct 2026',
    dueTime: '16:00',
    relativeDue: 'Atrasada',
    isOverdue: true,
    priority: 'Alta',
    status: 'En progreso',
    completed: false,
    relatedProvider: 'Catering Gourmet Del Sur',
    budgetCategory: 'Catering & Coctelería',
  },
  {
    id: 'TSK-02',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    title: 'Confirmar repertorio musical para ceremonia',
    description: 'Entrega del setlist para cuarteto de cuerdas en entrada nupcial.',
    relation: 'Música',
    relationColor: 'bg-purple-50 text-purple-800 border-purple-200',
    assigneeName: 'María López',
    assigneeRole: 'Cliente',
    assigneeInitials: 'ML',
    assigneeColor: 'bg-pink-600 text-white',
    dueDate: '14 Oct 2026',
    dueTime: '18:00',
    relativeDue: 'Atrasada',
    isOverdue: true,
    priority: 'Alta',
    status: 'Pendiente',
    completed: false,
  },
  {
    id: 'TSK-03',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    title: 'Selección de paleta floral y centros de mesa',
    description: 'Revisión de muestras de hortensias, rosas y montaje testigo.',
    relation: 'Decoración',
    relationColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    assigneeName: 'Jerson Huayta',
    assigneeRole: 'Planner',
    assigneeInitials: 'JH',
    assigneeColor: 'bg-slate-800 text-white',
    dueDate: '24 Oct 2026',
    dueTime: '11:00',
    relativeDue: 'En 6 días',
    isOverdue: false,
    priority: 'Media',
    status: 'En progreso',
    completed: false,
  },
  {
    id: 'TSK-04',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    title: 'Validación de plano de distribución de mesas',
    description: 'Confirmación de 22 mesas redondas y pasarela de ingreso según aforo.',
    relation: 'Logística',
    relationColor: 'bg-blue-50 text-blue-800 border-blue-200',
    assigneeName: 'Carlos Mendoza',
    assigneeRole: 'Admin',
    assigneeInitials: 'CM',
    assigneeColor: 'bg-slate-600 text-white',
    dueDate: '02 Nov 2026',
    dueTime: '15:00',
    relativeDue: 'En 15 días',
    isOverdue: false,
    priority: 'Media',
    status: 'Pendiente',
    completed: false,
  },
  {
    id: 'TSK-05',
    eventId: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    title: 'Firma de contrato de fotografía y video',
    description: 'Adelanto del 50% transferido con póliza de servicio firmada.',
    relation: 'Fotografía',
    relationColor: 'bg-gray-100 text-gray-600 border-gray-200',
    assigneeName: 'Jerson Huayta',
    assigneeRole: 'Planner',
    assigneeInitials: 'JH',
    assigneeColor: 'bg-slate-800 text-white',
    dueDate: '05 Oct 2026',
    dueTime: '10:00',
    relativeDue: 'Finalizada',
    isOverdue: false,
    priority: 'Baja',
    status: 'Completada',
    completed: true,
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-98425',
    logCode: 'LOG-98425',
    eventId: 'EV-2026-084',
    dateGroup: 'Hoy — 28 Oct 2026',
    timestamp: '28 Oct 2026, 11:20 AM',
    relativeTime: 'Hoy, 11:20 AM',
    user: 'María López',
    userRole: 'Cliente',
    userInitials: 'ML',
    category: 'Tareas',
    actionTitle: 'Tarea verificada y completada',
    summaryHtml: '<strong>María López</strong> <span class="text-slate-500 text-xs">(Cliente)</span> marcó la tarea <span class="font-medium">"Degustación de menú de 4 tiempos"</span> como completada.',
    icon: 'check_box',
    moduleOrigin: 'Tareas · Cronograma Nupcial #08',
    ipAddress: '190.237.88.19',
    budgetItemName: 'Degustación de menú de 4 tiempos',
    previousValue: 'En progreso',
    newValue: 'Completada',
    percentageDelta: '100%',
    netVariation: 'Verificada por cliente',
    justification: 'Aprobación conforme tras sesión presencial de degustación con el chef ejecutivo de Catering Gourmet Del Sur.',
    targetTab: 'tareas',
    metaTag: 'Verificada',
  },
  {
    id: 'LOG-98422',
    logCode: 'LOG-98422',
    eventId: 'EV-2026-084',
    dateGroup: 'Hoy — 28 Oct 2026',
    timestamp: '28 Oct 2026, 09:45 AM',
    relativeTime: 'Hoy, 09:45 AM',
    user: 'Carlos Mendoza',
    userRole: 'Admin de Empresa',
    userInitials: 'CM',
    category: 'Pagos',
    actionTitle: 'Pago de proveedor registrado',
    summaryHtml: '<strong>Carlos Mendoza</strong> <span class="text-slate-500 text-xs">(Admin)</span> registró un pago de <strong>S/ 18,000.00</strong> a <span class="font-medium">"Catering Gourmet Del Sur"</span>.',
    icon: 'credit_card',
    moduleOrigin: 'Pagos · Recibo REC-2026-001',
    ipAddress: '200.48.112.10',
    budgetItemName: 'Catering Gourmet Del Sur — Adelanto',
    previousValue: 'S/ 0.00',
    newValue: 'S/ 18,000.00',
    percentageDelta: '42.4%',
    netVariation: '+S/ 18,000.00 pagado',
    justification: 'Transferencia bancaria vía Telecrédito BCP correspondiente al primer y segundo tramo del contrato de catering.',
    targetTab: 'pagos',
    metaTag: 'REC-2026-001',
  },
  {
    id: 'LOG-98421',
    logCode: 'LOG-98421',
    eventId: 'EV-2026-084',
    dateGroup: 'Ayer — 27 Oct 2026',
    timestamp: '27 Oct 2026, 16:15 PM',
    relativeTime: 'Ayer, 16:15 PM',
    user: 'Jerson Huayta',
    userRole: 'Planner Líder',
    userInitials: 'JH',
    category: 'Presupuesto',
    actionTitle: 'Presupuesto actualizado',
    summaryHtml: '<strong>Jerson Huayta</strong> <span class="text-slate-500 text-xs">(Planner)</span> actualizó el presupuesto de la categoría <span class="font-medium">"Catering & Coctelería"</span> de <span class="line-through text-slate-400">S/ 15,000.00</span> a <strong class="text-[#745b00]">S/ 16,500.00</strong>.',
    icon: 'account_balance_wallet',
    moduleOrigin: 'Presupuesto · Partida 04-CAT',
    ipAddress: '190.237.112.44',
    budgetItemName: 'Catering & Coctelería',
    previousValue: 'S/ 15,000.00',
    newValue: 'S/ 16,500.00',
    percentageDelta: '+10.0%',
    netVariation: '+S/ 1,500.00',
    justification: 'Ampliación de 2 horas adicionales en servicio de barra libre de autor solicitada directamente por el cliente María López, incluyendo bartender adicional y cristalería premium.',
    targetTab: 'presupuesto',
    metaTag: 'Motivo: Inclusión de barra libre de autor',
  },
  {
    id: 'LOG-98419',
    logCode: 'LOG-98419',
    eventId: 'EV-2026-084',
    dateGroup: 'Ayer — 27 Oct 2026',
    timestamp: '27 Oct 2026, 14:05 PM',
    relativeTime: 'Ayer, 14:05 PM',
    user: 'Carlos Mendoza',
    userRole: 'Admin de Empresa',
    userInitials: 'CM',
    category: 'Documentos',
    actionTitle: 'Documento legal cargado',
    summaryHtml: '<strong>Carlos Mendoza</strong> subió el documento <code class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">contrato-catering-firmado.pdf</code> (2.4 MB).',
    icon: 'description',
    moduleOrigin: 'Documentos · Repositorio Legal',
    ipAddress: '200.48.112.10',
    budgetItemName: 'Contrato_Catering_Gourmet_Del_Sur_vFinal.pdf',
    previousValue: 'Sin archivo adjunto',
    newValue: 'PDF Verificado (2.4 MB)',
    percentageDelta: '100%',
    netVariation: '+1 contrato firmado',
    justification: 'Documento firmado digitalmente con validez jurídica y anexos técnicos de menajería.',
    targetTab: 'documentos',
    metaTag: 'Categoría: Contratos',
  },
  {
    id: 'LOG-98410',
    logCode: 'LOG-98410',
    eventId: 'EV-2026-084',
    dateGroup: '24 Oct 2026',
    timestamp: '24 Oct 2026, 17:30 PM',
    relativeTime: '24 Oct 2026, 17:30 PM',
    user: 'Jerson Huayta',
    userRole: 'Planner Líder',
    userInitials: 'JH',
    category: 'Proveedores',
    actionTitle: 'Proveedor vinculado al evento',
    summaryHtml: '<strong>Jerson Huayta</strong> vinculó al proveedor <span class="font-medium">"Visual Studio Arequipa"</span> al evento con estado <span class="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-300">Confirmado</span>.',
    icon: 'storefront',
    moduleOrigin: 'Proveedores · Asignación EPR-02',
    ipAddress: '190.237.112.44',
    budgetItemName: 'Visual Studio Arequipa',
    previousValue: 'No vinculado',
    newValue: 'Confirmado (S/ 4,800.00)',
    percentageDelta: '+1 proveedor',
    netVariation: 'S/ 4,800.00 comprometidos',
    justification: 'Selección aprobada por los novios para cobertura de 10 horas y drone 4K.',
    targetTab: 'proveedores',
  },
  {
    id: 'LOG-98395',
    logCode: 'LOG-98395',
    eventId: 'EV-2026-084',
    dateGroup: '16 Oct 2026',
    timestamp: '16 Oct 2026, 12:00 PM',
    relativeTime: '16 Oct 2026, 12:00 PM',
    user: 'Carlos Mendoza',
    userRole: 'Admin de Empresa',
    userInitials: 'CM',
    category: 'Evento',
    actionTitle: 'Cambio de estado del proyecto',
    summaryHtml: '<strong>Carlos Mendoza</strong> cambió el estado del evento de <span class="line-through text-slate-400">"Borrador"</span> a <span class="px-1.5 py-0.5 rounded-full bg-[#f2c94c]/25 text-[#6b5400] font-semibold border border-[#f2c94c] text-[11px]">"Planificación"</span>.',
    icon: 'published_with_changes',
    moduleOrigin: 'Evento · Configuración General',
    ipAddress: '200.48.112.10',
    budgetItemName: 'Estado Operativo EV-2026-084',
    previousValue: 'Borrador',
    newValue: 'Planificación',
    percentageDelta: 'Activo',
    netVariation: 'Inicio de cronograma',
    justification: 'Apertura oficial del expediente tras firma de contrato de wedding planning.',
    targetTab: 'resumen',
  },
];

const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 'SUB-2026-0841',
    code: 'SUB-2026-0841',
    companyName: 'Bodas & Galas Perú S.A.C.',
    ruc: '20608912345',
    city: 'Lima',
    initials: 'BG',
    plan: 'Profesional',
    billingCycle: 'Mensual',
    amount: 350,
    status: 'Activa',
    startDate: '15 Ene 2026',
    nextBillingDate: '15 Oct 2026',
    paymentMethod: 'Visa •••• 4242',
    paymentIcon: 'credit_card',
    cardEnding: '4242',
    cardExpiry: '08/2028',
    invoices: [
      {
        id: 'TXN-2026-89210',
        code: 'REC-8921',
        date: '15 Sep 2026',
        time: '09:14:22 AM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (15 Sep - 15 Oct 2026)',
        method: 'Visa •••• 4242',
        amount: 350,
        status: 'Pagado',
      },
      {
        id: 'TXN-2026-88904',
        code: 'REC-8890',
        date: '14 Sep 2026',
        time: '23:45:10 PM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (15 Sep - 15 Oct 2026)',
        method: 'Visa •••• 1904',
        amount: 350,
        status: 'Rechazado',
        rejectionReason: 'Rechazado por banco emisor: Límite diario de compras online excedido (Código 61)',
      },
      {
        id: 'TXN-2026-76401',
        code: 'REC-7640',
        date: '15 Ago 2026',
        time: '09:05:44 AM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (15 Ago - 15 Sep 2026)',
        method: 'Visa •••• 4242',
        amount: 350,
        status: 'Pagado',
      },
      {
        id: 'TXN-2026-64120',
        code: 'REC-6412',
        date: '15 Jul 2026',
        time: '09:11:03 AM',
        planName: 'Starter',
        billingPeriod: 'Mensual (15 Jul - 15 Ago 2026)',
        method: 'Visa •••• 4242',
        amount: 180,
        status: 'Pagado',
      },
    ],
  },
  {
    id: 'SUB-2026-0842',
    code: 'SUB-2026-0842',
    companyName: 'Eventos & Producciones Lima E.I.R.L.',
    ruc: '20554189021',
    city: 'Miraflores',
    initials: 'EP',
    plan: 'Enterprise',
    billingCycle: 'Anual',
    amount: 4200,
    status: 'Activa',
    startDate: '22 Nov 2025',
    nextBillingDate: '22 Nov 2026',
    paymentMethod: 'Transferencia bancaria',
    paymentIcon: 'account_balance',
    invoices: [
      {
        id: 'TXN-2025-51029',
        code: 'REC-5102',
        date: '22 Nov 2025',
        time: '14:28:15 PM',
        planName: 'Enterprise',
        billingPeriod: 'Anual Corporativo (Nov 2025 - Nov 2026)',
        method: 'Transferencia BCP Telecrédito',
        amount: 4200,
        status: 'Pagado',
      },
      {
        id: 'TXN-2024-31088',
        code: 'REC-3108',
        date: '22 Nov 2024',
        time: '11:40:00 AM',
        planName: 'Profesional',
        billingPeriod: 'Anual (Nov 2024 - Nov 2025)',
        method: 'Transferencia BCP Telecrédito',
        amount: 3500,
        status: 'Pagado',
      },
    ],
  },
  {
    id: 'SUB-2026-0843',
    code: 'SUB-2026-0843',
    companyName: 'Catering & Protocolo del Sur',
    ruc: '20491028374',
    city: 'Arequipa',
    initials: 'CP',
    plan: 'Profesional',
    billingCycle: 'Mensual',
    amount: 350,
    status: 'Pendiente de pago',
    startDate: '28 Mar 2026',
    nextBillingDate: '28 Sep 2026',
    paymentMethod: 'Mastercard •••• 8812',
    paymentIcon: 'credit_card',
    cardEnding: '8812',
    cardExpiry: '11/2027',
    invoices: [
      {
        id: 'TXN-2026-90124',
        code: 'REC-9012',
        date: '28 Sep 2026',
        time: '10:30:00 AM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (28 Sep - 28 Oct 2026)',
        method: 'Mastercard •••• 8812',
        amount: 350,
        status: 'Pendiente',
      },
      {
        id: 'TXN-2026-89981',
        code: 'REC-8998',
        date: '28 Sep 2026',
        time: '08:00:12 AM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (28 Sep - 28 Oct 2026)',
        method: 'Mastercard •••• 8812',
        amount: 350,
        status: 'Rechazado',
        rejectionReason: 'Fondos insuficientes en tarjeta corporativa (Código pasarela: 51)',
      },
      {
        id: 'TXN-2026-81053',
        code: 'REC-8105',
        date: '28 Ago 2026',
        time: '08:02:19 AM',
        planName: 'Profesional',
        billingPeriod: 'Mensual (28 Ago - 28 Sep 2026)',
        method: 'Mastercard •••• 8812',
        amount: 350,
        status: 'Pagado',
      },
    ],
  },
  {
    id: 'SUB-2026-0844',
    code: 'SUB-2026-0844',
    companyName: 'Momentos Mágicos Wedding Planners',
    ruc: '10459201948',
    city: 'Cusco',
    initials: 'MM',
    plan: 'Starter',
    billingCycle: 'Mensual',
    amount: 180,
    status: 'Prueba (6 días rest.)',
    startDate: '20 Sep 2026',
    nextBillingDate: '04 Oct 2026',
    paymentMethod: 'Pendiente de configurar',
    paymentIcon: 'hourglass_empty',
    invoices: [],
  },
  {
    id: 'SUB-2026-0845',
    code: 'SUB-2026-0845',
    companyName: 'Corporación Celebraciones & Congresos',
    ruc: '20601293847',
    city: 'Trujillo',
    initials: 'CC',
    plan: 'Enterprise',
    billingCycle: 'Anual',
    amount: 4200,
    status: 'Vencida',
    startDate: '12 Sep 2025',
    nextBillingDate: '12 Sep 2026',
    paymentMethod: 'Transferencia bancaria',
    paymentIcon: 'account_balance',
    invoices: [
      {
        id: 'TXN-2026-88019',
        code: 'REC-8801',
        date: '15 Sep 2026',
        time: '16:42:50 PM',
        planName: 'Enterprise',
        billingPeriod: 'Anual (Sep 2026 - Sep 2027)',
        method: 'Débito Automático BBVA',
        amount: 4200,
        status: 'Rechazado',
        rejectionReason: 'Cuenta corriente bloqueada para débito directo sin pre-autorización empresarial',
      },
      {
        id: 'TXN-2026-87550',
        code: 'REC-8755',
        date: '12 Sep 2026',
        time: '09:00:05 AM',
        planName: 'Enterprise',
        billingPeriod: 'Anual (Sep 2026 - Sep 2027)',
        method: 'Transferencia BBVA',
        amount: 4200,
        status: 'Pendiente',
      },
      {
        id: 'TXN-2025-41209',
        code: 'REC-4120',
        date: '12 Sep 2025',
        time: '11:20:33 AM',
        planName: 'Enterprise',
        billingPeriod: 'Anual (Sep 2025 - Sep 2026)',
        method: 'Transferencia BBVA',
        amount: 4200,
        status: 'Pagado',
      },
    ],
  },
];

const INITIAL_CALENDAR_ENTRIES: CalendarEntry[] = [
  { id: 'CAL-01', day: 1, month: 9, year: 2026, title: '09:00 AM Kickoff Gala', time: '09:00 - 11:00', type: 'event', status: 'Confirmado', category: 'Corporativo · Presencial', location: 'Hotel Alvear Palace', planner: 'Sofía R.', client: 'Tech Innovations Corp', eventId: 'EV-2024-081' },
  { id: 'CAL-02', day: 2, month: 9, year: 2026, title: 'Confirmar menú con catering', time: '11:30 - 12:30', type: 'task', status: 'En progreso', category: 'Tarea de Catering', location: 'Showroom Cayma', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-03', day: 4, month: 9, year: 2026, title: '16:00 Aniversario Inretail', time: '16:00 - 23:00', type: 'event', status: 'Confirmado', category: 'Corporativo · Presencial', location: 'Centro de Convenciones Lima', planner: 'Carlos Mendoza', client: 'Grupo Inretail', eventId: 'EV-2024-082' },
  { id: 'CAL-04', day: 5, month: 9, year: 2026, title: '18:30 Boda Campos - Real', time: '18:30 - 02:30', type: 'event', status: 'Confirmado', category: 'Matrimonio · Presencial', location: 'Hacienda San José', planner: 'Martín L.', client: 'Familia Campos', eventId: 'EV-2024-083' },
  { id: 'CAL-05', day: 7, month: 9, year: 2026, title: 'Pago de anticipo salón', time: 'Vencido 09:00', type: 'overdue-task', status: 'Atrasada', category: 'Finanzas y Pagos', location: 'Transferencia BCP', planner: 'Carlos Mendoza', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-06', day: 9, month: 9, year: 2026, title: '11:00 AM Lanzamiento Marca', time: '11:00 - 15:00', type: 'event', status: 'En progreso', category: 'Lanzamiento · Híbrido', location: 'Auditorio Westin Lima', planner: 'Sofía R.', client: 'Grupo Prisma', eventId: 'EV-2025-086' },
  { id: 'CAL-07', day: 10, month: 9, year: 2026, title: 'Revisar contrato de fotografía', time: '15:00 - 16:00', type: 'task', status: 'Pendiente', category: 'Legal y Contratos', location: 'Oficina Central', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-08', day: 11, month: 9, year: 2026, title: '19:00 Cóctel Corporativo', time: '19:00 - 23:30', type: 'event', status: 'Confirmado', category: 'Corporativo · Presencial', location: 'Club Empresarial San Isidro', planner: 'Carlos Mendoza', client: 'Banco Santander', eventId: 'EV-2024-082' },
  { id: 'CAL-09', day: 12, month: 9, year: 2026, title: '17:00 Matrimonio Civil C&R', time: '17:00 - 22:00', type: 'event', status: 'Confirmado', category: 'Matrimonio · Presencial', location: 'Terraza Mirador', planner: 'Martín L.', client: 'Claudia & Rodrigo', eventId: 'EV-2026-084' },
  { id: 'CAL-10', day: 14, month: 9, year: 2026, title: 'Coordinar decoración floral', time: '10:00 - 11:30', type: 'task', status: 'En progreso', category: 'Decoración', location: 'Vivero DecoFlor', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-11', day: 15, month: 9, year: 2026, title: '10:30 Visita Técnica Local', time: '10:30 - 13:00', type: 'event', status: 'En progreso', category: 'Inspección Técnica', location: 'Hacienda Los Álamos, Arequipa', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-12', day: 15, month: 9, year: 2026, title: 'Aprobar plano de luces', time: '16:00 - 17:00', type: 'task', status: 'Pendiente', category: 'Producción Técnica', location: 'Reunión Zoom', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-13', day: 16, month: 9, year: 2026, title: '14:00 Sesión Degustación', time: '14:00 - 16:30', type: 'event', status: 'Confirmado', category: 'Catering & Banquete', location: 'Catering Gourmet Del Sur', planner: 'Jerson Huayta', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-14', day: 17, month: 9, year: 2026, title: 'Ensayo de sonido y DJ', time: '18:00 - 20:00', type: 'task', status: 'Pendiente', category: 'Música & Sonido', location: 'Hacienda Los Álamos', planner: 'Martín L.', client: 'María López', eventId: 'EV-2026-084' },
  { id: 'CAL-15', day: 18, month: 9, year: 2026, title: '18:00 Matrimonio Andrea & Luis', time: 'Viernes 18 Sep 2026, 18:00 - 02:00', type: 'event', status: 'Confirmado', category: 'Matrimonio · Presencial', location: 'Hacienda Villa Verde, Lurín', planner: 'Martín L.', client: 'Andrea & Luis', eventId: 'EV-2026-084' },
  { id: 'CAL-16', day: 19, month: 9, year: 2026, title: '19:00 Fiesta Quinceaños Sofía', time: '19:00 - 02:00', type: 'event', status: 'Confirmado', category: 'Social · Presencial', location: 'Club Árabe', planner: 'Sofía R.', client: 'Familia Mendoza', eventId: 'EV-2024-083' },
  { id: 'CAL-17', day: 21, month: 9, year: 2026, title: 'Liquidación final proveedores', time: '12:00 - 13:00', type: 'task', status: 'Pendiente', category: 'Finanzas', location: 'Plataforma Planery', planner: 'Carlos Mendoza', client: 'Tech Innovations Corp', eventId: 'EV-2024-081' },
  { id: 'CAL-18', day: 22, month: 9, year: 2026, title: '08:30 Seminario Legal', time: '08:30 - 14:00', type: 'event', status: 'Confirmado', category: 'Conferencia · Presencial', location: 'Cámara de Comercio', planner: 'Carlos Mendoza', client: 'Estudio Echecopar', eventId: 'EV-2024-082' },
  { id: 'CAL-19', day: 24, month: 9, year: 2026, title: '09:00 Convención Minera', time: '09:00 - 19:00', type: 'event', status: 'Confirmado', category: 'Congreso · Presencial', location: 'Cerro Juli, Arequipa', planner: 'Jerson Huayta', client: 'Instituto de Minas', eventId: 'EV-2025-085' },
  { id: 'CAL-20', day: 24, month: 9, year: 2026, title: 'Confirmar credenciales VIP', time: '11:00', type: 'task', status: 'Pendiente', category: 'Acreditaciones', location: 'Cerro Juli', planner: 'Jerson Huayta', client: 'Instituto de Minas', eventId: 'EV-2025-085' },
  { id: 'CAL-21', day: 25, month: 9, year: 2026, title: '20:00 Aniversario Corporativo', time: '20:00 - 01:00', type: 'event', status: 'Confirmado', category: 'Corporativo · Presencial', location: 'Hotel Libertador', planner: 'Sofía R.', client: 'Grupo Gloria', eventId: 'EV-2024-081' },
  { id: 'CAL-22', day: 26, month: 9, year: 2026, title: '16:00 Boda Delgado - Vega', time: '16:00 - 02:00', type: 'event', status: 'Planificación', category: 'Matrimonio · Presencial', location: 'Hacienda Villa Verde', planner: 'Martín L.', client: 'Familia Delgado', eventId: 'EV-2024-083' },
  { id: 'CAL-23', day: 28, month: 9, year: 2026, title: 'Reunión de balance mensual', time: '09:30 - 11:00', type: 'task', status: 'Pendiente', category: 'Gestión Interna', location: 'Sala Directorio', planner: 'Carlos Mendoza', client: 'Planery Core', eventId: 'EV-2026-084' },
  { id: 'CAL-24', day: 30, month: 9, year: 2026, title: '18:00 Cierre Q3 Ejecutivos', time: '18:00 - 22:00', type: 'event', status: 'Confirmado', category: 'Corporativo · Presencial', location: 'Hotel Country Club', planner: 'Carlos Mendoza', client: 'Banco Santander', eventId: 'EV-2024-082' },
];

const INITIAL_COMPANIES: PlatformCompany[] = [
  {
    id: 'EMP-2026-0042',
    code: 'EMP-2026-0042',
    commercialName: 'Bodas & Galas Perú S.A.C.',
    legalName: 'Bodas y Galas Eventos Perú Sociedad Anónima Cerrada',
    categorySubtext: 'Organización de eventos & bodas',
    ruc: '20608912345',
    taxStatus: 'Habido / Activo',
    registeredDate: '15 Ene 2026',
    registeredDateLong: '15 de enero de 2026',
    timezone: 'America/Lima (UTC-5)',
    email: 'contacto@bodasgalasperu.pe',
    phone: '+51 984 551 220',
    address: 'Av. El Polo 670, Of. 402, Santiago de Surco, Lima',
    adminName: 'Mariana Cornejo',
    adminEmail: 'm.cornejo@bodasgalasperu.pe',
    adminInitials: 'MC',
    usersTotal: 14,
    usersActive: 12,
    usersInactive: 2,
    plan: 'Profesional',
    billingCycle: 'Mensual',
    monthlyFee: 350,
    nextRenewal: '15 Oct 2026',
    status: 'Activa',
  },
  {
    id: 'EMP-2026-0043',
    code: 'EMP-2026-0043',
    commercialName: 'Eventos & Producciones Lima E.I.R.L.',
    legalName: 'Eventos y Producciones Audiovisuales Lima E.I.R.L.',
    categorySubtext: 'Producción técnica audiovisual',
    ruc: '20554198021',
    taxStatus: 'Habido / Activo',
    registeredDate: '03 Mar 2026',
    registeredDateLong: '03 de marzo de 2026',
    timezone: 'America/Lima (UTC-5)',
    email: 'contacto@eventoslima.pe',
    phone: '+51 992 110 445',
    address: 'Av. Javier Prado Este 2450, San Borja, Lima',
    adminName: 'Jorge Valdivia',
    adminEmail: 'jvaldivia@eventoslima.pe',
    adminInitials: 'JV',
    usersTotal: 28,
    usersActive: 26,
    usersInactive: 2,
    plan: 'Enterprise',
    billingCycle: 'Anual',
    monthlyFee: 890,
    nextRenewal: '03 Mar 2027',
    status: 'Activa',
  },
  {
    id: 'EMP-2026-0044',
    code: 'EMP-2026-0044',
    commercialName: 'Catering & Protocolo del Sur',
    legalName: 'Catering y Protocolo Corporativo del Sur S.A.C.',
    categorySubtext: 'Servicios gastronómicos corporativos',
    ruc: '20491028374',
    taxStatus: 'Habido / Activo',
    registeredDate: '12 May 2026',
    registeredDateLong: '12 de mayo de 2026',
    timezone: 'America/Lima (UTC-5)',
    email: 'administracion@cateringsur.com',
    phone: '+51 958 334 112',
    address: 'Calle Misti 410, Yanahuara, Arequipa',
    adminName: 'Andrea Morales',
    adminEmail: 'amorales@cateringsur.com',
    adminInitials: 'AM',
    usersTotal: 8,
    usersActive: 7,
    usersInactive: 1,
    plan: 'Profesional',
    billingCycle: 'Mensual',
    monthlyFee: 350,
    nextRenewal: '12 Oct 2026',
    status: 'Activa',
  },
  {
    id: 'EMP-2026-0045',
    code: 'EMP-2026-0045',
    commercialName: 'Momentos Mágicos Wedding Planners',
    legalName: 'Momentos Mágicos Coordinación Integral E.I.R.L.',
    categorySubtext: 'Coordinación integral de bodas',
    ruc: '20718293041',
    taxStatus: 'En verificación SUNAT',
    registeredDate: '02 Sep 2026',
    registeredDateLong: '02 de septiembre de 2026',
    timezone: 'America/Lima (UTC-5)',
    email: 'hola@momentosmagicos.pe',
    phone: '+51 974 881 203',
    address: 'Av. El Sol 820, Cercado, Cusco',
    adminName: 'Sofía Alarcón',
    adminEmail: 'salarcon@momentosmagicos.pe',
    adminInitials: 'SA',
    usersTotal: 3,
    usersActive: 3,
    usersInactive: 0,
    plan: 'Starter',
    billingCycle: 'Mensual',
    monthlyFee: 180,
    nextRenewal: '02 Oct 2026',
    status: 'Pendiente',
  },
  {
    id: 'EMP-2025-0039',
    code: 'EMP-2025-0039',
    commercialName: 'Inversiones Gastronómicas Arequipa',
    legalName: 'Inversiones Gastronómicas Arequipa S.R.L.',
    categorySubtext: 'Restauración y eventos',
    ruc: '20392817263',
    taxStatus: 'Suspendido Temporal',
    registeredDate: '20 Nov 2025',
    registeredDateLong: '20 de noviembre de 2025',
    timezone: 'America/Lima (UTC-5)',
    email: 'gerencia@gastronomicasaqp.pe',
    phone: '+51 959 102 394',
    address: 'Av. Bolognesi 120, Yanahuara, Arequipa',
    adminName: 'Ricardo Begazo',
    adminEmail: 'rbegazo@gastronomicasaqp.pe',
    adminInitials: 'RB',
    usersTotal: 0,
    usersActive: 0,
    usersInactive: 0,
    plan: 'Sin plan',
    billingCycle: 'Mensual',
    monthlyFee: 0,
    nextRenewal: 'Sin renovación',
    status: 'Suspendida',
  },
];

const INITIAL_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'USR-2026-0819',
    code: 'USR-2026-0819',
    firstName: 'Mariana',
    lastName: 'Cornejo Alarcón',
    fullName: 'Mariana Cornejo',
    initials: 'MC',
    avatarColor: 'bg-blue-100 text-blue-700 border-blue-200',
    email: 'm.cornejo@bodasgalasperu.pe',
    phone: '+51 987 654 321',
    companyId: 'EMP-2026-0042',
    companyName: 'Bodas & Galas Perú S.A.C.',
    companySubtext: 'RUC: 20608912345',
    companyRuc: '20608912345',
    companyInitials: 'BG',
    role: 'Company Admin',
    status: 'Activo',
    lastAccess: 'Hoy, 14:28',
    lastAccessIp: '190.237.45.12',
    registeredDate: '15 Ene 2026',
    registeredDateLong: '15 de Enero de 2026',
    accessLogs: [
      {
        id: 'al-1',
        title: 'Inicio de sesión exitoso',
        subtitle: 'Autenticación web (Chrome / macOS) • IP 190.237.45.12',
        timeLabel: 'Hoy 14:28',
        icon: 'login',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'al-2',
        title: 'Asignación de rol confirmada',
        subtitle: 'Rol establecido como Company Admin por Super Admin',
        timeLabel: '15 Ene',
        icon: 'badge',
        iconColor: 'text-indigo-600',
      },
      {
        id: 'al-3',
        title: 'Invitación aceptada',
        subtitle: 'Contraseña y perfil completados satisfactoriamente',
        timeLabel: '15 Ene',
        icon: 'how_to_reg',
        iconColor: 'text-blue-600',
      },
      {
        id: 'al-4',
        title: 'Invitación de acceso enviada',
        subtitle: 'Token enviado a m.cornejo@bodasgalasperu.pe',
        timeLabel: '15 Ene',
        icon: 'mail',
        iconColor: 'text-amber-500',
      },
    ],
  },
  {
    id: 'USR-2026-0001',
    code: 'USR-2026-0001',
    firstName: 'Admin',
    lastName: 'Global',
    fullName: 'Admin Global',
    initials: 'AG',
    avatarColor: 'bg-[#1E222D] text-[#F2C94C] border-gray-700',
    email: 'soporte@planerycore.com',
    phone: '+51 999 888 777',
    companyId: 'plataforma',
    companyName: 'Plataforma',
    companySubtext: 'Usuario de infraestructura',
    companyRuc: '20600000001',
    companyInitials: 'PC',
    role: 'Super Admin',
    status: 'Activo',
    lastAccess: 'Hoy, 15:40',
    lastAccessIp: '200.48.71.90',
    registeredDate: '01 Ene 2026',
    registeredDateLong: '01 de Enero de 2026',
    isSystemProtected: true,
    verifiedBadge: true,
    accessLogs: [
      {
        id: 'al-10',
        title: 'Inicio de sesión con 2FA hardware',
        subtitle: 'Consola de infraestructura Cloud • IP 200.48.71.90',
        timeLabel: 'Hoy 15:40',
        icon: 'login',
        iconColor: 'text-emerald-600',
      },
    ],
  },
  {
    id: 'USR-2026-0824',
    code: 'USR-2026-0824',
    firstName: 'Jorge',
    lastName: 'Valdivia',
    fullName: 'Jorge Valdivia',
    initials: 'JV',
    avatarColor: 'bg-purple-100 text-purple-700 border-purple-200',
    email: 'jvaldivia@eventoslima.pe',
    phone: '+51 992 110 445',
    companyId: 'EMP-2026-0043',
    companyName: 'Eventos & Producciones Lima',
    companySubtext: 'RUC: 20554198821',
    companyRuc: '20554198821',
    companyInitials: 'EP',
    role: 'Planner',
    status: 'Activo',
    lastAccess: 'Ayer, 18:12',
    lastAccessIp: '181.65.120.44',
    registeredDate: '20 Feb 2026',
    registeredDateLong: '20 de Febrero de 2026',
    accessLogs: [
      {
        id: 'al-20',
        title: 'Inicio de sesión exitoso',
        subtitle: 'Autenticación web (Safari / iOS) • IP 181.65.120.44',
        timeLabel: 'Ayer 18:12',
        icon: 'login',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'al-21',
        title: 'Invitación aceptada',
        subtitle: 'Perfil de Planner activado correctamente',
        timeLabel: '20 Feb',
        icon: 'how_to_reg',
        iconColor: 'text-blue-600',
      },
    ],
  },
  {
    id: 'USR-2026-0840',
    code: 'USR-2026-0840',
    firstName: 'Sofía',
    lastName: 'Benavides',
    fullName: 'Sofía Benavides',
    initials: 'SB',
    avatarColor: 'bg-amber-100 text-amber-700 border-amber-200',
    email: 'sbenavides@bodasgalasperu.pe',
    phone: '+51 981 223 344',
    companyId: 'EMP-2026-0042',
    companyName: 'Bodas & Galas Perú S.A.C.',
    companySubtext: 'RUC: 20608912345',
    companyRuc: '20608912345',
    companyInitials: 'BG',
    role: 'Planner',
    status: 'Invitación pendiente',
    lastAccess: 'Sin acceso',
    lastAccessIp: '—',
    registeredDate: '24 Mar 2026',
    registeredDateLong: '24 de Marzo de 2026',
    accessLogs: [
      {
        id: 'al-30',
        title: 'Invitación de acceso enviada',
        subtitle: 'Token enviado a sbenavides@bodasgalasperu.pe',
        timeLabel: '24 Mar',
        icon: 'mail',
        iconColor: 'text-amber-500',
      },
    ],
  },
  {
    id: 'USR-2026-0828',
    code: 'USR-2026-0828',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    fullName: 'Carlos Mendoza',
    initials: 'CM',
    avatarColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    email: 'carlos.mendoza@gmail.com',
    phone: '+51 987 111 222',
    companyId: 'EMP-2026-0042',
    companyName: 'Bodas & Galas Perú S.A.C.',
    companySubtext: 'Evento: Boda María y Carlos',
    companyRuc: '20608912345',
    companyInitials: 'BG',
    role: 'Client',
    status: 'Activo',
    lastAccess: '25 Mar 2026, 11:05',
    lastAccessIp: '190.42.18.230',
    registeredDate: '02 Feb 2026',
    registeredDateLong: '02 de Febrero de 2026',
    accessLogs: [
      {
        id: 'al-40',
        title: 'Consulta de cronograma y pagos',
        subtitle: 'Portal de cliente • IP 190.42.18.230',
        timeLabel: '25 Mar',
        icon: 'login',
        iconColor: 'text-emerald-600',
      },
    ],
  },
  {
    id: 'USR-2026-0812',
    code: 'USR-2026-0812',
    firstName: 'Manuel',
    lastName: 'Rojas',
    fullName: 'Manuel Rojas',
    initials: 'MR',
    avatarColor: 'bg-rose-100 text-rose-700 border-rose-200',
    email: 'mrojas@cateringsur.pe',
    phone: '+51 954 900 111',
    companyId: 'EMP-2026-0044',
    companyName: 'Catering & Protocolo del Sur',
    companySubtext: 'RUC: 20491828374',
    companyRuc: '20491828374',
    companyInitials: 'CP',
    role: 'Planner',
    status: 'Suspendido',
    lastAccess: '12 Feb 2026',
    lastAccessIp: 'Acceso inhabilitado',
    registeredDate: '10 Ene 2026',
    registeredDateLong: '10 de Enero de 2026',
    accessLogs: [
      {
        id: 'al-50',
        title: 'Cuenta suspendida por Super Admin',
        subtitle: 'Acceso revocado conservando historial íntegro',
        timeLabel: '12 Feb',
        icon: 'block',
        iconColor: 'text-rose-600',
      },
    ],
  },
];

const INITIAL_GLOBAL_CATALOGS: GlobalCatalogItem[] = [
  // Categorías de presupuesto (8 activas)
  { id: 'cat-pres-1', module: 'presupuesto', name: 'Catering', description: 'Alimentación y bebidas', displayOrder: 1, status: 'Activa' },
  { id: 'cat-pres-2', module: 'presupuesto', name: 'Decoración', description: 'Ambientación y diseño del espacio', displayOrder: 2, status: 'Activa' },
  { id: 'cat-pres-3', module: 'presupuesto', name: 'Fotografía y video', description: 'Cobertura audiovisual', displayOrder: 3, status: 'Activa' },
  { id: 'cat-pres-4', module: 'presupuesto', name: 'Música y entretenimiento', description: 'DJ, bandas y espectáculos', displayOrder: 4, status: 'Activa' },
  { id: 'cat-pres-5', module: 'presupuesto', name: 'Local y mobiliario', description: 'Espacios, mesas y sillas', displayOrder: 5, status: 'Activa' },
  { id: 'cat-pres-6', module: 'presupuesto', name: 'Transporte', description: 'Traslados y logística', displayOrder: 6, status: 'Activa' },
  { id: 'cat-pres-7', module: 'presupuesto', name: 'Vestimenta', description: 'Trajes, vestidos y accesorios', displayOrder: 7, status: 'Activa' },
  { id: 'cat-pres-8', module: 'presupuesto', name: 'Otros', description: 'Gastos no clasificados', displayOrder: 8, status: 'Activa' },
  // Categorías de proveedores (10 catálogos)
  { id: 'cat-prov-1', module: 'proveedores', name: 'Catering & Banquetería', description: 'Servicios gastronómicos, barras móviles y pastelería', displayOrder: 1, status: 'Activa' },
  { id: 'cat-prov-2', module: 'proveedores', name: 'Decoración & Diseño Floral', description: 'Estructuras, flores y ambientación integral', displayOrder: 2, status: 'Activa' },
  { id: 'cat-prov-3', module: 'proveedores', name: 'Fotografía & Cine', description: 'Cobertura documental, video 4K y drones', displayOrder: 3, status: 'Activa' },
  { id: 'cat-prov-4', module: 'proveedores', name: 'Música, DJ & Orquestas', description: 'Bandas en vivo, DJs y maestros de ceremonia', displayOrder: 4, status: 'Activa' },
  { id: 'cat-prov-5', module: 'proveedores', name: 'Locaciones & Venues', description: 'Haciendas, hoteles, salones y centros de convenciones', displayOrder: 5, status: 'Activa' },
  { id: 'cat-prov-6', module: 'proveedores', name: 'Audio, Luces & Pantallas LED', description: 'Producción técnica y equipamiento escénico', displayOrder: 6, status: 'Activa' },
  { id: 'cat-prov-7', module: 'proveedores', name: 'Transporte & Movilidad VIP', description: 'Buses para invitados, vans y autos de lujo', displayOrder: 7, status: 'Activa' },
  { id: 'cat-prov-8', module: 'proveedores', name: 'Seguridad & Protocolo', description: 'Control de accesos, anfitrionas y resguardo', displayOrder: 8, status: 'Activa' },
  { id: 'cat-prov-9', module: 'proveedores', name: 'Mobiliario & Menaje', description: 'Alquiler de sillas, mesas, vajilla y cristalería', displayOrder: 9, status: 'Activa' },
  { id: 'cat-prov-10', module: 'proveedores', name: 'Papelería & Invitaciones', description: 'Partes impresos, pases digitales y señalética', displayOrder: 10, status: 'Activa' },
  // Tipos de evento (8 tipos)
  { id: 'cat-tipo-1', module: 'tipos_evento', name: 'Matrimonio', description: 'Bodas civiles, religiosas y simbólicas', displayOrder: 1, status: 'Activa' },
  { id: 'cat-tipo-2', module: 'tipos_evento', name: 'Corporativo', description: 'Galas empresariales, aniversarios y lanzamientos', displayOrder: 2, status: 'Activa' },
  { id: 'cat-tipo-3', module: 'tipos_evento', name: 'Conferencia', description: 'Congresos, cumbres ejecutivas y seminarios', displayOrder: 3, status: 'Activa' },
  { id: 'cat-tipo-4', module: 'tipos_evento', name: 'Cumpleaños', description: 'Celebraciones sociales y aniversarios personales', displayOrder: 4, status: 'Activa' },
  { id: 'cat-tipo-5', module: 'tipos_evento', name: 'Quinceaños', description: 'Fiestas de gala juvenil y recepciones sociales', displayOrder: 5, status: 'Activa' },
  { id: 'cat-tipo-6', module: 'tipos_evento', name: 'Bautizo / Primera Comunión', description: 'Recepciones familiares y religiosas', displayOrder: 6, status: 'Activa' },
  { id: 'cat-tipo-7', module: 'tipos_evento', name: 'Feria / Exposición', description: 'Stands comerciales y ruedas de negocios', displayOrder: 7, status: 'Activa' },
  { id: 'cat-tipo-8', module: 'tipos_evento', name: 'Otro', description: 'Eventos personalizados a medida', displayOrder: 8, status: 'Activa' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-001',
    title: 'Vencimiento próximo de abono: S/ 4,500.00',
    description: 'El segundo hito de pago a Catering Gourmet Del Sur vence en 48 horas. Revisa la programación de transferencia bancaria.',
    category: 'Pagos',
    read: false,
    timestamp: 'Hace 15 min',
    dateFormatted: '28 Sep 2026, 20:15',
    priority: 'Urgente',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'pagos',
    actionLabel: 'Revisar pago',
    actorName: 'Tesorería Planery',
  },
  {
    id: 'NOT-002',
    title: 'Cotización actualizada por proveedor de Decoración',
    description: 'DecoFlor Ambientes adjuntó una nueva propuesta económica para el arco floral principal y mobiliario lounge (+S/ 850.00).',
    category: 'Proveedores',
    read: false,
    timestamp: 'Hace 42 min',
    dateFormatted: '28 Sep 2026, 19:48',
    priority: 'Alta',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'proveedores',
    actionLabel: 'Ver proveedor',
    actorName: 'Lucía Gómez (DecoFlor)',
  },
  {
    id: 'NOT-003',
    title: 'Tarea operativa vencida: Confirmar plano de iluminación',
    description: 'La validación del plano técnico con Sonido & Luces Pro superó su fecha límite asignada a Jerson Huayta.',
    category: 'Tareas',
    read: false,
    timestamp: 'Hace 1 hora',
    dateFormatted: '28 Sep 2026, 19:10',
    priority: 'Urgente',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'tareas',
    actionLabel: 'Ir a tareas',
    actorName: 'Jerson Huayta',
  },
  {
    id: 'NOT-004',
    title: 'Contrato firmado electrónicamente',
    description: 'Se ha cargado y verificado el documento Acuerdo_Servicio_DecoFlor_Firmado.pdf en el repositorio legal del evento.',
    category: 'Documentos',
    read: false,
    timestamp: 'Hace 2 horas',
    dateFormatted: '28 Sep 2026, 18:20',
    priority: 'Normal',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'documentos',
    actionLabel: 'Ver documento',
    actorName: 'Carlos Mendoza',
  },
  {
    id: 'NOT-005',
    title: 'Transferencia confirmada: S/ 12,500.00 a Hotel Alvear Palace',
    description: 'El comprobante REC-2026-0084 fue conciliado exitosamente para la reserva del Salón Imperial.',
    category: 'Pagos',
    read: false,
    timestamp: 'Hace 3 horas',
    dateFormatted: '28 Sep 2026, 17:05',
    priority: 'Normal',
    eventCode: 'EV-2024-081',
    eventName: 'Gala Corporativa Anual 2024',
    targetHref: '/pagos',
    actionLabel: 'Ver en pagos',
    actorName: 'Sofía Ramírez',
  },
  {
    id: 'NOT-006',
    title: 'Nueva tarea asignada: Degustación de menú 4 tiempos',
    description: 'Se programó la sesión presencial con María López y Roberto Valdivia en el Showroom de Cayma.',
    category: 'Tareas',
    read: true,
    timestamp: 'Hoy, 14:30',
    dateFormatted: '28 Sep 2026, 14:30',
    priority: 'Alta',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/calendario',
    actionLabel: 'Ver en agenda',
    actorName: 'Jerson Huayta',
  },
  {
    id: 'NOT-007',
    title: 'Nuevo proveedor homologado en el directorio',
    description: 'Visual Studio Arequipa (RUC 10459203912) completó su validación tributaria y documental como proveedor activo.',
    category: 'Proveedores',
    read: true,
    timestamp: 'Hoy, 11:15',
    dateFormatted: '28 Sep 2026, 11:15',
    priority: 'Normal',
    targetHref: '/proveedores',
    actionLabel: 'Abrir directorio',
    actorName: 'Mariana Cornejo',
  },
  {
    id: 'NOT-008',
    title: 'Evento actualizado a estado Confirmado',
    description: 'Convención Anual de Finanzas (Banco Santander) alcanzó el 75% de anticipos requeridos y pasó a estado Confirmado.',
    category: 'Eventos',
    read: true,
    timestamp: 'Ayer, 18:40',
    dateFormatted: '27 Sep 2026, 18:40',
    priority: 'Alta',
    eventCode: 'EV-2024-082',
    eventName: 'Convención Anual de Finanzas',
    targetHref: '/eventos',
    actionLabel: 'Ver eventos',
    actorName: 'Carlos Mendoza',
  },
  {
    id: 'NOT-009',
    title: 'Alerta presupuestaria: Partida de Decoración al 92%',
    description: 'El monto comprometido en la categoría Decoración & Flores está próximo a alcanzar el techo asignado de S/ 9,500.00.',
    category: 'Pagos',
    read: false,
    timestamp: 'Ayer, 16:12',
    dateFormatted: '27 Sep 2026, 16:12',
    priority: 'Alta',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'presupuesto',
    actionLabel: 'Revisar presupuesto',
    actorName: 'Auditoría Financiera',
  },
  {
    id: 'NOT-010',
    title: 'Invitación de usuario pendiente de confirmación',
    description: 'Sofía Benavides (sbenavides@bodasgalasperu.pe) aún no ha activado su token de acceso como Planner.',
    category: 'Sistema',
    read: true,
    timestamp: '26 Sep 2026',
    dateFormatted: '26 Sep 2026, 10:00',
    priority: 'Normal',
    targetHref: '/usuarios',
    actionLabel: 'Gestionar usuarios',
    actorName: 'Seguridad RBAC',
  },
  {
    id: 'NOT-011',
    title: 'Entrega de cronograma preliminar para revisión del cliente',
    description: 'Martín Lozada marcó como completada la tarea de envío de cronograma minuto a minuto a Familia Delgado.',
    category: 'Tareas',
    read: true,
    timestamp: '25 Sep 2026',
    dateFormatted: '25 Sep 2026, 17:22',
    priority: 'Normal',
    eventCode: 'EV-2024-083',
    eventName: 'Boda Sofía & Felipe',
    targetHref: '/eventos',
    actionLabel: 'Ver evento',
    actorName: 'Martín Lozada',
  },
  {
    id: 'NOT-012',
    title: 'Proveedor confirmó disponibilidad de flota VIP',
    description: 'Transportes Ejecutivos Sur bloqueó 4 unidades Mercedes-Benz Sprinter para el traslado de invitados en Arequipa.',
    category: 'Proveedores',
    read: true,
    timestamp: '24 Sep 2026',
    dateFormatted: '24 Sep 2026, 15:10',
    priority: 'Normal',
    eventCode: 'EV-2026-084',
    eventName: 'Boda de María y Carlos',
    targetHref: '/proveedores',
    actionLabel: 'Ver proveedor',
    actorName: 'Transportes Ejecutivos Sur',
  },
  {
    id: 'NOT-013',
    title: 'Renovación de suscripción corporativa procesada',
    description: 'Se emitió la factura mensual del Plan Profesional para Bodas & Galas Perú S.A.C. por S/ 350.00.',
    category: 'Sistema',
    read: true,
    timestamp: '22 Sep 2026',
    dateFormatted: '22 Sep 2026, 09:00',
    priority: 'Normal',
    targetHref: '/suscripciones',
    actionLabel: 'Ver suscripción',
    actorName: 'Facturación Planery',
  },
  {
    id: 'NOT-014',
    title: 'Rider técnico y plano de escenario aprobado',
    description: 'El ingeniero residente aprobó el documento Plano_Escenario_Principal_v3.pdf para la Cumbre Global de Innovación.',
    category: 'Documentos',
    read: true,
    timestamp: '20 Sep 2026',
    dateFormatted: '20 Sep 2026, 12:45',
    priority: 'Normal',
    eventCode: 'EV-2025-085',
    eventName: 'Cumbre Global de Innovación 2025',
    targetHref: '/eventos/EV-2026-084',
    targetTab: 'documentos',
    actionLabel: 'Ver documentos',
    actorName: 'Sofía Ramírez',
  },
];

const PlaneryContext = createContext<PlaneryContextValue | undefined>(undefined);

export function PlaneryProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [eventProviders, setEventProviders] = useState<EventProviderRelation[]>(INITIAL_EVENT_PROVIDERS);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(INITIAL_BUDGET_CATEGORIES);
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);
  const [calendarEntries] = useState<CalendarEntry[]>(INITIAL_CALENDAR_ENTRIES);
  const [clients, setClients] = useState<ClientItem[]>(INITIAL_CLIENTS);
  const [planners] = useState<PlannerItem[]>(INITIAL_PLANNERS);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);
  const [companies, setCompanies] = useState<PlatformCompany[]>(INITIAL_COMPANIES);
  const [globalCatalogs, setGlobalCatalogs] = useState<GlobalCatalogItem[]>(INITIAL_GLOBAL_CATALOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeEventTab, setActiveEventTab] = useState<EventDetailTab>('resumen');
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3400);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const addEvent = useCallback(
    (newEventData: Omit<EventItem, 'id' | 'code' | 'paidAmount' | 'committedAmount'>): EventItem => {
      const num = 88 + events.length;
      const code = `EV-2026-0${num}`;
      const created: EventItem = {
        ...newEventData,
        id: code,
        code,
        paidAmount: 0,
        committedAmount: 0,
      };
      setEvents((prev) => [created, ...prev]);
      showToast(`¡Evento "${created.name}" creado exitosamente en estado Planificación!`);
      return created;
    },
    [events.length, showToast]
  );

  const updateEvent = useCallback(
    (eventId: string, updated: Partial<EventItem>) => {
      setEvents((prev) =>
        prev.map((ev) => {
          if (ev.id !== eventId) return ev;

          let nextDateFormatted = updated.dateFormatted ?? ev.dateFormatted;
          if (updated.date && !updated.dateFormatted) {
            const monthsEs = [
              'Ene',
              'Feb',
              'Mar',
              'Abr',
              'May',
              'Jun',
              'Jul',
              'Ago',
              'Sep',
              'Oct',
              'Nov',
              'Dic',
            ];
            const parts = updated.date.split('-');
            if (parts.length === 3) {
              const y = parts[0];
              const mIndex = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
              const d = parseInt(parts[2], 10);
              nextDateFormatted = `${d} ${monthsEs[mIndex]} ${y}`;
            }
          }

          return {
            ...ev,
            ...updated,
            dateFormatted: nextDateFormatted,
          };
        })
      );

      // Register an audit log entry for the update
      const newLog: AuditLogItem = {
        id: `LOG-${Date.now()}`,
        logCode: `LOG-${Math.floor(98450 + Math.random() * 50)}`,
        eventId,
        dateGroup: 'Hoy — 28 Oct 2026',
        timestamp: '28 Oct 2026, Ahora',
        relativeTime: 'Hace un momento',
        user: 'Carlos Mendoza',
        userRole: 'Admin de Empresa',
        userInitials: 'CM',
        category: 'Evento',
        actionTitle: 'Información general del evento actualizada',
        summaryHtml: `<strong>Carlos Mendoza</strong> actualizó los datos generales y/o asignación de Planner del evento.`,
        icon: 'edit_calendar',
        moduleOrigin: `Resumen del Evento · ${eventId}`,
        ipAddress: '200.48.112.10',
        targetTab: 'resumen',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast('Información general del evento actualizada correctamente.');
    },
    [showToast]
  );

  const duplicateEvent = useCallback(
    (eventId: string) => {
      const target = events.find((e) => e.id === eventId);
      if (!target) return;
      const num = 90 + events.length;
      const code = `EV-2026-0${num}`;
      const copy: EventItem = {
        ...target,
        id: code,
        code,
        name: `${target.name} (Copia)`,
        status: 'Planificación',
      };
      setEvents((prev) => [copy, ...prev]);
      showToast(`Evento duplicado como ${code}.`);
    },
    [events, showToast]
  );

  const archiveEvent = useCallback(
    (eventId: string) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: 'Cancelado' } : e))
      );
      showToast('El evento ha sido archivado / marcado como Cancelado.', 'warning');
    },
    [showToast]
  );

  const addClient = useCallback(
    (name: string, email: string): ClientItem => {
      const created: ClientItem = {
        id: `cli_${Date.now()}`,
        name,
        type: 'Corporativo / Social',
        email,
        phone: '+51 999 000 111',
      };
      setClients((prev) => [...prev, created]);
      showToast(`Cliente "${name}" registrado y seleccionado.`);
      return created;
    },
    [showToast]
  );

  const addProvider = useCallback(
    (providerData: Omit<Provider, 'id' | 'code' | 'eventsCount' | 'registeredDate' | 'initials' | 'avatarColor'>) => {
      const num = 20 + providers.length;
      const code = `PRV-2026-00${num}`;
      const words = providerData.commercialName.trim().split(/\s+/);
      const initials =
        words.length > 1
          ? `${words[0][0]}${words[1][0]}`.toUpperCase()
          : providerData.commercialName.slice(0, 2).toUpperCase();
      const created: Provider = {
        ...providerData,
        id: code,
        code,
        eventsCount: 0,
        registeredDate: 'Hoy',
        initials,
        avatarColor: 'bg-amber-100 text-amber-900',
      };
      setProviders((prev) => [created, ...prev]);
      showToast(`Proveedor "${created.commercialName}" registrado exitosamente.`);
    },
    [providers.length, showToast]
  );

  const updateProvider = useCallback(
    (id: string, updated: Partial<Provider>) => {
      setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      showToast('Información del proveedor actualizada correctamente.');
    },
    [showToast]
  );

  const toggleProviderStatus = useCallback(
    (id: string, forceStatus?: 'Activo' | 'Inactivo') => {
      setProviders((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const next = forceStatus ?? (p.status === 'Activo' ? 'Inactivo' : 'Activo');
          return { ...p, status: next };
        })
      );
      showToast('Estado del proveedor actualizado.');
    },
    [showToast]
  );

  const bulkUpdateProvidersStatus = useCallback(
    (ids: string[], status: 'Activo' | 'Inactivo') => {
      setProviders((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
      );
      showToast(`${ids.length} proveedores marcados como ${status}.`);
    },
    [showToast]
  );

  const linkProviderToEvent = useCallback(
    (relationData: Omit<EventProviderRelation, 'id'>) => {
      const created: EventProviderRelation = {
        ...relationData,
        id: `EPR-${Date.now()}`,
      };
      setEventProviders((prev) => [created, ...prev]);
      showToast('Proveedor agregado exitosamente al evento.');
    },
    [showToast]
  );

  const removeProviderFromEvent = useCallback(
    (relationId: string) => {
      setEventProviders((prev) => prev.filter((r) => r.id !== relationId));
      showToast('Proveedor desvinculado del evento.', 'warning');
    },
    [showToast]
  );

  const updateEventProviderStatus = useCallback(
    (relationId: string, status: EventProviderRelation['status']) => {
      setEventProviders((prev) =>
        prev.map((r) => (r.id === relationId ? { ...r, status } : r))
      );
      showToast(`Estado de relación actualizado a "${status}".`);
    },
    [showToast]
  );

  const addBudgetCategory = useCallback(
    (catData: Omit<BudgetCategory, 'id'>) => {
      const created: BudgetCategory = {
        ...catData,
        id: `BC-${Date.now()}`,
      };
      setBudgetCategories((prev) => [...prev, created]);
      showToast('Categoría agregada exitosamente al presupuesto.');
    },
    [showToast]
  );

  const updateBudgetCategory = useCallback(
    (id: string, allocated: number, notes?: string) => {
      setBudgetCategories((prev) =>
        prev.map((cat) => {
          if (cat.id !== id) return cat;
          const status: BudgetCategory['status'] =
            cat.committed > allocated
              ? 'Sobre presupuesto'
              : cat.committed >= allocated * 0.88
              ? 'Cerca del límite'
              : 'Dentro del presupuesto';
          return {
            ...cat,
            allocated,
            notes: notes ?? cat.notes,
            status,
          };
        })
      );
      showToast('Partida presupuestaria actualizada.');
    },
    [showToast]
  );

  const registerPayment = useCallback(
    (paymentData: Omit<PaymentItem, 'id'>) => {
      const created: PaymentItem = {
        ...paymentData,
        id: `PAY-${Date.now()}`,
        receiptCode: `REC-2026-00${payments.length + 1}`,
      };
      setPayments((prev) => [created, ...prev]);
      // Add audit log
      const newLog: AuditLogItem = {
        id: `LOG-${Date.now()}`,
        logCode: `LOG-${Math.floor(98430 + Math.random() * 50)}`,
        eventId: paymentData.eventId,
        dateGroup: 'Hoy — 28 Oct 2026',
        timestamp: '28 Oct 2026, Ahora',
        relativeTime: 'Hace un momento',
        user: 'Carlos Mendoza',
        userRole: 'Admin de Empresa',
        userInitials: 'CM',
        category: 'Pagos',
        actionTitle: 'Nuevo pago registrado',
        summaryHtml: `<strong>Carlos Mendoza</strong> registró un pago de <strong>S/ ${paymentData.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong> a <span class="font-medium">"${paymentData.providerName}"</span>.`,
        icon: 'payments',
        moduleOrigin: `Pagos · ${created.receiptCode}`,
        ipAddress: '200.48.112.10',
        budgetItemName: `${paymentData.providerName} — ${paymentData.concept}`,
        previousValue: 'Pendiente de abono',
        newValue: `S/ ${paymentData.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${paymentData.status})`,
        percentageDelta: 'Registrado',
        netVariation: `+S/ ${paymentData.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        justification: paymentData.notes || 'Abono registrado desde el panel financiero del evento.',
        targetTab: 'pagos',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast('Pago registrado exitosamente para este evento.');
    },
    [payments.length, showToast]
  );

  const uploadDocument = useCallback(
    (docData: Omit<DocumentItem, 'id'>) => {
      const created: DocumentItem = {
        ...docData,
        id: `DOC-${Date.now()}`,
      };
      setDocuments((prev) => [created, ...prev]);
      showToast('Documento subido y vinculado exitosamente.');
    },
    [showToast]
  );

  const deleteDocument = useCallback(
    (docId: string) => {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      showToast('Documento eliminado del repositorio del evento.', 'warning');
    },
    [showToast]
  );

  const addTask = useCallback(
    (taskData: Omit<TaskItem, 'id'>) => {
      const created: TaskItem = {
        ...taskData,
        id: `TSK-${Date.now()}`,
      };
      setTasks((prev) => [created, ...prev]);
      showToast('Nueva tarea creada y notificada al responsable.');
    },
    [showToast]
  );

  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'Completada' : 'En progreso',
            isOverdue: nextCompleted ? false : t.isOverdue,
            relativeDue: nextCompleted ? 'Finalizada' : t.relativeDue,
          };
        })
      );
      showToast('Estado de tarea actualizado.');
    },
    [showToast]
  );

  const updateSubscriptionStatus = useCallback(
    (subId: string, status: SubscriptionItem['status']) => {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, status } : s))
      );
      showToast(`Estado de suscripción actualizado a "${status}".`);
    },
    [showToast]
  );

  const updateSubscriptionPlan = useCallback(
    (
      subId: string,
      plan: SubscriptionItem['plan'],
      amount: number,
      billingCycle?: SubscriptionItem['billingCycle'],
      status?: SubscriptionItem['status'],
      nextBillingDate?: string,
      paymentMethod?: string,
      recordInvoice: boolean = true
    ) => {
      setSubscriptions((prev) =>
        prev.map((s) => {
          if (s.id !== subId) return s;
          const nextCycle = billingCycle ?? s.billingCycle;
          const nextStatus = status ?? 'Activa';
          const nextMethod = paymentMethod ?? s.paymentMethod;
          const nowTime = new Date().toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const newInvoice: SubscriptionInvoiceItem = {
            id: `TXN-2026-${Math.floor(91000 + Math.random() * 8999)}`,
            code: `REC-${Math.floor(9100 + Math.random() * 899)}`,
            date: '28 Sep 2026',
            time: nowTime,
            planName: plan,
            billingPeriod: `${nextCycle} (Actualización de Plan)`,
            method: nextMethod,
            amount,
            status: 'Pagado',
          };

          return {
            ...s,
            plan,
            amount,
            billingCycle: nextCycle,
            status: nextStatus,
            nextBillingDate: nextBillingDate ?? s.nextBillingDate,
            paymentMethod: nextMethod,
            invoices: recordInvoice ? [newInvoice, ...s.invoices] : s.invoices,
          };
        })
      );
      showToast(
        `Plan de empresa actualizado a ${plan} (${billingCycle || 'Mensual'} · S/ ${amount.toFixed(2)}).`
      );
    },
    [showToast]
  );

  const registerSubscriptionInvoice = useCallback(
    (subId: string, invoiceData: Omit<SubscriptionInvoiceItem, 'id' | 'code'>) => {
      const txnId = `TXN-2026-${Math.floor(91000 + Math.random() * 8999)}`;
      const recCode = `REC-${Math.floor(9100 + Math.random() * 899)}`;
      const created: SubscriptionInvoiceItem = {
        ...invoiceData,
        id: txnId,
        code: recCode,
      };
      setSubscriptions((prev) =>
        prev.map((s) => {
          if (s.id !== subId) return s;
          return {
            ...s,
            status: invoiceData.status === 'Pagado' ? 'Activa' : s.status,
            invoices: [created, ...s.invoices],
          };
        })
      );
      showToast(
        invoiceData.status === 'Rechazado'
          ? `Intento de cobro registrado como Rechazado (${txnId}).`
          : `Pago registrado exitosamente con ID ${txnId}.`,
        invoiceData.status === 'Rechazado' ? 'warning' : 'success'
      );
    },
    [showToast]
  );

  const retryRejectedSubscriptionInvoice = useCallback(
    (subId: string, invoiceId: string) => {
      const nowTime = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setSubscriptions((prev) =>
        prev.map((s) => {
          if (s.id !== subId) return s;
          const updatedInvoices = s.invoices.map((inv) =>
            inv.id === invoiceId
              ? {
                  ...inv,
                  status: 'Pagado' as const,
                  date: '28 Sep 2026',
                  time: `${nowTime} (Reintento exitoso)`,
                  rejectionReason: undefined,
                }
              : inv
          );
          return {
            ...s,
            status: 'Activa',
            invoices: updatedInvoices,
          };
        })
      );
      showToast(`Cobro procesado exitosamente para la transacción ${invoiceId}.`);
    },
    [showToast]
  );

  const addPlatformUser = useCallback(
    (userData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      companyId: string;
      role: PlatformUserRole;
      sendInvite: boolean;
      activateImmediately: boolean;
    }) => {
      const comp = companies.find((c) => c.id === userData.companyId);
      const companyName =
        userData.companyId === 'plataforma'
          ? 'Plataforma'
          : comp
          ? comp.commercialName
          : 'Bodas & Galas Perú S.A.C.';
      const companyRuc = comp ? comp.ruc : '20608912345';
      const companySubtext =
        userData.companyId === 'plataforma'
          ? 'Usuario de infraestructura'
          : `RUC: ${companyRuc}`;
      const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
      const status: PlatformUserStatus = userData.activateImmediately
        ? 'Activo'
        : 'Invitación pendiente';
      const created: PlatformUser = {
        id: `USR-2026-08${50 + platformUsers.length}`,
        code: `USR-2026-08${50 + platformUsers.length}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName.split(' ')[0]}`,
        initials,
        avatarColor:
          userData.role === 'Company Admin'
            ? 'bg-blue-100 text-blue-700 border-blue-200'
            : userData.role === 'Planner'
            ? 'bg-purple-100 text-purple-700 border-purple-200'
            : 'bg-cyan-100 text-cyan-700 border-cyan-200',
        email: userData.email,
        phone: userData.phone || '+51 987 654 321',
        companyId: userData.companyId,
        companyName,
        companySubtext,
        companyRuc,
        companyInitials: companyName.slice(0, 2).toUpperCase(),
        role: userData.role,
        status,
        lastAccess: userData.activateImmediately ? 'Hoy, Ahora' : 'Sin acceso',
        lastAccessIp: userData.activateImmediately ? '190.237.45.12' : '—',
        registeredDate: '28 Sep 2026',
        registeredDateLong: '28 de Septiembre de 2026',
        accessLogs: [
          {
            id: `al-${Date.now()}`,
            title: 'Invitación de acceso enviada',
            subtitle: `Token enviado a ${userData.email}`,
            timeLabel: 'Ahora',
            icon: 'mail',
            iconColor: 'text-amber-500',
          },
        ],
      };
      setPlatformUsers((prev) => [created, ...prev]);
      showToast(
        `Usuario "${created.fullName}" creado e invitación enviada a ${created.email}.`
      );
    },
    [companies, platformUsers.length, showToast]
  );

  const updatePlatformUser = useCallback(
    (id: string, updated: Partial<PlatformUser>) => {
      setPlatformUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          const nextFirst = updated.firstName ?? u.firstName;
          const nextLast = updated.lastName ?? u.lastName;
          const fullName =
            updated.fullName ?? `${nextFirst} ${nextLast.split(' ')[0]}`;
          const initials = `${nextFirst.charAt(0)}${nextLast.charAt(0)}`.toUpperCase();
          return { ...u, ...updated, fullName, initials };
        })
      );
      showToast('Información del usuario actualizada correctamente.');
    },
    [showToast]
  );

  const changePlatformUserRole = useCallback(
    (id: string, role: PlatformUserRole) => {
      setPlatformUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                role,
                accessLogs: [
                  {
                    id: `al-${Date.now()}`,
                    title: 'Asignación de rol confirmada',
                    subtitle: `Rol establecido como ${role} por Super Admin`,
                    timeLabel: 'Ahora',
                    icon: 'badge',
                    iconColor: 'text-indigo-600',
                  },
                  ...u.accessLogs,
                ],
              }
            : u
        )
      );
      showToast(`Rol de usuario actualizado a "${role}".`);
    },
    [showToast]
  );

  const togglePlatformUserStatus = useCallback(
    (id: string, status: PlatformUserStatus, reason?: string) => {
      setPlatformUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status,
                lastAccessIp:
                  status === 'Suspendido' ? 'Acceso inhabilitado' : u.lastAccessIp,
                accessLogs: [
                  {
                    id: `al-${Date.now()}`,
                    title:
                      status === 'Suspendido'
                        ? 'Cuenta suspendida por Super Admin'
                        : 'Cuenta reactivada por Super Admin',
                    subtitle:
                      reason ||
                      (status === 'Suspendido'
                        ? 'Acceso revocado conservando historial íntegro'
                        : 'Permisos y credenciales restaurados'),
                    timeLabel: 'Ahora',
                    icon: status === 'Suspendido' ? 'block' : 'check_circle',
                    iconColor:
                      status === 'Suspendido' ? 'text-rose-600' : 'text-emerald-600',
                  },
                  ...u.accessLogs,
                ],
              }
            : u
        )
      );
      showToast(
        status === 'Suspendido'
          ? 'Usuario suspendido. Acceso revocado inmediatamente.'
          : 'Usuario reactivado exitosamente.',
        status === 'Suspendido' ? 'warning' : 'success'
      );
    },
    [showToast]
  );

  const resendPlatformUserInvitation = useCallback(
    (id: string) => {
      setPlatformUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                accessLogs: [
                  {
                    id: `al-${Date.now()}`,
                    title: 'Invitación de acceso reenviada',
                    subtitle: `Nuevo token seguro enviado a ${u.email}`,
                    timeLabel: 'Ahora',
                    icon: 'forward_to_inbox',
                    iconColor: 'text-amber-600',
                  },
                  ...u.accessLogs,
                ],
              }
            : u
        )
      );
      showToast('Correo de invitación reenviado con nuevo token seguro.');
    },
    [showToast]
  );

  const addPlatformCompany = useCallback(
    (
      companyData: Omit<
        PlatformCompany,
        | 'id'
        | 'code'
        | 'usersTotal'
        | 'usersActive'
        | 'usersInactive'
        | 'registeredDate'
        | 'registeredDateLong'
      >
    ) => {
      const code = `EMP-2026-00${46 + companies.length}`;
      const created: PlatformCompany = {
        ...companyData,
        id: code,
        code,
        usersTotal: 1,
        usersActive: 1,
        usersInactive: 0,
        registeredDate: '28 Sep 2026',
        registeredDateLong: '28 de septiembre de 2026',
      };
      setCompanies((prev) => [created, ...prev]);
      showToast(`Organización "${created.commercialName}" registrada exitosamente.`);
    },
    [companies.length, showToast]
  );

  const updatePlatformCompany = useCallback(
    (id: string, updated: Partial<PlatformCompany>) => {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      showToast('Datos de la empresa actualizados correctamente.');
    },
    [showToast]
  );

  const togglePlatformCompanyStatus = useCallback(
    (id: string, status: PlatformCompanyStatus) => {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      showToast(
        status === 'Suspendida'
          ? 'Empresa suspendida. El acceso de sus usuarios ha sido restringido.'
          : 'Empresa activada exitosamente.',
        status === 'Suspendida' ? 'warning' : 'success'
      );
    },
    [showToast]
  );

  const addGlobalCatalogItem = useCallback(
    (itemData: Omit<GlobalCatalogItem, 'id'>) => {
      const created: GlobalCatalogItem = {
        ...itemData,
        id: `cat-${Date.now()}`,
      };
      setGlobalCatalogs((prev) => [...prev, created]);
      showToast(`Categoría "${created.name}" guardada en el catálogo global.`);
    },
    [showToast]
  );

  const updateGlobalCatalogItem = useCallback(
    (id: string, updated: Partial<GlobalCatalogItem>) => {
      setGlobalCatalogs((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
      showToast('Categoría global actualizada correctamente.');
    },
    [showToast]
  );

  const toggleGlobalCatalogItemStatus = useCallback(
    (id: string) => {
      setGlobalCatalogs((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const next = item.status === 'Activa' ? 'Inactiva' : 'Activa';
          return { ...item, status: next };
        })
      );
      showToast('Estado de la categoría global actualizado.');
    },
    [showToast]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const toggleNotificationRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
      );
      showToast('Estado de lectura de notificación actualizado.');
    },
    [showToast]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas las notificaciones han sido marcadas como leídas.');
  }, [showToast]);

  const deleteNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showToast('Notificación eliminada de la bandeja.', 'warning');
    },
    [showToast]
  );

  return (
    <PlaneryContext.Provider
      value={{
        events,
        providers,
        eventProviders,
        budgetCategories,
        payments,
        documents,
        tasks,
        auditLogs,
        subscriptions,
        calendarEntries,
        clients,
        planners,
        platformUsers,
        companies,
        globalCatalogs,
        notifications,
        activeEventTab,
        setActiveEventTab,
        toast,
        showToast,
        hideToast,
        addEvent,
        updateEvent,
        duplicateEvent,
        archiveEvent,
        addClient,
        addProvider,
        updateProvider,
        toggleProviderStatus,
        bulkUpdateProvidersStatus,
        linkProviderToEvent,
        removeProviderFromEvent,
        updateEventProviderStatus,
        addBudgetCategory,
        updateBudgetCategory,
        registerPayment,
        uploadDocument,
        deleteDocument,
        addTask,
        toggleTaskCompletion,
        updateSubscriptionStatus,
        updateSubscriptionPlan,
        registerSubscriptionInvoice,
        retryRejectedSubscriptionInvoice,
        addPlatformUser,
        updatePlatformUser,
        changePlatformUserRole,
        togglePlatformUserStatus,
        resendPlatformUserInvitation,
        addPlatformCompany,
        updatePlatformCompany,
        togglePlatformCompanyStatus,
        addGlobalCatalogItem,
        updateGlobalCatalogItem,
        toggleGlobalCatalogItemStatus,
        markNotificationAsRead,
        toggleNotificationRead,
        markAllNotificationsAsRead,
        deleteNotification,
      }}
    >
      {children}
    </PlaneryContext.Provider>
  );
}

export function usePlanery() {
  const ctx = useContext(PlaneryContext);
  if (!ctx) {
    throw new Error('usePlanery must be used within a PlaneryProvider');
  }
  return ctx;
}
