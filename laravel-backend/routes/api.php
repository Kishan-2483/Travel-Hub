<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FraudController;
use App\Http\Middleware\VerifyNodeToken;
use App\Http\Middleware\AdminCheck;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and are proxied
| from the Node.js API Gateway. All requests should have X-User-Id header.
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'laravel-api',
        'timestamp' => now(),
    ]);
});

// Public listing routes
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{id}', [ListingController::class, 'show']);

// Authenticated routes (require X-User-Id from Node gateway)
Route::middleware([VerifyNodeToken::class])->group(function () {
    // Listings management
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{id}', [ListingController::class, 'update']);
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Payments
    Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirm']);

    // Reviews
    Route::get('/reviews/listing/{listingId}', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Fraud
    Route::post('/fraud/reports', [FraudController::class, 'store']);
    Route::post('/fraud/analyze', [FraudController::class, 'analyze']);
});

// Admin routes
Route::middleware([VerifyNodeToken::class, AdminCheck::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/bookings', [AdminController::class, 'allBookings']);
    Route::get('/listings', [AdminController::class, 'allListings']);

    // Fraud management
    Route::get('/fraud/reports', [FraudController::class, 'index']);
    Route::get('/fraud/reports/{id}', [FraudController::class, 'show']);
    Route::put('/fraud/reports/{id}', [FraudController::class, 'update']);
});
