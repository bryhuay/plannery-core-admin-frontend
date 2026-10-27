'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Provider, ProviderCategory } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface ProviderFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProvider?: Provider | null;
}

const AVAILABLE_CATEGORIES: ProviderCategory[] = [
  'Catering',
  'Fotografía',
  'Decoración',
  'Música & Sonido',
  'Venue / Locación',
  'Transporte',
  'Audio e Iluminación',
  'Seguridad',
];

export const ProviderFormDrawer: React.FC<ProviderFormDrawerProps> = ({
  isOpen,
  onClose,
  editingProvider,
}) => {
  const { addProvider, updateProvider, toggleProviderStatus, companies, showToast } =
    usePlanery();

  const [commercialName, setCommercialName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ProviderCategory[]>([
    'Catering',
  ]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const companyDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
    }
    if (isCompanyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCompanyDropdownOpen]);

  useEffect(() => {
    if (editingProvider) {
      setCommercialName(editingProvider.commercialName);
      const cats =
        editingProvider.categories && editingProvider.categories.length > 0
          ? editingProvider.categories
          : [editingProvider.category || 'Catering'];
      setSelectedCategories(cats);
      setSelectedCompanyId(
        editingProvider.companyId || companies[0]?.id || 'EMP-2026-0042'
      );
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
      setSelectedCategories(['Catering']);
      setSelectedCompanyId(companies[0]?.id || 'EMP-2026-0042');
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
    setCompanySearchQuery('');
    setIsCompanyDropdownOpen(false);
  }, [editingProvider, isOpen, companies]);

  if (!isOpen) return null;

  const isEditMode = Boolean(editingProvider);

  // Companies filtered by search
  const filteredCompanies = companies.filter((c) => {
    const q = companySearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.commercialName.toLowerCase().includes(q) ||
      c.legalName.toLowerCase().includes(q) ||
      c.ruc.includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const toggleCategory = (cat: ProviderCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) {
        showToast('El proveedor debe tener al menos una categoría seleccionada.', 'warning');
        return;
      }
      setSelectedCategories((prev) => prev.filter((c) => c !== cat));
    } else {
      setSelectedCategories((prev) => [...prev, cat]);
    }
  };

  const removeCategory = (cat: ProviderCategory) => {
    if (selectedCategories.length === 1) {
      showToast('El proveedor debe tener al menos una categoría seleccionada.', 'warning');
      return;
    }
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialName.trim()) return;

    if (selectedCategories.length === 0) {
      showToast('Por favor selecciona al menos una categoría para el proveedor.', 'warning');
      return;
    }

    const primaryCategory = selectedCategories[0];
    const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];

    if (isEditMode && editingProvider) {
      updateProvider(editingProvider.id, {
        commercialName: commercialName.trim(),
        category: primaryCategory,
        categories: selectedCategories,
        companyId: selectedCompanyId,
        companyName: company?.commercialName,
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
        category: primaryCategory,
        categories: selectedCategories,
        companyId: selectedCompanyId,
        companyName: company?.commercialName,
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
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[540px] bg-white shadow-2xl flex flex-col border-l border-slate-200"
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
                ? 'Actualiza la información comercial, empresa asociada y categorías de este proveedor.'
                : 'Registra un proveedor homologado y asígnalo a una empresa de la plataforma.'}
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

        {/* Cuerpo del Formulario */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 space-y-6 flex-1 custom-scroll"
        >
          {/* SECCIÓN 1: INFORMACIÓN GENERAL & ASIGNACIÓN */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745b00] text-[18px]">
                storefront
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Información General & Empresa
              </h3>
            </div>

            {/* EMPRESA A LA QUE PERTENECE (COMBO BOX SEARCH - VISTA ADMIN GLOBAL) */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="block text-xs font-semibold text-slate-900">
                  Empresa cliente / Organizadora{' '}
                  <span className="text-rose-600 font-bold">*</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[13px] text-amber-700">
                    shield_person
                  </span>
                  <span>Vista Administrador Global</span>
                </div>
              </div>

              {/* Contenedor Combobox */}
              <div className="relative" ref={companyDropdownRef}>
                <div
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl cursor-pointer transition-all ${
                    isCompanyDropdownOpen
                      ? 'border-[#F2C94C] ring-2 ring-[#F2C94C]/20 shadow-xs'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E7EEFE] text-[#745B00] border border-[#DCE2F3] flex items-center justify-center font-bold text-xs shrink-0">
                      {selectedCompany?.commercialName.slice(0, 2).toUpperCase() || 'EM'}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {selectedCompany?.commercialName || 'Selecciona una empresa...'}
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 truncate">
                        {selectedCompany ? (
                          <>
                            <span>RUC: {selectedCompany.ruc}</span>
                            <span>•</span>
                            <span>Plan {selectedCompany.plan}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-sans font-medium">
                              {selectedCompany.status}
                            </span>
                          </>
                        ) : (
                          'Buscar en el directorio de empresas'
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-slate-500 text-xl transition-transform ${
                      isCompanyDropdownOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>

                {/* Dropdown flotante con buscador */}
                {isCompanyDropdownOpen && (
                  <div className="absolute z-30 mt-1.5 w-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2.5 bg-slate-50 border-b border-slate-200">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                          search
                        </span>
                        <input
                          type="text"
                          value={companySearchQuery}
                          onChange={(e) => setCompanySearchQuery(e.target.value)}
                          placeholder="Buscar por nombre, RUC, razón social..."
                          autoFocus
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C] text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1 px-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {filteredCompanies.length} empresas encontradas
                        </span>
                        {companySearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCompanySearchQuery('')}
                            className="text-[10px] text-[#745B00] hover:underline cursor-pointer"
                          >
                            Limpiar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 custom-scroll">
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((c) => {
                          const isCurrent = c.id === selectedCompanyId;
                          return (
                            <div
                              key={c.id}
                              onClick={() => {
                                setSelectedCompanyId(c.id);
                                setIsCompanyDropdownOpen(false);
                              }}
                              className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'bg-amber-50/80 hover:bg-amber-100/70'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                    isCurrent
                                      ? 'bg-[#F2C94C] text-[#241a00]'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {c.commercialName.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0 text-left">
                                  <div className="text-xs font-semibold text-slate-900 truncate">
                                    {c.commercialName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {c.legalName}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                                    <span>{c.code}</span>
                                    <span>•</span>
                                    <span>RUC {c.ruc}</span>
                                    <span>•</span>
                                    <span className="text-slate-600 font-medium">
                                      {c.plan}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    c.status === 'Activa'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  {c.status}
                                </span>
                                {isCurrent && (
                                  <span className="material-symbols-outlined text-[#745B00] text-lg font-bold">
                                    check
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500">
                          No se encontraron empresas con &quot;{companySearchQuery}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NOMBRE COMERCIAL */}
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

            {/* CATEGORÍA DINÁMICA CON TAGS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-900">
                  Categorías del proveedor <span className="text-rose-600">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {selectedCategories.length}{' '}
                  {selectedCategories.length === 1
                    ? 'categoría seleccionada'
                    : 'categorías seleccionadas'}
                </span>
              </div>

              {/* Tags seleccionados */}
              <div className="p-2.5 bg-slate-50/80 border border-slate-200 rounded-xl min-h-[46px] flex flex-wrap items-center gap-1.5">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F2C94C]/25 text-[#745B00] border border-[#F2C94C]/70 shadow-2xs transition-all"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(cat)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#745B00]/20 text-[#745B00] transition-colors cursor-pointer"
                      title={`Eliminar categoría ${cat}`}
                    >
                      <span className="material-symbols-outlined text-[13px] leading-none">
                        close
                      </span>
                    </button>
                  </span>
                ))}
              </div>

              {/* Cloud de selección rápida de categorías */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Haz clic en las categorías para agregarlas o quitarlas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs font-semibold ring-1 ring-amber-300'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isSelected ? 'check' : 'add'}
                        </span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
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
