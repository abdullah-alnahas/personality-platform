<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
// Remove Illuminate\Support\Facades\URL; // Not strictly needed if using route() helper and Route facade
use Illuminate\Support\Facades\Route; // <-- IMPORT THIS
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url as SitemapUrl;
use App\Models\ContentItem;
use App\Models\ContentCategory;

class GenerateSitemap extends Command
{
    protected $signature = "sitemap:generate";
    protected $description = "Generate the sitemap.xml for the application";

    public function handle(): int
    {
        $this->info("Generating sitemap...");

        $sitemap = Sitemap::create();

        // Add static pages
        $sitemap->add(
            SitemapUrl::create(route("home"))
                ->setPriority(1.0)
                ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_WEEKLY)
        );
        $sitemap->add(
            SitemapUrl::create(route("about"))
                ->setPriority(0.8)
                ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_MONTHLY)
        );
        $sitemap->add(
            SitemapUrl::create(route("contact.show"))
                ->setPriority(0.5)
                ->setChangeFrequency(SitemapUrl::CHANGE_FREQUENCY_YEARLY)
        );
        // Add other static public routes as needed

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

        $sitemapPath = public_path("sitemap.xml");
        $sitemap->writeToFile($sitemapPath);

        $this->info("Sitemap generated successfully at {$sitemapPath}");
        return Command::SUCCESS;
    }
}
