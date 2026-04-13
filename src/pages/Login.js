import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserByEmail } from '../api';
import { GraduationCap, LogIn, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('formateur');
  const { login } = useAuth();
  const navigate = useNavigate();

  const DEMO_ACCOUNTS = {
    formateur: { email: 'k.benali@ofppt.ma', password: 'formateur123', name: 'Karim Benali' },
    stagiaire: { email: 'ahmed.elmansouri@stagiaire.ofppt.ma', password: 'stagiaire123', name: 'Ahmed El Mansouri' },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await getUserByEmail(email);
      const users = response.data;
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password.trim()) {
          const { password: _, ...userWithoutPassword } = user;
          login(userWithoutPassword);
          navigate(user.role === 'formateur' ? '/formateur' : '/stagiaire');
        } else {
          setError('Mot de passe incorrect.');
        }
      } else {
        setError('Aucun compte trouvé avec cet email.');
      }
    } catch {
      setError('Impossible de se connecter. Assurez-vous que le serveur json-server est démarré (npm run server).');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    const demo = DEMO_ACCOUNTS[selectedRole];
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,63,127,0.3) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,168,225,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '5%', width: '30%', height: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Left panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        borderRight: '1px solid var(--border)',
      }} className="hide-mobile">
        <div className="float" style={{ marginBottom: '2.5rem' }}>
          <div style={{
            width: 90,
            height: 90,
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-blue)',
          }}>
            <GraduationCap size={48} color="white" />
          </div>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
          Plateforme de Gestion<br />
          <span style={{ background: 'linear-gradient(to right, var(--ofppt-cyan), #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            des Présentations
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 380, fontSize: '1rem', lineHeight: 1.7 }}>
          Un espace dédié aux formateurs et stagiaires des établissements
          <strong style={{ color: 'var(--ofppt-orange)' }}> OFPPT </strong>
          et des Cités des Métiers et des Compétences (<strong style={{ color: 'var(--ofppt-cyan)' }}>CMC</strong>) au Maroc.
        </p>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { val: '12', label: 'CMC au Maroc' },
            { val: '260+', label: 'Filières' },
            { val: '50K+', label: 'Stagiaires' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--ofppt-cyan)' }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div style={{
        flex: '0 0 480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        position: 'relative',
      }}>
        <div className="slide-up" style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: 'none', marginBottom: '2rem', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--ofppt-blue), var(--ofppt-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={28} color="white" />
            </div>
            <h2>OFPPT Platform</h2>
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Connexion</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Accédez à votre espace personnel
          </p>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { role: 'formateur', label: 'Formateur', emoji: '🎓' },
              { role: 'stagiaire', label: 'Stagiaire', emoji: '📚' },
            ].map(r => (
              <button
                key={r.role}
                onClick={() => { setSelectedRole(r.role); setEmail(''); setPassword(''); setError(''); }}
                style={{
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${selectedRole === r.role ? 'var(--ofppt-cyan)' : 'var(--border)'}`,
                  background: selectedRole === r.role ? 'rgba(0,168,225,0.1)' : 'var(--surface-1)',
                  color: selectedRole === r.role ? 'var(--ofppt-cyan)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'var(--transition)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.875rem 1rem',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              lineHeight: 1.5,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Adresse Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'formateur' ? 'k.benali@ofppt.ma' : 'ahmed.elmansouri@stagiaire.ofppt.ma'}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? (
                <><div className="loader loader-sm" style={{ borderTopColor: 'white' }} /> Connexion...</>
              ) : (
                <><LogIn size={18} /> Se connecter</>
              )}
            </button>
          </form>

          {/* Demo shortcut */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(0,63,127,0.1), rgba(0,168,225,0.08))',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} color="var(--ofppt-cyan)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Compte démo {selectedRole}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.625rem', lineHeight: 1.6 }}>
              <div>📧 {DEMO_ACCOUNTS[selectedRole].email}</div>
              <div>🔑 {DEMO_ACCOUNTS[selectedRole].password}</div>
            </div>
            <button onClick={fillDemo} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              <ArrowRight size={14} /> Remplir automatiquement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
