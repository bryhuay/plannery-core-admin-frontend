'use client';

import React, { useState } from 'react';
import { EventProviderStatus, ProviderCategory } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface AssignEventProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

interface CandidateProvider {
  id: string;
  name: string;
  category: ProviderCategory;
  description: string;
  email: string;
  phone: string;
  icon: string;
  iconBg: string;
  badgeBg: string;
  defaultService: string;
  defaultBudget: string;
}

const CANDIDATE_PROVIDERS: CandidateProvider[] = [
  {
    id: 'prov-1',
    name: 'Catering & Eventos Sol Naciente',
    category: 'Catering',
    description:
      'Servicio de banquete gourmet y coctelería para eventos corporativos y bodas.',
    email: 'reservas@solnaciente.pe',
    phone: '+51 954 320 110',
    icon: 'restaurant',
    iconBg: 'bg-amber-100 text-amber-900 border-amber-200/60',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    defaultService: 'Servicio de catering 3 tiempos para 180 personas',
    defaultBudget: '9400.00',
  },
  {
    id: 'prov-2',
    name: 'Transportes Ejecutivos Sur',
    category: 'Transporte',
    description:
      'Flota de vans Mercedes-Benz y traslados VIP para invitados y anfitriones.',
    email: 'operaciones@transportessur.pe',
    phone: '+51 987 410 220',
    icon: 'airport_shuttle',
    iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    defaultService: '4 Vans Mercedes-Benz Sprinter ida y vuelta',
    defaultBudget: '1850.00',
  },
  {
    id: 'prov-3',
    name: 'Eventos García & Diseño',
    category: 'Decoración',
    description:
      'Ambientación temática, estructuras lumínicas y montaje escenográfico integral.',
    email: 'estudio@eventosgarcia.pe',
    phone: '+51 959 881 300',
    icon: 'local_florist',
    iconBg: 'bg-pink-50 text-pink-700 border-pink-200',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    defaultService: 'Arco floral principal y mobiliario lounge',
    defaultBudget: '5200.00',
  },
];

export const AssignEventProviderDrawer: React.FC<
  AssignEventProviderDrawerProps
> = ({ isOpen, onClose, eventId }) => {
  const { linkProviderToEvent } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('prov-1');
  const [serviceDescription, setServiceDescription] = useState(
    'Servicio de catering 3 tiempos para 180 personas'
  );
  const [initialStatus, setInitialStatus] =
    useState<EventProviderStatus>('Propuesto');
  const [estimatedBudget, setEstimatedBudget] = useState('9400.00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const filteredCandidates = CANDIDATE_PROVIDERS.filter((c) => {
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchText =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchText;
  });

  const selectedCandidate =
    CANDIDATE_PROVIDERS.find((c) => c.id === selectedId) ||
    CANDIDATE_PROVIDERS[0];

  const handleSelectCandidate = (c: CandidateProvider) => {
    setSelectedId(c.id);
    setServiceDescription(c.defaultService);
    setEstimatedBudget(c.defaultBudget);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const numericBudget =
      parseFloat(estimatedBudget.replace(/,/g, '')) || 0;

    linkProviderToEvent({
      eventId,
      providerId: selectedCandidate.id,
      providerName: selectedCandidate.name,
      email: selectedCandidate.email,
      phone: selectedCandidate.phone,
      category: selectedCandidate.category,
      icon: selectedCandidate.icon,
      iconBg: selectedCandidate.iconBg,
      serviceDescription:
        serviceDescription.trim() || selectedCandidate.defaultService,
      serviceSubtext: notes.trim() || 'Vinculado desde directorio empresarial',
      status: initialStatus,
      budget: numericBudget,
      budgetNote:
        initialStatus === 'Confirmado'
          ? 'Contrato firmado'
          : 'Cotización registrada',
      paymentStatus: 'Pendiente',
      internalNotes: notes,
    });

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 w-full max-w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              Agregar proveedor
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona un proveedor para asociarlo a este evento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 -mr-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleConfirm}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll"
        >
          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Buscar proveedor
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[19px]">
                    search
                  </span>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar proveedor..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="all">Todas las categorías</option>
                <option value="Catering">Catering</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Decoración">Decoración</option>
                <option value="Transporte">Transporte</option>
              </select>
            </div>
          </div>

          {/* Available Providers List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Proveedores disponibles
              </span>
              <span className="text-[11px] text-slate-400">
                {filteredCandidates.length} resultados
              </span>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl space-y-2 bg-slate-50/50">
                <span className="material-symbols-outlined text-slate-400 text-[28px]">
                  search_off
                </span>
                <p className="text-xs font-semibold text-slate-700">
                  No encontramos proveedores
                </p>
                <p className="text-[11px] text-slate-500">
                  Intenta buscar con otros términos o cambia la categoría.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredCandidates.map((cand) => {
                  const isSelected = cand.id === selectedId;
                  return (
                    <div
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 shadow-xs ${
                        isSelected
                          ? 'border-2 border-[#f2c94c] bg-amber-50/30'
                          : 'border border-[#E5E7EB] hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold shrink-0 mt-0.5 ${cand.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            {cand.icon}
                          </span>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {cand.name}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${cand.badgeBg}`}
                            >
                              {cand.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                            {cand.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                          isSelected ? 'text-[#745b00]' : 'text-slate-300'
                        }`}
                      >
                        {isSelected
                          ? 'check_circle'
                          : 'radio_button_unchecked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Service Configuration */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Configuración del servicio
              </h4>
              <span className="text-[10px] font-semibold text-[#745b00] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded truncate max-w-[200px]">
                {selectedCandidate.name}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Servicio acordado
              </label>
              <input
                type="text"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Estado inicial
                </label>
                <select
                  value={initialStatus}
                  onChange={(e) =>
                    setInitialStatus(e.target.value as EventProviderStatus)
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 focus:outline-none focus:border-[#F2C94C]"
                >
                  <option value="Propuesto">Propuesto</option>
                  <option value="En evaluación">En evaluación</option>
                  <option value="Seleccionado">Seleccionado</option>
                  <option value="Confirmado">Confirmado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Presupuesto estimado
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                    S/
                  </span>
                  <input
                    type="text"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 font-semibold tabular-nums focus:outline-none focus:border-[#F2C94C]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Notas internas o requerimientos especiales
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas internas o requerimientos especiales (ej: coordinación de ingreso con el venue a las 3:00 PM)"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-xs font-bold bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                check
              </span>
              <span>Agregar proveedor</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
