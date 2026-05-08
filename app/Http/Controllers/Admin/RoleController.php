<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $this->authorize('manage roles');

        $roles = Role::with('permissions:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $r) => [
                'id'          => $r->id,
                'name'        => $r->name,
                'guard_name'  => $r->guard_name,
                'permissions' => $r->permissions->pluck('name')->values(),
                'users_count' => $r->users()->count(),
            ]);

        return Inertia::render('Admin/Roles/Index', [
            'roles'       => $roles,
            'permissions' => Permission::orderBy('name')->pluck('name'),
            'can' => [
                'create' => auth()->user()->can('manage roles'),
                'edit'   => auth()->user()->can('manage roles'),
                'delete' => auth()->user()->can('manage roles'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('manage roles');

        return Inertia::render('Admin/Roles/Form', [
            'role'        => null,
            'permissions' => Permission::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage roles');

        $data = $request->validate([
            'name'          => ['required', 'string', 'max:125', 'unique:roles,name'],
            'permissions'   => ['array'],
            'permissions.*' => ['string', Rule::in(Permission::pluck('name')->all())],
        ]);

        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', __('Role created.'));
    }

    public function edit(Role $role): Response
    {
        $this->authorize('manage roles');

        return Inertia::render('Admin/Roles/Form', [
            'role' => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
            'permissions' => Permission::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $this->authorize('manage roles');

        $data = $request->validate([
            'name'          => ['required', 'string', 'max:125', Rule::unique('roles', 'name')->ignore($role->id)],
            'permissions'   => ['array'],
            'permissions.*' => ['string', Rule::in(Permission::pluck('name')->all())],
        ]);

        // Block renaming Super Admin to preserve the bypass logic in AuthServiceProvider
        if ($role->name === 'Super Admin' && $data['name'] !== 'Super Admin') {
            return back()->with('error', __('The Super Admin role cannot be renamed.'));
        }

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', __('Role updated.'));
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('manage roles');

        if (in_array($role->name, ['Super Admin', 'Editor'], true)) {
            return back()->with('error', __('Built-in roles cannot be deleted.'));
        }

        if ($role->users()->exists()) {
            return back()->with('error', __('Cannot delete a role that is still assigned to users.'));
        }

        $role->delete();

        return back()->with('success', __('Role deleted.'));
    }
}
