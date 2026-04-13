import React, { useState, useEffect } from 'react';
import { getPresentations } from '../api';
import { Search, Library, FileText, Calendar, Users, X, Filter } from 'lucide-react';

const Bibliotheque = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');

  useEffect(() => {
    getPresentations()
      .then(r => setPresentations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = presentations.filter(p => {
    const matchSearch = (p.titre + p.module + p.description).toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || p.type === filterType;
    const matchStatut = filterStatut === 'all' || p.statut === filterStatut;
    return matchSearch && matchType && matchStatut;
  });

  const STATUT_COLORS = {
    termine:   { bg: 'var(--success-bg)', color: 'var(--success)', label: 'Terminé' },
    en_cours:  { bg: 'var(--warning-bg)', color: 'var(--warning)', label: 'En cours' },
    en_retard: { bg: 'var(--danger-bg)',  color: 'var(--danger)',  label: 'En retard' },
  };

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Library size={24} color="var(--ofppt-cyan)" /> Bibliothèque
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Archive de toutes les présentations — {presentations.length} au total
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Rechercher titre, module, description..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ flex: '0 0 auto', width: 'auto', paddingRight: '2rem' }}>
          <option value="all">Tous les statuts</option>
          <option value="termine">Terminées</option>
          <option value="en_cours">En cours</option>
          <option value="en_retard">En retard</option>
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ flex: '0 0 auto', width: 'auto', paddingRight: '2rem' }}>
          <option value="all">Tous les types</option>
          <option value="individuelle">Individuelle</option>
          <option value="collective">Collective</option>
        </select>
        {(search || filterStatut !== 'all' || filterType !== 'all') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterStatut('all'); setFilterType('all'); }}>
            <X size={14} /> Effacer
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour "<strong style={{ color: 'var(--text-secondary)' }}>{search}</strong>"
        </p>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Library size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <p>Aucune présentation trouvée</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(p => {
            const sc = STATUT_COLORS[p.statut] || STATUT_COLORS.en_cours;
            const uploads = Object.keys(p.uploads || {}).length;
            const total = (p.stagiairesAssignes || []).length;
            return (
              <div key={p.id} className="card">
                {/* Top accent */}
                <div style={{ height: 3, margin: '-1.5rem -1.5rem 1.25rem', background: p.statut === 'termine' ? 'linear-gradient(90deg, var(--success), transparent)' : 'linear-gradient(90deg, var(--ofppt-blue), var(--ofppt-cyan))', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', lineHeight: 1.3, flex: 1 }}>{p.titre}</h3>
                  <span style={{ padding: '0.2rem 0.6rem', background: sc.bg, color: sc.color, borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap, flexShrink: 0' }}>
                    {sc.label}
                  </span>
                </div>

                {p.module && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--ofppt-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={12} /> {p.module}
                  </div>
                )}

                {p.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{p.duree || '—'} min</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>durée</div>
                  </div>
                  <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{total}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>stagiaires</div>
                  </div>
                  <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{uploads}/{total}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>uploads</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={11} /> Deadline : {p.dateLimite}
                  </div>
                  <span className={`badge ${p.type === 'collective' ? 'badge-collective' : 'badge-individual'}`} style={{ fontSize: '0.65rem' }}>
                    {p.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bibliotheque;
