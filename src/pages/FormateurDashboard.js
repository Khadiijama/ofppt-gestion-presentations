import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import {
  Presentation, Users, Clock, CheckCircle, AlertTriangle,
  TrendingUp, ArrowRight, Calendar, Plus, Eye, BarChart2
} from 'lucide-react';
import { getPresentationsByFormateur, getClassesByFormateur } from '../api';

const FormateurDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [presRes, clsRes] = await Promise.all([
          getPresentationsByFormateur(user.id),
          getClassesByFormateur(user.id),
        ]);
        setPresentations(presRes.data);
        setClasses(clsRes.data);
      } catch { /* offline */ }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const enCours   = presentations.filter(p => p.statut === 'en_cours');
  const terminees = presentations.filter(p => p.statut === 'termine');
  const retard    = presentations.filter(p => p.statut === 'en_retard');

  const deadlines = [...presentations]
    .filter(p => p.statut !== 'termine')
    .sort((a, b) => new Date(a.dateLimite) - new Date(b.dateLimite))
    .slice(0, 5);

  const getDeadlineStatus = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: `${Math.abs(diff)}j de retard`, color: 'var(--danger)', bg: 'var(--danger-bg)' };
    if (diff <= 3) return { label: `Dans ${diff}j`, color: 'var(--danger)', bg: 'var(--danger-bg)' };
    if (diff <= 7) return { label: `Dans ${diff}j`, color: 'var(--warning)', bg: 'var(--warning-bg)' };
    return { label: `Dans ${diff}j`, color: 'var(--success)', bg: 'var(--success-bg)' };
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loader" />
    </div>
  );

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: '0.35rem' }}>
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user?.specialite} · {user?.cmc}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/formateur/rapports')}>
            <BarChart2 size={16} /> Rapports
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/formateur/presentations')}>
            <Plus size={16} /> Nouvelle Présentation
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          icon={<Presentation size={24} />}
          label="Total présentations"
          value={presentations.length}
          color="blue"
          subtitle={`Sur ${classes.length} classe${classes.length > 1 ? 's' : ''}`}
          onClick={() => navigate('/formateur/presentations')}
        />
        <StatCard
          icon={<Clock size={24} />}
          label="En cours"
          value={enCours.length}
          color="cyan"
          subtitle="Présentations actives"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          label="Terminées"
          value={terminees.length}
          color="success"
          trend={terminees.length > 0 ? Math.round((terminees.length / (presentations.length || 1)) * 100) : undefined}
          subtitle="Taux de complétion"
        />
        <StatCard
          icon={<AlertTriangle size={24} />}
          label="En retard"
          value={retard.length}
          color={retard.length > 0 ? 'danger' : 'success'}
          subtitle={retard.length === 0 ? 'Tout à jour ✓' : 'Action requise'}
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem',  }}>
        {/* Left — Deadlines proches */}
        <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(0,63,127,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--ofppt-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                Deadlines à venir
              </h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/formateur/calendrier')}>
              Voir calendrier <ArrowRight size={14} />
            </button>
          </div>
          {deadlines.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p>Aucune deadline active</p>
            </div>
          ) : (
            <div>
              {deadlines.map(p => {
                const ds = getDeadlineStatus(p.dateLimite);
                const uploadCount = Object.keys(p.uploads || {}).length;
                const totalAssigned = (p.stagiairesAssignes || []).length;
                const progress = totalAssigned > 0 ? Math.round((uploadCount / totalAssigned) * 100) : 0;
                return (
                  <div key={p.id} style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    transition: 'var(--transition)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.titre}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {p.module}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-track" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {uploadCount}/{totalAssigned} uploads
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', background: ds.bg, color: ds.color }}>
                        {ds.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.dateLimite}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--ofppt-cyan)', width: '100%' }} onClick={() => navigate('/formateur/presentations')}>
              Gérer toutes les présentations <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right — Classes + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Classes */}
          <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,63,127,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} color="var(--ofppt-cyan)" />
                <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Mes Classes</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/formateur/classes')}>
                <Eye size={13} />
              </button>
            </div>
            {classes.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucune classe</div>
            ) : (
              classes.map(c => (
                <div key={c.id} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                    fontFamily: 'var(--font-heading)', flexShrink: 0,
                  }}>
                    {c.code || c.nom.substring(0, 3)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.niveau} · {c.effectif} stagiaires</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="card card-no-hover">
            <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Accès rapide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Créer une présentation', icon: <Plus size={15} />, to: '/formateur/presentations', color: 'btn-primary' },
                { label: 'Voir le calendrier', icon: <Calendar size={15} />, to: '/formateur/calendrier', color: 'btn-secondary' },
                { label: 'Rapports & stats', icon: <TrendingUp size={15} />, to: '/formateur/rapports', color: 'btn-secondary' },
              ].map(a => (
                <button key={a.to} className={`btn ${a.color}`} style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }} onClick={() => navigate(a.to)}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurDashboard;
