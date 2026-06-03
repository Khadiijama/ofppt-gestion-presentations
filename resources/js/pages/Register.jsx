import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register({ setUser }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('stagiaire');
    const [etablissement, setEtablissement] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role,
                etablissement
            });
            
            const { token, user } = response.data;

            // Enregistrer localement
            localStorage.setItem('api_token', token);
            localStorage.setItem('user_role', user.role);
            localStorage.setItem('user_name', user.name);

            // Mettre à jour le state global
            setUser(user);

            // Redirection
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
                const validationErrors = Object.values(err.response.data.errors).flat();
                setError(validationErrors[0]);
            } else {
                setError("Une erreur s'est produite lors de l'inscription.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 px-6">
            <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl shadow-lg shadow-slate-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-ofppt-text-main mb-2">Creer un compte</h2>
                    <p className="text-ofppt-text-sec text-sm font-medium">Inscrivez-vous sur la plateforme OFPPT / CMC</p>
                </div>

                {error && (
                    <div className="bg-ofppt-error/10 border border-ofppt-error/20 text-ofppt-error p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-ofppt-text-main">Nom Complet</label>
                        <input 
                            type="text" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Yassine Belkadi" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-ofppt-text-main">Adresse e-mail</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yassine@ofppt.ma" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-ofppt-text-main">Je suis un(e)</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                            >
                                <option value="stagiaire">Stagiaire</option>
                                <option value="formateur">Formateur</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-ofppt-text-main">Établissement</label>
                            <input 
                                type="text" 
                                value={etablissement}
                                onChange={(e) => setEtablissement(e.target.value)}
                                placeholder="CMC Rabat" 
                                className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-ofppt-text-main">Mot de passe</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-ofppt-text-main">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            required 
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="••••••••" 
                            className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2.5 text-ofppt-text-main placeholder-slate-400 focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-ofppt-blue hover:bg-[#0052a3] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner animate-spin"></i>
                                <span>Creation du compte...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus"></i>
                                <span>S'inscrire</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-ofppt-text-sec">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="text-ofppt-blue hover:underline font-semibold">
                        Connectez-vous ici
                    </Link>
                </div>
            </div>
        </div>
    );
}
