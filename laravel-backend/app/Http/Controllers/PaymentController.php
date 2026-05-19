<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|string',
            'method' => 'required|in:card,upi,wallet',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        if ($booking->status !== 'pending') {
            return response()->json(['error' => 'Booking is not in pending state'], 400);
        }

        // Create transaction (mock payment)
        $transaction = Transaction::create([
            'user_id' => $request->header('X-User-Id'),
            'booking_id' => $validated['booking_id'],
            'amount' => $booking->total_price,
            'currency' => 'USD',
            'method' => $validated['method'],
            'status' => 'pending',
            'gateway_ref' => 'TXN_' . strtoupper(Str::random(12)),
        ]);

        return response()->json([
            'transaction' => $transaction,
            'message' => 'Payment initiated. Use /confirm to complete.',
        ]);
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|string',
        ]);

        $transaction = Transaction::findOrFail($validated['transaction_id']);

        if ($transaction->status !== 'pending') {
            return response()->json(['error' => 'Transaction is not pending'], 400);
        }

        // Mock: always succeed
        $transaction->update(['status' => 'success']);

        // Update booking status
        $booking = Booking::find($transaction->booking_id);
        if ($booking) {
            $booking->update([
                'status' => 'confirmed',
                'payment_id' => $transaction->_id,
            ]);
        }

        return response()->json([
            'message' => 'Payment successful',
            'transaction' => $transaction,
            'booking' => $booking,
        ]);
    }
}
