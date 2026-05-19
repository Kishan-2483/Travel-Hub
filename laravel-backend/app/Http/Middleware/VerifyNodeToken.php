<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyNodeToken
{
    /**
     * Verify that the request came from the Node.js gateway
     * by checking for the X-User-Id header (set by Node's auth middleware).
     */
    public function handle(Request $request, Closure $next)
    {
        $userId = $request->header('X-User-Id');

        if (!$userId) {
            return response()->json(['error' => 'Unauthorized - Missing user context'], 401);
        }

        return $next($request);
    }
}
