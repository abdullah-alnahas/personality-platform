<?php

namespace App\Providers;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Listeners\SendAdminLoginNotification;

// Import Models and Observers
use App\Models\Setting;
use App\Observers\SettingObserver;
use App\Models\SocialAccount;
use App\Observers\SocialAccountObserver;
use App\Models\NavigationItem;
use App\Observers\NavigationItemObserver;
use App\Models\ContentItem;
use App\Observers\ContentItemObserver;
use App\Models\ContentCategory;
use App\Observers\ContentCategoryObserver;
use App\Models\Quote;
use App\Observers\QuoteObserver;
use App\Models\Book;
use App\Observers\BookObserver;
use App\Models\Scholar;
use App\Observers\ScholarObserver;
use App\Models\Language;
use App\Observers\LanguageObserver;
use App\Models\Page;
use App\Observers\PageObserver;
use App\Models\PageBlock;
use App\Observers\PageBlockObserver;
use App\Observers\RolePermissionObserver;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\Models\Role as SpatieRole;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [SendEmailVerificationNotification::class],
        Login::class => [SendAdminLoginNotification::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();

        Setting::observe(SettingObserver::class);
        SocialAccount::observe(SocialAccountObserver::class);
        NavigationItem::observe(NavigationItemObserver::class);
        ContentItem::observe(ContentItemObserver::class);
        ContentCategory::observe(ContentCategoryObserver::class);
        Quote::observe(QuoteObserver::class);
        Book::observe(BookObserver::class);
        Scholar::observe(ScholarObserver::class);
        Language::observe(LanguageObserver::class);
        Page::observe(PageObserver::class);
        PageBlock::observe(PageBlockObserver::class);
        SpatieRole::observe(RolePermissionObserver::class);
        SpatiePermission::observe(RolePermissionObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
