import { useEffect, useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { auth, ApiError, sesion } from '@/lib/api';

interface Unidad {
  ID: string;
  NOMBRE: string;
  CODIGO: string;
  DESCRIPCION: string | null;
  COLOR: string;
  ESTA_ACTIVA: boolean;
}

const inputStyle: React.CSSProperties = {
  borderRadius: '12px',
  background: 'rgba(42, 43, 49, 0.5)',
  border: '1px solid rgba(222, 222, 224, 0.1)',
  color: '#DEDEE0',
};

export default function OrganizationalUnits() {
  const puedeGestionar = sesion.usuario()?.permisos.includes('GESTIONAR_UNIDADES') ?? false;
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState<Unidad | null>(null);
  const [creando, setCreando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#9D833E');

  const cargar = async () => {
    setCargando(true);
    try {
      const qp = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : '';
      setUnidades(await auth.get<Unidad[]>(`/unidades${qp}`));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar las unidades');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const abrirCrear = () => {
    setCreando(true); setEditando(null);
    setNombre(''); setCodigo(''); setDescripcion(''); setColor('#9D833E');
  };
  const abrirEditar = (u: Unidad) => {
    setEditando(u); setCreando(false);
    setNombre(u.NOMBRE); setCodigo(u.CODIGO);
    setDescripcion(u.DESCRIPCION ?? ''); setColor(u.COLOR);
  };
  const cerrar = () => { setEditando(null); setCreando(false); };

  const guardar = async () => {
    if (!nombre.trim()) { toast.error('El nombre es requerido'); return; }
    if (creando && !codigo.trim()) { toast.error('El código es requerido'); return; }
    try {
      if (creando) {
        await auth.post('/unidades', { nombre, codigo, descripcion, color });
        toast.success('Unidad creada');
      } else if (editando) {
        await auth.put(`/unidades/${editando.ID}`, { nombre, descripcion, color });
        toast.success('Unidad actualizada');
      }
      cerrar(); await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo guardar');
    }
  };

  const eliminar = async (u: Unidad) => {
    if (!confirm(`¿Eliminar la unidad "${u.NOMBRE}"?`)) return;
    try {
      await auth.del(`/unidades/${u.ID}`);
      toast.success('Unidad eliminada');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  };

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#DEDEE0' }}>Unidades organizacionales</h2>
            <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
              Áreas de la empresa que agrupan tareas y usuarios
            </p>
          </div>
          {puedeGestionar && (
            <button onClick={abrirCrear} className="px-4 py-2 flex items-center gap-2"
              style={{ background: '#9D833E', color: '#14151A', borderRadius: '12px' }}>
              <Plus size={16} /> Nueva unidad
            </button>
          )}
        </div>

        <div className="mb-4 relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9D833E' }} />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') cargar(); }}
            placeholder="Buscar…"
            className="w-full pl-10 pr-4 py-2 focus:outline-none" style={inputStyle} />
        </div>

        {cargando ? (
          <div className="text-center py-12" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
        ) : unidades.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#DEDEE0', opacity: 0.6 }}>Sin unidades registradas</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unidades.map((u) => (
              <div key={u.ID} className="p-5"
                style={{
                  background: 'rgba(28, 29, 36, 0.7)',
                  borderRadius: '16px',
                  border: '1px solid rgba(222, 222, 224, 0.1)',
                }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 grid place-items-center rounded-lg"
                    style={{ background: `${u.COLOR}30`, color: u.COLOR }}>
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base" style={{ color: '#DEDEE0' }}>{u.NOMBRE}</h3>
                    <p className="text-xs" style={{ color: '#9D833E' }}>{u.CODIGO}</p>
                  </div>
                </div>
                {u.DESCRIPCION && (
                  <p className="text-sm mb-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{u.DESCRIPCION}</p>
                )}
                {puedeGestionar && (
                  <div className="flex gap-2">
                    <button onClick={() => abrirEditar(u)} className="flex-1 py-2 text-sm flex items-center justify-center gap-2"
                      style={{ background: 'rgba(42, 43, 49, 0.5)', color: '#DEDEE0', borderRadius: '10px' }}>
                      <Edit2 size={14} /> Editar
                    </button>
                    <button onClick={() => eliminar(u)} className="px-3 py-2 text-sm"
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
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-6"
               style={{ background: '#1C1D24', borderRadius: '20px', border: '1px solid rgba(222,222,224,0.1)' }}>
            <h3 className="mb-4" style={{ color: '#DEDEE0' }}>{creando ? 'Nueva unidad' : 'Editar unidad'}</h3>
            <div className="space-y-3">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre"
                className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              {creando && (
                <input value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="Código (ej. RRHH)"
                  className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              )}
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción"
                rows={3} className="w-full px-4 py-3 focus:outline-none resize-none" style={inputStyle} />
              <div className="flex items-center gap-3">
                <label className="text-sm" style={{ color: '#DEDEE0', opacity: 0.8 }}>Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 cursor-pointer" style={{ borderRadius: '8px' }} />
                <span className="text-xs" style={{ color: '#DEDEE0', opacity: 0.6 }}>{color}</span>
              </div>
            </div>
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
