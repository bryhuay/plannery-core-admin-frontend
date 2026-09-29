'use client';

import React, { useState, useEffect } from 'react';
import { Provider, ProviderCategory } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface ProviderFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProvider?: Provider | null;
}

export const ProviderFormDrawer: React.FC<
  ProviderFormDrawerProps
> = ({ isOpen, onClose, editingProvider }) => {
  const { addProvider, updateProvider, toggleProviderStatus } = usePlanery();

  const [commercialName, setCommercialName] = useState('');
  const [category, setCategory] = useState<ProviderCategory>('Catering');
  const [description, setDescription] = useState('');
  const [legalName, setLegalName] = useState('');
  const [ruc, setRuc] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Arequipa');
  const [internalNotes, setInternalNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editingProvider) {
      setCommercialName(editingProvider.commercialName);
      setCategory(editingProvider.category);
      setDescription(editingProvider.description || '');
      setLegalName(editingProvider.legalName);
      setRuc(editingProvider.ruc);
      setContactName(editingProvider.contactName);
      setPhone(editingProvider.phone);
      setEmail(editingProvider.email);
      setAddress(editingProvider.address);
      setCity(editingProvider.city);
      setInternalNotes(editingProvider.internalNotes || '');
      setIsActive(editingProvider.status === 'Activo');
    } else {
      setCommercialName('');
      setCategory('Catering');
      setDescription('');
      setLegalName('');
      setRuc('');
      setContactName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('Arequipa');
      setInternalNotes('');
      setIsActive(true);
    }
  }, [editingProvider, isOpen]);

  if (!isOpen) return null;

  const isEditMode = Boolean(editingProvider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialName.trim()) return;

    if (isEditMode && editingProvider) {
      updateProvider(editingProvider.id, {
        commercialName: commercialName.trim(),
        category,
        description: description.trim(),
        legalName: legalName.trim() || `${commercialName.trim()} S.A.C.`,
        ruc: ruc.trim() || '20601928371',
        contactName: contactName.trim() || 'Contacto Principal',
        phone: phone.trim() || '+51 987 654 321',
        email: email.trim() || 'contacto@empresa.com',
        address: address.trim() || 'Av. Principal 120',
        city: city.trim() || 'Arequipa',
        internalNotes: internalNotes.trim(),
        status: isActive ? 'Activo' : 'Inactivo',
      });
    } else {
      addProvider({
        commercialName: commercialName.trim(),
        category,
        description: description.trim(),
        legalName: legalName.trim() || `${commercialName.trim()} S.A.C.`,
        ruc: ruc.trim() || '20609911223',
        contactName: contactName.trim() || 'Roberto Valdivia',
        phone: phone.trim() || '+51 987 654 321',
        email: email.trim() || 'contacto@proveedor.pe',
        address: address.trim() || 'Av. Las Quintas 340',
        city: city.trim() || 'Arequipa',
        internalNotes: internalNotes.trim(),
        status: isActive ? 'Activo' : 'Inactivo',
      });
    }

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] bg-white shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header Fijo */}
        <header className="p-6 border-b border-slate-200 bg-white flex items-start justify-between shrink-0">
          <div>
            {isEditMode && editingProvider && (
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E2E8F8] text-slate-600 font-mono text-[11px] font-semibold tracking-wider mb-2">
                ID: {editingProvider.code}
              </div>
            )}
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {isEditMode ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Actualiza la información de este proveedor.'
                : 'Registra un proveedor para utilizarlo en los eventos de tu empresa.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Cuerpo del Formulario (5 Secciones) */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 space-y-6 flex-1 custom-scroll"
        >
          {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                storefront
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Información General
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Nombre comercial <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="Ej. Eventos García"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 text-slate-900 font-medium outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Categoría <span className="text-rose-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ProviderCategory)
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 font-medium outline-none"
              >
                <option value="Catering">Catering</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Decoración">Decoración</option>
                <option value="Música & Sonido">Música & Sonido</option>
                <option value="Venue / Locación">Venue / Locación</option>
                <option value="Transporte">Transporte</option>
                <option value="Audio e Iluminación">Audio e Iluminación</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Descripción
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente los servicios que ofrece..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none resize-none leading-relaxed"
              />
            </div>
          </section>

          {/* SECCIÓN 2: INFORMACIÓN EMPRESARIAL */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                domain
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Información Empresarial
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  Razón social
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Razón social del proveedor"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  RUC
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  placeholder="Ingresa el RUC (11 dígitos)"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: CONTACTO */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                contact_phone
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Contacto
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Persona de contacto
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nombre de la persona de contacto"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +51 987 654 321"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: UBICACIÓN */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                location_on
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Ubicación
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  Dirección
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección del proveedor"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none"
                />
              </div>

              <div className="col-span-1 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Arequipa"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN 5: INFORMACIÓN ADICIONAL */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                verified
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                5. Información Adicional
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-900">
                Notas internas
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Información adicional para el equipo..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:border-[#F2C94C] text-slate-900 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Estado Toggle y Badge */}
            <div className="p-4 bg-[#F0F3FF] rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Estado del proveedor
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-emerald-600' : 'bg-slate-500'
                      }`}
                    />
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Los proveedores activos estarán disponibles para asociarlos a
                  nuevos eventos.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                  isActive ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Footer Fijo */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 w-full">
            {isEditMode && editingProvider ? (
              <button
                type="button"
                onClick={() => {
                  toggleProviderStatus(editingProvider.id, 'Inactivo');
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-rose-600 text-xs font-semibold hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  block
                </span>
                <span>Desactivar proveedor</span>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#F2C94C] hover:bg-[#ebc246] text-[#241a00] text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
                <span>
                  {isEditMode ? 'Guardar cambios' : 'Crear proveedor'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </aside>
    </>
  );
};
