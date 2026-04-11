<?php

namespace App\Http\Requests\Admin;

use App\Services\BlockRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePageBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('manage pages');
    }

    public function rules(): array
    {
        $blockType = $this->input('block_type', $this->route('block')?->block_type);
        $validTypes = implode(',', BlockRegistry::types());

        $baseRules = [
            'block_type' => "required|string|in:{$validTypes}",
            'content' => 'nullable|array',
            'display_order' => 'required|integer|min:0',
            'status' => 'required|in:published,draft',
            'config' => 'nullable|array',
            'config.background_color' => 'nullable|string|max:50',
            'config.text_color' => 'nullable|string|max:50',
            'config.padding_y' => 'nullable|string|in:none,sm,md,lg,xl',
            'config.full_width' => 'nullable|boolean',
            'config.css_class' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z0-9_\- ]*$/'],
        ];

        if ($blockType) {
            $blockRules = BlockRegistry::validationRules($blockType);
            $baseRules = array_merge($baseRules, $blockRules);
        }

        return $baseRules;
    }
}
