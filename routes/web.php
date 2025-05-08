<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ContentCategoryController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ContentItemController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\Admin\NavigationItemController;
use App\Http\Controllers\Admin\SocialAccountController;
use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SearchController;

// --- Public Routes ---
Route::get('/', HomepageController::class)->name('home');

Route::get('/item/{slug}', [ContentController::class, 'showItem'])
    ->where('slug', '[a-zA-Z0-9-]+')
    ->name('content.show-item');

Route::get('/category/{slug}', [ContentController::class, 'showCategory'])
    ->where('slug', '[a-zA-Z0-9-]+')
    ->name('content.show-category');

Route::get('/about', AboutPageController::class)->name('about');

Route::get('/contact', [ContactPageController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactPageController::class, 'store'])->name('contact.store');

Route::post('/subscribe', SubscriptionController::class)->name('subscribe');

Route::get('/search', SearchController::class)->name('search');

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {

    // Authentication Routes (Guest Only)
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    // Authenticated Admin Routes
    Route::middleware(['auth' /* , 'verified' */])->group(function () {
        // Logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

        // Dashboard (Requires 'view admin' permission - apply middleware)
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->middleware('can:view admin')->name('dashboard'); // Added permission

        // Settings (Requires 'manage settings' permission)
        Route::get('settings', [SettingController::class, 'edit'])->middleware('can:manage settings')->name('settings.edit');
        Route::put('settings', [SettingController::class, 'update'])->middleware('can:manage settings')->name('settings.update');

        // Content Categories (Requires 'manage categories' permission)
        Route::resource('content-categories', ContentCategoryController::class)
            ->parameters(['content-categories' => 'content_category'])
            ->middleware('can:manage categories'); // Apply permission to resource

        // Content Items (Requires 'manage content items' permission) - ADD THIS
        Route::resource('content-items', ContentItemController::class)
            ->parameters(['content-items' => 'content_item']) // Ensure parameter name matches controller variable ($content_item)
            ->middleware('can:manage content items'); // Apply permission check

        // Navigation Items (Requires 'manage navigation' permission)
        Route::resource('navigation-items', NavigationItemController::class)
            ->parameters(['navigation-items' => 'navigation_item'])
            ->middleware('can:manage navigation');

        // Social Accounts (Requires 'manage social accounts' permission)
        Route::resource('social-accounts', SocialAccountController::class)
            ->parameters(['social-accounts' => 'social_account'])
            ->middleware('can:manage social accounts');


    });
});

// Standard Laravel Breeze Auth Routes (if installed - potentially remove/modify if not needed for public)
require __DIR__ . '/auth.php';
