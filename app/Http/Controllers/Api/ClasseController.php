<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\User;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    /**
     * Liste des classes du formateur connecté.
     */
    public function index(Request $request)
    {
        $classes = Classe::where('formateur_id', $request->user()->id)
            ->withCount('stagiaires', 'presentations')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($classes);
    }

    /**
     * Créer une nouvelle classe.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'filiere' => ['required', 'string', 'max:255'],
        ]);

        $classe = Classe::create([
            'nom' => $request->nom,
            'filiere' => $request->filiere,
            'formateur_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Classe créée avec succès.',
            'classe' => $classe,
        ], 201);
    }

    /**
     * Détails d'une classe avec ses stagiaires.
     */
    public function show(Request $request, $id)
    {
        $classe = Classe::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->with(['stagiaires', 'presentations'])
            ->withCount('stagiaires', 'presentations')
            ->firstOrFail();

        return response()->json($classe);
    }

    /**
     * Modifier une classe.
     */
    public function update(Request $request, $id)
    {
        $classe = Classe::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'filiere' => ['sometimes', 'string', 'max:255'],
        ]);

        $classe->update($request->only(['nom', 'filiere']));

        return response()->json([
            'message' => 'Classe modifiée avec succès.',
            'classe' => $classe,
        ]);
    }

    /**
     * Supprimer une classe.
     */
    public function destroy(Request $request, $id)
    {
        $classe = Classe::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $classe->delete();

        return response()->json([
            'message' => 'Classe supprimée avec succès.',
        ]);
    }

    /**
     * Ajouter un stagiaire à une classe.
     */
    public function addStagiaire(Request $request, $id)
    {
        $classe = Classe::where('id', $id)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'stagiaire_id' => ['required', 'exists:users,id'],
        ]);

        $stagiaire = User::findOrFail($request->stagiaire_id);

        if ($stagiaire->role !== 'stagiaire') {
            return response()->json([
                'message' => 'L\'utilisateur sélectionné n\'est pas un stagiaire.',
            ], 422);
        }

        if ($stagiaire->classesStagiaire()->exists()) {
            return response()->json([
                'message' => 'Ce stagiaire étudie déjà dans une autre classe.',
            ], 422);
        }

        $classe->stagiaires()->attach($stagiaire->id);

        return response()->json([
            'message' => 'Stagiaire ajouté à la classe avec succès.',
            'classe' => $classe->load('stagiaires'),
        ]);
    }

    /**
     * Retirer un stagiaire d'une classe.
     */
    public function removeStagiaire(Request $request, $classeId, $stagiaireId)
    {
        $classe = Classe::where('id', $classeId)
            ->where('formateur_id', $request->user()->id)
            ->firstOrFail();

        $classe->stagiaires()->detach($stagiaireId);

        return response()->json([
            'message' => 'Stagiaire retiré de la classe avec succès.',
        ]);
    }

    /**
     * Liste de tous les stagiaires (pour ajouter à une classe).
     */
    public function allStagiaires()
    {
        $stagiaires = User::where('role', 'stagiaire')
            ->whereDoesntHave('classesStagiaire')
            ->select('id', 'name', 'email', 'etablissement')
            ->orderBy('name')
            ->get();

        return response()->json($stagiaires);
    }
}
