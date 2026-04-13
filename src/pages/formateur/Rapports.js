import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPresentationsByFormateur, getUsers } from '../../api';
import { BarChart2, TrendingUp, Users, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

// Simple bar chart using CSS
const BarChart = ({ data, color = 'var(--ofppt-cyan)' }) => {
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 120 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.val}</span>
          <div style={{
            width: '100%',
            height: `${(d.val / max) * 90}px`,
            background: `linear-gradient(to top, ${color}dd, ${color}66)`,
            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
            minHeight: 4,
            transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${color}, transparent)`,
              borderRadius: 'inherit',
              opacity: 0.6,
            }} />
          </div>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// Donut chart using SVG
const DonutChart = ({ segments }) => {
  const total = segments.reduce((s, g) => s + g.val, 0);
  let cumulative = 0;
  const r = 50, cx = 60, cy = 60, strokeW = 14;

  const paths = segments.map(seg => {
    const pct = total > 0 ? seg.val / total : 0;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: seg.color, val: seg.val, label: seg.label };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="var(--bg-elevated)" />
        {paths.map((p, i) => p.val > 0 && <path key={i} d={p.path} fill={p.color} opacity={0.9} />)}
        <circle cx={cx} cy={cy} r={r - strokeW} fill="var(--bg-card)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize={18} fontWeight={700}>{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.label}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, marginLeft: 'auto' }}>{p.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Rapports = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pr, us] = await Promise.all([
          getPresentationsByFormateur(user.id),
          getUsers(),
        ]);
        setPresentations(pr.data);
        setStudents(us.data.filter(u => u.role === 'stagiaire'));
      } catch { }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const total      = presentations.length;
  const enCours    = presentations.filter(p => p.statut === 'en_cours').length;
  const terminees  = presentations.filter(p => p.statut === 'termine').length;
  const enRetard   = presentations.filter(p => p.statut === 'en_retard').length;
  const tauxCompletion = total > 0 ? Math.round((terminees / total) * 100) : 0;

  // Total uploads across all presentations
  const totalUploads = presentations.reduce((sum, p) => sum + Object.keys(p.uploads || {}).length, 0);
  const totalAssigned = presentations.reduce((sum, p) => sum + (p.stagiairesAssignes || []).length, 0);
  const tauxUpload = totalAssigned > 0 ? Math.round((totalUploads / totalAssigned) * 100) : 0;

  // Monthly distribution (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString('fr-FR', { month: 'short' });
    const val = presentations.filter(p => {
      const pd = new Date(p.dateCreation);
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    }).length;
    return { label, val };
  });

  // Module stats
  const moduleStats = presentations.reduce((acc, p) => {
    const key = p.module?.split(' - ')[0] || 'Autre';
    if (!acc[key]) acc[key] = { total: 0, done: 0 };
    acc[key].total++;
    if (p.statut === 'termine') acc[key].done++;
    return acc;
  }, {});

  // Student upload ranking
  const studentRanking = students.map(s => {
    const assigned = presentations.filter(p => (p.stagiairesAssignes || []).includes(s.id));
    const uploaded = assigned.filter(p => p.uploads?.[s.id]);
    return { ...s, assigned: assigned.length, uploaded: uploaded.length, rate: assigned.length > 0 ? Math.round((uploaded.length / assigned.length) * 100) : 0 };
  }).sort((a, b) => b.rate - a.rate).slice(0, 5);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="loader" /></div>;

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Rapports & Statistiques</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Vue d'ensemble de l'activité de vos classes</p>
        </div>
        <button className="btn btn-secondary" title="Export simulé">
          <Download size={16} /> Exporter PDF
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard icon={<BarChart2 size={22} />} label="Total présentations" value={total} color="blue" />
        <StatCard icon={<CheckCircle size={22} />} label="Taux de complétion" value={`${tauxCompletion}%`} color="success" trend={tauxCompletion > 50 ? 12 : -5} />
        <StatCard icon={<TrendingUp size={22} />} label="Taux d'upload" value={`${tauxUpload}%`} color="cyan" subtitle={`${totalUploads}/${totalAssigned} fichiers`} />
        <StatCard icon={<AlertTriangle size={22} />} label="En retard" value={enRetard} color={enRetard > 0 ? 'danger' : 'success'} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Donut */}
        <div className="card card-no-hover">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={16} color="var(--ofppt-cyan)" /> Répartition des statuts
          </h3>
          <DonutChart segments={[
            { label: 'Terminées', val: terminees, color: 'var(--success)' },
            { label: 'En cours', val: enCours, color: 'var(--warning)' },
            { label: 'En retard', val: enRetard, color: 'var(--danger)' },
          ]} />
        </div>

        {/* Bar Chart */}
        <div className="card card-no-hover">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="var(--ofppt-orange)" /> Présentations créées (6 mois)
          </h3>
          <BarChart data={monthlyData} color="var(--ofppt-cyan)" />
        </div>
      </div>

      {/* Module stats + Student ranking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Modules */}
        <div className="card card-no-hover">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} color="var(--success)" /> Taux par module
          </h3>
          {Object.entries(moduleStats).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Aucune donnée</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {Object.entries(moduleStats).map(([mod, stats]) => {
                const rate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                return (
                  <div key={mod}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>{mod}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: rate >= 80 ? 'var(--success)' : rate >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{rate}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{
                        width: `${rate}%`,
                        background: rate >= 80 ? 'linear-gradient(90deg, #16a34a, var(--success))' : rate >= 50 ? 'linear-gradient(90deg, #d97706, var(--warning))' : 'linear-gradient(90deg, #dc2626, var(--danger))',
                      }} />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{stats.done}/{stats.total} terminées</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Student ranking */}
        <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,63,127,0.06)' }}>
            <Users size={16} color="var(--ofppt-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: 0 }}>Top stagiaires (uploads)</h3>
          </div>
          {studentRanking.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Aucune donnée</div>
          ) : (
            studentRanking.map((s, i) => (
              <div key={s.id} style={{
                padding: '0.75rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '0.875rem',
              }}>
                <span style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--warning)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700,
                  color: i === 0 ? '#000' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div className="avatar avatar-sm" style={{ background: s.color || 'var(--ofppt-blue)', flexShrink: 0 }}>
                  {s.avatar || s.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.uploaded}/{s.assigned} uploads</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: s.rate >= 80 ? 'var(--success)' : s.rate >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                    {s.rate}%
                  </span>
                  <div className="progress-track" style={{ width: 60, height: 4 }}>
                    <div className="progress-fill" style={{ width: `${s.rate}%` }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rapports;
