import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  unit: string;
  role: string;
  createdAt: string;
}

export default function Register() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@empresa.com', unit: 'RRHH', role: 'Supervisor', createdAt: '2024-01-15' },
    { id: 2, name: 'María García', email: 'maria@empresa.com', unit: 'Finanzas', role: 'Usuario Estándar', createdAt: '2024-01-20' },
    { id: 3, name: 'Carlos López', email: 'carlos@empresa.com', unit: 'BI', role: 'Usuario Estándar', createdAt: '2024-02-01' },
    { id: 4, name: 'Ana Martínez', email: 'ana@empresa.com', unit: 'RRHH', role: 'Usuario Estándar', createdAt: '2024-02-05' },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@empresa.com', unit: 'Finanzas', role: 'Supervisor', createdAt: '2024-02-10' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState('');
  const [role, setRole] = useState('');

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = !filterUnit || user.unit === filterUnit;
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesUnit && matchesRole;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setUnit(user.unit === 'RRHH' ? 'rrhh' : user.unit === 'Finanzas' ? 'finanzas' : 'bi');
      setRole(user.role === 'Supervisor' ? 'supervisor' : 'standard');
    } else {
      setEditingUser(null);
      setName('');
      setEmail('');
      setUnit('');
      setRole('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setName('');
    setEmail('');
    setUnit('');
    setRole('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const unitLabel = unit === 'rrhh' ? 'RRHH' : unit === 'finanzas' ? 'Finanzas' : 'BI';
    const roleLabel = role === 'supervisor' ? 'Supervisor' : 'Usuario Estándar';

    if (editingUser) {
      // Editar usuario existente
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name, email, unit: unitLabel, role: roleLabel }
          : u
      ));
    } else {
      // Agregar nuevo usuario
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name,
        email,
        unit: unitLabel,
        role: roleLabel,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      setUsers(users.filter(u => u.id !== deletingUser.id));
    }
    handleCloseDeleteModal();
  };

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ color: '#DEDEE0' }}>Gestión de Usuarios</h2>
            <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} registrado{filteredUsers.length !== 1 ? 's' : ''}
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
            <Plus size={20} strokeWidth={2.5} />
            Agregar Usuario
          </button>
        </div>

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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
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

            {/* Filtro Unidad */}
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
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
            </select>

            {/* Filtro Rol */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
              style={{
                borderRadius: '14px',
                backgroundColor: 'rgba(28, 29, 36, 0.8)',
                borderColor: 'rgba(157, 131, 62, 0.3)',
                color: filterRole ? '#DEDEE0' : 'rgba(222, 222, 224, 0.5)',
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
              <option value="" style={{ backgroundColor: '#1C1D24', color: 'rgba(222, 222, 224, 0.5)' }}>Todos los roles</option>
              <option value="Usuario Estándar" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Usuario Estándar</option>
              <option value="Supervisor" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Supervisor</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
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
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Nombre</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Email</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Unidad</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Rol</th>
                  <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Fecha Registro</th>
                  <th className="px-6 py-4 text-right" style={{ color: '#DEDEE0', opacity: 0.8 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="transition-colors duration-200"
                    style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.05)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(42, 43, 49, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-6 py-4" style={{ color: '#DEDEE0' }}>{user.name}</td>
                    <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{user.email}</td>
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
                        {user.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1 text-sm"
                        style={{
                          backgroundColor: user.role === 'Supervisor' 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(222, 222, 224, 0.1)',
                          color: user.role === 'Supervisor' ? '#3B82F6' : '#DEDEE0',
                          borderRadius: '8px',
                          border: `1px solid ${user.role === 'Supervisor' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(222, 222, 224, 0.2)'}`
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.6 }}>{user.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            color: '#3B82F6',
                            borderRadius: '8px',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            color: '#EF4444',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          <Trash2 size={16} />
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
                Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de {filteredUsers.length}
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

      {/* Modal Agregar/Editar Usuario */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={handleCloseModal}
        >
          <div 
            className="w-full max-w-2xl backdrop-blur-xl p-6"
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
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de Nombre */}
              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa el nombre"
                  required
                  className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
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

              {/* Campo de Correo */}
              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  required
                  className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
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

              {/* Selector de Unidad Organizacional */}
              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Unidad Organizacional
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(28, 29, 36, 0.8)',
                    borderColor: 'rgba(157, 131, 62, 0.3)',
                    color: unit ? '#DEDEE0' : 'rgba(222, 222, 224, 0.5)',
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
                  <option value="" disabled style={{ backgroundColor: '#1C1D24', color: 'rgba(222, 222, 224, 0.5)' }}>Selecciona una unidad</option>
                  <option value="rrhh" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>RRHH</option>
                  <option value="finanzas" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Finanzas</option>
                  <option value="bi" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>BI</option>
                </select>
              </div>

              {/* Selector de Rol */}
              <div>
                <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  Rol
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(28, 29, 36, 0.8)',
                    borderColor: 'rgba(157, 131, 62, 0.3)',
                    color: role ? '#DEDEE0' : 'rgba(222, 222, 224, 0.5)',
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
                  <option value="" disabled style={{ backgroundColor: '#1C1D24', color: 'rgba(222, 222, 224, 0.5)' }}>Selecciona un rol</option>
                  <option value="standard" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Usuario Estándar</option>
                  <option value="supervisor" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0', padding: '12px', fontWeight: '500' }}>Supervisor</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-4 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    color: '#DEDEE0',
                    borderRadius: '14px',
                    border: '1px solid rgba(222, 222, 224, 0.1)',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                  style={{
                    backgroundColor: '#9D833E',
                    color: '#14151A',
                    borderRadius: '14px',
                    boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Usuario */}
      {showDeleteModal && deletingUser && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={handleCloseDeleteModal}
        >
          <div 
            className="w-full max-w-2xl backdrop-blur-xl p-6"
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
                Eliminar Usuario
              </h3>
              <button
                onClick={handleCloseDeleteModal}
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

            {/* Contenido */}
            <div className="space-y-4">
              <p style={{ color: '#DEDEE0', opacity: 0.8 }}>
                ¿Estás seguro de que deseas eliminar el usuario <strong>{deletingUser.name}</strong>?
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="flex-1 py-4 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    backgroundColor: 'rgba(42, 43, 49, 0.5)',
                    color: '#DEDEE0',
                    borderRadius: '14px',
                    border: '1px solid rgba(222, 222, 224, 0.1)',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
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
        </div>
      )}
    </div>
  );
}