<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AccessControlSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permission = Permission::query()->firstOrCreate([
            'name' => 'manage access',
            'guard_name' => 'web',
        ]);
        if (! $permission->getAttribute('display_name')) {
            $permission->update([
                'display_name' => 'Administrar accesos',
            ]);
        }

        if (! $permission->getAttribute('description')) {
            $permission->update([
                'description' => 'Permite administrar usuarios, roles y permisos.',
            ]);
        }
        $legacy = Role::where('name', 'administrador')->where('guard_name', 'web')->first();
        if ($legacy && ! Role::where('name', 'super-admin')->where('guard_name', 'web')->exists()) {
            $legacy->update(['name' => 'super-admin']);
        }

        Role::findOrCreate('super-admin', 'web')->givePermissionTo($permission);
        Role::findOrCreate('admin', 'web')->givePermissionTo($permission);
        Role::findOrCreate('client', 'web');

        $catalog = [
            'users.view' => ['Ver usuarios', 'Permite consultar los usuarios registrados.'],
            'users.create' => ['Crear usuarios', 'Permite registrar nuevos usuarios.'],
            'users.update' => ['Editar usuarios', 'Permite modificar los datos de los usuarios.'],
            'users.delete' => ['Eliminar usuarios', 'Permite eliminar usuarios.'],
            'roles.view' => ['Ver roles', 'Permite consultar los roles del sistema.'],
            'roles.create' => ['Crear roles', 'Permite registrar nuevos roles.'],
            'permissions.view' => ['Ver permisos', 'Permite consultar los permisos disponibles.'],
        ];

        foreach ($catalog as $name => [$label, $description]) {
            $entry = Permission::query()->firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
            $entry->update([
                'display_name' => $entry->getAttribute('display_name') ?: $label,
                'description' => $entry->getAttribute('description') ?: $description,
            ]);
        }
    }
}
