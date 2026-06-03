<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PresentationController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Routes pour l'API de la plateforme de gestion des présentations OFPPT/CMC.
|
*/

// ─── Routes publiques (pas d'authentification) ──────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ─── Routes protégées (authentification requise) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ─── Routes Formateur ────────────────────────────────────────────────────
    Route::middleware('role:formateur')->group(function () {

        // Gestion des classes
        Route::get('/classes', [ClasseController::class, 'index']);
        Route::post('/classes', [ClasseController::class, 'store']);
        Route::get('/classes/{id}', [ClasseController::class, 'show']);
        Route::put('/classes/{id}', [ClasseController::class, 'update']);
        Route::delete('/classes/{id}', [ClasseController::class, 'destroy']);
        Route::post('/classes/{id}/stagiaires', [ClasseController::class, 'addStagiaire']);
        Route::delete('/classes/{classeId}/stagiaires/{stagiaireId}', [ClasseController::class, 'removeStagiaire']);

        // Liste de tous les stagiaires
        Route::get('/stagiaires', [ClasseController::class, 'allStagiaires']);

        // Gestion des présentations (création, modification, suppression)
        Route::post('/presentations', [PresentationController::class, 'store']);
        Route::put('/presentations/{id}', [PresentationController::class, 'update']);
        Route::delete('/presentations/{id}', [PresentationController::class, 'destroy']);
    });

    // ─── Routes Stagiaire ────────────────────────────────────────────────────
    Route::middleware('role:stagiaire')->group(function () {

        // Upload de fichier
        Route::post('/presentations/{id}/upload', [UploadController::class, 'store']);
    });

    // ─── Routes communes (formateur + stagiaire) ─────────────────────────────
    // Liste et détails des présentations (le contrôleur gère la logique selon le rôle)
    Route::get('/presentations', [PresentationController::class, 'index']);
    Route::get('/presentations/{id}', [PresentationController::class, 'show']);

    // Téléchargement et suppression de fichiers
    Route::get('/uploads/{id}/download', [UploadController::class, 'download']);
    Route::delete('/uploads/{id}', [UploadController::class, 'destroy']);
});
