<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query();

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('location.city', $request->city);
        }

        // Filter by country
        if ($request->has('country')) {
            $query->where('location.country', $request->country);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price.amount', '>=', (float) $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price.amount', '<=', (float) $request->max_price);
        }

        // Sort
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $listings = $query->paginate($perPage);

        return response()->json($listings);
    }

    public function show($id)
    {
        $listing = Listing::findOrFail($id);
        return response()->json($listing);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'category' => 'required|in:hotel,flight,tour,package',
            'location' => 'required|array',
            'location.address' => 'required|string',
            'location.city' => 'required|string',
            'location.country' => 'required|string',
            'price' => 'required|array',
            'price.amount' => 'required|numeric|min:0',
            'price.currency' => 'required|string',
            'images' => 'array',
            'amenities' => 'array',
            'availability' => 'array',
        ]);

        $validated['host_id'] = $request->header('X-User-Id');
        $validated['rating_avg'] = 0;
        $validated['review_count'] = 0;

        $listing = Listing::create($validated);
        return response()->json($listing, 201);
    }

    public function update(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:200',
            'description' => 'string',
            'category' => 'in:hotel,flight,tour,package',
            'location' => 'array',
            'price' => 'array',
            'images' => 'array',
            'amenities' => 'array',
            'availability' => 'array',
        ]);

        $listing->update($validated);
        return response()->json($listing);
    }

    public function destroy($id)
    {
        $listing = Listing::findOrFail($id);
        $listing->delete();
        return response()->json(['message' => 'Listing deleted']);
    }
}
