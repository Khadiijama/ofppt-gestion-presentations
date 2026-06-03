import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/login', { email, password });
            const { token, user } = response.data;

            // Enregistrer localement
            localStorage.setItem('api_token', token);
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_name', user.name);

            // Mettre à jour le state global
            setUser(user);

            // Redirection selon le rôle
            if (user.role === 'formateur') {
                navigate('/dashboard/formateur');
            } else {
                navigate('/dashboard/stagiaire');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                // Erreurs de validation de Laravel
                const validationErrors = Object.values(err.response.data.errors).flat();
                setError(validationErrors[0]);
            } else {
                setError('Impossible de se connecter. Assurez-vous que le serveur tourne.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper pour se connecter rapidement avec les comptes du Seeder
    const handleQuickLogin = (quickEmail) => {
        setEmail(quickEmail);
        setPassword('password');
    };

    return (
        <div className="max-w-md mx-auto my-16 px-6">
            <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl shadow-lg shadow-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-ofppt-text-main mb-2">Bienvenue sur OFPPT / CMC</h2>
                    <p className="text-ofppt-text-sec text-sm font-medium">Connectez-vous pour gerer ou rendre vos presentations</p>
                </div>

                {error && (
                    <div className="bg-ofppt-error/10 border border-ofppt-error/20 text-ofppt-error p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-ofppt-text-main">Adresse e-mail</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemple@ofppt.ma" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-3 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-ofppt-text-main">Mot de passe</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-3 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-ofppt-blue hover:bg-[#0052a3] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i>
                                <span>Connexion en cours...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-right-to-bracket"></i>
                                <span>Se connecter</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Boutons rapides pour tester sans saisir */}
                <div className="mt-8 pt-6 border-t border-ofppt-border text-center">
                    <span className="block text-xs font-bold uppercase tracking-wider text-ofppt-text-sec mb-3">Connexions Rapides (Seeder)</span>
                    <div className="flex justify-center gap-3">
                        <button 
                            onClick={() => handleQuickLogin('formateur@ofppt.ma')}
                            className="bg-slate-100 hover:bg-slate-200 text-ofppt-text-main px-3 py-1.5 rounded-lg text-xs font-bold border border-ofppt-border transition cursor-pointer"
                        >
                            👨‍🏫 Formateur
                        </button>
                        <button 
                            onClick={() => handleQuickLogin('stagiaire@ofppt.ma')}
                            className="bg-slate-100 hover:bg-slate-200 text-ofppt-text-main px-3 py-1.5 rounded-lg text-xs font-bold border border-ofppt-border transition cursor-pointer"
                        >
                            👨‍🎓 Stagiaire
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-ofppt-text-sec">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-ofppt-blue hover:underline font-semibold">
                        Inscrivez-vous ici
                    </Link>
                </div>
            </div>
        </div>
    );
}
