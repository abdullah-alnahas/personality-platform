<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ContentCategoryController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ContentItemController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\Admin\NavigationItemController;
use App\Http\Controllers\Admin\SocialAccountController;
use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Admin\QuoteController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PageBlockController;
use App\Http\Controllers\Admin\ScholarController;
use App\Http\Controllers\Admin\SubscriberController;
use App\Http\Controllers\Admin\ContactSubmissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\PageDisplayController;

// --- Public Routes ---
// Cacheable public GET routes (full-page cache for guests + CSP headers)
Route::middleware(['page.cache', 'csp'])->group(function () {
    Route::get("/", [PageDisplayController::class, "homepage"])->name("home");

    Route::get("/item/{slug}", [ContentController::class, "showItem"])
        ->where("slug", "[a-z][a-z0-9-]{0,254}")
        ->name("content.show-item");

    Route::get("/category/{slug}", [ContentController::class, "showCategory"])
        ->where("slug", "[a-z][a-z0-9-]{0,254}")
        ->name("content.show-category");

    Route::get("/about", AboutPageController::class)->name("about");

    Route::get("/contact", [ContactPageController::class, "show"])->name(
        "contact.show"
    );

    Route::get("/search", SearchController::class)
        ->middleware('throttle:30,1')
        ->name("search");

    // Dynamic pages (catch-all for page slugs - must be after all specific routes)
    Route::get("/page/{slug}", [PageDisplayController::class, "show"])
        ->where("slug", "[a-z][a-z0-9-]{0,254}")
        ->name("page.show");
});

// CSP violation report sink. Browsers POST application/csp-report or
// application/json. Throttle aggressively — a single XSS attempt can fire
// hundreds of reports. No CSRF (browsers don't include the token).
Route::post('/csp-report', function (\Illuminate\Http\Request $request) {
    $payload = $request->json()->all() ?: $request->all();
    \Illuminate\Support\Facades\Log::channel(config('logging.csp_channel', 'stack'))
        ->warning('CSP violation', [
            'ip' => $request->ip(),
            'ua' => substr((string) $request->userAgent(), 0, 200),
            'report' => $payload,
        ]);
    return response()->noContent();
})->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])
  ->middleware('throttle:30,1')
  ->name('csp.report');

// robots.txt — rendered dynamically so admin path is never disclosed.
// Search engines naturally skip auth-gated paths; explicit Disallow entries
// merely advertise their existence to anyone who fetches the file.
Route::get('/robots.txt', function () {
    $lines = [
        'User-agent: *',
        'Allow: /',
        'Allow: /item/',
        'Allow: /category/',
        'Allow: /about',
        'Allow: /contact',
        'Allow: /search',
        '',
        'Sitemap: ' . url('/sitemap.xml'),
    ];

    return response(implode("\n", $lines) . "\n", 200, [
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
})->name('robots');

// Non-cacheable POST routes (still get CSP + rate limiting)
Route::middleware(['csp', 'throttle:5,1'])->group(function () {
    Route::post("/contact", [ContactPageController::class, "store"])->name(
        "contact.store"
    );
    Route::post("/subscribe", SubscriptionController::class)->name("subscribe");
});

// Admin Routes — wrapped in csp middleware so admin pages get the same
// Content-Security-Policy + security headers as the public site.
Route::prefix(config('admin.path', 'admin'))
    ->middleware(['csp'])
    ->name("admin.")
    ->group(function () {
        // Authentication Routes (Guest Only)
        Route::middleware("guest")->group(function () {
            Route::get("login", [
                AuthenticatedSessionController::class,
                "create",
            ])->name("login");

            // throttle:5,1 = 5 attempts per minute (defense-in-depth on top of LoginRequest limiter)
            Route::post("login", [
                AuthenticatedSessionController::class,
                "store",
            ])->middleware("throttle:5,1");

            // Password reset — kept under admin prefix so the URLs aren't easily enumerable
            Route::get("forgot-password", [PasswordResetLinkController::class, "create"])
                ->middleware("throttle:5,1")
                ->name("password.request");

            Route::post("forgot-password", [PasswordResetLinkController::class, "store"])
                ->middleware("throttle:5,1")
                ->name("password.email");

            Route::get("reset-password/{token}", [NewPasswordController::class, "create"])
                ->name("password.reset");

            Route::post("reset-password", [NewPasswordController::class, "store"])
                ->middleware("throttle:5,1")
                ->name("password.store");
        });

        // Authenticated Admin Routes
        // 'verified' middleware is intentionally omitted — email verification is not
        // required for this admin-only platform (accounts are seeded, not self-registered).
        Route::middleware(["auth"])->group(function () {
            // Logout
            Route::post("logout", [
                AuthenticatedSessionController::class,
                "destroy",
            ])->name("logout");

            // Dashboard (Requires 'view admin' permission - apply middleware)
            Route::get("/dashboard", [DashboardController::class, "index"])
                ->middleware("can:view admin")
                ->name("dashboard");

            // Settings (Requires 'manage settings' permission)
            Route::get("settings", [SettingController::class, "edit"])
                ->middleware("can:manage settings")
                ->name("settings.edit");
            Route::put("settings", [SettingController::class, "update"])
                ->middleware("can:manage settings")
                ->name("settings.update");

            // Content Categories (Requires 'manage categories' permission)
            Route::resource(
                "content-categories",
                ContentCategoryController::class
            )
                ->parameters(["content-categories" => "content_category"])
                ->middleware("can:manage categories"); // Apply permission to resource

            // Content Items (Requires 'manage content items' permission) - ADD THIS
            Route::resource("content-items", ContentItemController::class)
                ->parameters(["content-items" => "content_item"]) // Ensure parameter name matches controller variable ($content_item)
                ->middleware("can:manage content items"); // Apply permission check

            // Navigation Items (Requires 'manage navigation' permission)
            Route::resource("navigation-items", NavigationItemController::class)
                ->parameters(["navigation-items" => "navigation_item"])
                ->middleware("can:manage navigation");

            // Social Accounts (Requires 'manage social accounts' permission)
            Route::resource("social-accounts", SocialAccountController::class)
                ->parameters(["social-accounts" => "social_account"])
                ->middleware("can:manage social accounts");

            // Quotes CRUD (Requires 'manage quotes' permission)
            Route::resource("quotes", QuoteController::class)->middleware(
                "can:manage quotes"
            ); // Apply permission to resource
            // Media Library Routes (Requires 'manage media' permission)
            Route::get("media", [MediaController::class, "index"])
                ->name("media.index")
                ->middleware("can:manage media");
            Route::get("media/picker", [MediaController::class, "picker"])
                ->name("media.picker")
                ->middleware("can:manage media");
            Route::post("media", [MediaController::class, "store"])
                ->name("media.store")
                ->middleware(["can:manage media", "throttle:upload"]);
            Route::delete("media/{medium?}", [MediaController::class, "destroy"])
                ->name("media.destroy")
                ->middleware("can:manage media");
            // Languages CRUD (Requires 'manage languages' permission)
            Route::resource("languages", LanguageController::class)
                ->except(["show"])
                ->middleware("can:manage languages");

            // Books / Publications (Requires 'manage books' permission)
            Route::resource("books", BookController::class)
                ->except(["show"])
                ->middleware("can:manage books");

            // Scholars / Teachers (Requires 'manage scholars' permission)
            Route::resource("scholars", ScholarController::class)
                ->except(["show"])
                ->middleware("can:manage scholars");

            // Pages CRUD (Requires 'manage pages' permission)
            Route::resource("pages", PageController::class)
                ->except(["show"])
                ->middleware("can:manage pages");

            // Subscribers (Requires 'manage subscribers' permission)
            Route::get("subscribers", [SubscriberController::class, "index"])
                ->middleware("can:manage subscribers")
                ->name("subscribers.index");
            Route::get("subscribers/export", [SubscriberController::class, "export"])
                ->middleware("can:manage subscribers")
                ->name("subscribers.export");
            Route::delete("subscribers/{subscriber}", [SubscriberController::class, "destroy"])
                ->middleware("can:manage subscribers")
                ->name("subscribers.destroy");

            // Contact Submissions (Requires 'manage contact submissions' permission)
            Route::get("contact-submissions", [ContactSubmissionController::class, "index"])
                ->middleware("can:manage contact submissions")
                ->name("contact-submissions.index");
            Route::get("contact-submissions/export", [ContactSubmissionController::class, "export"])
                ->middleware("can:manage contact submissions")
                ->name("contact-submissions.export");
            Route::get("contact-submissions/{submission}", [ContactSubmissionController::class, "show"])
                ->middleware("can:manage contact submissions")
                ->name("contact-submissions.show");
            Route::put("contact-submissions/{submission}", [ContactSubmissionController::class, "update"])
                ->middleware("can:manage contact submissions")
                ->name("contact-submissions.update");
            Route::delete("contact-submissions/{submission}", [ContactSubmissionController::class, "destroy"])
                ->middleware("can:manage contact submissions")
                ->name("contact-submissions.destroy");

            // Users (Requires 'manage users' permission)
            Route::resource("users", UserController::class)
                ->except(["show"])
                ->middleware("can:manage users");

            // Roles (Requires 'manage roles' permission)
            Route::resource("roles", RoleController::class)
                ->except(["show"])
                ->middleware("can:manage roles");

            // Page Blocks (nested under pages)
            Route::prefix("pages/{page}/blocks")
                ->name("pages.blocks.")
                ->middleware("can:manage pages")
                ->group(function () {
                    Route::get("create", [PageBlockController::class, "create"])->name("create");
                    Route::post("/", [PageBlockController::class, "store"])->name("store");
                    Route::get("{block}/edit", [PageBlockController::class, "edit"])->name("edit");
                    Route::put("{block}", [PageBlockController::class, "update"])->name("update");
                    Route::delete("{block}", [PageBlockController::class, "destroy"])->name("destroy");
                    Route::post("reorder", [PageBlockController::class, "reorder"])->name("reorder");
                });
        });
    });

// Standard Laravel Breeze Auth Routes (if installed - potentially remove/modify if not needed for public)
require __DIR__ . "/auth.php";
