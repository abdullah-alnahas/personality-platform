<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url as SitemapUrl;
use App\Models\ContentItem;
use App\Models\ContentCategory;
use App\Models\Page;

class GenerateSitemap extends Command
{
    protected $signature = "sitemap:generate";
    protected $description = "Generate the sitemap.xml for the application";

    public function handle(): int
    {
        $this->info("Generating sitemap...");

        $sitemap = Sitemap::create();

        // Add static pages (guarded with Route::has)
        if (Route::has('home')) {
            $sitemap->add(
                SitemapUrl::create(route("home"))
                    ->setPriority(1.0)
                    ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_WEEKLY)
            );
        }
        if (Route::has('about')) {
            $sitemap->add(
                SitemapUrl::create(route("about"))
                    ->setPriority(0.8)
                    ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_MONTHLY)
            );
        }
        if (Route::has('contact.show')) {
            $sitemap->add(
                SitemapUrl::create(route("contact.show"))
                    ->setPriority(0.5)
                    ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_YEARLY)
            );
        }

        // Add Content Categories
        ContentCategory::published()
            ->get()
            ->each(function (ContentCategory $category) use ($sitemap) {
                if ($category->slug) {
                    // Corrected route check
                    if (Route::has("content.show-category")) {
                        // <-- CORRECTED HERE
                        try {
                            $url = route(
                                "content.show-category",
                                $category->slug
                            );
                            $sitemap->add(
                                SitemapUrl::create($url)
                                    ->setLastModificationDate(
                                        $category->updated_at
                                    )
                                    ->setChangeFrequency(
                                        SitemapUrl::CHANGE_FREQUENCY_WEEKLY
                                    )
                                    ->setPriority(0.7)
                            );
                        } catch (\Exception $e) {
                            $this->warn(
                                "Could not generate URL for category ID {$category->id}: {$category->slug} - " .
                                    $e->getMessage()
                            );
                        }
                    } else {
                        $this->warn(
                            "Route 'content.show-category' not found. Skipping category ID {$category->id}."
                        );
                    }
                }
            });

        // Add Content Items
        ContentItem::published()
            ->get()
            ->each(function (ContentItem $item) use ($sitemap) {
                if ($item->slug) {
                    // Corrected route check
                    if (Route::has("content.show-item")) {
                        // <-- CORRECTED HERE
                        try {
                            $url = route("content.show-item", $item->slug);
                            $sitemap->add(
                                SitemapUrl::create($url)
                                    ->setLastModificationDate($item->updated_at)
                                    ->setChangeFrequency(
                                        SitemapUrl::CHANGE_FREQUENCY_DAILY
                                    )
                                    ->setPriority(0.9)
                            );
                        } catch (\Exception $e) {
                            $this->warn(
                                "Could not generate URL for item ID {$item->id}: {$item->slug} - " .
                                    $e->getMessage()
                            );
                        }
                    } else {
                        $this->warn(
                            "Route 'content.show-item' not found. Skipping item ID {$item->id}."
                        );
                    }
                }
            });

        // Add Published Pages
        Page::published()
            ->where('is_homepage', false)
            ->get()
            ->each(function (Page $page) use ($sitemap) {
                if ($page->slug) {
                    if (Route::has('page.show')) {
                        try {
                            $url = route('page.show', $page->slug);
                            $sitemap->add(
                                SitemapUrl::create($url)
                                    ->setLastModificationDate($page->updated_at)
                                    ->setChangeFrequency(
                                        SitemapUrl::CHANGE_FREQUENCY_WEEKLY
                                    )
                                    ->setPriority(0.7)
                            );
                        } catch (\Exception $e) {
                            $this->warn(
                                "Could not generate URL for page ID {$page->id}: {$page->slug} - " .
                                    $e->getMessage()
                            );
                        }
                    } else {
                        $this->warn(
                            "Route 'page.show' not found. Skipping page ID {$page->id}."
                        );
                    }
                }
            });

        $sitemapPath = public_path("sitemap.xml");
        $sitemap->writeToFile($sitemapPath);

        $this->info("Sitemap generated successfully at {$sitemapPath}");
        return Command::SUCCESS;
    }
}
