<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavigationItem;
use App\Http\Requests\Admin\StoreNavigationItemRequest;
use App\Http\Requests\Admin\UpdateNavigationItemRequest;
use Illuminate\Http\RedirectResponse;
use App\Services\SWRCache;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class NavigationItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('manage navigation');

        $items = NavigationItem::with('parent:id,label')
            ->orderBy('order')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/NavigationItems/Index', [
            'items' => $items,
            'can' => [
                'create' => auth()->user()->can('manage navigation'),
                'edit' => auth()->user()->can('manage navigation'),
                'delete' => auth()->user()->can('manage navigation'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('manage navigation');
        $parentOptions = NavigationItem::orderBy('label->en')->get(['id', 'label']);

        return Inertia::render('Admin/NavigationItems/Form', [
            'item' => null,
            'parentOptions' => $parentOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNavigationItemRequest $request): RedirectResponse
    {
        NavigationItem::create($request->validated());

        // --- Clear the navigation cache ---
        Cache::forget('published_navigation_items_structured');
        SWRCache::forget('published_navigation_items_structured_shared');
        // --- End Cache Clear ---

        return redirect()->route('admin.navigation-items.index')
            ->with('success', 'Navigation item created successfully.');
    }

    /**
     * Display the specified resource. (Usually redirect to edit)
     */
    public function show(NavigationItem $navigation_item): RedirectResponse
    {
        $this->authorize('manage navigation');
        return redirect()->route('admin.navigation-items.edit', $navigation_item);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NavigationItem $navigation_item): Response
    {
        $this->authorize('manage navigation');
        $parentOptions = NavigationItem::where('id', '!=', $navigation_item->id)
            ->orderBy('label->en')
            ->get(['id', 'label']);

        return Inertia::render('Admin/NavigationItems/Form', [
            'item' => $navigation_item,
            'parentOptions' => $parentOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNavigationItemRequest $request, NavigationItem $navigation_item): RedirectResponse
    {
        $navigation_item->update($request->validated());

        // --- Clear the navigation cache ---
        Cache::forget('published_navigation_items_structured');
        SWRCache::forget('published_navigation_items_structured_shared');
        // --- End Cache Clear ---

        return redirect()->route('admin.navigation-items.index')
            ->with('success', 'Navigation item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NavigationItem $navigation_item): RedirectResponse
    {
        $this->authorize('manage navigation');
        $navigation_item->delete();

        // --- Clear the navigation cache ---
        Cache::forget('published_navigation_items_structured');
        SWRCache::forget('published_navigation_items_structured_shared');
        // --- End Cache Clear ---

        return redirect()->route('admin.navigation-items.index')
            ->with('success', 'Navigation item deleted successfully.');
    }
}
