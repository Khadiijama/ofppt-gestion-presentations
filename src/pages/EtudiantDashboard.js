import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import { getPresentationsByClass, getNotifications } from '../api';
import {
  Presentation, Clock, CheckCircle, AlertTriangle, Bell,
  ArrowRight, Upload, Calendar
} from 'lucide-react';

const EtudiantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pr, notifs] = await Promise.all([
          getPresentationsByClass(user.classId),
          getNotifications(user.id),
        ]);
        setPresentations(pr.data);
        setNotifications(notifs.data);
      } catch { }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const myPres         = presentations.filter(p => (p.stagiairesAssignes || []).includes(user.id));
  const enCours        = myPres.filter(p => p.statut === 'en_cours');
  const terminees      = myPres.filter(p => p.statut === 'termine');
  const enRetard       = myPres.filter(p => p.statut === 'en_retard');
  const unreadNotifs   = notifications.filter(n => !n.lu);

  const urgentDeadlines = myPres
    .filter(p => p.statut !== 'termine')
    .sort((a, b) => new Date(a.dateLimite) - new Date(b.dateLimite))
    .slice(0, 4)
    .map(p => ({
      ...p,
      daysLeft: Math.ceil((new Date(p.dateLimite) - new Date()) / 86400000),
      hasUploaded: !!p.uploads?.[user.id],
    }));

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loader" />
    </div>
  );

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: '0.35rem' }}>
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {user?.filiere} · {user?.niveau} · CEF : <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ofppt-cyan)', fontSize: '0.85rem' }}>{user?.cef}</code>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/stagiaire/presentations')}>
          <Upload size={16} /> Mes Présentations
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <StatCard icon={<Presentation size={22} />} label="Présentations assignées" value={myPres.length} color="blue" />
        <StatCard icon={<Clock size={22} />} label="En cours" value={enCours.length} color="cyan" subtitle="À rendre" />
        <StatCard icon={<CheckCircle size={22} />} label="Terminées" value={terminees.length} color="success" />
        <StatCard icon={<AlertTriangle size={22} />} label="En retard" value={enRetard.length} color={enRetard.length > 0 ? 'danger' : 'success'} subtitle={enRetard.length === 0 ? 'Tout à jour !' : 'Urgence !'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Upcoming deadlines */}
        <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(0,63,127,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={17} color="var(--ofppt-cyan)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: 0 }}>Mes prochaines deadlines</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/stagiaire/presentations')}>
              Tout voir <ArrowRight size={14} />
            </button>
          </div>

          {urgentDeadlines.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem' }}>Aucune présentation en attente. Tout est à jour !</p>
            </div>
          ) : (
            <div>
              {urgentDeadlines.map(p => {
                const isUrgent = p.daysLeft <= 3 && p.daysLeft >= 0;
                const isLate   = p.daysLeft < 0;
                const color    = isLate ? 'var(--danger)' : isUrgent ? 'var(--warning)' : 'var(--ofppt-cyan)';
                return (
                  <div key={p.id} style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    background: isLate ? 'rgba(239,68,68,0.03)' : isUrgent ? 'rgba(245,158,11,0.03)' : 'transparent',
                  }}>
                    <div style={{ width: 4, borderRadius: 2, background: color, alignSelf: 'stretch', flexShrink: 0, minHeight: 50 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.titre}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{p.module}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: p.type === 'collective' ? 'var(--info-bg)' : 'rgba(0,63,127,0.1)', color: p.type === 'collective' ? 'var(--info)' : '#60a5fa', fontWeight: 600 }}>
                          {p.type}
                        </span>
                        {p.hasUploaded && (
                          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600 }}>
                            ✓ Uploadé
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color }}>
                        {isLate ? `${Math.abs(p.daysLeft)}j retard` : p.daysLeft === 0 ? "Aujourd'hui" : `${p.daysLeft}j`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.dateLimite}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--ofppt-cyan)', width: '100%' }} onClick={() => navigate('/stagiaire/presentations')}>
              Gérer mes présentations <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Notifications */}
          <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,63,127,0.06)' }}>
              <Bell size={16} color="var(--ofppt-cyan)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', margin: 0 }}>Notifications</h3>
              {unreadNotifs.length > 0 && (
                <span className="badge badge-orange" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                  {unreadNotifs.length} nouvelles
                </span>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Aucune notification
              </div>
            ) : (
              notifications.slice(0, 4).map(n => (
                <div key={n.id} style={{
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  background: !n.lu ? 'rgba(0,168,225,0.04)' : 'transparent',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: n.type === 'retard' ? 'var(--danger)' : n.type === 'note' ? 'var(--success)' : 'var(--warning)',
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.titre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem', lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{n.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Profile card */}
          <div className="card card-no-hover" style={{ background: 'linear-gradient(135deg, rgba(0,63,127,0.15), rgba(0,168,225,0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
              <div className="avatar avatar-lg" style={{ background: user?.color || 'var(--ofppt-blue)' }}>{user?.avatar}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.promotion}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: 'Filière', val: user?.filiere?.split(' - ')[0] || user?.filiere },
                { label: 'Niveau', val: user?.niveau },
                { label: 'CEF', val: user?.cef, mono: true },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: item.mono ? 'var(--font-mono)' : 'inherit', color: item.mono ? 'var(--ofppt-cyan)' : 'var(--text-primary)' }}>
                    {item.val || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtudiantDashboard;
