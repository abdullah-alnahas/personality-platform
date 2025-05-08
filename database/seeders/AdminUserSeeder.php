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
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'), // Change this in production!
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
