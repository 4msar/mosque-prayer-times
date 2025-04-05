<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'name',
        'path',
        'description',
        'model_type',
        'model_id',
    ];

    public function model()
    {
        return $this->morphTo();
    }
}
