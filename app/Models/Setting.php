<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Setting extends Model
{
    use HasFactory, HasTranslations;

    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value', 'type', 'group'];

    public array $translatable = ['value'];

    protected $casts = [];

    /**
     * Sanitise the translatable `value` payload on every write path.
     *
     * Spatie's HasTranslations::setTranslation() calls this mutator once per
     * locale (signature: `($value, $locale)`) and then reads back the value
     * from `$this->attributes['value']`. We use that hand-off slot to apply
     * `clean()` on richtext values, so a tampered seeder, import job, or any
     * future code path that writes Setting::value cannot land raw script /
     * `on*` handlers in the database. Non-richtext values pass through.
     */
    public function setValueAttribute(mixed $value, ?string $locale = null): void
    {
        if (is_string($value) && ($this->attributes['type'] ?? null) === 'richtext') {
            $value = clean($value);
        }
        $this->attributes['value'] = $value;
    }
}
