'use client';

import React, { useState, useEffect } from 'react';
import {
  PlatformCompany,
  PlatformCompanyPlan,
  PlatformCompanyStatus,
} from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface CompanyFormModalProps {
  isOpen: boolean;
  companyToEdit?: PlatformCompany | null;
  onClose: () => void;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  companyToEdit,
  onClose,
}) => {
  const { addPlatformCompany, updatePlatformCompany, showToast } = usePlanery();

  const [commercialName, setCommercialName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [categorySubtext, setCategorySubtext] = useState('');
  const [ruc, setRuc] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [plan, setPlan] = useState<PlatformCompanyPlan>('Profesional');
  const [status, setStatus] = useState<PlatformCompanyStatus>('Activa');

  useEffect(() => {
    if (companyToEdit) {
      setCommercialName(companyToEdit.commercialName);
      setLegalName(companyToEdit.legalName);
      setCategorySubtext(companyToEdit.categorySubtext);
      setRuc(companyToEdit.ruc);
      setEmail(companyToEdit.email);
      setPhone(companyToEdit.phone);
      setAddress(companyToEdit.address);
      setAdminName(companyToEdit.adminName);
      setAdminEmail(companyToEdit.adminEmail);
      setPlan(companyToEdit.plan);
      setStatus(companyToEdit.status);
    } else {
      setCommercialName('');
      setLegalName('');
      setCategorySubtext('Organización de eventos & bodas');
      setRuc('');
      setEmail('');
      setPhone('+51 ');
      setAddress('');
      setAdminName('');
      setAdminEmail('');
      setPlan('Profesional');
      setStatus('Activa');
    }
  }, [companyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialName.trim() || !ruc.trim() || !adminName.trim()) {
      showToast('Completa los campos obligatorios (*).', 'warning');
      return;
    }

    const feeMap: Record<PlatformCompanyPlan, number> = {
      Starter: 180,
      Profesional: 350,
      Enterprise: 890,
      'Sin plan': 0,
    };

    const words = adminName.trim().split(/\s+/);
    const adminInitials =
      words.length > 1
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : adminName.slice(0, 2).toUpperCase();

    if (companyToEdit) {
      updatePlatformCompany(companyToEdit.id, {
        commercialName: commercialName.trim(),
        legalName: legalName.trim() || commercialName.trim(),
        categorySubtext: categorySubtext.trim(),
        ruc: ruc.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
        adminInitials,
        plan,
        monthlyFee: feeMap[plan],
        status,
      });
    } else {
      addPlatformCompany({
        commercialName: commercialName.trim(),
        legalName: legalName.trim() || `${commercialName.trim()} S.A.C.`,
        categorySubtext:
          categorySubtext.trim() || 'Organización de eventos corporativos',
        ruc: ruc.trim(),
        taxStatus: 'Habido / Activo',
        timezone: 'America/Lima (UTC-5)',
        email: email.trim() || 'contacto@empresa.pe',
        phone: phone.trim() || '+51 987 654 321',
        address: address.trim() || 'Lima, Perú',
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim() || 'admin@empresa.pe',
        adminInitials,
        plan,
        billingCycle: 'Mensual',
        monthlyFee: feeMap[plan],
        nextRenewal: '28 Oct 2026',
        status,
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-4 sm:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#745B00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                domain_add
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151C27]">
                {companyToEdit
                  ? 'Editar organización'
                  : 'Registrar nueva empresa'}
              </h3>
              <p className="text-xs text-[#575E70]">
                Configura los datos fiscales, tenant y administrador principal en Planery Core.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Nombre comercial <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="Ej. Bodas & Galas Perú S.A.C."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                RUC (11 dígitos) <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="Ej. 20608912345"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#151C27] mb-1">
                Razón social completa
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Ej. Bodas y Galas Eventos Perú Sociedad Anónima Cerrada"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Rubro / Especialidad
              </label>
              <input
                type="text"
                value={categorySubtext}
                onChange={(e) => setCategorySubtext(e.target.value)}
                placeholder="Organización de eventos & bodas"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Teléfono corporativo
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 984 551 220"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Correo de contacto
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contacto@empresa.pe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Dirección fiscal
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. El Polo 670, Surco, Lima"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Administrador principal <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Ej. Mariana Cornejo"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Correo del administrador <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="m.cornejo@empresa.pe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F2C94C]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Plan asignado
              </label>
              <select
                value={plan}
                onChange={(e) =>
                  setPlan(e.target.value as PlatformCompanyPlan)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Starter">Starter (S/ 180 / mes)</option>
                <option value="Profesional">Profesional (S/ 350 / mes)</option>
                <option value="Enterprise">Enterprise (S/ 890 / mes)</option>
                <option value="Sin plan">Sin plan</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#151C27] mb-1">
                Estado del tenant
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as PlatformCompanyStatus)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#F2C94C]"
              >
                <option value="Activa">Activa</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Suspendida">Suspendida</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#F2C94C] hover:bg-[#e0b83b] text-[#241A00] font-bold shadow-xs cursor-pointer"
            >
              {companyToEdit ? 'Guardar cambios' : 'Crear empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
