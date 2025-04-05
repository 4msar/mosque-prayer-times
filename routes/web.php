<?php

use App\Http\Controllers\MosqueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [MosqueController::class, 'index'])->name('home');

Route::controller(MosqueController::class)->group(function () {
    Route::get('/mosques/{place}', 'show')->name('mosques.show');
    Route::post('/mosques/{place}', 'update')->name('mosques.store');
});
Route::get('settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name('settings.appearance');
