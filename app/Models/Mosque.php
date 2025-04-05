<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mosque extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'phone',
        'website',
        'email',
        'latitude',
        'longitude',
        'description',
        'capacity',
        'type',
        'status'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    protected $appends = [
        'location',
        'full_address'
    ];

    public function images()
    {
        return $this->morphMany(Image::class, 'model');
    }

    public function prayerTimes()
    {
        return $this->hasOne(PrayerTime::class);
    }

    public function getLocationAttribute()
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }

    public function getFullAddressAttribute()
    {
        return $this->address . ', ' . $this->city . ', ' . $this->state . ', ' . $this->country . ', ' . $this->zip_code;
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
