<?php

namespace App\Models;

use App\Services\BlockRegistry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_id',
        'block_type',
        'content',
        'display_order',
        'status',
        'config',
        'scheduled_at',
    ];

    protected $casts = [
        'content' => 'array',
        'config' => 'array',
        'display_order' => 'integer',
        'scheduled_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (PageBlock $block): void {
            $block->sanitizeRichtextFields();
        });
    }

    /**
     * Sanitize richtext fields in the content array using mews/purifier.
     *
     * Looks up the block type in BlockRegistry to find fields with type
     * 'translatable_richtext', then runs clean() on each locale value.
     */
    protected function sanitizeRichtextFields(): void
    {
        $blockDef = BlockRegistry::get($this->block_type);

        if ($blockDef === null) {
            return;
        }

        $content = $this->content;

        if (!is_array($content)) {
            return;
        }

        $changed = false;

        foreach ($blockDef['fields'] as $fieldName => $meta) {
            if ($meta['type'] !== 'translatable_richtext') {
                continue;
            }

            if (!isset($content[$fieldName]) || !is_array($content[$fieldName])) {
                continue;
            }

            foreach ($content[$fieldName] as $locale => $htmlContent) {
                if (is_string($htmlContent)) {
                    $content[$fieldName][$locale] = clean($htmlContent);
                    $changed = true;
                }
            }
        }

        if ($changed) {
            $this->attributes['content'] = json_encode($content);
        }
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
