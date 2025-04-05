<?php

namespace App\Http\Requests\Mosque;

use Illuminate\Foundation\Http\FormRequest;

class MosqueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'map_url' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],

            // Prayer times
            'fajr' => ['string'],
            'dhuhr' => ['string'],
            'asr' => ['string'],
            'maghrib' => ['string'],
            'isha' => ['string'],
            'sunrise' => ['string'],
            'sunset' => ['string'],
            'jummah' => ['string'],
        ];
    }
}
