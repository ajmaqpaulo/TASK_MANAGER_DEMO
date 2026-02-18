import { useState } from 'react';
import { useNavigate } from 'react-router';
import logo from '@/assets/aae02afcf95717fd7154788982f1cae7f0997dcb.png';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState('');
  const [role, setRole] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update profile:', { name, email, unit, role });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="size-full overflow-auto p-6" style={{ backgroundColor: '#14151A' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-20 h-20" />
          </div>
          <h2 style={{ color: '#DEDEE0' }}>Mi Perfil</h2>
          <p className="mt-1" style={{ color: '#DEDEE0', opacity: 0.6 }}>
            Gestiona tu información personal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="backdrop-blur-xl p-6 mb-6" style={{
          background: 'rgba(28, 29, 36, 0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(222, 222, 224, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}>
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: '#DEDEE0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none placeholder:text-gray-500"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: '#DEDEE0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>

            {/* Unidad */}
            <div>
              <label className="block mb-2" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Unidad Organizacional
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-4 backdrop-blur-md border transition-all duration-300 focus:outline-none appearance-none cursor-pointer"
                style={{
                  borderRadius: '14px',
                  backgroundColor: 'rgba(42, 43, 49, 0.5)',
                  borderColor: 'rgba(222, 222, 224, 0.1)',
                  color: unit ? '#DEDEE0' : '#808080',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23DEDEE0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '12px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9D833E';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.7)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(157, 131, 62, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(222, 222, 224, 0.1)';
                  e.target.style.backgroundColor = 'rgba(42, 43, 49, 0.5)';
                  e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)';
                }}
              >
                <option value="" disabled>Selecciona una unidad</option>
                <option value="rrhh" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>RRHH</option>
                <option value="finanzas" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>Finanzas</option>
                <option value="bi" style={{ backgroundColor: '#1C1D24', color: '#DEDEE0' }}>BI</option>
              </select>
            </div>

            {/* Rol */}
            <div>
              <label className="block mb-3" style={{ color: '#DEDEE0', opacity: 0.8 }}>
                Rol
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('standard')}
                  className="flex-1 py-4 px-4 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: role === 'standard' ? '#9D833E' : 'rgba(42, 43, 49, 0.5)',
                    color: role === 'standard' ? '#14151A' : '#DEDEE0',
                    border: `1px solid ${role === 'standard' ? '#9D833E' : 'rgba(222, 222, 224, 0.1)'}`,
                    boxShadow: role === 'standard' 
                      ? '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' 
                      : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Usuario Estándar
                </button>
                <button
                  type="button"
                  onClick={() => setRole('supervisor')}
                  className="flex-1 py-4 px-4 transition-all duration-300 active:scale-[0.97]"
                  style={{
                    borderRadius: '14px',
                    backgroundColor: role === 'supervisor' ? '#9D833E' : 'rgba(42, 43, 49, 0.5)',
                    color: role === 'supervisor' ? '#14151A' : '#DEDEE0',
                    border: `1px solid ${role === 'supervisor' ? '#9D833E' : 'rgba(222, 222, 224, 0.1)'}`,
                    boxShadow: role === 'supervisor' 
                      ? '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)' 
                      : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Supervisor
                </button>
              </div>
            </div>

            {/* Botón actualizar */}
            <button
              type="submit"
              className="w-full py-4 mt-4 transition-all duration-300 hover:shadow-xl active:scale-[0.97]"
              style={{
                backgroundColor: '#9D833E',
                color: '#14151A',
                borderRadius: '14px',
                boxShadow: '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 24px 0 rgba(157, 131, 62, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(157, 131, 62, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)';
              }}
            >
              Actualizar Perfil
            </button>
          </div>
        </form>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 transition-all duration-300 active:scale-[0.97]"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            borderRadius: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
