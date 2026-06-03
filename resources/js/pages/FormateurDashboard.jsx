import React, { useState, useEffect } from 'react';
import api from '../api';

export default function FormateurDashboard() {
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [allStagiaires, setAllStagiaires] = useState([]);
    
    // Formulaires
    const [newClassName, setNewClassName] = useState('');
    const [newClassFiliere, setNewClassFiliere] = useState('');
    const [newPresTitre, setNewPresTitre] = useState('');
    const [newPresDesc, setNewPresDesc] = useState('');
    const [newPresDate, setNewPresDate] = useState('');
    const [newPresClassId, setNewPresClassId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStagiaireId, setSelectedStagiaireId] = useState('');

    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'classes', 'presentations'
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsRes = await api.get('/dashboard');
            setStats(statsRes.data.stats);
            
            const classesRes = await api.get('/classes');
            setClasses(classesRes.data);

            const presRes = await api.get('/presentations');
            setPresentations(presRes.data);

            const stagiairesRes = await api.get('/stagiaires');
            setAllStagiaires(stagiairesRes.data);
        } catch (e) {
            console.error(e);
            showNotification('Impossible de charger les données du dashboard.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes', { nom: newClassName, filiere: newClassFiliere });
            showNotification('Classe créée avec succès !');
            setNewClassName('');
            setNewClassFiliere('');
            fetchDashboardData();
        } catch (e) {
            showNotification('Erreur lors de la création de la classe.', 'error');
        }
    };

    const handleCreatePresentation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/presentations', {
                titre: newPresTitre,
                description: newPresDesc,
                date_limite: newPresDate,
                classe_id: newPresClassId
            });
            showNotification('Présentation créée et assignée aux stagiaires !');
            setNewPresTitre('');
            setNewPresDesc('');
            setNewPresDate('');
            setNewPresClassId('');
            fetchDashboardData();
        } catch (e) {
            showNotification('Erreur lors de la création de la présentation.', 'error');
        }
    };

    const handleAddStagiaire = async (e) => {
        e.preventDefault();
        if (!selectedClassId || !selectedStagiaireId) return;

        try {
            await api.post(`/classes/${selectedClassId}/stagiaires`, {
                stagiaire_id: selectedStagiaireId
            });
            showNotification('Stagiaire ajouté à la classe !');
            fetchDashboardData();
        } catch (e) {
            const msg = e.response?.data?.message || 'Erreur lors de l\'ajout du stagiaire.';
            showNotification(msg, 'error');
        }
    };

    const handleDeletePresentation = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette présentation ?')) return;

        try {
            await api.delete(`/presentations/${id}`);
            showNotification('Présentation supprimée !');
            fetchDashboardData();
        } catch (e) {
            showNotification('Erreur lors de la suppression.', 'error');
        }
    };

    const handleDownloadFile = async (uploadId, originalName) => {
        try {
            const response = await api.get(`/uploads/${uploadId}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            showNotification('Erreur lors du téléchargement du fichier.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 text-center text-ofppt-text-sec">
                <i className="fa-solid fa-spinner animate-spin text-4xl text-ofppt-blue mb-4"></i>
                <p className="font-semibold">Chargement de votre tableau de bord formateur...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Titre */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-ofppt-text-main">Espace Formateur</h1>
                    <p className="text-ofppt-text-sec text-sm font-medium">Gérez vos classes, vos présentations et suivez les rendus.</p>
                </div>
                <button 
                    onClick={fetchDashboardData}
                    className="bg-white hover:bg-slate-50 text-ofppt-text-main border border-ofppt-border px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
                >
                    <i className="fa-solid fa-arrows-rotate mr-2"></i> Rafraîchir
                </button>
            </div>

            {/* Notification alert */}
            {notification.message && (
                <div className={`p-4 rounded-xl text-sm mb-6 flex items-center gap-3 border font-semibold ${
                    notification.type === 'error' 
                        ? 'bg-ofppt-error/10 border-ofppt-error/20 text-ofppt-error' 
                        : 'bg-ofppt-success/10 border-ofppt-success/20 text-ofppt-success'
                }`}>
                    <i className={`fa-solid ${notification.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-ofppt-blue text-xl mb-2"><i className="fa-solid fa-users"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Mes Classes</span>
                        <span className="block text-3xl font-extrabold text-ofppt-text-main mt-1">{stats.total_classes}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-cyan-600 text-xl mb-2"><i className="fa-solid fa-file-powerpoint"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Présentations</span>
                        <span className="block text-3xl font-extrabold text-ofppt-text-main mt-1">{stats.total_presentations}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-indigo-600 text-xl mb-2"><i className="fa-solid fa-user-graduate"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Stagiaires</span>
                        <span className="block text-3xl font-extrabold text-ofppt-text-main mt-1">{stats.total_stagiaires}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="text-ofppt-success text-xl mb-2"><i className="fa-solid fa-circle-check"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Taux de Rendu</span>
                        <span className="block text-3xl font-extrabold text-ofppt-success mt-1">{stats.taux_rendu}%</span>
                    </div>
                </div>
            )}

            {/* Navigation par onglets */}
            <div className="flex gap-2 border-b border-ofppt-border pb-4 mb-6">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${activeTab === 'overview' ? 'bg-ofppt-blue text-white shadow-md shadow-ofppt-blue/20' : 'text-ofppt-text-sec hover:text-ofppt-text-main hover:bg-slate-100'}`}
                >
                    Vue d'ensemble
                </button>
                <button 
                    onClick={() => setActiveTab('classes')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${activeTab === 'classes' ? 'bg-ofppt-blue text-white shadow-md shadow-ofppt-blue/20' : 'text-ofppt-text-sec hover:text-ofppt-text-main hover:bg-slate-100'}`}
                >
                    Classes & Stagiaires
                </button>
                <button 
                    onClick={() => setActiveTab('presentations')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${activeTab === 'presentations' ? 'bg-ofppt-blue text-white shadow-md shadow-ofppt-blue/20' : 'text-ofppt-text-sec hover:text-ofppt-text-main hover:bg-slate-100'}`}
                >
                    Présentations & Rendus
                </button>
            </div>

            {/* CONTENU ONGLETS */}

            {/* 1. VUE D'ENSEMBLE */}
            {activeTab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Colonne gauche : Création rapide */}
                    <div className="space-y-6">
                        {/* Créer Classe */}
                        <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-ofppt-text-main mb-4"><i className="fa-solid fa-users mr-2 text-ofppt-blue"></i> Nouvelle Classe</h3>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Nom de la classe</label>
                                    <input 
                                        type="text" required value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                                        placeholder="Ex: DEV-201" className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Filière</label>
                                    <input 
                                        type="text" required value={newClassFiliere} onChange={(e) => setNewClassFiliere(e.target.value)}
                                        placeholder="Ex: Développement Digital" className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-ofppt-blue hover:bg-[#0052a3] text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm">
                                    Ajouter la classe
                                </button>
                            </form>
                        </div>

                        {/* Ajouter Stagiaire à une Classe */}
                        <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-ofppt-text-main mb-4"><i className="fa-solid fa-user-plus mr-2 text-cyan-600"></i> Ajouter Stagiaire</h3>
                            <form onSubmit={handleAddStagiaire} className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Sélectionner la classe</label>
                                    <select 
                                        value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    >
                                        <option value="">-- Choisir une classe --</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.filiere})</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Sélectionner le stagiaire</label>
                                    <select 
                                        value={selectedStagiaireId} onChange={(e) => setSelectedStagiaireId(e.target.value)}
                                        className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    >
                                        <option value="">-- Choisir un stagiaire --</option>
                                        {allStagiaires.map(s => <option key={s.id} value={s.id}>{s.name} ({s.etablissement || 'N/A'})</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-cyan-600 hover:bg-[#158097] text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm">
                                    Inscrire dans la classe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Colonne droite : Liste rapide présentations récentes */}
                    <div className="md:col-span-2 bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold text-ofppt-text-main mb-4"><i className="fa-solid fa-clock-rotate-left mr-2 text-indigo-600"></i> Dernières présentations créées</h3>
                        {presentations.length === 0 ? (
                            <p className="text-ofppt-text-sec text-sm font-medium">Vous n'avez pas encore créé de présentation.</p>
                        ) : (
                            <div className="space-y-4">
                                {presentations.slice(0, 5).map(pres => (
                                    <div key={pres.id} className="bg-slate-50 border border-ofppt-border p-4 rounded-xl flex justify-between items-center hover:bg-slate-100/50 transition-colors">
                                        <div>
                                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-ofppt-blue/10 border border-ofppt-blue/20 text-ofppt-blue uppercase mr-2">
                                                {pres.classe?.nom}
                                            </span>
                                            <h4 className="text-ofppt-text-main font-bold text-sm inline-block mt-1">{pres.titre}</h4>
                                            <p className="text-ofppt-text-sec text-xs mt-1 font-semibold">Limite : {new Date(pres.date_limite).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs text-ofppt-text-sec font-bold">{pres.uploads_count} rendu(s) / {pres.assignations_count}</span>
                                            <button 
                                                onClick={() => { setActiveTab('presentations'); }}
                                                className="text-ofppt-blue hover:underline text-xs font-bold mt-2 cursor-pointer inline-block"
                                            >
                                                Voir détails
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 2. CLASSES ET STAGIAIRES */}
            {activeTab === 'classes' && (
                <div className="space-y-6">
                    {classes.length === 0 ? (
                        <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl text-center text-ofppt-text-sec shadow-sm font-medium">
                            Aucune classe enregistrée. Créez-en une depuis l'onglet Vue d'ensemble.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {classes.map(classe => (
                                <div key={classe.id} className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start border-b border-ofppt-border pb-3 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-ofppt-text-main">{classe.nom}</h3>
                                            <span className="text-xs text-ofppt-blue font-bold uppercase tracking-wider">{classe.filiere}</span>
                                        </div>
                                        <span className="text-xs bg-slate-100 text-ofppt-text-main px-2.5 py-1 rounded-lg border border-ofppt-border font-semibold">
                                            {classe.stagiaires_count} stagiaires
                                        </span>
                                    </div>

                                    {/* Action de chargement des stagiaires de cette classe */}
                                    <button 
                                        onClick={async () => {
                                            const res = await api.get(`/classes/${classe.id}`);
                                            alert(`Stagiaires de ${classe.nom} :\n` + 
                                                (res.data.stagiaires.length > 0 
                                                    ? res.data.stagiaires.map(s => `- ${s.name} (${s.email})`).join('\n')
                                                    : 'Aucun stagiaire inscrit dans cette classe.'
                                                )
                                            );
                                        }}
                                        className="w-full bg-slate-100 hover:bg-slate-200 border border-ofppt-border text-ofppt-text-main text-xs py-2.5 rounded-lg font-bold transition cursor-pointer"
                                    >
                                        <i className="fa-solid fa-eye mr-2"></i> Voir la liste des stagiaires
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 3. PRESENTATIONS ET RENDUS */}
            {activeTab === 'presentations' && (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Colonne gauche : Formulaire de création */}
                    <div>
                        <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl sticky top-8 shadow-sm">
                            <h3 className="text-lg font-bold text-ofppt-text-main mb-4"><i className="fa-solid fa-file-signature mr-2 text-ofppt-blue"></i> Nouvelle Présentation</h3>
                            <form onSubmit={handleCreatePresentation} className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Titre</label>
                                    <input 
                                        type="text" required value={newPresTitre} onChange={(e) => setNewPresTitre(e.target.value)}
                                        placeholder="Ex: Les fondamentaux de React" className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Description / Consignes</label>
                                    <textarea 
                                        required value={newPresDesc} onChange={(e) => setNewPresDesc(e.target.value)}
                                        placeholder="Consignes..." className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm min-h-[80px] focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all duration-200"
                                    ></textarea>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Date Limite de rendu</label>
                                    <input 
                                        type="date" required value={newPresDate} onChange={(e) => setNewPresDate(e.target.value)}
                                        className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs text-ofppt-text-sec font-bold">Attribuer à la classe</label>
                                    <select 
                                        required value={newPresClassId} onChange={(e) => setNewPresClassId(e.target.value)}
                                        className="bg-slate-50 border border-ofppt-border rounded-xl px-4 py-2 text-ofppt-text-main text-sm focus:outline-none focus:border-ofppt-blue focus:bg-white transition-all"
                                    >
                                        <option value="">-- Choisir la classe --</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-ofppt-blue hover:bg-[#0052a3] text-white py-2.5 rounded-xl text-sm font-bold transition cursor-pointer shadow-sm">
                                    Créer et Assigner
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Colonne droite : Liste complète des présentations et détails des fichiers */}
                    <div className="md:col-span-2 space-y-6">
                        {presentations.length === 0 ? (
                            <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl text-center text-ofppt-text-sec shadow-sm font-semibold">
                                Aucune présentation créée pour le moment.
                            </div>
                        ) : (
                            presentations.map(pres => (
                                <div key={pres.id} className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm mb-6">
                                    <div className="flex justify-between items-start border-b border-ofppt-border pb-4 mb-4">
                                        <div>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded bg-ofppt-blue/10 border border-ofppt-blue/20 text-ofppt-blue uppercase">
                                                Classe {pres.classe?.nom}
                                            </span>
                                            <h3 className="text-xl font-bold text-ofppt-text-main mt-2">{pres.titre}</h3>
                                            <p className="text-ofppt-text-sec text-xs mt-1 font-semibold">Limite : {new Date(pres.date_limite).toLocaleDateString()}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeletePresentation(pres.id)}
                                            className="text-ofppt-error hover:bg-red-50 p-2 rounded-lg cursor-pointer transition-colors"
                                            title="Supprimer la présentation"
                                        >
                                            <i className="fa-solid fa-trash-can text-lg"></i>
                                        </button>
                                    </div>

                                    <p className="text-ofppt-text-sec text-sm leading-relaxed mb-6 font-medium">{pres.description}</p>

                                    {/* Section de suivi des rendus */}
                                    <div>
                                        <h4 className="text-sm font-bold text-ofppt-text-main mb-3 flex items-center gap-2">
                                            <i className="fa-solid fa-folder-open text-ofppt-blue"></i>
                                            Fichiers rendus
                                        </h4>
                                        
                                        {/* Bouton pour charger les détails complets de cette présentation */}
                                        <button 
                                            onClick={async () => {
                                                const res = await api.get(`/presentations/${pres.id}`);
                                                const { uploads } = res.data;
                                                if (uploads.length === 0) {
                                                    alert("Aucun fichier n'a été déposé pour le moment.");
                                                } else {
                                                    const message = uploads.map(u => 
                                                        `- ${u.stagiaire.name} : ${u.nom_original} (Uploadé le ${new Date(u.uploaded_at).toLocaleString()})`
                                                    ).join('\n');
                                                    alert(`Rendus pour "${pres.titre}" :\n\n` + message);
                                                }
                                            }}
                                            className="bg-slate-100 hover:bg-slate-200 border border-ofppt-border text-ofppt-text-main text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer mb-4 shadow-sm"
                                        >
                                            <i className="fa-solid fa-list-check mr-2"></i> Voir le détail des déposants
                                        </button>

                                        {/* Liste rapide des fichiers à télécharger */}
                                        <div className="space-y-2">
                                            {/* On charge dynamiquement les fichiers via l'API si le formateur veut les télécharger */}
                                            <button 
                                                onClick={async () => {
                                                    const res = await api.get(`/presentations/${pres.id}`);
                                                    if (res.data.uploads.length === 0) {
                                                        alert("Aucun fichier à télécharger.");
                                                        return;
                                                    }
                                                    // Télécharger le premier fichier ou lister
                                                    res.data.uploads.forEach(upload => {
                                                        handleDownloadFile(upload.id, upload.nom_original);
                                                    });
                                                }}
                                                className="w-full bg-ofppt-blue/10 hover:bg-ofppt-blue text-ofppt-blue hover:text-white border border-ofppt-blue/20 hover:border-ofppt-blue text-xs py-2 rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <i className="fa-solid fa-download"></i> Télécharger tous les fichiers déposés
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
