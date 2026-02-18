import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield, Eye } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  screens: string[]; // Pantallas autorizadas
  reports: string[]; // Reportes autorizados
  color: string;
  createdAt: string;
}

const availablePermissions = [
  'Crear tareas',
  'Editar tareas',
  'Eliminar tareas',
  'Ver reportes',
  'Aprobar solicitudes',
  'Gestionar usuarios',
  'Gestionar unidades',
  'Configurar sistema'
];

const availableScreens = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'approvals', name: 'Aprobaciones' },
  { id: 'users', name: 'Registro/gestión de usuarios' },
  { id: 'units', name: 'Unidades Organizacionales' },
  { id: 'roles', name: 'Roles' },
  { id: 'reports', name: 'Reportes' }
];

const availableReports = [
  { id: 'approved', name: 'Historial de Aprobados' },
  { id: 'productivity', name: 'Productividad por Unidad' },
  { id: 'priority', name: 'Prioridad y Criticidad' },
  { id: 'audit', name: 'Auditoría y Seguridad' }
];

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      permissions: ['Crear tareas', 'Editar tareas', 'Eliminar tareas', 'Ver reportes', 'Aprobar solicitudes', 'Gestionar usuarios', 'Gestionar unidades', 'Configurar sistema'],
      screens: ['dashboard', 'approvals', 'users', 'units', 'roles', 'reports'],
      reports: ['approved', 'productivity', 'priority', 'audit'],
      color: '#9D833E',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Supervisor',
      description: 'Puede aprobar y gestionar tareas',
      permissions: ['Crear tareas', 'Editar tareas', 'Ver reportes', 'Aprobar solicitudes'],
      screens: ['dashboard', 'approvals', 'users', 'units', 'roles', 'reports'],
      reports: ['approved', 'productivity', 'priority', 'audit'],
      color: '#3B82F6',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Usuario',
      description: 'Usuario estándar del sistema',
      permissions: ['Crear tareas', 'Ver reportes'],
      screens: ['dashboard', 'approvals', 'users', 'units', 'roles', 'reports'],
      reports: ['approved', 'productivity', 'priority', 'audit'],
      color: '#10B981',
      createdAt: '2024-02-01'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    screens: [] as string[],
    reports: [] as string[],
    color: '#9D833E'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
        screens: [...role.screens],
        reports: [...role.reports],
        color: role.color
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        permissions: [],
        screens: [],
        reports: [],
        color: '#9D833E'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      screens: [],
      reports: [],
      color: '#9D833E'
    });
  };

  const handleTogglePermission = (permission: string) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    }
  };

  const handleToggleScreen = (screen: string) => {
    if (formData.screens.includes(screen)) {
      setFormData({
        ...formData,
        screens: formData.screens.filter(s => s !== screen)
      });
    } else {
      setFormData({
        ...formData,
        screens: [...formData.screens, screen]
      });
    }
  };

  const handleToggleReport = (report: string) => {
    if (formData.reports.includes(report)) {
      setFormData({
        ...formData,
        reports: formData.reports.filter(r => r !== report)
      });
    } else {
      setFormData({
        ...formData,
        reports: [...formData.reports, report]
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingRole) {
      // Editar rol existente
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: formData.name, description: formData.description, permissions: formData.permissions, screens: formData.screens, reports: formData.reports, color: formData.color }
          : r
      ));
    } else {
      // Crear nuevo rol
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        screens: formData.screens,
        reports: formData.reports,
        color: formData.color,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-6 overflow-auto" style={{ backgroundColor: '#14151A' }}>
      {/* Orbe de luz decorativo */}
      <div 
        className="fixed top-20 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between relative z-10">
        <div>
          <h2 className="flex items-center gap-3" style={{ color: '#DEDEE0' }}>
            <Shield size={32} />
            Roles y Permisos
          </h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Gestiona los roles y sus permisos en el sistema
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
          style={{
            backgroundColor: '#9D833E',
            color: '#14151A',
            borderRadius: '14px',
            boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          <Plus size={20} />
          Nuevo Rol
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 backdrop-blur-xl p-4" style={{
        background: 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(222, 222, 224, 0.15)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
      }}>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
          style={{
            borderRadius: '12px',
            backgroundColor: 'rgba(42, 43, 49, 0.5)',
            borderColor: 'rgba(222, 222, 224, 0.1)',
            color: '#DEDEE0',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#9D833E';
            e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
            e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
          }}
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
              borderRadius: '18px',
              border: '1px solid rgba(222, 222, 224, 0.15)',
              boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Orbe de luz por rol */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${role.color} 0%, transparent 70%)`
              }}
            />

            {/* Border decorativo superior */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-[18px] opacity-50"
              style={{
                background: `linear-gradient(90deg, transparent, ${role.color}, transparent)`
              }}
            />

            {/* Header with icon */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${role.color}25`,
                    border: `1px solid ${role.color}40`,
                    boxShadow: `0 4px 12px ${role.color}20`
                  }}
                >
                  <Shield size={24} style={{ color: role.color }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#DEDEE0', fontSize: '16px' }}>
                    {role.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#DEDEE0', opacity: 0.5 }}>
                    {role.createdAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed relative z-10" style={{ color: '#DEDEE0', opacity: 0.7 }}>
              {role.description}
            </p>

            {/* Permissions Badge */}
            <div className="mb-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                  Permisos ({role.permissions.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.slice(0, 3).map((permission, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs"
                    style={{
                      backgroundColor: `${role.color}20`,
                      color: role.color,
                      borderRadius: '6px',
                      border: `1px solid ${role.color}30`
                    }}
                  >
                    {permission}
                  </span>
                ))}
                {role.permissions.length > 3 && (
                  <span 
                    className="px-2 py-1 text-xs"
                    style={{
                      backgroundColor: 'rgba(222, 222, 224, 0.1)',
                      color: '#DEDEE0',
                      borderRadius: '6px',
                      opacity: 0.7
                    }}
                  >
                    +{role.permissions.length - 3} más
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div 
              className="h-px mb-4 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(222, 222, 224, 0.3), transparent)'
              }}
            />

            {/* Actions */}
            <div className="flex gap-2 relative z-10">
              <button
                onClick={() => handleOpenModal(role)}
                className="flex-1 py-2.5 text-sm font-medium transition-all duration-300 hover:shadow-lg active:scale-[0.98] backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}
              >
                <Edit2 size={14} className="inline mr-2" />
                Editar
              </button>
              <button
                onClick={() => {
                  setRoleToDelete(role.id);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-2.5 text-sm transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div 
          className="flex flex-col items-center justify-center py-16 backdrop-blur-sm rounded-xl"
          style={{
            backgroundColor: 'rgba(28, 29, 36, 0.3)',
            border: '2px dashed rgba(222, 222, 224, 0.1)'
          }}
        >
          <Shield size={64} style={{ color: '#DEDEE0', opacity: 0.3 }} className="mb-4" />
          <p className="text-lg" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            No se encontraron roles
          </p>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={handleCloseModal}
        >
          <div 
            className="w-full max-w-2xl backdrop-blur-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{
              background: 'rgba(28, 29, 36, 0.95)',
              borderRadius: '24px',
              border: '1px solid rgba(222, 222, 224, 0.1)',
              boxShadow: '0 24px 64px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#DEDEE0' }}>
                {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Analista"
                  className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    borderColor: 'rgba(222, 222, 224, 0.1)',
                    color: '#DEDEE0',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9D833E';
                    e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                    e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                  }}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del rol..."
                  rows={3}
                  className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500 resize-none"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    borderColor: 'rgba(222, 222, 224, 0.1)',
                    color: '#DEDEE0',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9D833E';
                    e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                    e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                  }}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Permisos del Rol
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => {
                    const isSelected = formData.permissions.includes(permission);
                    return (
                      <button
                        key={permission}
                        onClick={() => handleTogglePermission(permission)}
                        className="px-4 py-3 text-left transition-all duration-300 active:scale-[0.98]"
                        style={{
                          backgroundColor: isSelected 
                            ? 'rgba(157, 131, 62, 0.2)' 
                            : 'rgba(42, 43, 49, 0.5)',
                          color: isSelected ? '#9D833E' : '#DEDEE0',
                          borderRadius: '10px',
                          border: isSelected 
                            ? '2px solid #9D833E' 
                            : '1px solid rgba(222, 222, 224, 0.1)',
                          fontSize: '14px'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: isSelected ? '#9D833E' : 'transparent',
                              border: isSelected ? 'none' : '2px solid rgba(222, 222, 224, 0.3)'
                            }}
                          >
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="#14151A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span>{permission}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Pantallas Autorizadas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableScreens.map((screen) => {
                    const isSelected = formData.screens.includes(screen.id);
                    return (
                      <button
                        key={screen.id}
                        onClick={() => handleToggleScreen(screen.id)}
                        className="px-4 py-3 text-left transition-all duration-300 active:scale-[0.98]"
                        style={{
                          backgroundColor: isSelected 
                            ? 'rgba(157, 131, 62, 0.2)' 
                            : 'rgba(42, 43, 49, 0.5)',
                          color: isSelected ? '#9D833E' : '#DEDEE0',
                          borderRadius: '10px',
                          border: isSelected 
                            ? '2px solid #9D833E' 
                            : '1px solid rgba(222, 222, 224, 0.1)',
                          fontSize: '14px'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: isSelected ? '#9D833E' : 'transparent',
                              border: isSelected ? 'none' : '2px solid rgba(222, 222, 224, 0.3)'
                            }}
                          >
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="#14151A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span>{screen.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Reportes Autorizados
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableReports.map((report) => {
                    const isSelected = formData.reports.includes(report.id);
                    return (
                      <button
                        key={report.id}
                        onClick={() => handleToggleReport(report.id)}
                        className="px-4 py-3 text-left transition-all duration-300 active:scale-[0.98]"
                        style={{
                          backgroundColor: isSelected 
                            ? 'rgba(157, 131, 62, 0.2)' 
                            : 'rgba(42, 43, 49, 0.5)',
                          color: isSelected ? '#9D833E' : '#DEDEE0',
                          borderRadius: '10px',
                          border: isSelected 
                            ? '2px solid #9D833E' 
                            : '1px solid rgba(222, 222, 224, 0.1)',
                          fontSize: '14px'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: isSelected ? '#9D833E' : 'transparent',
                              border: isSelected ? 'none' : '2px solid rgba(222, 222, 224, 0.3)'
                            }}
                          >
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="#14151A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span>{report.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Color Identificador
                </label>
                <div className="flex gap-3">
                  {['#9D833E', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className="w-12 h-12 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid #DEDEE0' : '1px solid rgba(222, 222, 224, 0.2)',
                        transform: formData.color === color ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    color: '#DEDEE0',
                    borderRadius: '14px',
                    border: '1px solid rgba(222, 222, 224, 0.1)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                  style={{
                    backgroundColor: '#9D833E',
                    color: '#14151A',
                    borderRadius: '14px',
                    boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="w-full max-w-md backdrop-blur-xl p-6"
            style={{
              background: 'rgba(28, 29, 36, 0.95)',
              borderRadius: '24px',
              border: '1px solid rgba(222, 222, 224, 0.1)',
              boxShadow: '0 24px 64px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#DEDEE0' }}>Confirmar Eliminación</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#DEDEE0', opacity: 0.8 }} className="mb-6">
              ¿Está seguro de que desea eliminar este rol?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 transition-all duration-300 active:scale-[0.97]"
                style={{
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  color: '#DEDEE0',
                  borderRadius: '14px',
                  border: '1px solid rgba(222, 222, 224, 0.1)'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (roleToDelete) {
                    handleDelete(roleToDelete);
                  }
                }}
                className="flex-1 py-3 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                style={{
                  backgroundColor: '#9D833E',
                  color: '#14151A',
                  borderRadius: '14px',
                  boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}