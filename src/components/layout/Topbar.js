import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BREADCRUMB_MAP = {
  '/formateur': 'Tableau de bord',
  '/formateur/presentations': 'Gestion des Présentations',
  '/formateur/classes': 'Mes Classes',
  '/formateur/calendrier': 'Calendrier',
  '/formateur/rapports': 'Rapports & Statistiques',
  '/stagiaire': 'Tableau de bord',
  '/stagiaire/presentations': 'Mes Présentations',
  '/stagiaire/upload': 'Upload Fichiers',
  '/bibliotheque': 'Bibliothèque',
  '/a-propos': 'À Propos',
  '/parametres': 'Paramètres',
};

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3001/notifications?userId=${user.id}&lu=false`)
        .then(res => setNotifs(res.data))
        .catch(() => {});
    }
  }, [user]);

  const pageName = BREADCRUMB_MAP[location.pathname] || 'OFPPT Platform';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--topbar-height)',
      backgroundColor: 'rgba(10,15,30,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 90,
      transition: 'left 0.3s ease',
    }}>
      {/* Left — Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>OFPPT</span>
        <ChevronRight size={14} color="var(--text-muted)" />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text-primary)',
        }}>
          {pageName}
        </span>
      </div>

      {/* Center — Search */}
      <div style={{
        flex: '0 1 380px',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '0 1rem',
        gap: '0.5rem',
      }}>
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Rechercher une présentation, module..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.45rem 0',
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            width: '100%',
            boxShadow: 'none',
          }}
        />
      </div>

      {/* Right — Greeting + Notifications + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {getGreeting()}, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</strong>
        </span>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowNotifs(!showNotifs)}
            title="Notifications"
          >
            <Bell size={18} />
            {notifs.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--ofppt-orange)',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {notifs.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 340,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 0.2s ease',
                zIndex: 200,
                overflow: 'hidden',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>Notifications</strong>
              </div>
              {notifs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Aucune notification
                </div>
              ) : (
                notifs.slice(0, 5).map(n => (
                  <div key={n.id} style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    background: n.lu ? 'transparent' : 'rgba(0,168,225,0.04)',
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: n.type === 'retard' ? 'var(--danger)' : n.type === 'note' ? 'var(--success)' : 'var(--warning)',
                      flexShrink: 0,
                      marginTop: 6,
                    }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.titre}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{n.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <div
            className="avatar avatar-sm"
            style={{ background: user.color || 'var(--ofppt-blue)', cursor: 'pointer' }}
            title={user.name}
          >
            {user.avatar || user.name?.charAt(0)}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
