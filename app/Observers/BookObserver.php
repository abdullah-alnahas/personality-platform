<?php

namespace App\Observers;

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
        // Clear all books_grid caches for every possible max_items value (1–50 per BlockRegistry)
        foreach ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 24, 25, 30, 50] as $max) {
            Cache::forget("block_books_grid_{$max}");
        }
    }
}
