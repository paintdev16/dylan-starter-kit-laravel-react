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

        $permission = Permission::findOrCreate('manage access', 'web');
        if (! $permission->display_name) {
            $permission->update(['display_name' => 'Administrar accesos']);
        }
        if (! $permission->description) {
            $permission->update(['description' => 'Permite administrar usuarios, roles y permisos.']);
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
            $entry = Permission::findOrCreate($name, 'web');
            $entry->update([
                'display_name' => $entry->display_name ?: $label,
                'description' => $entry->description ?: $description,
            ]);
        }
    }
}
