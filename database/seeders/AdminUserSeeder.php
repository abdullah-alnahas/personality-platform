<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment('production') && !env('ADMIN_SEED_PASSWORD')) {
            $this->command?->warn('Skipping AdminUserSeeder in production (set ADMIN_SEED_PASSWORD env var to override).');
            return;
        }

        $adminUser = User::firstOrCreate(
            ['email' => env('ADMIN_SEED_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_SEED_NAME', 'Admin User'),
                'password' => Hash::make(env('ADMIN_SEED_PASSWORD', 'password')),
                'email_verified_at' => now(),
            ]
        );

        // Assign Super Admin Role if it exists
        if (class_exists(\Spatie\Permission\Models\Role::class)) {
             $superAdminRole = \Spatie\Permission\Models\Role::where('name', 'Super Admin')->first();
             if ($superAdminRole) {
                 $adminUser->assignRole($superAdminRole);
             }
        }
    }
}
