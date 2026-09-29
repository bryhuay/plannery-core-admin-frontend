'use client';

import React, { useState } from 'react';
import { usePlanery } from '../../context/PlaneryContext';
import { CambiarPasswordModal } from '../../components/modals/CambiarPasswordModal';

export default function PerfilPage() {
  const { showToast } = usePlanery();

  const initialForm = {
    firstName: 'Mariana',
    lastName: 'Cornejo Alarcón',
    email: 'm.cornejo@bodasgalasperu.pe',
    phone: '987 654 321',
    jobTitle: 'Directora de Operaciones & Eventos',
    language: 'Español (Latinoamérica)',
    dateFormat: 'DD/MM/AAAA (ej. 28/09/2026)',
    timezone: 'America/Lima (GMT-5)',
  };

  const [formData, setFormData] = useState(initialForm);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [hasCustomPhoto, setHasCustomPhoto] = useState(true);

  const handleFieldChange = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setHasUnsavedChanges(false);
    showToast('Cambios descartados. Se restauraron los valores originales.');
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    showToast('✓ Perfil actualizado correctamente.');
  };

  const handleCopyUserId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('USR-2026-0819').catch(() => {});
    }
    showToast('ID de usuario USR-2026-0819 copiado al portapapeles.');
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
      {/* BREADCRUMB Y TITULO */}
      <div className="space-y-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#575E70] font-medium mb-1"
        >
          <span className="hover:text-[#151C27] transition-colors cursor-pointer">
            Configuración
          </span>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="text-[#151C27] font-semibold">Mi perfil</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#151C27] tracking-tight font-bold">
              Mi perfil
            </h1>
            <p className="text-sm text-[#575E70] mt-0.5">
              Administra tu información personal y los datos de tu cuenta
            </p>
          </div>

          {/* Alerta sutil integrada */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#D0C5AF]/50 shadow-xs px-4 py-2 rounded-xl text-xs text-[#151C27]">
            <span className="material-symbols-outlined text-[#745B00] text-[18px]">
              check_circle
            </span>
            <span className="font-medium">
              Perfil sincronizado con la organización
            </span>
          </div>
        </div>
      </div>

      {/* GRID DE DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA (TARJETA DE IDENTIDAD Y DATOS DE CUENTA) */}
        <div className="lg:col-span-4 space-y-6">
          {/* TARJETA DE IDENTIDAD */}
          <section className="bg-white rounded-xl border border-[#D0C5AF]/40 p-6 shadow-xs">
            <div className="flex flex-col items-center text-center">
              {/* Avatar circular con badge activo */}
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full ring-4 ring-[#F2C94C]/25 p-1 overflow-hidden bg-[#F0F3FF] shadow-xs flex items-center justify-center">
                  {hasCustomPhoto ? (
                    <img
                      className="w-full h-full object-cover rounded-full"
                      alt="Mariana Cornejo Alarcón"
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#1E222D] text-[#F2C94C] font-bold text-2xl flex items-center justify-center">
                      MC
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-2 bg-white rounded-full p-1 shadow-xs">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                  </span>
                </div>
              </div>

              {/* Nombres y Rol */}
              <h2 className="text-lg font-bold text-[#151C27]">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-xs text-[#575E70] mt-0.5">{formData.email}</p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="bg-[#2A313D] text-[#F9F9FF] px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide">
                  Company Admin
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Cuenta activa
                </span>
              </div>

              {/* Empresa Asociada */}
              <div className="w-full mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
                <span className="text-[11px] text-[#575E70] uppercase tracking-wider font-semibold">
                  Organización asociada
                </span>
                <span className="text-xs font-semibold text-[#151C27] mt-1">
                  Bodas &amp; Galas Perú S.A.C.
                </span>
              </div>

              {/* Acciones de Foto */}
              <div className="w-full mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasCustomPhoto(true);
                    showToast('Fotografía corporativa actualizada.');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F0F3FF]/80 hover:bg-[#E7EEFE] border border-[#D0C5AF]/50 rounded-xl text-xs font-semibold text-[#151C27] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    photo_camera
                  </span>
                  <span>Cambiar foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasCustomPhoto(false);
                    showToast(
                      'Fotografía eliminada. Se muestran tus iniciales.',
                      'warning'
                    );
                  }}
                  className="text-xs text-[#575E70] hover:text-rose-600 transition-colors py-1 font-medium cursor-pointer"
                >
                  Eliminar foto
                </button>
              </div>
            </div>
          </section>

          {/* INFORMACIÓN DE LA CUENTA (SOLO LECTURA) */}
          <section className="bg-white rounded-xl border border-[#D0C5AF]/40 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-bold text-[#151C27]">
                Datos de la cuenta
              </span>
              <span className="material-symbols-outlined text-[#575E70] text-[18px]">
                lock
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* ID de Usuario */}
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  ID de usuario
                </span>
                <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-[#F0F3FF]/80 border border-slate-200/80">
                  <span className="font-mono text-xs text-[#151C27] font-semibold">
                    USR-2026-0819
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUserId}
                    title="Copiar ID"
                    className="text-[#575E70] hover:text-[#151C27] p-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>

              {/* Rol Asignado */}
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Rol asignado
                </span>
                <div className="mt-1">
                  <span className="text-xs font-semibold text-[#151C27] block">
                    Company Admin
                  </span>
                  <span className="text-[11px] text-[#575E70]">
                    Asignado por la plataforma Planery Core
                  </span>
                </div>
              </div>

              {/* Organización / Tenant */}
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Organización / Tenant
                </span>
                <div className="mt-1">
                  <span className="text-xs font-semibold text-[#151C27] block">
                    Bodas &amp; Galas Perú S.A.C.
                  </span>
                  <span className="text-[11px] text-[#575E70] font-mono">
                    RUC: 20608945123
                  </span>
                </div>
              </div>

              {/* Fecha de Creación */}
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Fecha de alta
                </span>
                <span className="text-xs font-semibold text-[#151C27] mt-1 block">
                  15 de Enero de 2026
                </span>
              </div>

              {/* Estado de cuenta */}
              <div>
                <span className="text-[11px] text-[#575E70] block">
                  Estado de membresía
                </span>
                <span className="text-xs font-semibold text-emerald-700 mt-1 block">
                  Activo y Verificado
                </span>
              </div>
            </div>

            {/* Nota sutil protegida */}
            <div className="p-3 rounded-xl bg-[#F0F3FF]/60 border border-slate-200/80 flex gap-2.5 items-start mt-2">
              <span className="material-symbols-outlined text-[#575E70] text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <p className="text-[11px] text-[#575E70] leading-relaxed">
                Estos datos son administrados por el sistema y no pueden ser modificados directamente. Para traslados de tenant, contacta al soporte técnico.
              </p>
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA (FORMULARIOS, PREFERENCIAS Y SEGURIDAD) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECCIÓN: INFORMACIÓN PERSONAL */}
          <section className="bg-white rounded-xl border border-[#D0C5AF]/40 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745B00] text-[22px]">
                badge
              </span>
              <div>
                <h3 className="text-base font-bold text-[#151C27]">
                  Información personal
                </h3>
                <p className="text-xs text-[#575E70]">
                  Actualiza tus nombres visibles y tus datos de contacto corporativo
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <div className="space-y-1">
                  <label className="text-xs text-[#151C27] font-semibold flex items-center gap-1">
                    Nombres <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFieldChange('firstName', e.target.value)
                    }
                    className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all font-medium"
                  />
                  <span className="text-[11px] text-[#575E70] block">
                    Tu primer y segundo nombre legal
                  </span>
                </div>

                {/* Apellidos */}
                <div className="space-y-1">
                  <label className="text-xs text-[#151C27] font-semibold flex items-center gap-1">
                    Apellidos <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFieldChange('lastName', e.target.value)
                    }
                    className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all font-medium"
                  />
                  <span className="text-[11px] text-[#575E70] block">
                    Apellidos paterno y materno
                  </span>
                </div>
              </div>

              {/* Correo electrónico corporativo */}
              <div className="space-y-1">
                <label className="text-xs text-[#151C27] font-semibold flex items-center gap-1">
                  Correo electrónico corporativo{' '}
                  <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleFieldChange('email', e.target.value)
                    }
                    className="w-full bg-white pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all font-medium"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#575E70] text-[18px]">
                    mail
                  </span>
                </div>

                {/* Banner / Nota informativa del correo */}
                <div className="mt-2 p-3 rounded-xl bg-[#F0F3FF]/60 border border-slate-200 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#745B00] text-[18px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <p className="text-[11px] text-[#4D4635] leading-relaxed">
                    El cambio de correo corporativo requiere confirmación mediante un enlace de verificación enviado a la nueva dirección antes de reflejarse en los registros de auditoría.
                  </p>
                </div>
              </div>

              {/* Teléfono y Cargo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Teléfono con selector de país */}
                <div className="space-y-1">
                  <label className="text-xs text-[#151C27] font-semibold flex items-center gap-1">
                    Teléfono{' '}
                    <span className="text-[#575E70] font-normal text-[11px]">
                      (opcional)
                    </span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-[#F0F3FF] text-xs text-[#151C27] font-medium">
                      🇵🇪 +51
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleFieldChange('phone', e.target.value)
                      }
                      className="w-full bg-white px-3.5 py-2 rounded-r-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all font-medium"
                    />
                  </div>
                  <span className="text-[11px] text-[#575E70] block">
                    Número móvil para notificaciones críticas
                  </span>
                </div>

                {/* Cargo / Puesto */}
                <div className="space-y-1">
                  <label className="text-xs text-[#151C27] font-semibold flex items-center gap-1">
                    Cargo / Puesto{' '}
                    <span className="text-[#575E70] font-normal text-[11px]">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleFieldChange('jobTitle', e.target.value)
                    }
                    className="w-full bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20 transition-all font-medium"
                  />
                  <span className="text-[11px] text-[#575E70] block">
                    Visible en órdenes de compra y contratos
                  </span>
                </div>
              </div>
            </form>
          </section>

          {/* SECCIÓN: PREFERENCIAS REGIONALES */}
          <section className="bg-white rounded-xl border border-[#D0C5AF]/40 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745B00] text-[22px]">
                tune
              </span>
              <div>
                <h3 className="text-base font-bold text-[#151C27]">
                  Preferencias regionales
                </h3>
                <p className="text-xs text-[#575E70]">
                  Ajusta los formatos de visualización y zona geográfica para la agenda
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Idioma */}
              <div className="space-y-1">
                <label className="text-xs text-[#151C27] font-semibold block">
                  Idioma de la interfaz
                </label>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      handleFieldChange('language', e.target.value)
                    }
                    className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] font-medium"
                  >
                    <option>Español (Latinoamérica)</option>
                    <option>English (United States)</option>
                    <option>Português (Brasil)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#575E70] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Formato de Fecha */}
              <div className="space-y-1">
                <label className="text-xs text-[#151C27] font-semibold block">
                  Formato de fecha
                </label>
                <div className="relative">
                  <select
                    value={formData.dateFormat}
                    onChange={(e) =>
                      handleFieldChange('dateFormat', e.target.value)
                    }
                    className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] font-medium"
                  >
                    <option>DD/MM/AAAA (ej. 28/09/2026)</option>
                    <option>AAAA-MM-DD (ej. 2026-09-28)</option>
                    <option>MM/DD/AAAA (ej. 09/28/2026)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#575E70] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Zona Horaria */}
              <div className="space-y-1">
                <label className="text-xs text-[#151C27] font-semibold block">
                  Zona horaria
                </label>
                <div className="relative">
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      handleFieldChange('timezone', e.target.value)
                    }
                    className="w-full appearance-none bg-white px-3 py-2 pr-8 rounded-xl border border-slate-300 text-xs text-[#151C27] focus:outline-none focus:border-[#F2C94C] font-medium"
                  >
                    <option>America/Lima (GMT-5)</option>
                    <option>America/Bogota (GMT-5)</option>
                    <option>America/Santiago (GMT-4)</option>
                    <option>America/Mexico_City (GMT-6)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#575E70] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN: SEGURIDAD DE LA CUENTA */}
          <section className="bg-white rounded-xl border border-[#D0C5AF]/40 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-[#745B00] text-[22px]">
                security
              </span>
              <div>
                <h3 className="text-base font-bold text-[#151C27]">
                  Seguridad de la cuenta
                </h3>
                <p className="text-xs text-[#575E70]">
                  Control de credenciales de acceso y autenticación corporativa
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F0F3FF]/70 border border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#151C27]">
                    Contraseña de acceso
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Contraseña segura activa
                  </span>
                </div>
                <p className="text-xs text-[#575E70]">
                  Última actualización: hace 3 meses (12 de Junio de 2026)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-[#151C27] transition-all shadow-2xs shrink-0 active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  lock_reset
                </span>
                <span>Cambiar contraseña</span>
              </button>
            </div>
          </section>

          {/* BARRA / FOOTER DE ACCIONES DEL FORMULARIO */}
          <div className="bg-white rounded-xl border border-[#D0C5AF]/50 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-10">
            <div className="flex items-center gap-2 text-[#151C27] font-medium text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasUnsavedChanges ? 'bg-[#F2C94C]' : 'bg-emerald-500'
                }`}
              />
              <span className="text-[#575E70] text-xs">
                {hasUnsavedChanges
                  ? 'Tienes cambios pendientes sin guardar'
                  : 'Todos los cambios están guardados'}
              </span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#151C27] transition-all cursor-pointer"
              >
                Cancelar cambios
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#F2C94C] hover:brightness-105 active:scale-98 text-[#241A00] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      <CambiarPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
