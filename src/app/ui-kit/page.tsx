'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { usePlanery } from '../../context/PlaneryContext';

export default function UiKitPage() {
  const { showToast } = usePlanery();
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'patterns'>('tokens');

  const colorTokens = [
    {
      name: 'Brand Accent (Gold / Amber)',
      token: '--color-primary-container',
      hex: '#F2C94C',
      textClass: 'text-[#241a00]',
      bgStyle: '#F2C94C',
      usage: 'CTAs primarios, indicadores activos en Sidebar, acentos de marca',
    },
    {
      name: 'Sidebar & Dark Surface',
      token: '--color-inverse-surface',
      hex: '#1E222D',
      textClass: 'text-white',
      bgStyle: '#1E222D',
      usage: 'Navegación principal fija, cabeceras de alto contraste',
    },
    {
      name: 'Surface Bright (Canvas)',
      token: '--color-surface',
      hex: '#F9F9FF',
      textClass: 'text-slate-900',
      bgStyle: '#F9F9FF',
      usage: 'Fondo base de aplicación SaaS B2B',
    },
    {
      name: 'Surface Container Lowest',
      token: '--color-surface-container-lowest',
      hex: '#FFFFFF',
      textClass: 'text-slate-900',
      bgStyle: '#FFFFFF',
      usage: 'Tarjetas elevadas, tablas de datos, modales y drawers',
    },
    {
      name: 'Secondary Action (Executive Blue)',
      token: '--color-secondary',
      hex: '#0051D5',
      textClass: 'text-white',
      bgStyle: '#0051D5',
      usage: 'Enlaces interactivos, filtros seleccionados, progreso técnico',
    },
    {
      name: 'Semantic Success (Emerald)',
      token: 'emerald-600',
      hex: '#059669',
      textClass: 'text-white',
      bgStyle: '#059669',
      usage: 'Pagado, Confirmado, Dentro de presupuesto, Activo',
    },
    {
      name: 'Semantic Warning (Amber)',
      token: 'amber-600',
      hex: '#D97706',
      textClass: 'text-white',
      bgStyle: '#D97706',
      usage: 'En progreso, Pendiente de pago, Por vencer',
    },
    {
      name: 'Semantic Danger (Rose)',
      token: 'rose-600',
      hex: '#E11D48',
      textClass: 'text-white',
      bgStyle: '#E11D48',
      usage: 'Vencido, Excedido, Cancelado, Eliminación crítica',
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Executive Precision — UI Kit & Design System
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300/60">
              v2.4 Enterprise
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Librería de componentes reutilizables, tokens de color, tipografía y patrones interactivos de Planery Core.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tokens'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tokens y Tipografía
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'components'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Componentes UI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patterns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'patterns'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arquitectura Next.js + TS
          </button>
        </div>
      </div>

      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Color Palette Grid */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Paleta Oficial Planery Core
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Contraste calibrado para operaciones corporativas B2B, combinando navegación oscura (#1E222D), acento dorado (#F2C94C) y superficies luminosas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {colorTokens.map((token) => (
                <div
                  key={token.name}
                  className="rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between bg-slate-50/40"
                >
                  <div
                    className={`h-20 px-4 py-3 flex items-end justify-between border-b border-slate-200/60 ${token.textClass}`}
                    style={{ backgroundColor: token.bgStyle }}
                  >
                    <span className="font-mono text-xs font-bold">{token.hex}</span>
                    <span className="text-[10px] font-mono opacity-80">{token.token}</span>
                  </div>
                  <div className="p-3.5">
                    <div className="text-xs font-bold text-slate-900">{token.name}</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {token.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Scale */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Jerarquía Tipográfica & Datos Tabulares
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Inter para interfaz de usuario y JetBrains Mono con <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">tabular-nums</code> para códigos, importes y RUC.
            </p>
            <div className="divide-y divide-slate-200/70">
              <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    Page Header (text-2xl font-bold tracking-tight)
                  </span>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    Boda de María y Carlos — Gestión Integral
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">24px / 700 / -0.025em</span>
              </div>

              <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    KPI Financial Display (text-2xl font-extrabold tabular-nums)
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                    S/ 85,000.00 PEN
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">Inter + tabular-nums</span>
              </div>

              <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    Monospace Identifier (font-mono text-xs font-semibold)
                  </span>
                  <div className="font-mono text-xs font-semibold text-slate-800 mt-1 flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                      EV-2026-084
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                      RUC: 20548796321
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                      OP-0098412
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">JetBrains Mono / 12px</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-6">
          {/* Buttons Showcase */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Botones Reutilizables (<code className="font-mono text-xs text-blue-600">components/ui/Button.tsx</code>)
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                icon="add"
                onClick={() => showToast('Acción primaria ejecutada desde UI Kit.')}
              >
                Acción Primaria (Gold)
              </Button>
              <Button
                variant="secondary"
                icon="bolt"
                onClick={() => showToast('Acción secundaria ejecutada.')}
              >
                Secundario (Dark Slate)
              </Button>
              <Button
                variant="outline"
                icon="download"
                onClick={() => showToast('Exportación iniciada.')}
              >
                Outline Corporativo
              </Button>
              <Button
                variant="danger"
                icon="delete"
                onClick={() => showToast('Alerta de acción destructiva.', 'warning')}
              >
                Peligro / Eliminar
              </Button>
              <Button variant="ghost" icon="tune">
                Botón Ghost
              </Button>
            </div>
          </div>

          {/* Status Badges Showcase */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Badges de Estado Semánticos (<code className="font-mono text-xs text-blue-600">components/ui/StatusBadge.tsx</code>)
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="Confirmado" />
              <StatusBadge status="En progreso" />
              <StatusBadge status="Planificación" />
              <StatusBadge status="Completado" />
              <StatusBadge status="Pagado" />
              <StatusBadge status="Pendiente" />
              <StatusBadge status="Vencido" />
              <StatusBadge status="Excedido" />
              <StatusBadge status="Dentro de presupuesto" />
              <StatusBadge status="Cancelado" />
            </div>
          </div>

          {/* Metric Cards Showcase */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Tarjetas de Métricas (<code className="font-mono text-xs text-blue-600">components/ui/MetricCard.tsx</code>)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Presupuesto Total"
                value="S/ 85,000"
                icon="account_balance_wallet"
                iconBgClass="bg-blue-50 text-blue-600"
                badgeText="100% Asignado"
                badgeClass="text-emerald-700 bg-emerald-50"
              />
              <MetricCard
                label="Total Pagado"
                value="S/ 36,600"
                icon="check_circle"
                iconBgClass="bg-emerald-50 text-emerald-600"
                subtext="43.1% del presupuesto ejecutado"
              />
              <MetricCard
                label="Saldo Pendiente"
                value="S/ 21,900"
                icon="schedule"
                iconBgClass="bg-amber-50 text-amber-600"
                badgeText="2 próximos a vencer"
                badgeClass="text-amber-700 bg-amber-50"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Estructura Modular de Archivos (App Router + Clean Architecture)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            El proyecto está estructurado siguiendo estrictamente la separación de responsabilidades entre rutas de aplicación (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">app/</code>), componentes de navegación, primitivas de interfaz (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">components/ui/</code>), modales/drawers interactivos (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">'use client'</code>) y tipado fuerte en TypeScript.
          </p>
          <pre className="bg-[#1E222D] text-slate-200 p-5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`src/
├── app/
│   ├── layout.tsx                   # Layout Global (Sidebar oscuro #1E222D + Header + Footer)
│   ├── page.tsx                     # Dashboard Principal Ejecutivo
│   ├── eventos/
│   │   ├── page.tsx                 # Lista de Eventos (Tabla + Kanban + Filtros)
│   │   ├── nuevo/page.tsx           # Crear Evento (Formulario 4 secciones + Modales)
│   │   └── [id]/page.tsx            # Detalle Maestro de Evento (7 Pestañas Interactivas)
│   ├── proveedores/page.tsx         # Directorio Global de Proveedores + Bulk Actions
│   ├── calendario/page.tsx          # Calendario Mensual/Semanal + Agenda Operativa
│   ├── pagos/page.tsx               # Control Financiero Global de Pagos y Comprobantes
│   ├── suscripciones/page.tsx       # Super Admin: Planes y Suscripciones B2B
│   ├── ui-kit/page.tsx              # Librería de Componentes & Design System
│   └── perfil/page.tsx              # Configuración de Cuenta y Empresa
├── components/
│   ├── navigation/                  # Sidebar.tsx, Header.tsx, Footer.tsx
│   ├── ui/                          # Button.tsx, MetricCard.tsx, StatusBadge.tsx, Toast.tsx
│   ├── eventos/                     # TabResumen.tsx, TabFinanzas.tsx, TabOperaciones.tsx
│   ├── modals/                      # Drawers y Modales interactivos ('use client')
│   └── forms/                       # FormularioProveedorDrawer.tsx ('use client')
├── context/
│   └── PlaneryContext.tsx           # Estado Global Reactivo con CRUD completo
└── types/
    └── planery.ts                   # Interfaces y Tipos Estrictos TypeScript`}
          </pre>
        </div>
      )}
    </div>
  );
}
