export type EventStatus = 'Planificación' | 'En progreso' | 'Confirmado' | 'Completado' | 'Cancelado';
export type EventType = 'Matrimonio' | 'Corporativo' | 'Conferencia' | 'Cumpleaños' | 'Bautizo' | 'Otro';

export type EventDetailTab =
  | 'resumen'
  | 'proveedores'
  | 'presupuesto'
  | 'pagos'
  | 'documentos'
  | 'tareas'
  | 'actividad';

export interface PlannerItem {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  role: string;
  email: string;
  avatarBg?: string;
}

export interface ClientItem {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
}

export interface EventItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  type: EventType;
  date: string;
  dateFormatted: string;
  startTime: string;
  endTime: string;
  location: string;
  venueDetail?: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  planner: string;
  plannerInitials: string;
  plannerRole?: string;
  budget: number;
  paidAmount: number;
  committedAmount: number;
  status: EventStatus;
  description?: string;
}

export type ProviderCategory =
  | 'Catering'
  | 'Fotografía'
  | 'Decoración'
  | 'Música & Sonido'
  | 'Venue / Locación'
  | 'Transporte'
  | 'Audio e Iluminación'
  | 'Seguridad';

export interface Provider {
  id: string;
  code: string;
  commercialName: string;
  legalName: string;
  ruc: string;
  category: ProviderCategory;
  description: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  eventsCount: number;
  status: 'Activo' | 'Inactivo';
  registeredDate: string;
  initials: string;
  avatarColor: string;
  internalNotes?: string;
  viewed?: boolean;
}

export type EventProviderStatus = 'Confirmado' | 'Seleccionado' | 'En evaluación' | 'Propuesto' | 'Rechazado';

export interface EventProviderRelation {
  id: string;
  eventId: string;
  providerId: string;
  providerName: string;
  email: string;
  phone: string;
  category: ProviderCategory;
  icon: string;
  iconBg: string;
  serviceDescription: string;
  serviceSubtext: string;
  status: EventProviderStatus;
  budget: number;
  budgetNote: string;
  paymentStatus: 'Pagado' | 'Parcial' | 'Pendiente';
  internalNotes?: string;
}

export type BudgetStatus = 'Dentro del presupuesto' | 'Cerca del límite' | 'Sobre presupuesto';

export interface BudgetCategory {
  id: string;
  eventId: string;
  name: string;
  icon: string;
  iconBg: string;
  linkedProvidersCount: number;
  primaryProviderName: string;
  primaryProviderService: string;
  primaryProviderStatus: EventProviderStatus;
  allocated: number;
  committed: number;
  paid: number;
  pending: number;
  status: BudgetStatus;
  notes?: string;
}

export type PaymentStatus = 'Pagado' | 'Programado' | 'Pendiente' | 'Anulado';
export type PaymentMethod = 'Transferencia bancaria' | 'Tarjeta de crédito' | 'Efectivo' | 'Yape / Plin';

export interface PaymentItem {
  id: string;
  eventId: string;
  eventName?: string;
  providerName: string;
  providerRuc: string;
  concept: string;
  category: string;
  icon: string;
  iconBg: string;
  amount: number;
  date: string;
  method: string;
  methodIcon: string;
  status: PaymentStatus;
  receiptCode?: string;
  notes?: string;
}

export type DocumentType = 'Contrato' | 'Comprobante' | 'Cotización' | 'Técnico / Plano' | 'Documento del cliente' | 'Otro';

export interface DocumentItem {
  id: string;
  eventId: string;
  fileName: string;
  fileSize: string;
  fileFormat: string;
  type: DocumentType;
  category: string;
  relatedTo: string;
  relatedSubtext: string;
  uploadDate: string;
  uploadedBy: string;
  verified?: boolean;
  icon: string;
  iconBg: string;
  description?: string;
}

export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada';

export interface TaskItem {
  id: string;
  eventId: string;
  eventName?: string;
  title: string;
  description: string;
  relation: string;
  relationColor: string;
  assigneeName: string;
  assigneeRole: string;
  assigneeInitials: string;
  assigneeColor: string;
  dueDate: string;
  dueTime?: string;
  relativeDue: string;
  isOverdue?: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  relatedProvider?: string;
  budgetCategory?: string;
}

export interface AuditLogItem {
  id: string;
  logCode: string;
  eventId: string;
  dateGroup: string;
  timestamp: string;
  relativeTime: string;
  user: string;
  userRole: string;
  userInitials: string;
  category: 'Tareas' | 'Pagos' | 'Presupuesto' | 'Documentos' | 'Proveedores' | 'Evento';
  actionTitle: string;
  summaryHtml: string;
  icon: string;
  moduleOrigin: string;
  ipAddress: string;
  budgetItemName?: string;
  previousValue?: string;
  newValue?: string;
  percentageDelta?: string;
  netVariation?: string;
  justification?: string;
  targetTab?: EventDetailTab;
  metaTag?: string;
}

export interface SubscriptionInvoiceItem {
  id: string; // ID único de transacción (ej. TXN-2026-98410)
  code: string; // Recibo / Comprobante (ej. REC-8921)
  date: string; // Fecha (ej. 15 Sep 2026)
  time?: string; // Hora exacta (ej. 09:14:22 AM)
  planName?: 'Starter' | 'Profesional' | 'Enterprise';
  billingPeriod?: string; // Ej. Mensual · Sep 2026
  method: string;
  amount: number;
  status: 'Pagado' | 'Pendiente' | 'Rechazado';
  rejectionReason?: string;
}

export interface SubscriptionItem {
  id: string;
  code: string;
  companyName: string;
  ruc: string;
  city: string;
  initials: string;
  plan: 'Starter' | 'Profesional' | 'Enterprise';
  billingCycle: 'Mensual' | 'Anual';
  amount: number;
  status: 'Activa' | 'Prueba (6 días rest.)' | 'Pendiente de pago' | 'Vencida' | 'Suspendida';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: string;
  paymentIcon: string;
  cardEnding?: string;
  cardExpiry?: string;
  invoices: SubscriptionInvoiceItem[];
}

export interface CalendarEntry {
  id: string;
  day: number;
  month: number; // 8 = Septiembre (0-indexed) or 1-12
  year: number;
  title: string;
  time: string;
  endTime?: string;
  type: 'event' | 'task' | 'overdue-task';
  status: string;
  category: string;
  location: string;
  planner: string;
  client: string;
  eventId?: string;
}

export type PlatformUserRole = 'Super Admin' | 'Company Admin' | 'Planner' | 'Client';
export type PlatformUserStatus = 'Activo' | 'Invitación pendiente' | 'Suspendido';

export interface PlatformUserAccessLog {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  icon: string;
  iconColor: string;
}

export interface PlatformUser {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  avatarColor: string;
  email: string;
  phone: string;
  companyId: string;
  companyName: string;
  companySubtext: string;
  companyRuc?: string;
  companyInitials?: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  lastAccess: string;
  lastAccessIp: string;
  registeredDate: string;
  registeredDateLong: string;
  isSystemProtected?: boolean;
  verifiedBadge?: boolean;
  accessLogs: PlatformUserAccessLog[];
}

export type PlatformCompanyStatus = 'Activa' | 'Pendiente' | 'Suspendida';
export type PlatformCompanyPlan = 'Starter' | 'Profesional' | 'Enterprise' | 'Sin plan';

export interface PlatformCompany {
  id: string;
  code: string;
  commercialName: string;
  legalName: string;
  categorySubtext: string;
  ruc: string;
  taxStatus: string;
  registeredDate: string;
  registeredDateLong: string;
  timezone: string;
  email: string;
  phone: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminInitials: string;
  usersTotal: number;
  usersActive: number;
  usersInactive: number;
  plan: PlatformCompanyPlan;
  billingCycle: 'Mensual' | 'Anual';
  monthlyFee: number;
  nextRenewal: string;
  status: PlatformCompanyStatus;
}

export type GlobalCatalogModule =
  | 'presupuesto'
  | 'proveedores'
  | 'tipos_evento'
  | 'parametros'
  | 'estados';

export interface GlobalCatalogItem {
  id: string;
  module: 'presupuesto' | 'proveedores' | 'tipos_evento';
  name: string;
  description: string;
  displayOrder: number;
  status: 'Activa' | 'Inactiva';
}

export type NotificationCategory =
  | 'Pagos'
  | 'Proveedores'
  | 'Tareas'
  | 'Eventos'
  | 'Documentos'
  | 'Sistema';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  read: boolean;
  timestamp: string;
  dateFormatted: string;
  priority: 'Urgente' | 'Alta' | 'Normal';
  eventCode?: string;
  eventName?: string;
  targetHref: string;
  targetTab?: EventDetailTab;
  actionLabel: string;
  actorName?: string;
}


