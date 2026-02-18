import { useState } from 'react';
import { Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Approval {
  id: string;
  taskTitle: string;
  requester: string;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: '1',
      taskTitle: 'Contratación de 3 desarrolladores',
      requester: 'María González',
      unit: 'RRHH',
      priority: 'high',
      requestedAt: '2026-02-11',
      status: 'pending'
    },
    {
      id: '2',
      taskTitle: 'Compra de licencias de software',
      requester: 'Carlos Mendoza',
      unit: 'BI',
      priority: 'medium',
      requestedAt: '2026-02-10',
      status: 'pending'
    },
    {
      id: '3',
      taskTitle: 'Aprobación de presupuesto marketing',
      requester: 'Ana Torres',
      unit: 'Finanzas',
      priority: 'high',
      requestedAt: '2026-02-09',
      status: 'approved'
    },
    {
      id: '4',
      taskTitle: 'Renovación de equipos de oficina',
      requester: 'Luis Ramírez',
      unit: 'Administración',
      priority: 'medium',
      requestedAt: '2026-02-08',
      status: 'pending'
    },
    {
      id: '5',
      taskTitle: 'Capacitación en nuevas tecnologías',
      requester: 'Sandra López',
      unit: 'RRHH',
      priority: 'low',
      requestedAt: '2026-02-07',
      status: 'pending'
    },
    {
      id: '6',
      taskTitle: 'Auditoría financiera trimestral',
      requester: 'Roberto Díaz',
      unit: 'Finanzas',
      priority: 'high',
      requestedAt: '2026-02-06',
      status: 'pending'
    },
    {
      id: '7',
      taskTitle: 'Implementación de sistema CRM',
      requester: 'Patricia Vargas',
      unit: 'BI',
      priority: 'high',
      requestedAt: '2026-02-05',
      status: 'pending'
    },
    {
      id: '8',
      taskTitle: 'Campaña de beneficios',
      requester: 'Jorge Sánchez',
      unit: 'RRHH',
      priority: 'medium',
      requestedAt: '2026-02-04',
      status: 'rejected'
    }
  ]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterUnit, setFilterUnit] = useState('');

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'approved' as const } : a
    ));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'rejected' as const } : a
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Aplicar filtros a pendingApprovals
  const filteredPendingApprovals = approvals
    .filter(a => a.status === 'pending')
    .filter(approval => {
      // Filtro por búsqueda de texto
      if (searchTerm && 
          !approval.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !approval.requester.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por prioridad
      if (filterPriority && approval.priority !== filterPriority) {
        return false;
      }
      
      // Filtro por unidad
      if (filterUnit && approval.unit !== filterUnit) {
        return false;
      }
      
      return true;
    });

  const totalPages = Math.ceil(filteredPendingApprovals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPending = filteredPendingApprovals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 style={{ color: '#DEDEE0' }}>Centro de Aprobaciones</h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Supervisor Inbox - Gestiona las solicitudes pendientes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-6 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
                <Clock size={28} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>Pendientes</p>
                <p className="text-3xl font-bold" style={{ color: '#F59E0B' }}>
                  {approvals.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                <CheckCircle size={28} style={{ color: '#10B981' }} />
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>Aprobadas</p>
                <p className="text-3xl font-bold" style={{ color: '#10B981' }}>
                  {approvals.filter(a => a.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 backdrop-blur-md" style={{
            background: 'rgba(28, 29, 36, 0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.1)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                <XCircle size={28} style={{ color: '#EF4444' }} />
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>Rechazadas</p>
                <p className="text-3xl font-bold" style={{ color: '#EF4444' }}>
                  {approvals.filter(a => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Table */}
        {filteredPendingApprovals.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4" style={{ color: '#DEDEE0' }}>
              Solicitudes Pendientes
            </h3>

            {/* Filtros */}
            <div className="backdrop-blur-xl p-6 mb-6" style={{
              background: 'rgba(28, 29, 36, 0.7)',
              borderRadius: '24px',
              border: '1px solid rgba(222, 222, 224, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            }}>
              <div className="grid grid-cols-3 gap-4">
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
                    placeholder="Buscar por tarea o solicitante..."
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

                {/* Filtro Prioridad */}
                <select
                  value={filterPriority}
                  onChange={(e) => {
                    setFilterPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(28, 29, 36, 0.8)',
                    borderColor: 'rgba(157, 131, 62, 0.3)',
                    color: filterPriority ? '#DEDEE0' : 'rgba(222, 222, 224, 0.5)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%239D833E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '14px',
                    fontSize: '14px',
                    letterSpacing: '0.3px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9D833E';
                    e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(157, 131, 62, 0.3)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1C1D24', color: 'rgba(222, 222, 224, 0.5)' }}>Todas las prioridades</option>
                  <option value="high" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Alta</option>
                  <option value="medium" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Media</option>
                  <option value="low" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Baja</option>
                </select>

                {/* Filtro Unidad */}
                <select
                  value={filterUnit}
                  onChange={(e) => {
                    setFilterUnit(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(28, 29, 36, 0.8)',
                    borderColor: 'rgba(157, 131, 62, 0.3)',
                    color: filterUnit ? '#DEDEE0' : 'rgba(222, 222, 224, 0.5)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%239D833E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '14px',
                    fontSize: '14px',
                    letterSpacing: '0.3px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9D833E';
                    e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(157, 131, 62, 0.3)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1C1D24', color: 'rgba(222, 222, 224, 0.5)' }}>Todas las unidades</option>
                  <option value="RRHH" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>RRHH</option>
                  <option value="Finanzas" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Finanzas</option>
                  <option value="BI" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>BI</option>
                  <option value="Administración" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Administración</option>
                </select>
              </div>
            </div>
            
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
                      <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Tarea</th>
                      <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Solicitante</th>
                      <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Unidad</th>
                      <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Prioridad</th>
                      <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Fecha</th>
                      <th className="px-6 py-4 text-right" style={{ color: '#DEDEE0', opacity: 0.8 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPending.map((approval) => (
                      <tr 
                        key={approval.id} 
                        className="transition-colors duration-200"
                        style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.05)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(42, 43, 49, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className="px-6 py-4" style={{ color: '#DEDEE0' }}>{approval.taskTitle}</td>
                        <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{approval.requester}</td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-3 py-1 text-sm"
                            style={{
                              backgroundColor: 'rgba(157, 131, 62, 0.2)',
                              color: '#9D833E',
                              borderRadius: '8px',
                              border: '1px solid rgba(157, 131, 62, 0.3)'
                            }}
                          >
                            {approval.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-3 py-1 text-sm"
                            style={{
                              backgroundColor: `${getPriorityColor(approval.priority)}20`,
                              color: getPriorityColor(approval.priority),
                              borderRadius: '8px',
                              border: `1px solid ${getPriorityColor(approval.priority)}30`
                            }}
                          >
                            {approval.priority === 'high' ? 'Alta' : approval.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                          {new Date(approval.requestedAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(approval.id)}
                              className="px-4 py-2 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                color: '#EF4444',
                                borderRadius: '8px',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              <XCircle size={16} />
                              Rechazar
                            </button>
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="px-4 py-2 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2"
                              style={{
                                backgroundColor: '#9D833E',
                                color: '#14151A',
                                borderRadius: '8px',
                                boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              <CheckCircle size={16} />
                              Aprobar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid rgba(222, 222, 224, 0.1)' }}>
                  <p style={{ color: '#DEDEE0', opacity: 0.6 }}>
                    Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPendingApprovals.length)} de {filteredPendingApprovals.length}
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
        )}
      </div>
    </div>
  );
}