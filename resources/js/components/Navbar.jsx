import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            // Vider le localStorage et le state utilisateur
            localStorage.removeItem('api_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_name');
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <nav className="bg-ofppt-blue border-b border-white/10 px-6 py-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 text-white no-underline">
                    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-xl text-ofppt-blue shadow-md">
                        <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-wide block leading-none mb-0.5 text-white">OFPPT / CMC</span>
                        <span className="block text-[11px] text-blue-100 font-medium">Gestion Présentations</span>
                    </div>
                </Link>

                {/* Liens et Profil */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link 
                                to={user.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/stagiaire'} 
                                className="text-blue-100 hover:text-white font-semibold text-sm transition-colors duration-200"
                            >
                                <i className="fa-solid fa-chart-line mr-2"></i> Dashboard
                            </Link>
                            
                            <div className="h-6 w-[1px] bg-white/20"></div>

                            {/* Badge utilisateur */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className="block text-sm font-semibold text-white">{user.name}</span>
                                    <span className="block text-[10px] text-blue-200 capitalize font-bold tracking-wider leading-none mt-0.5">{user.role}</span>
                                </div>
                                <div className="w-9 h-9 bg-white/15 border border-white/25 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold text-sm border border-white/15 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                            >
                                <i className="fa-solid fa-sign-out-alt"></i>
                                <span>Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-blue-100 hover:text-white font-semibold text-sm transition">
                                Connexion
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-white hover:bg-blue-50 text-ofppt-blue px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all duration-200"
                            >
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
