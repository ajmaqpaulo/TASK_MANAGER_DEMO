import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, LayoutGrid, Table, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  unit: string; // Área a la que pertenece la columna
}

const ItemTypes = {
  TASK: 'task'
};

function KanbanCard({ task, onEdit, onDelete }: { task: Task; onEdit: () => void; onDelete: () => void }) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#6f2abee7';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div
      ref={drag}
      className="p-5 backdrop-blur-xl cursor-move transition-all duration-500 hover:scale-[1.03] group relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
        borderRadius: '18px',
        border: '1px solid rgba(222, 222, 224, 0.15)',
        boxShadow: isDragging 
          ? '0 20px 60px 0 rgba(157, 131, 62, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 24px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        opacity: isDragging ? 0.6 : 1,
        transform: isDragging ? 'rotate(3deg)' : 'rotate(0deg)'
      }}
    >
      {/* Orbe de luz sutil en la esquina */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-700 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${getPriorityColor(task.priority)}40 0%, transparent 70%)`
        }}
      />

      {/* Border decorativo superior */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-[18px] opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${getPriorityColor(task.priority)}, transparent)`
        }}
      />

      {/* Priority badge and unit */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="px-3 py-1.5 text-xs font-medium backdrop-blur-sm" style={{
          backgroundColor: `${getPriorityColor(task.priority)}25`,
          color: getPriorityColor(task.priority),
          borderRadius: '8px',
          border: `1px solid ${getPriorityColor(task.priority)}40`,
          boxShadow: `0 2px 8px ${getPriorityColor(task.priority)}20`
        }}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
        </span>
        <span className="text-xs px-3 py-1.5 backdrop-blur-md rounded-lg" style={{ 
          color: '#DEDEE0', 
          opacity: 0.7,
          backgroundColor: 'rgba(42, 43, 49, 0.5)',
          border: '1px solid rgba(222, 222, 224, 0.1)'
        }}>
          {task.unit}
        </span>
      </div>

      {/* Task info */}
      <h4 className="mb-2 font-medium" style={{ color: '#DEDEE0', fontSize: '15px', lineHeight: '1.4' }}>
        {task.title}
      </h4>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: '#DEDEE0', opacity: 0.65 }}>
        {task.description}
      </p>

      {/* Divider */}
      <div 
        className="h-px mb-4 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(222, 222, 224, 0.3), transparent)'
        }}
      />

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tasks/${task.id}`);
          }}
          className="flex-1 py-2.5 text-sm font-medium transition-all duration-300 hover:shadow-lg active:scale-[0.98] backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3B82F6',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
          }}
        >
          Ver Detalle
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ column, tasks, onDrop, onDeleteColumn, onEditColumn, onDeleteTask }: { 
  column: Column; 
  tasks: Task[]; 
  onDrop: (taskId: string, newStatus: string) => void;
  onDeleteColumn: () => void;
  onEditColumn: () => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== column.id) {
        onDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div className="flex flex-col h-full relative">
      {/* Orbe de luz de fondo según el color de la columna */}
      <div 
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${column.color} 0%, transparent 70%)`
        }}
      />

      {/* Column Header */}
      <div 
        className="mb-5 px-5 py-4 backdrop-blur-xl group relative overflow-hidden flex-shrink-0" 
        style={{
          background: isOver 
            ? `linear-gradient(135deg, rgba(157, 131, 62, 0.25) 0%, rgba(157, 131, 62, 0.15) 100%)`
            : 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
          borderRadius: '16px',
          border: `1px solid ${isOver ? 'rgba(157, 131, 62, 0.5)' : 'rgba(222, 222, 224, 0.15)'}`,
          boxShadow: isOver 
            ? '0 8px 32px 0 rgba(157, 131, 62, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Línea decorativa superior */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[16px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${column.color}, transparent)`,
            opacity: 0.6
          }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <div 
            className="w-3 h-3 rounded-full shadow-lg" 
            style={{ 
              backgroundColor: column.color,
              boxShadow: `0 0 12px ${column.color}60`
            }}
          />
          <h3 className="font-semibold" style={{ color: '#DEDEE0', fontSize: '15px' }}>
            {column.title}
          </h3>
          <span className="ml-auto px-3 py-1.5 text-xs font-medium backdrop-blur-md" style={{
            background: 'rgba(42, 43, 49, 0.6)',
            color: column.color,
            borderRadius: '10px',
            border: `1px solid ${column.color}30`,
            boxShadow: `0 2px 8px ${column.color}20`
          }}>
            {tasks.length}
          </span>
          
          {/* Edit column button - No mostrar para columna "Nueva" */}
          {column.title !== 'Nueva' && (
            <button
              onClick={onEditColumn}
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <Edit2 size={14} />
            </button>
          )}
          
          {/* Delete column button - No mostrar para columna "Nueva" */}
          {column.title !== 'Nueva' && (
            <button
              onClick={onDeleteColumn}
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tasks Drop Zone - Con scroll interno */}
      <div 
        ref={drop} 
        className="flex flex-col gap-4 flex-1 p-3 rounded-2xl transition-all duration-300 relative overflow-y-auto"
        style={{
          background: isOver 
            ? 'linear-gradient(135deg, rgba(157, 131, 62, 0.08) 0%, rgba(157, 131, 62, 0.03) 100%)'
            : 'transparent',
          border: isOver ? '2px dashed rgba(157, 131, 62, 0.4)' : '2px dashed transparent',
          scrollbarWidth: 'thin',
          scrollbarColor: `${column.color}60 rgba(28, 29, 36, 0.3)`
        }}
      >
        {tasks.length === 0 && (
          <div 
            className="flex items-center justify-center h-40 backdrop-blur-sm rounded-xl border-2 border-dashed transition-all duration-300"
            style={{
              borderColor: isOver ? 'rgba(157, 131, 62, 0.4)' : 'rgba(222, 222, 224, 0.1)',
              backgroundColor: isOver ? 'rgba(157, 131, 62, 0.05)' : 'rgba(28, 29, 36, 0.3)'
            }}
          >
            <p className="text-sm" style={{ color: '#DEDEE0', opacity: 0.4 }}>
              {isOver ? 'Suelta aquí' : 'Sin tareas'}
            </p>
          </div>
        )}
        {tasks.map(task => (
          <KanbanCard
            key={task.id}
            task={task}
            onEdit={() => {}}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('#9D833E');
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  
  // Estado para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Estado para filtro de unidad/área - empezar con Finanzas seleccionado
  const [selectedUnit, setSelectedUnit] = useState<string>('Finanzas');
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisión de presupuesto Q1',
      description: 'Analizar gastos del primer trimestre',
      status: 'finanzas-pendiente',
      unit: 'Finanzas',
      priority: 'high',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Onboarding nuevo personal',
      description: 'Preparar materiales de inducción',
      status: 'rrhh-en-proceso',
      unit: 'RRHH',
      priority: 'medium',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      title: 'Reporte de métricas mensuales',
      description: 'Dashboard de KPIs enero',
      status: 'bi-completado',
      unit: 'BI',
      priority: 'low',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      title: 'Análisis de rotación',
      description: 'Estudio de causas de deserción',
      status: 'rrhh-pendiente',
      unit: 'RRHH',
      priority: 'high',
      createdAt: '2024-02-05'
    },
    {
      id: '5',
      title: 'Implementar nuevo sistema contable',
      description: 'Migración a software actualizado',
      status: 'finanzas-en-revision',
      unit: 'Finanzas',
      priority: 'high',
      createdAt: '2024-02-08'
    },
    {
      id: '6',
      title: 'Dashboard de ventas',
      description: 'Crear visualización de datos de ventas',
      status: 'bi-en-desarrollo',
      unit: 'BI',
      priority: 'medium',
      createdAt: '2024-02-10'
    },
    {
      id: '7',
      title: 'Cierre contable febrero',
      description: 'Completar balance mensual',
      status: 'finanzas-completado',
      unit: 'Finanzas',
      priority: 'high',
      createdAt: '2024-02-12'
    },
    {
      id: '8',
      title: 'Auditoría de procesos internos',
      description: 'Revisión de procedimientos contables',
      status: 'finanzas-nueva',
      unit: 'Finanzas',
      priority: 'medium',
      createdAt: '2024-02-13'
    },
    {
      id: '9',
      title: 'Capacitación equipo nuevo',
      description: 'Programa de formación inicial',
      status: 'rrhh-nueva',
      unit: 'RRHH',
      priority: 'high',
      createdAt: '2024-02-13'
    },
    {
      id: '10',
      title: 'Análisis predictivo Q2',
      description: 'Modelos de forecasting para próximo trimestre',
      status: 'bi-nueva',
      unit: 'BI',
      priority: 'low',
      createdAt: '2024-02-13'
    }
  ]);

  const [columns, setColumns] = useState<Column[]>([
    // Columnas de Finanzas
    { id: 'finanzas-nueva', title: 'Nueva', color: '#6366F1', unit: 'Finanzas' },
    { id: 'finanzas-pendiente', title: 'Pendiente', color: '#9D833E', unit: 'Finanzas' },
    { id: 'finanzas-en-revision', title: 'En Revisión', color: '#F59E0B', unit: 'Finanzas' },
    { id: 'finanzas-aprobado', title: 'Aprobado', color: '#3B82F6', unit: 'Finanzas' },
    { id: 'finanzas-completado', title: 'Completado', color: '#10B981', unit: 'Finanzas' },
    
    // Columnas de RRHH
    { id: 'rrhh-nueva', title: 'Nueva', color: '#6366F1', unit: 'RRHH' },
    { id: 'rrhh-pendiente', title: 'Pendiente', color: '#9D833E', unit: 'RRHH' },
    { id: 'rrhh-en-proceso', title: 'En Proceso', color: '#3B82F6', unit: 'RRHH' },
    { id: 'rrhh-completado', title: 'Completado', color: '#10B981', unit: 'RRHH' },
    
    // Columnas de BI
    { id: 'bi-nueva', title: 'Nueva', color: '#6366F1', unit: 'BI' },
    { id: 'bi-pendiente', title: 'Pendiente', color: '#9D833E', unit: 'BI' },
    { id: 'bi-en-desarrollo', title: 'En Desarrollo', color: '#F59E0B', unit: 'BI' },
    { id: 'bi-testing', title: 'Testing', color: '#8B5CF6', unit: 'BI' },
    { id: 'bi-completado', title: 'Completado', color: '#10B981', unit: 'BI' }
  ]);

  // Tabla - Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

  const handleDrop = (taskId: string, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim() || selectedUnit === 'all') return;
    
    if (editingColumn) {
      // Modo edición: actualizar columna existente
      setColumns(columns.map(col => 
        col.id === editingColumn.id 
          ? { ...col, title: newColumnName, color: newColumnColor }
          : col
      ));
      setEditingColumn(null);
    } else {
      // Modo agregar: crear nueva columna
      const columnId = `${selectedUnit.toLowerCase()}-${newColumnName.toLowerCase().replace(/\s+/g, '-')}`;
      
      const newColumn: Column = {
        id: columnId,
        title: newColumnName,
        color: newColumnColor,
        unit: selectedUnit
      };
      
      setColumns([...columns, newColumn]);
    }
    
    setNewColumnName('');
    setNewColumnColor('#9D833E');
    setShowColumnModal(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    // Verificar si hay más de una columna antes de eliminar
    if (columns.length <= 1) {
      alert('Debe existir al menos una columna en el Kanban');
      return;
    }
    
    // Obtener la primera columna que no sea la que se va a eliminar
    const remainingColumn = columns.find(col => col.id !== columnId);
    
    if (!remainingColumn) return;
    
    // Mover todas las tareas de la columna eliminada a la primera columna restante
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.status === columnId ? { ...task, status: remainingColumn.id } : task
      )
    );
    
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Obtener unidades únicas
  const units = ['all', ...Array.from(new Set(tasks.map(t => t.unit)))];

  // Filtrar unidades según el modo de vista
  const availableUnits = viewMode === 'kanban' 
    ? units.filter(u => u !== 'all') // En Kanban no mostrar "Todas"
    : units; // En Tabla mostrar todas las opciones incluida "Todas"

  // Filtrar tareas según la unidad seleccionada
  const filteredTasks = selectedUnit === 'all' 
    ? tasks 
    : tasks.filter(t => t.unit === selectedUnit);

  // Filtrar columnas según el área seleccionada
  const filteredColumns = selectedUnit === 'all'
    ? [] // En modo "Todas" no mostramos el Kanban, solo la tabla
    : columns.filter(col => col.unit === selectedUnit);

  // Aplicar paginación a las tareas filtradas
  const filteredTotalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const filteredStartIndex = (currentPage - 1) * itemsPerPage;
  const filteredPaginatedTasks = filteredTasks.slice(filteredStartIndex, filteredStartIndex + itemsPerPage);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full flex flex-col" style={{ backgroundColor: '#14151A' }}>
        {/* Header - Fijo */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ color: '#DEDEE0' }}>Dashboard de Tareas</h2>
              <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
                {viewMode === 'kanban' ? 'Vista Kanban con drag & drop' : 'Vista de tabla con paginación'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 backdrop-blur-md" style={{
                background: 'rgba(28, 29, 36, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(222, 222, 224, 0.1)'
              }}>
                <button
                  onClick={() => setViewMode('kanban')}
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300"
                  style={{
                    backgroundColor: viewMode === 'kanban' ? '#9D833E' : 'transparent',
                    color: viewMode === 'kanban' ? '#14151A' : '#DEDEE0',
                    borderRadius: '8px',
                    boxShadow: viewMode === 'kanban' 
                      ? '0 4px 16px 0 rgba(157, 131, 62, 0.4)' 
                      : 'none'
                  }}
                >
                  <LayoutGrid size={18} />
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300"
                  style={{
                    backgroundColor: viewMode === 'table' ? '#9D833E' : 'transparent',
                    color: viewMode === 'table' ? '#14151A' : '#DEDEE0',
                    borderRadius: '8px',
                    boxShadow: viewMode === 'table' 
                      ? '0 4px 16px 0 rgba(157, 131, 62, 0.4)' 
                      : 'none'
                  }}
                >
                  <Table size={18} />
                  Tabla
                </button>
              </div>

              {/* Add Column Button - solo en vista Kanban */}
              {viewMode === 'kanban' && (
                <button
                  onClick={() => setShowColumnModal(true)}
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:shadow-lg active:scale-[0.97]"
                  style={{
                    backgroundColor: 'rgba(157, 131, 62, 0.2)',
                    color: '#9D833E',
                    borderRadius: '12px',
                    border: '1px solid rgba(157, 131, 62, 0.3)'
                  }}
                >
                  <Plus size={18} />
                  Agregar Estado
                </button>
              )}

              {/* Nueva Tarea Button */}
              <button
                onClick={() => navigate('/tasks/new')}
                className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                style={{
                  backgroundColor: '#9D833E',
                  color: '#14151A',
                  borderRadius: '14px',
                  boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <Plus size={20} />
                Nueva Tarea
              </button>
            </div>
          </div>
        </div>

        {/* Filtro de Unidades/Áreas - Fijo */}
        <div className="flex-shrink-0 px-6 pb-4">
          <div className="backdrop-blur-xl px-6 py-4" style={{
            background: 'linear-gradient(135deg, rgba(28, 29, 36, 0.9) 0%, rgba(28, 29, 36, 0.7) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(222, 222, 224, 0.15)',
            boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
          }}>
            <div className="flex flex-wrap items-center gap-3">
              <span style={{ color: '#DEDEE0', opacity: 0.8, fontSize: '14px', fontWeight: 500 }}>
                Filtrar por área:
              </span>
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {availableUnits.map(unit => {
                  const isActive = selectedUnit === unit;
                  const displayName = unit === 'all' ? 'Todas' : unit;
                  
                  return (
                    <button
                      key={unit}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setCurrentPage(1); // Resetear página al cambiar filtro
                      }}
                      className="px-4 py-2 transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: isActive 
                          ? '#9D833E' 
                          : 'rgba(42, 43, 49, 0.5)',
                        color: isActive ? '#14151A' : '#DEDEE0',
                        borderRadius: '10px',
                        border: isActive 
                          ? '1px solid #9D833E' 
                          : '1px solid rgba(222, 222, 224, 0.15)',
                        boxShadow: isActive 
                          ? '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' 
                          : '0 2px 8px 0 rgba(0, 0, 0, 0.2)',
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500
                      }}
                    >
                      {displayName}
                    </button>
                  );
                })}
              </div>
              {selectedUnit !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1.5 backdrop-blur-md" style={{
                  backgroundColor: 'rgba(157, 131, 62, 0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(157, 131, 62, 0.3)',
                  fontSize: '13px',
                  color: '#9D833E'
                }}>
                  <span style={{ opacity: 0.8 }}>
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea' : 'tareas'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div 
              className="h-full overflow-x-auto overflow-y-hidden pb-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(157, 131, 62, 0.5) rgba(28, 29, 36, 0.3)'
              }}
            >
              <div className="grid gap-4 h-full" style={{ gridTemplateColumns: `repeat(${filteredColumns.length}, minmax(300px, 1fr))` }}>
                {filteredColumns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={filteredTasks.filter(t => t.status === column.id)}
                    onDrop={handleDrop}
                    onDeleteColumn={() => handleDeleteColumn(column.id)}
                    onEditColumn={() => {
                      setEditingColumn(column);
                      setNewColumnName(column.title);
                      setNewColumnColor(column.color);
                      setShowColumnModal(true);
                    }}
                    onDeleteTask={(taskId) => {
                      setTaskToDelete(taskId);
                      setShowDeleteModal(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="h-full overflow-auto">
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
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Título</th>
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Descripción</th>
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Unidad</th>
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Estado</th>
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Prioridad</th>
                        <th className="px-6 py-4 text-left" style={{ color: '#DEDEE0', opacity: 0.8 }}>Fecha</th>
                        <th className="px-6 py-4 text-right" style={{ color: '#DEDEE0', opacity: 0.8 }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPaginatedTasks.map((task) => (
                        <tr 
                          key={task.id} 
                          className="transition-colors duration-200"
                          style={{ borderBottom: '1px solid rgba(222, 222, 224, 0.05)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(42, 43, 49, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="px-6 py-4" style={{ color: '#DEDEE0' }}>{task.title}</td>
                          <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.7 }}>{task.description}</td>
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
                              {task.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="px-3 py-1 text-sm"
                              style={{
                                backgroundColor: `${columns.find(c => c.id === task.status)?.color}20`,
                                color: columns.find(c => c.id === task.status)?.color,
                                borderRadius: '8px',
                                border: `1px solid ${columns.find(c => c.id === task.status)?.color}30`
                              }}
                            >
                              {columns.find(c => c.id === task.status)?.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="px-3 py-1 text-sm"
                              style={{
                                backgroundColor: `${getPriorityColor(task.priority)}20`,
                                color: getPriorityColor(task.priority),
                                borderRadius: '8px',
                                border: `1px solid ${getPriorityColor(task.priority)}30`
                              }}
                            >
                              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                            </span>
                          </td>
                          <td className="px-6 py-4" style={{ color: '#DEDEE0', opacity: 0.6 }}>{task.createdAt}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/tasks/${task.id}`)}
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
                                onClick={() => {
                                  setTaskToDelete(task.id);
                                  setShowDeleteModal(true);
                                }}
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
                {filteredTotalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid rgba(222, 222, 224, 0.1)' }}>
                    <p style={{ color: '#DEDEE0', opacity: 0.6 }}>
                      Mostrando {filteredStartIndex + 1} - {Math.min(filteredStartIndex + itemsPerPage, filteredTasks.length)} de {filteredTasks.length}
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
                      
                      {Array.from({ length: filteredTotalPages }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setCurrentPage(p => Math.min(filteredTotalPages, p + 1))}
                        disabled={currentPage === filteredTotalPages}
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

        {/* Modal Agregar Estado */}
        {showColumnModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowColumnModal(false)}
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
                <h3 style={{ color: '#DEDEE0' }}>{editingColumn ? 'Editar Estado' : 'Agregar Nuevo Estado'}</h3>
                <button
                  onClick={() => {
                    setShowColumnModal(false);
                    setEditingColumn(null);
                  }}
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
                    Nombre del estado
                  </label>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Ej: En Revisión"
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
                    Color del estado
                  </label>
                  <div className="flex gap-3">
                    {['#9D833E', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                      <button
                        key={color}
                        onClick={() => setNewColumnColor(color)}
                        className="w-12 h-12 rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: color,
                          border: newColumnColor === color ? '3px solid #DEDEE0' : '1px solid rgba(222, 222, 224, 0.2)',
                          transform: newColumnColor === color ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowColumnModal(false)}
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
                    onClick={handleAddColumn}
                    className="flex-1 py-3 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
                    style={{
                      backgroundColor: '#9D833E',
                      color: '#14151A',
                      borderRadius: '14px',
                      boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {editingColumn ? 'Guardar Cambios' : 'Agregar Estado'}
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
              {/* Modal Header */}
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

              {/* Form */}
              <div className="space-y-4">
                <p style={{ color: '#DEDEE0', opacity: 0.8 }}>
                  ¿Está seguro de que desea eliminar esta tarea?
                </p>

                <div className="flex gap-3 pt-4">
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
                      if (taskToDelete) {
                        handleDeleteTask(taskToDelete);
                        setShowDeleteModal(false);
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
          </div>
        )}
      </div>
    </DndProvider>
  );
}