<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentEngagement;
use App\Models\ContentItem;
use App\Models\Page;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EngagementController extends Controller
{
    private const MODEL_MAP = [
        'content_item' => ContentItem::class,
        'page' => Page::class,
        'quote' => Quote::class,
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:view,like,share',
            'content_type' => 'required|string|in:content_item,page,quote',
            'content_id' => 'required|integer|min:1',
        ]);

        $modelClass = self::MODEL_MAP[$validated['content_type']] ?? null;
        if (!$modelClass) {
            return response()->json(['message' => 'Content not found.'], 404);
        }
        $query = $modelClass::where('id', $validated['content_id']);
        if (method_exists($modelClass, 'scopePublished')) {
            $query->published();
        }
        if (!$query->exists()) {
            return response()->json(['message' => 'Content not found.'], 404);
        }

        // Hash the IP to avoid storing cleartext PII (GDPR-friendly).
        $ipHash = hash('sha256', $request->ip() . config('app.key'));

        $isDuplicate = ContentEngagement::where('content_type', $validated['content_type'])
            ->where('content_id', $validated['content_id'])
            ->where('engagement_type', $validated['type'])
            ->where('ip_address', $ipHash)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($isDuplicate) {
            return response()->json(['message' => 'Engagement already recorded.'], 200);
        }

        ContentEngagement::create([
            'content_type' => $validated['content_type'],
            'content_id'   => $validated['content_id'],
            'engagement_type' => $validated['type'],
            'ip_address'   => $ipHash,
            'user_agent'   => mb_substr((string) $request->userAgent(), 0, 500),
        ]);

        return response()->json([
            'message' => 'Engagement recorded successfully.',
        ], 201);
    }
}
