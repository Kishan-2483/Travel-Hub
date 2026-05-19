<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Review extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reviews';

    protected $fillable = [
        'user_id',
        'listing_id',
        'booking_id',
        'rating',
        'comment',
        'images',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }
}
