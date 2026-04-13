import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPresentationsByFormateur } from '../../api';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const CalendrierFormateur = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState([]);
  const [today] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    getPresentationsByFormateur(user.id).then(r => setPresentations(r.data)).catch(() => {});
  }, [user]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Mon=0

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return presentations.filter(p => p.dateLimite === dateStr);
  };

  const getEventColor = (p) => {
    if (p.statut === 'termine') return 'var(--success)';
    if (p.statut === 'en_retard') return 'var(--danger)';
    const diff = Math.ceil((new Date(p.dateLimite) - new Date()) / 86400000);
    if (diff <= 3) return 'var(--danger)';
    if (diff <= 7) return 'var(--warning)';
    return 'var(--ofppt-cyan)';
  };

  const isToday = (day) =>
    day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const upcomingDeadlines = presentations
    .filter(p => p.statut !== 'termine')
    .sort((a, b) => new Date(a.dateLimite) - new Date(b.dateLimite))
    .slice(0, 6);

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Calendrier des Deadlines</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Visualisez toutes vos échéances de présentation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Calendar */}
        <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,63,127,0.06)' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1))}>
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: 0 }}>
              {MONTHS[month]} {year}
            </h2>
            <button className="btn btn-ghost btn-icon" onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1))}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
            {DAYS.map(d => (
              <div key={d} style={{
                textAlign: 'center', padding: '0.6rem 0.25rem',
                fontSize: '0.72rem', fontFamily: 'var(--font-heading)',
                fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((day, idx) => {
              const events = getEventsForDay(day);
              const isT = isToday(day);
              return (
                <div key={idx} style={{
                  minHeight: 80,
                  padding: '0.4rem',
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  background: isT ? 'rgba(0,168,225,0.06)' : 'transparent',
                  position: 'relative',
                }}>
                  {day && (
                    <>
                      <div style={{
                        width: 26, height: 26,
                        borderRadius: '50%',
                        background: isT ? 'var(--ofppt-cyan)' : 'transparent',
                        color: isT ? 'white' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: isT ? 700 : 500,
                        marginBottom: '0.25rem',
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {events.slice(0, 2).map(e => (
                          <div key={e.id} style={{
                            padding: '0.15rem 0.3rem',
                            borderRadius: 3,
                            background: `${getEventColor(e)}20`,
                            borderLeft: `2px solid ${getEventColor(e)}`,
                            fontSize: '0.62rem',
                            color: getEventColor(e),
                            fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            lineHeight: 1.4,
                          }}>
                            {e.titre}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', paddingLeft: '0.3rem' }}>
                            +{events.length - 2} autres
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar — Upcoming */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,63,127,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--ofppt-cyan)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', margin: 0 }}>Prochaines deadlines</h3>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Aucune deadline à venir
              </div>
            ) : (
              upcomingDeadlines.map(p => {
                const diff = Math.ceil((new Date(p.dateLimite) - new Date()) / 86400000);
                const color = diff <= 0 ? 'var(--danger)' : diff <= 3 ? 'var(--danger)' : diff <= 7 ? 'var(--warning)' : 'var(--ofppt-cyan)';
                return (
                  <div key={p.id} style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  }}>
                    <div style={{ width: 3, borderRadius: 2, background: color, alignSelf: 'stretch', flexShrink: 0, minHeight: 40 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.825rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }}>{p.titre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{p.module}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color }}>
                        {diff < 0 ? `${Math.abs(diff)}j de retard` : diff === 0 ? "Aujourd'hui" : `${diff}j restants`}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{p.dateLimite}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="card card-no-hover" style={{ padding: '1rem 1.25rem' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Légende</h4>
            {[
              { color: 'var(--danger)', label: 'En retard ou urgent (≤3j)' },
              { color: 'var(--warning)', label: 'Proche deadline (≤7j)' },
              { color: 'var(--ofppt-cyan)', label: 'Deadline normale' },
              { color: 'var(--success)', label: 'Terminé' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendrierFormateur;
