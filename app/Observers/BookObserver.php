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
        // Clear all books_grid caches (max_items varies per block config)
        foreach ([4, 6, 8, 12, 20] as $max) {
            Cache::forget("block_books_grid_{$max}");
        }
    }
}
