<?php

namespace App\Observers;

use App\Models\Quote;
use Illuminate\Support\Facades\Cache;

class QuoteObserver
{
    public function saved(Quote $quote): void
    {
        // The 'featured_quote' section fetches a random quote.
        // While not strictly necessary to clear 'homepage_sections_data' for every quote save
        // (as the random quote is fetched live within the cache closure if it's not the quote_data itself),
        // if the *logic* of which quotes are candidates changes (e.g. new quote becomes 'published'),
        // it's safer to clear. A more targeted approach might be too complex for now.
        Cache::forget("homepage_sections_data");
    }

    public function deleted(Quote $quote): void
    {
        Cache::forget("homepage_sections_data");
    }
}
