'use client';

import React, { useState } from 'react';
import { PaymentStatus } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface RegisterPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export const RegisterPaymentDrawer: React.FC<RegisterPaymentDrawerProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const { registerPayment } = usePlanery();

  const [providerName, setProviderName] = useState(
    'Catering Gourmet Del Sur'
  );
  const [concept, setConcept] = useState(
    'Segundo abono menajería y banquete'
  );
  const [category, setCategory] = useState('Catering');
  const [amount, setAmount] = useState('5000.00');
  const [date, setDate] = useState('2026-11-05');
  const [method, setMethod] = useState('Transferencia bancaria');
  const [status, setStatus] = useState<PaymentStatus>('Pagado');
  const [notes, setNotes] = useState('');
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    if (!concept.trim() || numericAmount <= 0) return;

    const categoryIconMap: Record<string, { icon: string; bg: string }> = {
      Catering: {
        icon: 'restaurant',
        bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
      },
      Fotografía: {
        icon: 'photo_camera',
        bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      },
      Decoración: {
        icon: 'local_florist',
        bg: 'bg-pink-50 text-pink-700 border-pink-200/60',
      },
      'Música & Sonido': {
        icon: 'music_note',
        bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
      },
      Venue: {
        icon: 'location_city',
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
      },
    };

    const visual = categoryIconMap[category] || categoryIconMap.Catering;

    registerPayment({
      eventId,
      eventName: 'Boda de María y Carlos',
      providerName,
      providerRuc: '20601839201',
      concept: concept.trim(),
      category,
      icon: visual.icon,
      iconBg: visual.bg,
      amount: numericAmount,
      date: '05 Nov 2026',
      method,
      methodIcon:
        method === 'Tarjeta de crédito'
          ? 'credit_card'
          : method === 'Yape / Plin'
          ? 'phone_android'
          : 'account_balance',
      status,
      notes,
    });

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
        aria-labelledby="drawer-registrar-pago-title"
        className="fixed inset-y-0 right-0 w-full max-w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E5E7EB]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-start justify-between bg-white shrink-0">
          <div className="space-y-1">
            <h3
              id="drawer-registrar-pago-title"
              className="text-base font-bold text-slate-900 leading-snug"
            >
              Registrar pago
            </h3>
            <p className="text-xs text-slate-500">
              Registra un nuevo pago asociado a un proveedor del evento.
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll"
        >
          {/* Proveedor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Proveedor <span className="text-rose-500">*</span>
            </label>
            <select
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Catering Gourmet Del Sur">
                Catering Gourmet Del Sur
              </option>
              <option value="Visual Studio Arequipa">
                Visual Studio Arequipa
              </option>
              <option value="Flores & Ambientes Perú">
                Flores & Ambientes Perú
              </option>
              <option value="DJ & Orquesta Sabor Real">
                DJ & Orquesta Sabor Real
              </option>
              <option value="Hacienda El Carmen">Hacienda El Carmen</option>
            </select>
          </div>

          {/* Concepto */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Concepto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ej. Adelanto del servicio, saldo final, reserva..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            />
          </div>

          {/* Categoría y Monto */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Catering">Catering</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Decoración">Decoración</option>
                <option value="Música & Sonido">Música & Sonido</option>
                <option value="Venue">Venue / Local</option>
                <option value="Transporte">Transporte</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Monto <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                  S/
                </span>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 font-semibold tabular-nums focus:outline-none focus:border-[#F2C94C]"
                />
              </div>
            </div>
          </div>

          {/* Fecha y Método */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Fecha de pago <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Método de pago <span className="text-rose-500">*</span>
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Transferencia bancaria">
                  Transferencia bancaria
                </option>
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape / Plin">Yape / Plin</option>
              </select>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Estado <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Programado">Programado</option>
            </select>
          </div>

          {/* Comprobante Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Comprobante
            </label>
            <div
              onClick={() =>
                setReceiptFileName('Voucher_Operacion_BCP_592014.pdf')
              }
              className="border-2 border-dashed border-slate-200 hover:border-[#F2C94C] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-500 mb-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  cloud_upload
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800">
                {receiptFileName
                  ? `Archivo adjunto: ${receiptFileName}`
                  : 'Adjunta el comprobante del pago'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, PNG o JPG hasta 5MB
              </p>
            </div>
          </div>

          {/* Notas opcionales */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Notas opcionales
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones del pago, número de operación bancaria..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-slate-900 focus:outline-none focus:border-[#F2C94C]"
            />
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
              <span>Registrar pago</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
