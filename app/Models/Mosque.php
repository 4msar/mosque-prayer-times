<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mosque extends Model
{
    protected $fillable = [
        'place_id',
        'name',
        'address',
        'map_url',
        'latitude',
        'longitude',

        // Prayer times
        'fajr',
        'dhuhr',
        'asr',
        'maghrib',
        'isha',
        'sunrise',
        'sunset',
        'jummah',
        'last_updated'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'last_updated' => 'datetime',
    ];

    protected $appends = [
        'location',
    ];

    public function getLocationAttribute()
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }

    /**
     * Scope a query to only include mosques that match the search term.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search = null)
    {
        if (is_null($search) || empty($search)) {
            return $query;
        }

        // Build the query
        $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%$search%")
                ->orWhere('address', 'LIKE', "%$search%")
                ->orWhere('city', 'LIKE', "%$search%");
        });

        return $query;
    }


    /**
     * Scope a query to only include mosques near a given location.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $location - The location in "latitude,longitude" format
     * @return \Illuminate\Database\Eloquent\Builder
     * @throws \Exception
     */
    public function scopeNearBy($query, $location = null, $radius = 1)
    {
        if (is_null($location) || empty($location)) {
            return $query;
        }
        if (
            !is_string($location) ||
            !preg_match('/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/', $location)
        ) {
            throw new \Exception('Invalid location format. Expected "latitude,longitude".');
        }

        // Split the location string into latitude and longitude
        list($lat, $lon) = explode(',', $location);

        // find mosques within 1km radius
        $query->whereRaw(
            "(6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lon)) + sin(radians($lat)) * sin(radians(latitude)))) < $radius"
        );
    }
}
