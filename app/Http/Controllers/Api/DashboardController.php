<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignation;
use App\Models\Classe;
use App\Models\Presentation;
use App\Models\Upload;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Dashboard selon le rôle de l'utilisateur.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isFormateur()) {
            return $this->formateurDashboard($user);
        }

        return $this->stagiaireDashboard($user);
    }

    /**
     * Dashboard formateur.
     */
    private function formateurDashboard($user)
    {
        $totalClasses = Classe::where('formateur_id', $user->id)->count();
        $totalPresentations = Presentation::where('formateur_id', $user->id)->count();
        $totalStagiaires = Classe::where('formateur_id', $user->id)
            ->withCount('stagiaires')
            ->get()
            ->sum('stagiaires_count');

        // Nombre total d'assignations et d'uploads pour les présentations du formateur
        $presentationIds = Presentation::where('formateur_id', $user->id)->pluck('id');
        $totalAssignations = Assignation::whereIn('presentation_id', $presentationIds)->count();
        $totalUploads = Upload::whereIn('presentation_id', $presentationIds)->count();

        // Présentations récentes
        $recentPresentations = Presentation::where('formateur_id', $user->id)
            ->with('classe:id,nom')
            ->withCount(['assignations', 'uploads'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'role' => 'formateur',
            'stats' => [
                'total_classes' => $totalClasses,
                'total_presentations' => $totalPresentations,
                'total_stagiaires' => $totalStagiaires,
                'total_assignations' => $totalAssignations,
                'total_uploads' => $totalUploads,
                'taux_rendu' => $totalAssignations > 0
                    ? round(($totalUploads / $totalAssignations) * 100, 1)
                    : 0,
            ],
            'recent_presentations' => $recentPresentations,
        ]);
    }

    /**
     * Dashboard stagiaire.
     */
    private function stagiaireDashboard($user)
    {
        $assignations = Assignation::where('stagiaire_id', $user->id)->pluck('presentation_id');
        $totalPresentations = $assignations->count();

        $totalRendus = Upload::where('stagiaire_id', $user->id)
            ->whereIn('presentation_id', $assignations)
            ->count();

        // Présentations en retard (non rendues et date dépassée)
        $presentationsEnRetard = Presentation::whereIn('id', $assignations)
            ->whereDoesntHave('uploads', function ($query) use ($user) {
                $query->where('stagiaire_id', $user->id);
            })
            ->where('date_limite', '<', now())
            ->count();

        // Présentations en attente (non rendues et date non dépassée)
        $enAttente = $totalPresentations - $totalRendus - $presentationsEnRetard;

        $presentationsEnAttente = Presentation::whereIn('id', $assignations)
            ->whereDoesntHave('uploads', function ($query) use ($user) {
                $query->where('stagiaire_id', $user->id);
            })
            ->where('date_limite', '>=', now())
            ->with('classe:id,nom', 'formateur:id,name')
            ->orderBy('date_limite', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'role' => 'stagiaire',
            'stats' => [
                'total_presentations' => $totalPresentations,
                'total_rendus' => $totalRendus,
                'en_attente' => $enAttente,
                'en_retard' => $presentationsEnRetard,
            ],
            'presentations_en_attente' => $presentationsEnAttente,
        ]);
    }
}
