import React, { useState, useEffect } from 'react';
import api from '../api';

export default function StagiaireDashboard() {
    const [stats, setStats] = useState(null);
    const [presentations, setPresentations] = useState([]);
    
    const [uploadingId, setUploadingId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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
            
            const presRes = await api.get('/presentations');
            setPresentations(presRes.data);
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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.value ? e.target.files[0] : null);
    };

    const handleUpload = async (e, presentationId) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier.');
            return;
        }

        setUploadingId(presentationId);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post(`/presentations/${presentationId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showNotification('Votre présentation a été déposée avec succès !');
            setSelectedFile(null);
            
            // Réinitialiser le champ input file manuellement
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => input.value = '');

            fetchDashboardData();
        } catch (e) {
            const msg = e.response?.data?.message || 'Erreur lors du dépôt du fichier.';
            showNotification(msg, 'error');
        } finally {
            setUploadingId(null);
        }
    };

    const handleDeleteUpload = async (uploadId) => {
        if (!confirm('Voulez-vous vraiment retirer votre fichier déposé ?')) return;

        try {
            await api.delete(`/uploads/${uploadId}`);
            showNotification('Dépôt retiré avec succès.');
            fetchDashboardData();
        } catch (e) {
            showNotification('Erreur lors du retrait du dépôt.', 'error');
        }
    };

    const handleDownloadMyFile = async (uploadId, originalName) => {
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
            showNotification('Erreur lors du téléchargement.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 text-center text-ofppt-text-sec">
                <i className="fa-solid fa-spinner animate-spin text-4xl text-ofppt-blue mb-4"></i>
                <p className="font-semibold">Chargement de votre espace stagiaire...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Titre */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-ofppt-text-main">Espace Stagiaire</h1>
                    <p className="text-ofppt-text-sec text-sm font-medium">Consultez vos exposés assignés et déposez vos rendus de fichiers.</p>
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
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-ofppt-blue text-xl mb-2"><i className="fa-solid fa-book-open"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Total Assignés</span>
                        <span className="block text-3xl font-extrabold text-ofppt-text-main mt-1">{stats.total_presentations}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-ofppt-success text-xl mb-2"><i className="fa-solid fa-circle-check"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">Travaux Rendus</span>
                        <span className="block text-3xl font-extrabold text-ofppt-success mt-1">{stats.total_rendus}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-ofppt-warning text-xl mb-2"><i className="fa-solid fa-clock"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">En Attente</span>
                        <span className="block text-3xl font-extrabold text-ofppt-warning mt-1">{stats.en_attente}</span>
                    </div>
                    <div className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-ofppt-error text-xl mb-2"><i className="fa-solid fa-triangle-exclamation"></i></div>
                        <span className="block text-ofppt-text-sec text-xs font-bold uppercase tracking-wider">En Retard</span>
                        <span className="block text-3xl font-extrabold text-ofppt-error mt-1">{stats.en_retard}</span>
                    </div>
                </div>
            )}

            {/* Liste des devoirs assignés */}
            <h2 className="text-xl font-bold text-ofppt-text-main mb-6 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-ofppt-blue"></i> Mes exposés assignés
            </h2>

            {presentations.length === 0 ? (
                <div className="bg-ofppt-card border border-ofppt-border p-8 rounded-2xl text-center text-ofppt-text-sec shadow-sm font-semibold">
                    Aucun exposé ne vous est assigné pour le moment. Félicitations !
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {presentations.map(pres => {
                        const hasSubmitted = pres.rendu;
                        const isOverdue = new Date(pres.date_limite) < new Date() && !hasSubmitted;

                        return (
                            <div key={pres.id} className="bg-ofppt-card border border-ofppt-border p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-ofppt-blue/10 border border-ofppt-blue/20 text-ofppt-blue uppercase">
                                            {pres.classe?.nom}
                                        </span>
                                        {hasSubmitted ? (
                                            <span className="text-xs bg-ofppt-success/10 border border-ofppt-success/20 text-ofppt-success font-bold px-2.5 py-0.5 rounded-full">
                                                Déposé <i className="fa-solid fa-circle-check ml-1"></i>
                                            </span>
                                        ) : isOverdue ? (
                                            <span className="text-xs bg-ofppt-error/10 border border-ofppt-error/20 text-ofppt-error font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                                                En retard <i className="fa-solid fa-circle-exclamation ml-1"></i>
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-ofppt-warning/10 border border-ofppt-warning/20 text-ofppt-warning font-bold px-2.5 py-0.5 rounded-full">
                                                À rendre
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-ofppt-text-main mb-2">{pres.titre}</h3>
                                    <p className="text-ofppt-text-sec text-xs mb-3 font-semibold">Assigné par : {pres.formateur?.name}</p>
                                    <p className="text-ofppt-text-sec text-sm leading-relaxed mb-6 font-medium">{pres.description}</p>
                                </div>

                                <div className="border-t border-ofppt-border pt-4 mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs text-ofppt-text-sec font-semibold">Date limite de dépôt :</span>
                                        <span className={`text-xs font-bold ${isOverdue ? 'text-ofppt-error' : 'text-ofppt-text-main'}`}>
                                            {new Date(pres.date_limite).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Action Dépôt / Rendu */}
                                    {hasSubmitted ? (
                                        <div className="bg-slate-50 border border-ofppt-border rounded-xl p-3 flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-2 text-ofppt-text-main">
                                                <i className="fa-solid fa-file-pdf text-ofppt-error text-lg"></i>
                                                <span className="font-bold truncate max-w-[150px]" title={pres.upload?.nom_original}>
                                                    {pres.upload?.nom_original}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleDownloadMyFile(pres.upload.id, pres.upload.nom_original)}
                                                    className="bg-ofppt-blue hover:bg-[#0052a3] text-white p-2 rounded-lg cursor-pointer shadow-sm transition"
                                                    title="Télécharger mon fichier"
                                                >
                                                    <i className="fa-solid fa-download"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUpload(pres.upload.id)}
                                                    className="bg-ofppt-error/10 hover:bg-ofppt-error text-ofppt-error hover:text-white p-2 rounded-lg cursor-pointer border border-ofppt-error/20 transition"
                                                    title="Retirer le fichier"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => handleUpload(e, pres.id)} className="space-y-3">
                                            <div className="flex flex-col gap-1">
                                                <input 
                                                    type="file" required onChange={handleFileChange}
                                                    className="bg-slate-50 border border-ofppt-border rounded-lg px-2.5 py-1.5 text-xs text-ofppt-text-main file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-ofppt-blue file:text-white file:font-semibold file:cursor-pointer"
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={uploadingId === pres.id}
                                                className="w-full bg-ofppt-blue hover:bg-[#0052a3] text-white py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                                            >
                                                {uploadingId === pres.id ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                                        <span>Dépôt en cours...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-upload"></i>
                                                        <span>Déposer le fichier</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
