<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Booking extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'bookings';

    protected $fillable = [
        'user_id',
        'listing_id',
        'check_in',
        'check_out',
        'guests',
        'status',
        'total_price',
        'payment_id',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'guests' => 'integer',
        'total_price' => 'float',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'booking_id');
    }
}
