<?php

namespace App\Http\Controllers;

use App\Models\FraudReport;
use App\Models\Transaction;
use Illuminate\Http\Request;

class FraudController extends Controller
{
    public function index(Request $request)
    {
        $query = FraudReport::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_user_id' => 'required|string',
            'transaction_id' => 'string',
            'reason' => 'required|string|max:500',
            'severity' => 'required|in:low,medium,high,critical',
        ]);

        $validated['reported_by'] = $request->header('X-User-Id') ?? 'system';
        $validated['status'] = 'open';

        $report = FraudReport::create($validated);
        return response()->json($report, 201);
    }

    public function update(Request $request, $id)
    {
        $report = FraudReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'in:open,investigating,resolved,dismissed',
            'admin_notes' => 'string|max:1000',
        ]);

        if (isset($validated['status']) && in_array($validated['status'], ['resolved', 'dismissed'])) {
            $validated['resolved_at'] = now();
        }

        $report->update($validated);
        return response()->json($report);
    }

    public function show($id)
    {
        $report = FraudReport::findOrFail($id);
        return response()->json($report);
    }

    /**
     * Simple rule-based fraud detection
     */
    public function analyze(Request $request)
    {
        $userId = $request->input('user_id');
        $flags = [];
        $score = 0;

        // Rule 1: Multiple bookings in short time
        $recentBookings = \App\Models\Booking::where('user_id', $userId)
            ->where('created_at', '>=', now()->subHours(24))
            ->count();

        if ($recentBookings > 5) {
            $flags[] = 'Multiple bookings in 24 hours';
            $score += 30;
        }

        // Rule 2: Multiple failed transactions
        $failedTxns = Transaction::where('user_id', $userId)
            ->where('status', 'failed')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        if ($failedTxns > 3) {
            $flags[] = 'Multiple failed transactions in 7 days';
            $score += 40;
        }

        // Rule 3: High value transactions
        $highValueTxns = Transaction::where('user_id', $userId)
            ->where('amount', '>', 5000)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        if ($highValueTxns > 3) {
            $flags[] = 'Multiple high-value transactions';
            $score += 20;
        }

        $severity = 'low';
        if ($score >= 60) $severity = 'critical';
        elseif ($score >= 40) $severity = 'high';
        elseif ($score >= 20) $severity = 'medium';

        return response()->json([
            'user_id' => $userId,
            'fraud_score' => $score,
            'severity' => $severity,
            'flags' => $flags,
            'recommendation' => $score >= 40 ? 'Review required' : 'No action needed',
        ]);
    }
}
