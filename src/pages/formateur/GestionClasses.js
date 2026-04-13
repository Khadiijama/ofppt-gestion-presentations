import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClassesByFormateur, getUsers, getPresentationsByFormateur } from '../../api';
import { Users, BookOpen, TrendingUp, MapPin, Award } from 'lucide-react';

const GestionClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cl, us, pr] = await Promise.all([
          getClassesByFormateur(user.id),
          getUsers(),
          getPresentationsByFormateur(user.id),
        ]);
        setClasses(cl.data);
        setAllUsers(us.data);
        setPresentations(pr.data);
        if (cl.data.length > 0) setSelectedClass(cl.data[0]);
      } catch { }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const getStagiaires = (classId) => allUsers.filter(u => u.classId === classId && u.role === 'stagiaire');
  const getPresentationsForClass = (classId) => presentations.filter(p => p.classId === classId);

  const getStatsForStudent = (studentId, classPresentations) => {
    const assigned = classPresentations.filter(p => (p.stagiairesAssignes || []).includes(studentId));
    const uploaded = assigned.filter(p => p.uploads?.[studentId]);
    return { assigned: assigned.length, uploaded: uploaded.length };
  };

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Mes Classes</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{classes.length} classe{classes.length !== 1 ? 's' : ''} assignée{classes.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
          {/* Class List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {classes.map(c => {
              const stagiaires = getStagiaires(c.id);
              const classPres = getPresentationsForClass(c.id);
              const isSelected = selectedClass?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClass(c)}
                  style={{
                    padding: '1.25rem',
                    background: isSelected ? 'rgba(0,168,225,0.1)' : 'var(--bg-card)',
                    border: `2px solid ${isSelected ? 'var(--ofppt-cyan)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-xl)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: isSelected
                        ? 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))'
                        : 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem',
                    }}>
                      {c.code || c.nom.substring(0, 3)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: isSelected ? 'var(--ofppt-cyan)' : 'var(--text-primary)' }}>{c.nom}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.niveau}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--surface-1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stagiaires.length}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Stagiaires</div>
                    </div>
                    <div style={{ background: 'var(--surface-1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{classPres.length}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Présentations</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class Detail */}
          {selectedClass ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Class Info Card */}
              <div className="card card-no-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>{selectedClass.nom}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{selectedClass.filiere}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-blue">{selectedClass.niveau}</span>
                    <span className="badge badge-neutral">{selectedClass.anneeScolaire}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem' }}>
                  {[
                    { icon: <Users size={16} />, label: 'Effectif max', val: selectedClass.effectif },
                    { icon: <Users size={16} />, label: 'Inscrits', val: getStagiaires(selectedClass.id).length },
                    { icon: <BookOpen size={16} />, label: 'Présentations', val: getPresentationsForClass(selectedClass.id).length },
                    { icon: <MapPin size={16} />, label: 'Salle', val: selectedClass.salle || '—' },
                    { icon: <Award size={16} />, label: 'Promotion', val: selectedClass.promotion },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--surface-1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ofppt-cyan)', marginBottom: '0.3rem' }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>{item.val}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stagiaires Table */}
              <div className="card card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,63,127,0.06)' }}>
                  <Users size={16} color="var(--ofppt-cyan)" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: 0 }}>
                    Stagiaires — {selectedClass.nom}
                  </h3>
                </div>
                {getStagiaires(selectedClass.id).length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Aucun stagiaire inscrit dans cette classe
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Stagiaire</th>
                        <th>CEF</th>
                        <th>Email</th>
                        <th>Assignées</th>
                        <th>Uploadées</th>
                        <th>Progression</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStagiaires(selectedClass.id).map(s => {
                        const stats = getStatsForStudent(s.id, getPresentationsForClass(selectedClass.id));
                        const prog = stats.assigned > 0 ? Math.round((stats.uploaded / stats.assigned) * 100) : 0;
                        return (
                          <tr key={s.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="avatar avatar-sm" style={{ background: s.color || 'var(--ofppt-blue)' }}>
                                  {s.avatar || s.name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{s.name}</span>
                              </div>
                            </td>
                            <td><code style={{ fontSize: '0.8rem', color: 'var(--ofppt-cyan)', fontFamily: 'var(--font-mono)' }}>{s.cef || '—'}</code></td>
                            <td><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.email}</span></td>
                            <td><strong>{stats.assigned}</strong></td>
                            <td>
                              <span style={{ color: stats.uploaded === stats.assigned && stats.assigned > 0 ? 'var(--success)' : 'var(--text-primary)', fontWeight: 600 }}>
                                {stats.uploaded}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 100 }}>
                                <div className="progress-track" style={{ flex: 1 }}>
                                  <div className="progress-fill" style={{ width: `${prog}%` }} />
                                </div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{prog}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sélectionnez une classe
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionClasses;
