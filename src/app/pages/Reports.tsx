import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Users, AlertTriangle, Shield, FileDown, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Report {
  id: string;
  name: string;
  type: 'approved' | 'productivity' | 'priority' | 'audit';
  description: string;
  generatedDate: string;
  recordCount: number;
}

export default function Reports() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Estados de filtros
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Historial de Aprobados',
      type: 'approved',
      description: 'Reporte completo de todas las tareas aprobadas en el sistema',
      generatedDate: '2026-02-12',
      recordCount: 145
    },
    {
      id: '2',
      name: 'Reportes de Productividad por Unidad',
      type: 'productivity',
      description: 'Análisis de productividad y rendimiento de cada unidad organizacional',
      generatedDate: '2026-02-12',
      recordCount: 98
    },
    {
      id: '3',
      name: 'Reportes de Prioridad y Criticidad',
      type: 'priority',
      description: 'Distribución de tareas por nivel de prioridad y estado crítico',
      generatedDate: '2026-02-12',
      recordCount: 234
    },
    {
      id: '4',
      name: 'Reportes de Auditoría y Seguridad',
      type: 'audit',
      description: 'Reporte de auditoría de accesos, cambios y cumplimiento en el sistema',
      generatedDate: '2026-02-12',
      recordCount: 567
    }
  ]);

  // Aplicar filtros
  const filteredReports = reports.filter(report => {
    // Filtro por búsqueda de texto
    if (searchTerm && !report.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);
  
  const handleClearFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'approved':
        return {
          icon: FileText,
          label: 'Historial de Aprobados',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.2)'
        };
      case 'productivity':
        return {
          icon: Users,
          label: 'Productividad por Unidad',
          color: '#3B82F6',
          bgColor: 'rgba(59, 130, 246, 0.2)'
        };
      case 'priority':
        return {
          icon: AlertTriangle,
          label: 'Prioridad y Criticidad',
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.2)'
        };
      case 'audit':
        return {
          icon: Shield,
          label: 'Auditoría y Seguridad',
          color: '#8B5CF6',
          bgColor: 'rgba(139, 92, 246, 0.2)'
        };
      default:
        return {
          icon: FileText,
          label: 'Reporte',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.2)'
        };
    }
  };

  const handleDownload = (report: Report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header con diseño premium
    doc.setFillColor(20, 21, 26); // #14151A
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(157, 131, 62); // #9D833E - Color dorado
    doc.setFontSize(24);
    doc.text('Sistema de Gestión', pageWidth / 2, 20, { align: 'center' });
    
    doc.setTextColor(222, 222, 224); // #DEDEE0
    doc.setFontSize(12);
    doc.text('Centro de Reportes', pageWidth / 2, 30, { align: 'center' });
    
    // Información del reporte
    doc.setTextColor(20, 21, 26);
    doc.setFontSize(18);
    doc.text(report.name, 14, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tipo: ${getTypeConfig(report.type).label}`, 14, 65);
    doc.text(`Fecha de generación: ${new Date(report.generatedDate).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 14, 72);
    doc.text(`Total de registros: ${report.recordCount.toLocaleString()}`, 14, 79);
    
    // Descripción
    doc.setFontSize(9);
    const splitDescription = doc.splitTextToSize(report.description, pageWidth - 28);
    doc.text(splitDescription, 14, 88);
    
    // Generar datos de muestra según el tipo de reporte
    let tableData: any[] = [];
    let tableHeaders: string[] = [];
    
    switch (report.type) {
      case 'approved':
        tableHeaders = ['ID', 'Tarea', 'Usuario', 'Fecha Aprobación', 'Estado'];
        tableData = Array.from({ length: 10 }, (_, i) => [
          `APR-${1000 + i}`,
          `Tarea de ejemplo ${i + 1}`,
          `Usuario ${i + 1}`,
          new Date(2026, 1, Math.floor(Math.random() * 12) + 1).toLocaleDateString('es-ES'),
          'Aprobado'
        ]);
        break;
        
      case 'productivity':
        tableHeaders = ['Unidad', 'Tareas Completadas', 'En Progreso', 'Rendimiento', 'Eficiencia'];
        tableData = [
          ['Desarrollo', '45', '12', '94%', 'Alta'],
          ['Diseño', '38', '8', '92%', 'Alta'],
          ['Marketing', '52', '15', '89%', 'Media'],
          ['Ventas', '67', '20', '95%', 'Alta'],
          ['Soporte', '83', '25', '88%', 'Media'],
          ['Operaciones', '41', '10', '91%', 'Alta'],
          ['Recursos Humanos', '29', '7', '87%', 'Media'],
          ['Finanzas', '35', '9', '93%', 'Alta']
        ];
        break;
        
      case 'priority':
        tableHeaders = ['Tarea', 'Prioridad', 'Criticidad', 'Estado', 'Asignado'];
        tableData = [
          ['Actualización de seguridad', 'Alta', 'Crítico', 'En Progreso', 'Usuario 1'],
          ['Revisión de código', 'Media', 'Normal', 'Pendiente', 'Usuario 2'],
          ['Implementar API', 'Alta', 'Alto', 'En Progreso', 'Usuario 3'],
          ['Documentación', 'Baja', 'Bajo', 'Completado', 'Usuario 4'],
          ['Testing', 'Media', 'Normal', 'En Progreso', 'Usuario 5'],
          ['Deployment', 'Alta', 'Crítico', 'Pendiente', 'Usuario 6'],
          ['Optimización', 'Media', 'Normal', 'En Progreso', 'Usuario 7'],
          ['Refactoring', 'Baja', 'Bajo', 'Pendiente', 'Usuario 8']
        ];
        break;
        
      case 'audit':
        tableHeaders = ['Fecha/Hora', 'Usuario', 'Acción', 'Módulo', 'IP Address'];
        tableData = Array.from({ length: 10 }, (_, i) => [
          `12/02/2026 ${10 + i}:${Math.floor(Math.random() * 60)}`,
          `Usuario ${i + 1}`,
          ['Login', 'Logout', 'Crear', 'Actualizar', 'Eliminar'][Math.floor(Math.random() * 5)],
          ['Dashboard', 'Registro', 'Aprobaciones', 'Reportes'][Math.floor(Math.random() * 4)],
          `192.168.1.${Math.floor(Math.random() * 255)}`
        ]);
        break;
    }
    
    // Agregar tabla con estilo profesional
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 100,
      theme: 'striped',
      headStyles: {
        fillColor: [157, 131, 62], // #9D833E - Color dorado
        textColor: [20, 21, 26], // #14151A - Texto negro
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [20, 21, 26],
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 100 }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        'Confidencial - Uso interno únicamente',
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }
    
    // Descargar el PDF
    doc.save(`${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleView = (report: Report) => {
    console.log('Visualizando reporte:', report.name);
    // Aquí iría la lógica para abrir el reporte
  };

  // Calcular estadísticas
  const stats = {
    approved: reports.filter(r => r.type === 'approved').length,
    productivity: reports.filter(r => r.type === 'productivity').length,
    priority: reports.filter(r => r.type === 'priority').length,
    audit: reports.filter(r => r.type === 'audit').length
  };

  return (
    <div className="h-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 style={{ color: '#DEDEE0' }}>Centro de Reportes</h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Accede y descarga reportes del sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-5 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                <FileText size={24} style={{ color: '#10B981' }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#DEDEE0', opacity: 0.6 }}>Aprobados</p>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="p-5 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
                <Users size={24} style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#DEDEE0', opacity: 0.6 }}>Productividad</p>
                <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>{stats.productivity}</p>
              </div>
            </div>
          </div>

          <div className="p-5 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                <AlertTriangle size={24} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#DEDEE0', opacity: 0.6 }}>Criticidad</p>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>{stats.priority}</p>
              </div>
            </div>
          </div>

          <div className="p-5 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
                <Shield size={24} style={{ color: '#8B5CF6' }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#DEDEE0', opacity: 0.6 }}>Auditoría</p>
                <p className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>{stats.audit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="backdrop-blur-xl p-6 mb-6" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}>
          {/* Buscador */}
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" 
              style={{ color: '#DEDEE0', opacity: 0.5 }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-12 pr-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
              style={{
                borderRadius: '14px',
                backgroundColor: 'rgba(42, 43, 49, 0.5)',
                borderColor: 'rgba(222, 222, 224, 0.1)',
                color: '#DEDEE0',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="backdrop-blur-xl overflow-hidden" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.1)' }}>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Nombre del Reporte</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Tipo</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Descripción</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Registros</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Fecha</th>
                  <th className="px-6 py-4 text-right" style={{ color: '#DEDEE0', opacity: 0.8 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => {
                  const typeConfig = getTypeConfig(report.type);
                  const Icon = typeConfig.icon;
                  return (
                    <tr 
                      key={report.id} 
                      className="transition-colors duration-200"
                      style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.05)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(42, 43, 49, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className="px-6 py-4" style={{ color: '#DEDEE0' }}>
                        <div className="font-medium">{report.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 px-3 py-2 w-fit" style={{
                          backgroundColor: typeConfig.bgColor,
                          borderRadius: '8px',
                          border: `1px solid ${typeConfig.color}30`
                        }}>
                          <Icon size={16} style={{ color: typeConfig.color }} />
                          <span className="text-sm" style={{ color: typeConfig.color }}>
                            {typeConfig.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs" style={{ color: '#DEDEE0', opacity: 0.7 }}>
                        {report.description}
                      </td>
                      <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                        {report.recordCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                        {new Date(report.generatedDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDownload(report)}
                            className="p-2.5 transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              color: '#EF4444',
                              borderRadius: '8px',
                              border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                            title="Descargar PDF"
                          >
                            <FileDown size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid rgba(222, 222, 224, 0.1)' }}>
              <p style={{ color: '#DEDEE0', opacity: 0.6 }}>
                Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, reports.length)} de {reports.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 transition-all duration-200 disabled:opacity-30"
                  style={{
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    color: '#DEDEE0',
                    borderRadius: '8px',
                    border: '1px solid rgba(222, 222, 224, 0.1)'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="px-4 py-2 transition-all duration-200"
                    style={{
                      backgroundColor: currentPage === page ? '#9D833E' : 'rgba(42, 43, 49, 0.5)',
                      color: currentPage === page ? '#14151A' : '#DEDEE0',
                      borderRadius: '8px',
                      border: `1px solid ${currentPage === page ? '#9D833E' : 'rgba(222, 222, 224, 0.1)'}`,
                      boxShadow: currentPage === page 
                        ? '0 4px 16px 0 rgba(157, 131, 62, 0.4)' 
                        : 'none'
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 transition-all duration-200 disabled:opacity-30"
                  style={{
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    color: '#DEDEE0',
                    borderRadius: '8px',
                    border: '1px solid rgba(222, 222, 224, 0.1)'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}