import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user }) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            {/* Hero Section */}
            <div className="mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ofppt-blue/10 border border-ofppt-blue/20 text-ofppt-blue text-xs font-bold uppercase tracking-wider mb-6">
                    <i className="fa-solid fa-sparkles"></i> Solution simple et rapide
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-ofppt-text-main tracking-tight mb-6">
                    Gerez vos presentations et rendus <br />
                    <span className="bg-gradient-to-r from-ofppt-blue to-ofppt-lightblue bg-clip-text text-transparent">
                        OFPPT / CMC en toute simplicite
                    </span>
                </h1>
                <p className="text-ofppt-text-sec text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    Une plateforme intuitive concue pour les formateurs pour assigner et suivre les exposes, et pour les stagiaires pour deposer leurs travaux rapidement.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                    {user ? (
                        <Link 
                            to={user.role === 'formateur' ? '/dashboard/formateur' : '/dashboard/stagiaire'}
                            className="bg-ofppt-blue hover:bg-[#0052a3] text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 duration-200"
                        >
                            Acceder a mon espace <i className="fa-solid fa-arrow-right ml-2"></i>
                        </Link>
                    ) : (
                        <>
                            <Link 
                                to="/login"
                                className="bg-ofppt-blue hover:bg-[#0052a3] text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 duration-200"
                            >
                                Se connecter
                            </Link>
                            <Link 
                                to="/register"
                                className="bg-white hover:bg-slate-50 text-ofppt-text-main font-bold px-8 py-4 rounded-xl border border-ofppt-border shadow-sm transition transform hover:-translate-y-0.5 duration-200"
                            >
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Features Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                {/* Feature 1 */}
                <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl shadow-md hover:shadow-lg hover:border-ofppt-blue/30 transition duration-200">
                    <div className="bg-ofppt-blue/10 w-12 h-12 rounded-xl flex items-center justify-center text-ofppt-blue text-xl mb-6">
                        <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <h3 className="text-lg font-bold text-ofppt-text-main mb-3">Espace Formateur</h3>
                    <p className="text-ofppt-text-sec text-sm leading-relaxed">
                        Creez vos classes, assignez des exposes a vos stagiaires en un clic, et suivez en temps reel l'avancement des rendus.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl shadow-md hover:shadow-lg hover:border-ofppt-lightblue/30 transition duration-200">
                    <div className="bg-ofppt-lightblue/10 w-12 h-12 rounded-xl flex items-center justify-center text-ofppt-blue text-xl mb-6">
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <h3 className="text-lg font-bold text-ofppt-text-main mb-3">Espace Stagiaire</h3>
                    <p className="text-ofppt-text-sec text-sm leading-relaxed">
                        Consultez instantanement vos presentations a venir, connaissez la date limite exacte de chaque expose, et deposez vos fichiers facilement.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl shadow-md hover:shadow-lg hover:border-ofppt-success/30 transition duration-200">
                    <div className="bg-ofppt-success/10 w-12 h-12 rounded-xl flex items-center justify-center text-ofppt-success text-xl mb-6">
                        <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 className="text-lg font-bold text-ofppt-text-main mb-3">Depots centralises</h3>
                    <p className="text-ofppt-text-sec text-sm leading-relaxed">
                        Plus besoin d'echanges d'e-mails desordonnes. Les fichiers sont regroupes, renommes et telechargeables en un clic par les formateurs.
                    </p>
                </div>
            </div>
        </div>
    );
}
