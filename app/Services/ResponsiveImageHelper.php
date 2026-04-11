<?php

namespace App\Services;

use App\Models\ContentItem;
use Illuminate\Support\Facades\App;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ResponsiveImageHelper
{
    private const RESPONSIVE_SIZES = [
        'sm' => ['width' => 320, 'conversion_webp' => 'responsive_sm', 'conversion_jpg' => 'responsive_sm_jpg'],
        'md' => ['width' => 768, 'conversion_webp' => 'responsive_md', 'conversion_jpg' => 'responsive_md_jpg'],
        'lg' => ['width' => 1200, 'conversion_webp' => 'responsive_lg', 'conversion_jpg' => 'responsive_lg_jpg'],
    ];

    public static function fromContentItem(ContentItem $item, string $collectionName = 'featured_image'): ?array
    {
        $media = $item->getFirstMedia($collectionName);
        if (!$media) {
            return null;
        }

        $currentLocale = App::getLocale();
        $altText = $item->getTranslation('featured_image_alt_text', $currentLocale, false);
        if (empty($altText)) {
            $altText = $item->getTranslation('title', $currentLocale);
        }

        return self::buildFromMedia($media, $altText);
    }

    public static function buildFromMedia(Media $media, string $altText = ''): array
    {
        $imageData = [
            'alt' => $altText,
            'original_url' => $media->getUrl(),
            'webp_sources' => [],
            'jpg_sources' => [],
            'thumbnail_webp' => $media->hasGeneratedConversion('thumbnail')
                ? $media->getUrl('thumbnail') : null,
            'thumbnail_jpg' => $media->hasGeneratedConversion('thumbnail_jpg')
                ? $media->getUrl('thumbnail_jpg') : null,
        ];

        // Thumbnail fallbacks
        if ($imageData['thumbnail_webp'] && !$imageData['thumbnail_jpg']) {
            if ($media->mime_type !== 'image/webp') {
                $imageData['thumbnail_jpg'] = $media->getUrl();
            }
        } elseif (!$imageData['thumbnail_webp'] && !$imageData['thumbnail_jpg']) {
            $imageData['thumbnail_jpg'] = $media->getUrl();
        }

        foreach (self::RESPONSIVE_SIZES as $sizeInfo) {
            if ($media->hasGeneratedConversion($sizeInfo['conversion_webp'])) {
                $imageData['webp_sources'][] = [
                    'url' => $media->getUrl($sizeInfo['conversion_webp']),
                    'width' => $sizeInfo['width'],
                ];
            }
            if ($media->hasGeneratedConversion($sizeInfo['conversion_jpg'])) {
                $imageData['jpg_sources'][] = [
                    'url' => $media->getUrl($sizeInfo['conversion_jpg']),
                    'width' => $sizeInfo['width'],
                ];
            }
        }

        // Fallback: if no jpg sources but webp exist, use original as jpg source
        if (empty($imageData['jpg_sources']) && !empty($imageData['webp_sources']) && $media->mime_type !== 'image/webp') {
            $imageData['jpg_sources'][] = [
                'url' => $media->getUrl(),
                'width' => $media->getCustomProperty('width', 1200),
            ];
        }
        // Fallback: if no sources at all and not webp, use original
        if (empty($imageData['webp_sources']) && empty($imageData['jpg_sources']) && $media->mime_type !== 'image/webp') {
            $imageData['jpg_sources'][] = [
                'url' => $media->getUrl(),
                'width' => $media->getCustomProperty('width', 1200),
            ];
        }

        return $imageData;
    }
}
