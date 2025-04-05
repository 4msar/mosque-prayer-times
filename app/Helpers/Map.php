<?php

namespace App\Helpers;

use App\Models\Mosque;

final class Map
{
    /**
     * The list of mosques
     *
     * @var array<Mosque>
     */
    protected $items = [];

    function __construct($items = [])
    {
        $this->items = $items;
    }

    public function nearBy($lat, $lon)
    {
        $nearby = [];
        foreach ($this->items as $item) {
            $distance = $this->haversineGreatCircleDistance($lat, $lon, $item->latitude, $item->longitude);
            if ($distance <= 5) { // 5 km radius
                $nearby[] = [
                    'mosque' => $item,
                    'distance' => $distance
                ];
            }
        }
        return $nearby;
    }

    public function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6371)
    {
        // convert from degrees to radians
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        // Haversine formula
        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        return 2 * $earthRadius * asin(sqrt(pow(sin($latDelta / 2), 2) + cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
    }
}
