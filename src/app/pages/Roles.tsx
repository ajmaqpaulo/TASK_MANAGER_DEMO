import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { auth, ApiError, sesion } from '@/lib/api';

interface Rol {
  ID: string;
  NOMBRE: string;
  CODIGO: string;
  DESCRIPCION: string | null;
  ES_SISTEMA: boolean;
  ESTA_ACTIVO: boolean;
}

interface RolDetalle extends Rol {
  permisos: { ID: string; NOMBRE: string; CODIGO: string }[];
  pantallas: { ID: string; NOMBRE: string; CODIGO: string }[];
  reportes:  { ID: string; NOMBRE: string; CODIGO: string }[];
}

interface CatItem { ID: string; NOMBRE: string; CODIGO: string; }

const inputStyle: React.CSSProperties = {
  borderRadius: '12px',
  background: 'rgba(42, 43, 49, 0.5)',
  border: '1px solid rgba(222, 222, 224, 0.1)',
  color: '#DEDEE0',
};

export default function Roles() {
  const puedeGestionar = sesion.usuario()?.permisos.includes('GESTIONAR_ROLES') ?? false;

  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState(true);
  const [permisosCat,  setPermisosCat]  = useState<CatItem[]>([]);
  const [pantallasCat, setPantallasCat] = useState<CatItem[]>([]);
  const [reportesCat,  setReportesCat]  = useState<CatItem[]>([]);

  const [editando, setEditando] = useState<RolDetalle | null>(null);
  const [creando, setCreando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [permisosSel,  setPermisosSel]  = useState<Set<string>>(new Set());
  const [pantallasSel, setPantallasSel] = useState<Set<string>>(new Set());
  const [reportesSel,  setReportesSel]  = useState<Set<string>>(new Set());

  const cargar = async () => {
    setCargando(true);
    try {
      const [rs, pe, pa, re] = await Promise.all([
        auth.get<Rol[]>('/acceso/roles'),
        auth.get<CatItem[]>('/acceso/permisos'),
        auth.get<CatItem[]>('/acceso/pantallas'),
        auth.get<CatItem[]>('/acceso/reportes-catalogo'),
      ]);
      setRoles(rs);
      setPermisosCat(pe); setPantallasCat(pa); setReportesCat(re);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar los roles');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setCreando(true); setEditando(null);
    setNombre(''); setCodigo(''); setDescripcion('');
    setPermisosSel(new Set()); setPantallasSel(new Set()); setReportesSel(new Set());
  };

  const abrirEditar = async (r: Rol) => {
    try {
      const detalle = await auth.get<RolDetalle>(`/acceso/roles/${r.ID}`);
      setEditando(detalle); setCreando(false);
      setNombre(detalle.NOMBRE); setCodigo(detalle.CODIGO);
      setDescripcion(detalle.DESCRIPCION ?? '');
      setPermisosSel(new Set(detalle.permisos.map((x) => x.ID)));
      setPantallasSel(new Set(detalle.pantallas.map((x) => x.ID)));
      setReportesSel(new Set(detalle.reportes.map((x) => x.ID)));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo obtener el rol');
    }
  };

  const cerrar = () => { setEditando(null); setCreando(false); };

  const toggleSet = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const ns = new Set(set);
    if (ns.has(id)) ns.delete(id); else ns.add(id);
    setter(ns);
  };

  const guardar = async () => {
    if (!nombre.trim()) { toast.error('El nombre es requerido'); return; }
    if (creando && !codigo.trim()) { toast.error('El código es requerido'); return; }
    try {
      const body = {
        nombre, descripcion,
        permisos_ids:  Array.from(permisosSel),
        pantallas_ids: Array.from(pantallasSel),
        reportes_ids:  Array.from(reportesSel),
      };
      if (creando) {
        await auth.post('/acceso/roles', { ...body, codigo });
        toast.success('Rol creado');
      } else if (editando) {
        await auth.put(`/acceso/roles/${editando.ID}`, body);
        toast.success('Rol actualizado');
      }
      cerrar(); await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo guardar');
    }
  };

  const eliminar = async (r: Rol) => {
    if (r.ES_SISTEMA) { toast.error('Los roles del sistema no se pueden eliminar'); return; }
    if (!confirm(`¿Eliminar el rol "${r.NOMBRE}"?`)) return;
    try {
      await auth.del(`/acceso/roles/${r.ID}`);
      toast.success('Rol eliminado');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  };

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#DEDEE0' }}>Roles y permisos</h2>
            <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
              Definí qué puede hacer cada perfil
            </p>
          </div>
          {puedeGestionar && (
            <button onClick={abrirCrear} className="px-4 py-2 flex items-center gap-2"
              style={{ background: '#9D833E', color: '#14151A', borderRadius: '12px' }}>
              <Plus size={16} /> Nuevo rol
            </button>
          )}
        </div>

        {cargando ? (
          <div className="text-center py-12" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <div key={r.ID} className="p-5"
                style={{
                  background: 'rgba(28, 29, 36, 0.7)',
                  borderRadius: '16px',
                  border: '1px solid rgba(222, 222, 224, 0.1)',
                }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 grid place-items-center rounded-lg"
                    style={{ background: '#9D833E30', color: '#9D833E' }}>
                    <Shield size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base" style={{ color: '#DEDEE0' }}>{r.NOMBRE}</h3>
                    <p className="text-xs" style={{ color: '#9D833E' }}>{r.CODIGO}</p>
                  </div>
                  {r.ES_SISTEMA && (
                    <span className="text-[10px] uppercase px-2 py-1 rounded"
                      style={{ background: '#3B82F620', color: '#3B82F6' }}>Sistema</span>
                  )}
                </div>
                {r.DESCRIPCION && (
                  <p className="text-sm mb-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{r.DESCRIPCION}</p>
                )}
                {puedeGestionar && (
                  <div className="flex gap-2">
                    <button onClick={() => abrirEditar(r)} className="flex-1 py-2 text-sm flex items-center justify-center gap-2"
                      style={{ background: 'rgba(42, 43, 49, 0.5)', color: '#DEDEE0', borderRadius: '10px' }}>
                      <Edit2 size={14} /> Editar
                    </button>
                    <button onClick={() => eliminar(r)} disabled={r.ES_SISTEMA}
                      className="px-3 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: '#EF444420', color: '#EF4444', borderRadius: '10px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(creando || editando) && (
        <div className="fixed inset-0 grid place-items-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={cerrar}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[85vh] overflow-auto p-6"
               style={{ background: '#1C1D24', borderRadius: '20px', border: '1px solid rgba(222,222,224,0.1)' }}>
            <h3 className="mb-4" style={{ color: '#DEDEE0' }}>{creando ? 'Nuevo rol' : 'Editar rol'}</h3>

            <div className="space-y-3">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre"
                className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              {creando && (
                <input value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="Código (ej. SUPERVISOR)"
                  className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              )}
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción" rows={2}
                className="w-full px-4 py-3 focus:outline-none resize-none" style={inputStyle} />
            </div>

            <CheckboxGrid title="Permisos"  items={permisosCat}  selected={permisosSel}  onToggle={(id) => toggleSet(permisosSel,  setPermisosSel,  id)} />
            <CheckboxGrid title="Pantallas" items={pantallasCat} selected={pantallasSel} onToggle={(id) => toggleSet(pantallasSel, setPantallasSel, id)} />
            <CheckboxGrid title="Reportes"  items={reportesCat}  selected={reportesSel}  onToggle={(id) => toggleSet(reportesSel,  setReportesSel,  id)} />

            <div className="flex gap-3 mt-5">
              <button onClick={cerrar} className="flex-1 py-3"
                style={{ background: 'rgba(42,43,49,0.5)', borderRadius: '12px', color: '#DEDEE0' }}>Cancelar</button>
              <button onClick={guardar} className="flex-1 py-3"
                style={{ background: '#9D833E', borderRadius: '12px', color: '#14151A' }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckboxGrid({ title, items, selected, onToggle }: {
  title: string;
  items: CatItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-5">
      <p className="text-sm mb-2 uppercase tracking-wider" style={{ color: '#9D833E' }}>{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-auto p-2"
           style={{ background: 'rgba(42,43,49,0.3)', borderRadius: '12px' }}>
        {items.map((it) => {
          const sel = selected.has(it.ID);
          return (
            <label key={it.ID} className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm"
                   style={{ background: sel ? 'rgba(157,131,62,0.18)' : 'transparent',
                            color: '#DEDEE0', borderRadius: '8px' }}>
              <input type="checkbox" checked={sel} onChange={() => onToggle(it.ID)} />
              <span>{it.NOMBRE}</span>
              <span className="ml-auto text-[10px] opacity-50">{it.CODIGO}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
