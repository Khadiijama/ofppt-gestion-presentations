<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignation;
use App\Models\Presentation;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload d'un fichier par le stagiaire pour une présentation.
     */
    public function store(Request $request, $presentationId)
    {
        $user = $request->user();

        // Vérifier que le stagiaire est assigné à cette présentation
        $assignation = Assignation::where('presentation_id', $presentationId)
            ->where('stagiaire_id', $user->id)
            ->firstOrFail();

        $presentation = Presentation::findOrFail($presentationId);

        // Vérifier la date limite
        if ($presentation->date_limite->isPast()) {
            return response()->json([
                'message' => 'La date limite pour cette présentation est dépassée.',
            ], 422);
        }

        $request->validate([
            'file' => ['required', 'file', 'max:20480'], // 20MB max
        ]);

        // Vérifier si un fichier existe déjà
        $existingUpload = Upload::where('presentation_id', $presentationId)
            ->where('stagiaire_id', $user->id)
            ->first();

        if ($existingUpload) {
            // Supprimer l'ancien fichier
            if (Storage::disk('public')->exists($existingUpload->file_path)) {
                Storage::disk('public')->delete($existingUpload->file_path);
            }
            $existingUpload->delete();
        }

        $file = $request->file('file');
        $nomOriginal = $file->getClientOriginalName();
        $path = $file->store('uploads/presentations/' . $presentationId, 'public');

        $upload = Upload::create([
            'presentation_id' => $presentationId,
            'stagiaire_id' => $user->id,
            'file_path' => $path,
            'nom_original' => $nomOriginal,
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'Fichier uploadé avec succès.',
            'upload' => $upload,
        ], 201);
    }

    /**
     * Télécharger un fichier.
     */
    public function download(Request $request, $id)
    {
        $upload = Upload::findOrFail($id);
        $user = $request->user();

        // Le formateur peut télécharger les fichiers de ses présentations
        // Le stagiaire peut télécharger ses propres fichiers
        if ($user->isFormateur()) {
            $presentation = Presentation::where('id', $upload->presentation_id)
                ->where('formateur_id', $user->id)
                ->firstOrFail();
        } else {
            if ($upload->stagiaire_id !== $user->id) {
                return response()->json([
                    'message' => 'Accès non autorisé.',
                ], 403);
            }
        }

        if (!Storage::disk('public')->exists($upload->file_path)) {
            return response()->json([
                'message' => 'Fichier introuvable.',
            ], 404);
        }

        return Storage::disk('public')->download($upload->file_path, $upload->nom_original);
    }

    /**
     * Supprimer un upload.
     */
    public function destroy(Request $request, $id)
    {
        $upload = Upload::findOrFail($id);
        $user = $request->user();

        // Seul le stagiaire propriétaire ou le formateur de la présentation peut supprimer
        if ($user->isStagiaire() && $upload->stagiaire_id !== $user->id) {
            return response()->json([
                'message' => 'Accès non autorisé.',
            ], 403);
        }

        if ($user->isFormateur()) {
            $presentation = Presentation::where('id', $upload->presentation_id)
                ->where('formateur_id', $user->id)
                ->firstOrFail();
        }

        if (Storage::disk('public')->exists($upload->file_path)) {
            Storage::disk('public')->delete($upload->file_path);
        }

        $upload->delete();

        return response()->json([
            'message' => 'Fichier supprimé avec succès.',
        ]);
    }
}
