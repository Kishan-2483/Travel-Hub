<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Listing;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($listingId)
    {
        $reviews = Review::where('listing_id', $listingId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'required|string',
            'booking_id' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'images' => 'array',
        ]);

        $validated['user_id'] = $request->header('X-User-Id');

        // Check for duplicate review
        $existing = Review::where('user_id', $validated['user_id'])
            ->where('booking_id', $validated['booking_id'])
            ->first();

        if ($existing) {
            return response()->json(['error' => 'You have already reviewed this booking'], 400);
        }

        $review = Review::create($validated);

        // Update listing rating average
        $listing = Listing::find($validated['listing_id']);
        if ($listing) {
            $allReviews = Review::where('listing_id', $validated['listing_id'])->get();
            $avgRating = $allReviews->avg('rating');
            $listing->update([
                'rating_avg' => round($avgRating, 1),
                'review_count' => $allReviews->count(),
            ]);
        }

        return response()->json($review, 201);
    }
}
