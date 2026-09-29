'use client';

import React, { useState } from 'react';
import { TaskPriority } from '../../types/planery';
import { usePlanery } from '../../context/PlaneryContext';

export interface CreateTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export const CreateTaskDrawer: React.FC<CreateTaskDrawerProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const { addTask } = usePlanery();

  const [title, setTitle] = useState(
    'Degustación y selección de cóctel de bienvenida'
  );
  const [description, setDescription] = useState(
    'Coordinar con el barman principal la carta de 3 cócteles de autor (Pisco Sour macerado, Gin botánico y Mocktail de frutos rojos).'
  );
  const [assignee, setAssignee] = useState('Jerson Huayta — Planner líder');
  const [dueDate, setDueDate] = useState('28 Oct 2026');
  const [dueTime, setDueTime] = useState('16:00');
  const [priority, setPriority] = useState<TaskPriority>('Media');
  const [relatedProvider, setRelatedProvider] = useState(
    'Catering Gourmet Del Sur'
  );
  const [budgetCategory, setBudgetCategory] = useState(
    'Catering & Coctelería'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const isMaria = assignee.includes('María');
    const isCarlos = assignee.includes('Carlos');

    addTask({
      eventId,
      eventName: 'Boda de María y Carlos',
      title: title.trim(),
      description: description.trim(),
      relation: budgetCategory.split(' ')[0] || 'Catering',
      relationColor: 'bg-amber-50 text-amber-800 border-amber-200',
      assigneeName: isMaria
        ? 'María López'
        : isCarlos
        ? 'Carlos Mendoza'
        : 'Jerson Huayta',
      assigneeRole: isMaria ? 'Cliente' : isCarlos ? 'Admin' : 'Planner',
      assigneeInitials: isMaria ? 'ML' : isCarlos ? 'CM' : 'JH',
      assigneeColor: isMaria
        ? 'bg-pink-600 text-white'
        : isCarlos
        ? 'bg-slate-600 text-white'
        : 'bg-slate-800 text-white',
      dueDate,
      dueTime,
      relativeDue: 'En 10 días',
      isOverdue: false,
      priority,
      status: 'Pendiente',
      completed: false,
      relatedProvider,
      budgetCategory,
    });

    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[460px] bg-white shadow-2xl overflow-y-auto flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">
                playlist_add
              </span>
              <h3 className="text-lg font-bold text-gray-900">Crear tarea</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Agrega una tarea para organizar este evento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar panel"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll"
        >
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Título de la tarea <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añadir notas, requerimientos o detalles específicos..."
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C] focus:ring-2 focus:ring-[#F2C94C]/20"
            />
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Responsable <span className="text-red-500">*</span>
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Jerson Huayta — Planner líder">
                Jerson Huayta — Planner líder
              </option>
              <option value="María López — Cliente">
                María López — Cliente
              </option>
              <option value="Carlos Mendoza — Coordinador">
                Carlos Mendoza — Coordinador
              </option>
            </select>
          </div>

          {/* Fecha límite y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Fecha límite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C]"
                />
                <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[18px]">
                    calendar_today
                  </span>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Hora
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C]"
                />
                <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Alta', 'Media', 'Baja'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2 cursor-pointer text-sm transition-all ${
                    priority === p
                      ? 'border-2 border-[#F2C94C] bg-amber-50/50 font-bold text-gray-900'
                      : 'border border-gray-200 hover:bg-gray-50 font-medium text-gray-700'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full border ${
                      priority === p
                        ? 'bg-[#F2C94C] border-amber-700'
                        : 'border-gray-300'
                    }`}
                  />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Proveedor relacionado */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Proveedor relacionado (opcional)
            </label>
            <select
              value={relatedProvider}
              onChange={(e) => setRelatedProvider(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Catering Gourmet Del Sur">
                Catering Gourmet Del Sur
              </option>
              <option value="Armonía Cuarteto Cuerdas">
                Armonía Cuarteto Cuerdas
              </option>
              <option value="Lumière Fotografía & Cinema">
                Lumière Fotografía & Cinema
              </option>
              <option value="Flores & Ambientes Boutique">
                Flores & Ambientes Boutique
              </option>
            </select>
          </div>

          {/* Categoría de presupuesto */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Categoría de presupuesto (opcional)
            </label>
            <select
              value={budgetCategory}
              onChange={(e) => setBudgetCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#F2C94C]"
            >
              <option value="Catering & Coctelería">
                Catering & Coctelería
              </option>
              <option value="Música y Espectáculo">Música y Espectáculo</option>
              <option value="Decoración y Flores">Decoración y Flores</option>
              <option value="Audiovisual">Audiovisual</option>
              <option value="Producción General">Producción General</option>
            </select>
          </div>

          {/* Reminder Notice */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-2.5 text-xs text-gray-600">
            <span className="material-symbols-outlined text-[18px] text-gray-400 mt-0.5">
              info
            </span>
            <span>
              Al crear la tarea, se notificará automáticamente al responsable
              asignado por correo y en el panel.
            </span>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200/70 rounded-xl transition-colors border border-gray-200 sm:border-transparent cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#F2C94C] hover:bg-[#e5bc3f] text-[#111827] font-bold px-5 py-2.5 sm:py-2 text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
              <span>Crear tarea</span>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};
