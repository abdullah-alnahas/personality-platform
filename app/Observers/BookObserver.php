<?php

namespace App\Observers;

use App\Http\Middleware\CacheFullPage;
use App\Models\Book;
use Illuminate\Support\Facades\Cache;

class BookObserver
{
    public function saved(Book $book): void
    {
        $this->clearCaches();
    }

    public function deleted(Book $book): void
    {
        $this->clearCaches();
    }

    protected function clearCaches(): void
    {
        CacheFullPage::flush();
        Cache::forget('homepage_data');

        foreach ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 24, 25, 30, 50] as $max) {
            Cache::forget("block_books_grid_{$max}");
        }
    }
}
