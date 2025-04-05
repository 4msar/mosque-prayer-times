<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mosque\MosqueRequest;
use App\Http\Requests\Mosque\PrayerRequest;
use App\Models\Mosque;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MosqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $mosques = Mosque::search($request->input('search'))
            ->nearBy($request->input('location'))
            ->get();

        return Inertia::render('mosques/index', [
            'mosques' => $mosques,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function show($place)
    {
        $mosque = Mosque::query()
            ->where('place_id', $place)
            ->firstOrFail();

        return response()->json($mosque);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MosqueRequest $request, $place)
    {
        $mosque = Mosque::query()
            ->where('place_id', $place)
            ->firstOrNew();

        $payload = $request->validated();
        $payload['place_id'] = $place;

        $mosque->fill($payload);
        $mosque->save();

        return back();
    }
}
