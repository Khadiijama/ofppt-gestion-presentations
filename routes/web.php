<?php

use Illuminate\Support\Facades\Route;

// Rediriger toutes les routes web vers le welcome view pour laisser React Router gérer la navigation
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
