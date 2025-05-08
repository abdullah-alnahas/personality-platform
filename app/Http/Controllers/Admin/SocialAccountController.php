<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Http\Requests\Admin\StoreSocialAccountRequest;
use App\Http\Requests\Admin\UpdateSocialAccountRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SocialAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('manage social accounts');

        $accounts = SocialAccount::orderBy('display_order')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/SocialAccounts/Index', [
            'accounts' => $accounts,
             'can' => [
                'create' => auth()->user()->can('manage social accounts'),
                'edit' => auth()->user()->can('manage social accounts'),
                'delete' => auth()->user()->can('manage social accounts'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('manage social accounts');

        return Inertia::render('Admin/SocialAccounts/Form', [
            'account' => null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSocialAccountRequest $request): RedirectResponse
    {
        SocialAccount::create($request->validated());

        return redirect()->route('admin.social-accounts.index')
                         ->with('success', 'Social account created successfully.');
    }

    /**
     * Display the specified resource. (Usually redirect to edit)
     */
    public function show(SocialAccount $socialAccount): RedirectResponse
    {
        return redirect()->route('admin.social-accounts.edit', $socialAccount);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SocialAccount $social_account): Response // Parameter name matches route
    {
         $this->authorize('manage social accounts');

        return Inertia::render('Admin/SocialAccounts/Form', [
            'account' => $social_account, // Pass existing account data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSocialAccountRequest $request, SocialAccount $social_account): RedirectResponse
    {
        $social_account->update($request->validated());

        // Clear cache if social accounts are cached globally (e.g., in HandleInertiaRequests)
        // Cache::forget('active_social_accounts'); // Example cache key

        return redirect()->route('admin.social-accounts.index')
                         ->with('success', 'Social account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SocialAccount $social_account): RedirectResponse
    {
        $this->authorize('manage social accounts');
        $social_account->delete();

         // Clear cache if social accounts are cached globally
        // Cache::forget('active_social_accounts'); // Example cache key

        return redirect()->route('admin.social-accounts.index')
                         ->with('success', 'Social account deleted successfully.');
    }
}
