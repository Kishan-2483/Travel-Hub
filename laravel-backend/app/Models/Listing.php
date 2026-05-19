<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Listing extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'listings';

    protected $fillable = [
        'title',
        'description',
        'category',
        'location',
        'price',
        'images',
        'amenities',
        'availability',
        'rating_avg',
        'review_count',
        'host_id',
    ];

    protected $casts = [
        'location' => 'array',
        'price' => 'array',
        'images' => 'array',
        'amenities' => 'array',
        'availability' => 'array',
        'rating_avg' => 'float',
        'review_count' => 'integer',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class, 'listing_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'listing_id');
    }
}
