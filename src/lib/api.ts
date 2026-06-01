// Capa HTTP del frontend.
// En dev, vite proxy redirige /api/auth → :4000 y /api/tareas → :5000.
// En producción, leer base URL de env (VITE_AUTH_URL, VITE_TAREAS_URL) o servir behind un reverse proxy.

const AUTH_BASE = import.meta.env.VITE_AUTH_URL || '';
const TAREAS_BASE = import.meta.env.VITE_TAREAS_URL || '';

const STORAGE_KEY = 'tm_session';

export interface Sesion {
  access_token: string;
  refresh_token: string;
  expira_en: string;
  usuario: {
    id: string;
    nombre_completo: string;
    correo: string;
    rol_codigo: string;
    rol_nombre: string;
    rol_id: string;
    unidad_id: string;
    unidad_codigo: string;
    unidad_nombre: string;
    permisos: string[];
    pantallas: string[];
    reportes: string[];
    ultimo_acceso: string | null;
  };
}

export const sesion = {
  obtener(): Sesion | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Sesion : null;
    } catch { return null; }
  },
  guardar(s: Sesion) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); },
  limpiar() { localStorage.removeItem(STORAGE_KEY); },
  token(): string | null { return this.obtener()?.access_token ?? null; },
  usuario() { return this.obtener()?.usuario ?? null; },
};

type EnvelopeOk<T>  = { exito: true;  mensaje: string; datos: T;    marca_tiempo: string; };
type EnvelopeErr    = { exito: false; mensaje: string; datos: null; marca_tiempo: string; };
type Envelope<T>    = EnvelopeOk<T> | EnvelopeErr;

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'ApiError'; }
}

type Servicio = 'auth' | 'tareas';

async function pedir<T>(
  servicio: Servicio,
  ruta: string,
  init?: RequestInit & { sinAuth?: boolean }
): Promise<T> {
  const base = servicio === 'auth' ? AUTH_BASE : TAREAS_BASE;
  const prefijo = servicio === 'auth' ? '/api/auth' : '/api/tareas';
  const url = `${base}${prefijo}${ruta}`;

  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json');
  if (!init?.sinAuth) {
    const tok = sesion.token();
    if (tok) headers.set('Authorization', `Bearer ${tok}`);
  }

  const res = await fetch(url, { ...init, headers });
  let cuerpo: Envelope<T> | null = null;
  try { cuerpo = await res.json() as Envelope<T>; } catch { /* no envelope */ }

  if (res.status === 401 && !ruta.startsWith('/identidad/login') && !ruta.startsWith('/identidad/refresh')) {
    sesion.limpiar();
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  if (!res.ok || (cuerpo && cuerpo.exito === false)) {
    const msg = cuerpo?.mensaje || `HTTP ${res.status}`;
    throw new ApiError(res.status, msg);
  }
  return (cuerpo as EnvelopeOk<T>).datos;
}

export const auth = {
  get:   <T>(ruta: string)              => pedir<T>('auth', ruta),
  post:  <T>(ruta: string, body?: any, opts?: { sinAuth?: boolean }) =>
            pedir<T>('auth', ruta, { method: 'POST', body: body ? JSON.stringify(body) : undefined, sinAuth: opts?.sinAuth }),
  put:   <T>(ruta: string, body?: any)  => pedir<T>('auth', ruta, { method: 'PUT',    body: body ? JSON.stringify(body) : undefined }),
  del:   <T>(ruta: string)              => pedir<T>('auth', ruta, { method: 'DELETE' }),
};

export const tareas = {
  get:   <T>(ruta: string)             => pedir<T>('tareas', ruta),
  post:  <T>(ruta: string, body?: any) => pedir<T>('tareas', ruta, { method: 'POST',   body: body ? JSON.stringify(body) : undefined }),
  put:   <T>(ruta: string, body?: any) => pedir<T>('tareas', ruta, { method: 'PUT',    body: body ? JSON.stringify(body) : undefined }),
  del:   <T>(ruta: string)             => pedir<T>('tareas', ruta, { method: 'DELETE' }),
};
