<?php

use App\Http\Controllers\MosqueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [MosqueController::class, 'index'])->name('home');

Route::resource('mosques', MosqueController::class);

Route::prefix('/hq')->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });

    require __DIR__ . '/settings.php';
    require __DIR__ . '/auth.php';
});
