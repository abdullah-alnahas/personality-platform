<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest; // Use Laravel's default or create a simpler one if needed
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // Optionally check if already logged in and redirect
        // if (Auth::check()) {
        //     return redirect()->route('admin.dashboard');
        // }

        return Inertia::render('Admin/Auth/Login', [
            'canResetPassword' => Route::has('password.request'), // Adjust if using different password reset flow
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirect to intended URL or admin dashboard
        // return redirect()->intended(route('admin.dashboard', absolute: false)); // Using intended breaks prefix sometimes
         return redirect()->route('admin.dashboard'); // Simple redirect for now
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('admin.login'); // Redirect to admin login page
    }
}
