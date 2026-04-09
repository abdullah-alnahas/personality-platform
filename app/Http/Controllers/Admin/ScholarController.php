<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Scholar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ScholarController extends Controller
{
    public function index(Request $request): Response
    {
        $scholars = Scholar::orderBy('group_key')->orderBy('display_order')
            ->paginate(50)
            ->withQueryString()
            ->through(fn(Scholar $s) => [
                'id'            => $s->id,
                'name'          => $s->getTranslations('name'),
                'group_name'    => $s->getTranslations('group_name'),
                'group_key'     => $s->group_key,
                'bio'           => $s->getTranslations('bio'),
                'display_order' => $s->display_order,
                'status'        => $s->status,
            ]);

        return Inertia::render('Admin/Scholars/Index', [
            'scholars' => $scholars,
            'can'      => [
                'create' => $request->user()->can('manage scholars'),
                'edit'   => $request->user()->can('manage scholars'),
                'delete' => $request->user()->can('manage scholars'),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('manage scholars');

        return Inertia::render('Admin/Scholars/Form', [
            'scholar' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('manage scholars');
        $validated = $request->validate([
            'name'          => 'required|array',
            'name.*'        => 'nullable|string|max:300',
            'group_name'    => 'required|array',
            'group_name.*'  => 'nullable|string|max:200',
            'group_key'     => 'required|string|max:100',
            'bio'           => 'nullable|array',
            'bio.*'         => 'nullable|string',
            'photo_url'     => 'nullable|url|max:2048',
            'display_order' => 'integer|min:0',
            'status'        => 'required|in:published,draft',
        ]);

        Scholar::create($validated);

        return redirect()->route('admin.scholars.index')
            ->with('success', 'Scholar created successfully.');
    }

    public function edit(Scholar $scholar): Response
    {
        Gate::authorize('manage scholars');

        return Inertia::render('Admin/Scholars/Form', [
            'scholar' => [
                'id'            => $scholar->id,
                'name'          => $scholar->getTranslations('name'),
                'group_name'    => $scholar->getTranslations('group_name'),
                'group_key'     => $scholar->group_key,
                'bio'           => $scholar->getTranslations('bio'),
                'photo_url'     => $scholar->photo_url,
                'display_order' => $scholar->display_order,
                'status'        => $scholar->status,
            ],
        ]);
    }

    public function update(Request $request, Scholar $scholar): RedirectResponse
    {
        Gate::authorize('manage scholars');

        $validated = $request->validate([
            'name'          => 'required|array',
            'name.*'        => 'nullable|string|max:300',
            'group_name'    => 'required|array',
            'group_name.*'  => 'nullable|string|max:200',
            'group_key'     => 'required|string|max:100',
            'bio'           => 'nullable|array',
            'bio.*'         => 'nullable|string',
            'photo_url'     => 'nullable|url|max:2048',
            'display_order' => 'integer|min:0',
            'status'        => 'required|in:published,draft',
        ]);

        $scholar->update($validated);

        return redirect()->route('admin.scholars.index')
            ->with('success', 'Scholar updated successfully.');
    }

    public function destroy(Scholar $scholar): RedirectResponse
    {
        Gate::authorize('manage scholars');

        $scholar->delete();

        return redirect()->route('admin.scholars.index')
            ->with('success', 'Scholar deleted.');
    }
}
