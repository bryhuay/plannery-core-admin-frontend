'use client';

import React, { useState } from 'react';
import { DocumentType } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface UploadDocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export const UploadDocumentDrawer: React.FC<UploadDocumentDrawerProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const { uploadDocument } = usePlanery();

  const [fileName, setFileName] = useState(
    'Contrato_Catering_Gourmet_Del_Sur_vFinal.pdf'
  );
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [docType, setDocType] = useState<DocumentType>('Contrato');
  const [category, setCategory] = useState('Catering');
  const [relatedProvider, setRelatedProvider] = useState(
    'Catering Gourmet Del Sur'
  );
  const [relatedPayment, setRelatedPayment] = useState(
    'Adelanto catering reserva 50% - S/ 10,000.00'
  );
  const [description, setDescription] = useState(
    'Contrato firmado electrónicamente por ambas partes con anexo de menú de 4 tiempos y menajería.'
  );

  if (!isOpen) return null;

  const handleFileSimulatedPick = () => {
    const samples = [
      { name: 'Anexo_Menu_Cocteleria_Gourmet_2026.pdf', size: '1.9 MB' },
      { name: 'Poliza_Responsabilidad_Civil_Hacienda.pdf', size: '3.1 MB' },
      { name: 'Cotizacion_Iluminacion_AndinoPro.pdf', size: '1.4 MB' },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setFileName(picked.name);
    setFileSize(picked.size);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const iconMap: Record<DocumentType, { icon: string; bg: string }> = {
      Contrato: {
        icon: 'picture_as_pdf',
        bg: 'bg-rose-50 text-rose-600 border-rose-200/60',
      },
      Comprobante: {
        icon: 'receipt_long',
        bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
      },
      Cotización: {
        icon: 'description',
        bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      },
      'Técnico / Plano': {
        icon: 'architecture',
        bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
      },
      'Documento del cliente': {
        icon: 'assignment_turned_in',
        bg: 'bg-pink-50 text-pink-700 border-pink-200/60',
      },
      Otro: {
        icon: 'folder',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
      },
    };

    const visual = iconMap[docType] || iconMap.Contrato;

    uploadDocument({
      eventId,
      fileName: fileName.trim(),
      fileSize,
      fileFormat: 'PDF',
      type: docType,
      category,
      relatedTo:
        relatedProvider === 'Ninguno' ? relatedPayment : relatedProvider,
      relatedSubtext: category,
      uploadDate: 'Hoy, 28 Oct 2026',
      uploadedBy: 'Jerson Huayta (Planner)',
      verified: docType === 'Contrato',
      icon: visual.icon,
      iconBg: visual.bg,
      description,
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
        aria-labelledby="drawer-subir-documento-title"
        className="fixed inset-y-0 right-0 w-full max-w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
          <div className="space-y-1">
            <h3
              id="drawer-subir-documento-title"
              className="text-base font-bold text-slate-900 leading-snug"
            >
              Subir documento
            </h3>
            <p className="text-xs text-slate-500">
              Agrega un documento relacionado con este evento.
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
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll"
        >
          {/* Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Archivo <span className="text-rose-500">*</span>
            </label>
            <div
              onClick={handleFileSimulatedPick}
              className="border-2 border-dashed border-[#F2C94C] bg-amber-50/20 hover:bg-amber-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#f2c94c]/20 text-[#6b5400] mx-auto flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">
                  cloud_upload
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                Arrastra tu archivo aquí o{' '}
                <span className="text-[#6b5400] underline font-bold">
                  Seleccionar archivo
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDF, JPG, PNG, DOCX o XLSX hasta 15MB
              </p>
            </div>

            {/* Selected File Preview */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-[#E5E7EB]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    picture_as_pdf
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {fileName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">
                        check_circle
                      </span>{' '}
                      Archivo listo
                    </span>
                    <span>·</span>
                    <span>{fileSize}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFileSimulatedPick}
                title="Cambiar archivo"
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            </div>
          </div>

          {/* Nombre del documento */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Nombre del documento <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Ej. Contrato de locación firmado"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          {/* Tipo y Categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Tipo de documento <span className="text-rose-500">*</span>
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Contrato">Contrato</option>
                <option value="Comprobante">Comprobante</option>
                <option value="Cotización">Cotización</option>
                <option value="Documento del cliente">
                  Documento del cliente
                </option>
                <option value="Técnico / Plano">Técnico / Plano</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Categoría relacionada
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Catering">Catering</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Decoración">Decoración</option>
                <option value="Música">Música & Sonido</option>
                <option value="Venue">Venue / Local</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Proveedor relacionado */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Proveedor relacionado (opcional)
            </label>
            <select
              value={relatedProvider}
              onChange={(e) => setRelatedProvider(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Catering Gourmet Del Sur">
                Catering Gourmet Del Sur
              </option>
              <option value="Visual Studio Arequipa">
                Visual Studio Arequipa
              </option>
              <option value="DecoFlor Arequipa">DecoFlor Arequipa</option>
              <option value="DJ & Orquesta Sabor Real">
                DJ & Orquesta Sabor Real
              </option>
              <option value="Ninguno">Ninguno (Documento general)</option>
            </select>
          </div>

          {/* Pago relacionado */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Pago relacionado (opcional)
            </label>
            <select
              value={relatedPayment}
              onChange={(e) => setRelatedPayment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Adelanto catering reserva 50% - S/ 10,000.00">
                Adelanto catering reserva 50% - S/ 10,000.00
              </option>
              <option value="Segundo abono menajería y banquete - S/ 5,000.00">
                Segundo abono menajería y banquete - S/ 5,000.00
              </option>
              <option value="Ninguno">Ninguno</option>
            </select>
          </div>

          {/* Descripción o notas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Descripción o notas
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade notas sobre cláusulas, penalidades o aprobaciones..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          {/* Sticky Footer */}
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
              <span>Subir documento</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
