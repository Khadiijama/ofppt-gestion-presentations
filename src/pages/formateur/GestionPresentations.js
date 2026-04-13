import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import {
  Plus, Search, Filter, Trash2, Eye, Shuffle,
  Clock, CheckCircle, AlertTriangle, Users, Calendar,
  ChevronDown, X
} from 'lucide-react';
import {
  getPresentationsByFormateur, getClassesByFormateur,
  createPresentation, deletePresentation, updatePresentation
} from '../../api';
import { getAllModules } from '../../data/ofpptData';
import Roulette from '../../components/Roulette';

const STATUT_CONFIG = {
  en_cours:  { label: 'En cours',   class: 'badge-warning',  icon: <Clock size={11} /> },
  termine:   { label: 'Terminé',    class: 'badge-success',  icon: <CheckCircle size={11} /> },
  en_retard: { label: 'En retard',  class: 'badge-danger',   icon: <AlertTriangle size={11} /> },
};

const GestionPresentations = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [rouletteModal, setRouletteModal] = useState(null);

  const modules = getAllModules();

  const [form, setForm] = useState({
    titre: '', module: '', description: '',
    type: 'individuelle', duree: 30,
    dateLimite: '', classId: '',
    consignes: '',
    criteres: { contenu: 40, presentation: 30, demoTechnique: 20, reponseQuestions: 10 },
  });

  useEffect(() => {
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cl] = await Promise.all([
        getPresentationsByFormateur(user.id),
        getClassesByFormateur(user.id),
      ]);
      setPresentations(pr.data);
      setClasses(cl.data);
      if (cl.data.length > 0) setForm(f => ({ ...f, classId: cl.data[0].id }));
    } catch { }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        id: `p${Date.now()}`,
        formateurId: user.id,
        dateCreation: new Date().toISOString().slice(0, 10),
        statut: 'en_cours',
        stagiairesAssignes: [],
        uploads: {},
        notes: {},
        repartition: {},
      };
      await createPresentation(payload);
      setPresentations(prev => [...prev, payload]);
      setCreateModal(false);
      setForm({ titre: '', module: '', description: '', type: 'individuelle', duree: 30, dateLimite: '', classId: classes[0]?.id || '', consignes: '', criteres: { contenu: 40, presentation: 30, demoTechnique: 20, reponseQuestions: 10 } });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette présentation ?')) return;
    await deletePresentation(id);
    setPresentations(prev => prev.filter(p => p.id !== id));
    if (detailModal?.id === id) setDetailModal(null);
  };

  const handleUpdateStatut = async (p, statut) => {
    const updated = { ...p, statut };
    await updatePresentation(p.id, updated);
    setPresentations(prev => prev.map(x => x.id === p.id ? updated : x));
    if (detailModal?.id === p.id) setDetailModal(updated);
  };

  const filtered = presentations.filter(p => {
    const matchSearch = p.titre.toLowerCase().includes(search.toLowerCase()) ||
      (p.module || '').toLowerCase().includes(search.toLowerCase());
    const matchStatut = filterStatut === 'all' || p.statut === filterStatut;
    const matchType = filterType === 'all' || p.type === filterType;
    return matchSearch && matchStatut && matchType;
  });

  const getDeadlineLabel = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (diff < 0) return { text: `${Math.abs(diff)}j retard`, color: 'var(--danger)' };
    if (diff === 0) return { text: "Aujourd'hui", color: 'var(--danger)' };
    if (diff <= 3) return { text: `${diff}j restants`, color: 'var(--danger)' };
    if (diff <= 7) return { text: `${diff}j restants`, color: 'var(--warning)' };
    return { text: dateStr, color: 'var(--text-muted)' };
  };

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Gestion des Présentations</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {presentations.length} présentation{presentations.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
          <Plus size={16} /> Nouvelle Présentation
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Rechercher par titre ou module..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ flex: '0 0 auto', width: 'auto', paddingRight: '2rem' }}>
          <option value="all">Tous les statuts</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
          <option value="en_retard">En retard</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ flex: '0 0 auto', width: 'auto', paddingRight: '2rem' }}>
          <option value="all">Tous les types</option>
          <option value="individuelle">Individuelle</option>
          <option value="collective">Collective</option>
        </select>
        {(search || filterStatut !== 'all' || filterType !== 'all') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterStatut('all'); setFilterType('all'); }}>
            <X size={14} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Shuffle size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Aucune présentation trouvée</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Présentation</th>
                <th>Module</th>
                <th>Type</th>
                <th>Stagiaires</th>
                <th>Deadline</th>
                <th>Statut</th>
                <th>Uploads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const sc = STATUT_CONFIG[p.statut] || STATUT_CONFIG.en_cours;
                const dl = getDeadlineLabel(p.dateLimite);
                const uploads = Object.keys(p.uploads || {}).length;
                const total = (p.stagiairesAssignes || []).length;
                const prog = total > 0 ? Math.round((uploads / total) * 100) : 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{p.duree} min · {p.dateCreation}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.module || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${p.type === 'collective' ? 'badge-collective' : 'badge-individual'}`}>
                        {p.type === 'collective' ? 'Collective' : 'Individuelle'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={13} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.85rem' }}>{total}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: dl.color }}>{dl.text}</span>
                    </td>
                    <td>
                      <span className={`badge ${sc.class}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {sc.icon} {sc.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: prog === 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {uploads}/{total}
                        </div>
                        <div className="progress-track" style={{ width: 80, height: 4 }}>
                          <div className="progress-fill" style={{ width: `${prog}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-ghost btn-icon" title="Voir détails" onClick={() => setDetailModal(p)}>
                          <Eye size={15} />
                        </button>
                        {p.type === 'collective' && (
                          <button className="btn btn-ghost btn-icon" title="Roulette" onClick={() => setRouletteModal(p)}
                            style={{ color: 'var(--ofppt-orange)' }}>
                            <Shuffle size={15} />
                          </button>
                        )}
                        <button className="btn btn-ghost btn-icon" title="Supprimer" onClick={() => handleDelete(p.id)}
                          style={{ color: 'var(--danger)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Créer une nouvelle présentation"
        size="lg"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCreateModal(false)}>Annuler</button>
            <button className="btn btn-primary" form="create-form" type="submit">Créer la présentation</button>
          </>
        }
      >
        <form id="create-form" onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Titre de la présentation *</label>
            <input required placeholder="Ex: Architecture Microservices avec Docker" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Module *</label>
              <select value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))} required>
                <option value="">Sélectionner un module</option>
                {modules.map(m => <option key={m.id} value={`${m.code} - ${m.nom}`}>{m.code} - {m.nom}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Classe *</label>
              <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))} required>
                {classes.map(c => <option key={c.id} value={c.id}>{c.nom} — {c.niveau}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows={3} placeholder="Décrivez le sujet et les objectifs..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="individuelle">Individuelle</option>
                <option value="collective">Collective</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Durée (minutes)</label>
              <input type="number" min={5} max={120} value={form.duree} onChange={e => setForm(f => ({ ...f, duree: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Date limite *</label>
              <input type="date" required value={form.dateLimite} onChange={e => setForm(f => ({ ...f, dateLimite: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Consignes pour les stagiaires</label>
            <textarea rows={2} placeholder="Instructions spécifiques, format attendu, ressources..." value={form.consignes} onChange={e => setForm(f => ({ ...f, consignes: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Critères d'évaluation (%)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {Object.entries(form.criteres).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-1)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1, textTransform: 'capitalize' }}>{k}</span>
                  <input type="number" min={0} max={100} value={v}
                    onChange={e => setForm(f => ({ ...f, criteres: { ...f.criteres, [k]: +e.target.value } }))}
                    style={{ width: 60, textAlign: 'center', padding: '0.25rem 0.5rem' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>%</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      {detailModal && (
        <Modal
          isOpen={!!detailModal}
          onClose={() => setDetailModal(null)}
          title={detailModal.titre}
          size="lg"
          footer={
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {detailModal.type === 'collective' && (
                <button className="btn btn-orange" onClick={() => { setRouletteModal(detailModal); setDetailModal(null); }}>
                  <Shuffle size={15} /> Roulette
                </button>
              )}
              <select
                value={detailModal.statut}
                onChange={e => handleUpdateStatut(detailModal, e.target.value)}
                style={{ width: 'auto', paddingRight: '1.5rem' }}
              >
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="en_retard">En retard</option>
              </select>
              <button className="btn btn-danger" onClick={() => handleDelete(detailModal.id)}>
                <Trash2 size={15} /> Supprimer
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className={`badge ${detailModal.type === 'collective' ? 'badge-collective' : 'badge-individual'}`}>
                {detailModal.type}
              </span>
              <span className={`badge ${STATUT_CONFIG[detailModal.statut]?.class}`}>
                {STATUT_CONFIG[detailModal.statut]?.label}
              </span>
              <span className="badge badge-neutral"><Clock size={11} /> {detailModal.duree} min</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InfoBlock label="Module" value={detailModal.module} />
              <InfoBlock label="Date limite" value={detailModal.dateLimite} />
              <InfoBlock label="Créé le" value={detailModal.dateCreation} />
              <InfoBlock label="Stagiaires assignés" value={`${(detailModal.stagiairesAssignes || []).length} stagiaire(s)`} />
            </div>

            {detailModal.description && (
              <div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Description</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{detailModal.description}</p>
              </div>
            )}
            {detailModal.consignes && (
              <div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Consignes</div>
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{detailModal.consignes}</div>
              </div>
            )}
            {detailModal.criteres && (
              <div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Critères d'évaluation</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {Object.entries(detailModal.criteres).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-1)', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ofppt-cyan)' }}>{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── ROULETTE MODAL ── */}
      {rouletteModal && (
        <Modal
          isOpen={!!rouletteModal}
          onClose={() => setRouletteModal(null)}
          title={`Roulette — ${rouletteModal.titre}`}
          size="md"
        >
          <Roulette
            presentation={rouletteModal}
            onSave={(result) => {
              const updated = { ...rouletteModal, repartition: result };
              updatePresentation(rouletteModal.id, updated);
              setPresentations(prev => prev.map(p => p.id === rouletteModal.id ? updated : p));
            }}
          />
        </Modal>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

export default GestionPresentations;
