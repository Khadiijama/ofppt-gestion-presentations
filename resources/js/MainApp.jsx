import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FormateurDashboard from './pages/FormateurDashboard';
import StagiaireDashboard from './pages/StagiaireDashboard';

export default function MainApp() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('api_token');
        if (token) {
            try {
                // Tenter de récupérer l'utilisateur connecté via l'API
                const response = await api.get('/user');
                setUser(response.data);
            } catch (e) {
                console.error('Session invalide ou expirée.', e);
                localStorage.removeItem('api_token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_name');
            }
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-ofppt-bg flex flex-col items-center justify-center text-ofppt-text-sec">
                <i className="fa-solid fa-circle-notch animate-spin text-4xl text-ofppt-blue mb-4"></i>
                <p className="font-semibold text-sm">Vérification de la session en cours...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-ofppt-bg text-ofppt-text-main flex flex-col">
                <Navbar user={user} setUser={setUser} />
                
                <main className="flex-grow">
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<Home user={user} />} />
                        
                        <Route 
                            path="/login" 
                            element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/stagiaire'} />} 
                        />
                        <Route 
                            path="/register" 
                            element={!user ? <Register setUser={setUser} /> : <Navigate to={user.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/stagiaire'} />} 
                        />

                        {/* Espace Formateur Protégé */}
                        <Route 
                            path="/dashboard/formateur" 
                            element={user && user.role === 'formateur' ? <FormateurDashboard /> : <Navigate to="/login" />} 
                        />

                        {/* Espace Stagiaire Protégé */}
                        <Route 
                            path="/dashboard/stagiaire" 
                            element={user && user.role === 'stagiaire' ? <StagiaireDashboard /> : <Navigate to="/login" />} 
                        />

                        {/* Redirection automatique pour les routes inconnues */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                
                {/* Footer simple */}
                <footer className="bg-white border-t border-ofppt-border py-6 text-center text-xs text-ofppt-text-sec font-semibold shadow-sm">
                    &copy; {new Date().getFullYear()} OFPPT / CMC. Tous droits réservés.
                </footer>
            </div>
        </Router>
    );
}
