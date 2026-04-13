import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Bell, Shield, Palette, ChevronRight,
  Save, Eye, EyeOff, Check, Camera, Mail,
  Phone, MapPin, AlertCircle, Moon, Sun, Monitor,
} from 'lucide-react';

// ─── Helper: Toggle Switch ─────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }) => (
  <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
    <input id={id} type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    <div style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: checked ? 'var(--accent-primary)' : 'var(--surface-border)',
      position: 'relative', transition: 'background 0.3s',
    }}>
      <div style={{
        position: 'absolute', top: '3px',
        left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: 'white', transition: 'left 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  </label>
);

// ─── Section Tab ──────────────────────────────────────────────────────────────
const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'appearance', label: 'Apparence', icon: Palette },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Parametres() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    nom: user?.nom || user?.name || 'Karim Benali',
    email: user?.email || 'k.benali@ofppt.ma',
    phone: user?.phone || '+212 6 61 23 45 67',
    ville: user?.ville || 'Casablanca',
    bio: user?.bio || 'Formateur expert en développement web et logiciels à l\'OFPPT depuis 8 ans.',
  });

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    newUpload: true,
    deadlineApproaching: true,
    newMessage: true,
    systemAlerts: false,
    weeklyReport: true,
    emailNotifs: false,
  });

  // Security state
  const [security, setSecurity] = useState({ current: '', nouveau: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, nouveau: false, confirm: false });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactMode: false,
    animations: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handlePasswordChange = () => {
    setPassError('');
    setPassSuccess(false);
    if (!security.current) { setPassError('Veuillez saisir votre mot de passe actuel.'); return; }
    if (security.nouveau.length < 6) { setPassError('Le nouveau mot de passe doit contenir au moins 6 caractères.'); return; }
    if (security.nouveau !== security.confirm) { setPassError('Les mots de passe ne correspondent pas.'); return; }
    setPassSuccess(true);
    setSecurity({ current: '', nouveau: '', confirm: '' });
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const initials = (profile.nom.split(' ').map(w => w[0]).join('').toUpperCase()).slice(0, 2);
  const roleLabel = user?.role === 'formateur' ? 'Formateur' : user?.role === 'stagiaire' ? 'Stagiaire' : 'Utilisateur';
  const roleColor = user?.role === 'formateur' ? '#003f7f' : '#10b981';

  return (
    <div style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Paramètres
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Gérez votre profil, vos préférences et la sécurité de votre compte.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left Sidebar Tabs ── */}
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          position: 'sticky',
          top: '80px',
        }}>
          {/* User avatar mini */}
          <div style={{ padding: '0.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #003f7f, #00a8e1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.75rem',
              fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.1rem', color: 'white',
            }}>{initials}</div>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {profile.nom.split(' ')[0]}
            </div>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem',
              borderRadius: '50px', background: `${roleColor}18`, color: roleColor,
              border: `1px solid ${roleColor}30`,
            }}>
              {roleLabel}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '0.75rem' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === id ? 'rgba(0,63,127,0.1)' : 'transparent',
                  color: activeTab === id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === id ? 600 : 400,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  justifyContent: 'space-between',
                  marginBottom: '0.25rem',
                }}
                onMouseEnter={e => { if (activeTab !== id) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={e => { if (activeTab !== id) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon size={16} />
                  {label}
                </span>
                {activeTab === id && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right Content ── */}
        <div>

          {/* ════ PROFILE TAB ════ */}
          {activeTab === 'profile' && (
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <User size={20} color="var(--accent-primary)" />
                <div>
                  <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Informations du Profil</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>Mettez à jour vos informations personnelles</p>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* Avatar editor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #003f7f, #00a8e1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.5rem', color: 'white',
                    }}>{initials}</div>
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--surface-card)', cursor: 'pointer',
                    }}>
                      <Camera size={12} color="white" />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {profile.nom}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{profile.email}</div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.7rem',
                      borderRadius: '50px', background: `${roleColor}18`, color: roleColor,
                      border: `1px solid ${roleColor}30`,
                    }}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { key: 'nom', label: 'Nom complet', icon: User, placeholder: 'Nom et prénom' },
                    { key: 'email', label: 'Adresse email', icon: Mail, placeholder: 'exemple@ofppt.ma' },
                    { key: 'phone', label: 'Téléphone', icon: Phone, placeholder: '+212 6 XX XX XX XX' },
                    { key: 'ville', label: 'Ville', icon: MapPin, placeholder: 'Casablanca' },
                  ].map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        {label}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Icon size={15} style={{
                          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                          color: 'var(--text-muted)', pointerEvents: 'none',
                        }} />
                        <input
                          type={key === 'email' ? 'email' : 'text'}
                          value={profile[key]}
                          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          style={{
                            width: '100%',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--surface-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Biographie
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.75rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'Open Sans, sans-serif',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
                  />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px', justifyContent: 'center' }}
                  >
                    {saved ? <><Check size={16} /> Sauvegardé !</> : <><Save size={16} /> Enregistrer</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ NOTIFICATIONS TAB ════ */}
          {activeTab === 'notifications' && (
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Bell size={20} color="var(--accent-primary)" />
                <div>
                  <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Préférences de Notifications</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>Choisissez les alertes que vous souhaitez recevoir</p>
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { key: 'newUpload', label: 'Nouvel upload', desc: 'Lorsqu\'un stagiaire soumet une présentation' },
                  { key: 'deadlineApproaching', label: 'Deadline proche', desc: 'Rappel 48h avant une échéance' },
                  { key: 'newMessage', label: 'Nouveau message', desc: 'Réception d\'un message direct' },
                  { key: 'systemAlerts', label: 'Alertes système', desc: 'Mises à jour et maintenance de la plateforme' },
                  { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé des activités de la semaine' },
                  { key: 'emailNotifs', label: 'Notifications par email', desc: 'Envoi des alertes à votre adresse email' },
                ].map(({ key, label, desc }, idx, arr) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--surface-border)' : 'none',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{desc}</div>
                    </div>
                    <Toggle
                      id={`notif-${key}`}
                      checked={notifPrefs[key]}
                      onChange={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                    />
                  </div>
                ))}
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {saved ? <><Check size={16} /> Sauvegardé !</> : <><Save size={16} /> Enregistrer</>}
                </button>
              </div>
            </div>
          )}

          {/* ════ SECURITY TAB ════ */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Change password */}
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Shield size={20} color="var(--accent-primary)" />
                  <div>
                    <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Changer le Mot de Passe</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>Utilisez un mot de passe fort d'au moins 6 caractères</p>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'current', label: 'Mot de passe actuel', placeholder: '••••••••' },
                    { key: 'nouveau', label: 'Nouveau mot de passe', placeholder: 'Min. 6 caractères' },
                    { key: 'confirm', label: 'Confirmer le nouveau mot de passe', placeholder: 'Répéter le mot de passe' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        {label}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPass[key] ? 'text' : 'password'}
                          value={security[key]}
                          onChange={e => setSecurity(s => ({ ...s, [key]: e.target.value }))}
                          placeholder={placeholder}
                          style={{
                            width: '100%',
                            background: 'var(--bg-secondary)',
                            border: `1px solid ${passError && !security[key] ? 'var(--accent-danger)' : 'var(--surface-border)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '0.65rem 2.5rem 0.65rem 0.75rem',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                          style={{
                            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0,
                          }}
                        >
                          {showPass[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {passError && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 'var(--radius-md)', padding: '0.75rem',
                      color: '#ef4444', fontSize: '0.8rem',
                    }}>
                      <AlertCircle size={14} />
                      {passError}
                    </div>
                  )}
                  {passSuccess && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: 'var(--radius-md)', padding: '0.75rem',
                      color: '#10b981', fontSize: '0.8rem',
                    }}>
                      <Check size={14} />
                      Mot de passe modifié avec succès !
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handlePasswordChange} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={15} /> Changer le mot de passe
                    </button>
                  </div>
                </div>
              </div>

              {/* Session info */}
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Informations de Session
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Dernière connexion', value: 'Aujourd\'hui, 09:41' },
                    { label: 'Appareil', value: 'Chrome / Windows 11' },
                    { label: 'Adresse IP', value: '105.xxx.xxx.xxx' },
                    { label: 'Statut du compte', value: 'Actif ✓' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.2rem' }}>{label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ APPEARANCE TAB ════ */}
          {activeTab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Theme */}
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Palette size={20} color="var(--accent-primary)" />
                  <div>
                    <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>Thème & Affichage</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.8rem' }}>Personnalisez l'apparence de la plateforme</p>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  {/* Theme picker */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Mode d'affichage
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      {[
                        { id: 'dark', label: 'Sombre', icon: Moon },
                        { id: 'light', label: 'Clair', icon: Sun },
                        { id: 'system', label: 'Système', icon: Monitor },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setAppearance(a => ({ ...a, theme: id }))}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${appearance.theme === id ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
                            background: appearance.theme === id ? 'rgba(0,63,127,0.08)' : 'var(--bg-secondary)',
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Icon size={20} color={appearance.theme === id ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                          <span style={{
                            fontSize: '0.8rem', fontWeight: 600,
                            color: appearance.theme === id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          }}>{label}</span>
                          {appearance.theme === id && (
                            <Check size={12} color="var(--accent-primary)" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font size */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Taille de police
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => setAppearance(a => ({ ...a, fontSize: size }))}
                          style={{
                            flex: 1, padding: '0.6rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${appearance.fontSize === size ? 'var(--accent-primary)' : 'var(--surface-border)'}`,
                            background: appearance.fontSize === size ? 'rgba(0,63,127,0.08)' : 'var(--bg-secondary)',
                            color: appearance.fontSize === size ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: size === 'small' ? '0.75rem' : size === 'medium' ? '0.875rem' : '1rem',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            textTransform: 'capitalize',
                          }}
                        >
                          {size === 'small' ? 'Petite' : size === 'medium' ? 'Moyenne' : 'Grande'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options toggles */}
                  {[
                    { key: 'compactMode', label: 'Mode compact', desc: 'Réduire les espaces entre les éléments' },
                    { key: 'animations', label: 'Animations', desc: 'Activer les transitions et animations UI' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.875rem 0', borderTop: '1px solid var(--surface-border)',
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{label}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{desc}</div>
                      </div>
                      <Toggle
                        id={`app-${key}`}
                        checked={appearance[key]}
                        onChange={() => setAppearance(a => ({ ...a, [key]: !a[key] }))}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {saved ? <><Check size={16} /> Sauvegardé !</> : <><Save size={16} /> Appliquer</>}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
