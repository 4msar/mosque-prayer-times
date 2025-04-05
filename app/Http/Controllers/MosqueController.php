<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mosque\MosqueRequest;
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
            'filters' => $request->all('search', 'location'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MosqueRequest $request)
    {
        $data = $request->validated();

        $mosque = Mosque::create($data);

        flashMessage("Mosque created successfully", "success");

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Mosque $mosque)
    {
        $mosque->load('prayers');

        return Inertia::render('mosques/show', [
            'mosque' => $mosque,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mosque $mosque)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mosque $mosque)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mosque $mosque)
    {
        //
    }
}
