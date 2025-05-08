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
            'view admin',
            'manage settings',
            'manage languages',
            'manage navigation',
            'manage categories',
            'manage content items',
            'manage quotes',
            'manage social accounts',
            'manage subscribers',
            'manage contact submissions',
            'manage media',
            'manage users',
            'manage roles',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web'); // Specify guard 'web'
        }

        // Define Roles and Assign Permissions
        $editorPermissions = [
            'view admin',
            'manage categories',
            'manage content items',
            'manage quotes',
            'manage media',
        ];

        $editorRole = Role::findOrCreate('Editor', 'web');
        $editorRole->syncPermissions($editorPermissions);


        $superAdminRole = Role::findOrCreate('Super Admin', 'web');
        // Super Admin gets all permissions (using a Gate check later is more flexible)
        // For explicit assignment: $superAdminRole->syncPermissions(Permission::all());
        // We will rely on the Gate::before check for Super Admin for simplicity now.

         // Create a basic Member role (example, might not be needed now)
         // Role::findOrCreate('Member', 'web');
    }
}
