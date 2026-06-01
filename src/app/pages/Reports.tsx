import { useEffect, useState } from 'react';
import { FileText, Download, BarChart3, Shield, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { tareas, ApiError } from '@/lib/api';

interface Contadores {
  reportes_aprobados: number;
  reportes_productividad: number;
  reportes_criticidad: number;
  reportes_auditoria: number;
}

interface Reporte {
  codigo: string;
  titulo: string;
  descripcion: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  contadorKey?: keyof Contadores;
}

const REPORTES: Reporte[] = [
  {
    codigo: 'RPT_SOLICITUDES_APROBADAS',
    titulo: 'Solicitudes aprobadas',
    descripcion: 'Listado de solicitudes aprobadas en el período',
    icon: FileText, color: '#10B981', contadorKey: 'reportes_aprobados',
  },
  {
    codigo: 'RPT_PRODUCTIVIDAD_UNIDAD',
    titulo: 'Productividad por unidad',
    descripcion: 'Tareas creadas/completadas por unidad',
    icon: BarChart3, color: '#9D833E', contadorKey: 'reportes_productividad',
  },
  {
    codigo: 'RPT_PRIORIDAD_CRITICIDAD',
    titulo: 'Prioridad y criticidad',
    descripcion: 'Distribución por nivel de prioridad',
    icon: AlertTriangle, color: '#F59E0B', contadorKey: 'reportes_criticidad',
  },
  {
    codigo: 'RPT_AUDITORIA_SISTEMA',
    titulo: 'Auditoría del sistema',
    descripcion: 'Acciones registradas por usuarios',
    icon: Shield, color: '#3B82F6', contadorKey: 'reportes_auditoria',
  },
  {
    codigo: 'RPT_SOLICITUDES_RECHAZADAS',
    titulo: 'Solicitudes rechazadas',
    descripcion: 'Listado de solicitudes rechazadas con motivo',
    icon: XCircle, color: '#EF4444',
  },
];

export default function Reports() {
  const [contadores, setContadores] = useState<Contadores | null>(null);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState<string | null>(null);

  useEffect(() => {
    tareas.get<Contadores>('/reportes/contadores')
      .then(setContadores)
      .catch((e) => toast.error(e instanceof ApiError ? e.message : 'No se pudieron cargar contadores'))
      .finally(() => setCargando(false));
  }, []);

  const generarPDF = async (rep: Reporte) => {
    setGenerando(rep.codigo);
    try {
      const resultado = await tareas.get<{ codigo: string; nombre_sp: string; registros: number; datos: any }>(
        `/reportes/ejecutar/${rep.codigo}`,
      );

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(rep.titulo, 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado: ${new Date().toLocaleString('es-GT')}`, 14, 25);
      doc.text(`Registros: ${resultado.registros}`, 14, 30);

      const rs: any[] = Array.isArray(resultado.datos[0]) ? resultado.datos[0] : resultado.datos;
      if (rs.length > 0) {
        const cols = Object.keys(rs[0]);
        autoTable(doc, {
          head: [cols],
          body: rs.map((r: any) => cols.map((c) => {
            const v = r[c];
            if (v == null) return '';
            if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString('es-GT');
            return String(v);
          })),
          startY: 36,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [157, 131, 62] },
        });
      } else {
        doc.text('Sin datos en el período.', 14, 40);
      }

      doc.save(`${rep.codigo}_${Date.now()}.pdf`);
      toast.success(`Reporte ${rep.titulo} generado`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo generar el reporte');
    } finally { setGenerando(null); }
  };

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 style={{ color: '#DEDEE0' }}>Reportes</h2>
          <p className="mt-1 text-sm" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Exportá información del sistema a PDF
          </p>
        </div>

        {cargando ? (
          <div className="text-center py-12" style={{ color: '#DEDEE0', opacity: 0.6 }}>Cargando…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORTES.map((rep) => {
              const Icon = rep.icon;
              const conteo = rep.contadorKey && contadores ? contadores[rep.contadorKey] : null;
              return (
                <div key={rep.codigo} className="p-6"
                  style={{
                    background: 'rgba(28, 29, 36, 0.7)',
                    borderRadius: '20px',
                    border: '1px solid rgba(222, 222, 224, 0.1)',
                  }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 grid place-items-center rounded-xl"
                      style={{ background: `${rep.color}20`, color: rep.color }}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base" style={{ color: '#DEDEE0' }}>{rep.titulo}</h3>
                      <p className="text-xs mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>{rep.descripcion}</p>
                    </div>
                  </div>

                  {conteo !== null && (
                    <p className="text-2xl mb-4" style={{ color: rep.color }}>{conteo} registros</p>
                  )}

                  <button onClick={() => generarPDF(rep)} disabled={generando === rep.codigo}
                    className="w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                    style={{
                      background: rep.color, color: '#14151A',
                      borderRadius: '12px',
                    }}>
                    <Download size={16} />
                    {generando === rep.codigo ? 'Generando…' : 'Descargar PDF'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
