import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [title, setTitle] = useState(isEdit ? 'Revisión de presupuesto Q1' : '');
  const [description, setDescription] = useState(isEdit ? 'Analizar gastos del primer trimestre' : '');
  const [unit, setUnit] = useState(isEdit ? 'finanzas' : '');
  const [priority, setPriority] = useState(isEdit ? 'high' : '');
  const [status, setStatus] = useState(isEdit ? 'pending' : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Task data:', { title, description, unit, priority, status });
    navigate('/dashboard');
  };

  return (
    <div className="size-full overflow-auto" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 transition-all duration-300 active:scale-95"
            style={{ color: '#DEDEE0', opacity: 0.8 }}
          >
            <ArrowLeft size={20} />
            Volver
          </button>
          <h2 style={{ color: '#DEDEE0' }}>
            {isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            {isEdit ? 'Actualiza los detalles de la tarea' : 'Completa los detalles de la nueva tarea'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-xl p-6" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Título de la tarea
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Revisión de presupuesto"
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: '#DEDEE0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los detalles de la tarea..."
                rows={4}
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500 resize-none"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: '#DEDEE0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>

            {/* Unidad */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Unidad Organizacional
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: unit ? '#DEDEE0' : '#808080',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23DEDEE0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '12px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              >
                <option value="" disabled>Selecciona una unidad</option>
                <option value="rrhh" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>RRHH</option>
                <option value="finanzas" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>Finanzas</option>
                <option value="bi" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>BI</option>
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block mb-3" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Prioridad
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'low', label: 'Baja', color: '#10B981' },
                  { value: 'medium', label: 'Media', color: '#F59E0B' },
                  { value: 'high', label: 'Alta', color: '#EF4444' }
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className="flex-1 py-3 px-4 transition-all duration-300 active:scale-[0.97]"
                    style={{
                      borderRadius: '14px',
                      backgroundColor: priority === p.value ? p.color : 'rgba(42, 43, 49, 0.5)',
                      color: priority === p.value ? '#DEDEE0' : '#DEDEE0',
                      border: `1px solid ${priority === p.value ? p.color : 'rgba(222, 222, 224, 0.1)'}`,
                      boxShadow: priority === p.value 
                        ? `0 4px 16px 0 ${p.color}40, inset 0 1px 0 0 rgba(255, 255, 255, 0.2)` 
                        : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                      opacity: priority === p.value ? 1 : 0.7
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado (solo en edit) */}
            {isEdit && (
              <div>
                <label className="block mb-3" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Estado
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'in-progress', label: 'En Progreso' },
                    { value: 'completed', label: 'Completado' }
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatus(s.value)}
                      className="flex-1 py-3 px-4 transition-all duration-300 active:scale-[0.97]"
                      style={{
                        borderRadius: '14px',
                        backgroundColor: status === s.value ? '#9D833E' : 'rgba(42, 43, 49, 0.5)',
                        color: status === s.value ? '#14151A' : '#DEDEE0',
                        border: `1px solid ${status === s.value ? '#9D833E' : 'rgba(222, 222, 224, 0.1)'}`,
                        boxShadow: status === s.value 
                          ? '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' 
                          : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-4 transition-all duration-300 active:scale-[0.97]"
                style={{
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  color: '#DEDEE0',
                  borderRadius: '14px',
                  border: '1px solid rgba(222, 222, 224, 0.1)',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                style={{
                  backgroundColor: '#9D833E',
                  color: '#14151A',
                  borderRadius: '14px',
                  boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 24px 0 rgba(157, 131, 62, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)';
                }}
              >
                {isEdit ? 'Actualizar Tarea' : 'Crear Tarea'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
