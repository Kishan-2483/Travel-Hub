<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminCheck
{
    /**
     * Verify the user has admin role (forwarded from Node.js gateway).
     */
    public function handle(Request $request, Closure $next)
    {
        $role = $request->header('X-User-Role');

        if ($role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        return $next($request);
    }
}
