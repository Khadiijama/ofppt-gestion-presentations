import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, Presentation, Users, Shuffle,
  CheckCircle, BarChart2, Calendar, Library, Star, MapPin,
  TrendingUp, Award, Zap
} from 'lucide-react';
import { STATS_NATIONAUX, CMC_LIST } from '../data/ofpptData';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Presentation size={28} />,
      title: 'Gestion des Présentations',
      desc: 'Créez, assignez et suivez toutes vos présentations et exposés avec deadlines, critères d\'évaluation et historique complet.',
      color: 'blue',
    },
    {
      icon: <Users size={28} />,
      title: 'Suivi des Stagiaires',
      desc: 'Consultez en temps réel qui a uploadé son travail, qui est en retard, et exportez des rapports par classe ou module.',
      color: 'cyan',
    },
    {
      icon: <Shuffle size={28} />,
      title: 'Roulette Intelligente',
      desc: 'Distribuez les parties de présentations collectives de façon équitable et aléatoire grâce à notre roulette animée.',
      color: 'orange',
    },
    {
      icon: <Calendar size={28} />,
      title: 'Calendrier des Deadlines',
      desc: 'Visualisez toutes vos échéances sur un calendrier mensuel avec rappels automatiques et alertes colorées.',
      color: 'success',
    },
    {
      icon: <BarChart2 size={28} />,
      title: 'Rapports & Analytics',
      desc: 'Analysez les taux de complétion, la ponctualité et la progression par module, filière ou promotion.',
      color: 'warning',
    },
    {
      icon: <Library size={28} />,
      title: 'Bibliothèque',
      desc: 'Archivez et retrouvez toutes les présentations passées avec filtres par filière, module et année scolaire.',
      color: 'info',
    },
  ];

  const steps = [
    { num: '01', title: 'Le formateur crée', desc: 'Il crée une présentation avec module, deadline, consignes et critères d\'évaluation.', icon: <Presentation size={20} /> },
    { num: '02', title: 'Assignation automatique', desc: 'La roulette distribue équitablement les parties entre les stagiaires du groupe.', icon: <Shuffle size={20} /> },
    { num: '03', title: 'Le stagiaire upload', desc: 'Chaque stagiaire soumet son fichier PowerPoint avant la deadline depuis son espace.', icon: <CheckCircle size={20} /> },
  ];

  const testimonials = [
    { name: 'Karim Benali', role: 'Formateur — ISTA NTIC Syba, Rabat', text: 'Avant je perdais des heures à noter qui avait rendu quoi. Maintenant en 2 clics je vois tout. Indispensable !', stars: 5 },
    { name: 'Fatima Zahra M.', role: 'Stagiaire — DEV Web Full Stack, Rabat', text: 'La roulette pour les groupes c\'est génial ! Plus de disputes pour choisir les parties. Et les notifications de deadline nous sauvent la mise.', stars: 5 },
    { name: 'Nadia El Fassi', role: 'Formatrice — TSC, Salé', text: 'L\'interface est très propre et intuitive. Mes stagiaires l\'ont prise en main en moins de 5 minutes.', stars: 5 },
  ];

  const COLOR_STYLE = {
    blue:    { bg: 'rgba(0,63,127,0.12)',   color: 'var(--ofppt-blue-light)', border: 'rgba(0,63,127,0.3)' },
    cyan:    { bg: 'rgba(0,168,225,0.1)',   color: 'var(--ofppt-cyan)',       border: 'rgba(0,168,225,0.3)' },
    orange:  { bg: 'rgba(255,107,53,0.1)', color: 'var(--ofppt-orange)',     border: 'rgba(255,107,53,0.3)' },
    success: { bg: 'rgba(34,197,94,0.1)',   color: 'var(--success)',          border: 'rgba(34,197,94,0.3)' },
    warning: { bg: 'rgba(245,158,11,0.1)',  color: 'var(--warning)',          border: 'rgba(245,158,11,0.3)' },
    info:    { bg: 'rgba(0,168,225,0.08)',  color: 'var(--info)',             border: 'rgba(0,168,225,0.25)' },
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 64,
        background: 'rgba(10,15,30,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-blue)',
          }}>
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              OFPPT<span style={{ color: 'var(--ofppt-cyan)' }}> Présentations</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Plateforme Nationale
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/a-propos')}>À Propos</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Connexion <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: '6rem 2rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,63,127,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,168,225,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }} className="fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(0,168,225,0.08)',
            border: '1px solid rgba(0,168,225,0.25)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem', color: 'var(--ofppt-cyan)',
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            marginBottom: '1.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            <Zap size={12} /> 12 CMC · 260+ Filières · 50 000+ Stagiaires
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Gérez vos présentations<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--ofppt-cyan), #60a5fa, var(--ofppt-orange))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              simplement &amp; efficacement
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            La plateforme dédiée aux formateurs et stagiaires des établissements
            <strong style={{ color: 'var(--ofppt-orange)' }}> OFPPT </strong>
            pour organiser, suivre et évaluer toutes les présentations sans surcharge.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')} style={{ gap: '0.75rem' }}>
              Commencer maintenant <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/a-propos')}>
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5rem', textAlign: 'center',
        }}>
          {[
            { icon: <MapPin size={20} />, val: STATS_NATIONAUX.totalCMC, label: 'CMC au Maroc', color: 'var(--ofppt-cyan)' },
            { icon: <Award size={20} />, val: STATS_NATIONAUX.totalFilieres + '+', label: 'Filières', color: 'var(--ofppt-orange)' },
            { icon: <Users size={20} />, val: (STATS_NATIONAUX.totalStagiaires / 1000).toFixed(0) + 'K+', label: 'Stagiaires', color: 'var(--success)' },
            { icon: <TrendingUp size={20} />, val: STATS_NATIONAUX.tauxInsertion + '%', label: 'Taux d\'insertion', color: 'var(--warning)' },
            { icon: <GraduationCap size={20} />, val: STATS_NATIONAUX.etablissements + '+', label: 'Établissements', color: '#c084fc' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.875rem' }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            Des outils pensés pour les réalités des centres de formation OFPPT
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {features.map(f => {
            const c = COLOR_STYLE[f.color];
            return (
              <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: 'var(--radius-lg)',
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.color,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.875rem' }}>
            Comment ça marche ?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1rem' }}>
            3 étapes simples pour une gestion sans stress
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem',
                padding: '2rem 1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
              }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-blue)',
                }}>
                  {s.icon}
                </div>
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--ofppt-orange)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.15rem 0.6rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                }}>
                  Étape {s.num}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CMC MAP ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.875rem' }}>
            Les 12 Cités des Métiers et des Compétences
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Un réseau national au service de la formation professionnelle
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {CMC_LIST.map((cmc, i) => (
            <div key={cmc.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', lineHeight: 1.2 }}>{cmc.nom}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />{cmc.ville}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {cmc.places && (
                  <div style={{ background: 'var(--surface-1)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    🪑 {cmc.places.toLocaleString()} places
                  </div>
                )}
                {cmc.filieres && (
                  <div style={{ background: 'var(--surface-1)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    📚 {cmc.filieres} filières
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Ils l'utilisent déjà</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Ce que disent nos utilisateurs OFPPT</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-heading)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,63,127,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Rejoignez les formateurs et stagiaires des CMC qui utilisent déjà la plateforme pour simplifier leur quotidien.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Accéder à la plateforme <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>OFPPT Présentations</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Office de la Formation Professionnelle et de la Promotion du Travail — Maroc
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Plateforme de gestion des présentations pour les Cités des Métiers et des Compétences
        </p>
      </footer>
    </div>
  );
};

export default Home;
