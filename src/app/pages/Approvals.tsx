import { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { tareas, ApiError, sesion } from '@/lib/api';

interface Solicitud {
  ID: string;
  TAREA_ID: string | null;
  TIPO_ACCION: 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'COMPLETAR';
  TITULO: string;
  DESCRIPCION: string | null;
  PRIORIDAD: 'ALTA' | 'MEDIA' | 'BAJA';
  UNIDAD_ID: string;
  SOLICITANTE_ID: string;
  ESTADO_SOLICITUD: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  CREADO_EN: string;
}

interface Contadores {
  total_pendientes: number;
  total_aprobadas: number;
  total_rechazadas: number;
}

const PAGE_SIZE = 5;

export default function Approvals() {
  const usuario = sesion.usuario();
  const puedeAprobar = usuario?.permisos.includes('APROBAR_SOLICITUDES');
  const puedeRechazar = usuario?.permisos.includes('RECHAZAR_SOLICITUDES');

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [contadores, setContadores] = useState<Contadores | null>(null);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | ''>('PENDIENTE');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [rechazando, setRechazando] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const qp = new URLSearchParams();
      if (filtroEstado) qp.set('estado_solicitud', filtroEstado);
      if (filtroPrioridad) qp.set('prioridad', filtroPrioridad);
      if (busqueda) qp.set('busqueda', busqueda);
      const [list, cont] = await Promise.all([
        tareas.get<Solicitud[]>(`/aprobaciones?${qp.toString()}`),
        tareas.get<Contadores>('/aprobaciones/contadores'),
      ]);
      setSolicitudes(list);
      setContadores(cont);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar las aprobaciones');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filtroEstado, filtroPrioridad]);

  const visibles = useMemo(() => {
    const desde = (pagina - 1) * PAGE_SIZE;
    return solicitudes.slice(desde, desde + PAGE_SIZE);
  }, [solicitudes, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(solicitudes.length / PAGE_SIZE));

  const handleAprobar = async (id: string) => {
    try {
      await tareas.post(`/aprobaciones/${id}/aprobar`, {});
      toast.success('Solicitud aprobada');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo aprobar');
    }
  };

  const handleRechazar = async () => {
    if (!rechazando) return;
    if (motivoRechazo.trim().length < 10) { toast.error('El motivo debe tener al menos 10 caracteres'); return; }
    try {
      await tareas.post(`/aprobaciones/${rechazando}/rechazar`, { motivo: motivoRechazo });
      toast.success('Solicitud rechazada');
      setRechazando(null); setMotivoRechazo('');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo rechazar');
    }
  };

  const colorPrioridad = (p: string) => p === 'ALTA' ? '#EF4444' : p === 'MEDIA' ? '#F59E0B' : '#10B981';
  const labelTipo = (t: string) => ({ CREAR: 'Creación', EDITAR: 'Edición', ELIMINAR: 'Eliminación', COMPLETAR: 'Completar' } as Record<string, string>)[t] ?? t;

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 style={{ color: '#DEDEE0' }}>Aprobaciones</h2>
          <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Solicitudes de cambios sobre tareas
          </p>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { key: 'PENDIENTE',  label: 'Pendientes', value: contadores?.total_pendientes ?? 0, icon: Clock,       color: '#F59E0B' },
            { key: 'APROBADA',   label: 'Aprobadas',  value: contadores?.total_aprobadas  ?? 0, icon: CheckCircle, color: '#10B981' },
            { key: 'RECHAZADA',  label: 'Rechazadas', value: contadores?.total_rechazadas ?? 0, icon: XCircle,     color: '#EF4444' },
          ].map(({ key, label, value, icon: Icon, color }) => (
            <button key={key} onClick={() => { setFiltroEstado(key as any); setPagina(1); }}
              className="p-4 text-left transition-all"
              style={{
                background: 'rgba(28, 29, 36, 0.7)',
                borderRadius: '16px',
                border: `1px solid ${filtroEstado === key ? color : 'rgba(222, 222, 224, 0.1)'}`,
              }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 grid place-items-center rounded-lg" style={{ background: `${color}20`, color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: '#DEDEE0', opacity: 0.6 }}>{label}</p>
                  <p className="text-2xl" style={{ color: '#DEDEE0' }}>{value}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9D833E' }} />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') cargar(); }}
              placeholder="Buscar por título…"
              className="w-full pl-10 pr-4 py-2 focus:outline-none"
              style={{
                borderRadius: '12px',
                background: 'rgba(42, 43, 49, 0.5)',
                border: '1px solid rgba(222, 222, 224, 0.1)',
                color: '#DEDEE0',
              }} />
          </div>
          <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="px-4 py-2 focus:outline-none cursor-pointer"
            style={{
              borderRadius: '12px',
              background: 'rgba(42, 43, 49, 0.5)',
              border: '1px solid rgba(222, 222, 224, 0.1)',
              color: '#DEDEE0',
            }}>
            <option value="" style={{ background: '#1C1D24' }}>Todas las prioridades</option>
            <option value="ALTA"  style={{ background: '#1C1D24' }}>Alta</option>
            <option value="MEDIA" style={{ background: '#1C1D24' }}>Media</option>
            <option value="BAJA"  style={{ background: '#1C1D24' }}>Baja</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="backdrop-blur-xl overflow-hidden" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '20px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
        }}>
          {cargando ? (
            <div className="p-12 text-center" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
          ) : visibles.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#DEDEE0', opacity: 0.6 }}>No hay solicitudes</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.08)' }}>
                  {['Tarea', 'Acción', 'Prioridad', 'Fecha', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider"
                        style={{ color: '#9D833E' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibles.map((s) => (
                  <tr key={s.ID} style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.04)' }}>
                    <td className="px-4 py-3" style={{ color: '#DEDEE0' }}>{s.TITULO}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>{labelTipo(s.TIPO_ACCION)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded"
                        style={{ background: `${colorPrioridad(s.PRIORIDAD)}20`, color: colorPrioridad(s.PRIORIDAD) }}>
                        {s.PRIORIDAD}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>
                      {new Date(s.CREADO_EN).toLocaleDateString('es-GT')}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>{s.ESTADO_SOLICITUD}</td>
                    <td className="px-4 py-3">
                      {s.ESTADO_SOLICITUD === 'PENDIENTE' ? (
                        <div className="flex gap-2">
                          {puedeAprobar && (
                            <button onClick={() => handleAprobar(s.ID)}
                              className="px-3 py-1.5 text-xs flex items-center gap-1"
                              style={{ background: '#10B98120', color: '#10B981', borderRadius: '8px',
                                       border: '1px solid #10B98140' }}>
                              <CheckCircle size={12} /> Aprobar
                            </button>
                          )}
                          {puedeRechazar && (
                            <button onClick={() => { setRechazando(s.ID); setMotivoRechazo(''); }}
                              className="px-3 py-1.5 text-xs flex items-center gap-1"
                              style={{ background: '#EF444420', color: '#EF4444', borderRadius: '8px',
                                       border: '1px solid #EF444440' }}>
                              <XCircle size={12} /> Rechazar
                            </button>
                          )}
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ borderTop: '1px solid rgba(222, 222, 224, 0.08)' }}>
              <span className="text-xs" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                Página {pagina} de {totalPaginas}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}
                  className="p-2 disabled:opacity-40"
                  style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '8px', color: '#DEDEE0' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                  className="p-2 disabled:opacity-40"
                  style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '8px', color: '#DEDEE0' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal rechazo */}
      {rechazando && (
        <div className="fixed inset-0 grid place-items-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={() => setRechazando(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-6"
               style={{ background: '#1C1D24', borderRadius: '20px', border: '1px solid rgba(222,222,224,0.1)' }}>
            <h3 className="mb-4" style={{ color: '#DEDEE0' }}>Motivo del rechazo</h3>
            <textarea value={motivoRechazo} onChange={(e) => setMotivoRechazo(e.target.value)} rows={4}
              placeholder="Mínimo 10 caracteres…"
              className="w-full px-4 py-3 focus:outline-none mb-4 resize-none"
              style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '12px',
                       border: '1px solid rgba(222, 222, 224, 0.1)', color: '#DEDEE0' }} />
            <div className="flex gap-3">
              <button onClick={() => setRechazando(null)} className="flex-1 py-3"
                style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '12px', color: '#DEDEE0' }}>
                Cancelar
              </button>
              <button onClick={handleRechazar} className="flex-1 py-3"
                style={{ background: '#EF4444', borderRadius: '12px', color: '#fff' }}>
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
