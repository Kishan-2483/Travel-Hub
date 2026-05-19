<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Transaction extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'transactions';

    protected $fillable = [
        'user_id',
        'booking_id',
        'amount',
        'currency',
        'method',
        'status',
        'gateway_ref',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
