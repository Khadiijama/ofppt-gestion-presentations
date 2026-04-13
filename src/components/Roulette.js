import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shuffle, RotateCcw, Save, Trash2, Trophy, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const HISTORY_KEY = 'roulette_history';
const PLANNING_KEY = 'roulette_planning';

const SEGMENT_COLORS = [
  '#003f7f', '#00a8e1', '#ff6b35', '#10b981',
  '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4',
  '#84cc16', '#ec4899', '#14b8a6', '#6366f1',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {}; }
  catch { return {}; }
};
const saveHistory = (h) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
const getSavedPlanning = () => {
  try { return JSON.parse(localStorage.getItem(PLANNING_KEY)) || []; }
  catch { return []; }
};

/**
 * Fair shuffle: participants who appeared less often in past sessions get
 * higher priority in the next draw.
 */
const fairShuffle = (participants) => {
  const history = getHistory();
  const weighted = participants.map(p => ({
    ...p,
    weight: 1 / (1 + (history[p.id || p.name] || 0)),
  }));
  // Sort by weight desc + small random tiebreak
  return [...weighted]
    .map(p => ({ ...p, r: Math.random() * p.weight }))
    .sort((a, b) => b.r - a.r);
};

const updateHistory = (participants) => {
  const history = getHistory();
  participants.forEach(p => {
    const key = p.id || p.name;
    history[key] = (history[key] || 0) + 1;
  });
  saveHistory(history);
};

// ─── SVG Wheel ───────────────────────────────────────────────────────────────
const RouletteWheel = ({ participants, spinning, rotation }) => {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 10;
  const n = participants.length;

  if (n === 0) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: '4px dashed var(--surface-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center',
        padding: '2rem',
      }}>
        Ajoutez des participants pour démarrer
      </div>
    );
  }

  const sliceAngle = (2 * Math.PI) / n;

  const describeSlice = (index) => {
    const startAngle = index * sliceAngle - Math.PI / 2;
    const endAngle = startAngle + sliceAngle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const labelPos = (index) => {
    const angle = index * sliceAngle + sliceAngle / 2 - Math.PI / 2;
    const rr = r * 0.65;
    return {
      x: cx + rr * Math.cos(angle),
      y: cy + rr * Math.sin(angle),
      angle: ((index * sliceAngle + sliceAngle / 2) * 180) / Math.PI,
    };
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Pointer arrow */}
      <div style={{
        position: 'absolute', top: '-16px', left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '20px solid var(--accent-orange)',
        filter: 'drop-shadow(0 2px 4px rgba(255,107,53,0.5))',
        zIndex: 10,
      }} />

      <svg
        width={size}
        height={size}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
            : 'transform 0s',
          borderRadius: '50%',
          filter: 'drop-shadow(0 8px 32px rgba(0,63,127,0.35))',
        }}
      >
        <defs>
          <filter id="segment-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Segments */}
        {participants.map((p, i) => {
          const lp = labelPos(i);
          const name = (p.name || p.nom || '?').split(' ')[0];
          return (
            <g key={`seg-${i}`}>
              <path
                d={describeSlice(i)}
                fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                filter="url(#segment-shadow)"
              />
              <text
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={n > 8 ? '9' : n > 5 ? '11' : '13'}
                fontWeight="700"
                fontFamily="Montserrat, sans-serif"
                transform={`rotate(${lp.angle}, ${lp.x}, ${lp.y})`}
                style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {name.length > 8 ? name.slice(0, 7) + '.' : name}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={30} fill="var(--bg-primary)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={22} fill="linear-gradient(135deg, #003f7f, #00a8e1)" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="11" fontWeight="900" fontFamily="Montserrat">
          OFPPT
        </text>
      </svg>
    </div>
  );
};

// ─── Result Card ──────────────────────────────────────────────────────────────
const ResultCard = ({ item, index, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'all 0.4s ease',
      background: 'var(--surface-card)',
      border: `1px solid ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}40`,
      borderLeft: `4px solid ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`,
      borderRadius: 'var(--radius-md)',
      padding: '0.875rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: `${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}20`,
        border: `2px solid ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.8rem',
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      }}>
        {(item.user.name || item.user.nom || '?').charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
          {item.user.name || item.user.nom}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.part}
        </div>
      </div>
      <span style={{
        fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
        borderRadius: '50px',
        background: `${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}15`,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
        flexShrink: 0,
      }}>
        #{index + 1}
      </span>
    </div>
  );
};

// ─── Main Roulette Component ──────────────────────────────────────────────────
const Roulette = ({
  // new API
  participants: initialParticipants = [],
  presentationTitle = '',
  parts = [],
  onComplete,
  // legacy API (used by GestionPresentations & MesPresentations)
  presentation,
  onSave,
}) => {
  // ── backward compat: derive from legacy `presentation` prop ──────────────
  if (presentation) {
    const derived = Array.isArray(presentation.stagiairesAssignes)
      ? presentation.stagiairesAssignes.map((id, i) => ({ id, name: `Stagiaire ${i + 1}` }))
      : [];
    initialParticipants = derived.length > 0 ? derived : initialParticipants;
    presentationTitle = presentation.titre || presentationTitle;
    onComplete = onComplete || onSave;
  }
  // ────────────────────────────────────────────────────────────────────────
  const [participants, setParticipants] = useState(initialParticipants);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [savedPlanning, setSavedPlanning] = useState(getSavedPlanning());
  const [showHistory, setShowHistory] = useState(false);
  const [customParts, setCustomParts] = useState(
    parts.length > 0 ? parts : ['Introduction', 'Développement', 'Conclusion', 'Démonstration', 'Questions']
  );
  const [newPart, setNewPart] = useState('');
  const spinRef = useRef(null);

  // Sync participants when prop changes
  useEffect(() => {
    if (initialParticipants.length > 0) setParticipants(initialParticipants);
  }, [initialParticipants]);

  const availableParts = customParts.slice(0, participants.length);

  const spin = useCallback(() => {
    if (spinning || participants.length === 0) return;
    setSpinning(true);
    setResult(null);
    setWinner(null);

    // Compute a random rotation: multiple full turns + land on winner
    const fullTurns = 5 + Math.floor(Math.random() * 3); // 5–7 full rotations
    const shuffled = fairShuffle(participants);
    const winnerIndex = 0; // top participant after fair shuffle
    const sliceAngle = 360 / participants.length;
    // We want the wheel to stop so segment[winnerIndex] is at the top (pointer)
    // Pointer is at 270° in SVG space (top). Segment i starts at i * sliceAngle - 90.
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);
    const totalRotation = rotation + fullTurns * 360 + targetAngle;

    setRotation(totalRotation);

    spinRef.current = setTimeout(() => {
      const finalShuffled = fairShuffle(participants);
      const assigned = finalShuffled.map((p, i) => ({
        user: p,
        part: availableParts[i] || `Partie ${i + 1}`,
      }));

      updateHistory(finalShuffled);
      setResult(assigned);
      setWinner(finalShuffled[0]);
      setSpinning(false);
      if (onComplete) onComplete(assigned);
    }, 4200);
  }, [spinning, participants, rotation, availableParts, onComplete]);

  useEffect(() => () => { if (spinRef.current) clearTimeout(spinRef.current); }, []);

  const reset = () => {
    setResult(null);
    setWinner(null);
    setRotation(0);
    setSpinning(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
  };

  const savePlanning = () => {
    if (!result) return;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      presentation: presentationTitle || 'Présentation sans titre',
      assignations: result,
    };
    const updated = [entry, ...savedPlanning].slice(0, 10);
    setSavedPlanning(updated);
    localStorage.setItem(PLANNING_KEY, JSON.stringify(updated));
  };

  const deletePlanningEntry = (id) => {
    const updated = savedPlanning.filter(e => e.id !== id);
    setSavedPlanning(updated);
    localStorage.setItem(PLANNING_KEY, JSON.stringify(updated));
  };

  const addPart = () => {
    const trimmed = newPart.trim();
    if (trimmed && !customParts.includes(trimmed)) {
      setCustomParts(prev => [...prev, trimmed]);
      setNewPart('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Main wheel card ── */}
      <div style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--surface-border)',
          background: 'linear-gradient(135deg, rgba(0,63,127,0.08), rgba(0,168,225,0.04))',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #003f7f, #00a8e1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shuffle size={18} color="white" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
              Roulette de Distribution  <span style={{ fontSize: '0.7rem', background: 'rgba(0,168,225,0.15)', color: '#00a8e1', padding: '0.15rem 0.5rem', borderRadius: '50px', marginLeft: '0.5rem', fontWeight: 600 }}>v2</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Distribution équitable et mémorisée — algorithme anti-répétition
            </p>
          </div>
        </div>

        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Left: Wheel */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <RouletteWheel
              participants={participants}
              spinning={spinning}
              rotation={rotation}
            />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={spin}
                disabled={spinning || participants.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: spinning || participants.length === 0
                    ? 'var(--surface-border)'
                    : 'linear-gradient(135deg, #003f7f, #00a8e1)',
                  color: spinning || participants.length === 0 ? 'var(--text-muted)' : 'white',
                  fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.875rem',
                  cursor: spinning || participants.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: spinning || participants.length === 0 ? 'none' : '0 4px 20px rgba(0,63,127,0.4)',
                  minWidth: '160px', justifyContent: 'center',
                }}
              >
                {spinning
                  ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Tirage en cours…</>
                  : <><Shuffle size={16} /> Lancer la Roulette</>}
              </button>

              {result && (
                <>
                  <button
                    onClick={savePlanning}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(16,185,129,0.4)',
                      background: 'rgba(16,185,129,0.08)',
                      color: '#10b981',
                      fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.08)'}
                  >
                    <Save size={14} /> Sauvegarder
                  </button>
                  <button
                    onClick={reset}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.75rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--surface-border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <RotateCcw size={14} /> Réinitialiser
                  </button>
                </>
              )}
            </div>

            {/* Winner announcement */}
            {winner && !spinning && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,107,53,0.04))',
                border: '1px solid rgba(255,107,53,0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                maxWidth: '320px',
              }}>
                <Trophy size={28} color="#ff6b35" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 600 }}>
                  PREMIER TIRÉ
                </div>
                <div style={{
                  fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.2rem',
                  color: 'var(--text-primary)', marginBottom: '0.2rem',
                }}>
                  {winner.name || winner.nom}
                </div>
                {winner.filiere && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {winner.filiere}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Participants + Parts config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Participants list */}
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.6rem',
              }}>
                <Users size={14} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  PARTICIPANTS ({participants.length})
                </span>
              </div>

              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                padding: '0.75rem', maxHeight: '180px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                border: '1px solid var(--surface-border)',
              }}>
                {participants.length === 0 ? (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                    Aucun participant — passez des participants depuis la page de gestion
                  </p>
                ) : (
                  participants.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.4rem 0.5rem', borderRadius: '6px',
                      background: 'var(--surface-card)',
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 800, color: 'white',
                      }}>
                        {(p.name || p.nom || '?').charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', flex: 1 }}>
                        {p.name || p.nom}
                      </span>
                      {p.filiere && (
                        <span style={{
                          fontSize: '0.65rem', color: 'var(--text-muted)',
                          background: 'var(--bg-primary)', borderRadius: '4px',
                          padding: '0.1rem 0.35rem',
                        }}>
                          {p.filiere}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Parts config */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  PARTIES À DISTRIBUER
                </span>
              </div>
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                padding: '0.75rem', border: '1px solid var(--surface-border)',
                display: 'flex', flexDirection: 'column', gap: '0.35rem',
                maxHeight: '150px', overflowY: 'auto',
              }}>
                {customParts.map((part, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.3rem 0.5rem', borderRadius: '6px',
                    background: i < participants.length ? 'rgba(0,63,127,0.08)' : 'transparent',
                    opacity: i < participants.length ? 1 : 0.4,
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '0.4rem' }}>{i + 1}.</span>
                      {part}
                    </span>
                    <button
                      onClick={() => setCustomParts(p => p.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 2px', lineHeight: 1 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add part */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  value={newPart}
                  onChange={e => setNewPart(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addPart()}
                  placeholder="Ajouter une partie…"
                  style={{
                    flex: 1, background: 'var(--bg-secondary)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.65rem',
                    color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none',
                  }}
                />
                <button
                  onClick={addPart}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: 'white', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        {result && !spinning && (
          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            <div style={{
              borderTop: '1px dashed var(--surface-border)',
              paddingTop: '1.25rem',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  🎯 Résultats de la Répartition
                </div>
                <span style={{
                  fontSize: '0.72rem', background: 'rgba(16,185,129,0.12)',
                  color: '#10b981', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '50px', padding: '0.2rem 0.6rem', fontWeight: 600,
                }}>
                  {result.length} assignations
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
                {result.map((item, i) => (
                  <ResultCard key={i} item={item} index={i} delay={i * 120} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Saved Planning History ── */}
      {savedPlanning.length > 0 && (
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setShowHistory(h => !h)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.1rem 1.5rem',
              background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={16} color="var(--text-secondary)" />
              <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Planning Sauvegardés
              </span>
              <span style={{
                fontSize: '0.7rem', background: 'rgba(0,63,127,0.12)',
                color: 'var(--accent-primary)', borderRadius: '50px',
                padding: '0.15rem 0.5rem', fontWeight: 700,
              }}>
                {savedPlanning.length}
              </span>
            </div>
            {showHistory ? <ChevronUp size={16} color="var(--text-secondary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
          </button>

          {showHistory && (
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedPlanning.map(entry => (
                <div key={entry.id} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                        {entry.presentation}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={10} />
                        {entry.date}
                      </div>
                    </div>
                    <button
                      onClick={() => deletePlanningEntry(entry.id)}
                      style={{
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '6px', padding: '0.3rem', cursor: 'pointer', color: '#ef4444',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {entry.assignations.map((a, i) => (
                      <div key={i} style={{
                        fontSize: '0.72rem', padding: '0.25rem 0.6rem',
                        borderRadius: '50px',
                        background: `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}15`,
                        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                        border: `1px solid ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}30`,
                        fontWeight: 600,
                      }}>
                        {(a.user.name || a.user.nom || '').split(' ')[0]} → {a.part}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={clearHistory}
                style={{
                  alignSelf: 'flex-end',
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                  background: 'transparent', border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-md)', padding: '0.4rem 0.875rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--surface-border)'; }}
              >
                <RotateCcw size={12} /> Réinitialiser l'historique
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Roulette;
