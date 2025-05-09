<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // If you have User Factories, uncomment this
        // \App\Models\User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
            AdminUserSeeder::class,
            HomepageSectionSeeder::class,
            SettingsSeeder::class,
        ]);
    }
}
