import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { tareas, auth, ApiError, sesion } from '@/lib/api';

interface Unidad { ID: string; NOMBRE: string; CODIGO: string; }
interface Estado { ID: string; NOMBRE: string; COLOR: string; }
interface Tarea {
  ID: string;
  TITULO: string;
  DESCRIPCION: string | null;
  ESTADO_ID: string;
  PRIORIDAD: 'ALTA' | 'MEDIA' | 'BAJA';
  UNIDAD_ID: string;
}

const PRIORIDADES = [
  { value: 'BAJA',  label: 'Baja',  color: '#10B981' },
  { value: 'MEDIA', label: 'Media', color: '#F59E0B' },
  { value: 'ALTA',  label: 'Alta',  color: '#EF4444' },
] as const;

const inputStyle: React.CSSProperties = {
  borderRadius: '14px',
  backgroundColor: 'rgba(42, 43, 49, 0.5)',
  borderColor: 'rgba(222, 222, 224, 0.1)',
  color: '#DEDEE0',
  borderWidth: '1px',
  borderStyle: 'solid',
  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
};

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const usuario = sesion.usuario();
  const esAdminOSupervisor = usuario?.rol_codigo === 'ADMIN' || usuario?.rol_codigo === 'SUPERVISOR';

  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [estadoId, setEstadoId] = useState('');
  const [prioridad, setPrioridad] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('MEDIA');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      auth.get<Unidad[]>('/unidades'),
      tareas.get<Estado[]>('/estados'),
      isEdit ? tareas.get<Tarea>(`/dashboard/tareas/${id}`) : Promise.resolve(null),
    ])
      .then(([uns, ests, tarea]) => {
        if (cancelled) return;
        setUnidades(uns);
        setEstados(ests);
        if (tarea) {
          setTitulo(tarea.TITULO);
          setDescripcion(tarea.DESCRIPCION ?? '');
          setUnidadId(tarea.UNIDAD_ID);
          setEstadoId(tarea.ESTADO_ID);
          setPrioridad(tarea.PRIORIDAD);
        } else {
          setUnidadId(usuario?.unidad_id ?? '');
        }
      })
      .catch((err) => {
        toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar los catálogos');
      })
      .finally(() => { if (!cancelled) setCargando(false); });
    return () => { cancelled = true; };
  }, [id, isEdit, usuario?.unidad_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) { toast.error('El título es requerido'); return; }
    if (!unidadId)      { toast.error('Seleccioná una unidad'); return; }

    setGuardando(true);
    try {
      if (isEdit) {
        await tareas.put(`/dashboard/tareas/${id}`, { titulo, descripcion, estado_id: estadoId, prioridad });
        toast.success(esAdminOSupervisor ? 'Tarea actualizada' : 'Solicitud enviada para aprobación');
      } else {
        const resp = await tareas.post<{ tipo: string; id: string }>('/dashboard/tareas', {
          titulo, descripcion, prioridad, unidad_id: unidadId,
        });
        toast.success(resp.tipo === 'TAREA' ? 'Tarea creada' : 'Solicitud enviada para aprobación');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo guardar');
    } finally { setGuardando(false); }
  };

  if (cargando) {
    return (
      <div className="size-full grid place-items-center" style={{ backgroundColor: '#14151A', color: '#DEDEE0' }}>
        Cargando…
      </div>
    );
  }

  return (
    <div className="size-full overflow-auto" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4" style={{ color: '#DEDEE0', opacity: 0.8 }}>
            <ArrowLeft size={20} /> Volver
          </button>
          <h2 style={{ color: '#DEDEE0' }}>{isEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          {!esAdminOSupervisor && (
            <p className="text-sm mt-1" style={{ color: '#F59E0B', opacity: 0.9 }}>
              Tu rol requiere aprobación de un supervisor antes de aplicar cambios.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="backdrop-blur-xl p-6 space-y-6" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
        }}>
          <div>
            <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Revisión de presupuesto"
              className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4}
              placeholder="Detalles de la tarea…"
              className="w-full px-4 py-3 focus:outline-none resize-none" style={inputStyle} />
          </div>

          <div>
            <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>Unidad organizacional</label>
            <select value={unidadId} onChange={(e) => setUnidadId(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none cursor-pointer" style={inputStyle}>
              <option value="" disabled>Seleccioná una unidad</option>
              {unidades.map((u) => (
                <option key={u.ID} value={u.ID} style={{ backgroundColor: '#1C1D24' }}>
                  {u.NOMBRE} ({u.CODIGO})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-3" style={{ color: '#DEDEE0', opacity: 0.8 }}>Prioridad</label>
            <div className="flex gap-3">
              {PRIORIDADES.map((p) => {
                const sel = prioridad === p.value;
                return (
                  <button key={p.value} type="button" onClick={() => setPrioridad(p.value)}
                    className="flex-1 py-3 px-4 transition-all duration-300"
                    style={{
                      borderRadius: '14px',
                      backgroundColor: sel ? p.color : 'rgba(42, 43, 49, 0.5)',
                      color: '#DEDEE0',
                      border: `1px solid ${sel ? p.color : 'rgba(222, 222, 224, 0.1)'}`,
                      opacity: sel ? 1 : 0.75,
                    }}>{p.label}</button>
                );
              })}
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block mb-3" style={{ color: '#DEDEE0', opacity: 0.8 }}>Estado</label>
              <div className="flex gap-2 flex-wrap">
                {estados.map((s) => {
                  const sel = estadoId === s.ID;
                  return (
                    <button key={s.ID} type="button" onClick={() => setEstadoId(s.ID)}
                      className="px-4 py-2 transition-all duration-300 text-sm"
                      style={{
                        borderRadius: '12px',
                        backgroundColor: sel ? s.COLOR : 'rgba(42, 43, 49, 0.5)',
                        color: sel ? '#14151A' : '#DEDEE0',
                        border: `1px solid ${sel ? s.COLOR : 'rgba(222, 222, 224, 0.1)'}`,
                      }}>{s.NOMBRE}</button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} disabled={guardando}
              className="flex-1 py-3 disabled:opacity-60"
              style={{ ...inputStyle, color: '#DEDEE0' }}>Cancelar</button>
            <button type="submit" disabled={guardando}
              className="flex-1 py-3 disabled:opacity-60"
              style={{ backgroundColor: '#9D833E', color: '#14151A', borderRadius: '14px',
                boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4)' }}>
              {guardando ? 'Guardando…' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
