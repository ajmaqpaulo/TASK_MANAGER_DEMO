import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, LayoutGrid, Table as TableIcon, Edit2, Trash2, CheckCircle2, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { tareas, ApiError, sesion } from '@/lib/api';

interface Tarea {
  ID: string;
  TITULO: string;
  DESCRIPCION: string | null;
  ESTADO_ID: string;
  ESTADO_NOMBRE: string;
  ESTADO_COLOR: string;
  PRIORIDAD: 'ALTA' | 'MEDIA' | 'BAJA';
  UNIDAD_ID: string;
  CREADO_EN: string;
}

interface Estado {
  ID: string;
  NOMBRE: string;
  COLOR: string;
  ORDEN: number;
}

const colorPrioridad = (p: string) => p === 'ALTA' ? '#EF4444' : p === 'MEDIA' ? '#F59E0B' : '#10B981';

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = sesion.usuario();
  const esAdminOSupervisor = usuario?.rol_codigo === 'ADMIN' || usuario?.rol_codigo === 'SUPERVISOR';

  const [tareasList, setTareasList] = useState<Tarea[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState<'kanban' | 'tabla'>('kanban');
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const [tas, ests] = await Promise.all([
        tareas.get<Tarea[]>('/dashboard/tareas'),
        tareas.get<Estado[]>('/estados'),
      ]);
      setTareasList(tas);
      setEstados(ests.sort((a, b) => a.ORDEN - b.ORDEN));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar las tareas');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const filtradas = useMemo(() => {
    return tareasList.filter((t) => {
      if (busqueda && !t.TITULO.toLowerCase().includes(busqueda.toLowerCase())) return false;
      if (filtroPrioridad && t.PRIORIDAD !== filtroPrioridad) return false;
      return true;
    });
  }, [tareasList, busqueda, filtroPrioridad]);

  const mover = async (tareaId: string, nuevoEstadoId: string) => {
    const t = tareasList.find((x) => x.ID === tareaId);
    if (!t || t.ESTADO_ID === nuevoEstadoId) return;

    // Optimistic update
    setTareasList((prev) => prev.map((x) =>
      x.ID === tareaId ? { ...x, ESTADO_ID: nuevoEstadoId, ESTADO_NOMBRE: estados.find((e) => e.ID === nuevoEstadoId)?.NOMBRE ?? x.ESTADO_NOMBRE } : x
    ));
    try {
      await tareas.put(`/dashboard/tareas/${tareaId}`, { estado_id: nuevoEstadoId });
      toast.success(esAdminOSupervisor ? 'Estado actualizado' : 'Solicitud enviada para aprobación');
      if (!esAdminOSupervisor) await cargar(); // revertir si fue solicitud
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo mover la tarea');
      await cargar();
    }
  };

  const eliminar = async (t: Tarea) => {
    if (!confirm(`¿Eliminar la tarea "${t.TITULO}"?`)) return;
    try {
      const resp = await tareas.del<{ tipo: string }>(`/dashboard/tareas/${t.ID}`);
      toast.success(resp.tipo === 'TAREA' ? 'Tarea eliminada' : 'Solicitud de eliminación enviada');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  };

  const completar = async (t: Tarea) => {
    try {
      const resp = await tareas.post<{ tipo: string }>(`/dashboard/tareas/${t.ID}/completar`, {});
      toast.success(resp.tipo === 'TAREA' ? 'Tarea completada' : 'Solicitud enviada para aprobación');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo completar');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 style={{ color: '#DEDEE0' }}>Dashboard</h2>
              <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                {usuario?.nombre_completo} · {usuario?.unidad_nombre}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex"
                style={{ background: 'rgba(42,43,49,0.5)', borderRadius: '12px', padding: '4px' }}>
                <ToggleBtn active={vista === 'kanban'} onClick={() => setVista('kanban')}><LayoutGrid size={14} /> Kanban</ToggleBtn>
                <ToggleBtn active={vista === 'tabla'} onClick={() => setVista('tabla')}><TableIcon size={14} /> Tabla</ToggleBtn>
              </div>
              <button onClick={() => navigate('/tasks/new')} className="px-4 py-2 flex items-center gap-2"
                style={{ background: '#9D833E', color: '#14151A', borderRadius: '12px' }}>
                <Plus size={16} /> Nueva tarea
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9D833E' }} />
              <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar…"
                className="w-full pl-10 pr-4 py-2 focus:outline-none"
                style={{ borderRadius: '12px', background: 'rgba(42,43,49,0.5)',
                         border: '1px solid rgba(222,222,224,0.1)', color: '#DEDEE0' }} />
            </div>
            <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="px-4 py-2 focus:outline-none cursor-pointer"
              style={{ borderRadius: '12px', background: 'rgba(42,43,49,0.5)',
                       border: '1px solid rgba(222,222,224,0.1)', color: '#DEDEE0' }}>
              <option value="" style={{ background: '#1C1D24' }}>Todas las prioridades</option>
              <option value="ALTA"  style={{ background: '#1C1D24' }}>Alta</option>
              <option value="MEDIA" style={{ background: '#1C1D24' }}>Media</option>
              <option value="BAJA"  style={{ background: '#1C1D24' }}>Baja</option>
            </select>
          </div>

          {cargando ? (
            <div className="text-center py-20" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
          ) : vista === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {estados.map((est) => (
                <Columna key={est.ID} estado={est} tareas={filtradas.filter((t) => t.ESTADO_ID === est.ID)}
                  onDrop={(id) => mover(id, est.ID)}
                  onEdit={(t) => navigate(`/tasks/${t.ID}`)}
                  onComplete={completar}
                  onDelete={eliminar} />
              ))}
            </div>
          ) : (
            <TablaVista tareas={filtradas} onEdit={(t) => navigate(`/tasks/${t.ID}`)}
              onComplete={completar} onDelete={eliminar} />
          )}
        </div>
      </div>
    </DndProvider>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 flex items-center gap-1 text-xs"
      style={{ background: active ? '#9D833E' : 'transparent', color: active ? '#14151A' : '#DEDEE0', borderRadius: '8px' }}>
      {children}
    </button>
  );
}

function Columna({ estado, tareas: ts, onDrop, onEdit, onComplete, onDelete }: {
  estado: Estado;
  tareas: Tarea[];
  onDrop: (id: string) => void;
  onEdit: (t: Tarea) => void;
  onComplete: (t: Tarea) => void;
  onDelete: (t: Tarea) => void;
}) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'TAREA',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (m) => ({ isOver: m.isOver() }),
  }), [onDrop]);

  return (
    <div ref={dropRef as any} className="flex flex-col"
      style={{
        background: isOver ? 'rgba(157,131,62,0.10)' : 'rgba(28, 29, 36, 0.5)',
        borderRadius: '16px',
        border: `1px solid ${isOver ? '#9D833E' : 'rgba(222,222,224,0.08)'}`,
        minHeight: '300px',
        padding: '12px',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: estado.COLOR }} />
          <span className="text-sm uppercase tracking-wider" style={{ color: '#DEDEE0' }}>{estado.NOMBRE}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded"
          style={{ background: `${estado.COLOR}30`, color: estado.COLOR }}>{ts.length}</span>
      </div>
      <div className="space-y-2 flex-1">
        {ts.map((t) => (
          <Tarjeta key={t.ID} tarea={t} onEdit={() => onEdit(t)} onComplete={() => onComplete(t)} onDelete={() => onDelete(t)} />
        ))}
      </div>
    </div>
  );
}

function Tarjeta({ tarea, onEdit, onComplete, onDelete }: {
  tarea: Tarea; onEdit: () => void; onComplete: () => void; onDelete: () => void;
}) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TAREA',
    item: { id: tarea.ID },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }), [tarea.ID]);

  return (
    <div ref={dragRef as any} className="p-3 cursor-grab active:cursor-grabbing"
      style={{
        background: 'rgba(42,43,49,0.7)',
        borderRadius: '12px',
        border: '1px solid rgba(222,222,224,0.08)',
        opacity: isDragging ? 0.4 : 1,
      }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm flex-1" style={{ color: '#DEDEE0' }}>{tarea.TITULO}</p>
        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded shrink-0"
          style={{ background: `${colorPrioridad(tarea.PRIORIDAD)}25`, color: colorPrioridad(tarea.PRIORIDAD) }}>
          {tarea.PRIORIDAD}
        </span>
      </div>
      {tarea.DESCRIPCION && (
        <p className="text-xs mb-2" style={{ color: '#DEDEE0', opacity: 0.55 }}>
          {tarea.DESCRIPCION.slice(0, 80)}{tarea.DESCRIPCION.length > 80 ? '…' : ''}
        </p>
      )}
      <div className="flex gap-1">
        <button onClick={onEdit} title="Editar"
          className="p-1.5"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#DEDEE0', borderRadius: '6px' }}>
          <Edit2 size={11} />
        </button>
        <button onClick={onComplete} title="Completar"
          className="p-1.5"
          style={{ background: '#10B98120', color: '#10B981', borderRadius: '6px' }}>
          <CheckCircle2 size={11} />
        </button>
        <button onClick={onDelete} title="Eliminar"
          className="p-1.5"
          style={{ background: '#EF444420', color: '#EF4444', borderRadius: '6px' }}>
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

type SortKey = 'TITULO' | 'ESTADO_NOMBRE' | 'PRIORIDAD' | 'CREADO_EN';
const PRIO_ORDEN: Record<string, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 };

function TablaVista({ tareas: ts, onEdit, onComplete, onDelete }: {
  tareas: Tarea[]; onEdit: (t: Tarea) => void; onComplete: (t: Tarea) => void; onDelete: (t: Tarea) => void;
}) {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>('CREADO_EN');
  const [sortAsc, setSortAsc] = useState(false);

  const ordenadas = useMemo(() => {
    const copia = [...ts];
    copia.sort((a, b) => {
      let av: string | number = a[sortKey] ?? '';
      let bv: string | number = b[sortKey] ?? '';
      if (sortKey === 'PRIORIDAD') {
        av = PRIO_ORDEN[a.PRIORIDAD] ?? 99;
        bv = PRIO_ORDEN[b.PRIORIDAD] ?? 99;
      } else if (sortKey === 'CREADO_EN') {
        av = new Date(a.CREADO_EN).getTime();
        bv = new Date(b.CREADO_EN).getTime();
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return copia;
  }, [ts, sortKey, sortAsc]);

  // Si cambia la lista (por filtro), volver a página 1
  useEffect(() => { setPagina(1); }, [ts.length, sortKey, sortAsc, porPagina]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const desde = (pagina - 1) * porPagina;
  const visibles = ordenadas.slice(desde, desde + porPagina);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={12} className="opacity-40" />;
    return sortAsc ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const COLUMNAS: { key: SortKey; label: string }[] = [
    { key: 'TITULO',        label: 'Título' },
    { key: 'ESTADO_NOMBRE', label: 'Estado' },
    { key: 'PRIORIDAD',     label: 'Prioridad' },
    { key: 'CREADO_EN',     label: 'Creada' },
  ];

  return (
    <div style={{
      background: 'rgba(28, 29, 36, 0.7)',
      borderRadius: '20px',
      border: '1px solid rgba(222, 222, 224, 0.1)',
      overflow: 'hidden',
    }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.08)' }}>
            {COLUMNAS.map((c) => (
              <th key={c.key} onClick={() => toggleSort(c.key)}
                  className="px-4 py-3 text-left text-xs uppercase tracking-wider cursor-pointer select-none"
                  style={{ color: '#9D833E' }}>
                <span className="inline-flex items-center gap-1">
                  {c.label} <SortIcon k={c.key} />
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs uppercase tracking-wider" style={{ color: '#9D833E' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((t) => (
            <tr key={t.ID} style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.04)' }}>
              <td className="px-4 py-3" style={{ color: '#DEDEE0' }}>{t.TITULO}</td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 rounded text-xs"
                  style={{ background: `${t.ESTADO_COLOR}25`, color: t.ESTADO_COLOR }}>
                  {t.ESTADO_NOMBRE}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 rounded text-xs"
                  style={{ background: `${colorPrioridad(t.PRIORIDAD)}25`, color: colorPrioridad(t.PRIORIDAD) }}>
                  {t.PRIORIDAD}
                </span>
              </td>
              <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>
                {new Date(t.CREADO_EN).toLocaleDateString('es-GT')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  <button onClick={() => onEdit(t)} title="Editar" className="p-2"
                    style={{ background: 'rgba(42,43,49,0.5)', color: '#DEDEE0', borderRadius: '8px' }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => onComplete(t)} title="Completar" className="p-2"
                    style={{ background: '#10B98120', color: '#10B981', borderRadius: '8px' }}>
                    <CheckCircle2 size={13} />
                  </button>
                  <button onClick={() => onDelete(t)} title="Eliminar" className="p-2"
                    style={{ background: '#EF444420', color: '#EF4444', borderRadius: '8px' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibles.length === 0 && (
        <div className="p-12 text-center" style={{ color: '#DEDEE0', opacity: 0.6 }}>Sin tareas</div>
      )}

      {ordenadas.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-3"
             style={{ borderTop: '1px solid rgba(222, 222, 224, 0.08)' }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: '#DEDEE0', opacity: 0.7 }}>
            <span>
              Mostrando {desde + 1}–{Math.min(desde + porPagina, ordenadas.length)} de {ordenadas.length}
            </span>
            <span className="flex items-center gap-2">
              Filas:
              <select value={porPagina} onChange={(e) => setPorPagina(Number(e.target.value))}
                className="px-2 py-1 cursor-pointer focus:outline-none"
                style={{ background: 'rgba(42,43,49,0.5)', borderRadius: '6px',
                         border: '1px solid rgba(222,222,224,0.1)', color: '#DEDEE0' }}>
                <option value={5}  style={{ background: '#1C1D24' }}>5</option>
                <option value={10} style={{ background: '#1C1D24' }}>10</option>
                <option value={25} style={{ background: '#1C1D24' }}>25</option>
                <option value={50} style={{ background: '#1C1D24' }}>50</option>
              </select>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}
              className="p-2 disabled:opacity-40"
              style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '8px', color: '#DEDEE0' }}>
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs px-2" style={{ color: '#DEDEE0' }}>
              {pagina} / {totalPaginas}
            </span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
              className="p-2 disabled:opacity-40"
              style={{ background: 'rgba(42, 43, 49, 0.5)', borderRadius: '8px', color: '#DEDEE0' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
