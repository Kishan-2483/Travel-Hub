<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FraudReport extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'fraud_reports';

    protected $fillable = [
        'reported_by',
        'target_user_id',
        'transaction_id',
        'reason',
        'severity',
        'status',
        'admin_notes',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];
}
