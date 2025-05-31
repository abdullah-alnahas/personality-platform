<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define Permissions
        $permissions = [
            "view admin",
            "manage settings",
            "manage languages", // Was added in a previous step
            "manage navigation",
            "manage categories",
            "manage content items",
            "manage social accounts",
            "manage subscribers",
            "manage contact submissions",
            "manage media",
            "manage users",
            "manage roles",
            "manage quotes", // Ensure this appears only once
            // "manage quotes", // This was the duplicate, now removed
        ];

        foreach ($permissions as $permissionName) {
            // Changed variable name for clarity
            Permission::findOrCreate($permissionName, "web"); // Specify guard 'web'
        }

        // Define Roles and Assign Permissions
        // Ensure 'manage quotes' is correctly assigned to Editor if intended
        $editorPermissions = [
            "view admin",
            "manage categories",
            "manage content items",
            "manage media",
            "manage quotes", // Ensure it's here if editors should manage quotes
        ];

        $editorRole = Role::findOrCreate("Editor", "web");
        $editorRole->syncPermissions($editorPermissions);

        $superAdminRole = Role::findOrCreate("Super Admin", "web");
        // Super Admin gets all permissions via Gate::before check in AuthServiceProvider,
        // so no explicit permission assignment needed here for $superAdminRole.
    }
}
