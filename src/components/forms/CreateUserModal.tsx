'use client';

import React, { useState } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { PlatformUserRole } from '../../types/planery';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { companies, addPlatformUser, showToast } = usePlanery();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyId, setCompanyId] = useState(
    companies[0]?.id || 'EMP-2026-0042'
  );
  const [selectedRole, setSelectedRole] =
    useState<PlatformUserRole>('Company Admin');
  const [sendInvite, setSendInvite] = useState(true);
  const [activateImmediately, setActivateImmediately] = useState(true);

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.id === companyId);

  const roleCapabilities: Record<
    Exclude<PlatformUserRole, 'Super Admin'>,
    string[]
  > = {
    'Company Admin': [
      'Gestión de Eventos',
      'Módulo Proveedores',
      'Reportes y Pagos',
      'Invitar Miembros',
    ],
    Planner: [
      'Gestión de Eventos Asignados',
      'Coordinación Proveedores',
      'Control de Tareas e Hitos',
      'Subida de Documentos',
    ],
    Client: [
      'Portal de Invitados (Lectura)',
      'Cronograma en Vivo',
      'Estado de Pagos y Presupuesto',
      'Aprobación de Hitos',
    ],
  };

  const currentCapabilities =
    selectedRole === 'Super Admin'
      ? roleCapabilities['Company Admin']
      : roleCapabilities[selectedRole];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast('Por favor completa los campos obligatorios (*).', 'warning');
      return;
    }

    addPlatformUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() ? `+51 ${phone.trim()}` : '+51 987 654 321',
      companyId,
      role: selectedRole,
      sendInvite,
      activateImmediately,
    });

    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
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
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-4xl mx-4 sm:mx-auto bg-white rounded-xl shadow-2xl border border-[#DCE2F3] flex flex-col max-h-[92vh] z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#DCE2F3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E7EEFE] flex items-center justify-center text-[#745B00]">
              <span className="material-symbols-outlined text-[22px]">
                person_add
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#151C27] tracking-tight">
                Crear nuevo usuario
              </h2>
              <p className="text-xs text-[#575E70]">
                Registra un usuario y envía una invitación por correo para acceder a Planery Core.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#575E70] hover:text-[#151C27] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 sm:p-8 overflow-y-auto space-y-7 flex-1">
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#745B00] text-[18px]">
                  badge
                </span>
                <h3 className="text-xs text-[#151C27] uppercase tracking-wider font-bold">
                  1. Datos Personales
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="crear-usr-nombres"
                    className="block text-xs text-[#4D4635] mb-1 font-semibold"
                  >
                    Nombres <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="crear-usr-nombres"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ej. Carlos"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="crear-usr-apellidos"
                    className="block text-xs text-[#4D4635] mb-1 font-semibold"
                  >
                    Apellidos <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="crear-usr-apellidos"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ej. Mendoza Ríos"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="crear-usr-email"
                    className="block text-xs text-[#4D4635] mb-1 font-semibold"
                  >
                    Correo electrónico institucional{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                      mail
                    </span>
                    <input
                      id="crear-usr-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="carlos.mendoza@empresa.pe"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#575E70] mt-1">
                    El usuario recibirá un correo con el token seguro para activar su cuenta.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="crear-usr-telefono"
                    className="block text-xs text-[#4D4635] mb-1 font-semibold"
                  >
                    Teléfono móvil / corporativo
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-[#F0F3FF] text-[#575E70] text-xs font-semibold">
                      🇵🇪 +51
                    </span>
                    <input
                      id="crear-usr-telefono"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="987 654 321"
                      className="w-full bg-white border border-slate-300 rounded-r-xl px-3.5 py-2.5 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: ASIGNACIÓN DE EMPRESA Y TENANT */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#745B00] text-[18px]">
                  domain
                </span>
                <h3 className="text-xs text-[#151C27] uppercase tracking-wider font-bold">
                  2. Asignación de Empresa y Tenant
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="crear-usr-empresa"
                    className="block text-xs text-[#4D4635] mb-1 font-semibold"
                  >
                    Seleccionar Organización / Empresa cliente{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="crear-usr-empresa"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all"
                  >
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.commercialName}
                      </option>
                    ))}
                    <option value="plataforma">
                      -- Usuario Interno de Plataforma (Staff / Auditoría) --
                    </option>
                  </select>
                </div>

                {/* Tarjeta de metadatos del tenant seleccionado */}
                <div className="p-3.5 bg-[#F0F3FF]/70 rounded-xl border border-[#DCE2F3] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E2E8F8] flex items-center justify-center text-[#745B00] font-bold text-xs">
                      {companyId === 'plataforma'
                        ? 'PC'
                        : selectedCompany?.commercialName
                            .slice(0, 2)
                            .toUpperCase() || 'BG'}
                    </div>
                    <div>
                      <div className="font-semibold text-[#151C27]">
                        {companyId === 'plataforma'
                          ? 'Planery Core — Infraestructura Global'
                          : selectedCompany?.commercialName ||
                            'Bodas & Galas Perú S.A.C.'}
                      </div>
                      <div className="text-[#575E70] font-mono text-[11px]">
                        {companyId === 'plataforma'
                          ? 'Tenant Corporativo Interno • Nivel Plataforma'
                          : `RUC: ${
                              selectedCompany?.ruc || '20608945123'
                            } • Plan ${
                              selectedCompany?.plan || 'Empresarial'
                            } • Lima, Perú`}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{' '}
                    Tenant Activo
                  </span>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: ROL Y PERMISOS DE ACCESO */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#745B00] text-[18px]">
                  verified_user
                </span>
                <h3 className="text-xs text-[#151C27] uppercase tracking-wider font-bold">
                  3. Rol y Permisos de Acceso
                </h3>
              </div>

              {/* RBAC Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {/* Company Admin */}
                <label
                  onClick={() => setSelectedRole('Company Admin')}
                  className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'Company Admin'
                      ? 'border-2 border-[#F2C94C] bg-[#FEFBF0]/60 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        selectedRole === 'Company Admin'
                          ? 'bg-[#F2C94C]/25 text-[#6B5400]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        admin_panel_settings
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="rol"
                      checked={selectedRole === 'Company Admin'}
                      onChange={() => setSelectedRole('Company Admin')}
                      className="w-4 h-4 accent-[#F2C94C]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#151C27] mb-1">
                    Company Admin
                  </span>
                  <p className="text-[11px] text-[#575E70] leading-snug">
                    Control total sobre eventos, catálogo de proveedores, finanzas y usuarios de la empresa.
                  </p>
                </label>

                {/* Planner */}
                <label
                  onClick={() => setSelectedRole('Planner')}
                  className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'Planner'
                      ? 'border-2 border-[#F2C94C] bg-[#FEFBF0]/60 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        selectedRole === 'Planner'
                          ? 'bg-[#F2C94C]/25 text-[#6B5400]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        event_available
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="rol"
                      checked={selectedRole === 'Planner'}
                      onChange={() => setSelectedRole('Planner')}
                      className="w-4 h-4 accent-[#F2C94C]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#151C27] mb-1">
                    Planner
                  </span>
                  <p className="text-[11px] text-[#575E70] leading-snug">
                    Coordinador de eventos asignados, actualización de hitos, tareas y contacto con proveedores.
                  </p>
                </label>

                {/* Client */}
                <label
                  onClick={() => setSelectedRole('Client')}
                  className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                    selectedRole === 'Client'
                      ? 'border-2 border-[#F2C94C] bg-[#FEFBF0]/60 shadow-xs'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        selectedRole === 'Client'
                          ? 'bg-[#F2C94C]/25 text-[#6B5400]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        person
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="rol"
                      checked={selectedRole === 'Client'}
                      onChange={() => setSelectedRole('Client')}
                      className="w-4 h-4 accent-[#F2C94C]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#151C27] mb-1">
                    Client
                  </span>
                  <p className="text-[11px] text-[#575E70] leading-snug">
                    Acceso de sólo lectura y aprobaciones al portal de invitados, cronograma y estados de pago.
                  </p>
                </label>
              </div>

              {/* Alerta Informativa RBAC Super Admin */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <span className="font-bold">
                    Política de Seguridad Planery Core:{' '}
                  </span>
                  El rol{' '}
                  <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded text-[11px]">
                    Super Admin
                  </code>{' '}
                  se encuentra protegido bajo doble factor corporativo y solo puede ser concedido o revocado desde la consola de infraestructura en la nube.
                </div>
              </div>

              {/* Resumen de Permisos Asignados */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-[#575E70] uppercase tracking-wider block mb-2">
                  Matriz de capacidades para este rol:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {currentCapabilities.map((cap) => (
                    <div
                      key={cap}
                      className="flex items-center gap-1.5 text-[#151C27]"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">
                        check_circle
                      </span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECCIÓN 4: OPCIONES DE INVITACIÓN Y SEGURIDAD */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#745B00] text-[18px]">
                  forward_to_inbox
                </span>
                <h3 className="text-xs text-[#151C27] uppercase tracking-wider font-bold">
                  4. Opciones de Invitación y Seguridad
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendInvite}
                    onChange={(e) => setSendInvite(e.target.checked)}
                    className="mt-0.5 rounded accent-[#F2C94C] w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#151C27] block">
                      Enviar correo de invitación con enlace seguro de configuración de contraseña
                    </span>
                    <span className="text-[#575E70] text-[11px]">
                      El enlace tendrá una vigencia máxima de 48 horas bajo protocolo TLS 1.3.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activateImmediately}
                    onChange={(e) => setActivateImmediately(e.target.checked)}
                    className="mt-0.5 rounded accent-[#F2C94C] w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#151C27] block">
                      Activar usuario inmediatamente tras validación de correo
                    </span>
                    <span className="text-[#575E70] text-[11px]">
                      Habilita el inicio de sesión automático una vez confirmada la clave personal.
                    </span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Modal Footer */}
          <div className="px-6 sm:px-8 py-4 bg-[#F0F3FF]/60 border-t border-[#DCE2F3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#575E70] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Acción auditada bajo sesión Super Admin</span>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-semibold text-xs text-[#151C27] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-[#F2C94C] hover:bg-[#e0b83b] font-bold text-xs text-[#1E222D] flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
                <span>Crear y enviar invitación</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
