<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Listing;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\FraudReport;
use Illuminate\Http\Request;
use MongoDB\Laravel\Eloquent\Model;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_listings' => Listing::count(),
            'total_bookings' => Booking::count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
            'total_reviews' => Review::count(),
            'total_transactions' => Transaction::count(),
            'total_revenue' => Transaction::where('status', 'success')->sum('amount'),
            'fraud_reports_open' => FraudReport::where('status', 'open')->count(),
        ];

        // Recent bookings
        $recentBookings = Booking::orderBy('created_at', 'desc')->limit(10)->get();

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
        ]);
    }

    public function users(Request $request)
    {
        // Since users are managed by Node.js, we return info from MongoDB directly
        $db = app('db')->connection('mongodb')->getMongoDB();
        $usersCollection = $db->selectCollection('users');
        
        $users = [];
        $cursor = $usersCollection->find([], [
            'projection' => ['password' => 0],
            'sort' => ['createdAt' => -1],
            'limit' => 50,
        ]);
        
        foreach ($cursor as $user) {
            $users[] = $user;
        }

        return response()->json($users);
    }

    public function allBookings(Request $request)
    {
        $query = Booking::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($bookings);
    }

    public function allListings(Request $request)
    {
        $listings = Listing::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($listings);
    }
}
