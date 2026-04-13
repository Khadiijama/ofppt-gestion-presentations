import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Presentation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="glass-panel" style={{ 
      margin: '1.5rem', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          backgroundColor: 'var(--accent-primary)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Presentation size={24} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>EduPres</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Espace {user.role === 'formateur' ? 'Formateur' : 'Étudiant'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="avatar" style={{ backgroundColor: user.color || 'var(--accent-secondary)' }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</span>
          </div>
        </div>
        
        <button className="btn btn-danger" onClick={handleLogout}>
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
