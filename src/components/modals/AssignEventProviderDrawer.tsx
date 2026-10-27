'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ProviderCategory,
  QuotationAttachment,
  StrictProviderStatus,
  EventProviderRelation,
} from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface AssignEventProviderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

interface ServiceQuoteForm {
  budget: string;
  quotationCode: string;
  file: QuotationAttachment | null;
  notes: string;
  status: StrictProviderStatus;
}

function getCategoryIcon(cat: ProviderCategory | string): string {
  switch (cat) {
    case 'Catering':
      return 'restaurant';
    case 'Fotografía':
      return 'photo_camera';
    case 'Decoración':
      return 'local_florist';
    case 'Música & Sonido':
      return 'music_note';
    case 'Venue / Locación':
      return 'domain';
    case 'Transporte':
      return 'airport_shuttle';
    case 'Audio e Iluminación':
      return 'tune';
    case 'Seguridad':
      return 'shield';
    default:
      return 'design_services';
  }
}

function getCategoryStyle(cat: ProviderCategory | string): {
  iconBg: string;
  badgeBg: string;
} {
  switch (cat) {
    case 'Catering':
      return {
        iconBg: 'bg-amber-100 text-amber-900 border-amber-200/60',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      };
    case 'Fotografía':
      return {
        iconBg: 'bg-blue-100 text-blue-900 border-blue-200/60',
        badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      };
    case 'Decoración':
      return {
        iconBg: 'bg-pink-100 text-pink-900 border-pink-200/60',
        badgeBg: 'bg-pink-50 text-pink-900 border-pink-200',
      };
    case 'Música & Sonido':
      return {
        iconBg: 'bg-purple-100 text-purple-900 border-purple-200/60',
        badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
      };
    case 'Venue / Locación':
      return {
        iconBg: 'bg-emerald-100 text-emerald-900 border-emerald-200/60',
        badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      };
    case 'Transporte':
      return {
        iconBg: 'bg-slate-100 text-slate-800 border-slate-200',
        badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      };
    case 'Audio e Iluminación':
      return {
        iconBg: 'bg-indigo-100 text-indigo-900 border-indigo-200/60',
        badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      };
    case 'Seguridad':
      return {
        iconBg: 'bg-cyan-100 text-cyan-900 border-cyan-200/60',
        badgeBg: 'bg-cyan-50 text-cyan-900 border-cyan-200',
      };
    default:
      return {
        iconBg: 'bg-gray-100 text-gray-800 border-gray-200',
        badgeBg: 'bg-gray-50 text-gray-800 border-gray-200',
      };
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const AssignEventProviderDrawer: React.FC<AssignEventProviderDrawerProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const { providers, linkMultipleServicesToEvent, uploadDocument, showToast } = usePlanery();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [servicesData, setServicesData] = useState<Record<string, ServiceQuoteForm>>({});
  const [activeUploadCategory, setActiveUploadCategory] = useState<string | null>(null);
  const [draggingCategory, setDraggingCategory] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map providers list
  const candidateProviders = providers.map((p) => {
    const cats: string[] =
      p.categories && p.categories.length > 0 ? p.categories : [p.category];
    const style = getCategoryStyle(p.category);
    return {
      id: p.id,
      name: p.commercialName,
      legalName: p.legalName,
      ruc: p.ruc,
      category: p.category,
      categories: cats,
      description: p.description,
      email: p.email,
      phone: p.phone,
      icon: getCategoryIcon(p.category),
      iconBg: style.iconBg,
      badgeBg: style.badgeBg,
      status: p.status,
      companyName: p.companyName,
    };
  });

  const filteredCandidates = candidateProviders.filter((c) => {
    const matchCat =
      categoryFilter === 'all' ||
      c.categories.some((cat) => cat.toLowerCase() === categoryFilter.toLowerCase()) ||
      c.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchText =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ruc.includes(searchQuery.trim()) ||
      c.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchText;
  });

  // Selected candidate object
  const currentProvider =
    candidateProviders.find((c) => c.id === selectedProviderId) ||
    filteredCandidates[0] ||
    null;

  const availableCategories = currentProvider ? currentProvider.categories : [];

  // Helper to get or init service state
  const getInitServiceData = (catName: string): ServiceQuoteForm => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return {
      budget: '0.00',
      quotationCode: `COT-${new Date().getFullYear()}-${randomCode}`,
      file: null,
      notes: '',
      status: 'PROPUESTO',
    };
  };

  // Automatically select the first candidate when opening
  useEffect(() => {
    if (!isOpen) return;
    if (!selectedProviderId && filteredCandidates.length > 0) {
      const first = filteredCandidates[0];
      setSelectedProviderId(first.id);
      setSelectedCategories([...first.categories]);
      const initialMap: Record<string, ServiceQuoteForm> = {};
      first.categories.forEach((cat) => {
        initialMap[cat] = getInitServiceData(cat);
      });
      setServicesData(initialMap);
    }
  }, [isOpen, filteredCandidates, selectedProviderId]);

  const handleSelectCandidate = (provider: (typeof candidateProviders)[0]) => {
    setSelectedProviderId(provider.id);
    setSelectedCategories([...provider.categories]);
    const initialMap: Record<string, ServiceQuoteForm> = {};
    provider.categories.forEach((cat) => {
      initialMap[cat] = getInitServiceData(cat);
    });
    setServicesData(initialMap);
    setValidationError(null);
  };

  const handleToggleCategory = (categoryName: string) => {
    setValidationError(null);
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((c) => c !== categoryName);
      } else {
        if (!servicesData[categoryName]) {
          setServicesData((curr) => ({
            ...curr,
            [categoryName]: getInitServiceData(categoryName),
          }));
        }
        return [...prev, categoryName];
      }
    });
  };

  const handleSelectAllCategories = () => {
    if (!currentProvider) return;
    setSelectedCategories([...currentProvider.categories]);
    setServicesData((prev) => {
      const updated = { ...prev };
      currentProvider.categories.forEach((cat) => {
        if (!updated[cat]) {
          updated[cat] = getInitServiceData(cat);
        }
      });
      return updated;
    });
    setValidationError(null);
  };

  // Update specific service state
  const updateServiceField = <K extends keyof ServiceQuoteForm>(
    category: string,
    field: K,
    value: ServiceQuoteForm[K]
  ) => {
    setServicesData((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || getInitServiceData(category)),
        [field]: value,
      },
    }));
  };

  // File upload logic per category
  const triggerFileUpload = (category: string) => {
    setActiveUploadCategory(category);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = (file: File, category: string) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDoc =
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.xls') ||
      file.name.toLowerCase().endsWith('.xlsx');

    const formattedSize = formatBytes(file.size);
    const todayFormatted = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        updateServiceField(category, 'file', {
          name: file.name,
          size: formattedSize,
          type: 'image',
          dataUrl: uploadEvt.target?.result as string,
          uploadDate: todayFormatted,
        });
      };
      reader.readAsDataURL(file);
    } else {
      updateServiceField(category, 'file', {
        name: file.name,
        size: formattedSize,
        type: isPdf ? 'pdf' : isDoc ? 'doc' : 'document',
        uploadDate: todayFormatted,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadCategory) {
      processUploadedFile(file, activeUploadCategory);
    }
  };

  const handleServiceDrop = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDraggingCategory(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file, category);
    }
  };

  const handleRemoveServiceFile = (category: string) => {
    updateServiceField(category, 'file', null);
  };

  // Total committed amount calculated across all selected services
  const totalServicesBudget = selectedCategories.reduce((acc, cat) => {
    const budgetRaw = servicesData[cat]?.budget || '0';
    const num = parseFloat(budgetRaw.replace(/,/g, '')) || 0;
    return acc + num;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider) {
      setValidationError('Por favor selecciona un proveedor.');
      return;
    }

    if (selectedCategories.length === 0) {
      setValidationError('Debes seleccionar al menos un servicio o categoría a contratar.');
      return;
    }

    // Build relations array: 1 distinct relation per selected category
    const relationsToCreate: Omit<EventProviderRelation, 'id'>[] = selectedCategories.map(
      (cat) => {
        const catData = servicesData[cat] || getInitServiceData(cat);
        const numBudget = parseFloat(catData.budget.replace(/,/g, '')) || 0;
        const style = getCategoryStyle(cat);
        const icon = getCategoryIcon(cat);

        return {
          eventId,
          providerId: currentProvider.id,
          providerName: currentProvider.name,
          email: currentProvider.email,
          phone: currentProvider.phone,
          category: cat as ProviderCategory,
          serviceName: cat,
          selectedCategories: [cat],
          icon,
          iconBg: style.iconBg,
          serviceDescription: cat,
          serviceSubtext:
            catData.notes.trim() || `Servicio de ${cat} contratado para el evento`,
          quotationFile: catData.file || undefined,
          quotationNumber: catData.quotationCode.trim() || undefined,
          status: catData.status,
          budget: numBudget,
          budgetNote: catData.file
            ? `Cotización: ${catData.quotationCode}`
            : catData.status === 'CONFIRMADO'
            ? 'Contrato firmado'
            : 'En evaluación',
          paymentStatus: 'Pendiente',
          internalNotes: catData.notes,
          extraFiles: [],
        };
      }
    );

    // Batch create relations
    linkMultipleServicesToEvent(relationsToCreate);

    // Sync any uploaded quotation files to the event's Documents repository
    selectedCategories.forEach((cat) => {
      const catData = servicesData[cat];
      if (catData?.file) {
        uploadDocument({
          eventId,
          fileName: catData.file.name,
          fileSize: catData.file.size || '1.5 MB',
          fileFormat:
            catData.file.type === 'pdf'
              ? 'PDF'
              : catData.file.type === 'image'
              ? 'PNG'
              : 'DOC',
          type: 'Cotización',
          category: cat as ProviderCategory,
          relatedTo: currentProvider.name,
          relatedSubtext: `Cotización de servicio: ${cat} (${catData.quotationCode})`,
          uploadDate: catData.file.uploadDate || 'Hoy',
          uploadedBy: 'Planner Líder',
          verified: true,
          icon: catData.file.type === 'image' ? 'image' : 'description',
          iconBg: 'bg-amber-50 text-amber-900 border-amber-200',
          description: `Cotización ${catData.quotationCode} para ${cat} de ${currentProvider.name}.`,
        });
      }
    });

    showToast(
      `Se vincularon ${selectedCategories.length} servicio(s) independientes de ${currentProvider.name} al evento.`
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Hidden file input for service quotations */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx"
        className="hidden"
      />

      {/* Drawer Container */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#745B00]">
                handshake
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Asignar Proveedor al Evento
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configura cotizaciones, montos y especificaciones independientes por cada servicio contratado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. SELECCIÓN DE PROVEEDOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Seleccionar Proveedor <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {candidateProviders.length} proveedores registrados
              </span>
            </div>

            {/* Buscador y filtro de categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-8 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, RUC o categoría..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-lg text-slate-700 font-medium focus:outline-none focus:border-[#F2C94C]"
                >
                  <option value="all">Todas</option>
                  <option value="catering">Catering</option>
                  <option value="fotografía">Fotografía</option>
                  <option value="decoración">Decoración</option>
                  <option value="música & sonido">Música & Sonido</option>
                  <option value="audio e iluminación">Audio e Iluminación</option>
                  <option value="venue / locación">Venue</option>
                  <option value="transporte">Transporte</option>
                  <option value="seguridad">Seguridad</option>
                </select>
              </div>
            </div>

            {/* Listado de candidatos seleccionables */}
            <div className="grid grid-cols-1 gap-2 max-h-[175px] overflow-y-auto pr-1">
              {filteredCandidates.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No se encontraron proveedores que coincidan con la búsqueda.
                </div>
              ) : (
                filteredCandidates.map((c) => {
                  const isSelected = selectedProviderId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCandidate(c)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FEF9E7] border-[#F2C94C] ring-1 ring-[#F2C94C]'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${c.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[19px]">
                            {c.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {c.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              RUC: {c.ruc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            {c.categories.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 ${
                          isSelected ? 'text-[#745B00]' : 'text-slate-300'
                        }`}
                      >
                        {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. SELECCIÓN DE SERVICIOS / CATEGORÍAS */}
          {currentProvider && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Servicios / Categorías a contratar <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selecciona los servicios que brindará este proveedor en el evento:
                  </p>
                </div>
                {availableCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSelectAllCategories}
                    className="text-[11px] font-semibold text-[#745B00] hover:underline cursor-pointer shrink-0"
                  >
                    Marcar todos ({availableCategories.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableCategories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  const style = getCategoryStyle(cat);
                  return (
                    <label
                      key={cat}
                      className={`flex items-center justify-between gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                        isChecked
                          ? 'bg-[#FEF9E7] border-[#F2C94C] text-slate-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategory(cat)}
                          className="rounded border-slate-300 text-[#F2C94C] focus:ring-[#F2C94C] w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border ${style.iconBg}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {getCategoryIcon(cat)}
                          </span>
                        </span>
                        <span className="truncate">{cat}</span>
                      </div>
                      {isChecked && (
                        <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">
                          check
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {selectedCategories.length === 0 ? (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 bg-red-50 p-2 rounded-lg border border-red-200">
                  <span className="material-symbols-outlined text-[15px]">warning</span>
                  Debes seleccionar al menos una categoría de servicio a contratar para este evento.
                </p>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">
                    check_circle
                  </span>
                  <span>
                    Servicios activos ({selectedCategories.length}):{' '}
                    <strong className="text-slate-900 font-semibold">
                      {selectedCategories.join(', ')}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 3. COTIZACIÓN Y PRESUPUESTO INDEPENDIENTE POR SERVICIO */}
          {selectedCategories.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3. Cotizaciones independientes por servicio
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cada servicio tiene su propio monto presupuestado, adjunto de cotización y especificaciones.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#745B00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 self-start sm:self-auto">
                  {selectedCategories.length} {selectedCategories.length === 1 ? 'fila en la tabla' : 'filas independientes'}
                </span>
              </div>

              {/* Cards por cada servicio seleccionado */}
              <div className="space-y-4">
                {selectedCategories.map((cat, idx) => {
                  const catData = servicesData[cat] || getInitServiceData(cat);
                  const style = getCategoryStyle(cat);
                  const icon = getCategoryIcon(cat);
                  const isDragging = draggingCategory === cat;

                  return (
                    <div
                      key={cat}
                      className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5 relative overflow-hidden"
                    >
                      {/* Top Bar Card */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold ${style.iconBg}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {icon}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {cat}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                · Servicio {idx + 1} de {selectedCategories.length}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Cotización y partida financiera para {cat}
                            </span>
                          </div>
                        </div>

                        {/* Status selector inicial */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase">
                            Estado:
                          </label>
                          <select
                            value={catData.status}
                            onChange={(e) =>
                              updateServiceField(
                                cat,
                                'status',
                                e.target.value as StrictProviderStatus
                              )
                            }
                            className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-[#F2C94C]"
                          >
                            <option value="PROPUESTO">PROPUESTO</option>
                            <option value="SELECCIONADO">SELECCIONADO</option>
                          </select>
                        </div>
                      </div>

                      {/* Inputs: Monto y Código de Cotización */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-700">
                            Monto cotizado para {cat} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
                              S/
                            </span>
                            <input
                              type="text"
                              value={catData.budget}
                              onChange={(e) =>
                                updateServiceField(cat, 'budget', e.target.value)
                              }
                              placeholder="0.00"
                              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 border border-slate-300 rounded-lg text-slate-900 font-bold tabular-nums focus:outline-none focus:border-[#F2C94C] focus:bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-slate-700">
                            Código / N° de cotización
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                              <span className="material-symbols-outlined text-[15px]">
                                tag
                              </span>
                            </span>
                            <input
                              type="text"
                              value={catData.quotationCode}
                              onChange={(e) =>
                                updateServiceField(cat, 'quotationCode', e.target.value)
                              }
                              placeholder="Ej: COT-2026-0814"
                              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-[#F2C94C] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Adjunto de la Cotización específico de este servicio */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Documento de cotización de {cat} (PDF, imagen o contrato preliminar)
                        </label>

                        {!catData.file ? (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDraggingCategory(cat);
                            }}
                            onDragLeave={() => setDraggingCategory(null)}
                            onDrop={(e) => handleServiceDrop(e, cat)}
                            onClick={() => triggerFileUpload(cat)}
                            className={`p-3.5 border-2 border-dashed rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
                              isDragging
                                ? 'border-[#F2C94C] bg-amber-50/60'
                                : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-amber-700 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[18px]">
                                  upload_file
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  Subir cotización de {cat}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  PDF, PNG, JPG, DOCX (hasta 25 MB)
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-[#745B00] bg-white px-2 py-1 rounded-md border border-slate-200">
                              Examinar archivo
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {catData.file.type === 'image' && catData.file.dataUrl ? (
                                <img
                                  src={catData.file.dataUrl}
                                  alt={catData.file.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-amber-200 shrink-0 bg-white"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">
                                    picture_as_pdf
                                  </span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {catData.file.name}
                                </p>
                                <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span className="font-semibold text-slate-700">
                                    {catData.file.size}
                                  </span>
                                  <span>•</span>
                                  <span>Subido: {catData.file.uploadDate}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => triggerFileUpload(cat)}
                                title="Cambiar cotización"
                                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  sync
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveServiceFile(cat)}
                                title="Eliminar archivo"
                                className="p-1 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Especificaciones / Requerimientos de este servicio */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Especificaciones o alcance de {cat}
                        </label>
                        <input
                          type="text"
                          value={catData.notes}
                          onChange={(e) =>
                            updateServiceField(cat, 'notes', e.target.value)
                          }
                          placeholder={`Detalles de ${cat} (ej: cantidad de horas, personal incluido, menú, equipamiento)...`}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C] focus:bg-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen Total Financiero */}
              <div className="bg-[#f0f3ff] border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                    Resumen de contratación
                  </span>
                  <p className="text-xs text-slate-600">
                    Se generarán{' '}
                    <strong className="text-slate-900 font-bold">
                      {selectedCategories.length} {selectedCategories.length === 1 ? 'fila' : 'filas individuales'}
                    </strong>{' '}
                    en la tabla de proveedores del evento.
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Total presupuestado:</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    S/{' '}
                    {totalServicesBudget.toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedCategories.length === 0}
              className={`w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedCategories.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#F2C94C] hover:bg-[#ebc246] active:scale-[0.98] text-slate-950'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">check</span>
              <span>
                Vincular {selectedCategories.length}{' '}
                {selectedCategories.length === 1 ? 'servicio' : 'servicios'}
              </span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
