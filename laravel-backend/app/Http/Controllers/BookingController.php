<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Listing;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->header('X-User-Id');
        $bookings = Booking::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Attach listing info
        foreach ($bookings as $booking) {
            $booking->listing = Listing::find($booking->listing_id);
        }

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1',
        ]);

        $listing = Listing::findOrFail($validated['listing_id']);

        // Calculate total price
        $checkIn = new \DateTime($validated['check_in']);
        $checkOut = new \DateTime($validated['check_out']);
        $nights = $checkIn->diff($checkOut)->days;
        $totalPrice = $listing->price['amount'] * $nights;

        $booking = Booking::create([
            'user_id' => $request->header('X-User-Id'),
            'listing_id' => $validated['listing_id'],
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'guests' => $validated['guests'],
            'status' => 'pending',
            'total_price' => $totalPrice,
        ]);

        return response()->json($booking, 201);
    }

    public function show($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->listing = Listing::find($booking->listing_id);
        return response()->json($booking);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->user_id !== $request->header('X-User-Id')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['error' => 'Booking already cancelled'], 400);
        }

        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Booking cancelled', 'booking' => $booking]);
    }
}
