import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Unlock, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { auth, ApiError, sesion } from '@/lib/api';

interface Usuario {
  ID: string;
  NOMBRE_COMPLETO: string;
  CORREO: string;
  ESTA_ACTIVO: boolean;
  UNIDAD_NOMBRE: string;
  UNIDAD_CODIGO: string;
  ROL_NOMBRE: string;
  ROL_CODIGO: string;
}

interface Unidad { ID: string; NOMBRE: string; CODIGO: string; }
interface Rol    { ID: string; NOMBRE: string; CODIGO: string; }

const inputStyle: React.CSSProperties = {
  borderRadius: '12px',
  background: 'rgba(42, 43, 49, 0.5)',
  border: '1px solid rgba(222, 222, 224, 0.1)',
  color: '#DEDEE0',
};

export default function Register() {
  const puedeGestionar = sesion.usuario()?.permisos.includes('GESTIONAR_USUARIOS') ?? false;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 10;

  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [creando, setCreando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [unidadId, setUnidadId] = useState('');
  const [rolId, setRolId] = useState('');
  const [activo, setActivo] = useState(true);

  const [reseteando, setReseteando] = useState<Usuario | null>(null);
  const [pwdReset, setPwdReset] = useState('');

  const cargarCatalogos = async () => {
    try {
      const [u, r] = await Promise.all([
        auth.get<Unidad[]>('/unidades'),
        auth.get<Rol[]>('/acceso/roles'),
      ]);
      setUnidades(u); setRoles(r);
    } catch { /* manejado en cargar() */ }
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const qp = new URLSearchParams({ pagina: String(pagina), por_pagina: String(POR_PAGINA) });
      if (busqueda) qp.set('busqueda', busqueda);
      const data = await auth.get<{ registros: Usuario[]; total: number }>(`/identidad/usuarios?${qp.toString()}`);
      setUsuarios(data.registros);
      setTotal(data.total);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudieron cargar los usuarios');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargarCatalogos(); }, []);
  useEffect(() => { cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pagina]);

  const abrirCrear = () => {
    setCreando(true); setEditando(null);
    setNombre(''); setCorreo(''); setContrasena('');
    setUnidadId(unidades[0]?.ID ?? '');
    setRolId(roles[0]?.ID ?? '');
    setActivo(true);
  };
  const abrirEditar = (u: Usuario) => {
    setEditando(u); setCreando(false);
    setNombre(u.NOMBRE_COMPLETO); setCorreo(u.CORREO);
    setUnidadId(unidades.find((x) => x.CODIGO === u.UNIDAD_CODIGO)?.ID ?? '');
    setRolId(roles.find((x) => x.CODIGO === u.ROL_CODIGO)?.ID ?? '');
    setActivo(u.ESTA_ACTIVO);
  };
  const cerrar = () => { setEditando(null); setCreando(false); };

  const guardar = async () => {
    if (!nombre.trim() || !correo.trim()) { toast.error('Nombre y correo son requeridos'); return; }
    if (creando && contrasena.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    try {
      if (creando) {
        await auth.post('/identidad/usuarios', { nombre_completo: nombre, correo, contrasena, unidad_id: unidadId, rol_id: rolId, proveedor_auth: 'LOCAL' });
        toast.success('Usuario creado');
      } else if (editando) {
        await auth.put(`/identidad/usuarios/${editando.ID}`, { nombre_completo: nombre, correo, unidad_id: unidadId, rol_id: rolId, esta_activo: activo });
        toast.success('Usuario actualizado');
      }
      cerrar(); await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo guardar');
    }
  };

  const eliminar = async (u: Usuario) => {
    if (!confirm(`¿Eliminar al usuario "${u.NOMBRE_COMPLETO}"?`)) return;
    try {
      await auth.del(`/identidad/usuarios/${u.ID}`);
      toast.success('Usuario eliminado');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo eliminar');
    }
  };

  const desbloquear = async (u: Usuario) => {
    try {
      await auth.post(`/identidad/usuarios/${u.ID}/desbloquear`, {});
      toast.success('Usuario desbloqueado');
      await cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo desbloquear');
    }
  };

  const resetearPwd = async () => {
    if (!reseteando) return;
    if (pwdReset.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    try {
      await auth.post(`/identidad/usuarios/${reseteando.ID}/resetear-contrasena`, { nueva_contrasena: pwdReset });
      toast.success('Contraseña reseteada');
      setReseteando(null); setPwdReset('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo resetear');
    }
  };

  const totalPaginas = useMemo(() => Math.max(1, Math.ceil(total / POR_PAGINA)), [total]);

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 style={{ color: '#DEDEE0' }}>Usuarios</h2>
            <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
              Gestión de cuentas del sistema
            </p>
          </div>
          {puedeGestionar && (
            <button onClick={abrirCrear} className="px-4 py-2 flex items-center gap-2"
              style={{ background: '#9D833E', color: '#14151A', borderRadius: '12px' }}>
              <Plus size={16} /> Nuevo usuario
            </button>
          )}
        </div>

        <div className="mb-4 relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9D833E' }} />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setPagina(1); cargar(); } }}
            placeholder="Buscar por nombre o correo…"
            className="w-full pl-10 pr-4 py-2 focus:outline-none" style={inputStyle} />
        </div>

        <div style={{
          background: 'rgba(28, 29, 36, 0.7)', borderRadius: '20px',
          border: '1px solid rgba(222, 222, 224, 0.1)', overflow: 'hidden',
        }}>
          {cargando ? (
            <div className="p-12 text-center" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
          ) : usuarios.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#DEDEE0', opacity: 0.6 }}>Sin usuarios</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.08)' }}>
                  {['Nombre', 'Correo', 'Unidad', 'Rol', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider"
                        style={{ color: '#9D833E' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.ID} style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.04)' }}>
                    <td className="px-4 py-3" style={{ color: '#DEDEE0' }}>{u.NOMBRE_COMPLETO}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>{u.CORREO}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>{u.UNIDAD_CODIGO}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#DEDEE0', opacity: 0.7 }}>{u.ROL_NOMBRE}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded"
                        style={{
                          background: u.ESTA_ACTIVO ? '#10B98120' : '#EF444420',
                          color:      u.ESTA_ACTIVO ? '#10B981'   : '#EF4444',
                        }}>
                        {u.ESTA_ACTIVO ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {puedeGestionar && (
                        <div className="flex gap-1.5">
                          <button onClick={() => abrirEditar(u)} title="Editar"
                            className="p-2"
                            style={{ background: 'rgba(42,43,49,0.5)', color: '#DEDEE0', borderRadius: '8px' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => { setReseteando(u); setPwdReset(''); }} title="Resetear contraseña"
                            className="p-2"
                            style={{ background: '#3B82F620', color: '#3B82F6', borderRadius: '8px' }}>
                            <KeyRound size={13} />
                          </button>
                          <button onClick={() => desbloquear(u)} title="Desbloquear"
                            className="p-2"
                            style={{ background: '#F59E0B20', color: '#F59E0B', borderRadius: '8px' }}>
                            <Unlock size={13} />
                          </button>
                          <button onClick={() => eliminar(u)} title="Eliminar"
                            className="p-2"
                            style={{ background: '#EF444420', color: '#EF4444', borderRadius: '8px' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ borderTop: '1px solid rgba(222, 222, 224, 0.08)' }}>
              <span className="text-xs" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                Página {pagina} de {totalPaginas} · {total} usuarios
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

      {/* Modal crear/editar */}
      {(creando || editando) && (
        <div className="fixed inset-0 grid place-items-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={cerrar}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-6"
               style={{ background: '#1C1D24', borderRadius: '20px', border: '1px solid rgba(222,222,224,0.1)' }}>
            <h3 className="mb-4" style={{ color: '#DEDEE0' }}>{creando ? 'Nuevo usuario' : 'Editar usuario'}</h3>
            <div className="space-y-3">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo"
                className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@empresa.com"
                type="email" className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              {creando && (
                <input value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña inicial (8+ caracteres)"
                  type="password" className="w-full px-4 py-3 focus:outline-none" style={inputStyle} />
              )}
              <select value={unidadId} onChange={(e) => setUnidadId(e.target.value)}
                className="w-full px-4 py-3 focus:outline-none cursor-pointer" style={inputStyle}>
                <option value="" disabled style={{ background: '#1C1D24' }}>Seleccioná una unidad</option>
                {unidades.map((u) => (
                  <option key={u.ID} value={u.ID} style={{ background: '#1C1D24' }}>{u.NOMBRE}</option>
                ))}
              </select>
              <select value={rolId} onChange={(e) => setRolId(e.target.value)}
                className="w-full px-4 py-3 focus:outline-none cursor-pointer" style={inputStyle}>
                <option value="" disabled style={{ background: '#1C1D24' }}>Seleccioná un rol</option>
                {roles.map((r) => (
                  <option key={r.ID} value={r.ID} style={{ background: '#1C1D24' }}>{r.NOMBRE}</option>
                ))}
              </select>
              {editando && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
                  <span className="text-sm" style={{ color: '#DEDEE0' }}>Cuenta activa</span>
                </label>
              )}
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

      {/* Modal resetear pwd */}
      {reseteando && (
        <div className="fixed inset-0 grid place-items-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)' }}
             onClick={() => setReseteando(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md p-6"
               style={{ background: '#1C1D24', borderRadius: '20px', border: '1px solid rgba(222,222,224,0.1)' }}>
            <h3 className="mb-2" style={{ color: '#DEDEE0' }}>Resetear contraseña</h3>
            <p className="text-sm mb-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{reseteando.CORREO}</p>
            <input type="password" value={pwdReset} onChange={(e) => setPwdReset(e.target.value)}
              placeholder="Nueva contraseña (8+ caracteres)"
              className="w-full px-4 py-3 focus:outline-none mb-4" style={inputStyle} />
            <div className="flex gap-3">
              <button onClick={() => setReseteando(null)} className="flex-1 py-3"
                style={{ background: 'rgba(42,43,49,0.5)', borderRadius: '12px', color: '#DEDEE0' }}>Cancelar</button>
              <button onClick={resetearPwd} className="flex-1 py-3"
                style={{ background: '#3B82F6', borderRadius: '12px', color: '#fff' }}>Resetear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
