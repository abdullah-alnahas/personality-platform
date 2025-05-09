<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Setting; // Import Setting model
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("manage settings");
    }

    public function rules(): array
    {
        $rules = [];
        $settings = Setting::all()->keyBy("key"); // Get all defined settings

        foreach ($this->all() as $key => $value) {
            if ($key === "_method" || $key === "_token") {
                continue;
            }

            $settingModel = $settings->get($key);

            if ($settingModel) {
                switch ($settingModel->type) {
                    case "text":
                    case "textarea":
                    case "richtext": // Treat richtext as textarea for basic validation
                        $rules[$key] = ["nullable", "array"];
                        foreach (config("translatable.locales") as $locale) {
                            // Allow empty string, but if array key exists, it should be string
                            $rules["{$key}.{$locale}"] = [
                                "nullable",
                                "string",
                                "max:65535",
                            ];
                        }
                        break;
                    case "email":
                        // Assuming email is not translatable and stored directly or under 'en'
                        $rules[$key] = ["nullable", "array"]; // Keep as array if value is JSON in DB
                        $rules["{$key}." . config("app.locale")] = [
                            "nullable",
                            "email",
                            "max:255",
                        ];
                        break;
                    case "number":
                        $rules[$key] = ["nullable", "array"]; // Keep as array if value is JSON in DB
                        $rules["{$key}." . config("app.locale")] = [
                            "nullable",
                            "integer",
                            "min:0",
                        ];
                        break;
                    case "boolean":
                        // Booleans might be sent as true/false directly, not as an array
                        $rules[$key] = ["nullable", "boolean"];
                        break;
                    default:
                        // Default for unknown types: allow string or array (for translatable)
                        $rules[$key] = ["nullable"];
                        break;
                }
            } else {
                // If the key from request is not in settings table, treat as potentially new translatable text
                // Or you might want to forbid unknown keys
                $rules[$key] = ["nullable", "array"];
                foreach (config("translatable.locales") as $locale) {
                    $rules["{$key}.{$locale}"] = [
                        "nullable",
                        "string",
                        "max:65535",
                    ];
                }
            }
        }
        return $rules;
    }

    protected function prepareForValidation(): void
    {
        $settings = Setting::all()->keyBy("key");
        $data = $this->all();

        foreach ($data as $key => $value) {
            if ($key === "_method" || $key === "_token") {
                continue;
            }
            $settingModel = $settings->get($key);
            if ($settingModel && $settingModel->type === "boolean") {
                $this->merge([$key => $this->boolean($key)]);
            }
        }
    }

    public function attributes(): array
    {
        $attributes = [];
        foreach ($this->all() as $key => $value) {
            if ($key === "_method" || $key === "_token") {
                continue;
            }
            foreach (config("translatable.locales") as $locale) {
                $attributes["{$key}.{$locale}"] =
                    str_replace("_", " ", $key) . " ({$locale})";
            }
        }
        return $attributes;
    }
}
