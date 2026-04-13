import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPresentationsByClass, updatePresentation } from '../../api';
import Modal from '../../components/ui/Modal';
import Roulette from '../../components/Roulette';
import {
  CheckCircle, Clock, AlertTriangle, Upload, Eye,
  Shuffle, FileText, Star
} from 'lucide-react';

const TABS = [
  { id: 'en_cours', label: 'En cours', icon: <Clock size={15} />, color: 'var(--warning)' },
  { id: 'en_retard', label: 'En retard', icon: <AlertTriangle size={15} />, color: 'var(--danger)' },
  { id: 'termine', label: 'Terminées', icon: <CheckCircle size={15} />, color: 'var(--success)' },
];

const MesPresentations = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState([]);
  const [activeTab, setActiveTab] = useState('en_cours');
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(null);
  const [rouletteModal, setRouletteModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPresentationsByClass(user.classId);
        setPresentations(res.data.filter(p => (p.stagiairesAssignes || []).includes(user.id)));
      } catch { }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const handleUpload = async () => {
    if (!selectedFile || !uploadModal) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate upload
    try {
      const updated = {
        ...uploadModal,
        statut: 'termine',
        uploads: {
          ...uploadModal.uploads,
          [user.id]: { fichier: selectedFile.name, date: new Date().toISOString().slice(0, 10), url: '#' }
        }
      };
      await updatePresentation(uploadModal.id, updated);
      setPresentations(prev => prev.map(p => p.id === uploadModal.id ? updated : p));
      setUploadModal(null);
      setSelectedFile(null);
    } catch { }
    finally { setUploading(false); }
  };

  const tabPres = presentations.filter(p => p.statut === activeTab);
  const counts = Object.fromEntries(TABS.map(t => [t.id, presentations.filter(p => p.statut === t.id).length]));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setSelectedFile(file);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="loader" /></div>;

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Mes Présentations</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {presentations.length} présentation{presentations.length !== 1 ? 's' : ''} assignée{presentations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600,
              color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab.id ? tab.color : 'transparent'}`,
              transition: 'var(--transition)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ color: tab.color }}>{tab.icon}</span>
            {tab.label}
            <span style={{
              padding: '0.1rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === tab.id ? `${tab.color}20` : 'var(--surface-1)',
              fontSize: '0.72rem',
              color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
              fontWeight: 700,
            }}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tabPres.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
          <p>Aucune présentation dans cette catégorie</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {tabPres.map(p => {
            const isLate = p.statut === 'en_retard';
            const isDone = p.statut === 'termine';
            const diff = Math.ceil((new Date(p.dateLimite) - new Date()) / 86400000);
            const uploaded = p.uploads?.[user.id];
            const note = p.notes?.[user.id];

            return (
              <div key={p.id} className="card" style={{
                borderColor: isLate ? 'rgba(239,68,68,0.35)' : isDone ? 'rgba(34,197,94,0.35)' : 'var(--border)',
              }}>
                {/* Card top accent */}
                <div style={{
                  height: 3, margin: '-1.5rem -1.5rem 1.25rem',
                  background: isLate
                    ? 'linear-gradient(90deg, var(--danger), transparent)'
                    : isDone
                    ? 'linear-gradient(90deg, var(--success), transparent)'
                    : 'linear-gradient(90deg, var(--ofppt-blue), var(--ofppt-cyan))',
                  borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)', lineHeight: 1.3, flex: 1 }}>
                    {p.titre}
                  </h3>
                  <span className={`badge ${p.type === 'collective' ? 'badge-collective' : 'badge-individual'}`}
                    style={{ flexShrink: 0 }}>
                    {p.type}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                  {p.module}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'var(--surface-1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Deadline : </span>
                    <span style={{ fontWeight: 600, color: diff <= 0 ? 'var(--danger)' : diff <= 3 ? 'var(--warning)' : 'var(--text-primary)' }}>
                      {p.dateLimite}
                    </span>
                  </div>
                  <div style={{ background: 'var(--surface-1)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Durée : </span>
                    <span style={{ fontWeight: 600 }}>{p.duree} min</span>
                  </div>
                </div>

                {uploaded && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--success-bg)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.875rem',
                    fontSize: '0.75rem',
                    color: 'var(--success)',
                  }}>
                    <FileText size={13} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{uploaded.fichier}</span>
                    <span style={{ flexShrink: 0 }}>{uploaded.date}</span>
                  </div>
                )}

                {note !== undefined && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.875rem',
                    fontSize: '0.8rem',
                  }}>
                    <Star size={14} fill="var(--warning)" color="var(--warning)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Note :</span>
                    <span style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '1rem' }}>{note}/20</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setDetailModal(p)} style={{ flex: 1 }}>
                    <Eye size={14} /> Détails
                  </button>
                  {!isDone && (
                    <button className="btn btn-primary btn-sm" onClick={() => setUploadModal(p)} style={{ flex: 2 }}>
                      <Upload size={14} /> {uploaded ? 'Mettre à jour' : 'Uploader PPT'}
                    </button>
                  )}
                  {p.type === 'collective' && !isDone && (
                    <button className="btn btn-orange btn-sm btn-icon" onClick={() => setRouletteModal(p)} title="Roulette">
                      <Shuffle size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={!!uploadModal}
        onClose={() => { setUploadModal(null); setSelectedFile(null); }}
        title={`Uploader — ${uploadModal?.titre}`}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setUploadModal(null); setSelectedFile(null); }}>Annuler</button>
            <button className="btn btn-primary" onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? <><div className="loader loader-sm" style={{ borderTopColor: 'white' }} /> Upload...</> : <><Upload size={15} /> Soumettre</>}
            </button>
          </>
        }
      >
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'var(--ofppt-cyan)' : selectedFile ? 'var(--success)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(0,168,225,0.06)' : selectedFile ? 'var(--success-bg)' : 'var(--surface-1)',
            transition: 'var(--transition)',
          }}
        >
          <input type="file" ref={fileRef} style={{ display: 'none' }} accept=".pptx,.ppt,.pdf"
            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
          />
          {selectedFile ? (
            <>
              <FileText size={36} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>{selectedFile.name}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — Cliquez pour changer
              </p>
            </>
          ) : (
            <>
              <Upload size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Glissez votre fichier ici
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ou cliquez pour sélectionner (.pptx, .ppt, .pdf)
              </p>
            </>
          )}
        </div>
        {uploadModal?.consignes && (
          <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--info-bg)', border: '1px solid rgba(0,168,225,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Consignes du formateur</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{uploadModal.consignes}</p>
          </div>
        )}
      </Modal>

      {/* Roulette Modal */}
      {rouletteModal && (
        <Modal isOpen={!!rouletteModal} onClose={() => setRouletteModal(null)} title={`Roulette — ${rouletteModal.titre}`} size="md">
          <Roulette presentation={rouletteModal} onSave={result => {
            const updated = { ...rouletteModal, repartition: result };
            updatePresentation(rouletteModal.id, updated);
            setPresentations(prev => prev.map(p => p.id === rouletteModal.id ? updated : p));
          }} />
        </Modal>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={detailModal.titre} size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${detailModal.type === 'collective' ? 'badge-collective' : 'badge-individual'}`}>{detailModal.type}</span>
              <span className="badge badge-neutral"><Clock size={11} /> {detailModal.duree} min</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Module', val: detailModal.module },
                { label: 'Date limite', val: detailModal.dateLimite },
                { label: 'Participants', val: `${(detailModal.stagiairesAssignes || []).length} stagiaires` },
                { label: 'Créé le', val: detailModal.dateCreation },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.val || '—'}</div>
                </div>
              ))}
            </div>
            {detailModal.description && (
              <>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{detailModal.description}</p>
              </>
            )}
            {detailModal.consignes && (
              <>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Consignes</div>
                <div style={{ background: 'var(--info-bg)', border: '1px solid rgba(0,168,225,0.2)', borderRadius: 'var(--radius-md)', padding: '0.875rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {detailModal.consignes}
                </div>
              </>
            )}
            {detailModal.criteres && (
              <>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Critères d'évaluation</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {Object.entries(detailModal.criteres).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-1)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ofppt-cyan)' }}>{v}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MesPresentations;
