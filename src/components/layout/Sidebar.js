import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Presentation, BookOpen, Users, Calendar,
  BarChart2, Library, Info, Settings, LogOut, ChevronLeft,
  ChevronRight, Shuffle, GraduationCap, Upload
} from 'lucide-react';

const FORMATEUR_NAV = [
  { to: '/formateur', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/formateur/presentations', icon: Presentation, label: 'Présentations' },
  { to: '/formateur/classes', icon: Users, label: 'Mes Classes' },
  { to: '/formateur/calendrier', icon: Calendar, label: 'Calendrier' },
  { to: '/formateur/rapports', icon: BarChart2, label: 'Rapports & Stats' },
];

const STAGIAIRE_NAV = [
  { to: '/stagiaire', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/stagiaire/presentations', icon: Presentation, label: 'Mes Présentations' },
  { to: '/stagiaire/upload', icon: Upload, label: 'Upload Fichiers' },
];

const COMMON_NAV = [
  { to: '/bibliotheque', icon: Library, label: 'Bibliothèque' },
  { to: '/a-propos', icon: Info, label: 'À Propos' },
  { to: '/parametres', icon: Settings, label: 'Paramètres' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === 'formateur' ? FORMATEUR_NAV : STAGIAIRE_NAV;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    zIndex: 100,
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '1.25rem 0' : '1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 'var(--topbar-height)',
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'var(--shadow-blue)',
        }}>
          <GraduationCap size={20} color="white" />
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.05rem',
              background: 'linear-gradient(to right, var(--ofppt-cyan), #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              OFPPT
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Gestion Présentations
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div style={{
          padding: collapsed ? '1rem 0' : '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div
            className="avatar avatar-sm"
            style={{ background: user.color || 'var(--ofppt-blue)', flexShrink: 0 }}
          >
            {user.avatar || user.name?.charAt(0)}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role === 'formateur' ? '🎓 Formateur' : '📚 Stagiaire'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {/* Role-specific nav */}
        {!collapsed && (
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.5rem 0.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            {user?.role === 'formateur' ? 'Formateur' : 'Espace Stagiaire'}
          </div>
        )}

        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: collapsed ? '0.75rem' : '0.7rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--ofppt-cyan)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0,168,225,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--ofppt-cyan)' : '3px solid transparent',
              transition: 'var(--transition)',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              whiteSpace: 'nowrap',
            })}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--ofppt-cyan)' : 'inherit' }} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Common nav */}
        <div style={{ marginTop: '0.75rem' }}>
          {!collapsed && (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.5rem 0.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              Général
            </div>
          )}
          {COMMON_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: collapsed ? '0.75rem' : '0.7rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--ofppt-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0,168,225,0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--ofppt-cyan)' : '3px solid transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
                justifyContent: collapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap',
                marginTop: '0.25rem',
              })}
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--ofppt-cyan)' : 'inherit' }} />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom: Logout & Collapse */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            padding: collapsed ? '0.75rem' : '0.7rem 0.875rem',
          }}
          title="Se déconnecter"
        >
          <LogOut size={18} />
          {!collapsed && <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Déconnexion</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
          }}
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span style={{ fontSize: '0.75rem' }}>Réduire</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
