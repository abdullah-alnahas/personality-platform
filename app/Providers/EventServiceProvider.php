<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

// Import Models and Observers
use App\Models\Setting;
use App\Observers\SettingObserver;
use App\Models\HomepageSection;
use App\Observers\HomepageSectionObserver;
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

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [SendEmailVerificationNotification::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // It's good practice to call parent::boot() if it exists, though not strictly necessary for the default ServiceProvider
        // parent::boot();

        Setting::observe(SettingObserver::class);
        HomepageSection::observe(HomepageSectionObserver::class);
        SocialAccount::observe(SocialAccountObserver::class);
        NavigationItem::observe(NavigationItemObserver::class);
        ContentItem::observe(ContentItemObserver::class);
        ContentCategory::observe(ContentCategoryObserver::class);
        Quote::observe(QuoteObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
