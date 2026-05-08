<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'ar', 'name' => 'Arabic',  'native_name' => 'العربية', 'is_active' => true, 'is_rtl' => true],
            ['code' => 'en', 'name' => 'English', 'native_name' => 'English', 'is_active' => true, 'is_rtl' => false],
            ['code' => 'tr', 'name' => 'Turkish', 'native_name' => 'Türkçe',  'is_active' => true, 'is_rtl' => false],
        ];

        foreach ($languages as $lang) {
            Language::updateOrCreate(['code' => $lang['code']], $lang);
        }
    }
}
