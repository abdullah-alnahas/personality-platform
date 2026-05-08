<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Minimum acceptable length for ADMIN_SEED_PASSWORD when supplied.
     */
    private const MIN_PASSWORD_LENGTH = 16;

    /**
     * Run the database seeds.
     *
     * Behaviour:
     *  - testing env: uses a deterministic strong password so feature tests can log in
     *  - production env: requires ADMIN_SEED_PASSWORD (>=16 chars); otherwise skips
     *  - other envs: requires ADMIN_SEED_PASSWORD if set (>=16 chars), or generates a
     *    one-time random password and prints it once for the operator to record.
     *
     * The previous fallback to the literal string "password" has been removed.
     */
    public function run(): void
    {
        $env = app()->environment();
        $explicitPassword = env('ADMIN_SEED_PASSWORD');

        if ($env === 'production') {
            if (! $explicitPassword) {
                $this->command?->warn(
                    'Skipping AdminUserSeeder in production (set ADMIN_SEED_PASSWORD env var to a 16+ char value to enable).'
                );
                return;
            }
            $this->assertStrongPassword($explicitPassword);
            $password = $explicitPassword;
        } elseif ($env === 'testing') {
            // Deterministic password for tests; tests opt-in via this constant.
            $password = $explicitPassword ?: 'TestingAdminPass-2026!';
        } else {
            if ($explicitPassword) {
                $this->assertStrongPassword($explicitPassword);
                $password = $explicitPassword;
            } else {
                $password = Str::password(24);
                $this->command?->warn(
                    "Generated admin password: {$password}\n" .
                    'Record it now — it will not be shown again. Set ADMIN_SEED_PASSWORD to override on subsequent runs.'
                );
            }
        }

        $email = env('ADMIN_SEED_EMAIL');
        if (! $email) {
            $this->command?->warn(
                'ADMIN_SEED_EMAIL not set; skipping AdminUserSeeder (refusing to default to admin@example.com).'
            );
            return;
        }

        $adminUser = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_SEED_NAME', 'Admin User'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        if (class_exists(\Spatie\Permission\Models\Role::class)) {
            $superAdminRole = \Spatie\Permission\Models\Role::where('name', 'Super Admin')->first();
            if ($superAdminRole) {
                $adminUser->assignRole($superAdminRole);
            }
        }
    }

    private function assertStrongPassword(string $password): void
    {
        if (mb_strlen($password) < self::MIN_PASSWORD_LENGTH) {
            throw new \RuntimeException(
                'ADMIN_SEED_PASSWORD must be at least ' . self::MIN_PASSWORD_LENGTH . ' characters.'
            );
        }
    }
}
