import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Presentation, Users, LayoutDashboard, Shuffle } from 'lucide-react';

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formateurLinks = [
    { to: "/formateur", label: "Tableau de Bord", icon: <LayoutDashboard size={20} /> },
    { to: "/formateur/presentations", label: "Présentations", icon: <Presentation size={20} /> },
  ];

  const etudiantLinks = [
    { to: "/etudiant", label: "Mes Présentations", icon: <Presentation size={20} /> },
    { to: "/etudiant/roulette", label: "Roulette", icon: <Shuffle size={20} /> },
  ];

  const links = currentUser?.role === 'formateur' ? formateurLinks : etudiantLinks;

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--surface-glass)', borderRight: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Presentation size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>Presentio</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {currentUser?.role === 'formateur' ? 'Espace Formateur' : 'Espace Étudiant'}
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/formateur' || link.to === '/etudiant'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--surface-2)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                transition: 'var(--transition)'
              })}
            >
              <div style={{ color: 'var(--accent-primary)' }}>{link.icon}</div>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="avatar" style={{ backgroundColor: currentUser?.color || 'var(--accent-secondary)' }}>
              {currentUser?.name?.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser?.name}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', color: 'var(--accent-danger)', borderRadius: 'var(--radius-md)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <div className="container slide-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
