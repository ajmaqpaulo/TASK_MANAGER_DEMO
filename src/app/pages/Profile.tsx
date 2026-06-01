import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { auth, ApiError, sesion } from '@/lib/api';
import { cerrarSesion } from '@/lib/auth';
import logo from '@/assets/aae02afcf95717fd7154788982f1cae7f0997dcb.png';

interface Perfil {
  id: string;
  nombre_completo: string;
  correo: string;
  unidad_nombre: string;
  unidad_codigo: string;
  rol_nombre: string;
  rol_codigo: string;
  ultimo_acceso: string | null;
}

const inputStyle: React.CSSProperties = {
  borderRadius: '14px',
  backgroundColor: 'rgba(42, 43, 49, 0.5)',
  borderColor: 'rgba(222, 222, 224, 0.1)',
  color: '#DEDEE0',
  borderWidth: '1px',
  borderStyle: 'solid',
  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
};

export default function Profile() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  const [pwdActual, setPwdActual] = useState('');
  const [pwdNueva, setPwdNueva] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [cambiando, setCambiando] = useState(false);

  useEffect(() => {
    auth.get<Perfil>('/identidad/perfil')
      .then(setPerfil)
      .catch((e) => toast.error(e instanceof ApiError ? e.message : 'No se pudo cargar el perfil'))
      .finally(() => setCargando(false));
  }, []);

  const handleCambiar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdNueva.length < 8) { toast.error('La nueva contraseña debe tener al menos 8 caracteres'); return; }
    if (pwdNueva !== pwdConfirm) { toast.error('Las contraseñas nuevas no coinciden'); return; }
    setCambiando(true);
    try {
      await auth.post('/identidad/cambiar-contrasena', { contrasena_actual: pwdActual, contrasena_nueva: pwdNueva });
      toast.success('Contraseña actualizada');
      setPwdActual(''); setPwdNueva(''); setPwdConfirm('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña');
    } finally { setCambiando(false); }
  };

  const handleLogout = async () => {
    await cerrarSesion();
    toast.success('Sesión cerrada');
    navigate('/');
  };

  if (cargando) {
    return (
      <div className="size-full grid place-items-center" style={{ backgroundColor: '#14151A', color: '#DEDEE0' }}>
        Cargando…
      </div>
    );
  }

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-20 h-20" />
          </div>
          <h2 style={{ color: '#DEDEE0' }}>Mi Perfil</h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            {perfil?.correo}
          </p>
        </div>

        {/* Datos (read-only) */}
        <div className="backdrop-blur-xl p-6 mb-6 space-y-4" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
        }}>
          <Field label="Nombre completo" value={perfil?.nombre_completo ?? '—'} />
          <Field label="Correo electrónico" value={perfil?.correo ?? '—'} />
          <Field label="Unidad organizacional" value={perfil?.unidad_nombre ?? '—'} />
          <Field label="Rol" value={perfil?.rol_nombre ?? '—'} />
          <Field label="Último acceso" value={perfil?.ultimo_acceso ? new Date(perfil.ultimo_acceso).toLocaleString('es-GT') : '—'} />
          <p className="text-xs" style={{ color: '#DEDEE0', opacity: 0.5 }}>
            Para modificar estos datos contactá al administrador del sistema.
          </p>
        </div>

        {/* Cambio de contraseña */}
        <form onSubmit={handleCambiar} className="backdrop-blur-xl p-6 mb-6 space-y-4" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
        }}>
          <h3 style={{ color: '#DEDEE0' }}>Cambiar contraseña</h3>

          <PwdInput label="Contraseña actual" value={pwdActual} onChange={setPwdActual} />
          <PwdInput label="Nueva contraseña" value={pwdNueva} onChange={setPwdNueva} />
          <PwdInput label="Confirmar nueva" value={pwdConfirm} onChange={setPwdConfirm} />

          <button
            type="submit"
            disabled={cambiando}
            className="w-full py-4 mt-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#9D833E', color: '#14151A', borderRadius: '14px',
              boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' }}
          >
            {cambiando ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full py-4 transition-all duration-300 active:scale-[0.97]"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
            borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#9D833E' }}>{label}</p>
      <p style={{ color: '#DEDEE0' }}>{value}</p>
    </div>
  );
}

function PwdInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block mb-2 text-sm" style={{ color: '#DEDEE0', opacity: 0.8 }}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 focus:outline-none"
        style={inputStyle}
      />
    </div>
  );
}
