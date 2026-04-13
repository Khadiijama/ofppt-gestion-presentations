import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CMC_LIST, STATS_NATIONAUX, getAllFilieres } from '../data/ofpptData';
import {
  MapPin, Phone, Mail, Globe, ChevronDown, ChevronUp,
  Award, Users, BookOpen, Building2, TrendingUp, Star,
  ArrowLeft, ExternalLink, CheckCircle
} from 'lucide-react';

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que l'OFPPT ?",
    a: "L'Office de la Formation Professionnelle et de la Promotion du Travail (OFPPT) est un établissement public créé en 1974, sous la tutelle du Ministère chargé de la Formation Professionnelle. Il constitue le premier opérateur public de formation professionnelle au Maroc."
  },
  {
    q: "Qu'est-ce qu'un CMC (Cité des Métiers et des Compétences) ?",
    a: "Les Cités des Métiers et des Compétences (CMC) sont des complexes de formation de nouvelle génération lancés dans le cadre du programme de 2021. Chaque région du Maroc dispose de son propre CMC, offrant des formations dans plusieurs secteurs stratégiques avec des équipements ultramodernes."
  },
  {
    q: "Comment postuler à une formation OFPPT ?",
    a: "Les candidatures se font en ligne via le portail officiel ofppt.ma. Le processus comprend : dépôt de dossier en ligne, tests de présélection (logique, langue), entretien, et affectation dans l'établissement selon la région et les disponibilités."
  },
  {
    q: "Quels sont les niveaux de formation proposés ?",
    a: "L'OFPPT propose 4 niveaux : Spécialisation (6 mois, sans condition), Qualification (1 an, niveau 3ème), Technicien (T, 1 an, niveau Bac), et Technicien Spécialisé (TS, 2 ans, niveau Bac). Les diplômes sont reconnus nationalement."
  },
  {
    q: "Comment fonctionne cette plateforme de gestion des présentations ?",
    a: "Cette plateforme permet aux formateurs de créer et gérer des présentations (individuelles ou collectives) pour leurs classes. Les stagiaires peuvent consulter leurs assignations, uploader leurs fichiers, et participer à la roulette de distribution pour les sujets collectifs. Tout est synchronisé en temps réel."
  },
  {
    q: "La formation est-elle gratuite ?",
    a: "Oui, la formation professionnelle à l'OFPPT est entièrement gratuite pour les stagiaires marocains. Des allocations de formation peuvent également être accordées aux stagiaires en situation de besoin, sous certaines conditions."
  },
  {
    q: "Quel est le taux d'insertion professionnelle ?",
    a: "Le taux d'insertion professionnelle des lauréats OFPPT avoisine les 72% dans la première année suivant l'obtention du diplôme. Certaines filières à forte demande (Digital, Industrie, Santé) affichent des taux encore plus élevés, dépassant les 85%."
  },
];

// ─── CMC Region Colors ────────────────────────────────────────────────────────
const CMC_COLORS = [
  '#003f7f', '#00a8e1', '#ff6b35', '#10b981',
  '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4',
  '#84cc16', '#ec4899', '#14b8a6', '#6366f1'
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FaqItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: open ? 'rgba(0,63,127,0.06)' : 'var(--surface-card)',
        border: `1px solid ${open ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.75rem',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '1rem',
        }}
      >
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: open ? 'var(--accent-primary)' : 'var(--text-primary)',
          transition: 'color 0.3s',
        }}>
          <span style={{ color: 'var(--accent-secondary)', marginRight: '0.5rem' }}>
            {String(index + 1).padStart(2, '0')}.
          </span>
          {item.q}
        </span>
        <div style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: open ? 'var(--accent-primary)' : 'var(--surface-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
        }}>
          {open
            ? <ChevronUp size={14} color="white" />
            : <ChevronDown size={14} color="var(--text-secondary)" />
          }
        </div>
      </button>
      {open && (
        <div style={{
          padding: '0 1.5rem 1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          fontSize: '0.9rem',
          borderTop: '1px solid var(--surface-border)',
          paddingTop: '1rem',
          animation: 'fadeIn 0.3s ease',
        }}>
          {item.a}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function APropos() {
  const allFilieres = getAllFilieres();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ── Topbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(0,20,50,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #003f7f, #00a8e1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: 'white', fontSize: '1rem', fontFamily: 'Montserrat',
          }}>O</div>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'white', fontSize: '1rem' }}>
            OFPPT Présentations
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowLeft size={14} /> Accueil
          </Link>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            Se connecter
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #001a3d 0%, #003f7f 50%, #005fa3 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.06)',
            width: `${300 + i * 200}px`,
            height: `${300 + i * 200}px`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,168,225,0.15)', border: '1px solid rgba(0,168,225,0.3)',
            borderRadius: '50px', padding: '0.4rem 1.25rem', marginBottom: '2rem',
            fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 500,
          }}>
            <Award size={14} />  Établissement public — Maroc
          </div>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white',
            lineHeight: 1.15, marginBottom: '1.5rem',
          }}>
            À Propos de l'<span style={{ color: '#00a8e1' }}>OFPPT</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto',
          }}>
            L'Office de la Formation Professionnelle et de la Promotion du Travail — premier opérateur public 
            de formation professionnelle au Maroc, au service des compétences nationales depuis 1974.
          </p>
        </div>
      </section>

      {/* ── Global Stats ── */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1.25rem',
        }}>
          {[
            { icon: Building2, label: 'CMC Régionaux', value: STATS_NATIONAUX.totalCMC, color: '#003f7f' },
            { icon: BookOpen, label: 'Filières proposées', value: `${STATS_NATIONAUX.totalFilieres}+`, color: '#00a8e1' },
            { icon: Users, label: 'Stagiaires', value: `+${(STATS_NATIONAUX.totalStagiaires / 1000).toFixed(0)}k`, color: '#ff6b35' },
            { icon: Star, label: 'Formateurs', value: `${(STATS_NATIONAUX.totalFormateurs / 1000).toFixed(1)}k`, color: '#10b981' },
            { icon: TrendingUp, label: 'Taux insertion', value: `${STATS_NATIONAUX.tauxInsertion}%`, color: '#8b5cf6' },
            { icon: MapPin, label: 'Établissements', value: STATS_NATIONAUX.etablissements, color: '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${color}18`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1rem',
              }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{
                fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Montserrat',
                color: 'var(--text-primary)', lineHeight: 1,
              }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission & Values ── */}
      <section style={{ padding: '2rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Mission */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,63,127,0.12), rgba(0,168,225,0.06))',
            border: '1px solid rgba(0,168,225,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(0,63,127,0.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '1.5rem',
            }}>
              <Award size={24} color="#00a8e1" />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Notre Mission
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              Former et qualifier les ressources humaines en vue de leur pleine contribution au développement socio-économique du Maroc, 
              en garantissant une formation professionnelle de qualité, ancrée dans les besoins du marché du travail et ouverte sur les standards internationaux.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Formation professionnelle initiale', 'Formation continue en entreprise', 'Certification des compétences', 'Partenariats internationaux'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="#10b981" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,107,53,0.02))',
            border: '1px solid rgba(255,107,53,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '1.5rem',
            }}>
              <TrendingUp size={24} color="#ff6b35" />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Notre Vision
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              Devenir un opérateur de formation professionnelle de référence à l'échelle africaine, en s'appuyant sur les Cités des Métiers et des Compétences 
              pour offrir un écosystème d'apprentissage innovant, numérique et aligné sur les métiers d'avenir.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['12 CMC dernière génération', 'Équipements haute technologie', 'Pédagogie par compétences', 'Insertion professionnelle garantie'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color="#ff6b35" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 12 CMC Grid ── */}
      <section style={{ background: 'var(--bg-secondary)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block', background: 'rgba(0,168,225,0.1)',
              border: '1px solid rgba(0,168,225,0.3)', borderRadius: '50px',
              padding: '0.3rem 1rem', fontSize: '0.78rem', color: '#00a8e1',
              marginBottom: '1rem', fontWeight: 600, letterSpacing: '0.05em',
            }}>
              RÉSEAU NATIONAL
            </span>
            <h2 style={{
              fontFamily: 'Montserrat', fontWeight: 800, fontSize: '2rem',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Les 12 Cités des Métiers et des Compétences
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Un CMC par région — couvrant l'ensemble du territoire marocain
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {CMC_LIST.map((cmc, idx) => (
              <div key={cmc.id} style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                borderLeft: `4px solid ${CMC_COLORS[idx]}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${CMC_COLORS[idx]}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: `${CMC_COLORS[idx]}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.85rem',
                    color: CMC_COLORS[idx],
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: '50px', background: `${CMC_COLORS[idx]}18`,
                    color: CMC_COLORS[idx], border: `1px solid ${CMC_COLORS[idx]}30`,
                  }}>
                    {cmc.region.split('-')[0]}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.95rem',
                  color: 'var(--text-primary)', marginBottom: '0.25rem',
                }}>
                  {cmc.nom}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <MapPin size={12} color={CMC_COLORS[idx]} />
                  {cmc.ville}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Places', value: cmc.places.toLocaleString('fr-FR') },
                    { label: 'Filières', value: cmc.filieres },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: 'var(--bg-secondary)', borderRadius: '8px',
                      padding: '0.6rem', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: CMC_COLORS[idx], fontFamily: 'Montserrat' }}>{value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,107,53,0.1)',
            border: '1px solid rgba(255,107,53,0.3)', borderRadius: '50px',
            padding: '0.3rem 1rem', fontSize: '0.78rem', color: '#ff6b35',
            marginBottom: '1rem', fontWeight: 600,
          }}>
            FAQ
          </span>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            Questions Fréquentes
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Tout ce que vous devez savoir sur l'OFPPT et cette plateforme
          </p>
        </div>
        <div>
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem key={idx} item={item} index={idx} />
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section style={{ background: 'var(--bg-secondary)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
              Nous Contacter
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Siège social OFPPT — Avenue Allal Fassi, Madinat Al Irfane, Rabat
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                icon: Phone, label: 'Téléphone', value: '+212 5 37 71 49 49',
                href: 'tel:+212537714949', color: '#003f7f',
              },
              {
                icon: Mail, label: 'Email', value: 'contact@ofppt.ma',
                href: 'mailto:contact@ofppt.ma', color: '#00a8e1',
              },
              {
                icon: Globe, label: 'Portail Officiel', value: 'www.ofppt.ma',
                href: 'https://www.ofppt.ma', color: '#ff6b35', external: true,
              },
              {
                icon: MapPin, label: 'Adresse', value: 'Madinat Al Irfane, Rabat',
                href: '#', color: '#10b981',
              },
            ].map(({ icon: Icon, label, value, href, color, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${color}18`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    {value}
                    {external && <ExternalLink size={12} color={color} />}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#001020', padding: '2rem',
        textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
      }}>
        <p>© {new Date().getFullYear()} OFPPT — Office de la Formation Professionnelle et de la Promotion du Travail</p>
        <p style={{ marginTop: '0.4rem' }}>
          Tous droits réservés • Siège : Madinat Al Irfane, Rabat, Maroc •&nbsp;
          <a href="https://www.ofppt.ma" target="_blank" rel="noopener noreferrer" style={{ color: '#00a8e1' }}>ofppt.ma</a>
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
