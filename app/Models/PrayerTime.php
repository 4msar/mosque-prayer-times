<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrayerTime extends Model
{
    protected $fillable = [
        'mosque_id',
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

    public function mosque()
    {
        return $this->belongsTo(Mosque::class);
    }
}
