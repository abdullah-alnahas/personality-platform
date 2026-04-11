<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CacheDebug extends Command
{
    protected $signature = 'cache:debug';

    protected $description = 'Display cache status for key application cache entries';

    public function handle(): int
    {
        $rows = [];

        $staticKeys = [
            'homepage_data',
            'site_settings_all',
        ];

        foreach ($staticKeys as $key) {
            $rows[] = $this->checkKey($key);
        }

        $slugs = Page::pluck('slug')->filter();

        foreach ($slugs as $slug) {
            $rows[] = $this->checkKey("page_data_{$slug}");
        }

        $this->table(['Key', 'Status', 'Type'], $rows);

        return Command::SUCCESS;
    }

    /**
     * @return array{string, string, string}
     */
    private function checkKey(string $key): array
    {
        $value = Cache::get($key);

        if ($value === null) {
            return [$key, 'MISS', '-'];
        }

        return [$key, 'HIT', get_debug_type($value)];
    }
}
