import { auth, sesion, type Sesion } from './api';

export async function iniciarSesion(correo: string, contrasena: string): Promise<Sesion> {
  const datos = await auth.post<Sesion>('/identidad/login', { correo, contrasena }, { sinAuth: true });
  sesion.guardar(datos);
  return datos;
}

export async function cerrarSesion(): Promise<void> {
  try {
    if (sesion.token()) {
      await auth.post('/identidad/logout');
    }
  } catch {
    // best-effort: si el server no responde, igual limpiamos localmente
  } finally {
    sesion.limpiar();
  }
}

export function tienePermiso(permiso: string): boolean {
  return sesion.usuario()?.permisos?.includes(permiso) ?? false;
}

export function esAdmin(): boolean {
  return sesion.usuario()?.rol_codigo === 'ADMIN';
}
