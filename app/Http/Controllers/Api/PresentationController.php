<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignation;
use App\Models\Classe;
use App\Models\Presentation;
use Illuminate\Http\Request;

class PresentationController extends Controller
{
    /**
     * Liste des présentations.
     * Formateur : ses présentations.
     * Stagiaire : celles qui lui sont assignées.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isFormateur()) {
            $presentations = Presentation::where('formateur_id', $user->id)
                ->with(['classe:id,nom,filiere'])
                ->withCount(['assignations', 'uploads'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $presentations = Presentation::whereHas('assignations', function ($query) use ($user) {
                $query->where('stagiaire_id', $user->id);
            })
                ->with(['classe:id,nom,filiere', 'formateur:id,name'])
                ->withCount('uploads')
                ->orderBy('date_limite', 'asc')
                ->get()
                ->map(function ($presentation) use ($user) {
                    // Ajouter l'état du rendu pour ce stagiaire
                    $upload = $presentation->uploads()
                        ->where('stagiaire_id', $user->id)
                        ->first();
                    $presentation->rendu = $upload ? true : false;
                    $presentation->upload = $upload;
                    return $presentation;
                });
        }

        return response()->json($presentations);
    }

    /**
     * Créer une nouvelle présentation.
     * Assigne automatiquement tous les stagiaires de la classe.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date_limite' => ['required', 'date', 'after_or_equal:now'],
            'classe_id' => ['required', 'exists:classes,id'],
        ]);

        // Vérifier que la classe appartient au formateur
        $classe = Classe::where('id', $request->classe_id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $presentation = Presentation::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'date_limite' => $request->date_limite,
            'classe_id' => $classe->id,
            'formateur_id' => $request->user()->id,
        ]);

        // Assigner automatiquement tous les stagiaires de la classe
        $stagiaireIds = $classe->stagiaires()->pluck('users.id');
        foreach ($stagiaireIds as $stagiaireId) {
            Assignation::create([
                'presentation_id' => $presentation->id,
                'stagiaire_id' => $stagiaireId,
            ]);
        }

        return response()->json([
            'message' => 'Présentation créée et assignée à ' . count($stagiaireIds) . ' stagiaire(s).',
            'presentation' => $presentation->load(['classe', 'assignations.stagiaire']),
        ], 201);
    }

    /**
     * Détails d'une présentation avec uploads et assignations.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        if ($user->isFormateur()) {
            $presentation = Presentation::where('id', $id)
                ->where('formateur_id', $user->id)
                ->with([
                    'classe:id,nom,filiere',
                    'assignations.stagiaire:id,name,email',
                    'uploads.stagiaire:id,name,email',
                ])
                ->withCount(['assignations', 'uploads'])
                ->firstOrFail();
        } else {
            $presentation = Presentation::where('id', $id)
                ->whereHas('assignations', function ($query) use ($user) {
                    $query->where('stagiaire_id', $user->id);
                })
                ->with([
                    'classe:id,nom,filiere',
                    'formateur:id,name',
                ])
                ->firstOrFail();

            // Ajouter l'upload du stagiaire
            $upload = $presentation->uploads()
                ->where('stagiaire_id', $user->id)
                ->first();
            $presentation->rendu = $upload ? true : false;
            $presentation->mon_upload = $upload;
        }

        return response()->json($presentation);
    }

    /**
     * Modifier une présentation.
     */
    public function update(Request $request, $id)
    {
        $presentation = Presentation::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'titre' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date_limite' => ['sometimes', 'date'],
        ]);

        $presentation->update($request->only(['titre', 'description', 'date_limite']));

        return response()->json([
            'message' => 'Présentation modifiée avec succès.',
            'presentation' => $presentation,
        ]);
    }

    /**
     * Supprimer une présentation.
     */
    public function destroy(Request $request, $id)
    {
        $presentation = Presentation::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        // Supprimer les fichiers uploadés du disque
        foreach ($presentation->uploads as $upload) {
            if (\Storage::disk('public')->exists($upload->file_path)) {
                \Storage::disk('public')->delete($upload->file_path);
            }
        }

        $presentation->delete();

        return response()->json([
            'message' => 'Présentation supprimée avec succès.',
        ]);
    }
}
