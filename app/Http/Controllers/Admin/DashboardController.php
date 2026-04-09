<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ContentCategory;
use App\Models\ContentItem;
use App\Models\NavigationItem;
use App\Models\Page;
use App\Models\Quote;
use App\Models\Scholar;
use App\Models\SocialAccount;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'pages'       => Page::count(),
            'content_items' => ContentItem::count(),
            'published_items' => ContentItem::published()->count(),
            'categories'  => ContentCategory::count(),
            'books'       => Book::count(),
            'scholars'    => Scholar::count(),
            'quotes'      => Quote::count(),
            'nav_items'   => NavigationItem::count(),
            'social_accounts' => SocialAccount::count(),
        ];

        $recentItems = ContentItem::with('category:id,name,slug')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn(ContentItem $item) => [
                'id'     => $item->id,
                'title'  => $item->getTranslations('title'),
                'status' => $item->status,
                'category_name' => $item->category?->getTranslations('name'),
                'created_at' => $item->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'       => $stats,
            'recentItems' => $recentItems,
        ]);
    }
}
