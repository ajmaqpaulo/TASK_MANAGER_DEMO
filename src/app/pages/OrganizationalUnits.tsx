import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Building2 } from 'lucide-react';

interface OrganizationalUnit {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export default function OrganizationalUnits() {
  const [units, setUnits] = useState<OrganizationalUnit[]>([
    {
      id: '1',
      name: 'Finanzas',
      description: 'Departamento de gestión financiera y contable',
      color: '#9D833E',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'RRHH',
      description: 'Recursos Humanos y gestión de personal',
      color: '#3B82F6',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'BI',
      description: 'Business Intelligence y análisis de datos',
      color: '#10B981',
      createdAt: '2024-02-01'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#9D833E'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);

  const handleOpenModal = (unit?: OrganizationalUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData({
        name: unit.name,
        description: unit.description,
        color: unit.color
      });
    } else {
      setEditingUnit(null);
      setFormData({
        name: '',
        description: '',
        color: '#9D833E'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUnit(null);
    setFormData({
      name: '',
      description: '',
      color: '#9D833E'
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingUnit) {
      // Editar unidad existente
      setUnits(units.map(u => 
        u.id === editingUnit.id 
          ? { ...u, name: formData.name, description: formData.description, color: formData.color }
          : u
      ));
    } else {
      // Crear nueva unidad
      const newUnit: OrganizationalUnit = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUnits([...units, newUnit]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
    setShowDeleteModal(false);
    setUnitToDelete(null);
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="size-full p-6 overflow-auto" style={{ backgroundColor: '#14151A' }}>
      {/* Orbe de luz decorativo */}
      <div 
        className="fixed top-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #9D833E 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between relative z-10">
        <div>
          <h2 className="flex items-center gap-3" style={{ color: '#DEDEE0' }}>
            <Building2 size={32} />
            Unidades Organizacionales
          </h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Gestiona las áreas y departamentos de la organización
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
          Nueva Unidad
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

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
              borderRadius: '18px',
              border: '1px solid rgba(222, 222, 224, 0.15)',
              boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Orbe de luz por unidad */}
            <div 
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-700 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${unit.color} 0%, transparent 70%)`
              }}
            />

            {/* Border decorativo superior */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-[18px] opacity-50"
              style={{
                background: `linear-gradient(90deg, transparent, ${unit.color}, transparent)`
              }}
            />

            {/* Header with icon */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${unit.color}25`,
                    border: `1px solid ${unit.color}40`,
                    boxShadow: `0 4px 12px ${unit.color}20`
                  }}
                >
                  <Building2 size={24} style={{ color: unit.color }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#DEDEE0', fontSize: '16px' }}>
                    {unit.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#DEDEE0', opacity: 0.5 }}>
                    {unit.createdAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed relative z-10" style={{ color: '#DEDEE0', opacity: 0.7 }}>
              {unit.description}
            </p>

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
                onClick={() => handleOpenModal(unit)}
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
                  setUnitToDelete(unit.id);
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
      {filteredUnits.length === 0 && (
        <div 
          className="flex flex-col items-center justify-center py-16 backdrop-blur-sm rounded-xl"
          style={{
            backgroundColor: 'rgba(28, 29, 36, 0.3)',
            border: '2px dashed rgba(222, 222, 224, 0.1)'
          }}
        >
          <Building2 size={64} style={{ color: '#DEDEE0', opacity: 0.3 }} className="mb-4" />
          <p className="text-lg" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            No se encontraron unidades organizacionales
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
            className="w-full max-w-md backdrop-blur-xl p-6"
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
                {editingUnit ? 'Editar Unidad' : 'Nueva Unidad Organizacional'}
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
                  Nombre de la Unidad
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Tecnología"
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
                  placeholder="Descripción de la unidad organizacional..."
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
                  {editingUnit ? 'Guardar Cambios' : 'Crear Unidad'}
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
              ¿Está seguro de que desea eliminar esta unidad organizacional?
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
                  if (unitToDelete) {
                    handleDelete(unitToDelete);
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
