<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('manage users');

        $query = User::query()->with('roles:id,name');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest('id')->paginate(20)->withQueryString();

        $usersTransformed = $users->getCollection()->map(fn ($u) => [
            'id'         => $u->id,
            'name'       => $u->name,
            'email'      => $u->email,
            'roles'      => $u->roles->pluck('name')->values(),
            'created_at' => $u->created_at?->toIso8601String(),
        ]);
        $users->setCollection($usersTransformed);

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'roles'   => Role::orderBy('name')->pluck('name'),
            'filters' => ['search' => $search ?? ''],
            'can'     => [
                'create' => auth()->user()->can('manage users'),
                'edit'   => auth()->user()->can('manage users'),
                'delete' => auth()->user()->can('manage users'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('manage users');

        return Inertia::render('Admin/Users/Form', [
            'user'  => null,
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('manage users');

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'roles'    => ['array'],
            'roles.*'  => ['string', Rule::in(Role::pluck('name')->all())],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->syncRoles($data['roles'] ?? []);

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('User created.'));
    }

    public function edit(User $user): Response
    {
        $this->authorize('manage users');

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->values(),
            ],
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('manage users');

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'roles'    => ['array'],
            'roles.*'  => ['string', Rule::in(Role::pluck('name')->all())],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        $user->syncRoles($data['roles'] ?? []);

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('User updated.'));
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('manage users');

        if ($user->id === auth()->id()) {
            return back()->with('error', __('You cannot delete your own account.'));
        }

        $user->delete();

        return back()->with('success', __('User deleted.'));
    }
}
