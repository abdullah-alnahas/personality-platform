<?php

namespace App\Services;

class BlockRegistry
{
    protected static array $blocks = [
        'hero_banner' => [
            'label' => 'Hero Banner',
            'icon' => 'photo',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'subtitle' => ['type' => 'translatable_richtext'],
                'background_image_url' => ['type' => 'text'],
                'portrait_image_url' => ['type' => 'text'],
                'cta_text' => ['type' => 'translatable_text'],
                'cta_link' => ['type' => 'text'],
                'overlay_opacity' => ['type' => 'number', 'default' => 0.5],
            ],
            'config_defaults' => [
                'full_width' => true,
                'min_height' => '500px',
                'text_color' => '#ffffff',
                'layout' => 'centered',
                'show_decorations' => false,
                'decoration_color' => '#C9A94E',
            ],
        ],
        'text_with_image' => [
            'label' => 'Text with Image',
            'icon' => 'view_sidebar',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'body' => ['type' => 'translatable_richtext'],
                'image_url' => ['type' => 'text'],
                'image_alt' => ['type' => 'translatable_text'],
                'image_position' => ['type' => 'select', 'options' => ['left', 'right'], 'default' => 'right'],
                'items' => ['type' => 'translatable_list'],
            ],
            'config_defaults' => [
                'background_color' => '#ffffff',
                'padding_y' => 'lg',
            ],
        ],
        'pillar_cards' => [
            'label' => 'Pillar Cards',
            'icon' => 'view_module',
            'fields' => [
                'heading' => ['type' => 'translatable_text'],
                'subtitle' => ['type' => 'translatable_text'],
                'cards' => ['type' => 'card_list', 'required' => true],
            ],
            'config_defaults' => [
                'columns' => 3,
                'card_style' => 'rounded',
                'background_color' => '#f5f5f5',
                'text_color' => null,
                'card_variant' => 'light',
                'show_decorations' => false,
            ],
        ],
        'quran_verse' => [
            'label' => 'Quran Verse',
            'icon' => 'menu_book',
            'fields' => [
                'section_heading' => ['type' => 'translatable_text'],
                'verse_text' => ['type' => 'translatable_text', 'required' => true],
                'surah_name' => ['type' => 'translatable_text', 'required' => true],
                'verse_reference' => ['type' => 'text'],
                'secondary_text' => ['type' => 'translatable_text'],
                'secondary_source' => ['type' => 'translatable_text'],
                'background_image_url' => ['type' => 'text'],
                'cta_text' => ['type' => 'translatable_text'],
                'cta_link' => ['type' => 'text'],
                'bottom_items' => ['type' => 'card_list'],
            ],
            'config_defaults' => [
                'text_color' => '#ffffff',
                'background_color' => '#1a237e',
                'ornamental_frame' => true,
                'padding_y' => 'xl',
                'layout' => 'overlay',
                'accent_color' => '#C9A94E',
            ],
        ],
        'category_grid' => [
            'label' => 'Category Grid',
            'icon' => 'grid_view',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'description' => ['type' => 'translatable_text'],
                'category_id' => ['type' => 'relation', 'model' => 'ContentCategory'],
                'max_items' => ['type' => 'number', 'default' => 6],
                'show_tags' => ['type' => 'boolean', 'default' => true],
            ],
            'config_defaults' => [
                'columns' => 3,
                'background_color' => '#ffffff',
                'show_images' => true,
            ],
        ],
        'latest_news' => [
            'label' => 'Latest News',
            'icon' => 'newspaper',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'category_id' => ['type' => 'relation', 'model' => 'ContentCategory', 'nullable' => true],
                'max_items' => ['type' => 'number', 'default' => 6],
            ],
            'config_defaults' => [
                'columns' => 3,
                'show_images' => true,
                'show_excerpt' => true,
                'background_color' => '#f9f9f9',
            ],
        ],
        'featured_quote' => [
            'label' => 'Featured Quote',
            'icon' => 'format_quote',
            'fields' => [
                'heading' => ['type' => 'translatable_text'],
                'quote_id' => ['type' => 'relation', 'model' => 'Quote', 'nullable' => true],
                'custom_text' => ['type' => 'translatable_text'],
                'custom_source' => ['type' => 'translatable_text'],
            ],
            'config_defaults' => [
                'style' => 'dark',
                'background_color' => '#1a1a2e',
                'text_color' => '#ffffff',
                'padding_y' => 'xl',
            ],
        ],
        'social_media_feed' => [
            'label' => 'Social Media Feed',
            'icon' => 'share',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'max_items' => ['type' => 'number', 'default' => 6],
            ],
            'config_defaults' => [
                'background_color' => '#ffffff',
                'show_icons' => true,
            ],
        ],
        'newsletter_cta' => [
            'label' => 'Newsletter CTA',
            'icon' => 'email',
            'fields' => [
                'heading' => ['type' => 'translatable_text', 'required' => true],
                'subtitle' => ['type' => 'translatable_text'],
                'placeholder_text' => ['type' => 'translatable_text'],
                'button_text' => ['type' => 'translatable_text'],
            ],
            'config_defaults' => [
                'background_color' => '#2B3D2F',
                'text_color' => '#ffffff',
                'full_width' => true,
            ],
        ],
        'rich_text' => [
            'label' => 'Rich Text',
            'icon' => 'article',
            'fields' => [
                'body' => ['type' => 'translatable_richtext', 'required' => true],
            ],
            'config_defaults' => [
                'max_width' => '800px',
                'background_color' => '#ffffff',
            ],
        ],
        'logo_grid' => [
            'label' => 'Logo Grid',
            'icon' => 'apps',
            'fields' => [
                'heading' => ['type' => 'translatable_text'],
                'subtitle' => ['type' => 'translatable_text'],
                'logos' => ['type' => 'card_list', 'required' => true],
                'cta_text' => ['type' => 'translatable_text'],
                'cta_link' => ['type' => 'text'],
            ],
            'config_defaults' => [
                'background_color' => '#1E2A22',
                'text_color' => '#ffffff',
                'columns' => 4,
                'logo_max_height' => 60,
                'grayscale' => false,
            ],
        ],
        'spacer' => [
            'label' => 'Spacer',
            'icon' => 'height',
            'fields' => [],
            'config_defaults' => [
                'height' => 48,
                'background_color' => 'transparent',
            ],
        ],
        'stats_counter' => [
            'label' => 'Stats Counter',
            'icon' => 'bar_chart',
            'fields' => [
                'heading'  => ['type' => 'translatable_text', 'required' => true],
                'subtitle' => ['type' => 'translatable_text'],
                'stats'    => ['type' => 'stat_list', 'required' => true],
                // stat_list items support: value (string), label (translatable), suffix (translatable)
            ],
            'config_defaults' => [
                'background_color' => '#2B3D2F',
                'text_color'       => '#ffffff',
                'accent_color'     => '#C9A94E',
                'columns'          => 3,
                'padding_y'        => 'lg',
            ],
        ],
        'books_grid' => [
            'label' => 'Books / Publications',
            'icon' => 'menu_book',
            'fields' => [
                'heading'   => ['type' => 'translatable_text', 'required' => true],
                'subtitle'  => ['type' => 'translatable_text'],
                'max_items' => ['type' => 'number', 'default' => 8],
            ],
            'config_defaults' => [
                'background_color' => '#1E2A22',
                'text_color'       => '#ffffff',
                'columns'          => 4,
                'show_description' => false,
                'padding_y'        => 'xl',
            ],
        ],
        'scholar_cards' => [
            'label' => 'Scholar / Teacher Cards',
            'icon' => 'school',
            'fields' => [
                'heading'     => ['type' => 'translatable_text', 'required' => true],
                'description' => ['type' => 'translatable_richtext'],
            ],
            'config_defaults' => [
                'background_color' => '#F5F0E8',
                'text_color'       => '#2B3D2F',
                'accent_color'     => '#2B3D2F',
                'padding_y'        => 'xl',
            ],
        ],
    ];

    public static function all(): array
    {
        return static::$blocks;
    }

    public static function get(string $type): ?array
    {
        return static::$blocks[$type] ?? null;
    }

    public static function types(): array
    {
        return array_keys(static::$blocks);
    }

    public static function labels(): array
    {
        $labels = [];
        foreach (static::$blocks as $type => $definition) {
            $labels[$type] = $definition['label'];
        }
        return $labels;
    }

    public static function defaultContent(string $type): array
    {
        $block = static::get($type);
        if (!$block) {
            return [];
        }

        $defaults = [];
        foreach ($block['fields'] as $field => $meta) {
            if (isset($meta['default'])) {
                $defaults[$field] = $meta['default'];
            } elseif ($meta['type'] === 'translatable_text' || $meta['type'] === 'translatable_richtext') {
                $defaults[$field] = [];
            } elseif (in_array($meta['type'], ['translatable_list', 'card_list', 'stat_list'])) {
                $defaults[$field] = [];
            } elseif ($meta['type'] === 'boolean') {
                $defaults[$field] = $meta['default'] ?? false;
            } elseif ($meta['type'] === 'number') {
                $defaults[$field] = $meta['default'] ?? 0;
            } else {
                $defaults[$field] = $meta['default'] ?? null;
            }
        }
        return $defaults;
    }

    public static function defaultConfig(string $type): array
    {
        return static::get($type)['config_defaults'] ?? [];
    }

    public static function validationRules(string $type): array
    {
        $block = static::get($type);
        if (!$block) {
            return [];
        }

        $rules = [];
        foreach ($block['fields'] as $field => $meta) {
            $prefix = "content.{$field}";
            $isRequired = $meta['required'] ?? false;

            switch ($meta['type']) {
                case 'translatable_text':
                case 'translatable_richtext':
                    $rules[$prefix] = $isRequired ? 'required|array' : 'nullable|array';
                    $rules["{$prefix}.*"] = 'nullable|string';
                    break;
                case 'text':
                    // Apply URL validation to fields conventionally named as links.
                    if (str_ends_with($field, '_link') || str_ends_with($field, '_url')) {
                        $rules[$prefix] = ($isRequired ? 'required' : 'nullable')
                            . '|string|max:2048|regex:/^(https?:\/\/|\/)/';
                    } else {
                        $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|string|max:2048';
                    }
                    break;
                case 'number':
                    // max_items is clamped to 50 to prevent unbounded DB queries.
                    if ($field === 'max_items') {
                        $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|integer|min:1|max:50';
                    } else {
                        $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|numeric|min:0';
                    }
                    break;
                case 'boolean':
                    $rules[$prefix] = 'boolean';
                    break;
                case 'select':
                    $options = implode(',', $meta['options'] ?? []);
                    $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . "|in:{$options}";
                    break;
                case 'relation':
                    $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|integer|min:1';
                    break;
                case 'translatable_list':
                    $rules[$prefix] = 'nullable|array';
                    break;
                case 'card_list':
                    $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|array';
                    // Validate each card item's key fields to prevent injection via nested data.
                    $rules["{$prefix}.*.heading"]   = 'nullable|array';
                    $rules["{$prefix}.*.heading.*"] = 'nullable|string|max:500';
                    $rules["{$prefix}.*.text"]      = 'nullable|array';
                    $rules["{$prefix}.*.text.*"]    = 'nullable|string|max:500';
                    $rules["{$prefix}.*.image_url"] = ['nullable', 'string', 'max:2048', 'regex:/^(https?:\/\/|\/)/'];
                    $rules["{$prefix}.*.link"]      = ['nullable', 'string', 'max:2048', 'regex:/^(https?:\/\/|\/)/'];
                    break;
                case 'stat_list':
                    $rules[$prefix] = ($isRequired ? 'required' : 'nullable') . '|array';
                    $rules["{$prefix}.*.value"]    = 'nullable|string|max:100';
                    $rules["{$prefix}.*.label"]    = 'nullable|array';
                    $rules["{$prefix}.*.label.*"]  = 'nullable|string|max:200';
                    $rules["{$prefix}.*.suffix"]   = 'nullable|array';
                    $rules["{$prefix}.*.suffix.*"] = 'nullable|string|max:50';
                    break;
            }
        }
        return $rules;
    }
}
