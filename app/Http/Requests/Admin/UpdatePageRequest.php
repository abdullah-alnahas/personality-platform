<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('manage pages');
    }

    public function rules(): array
    {
        $pageId = $this->route('page')?->id;

        return [
            'title' => 'required|array',
            'title.en' => 'required|string|max:255',
            'title.*' => 'nullable|string|max:255',
            'slug' => "nullable|string|max:255|unique:pages,slug,{$pageId}",
            'status' => 'required|in:published,draft',
            'is_homepage' => 'boolean',
            'layout' => 'nullable|in:default,full-width,landing',
            'meta_fields' => 'nullable|array',
            'meta_fields.*' => 'nullable|string',
        ];
    }
}
