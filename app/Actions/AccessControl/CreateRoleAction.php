<?php

namespace App\Actions\AccessControl;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRoleAction
{
    /**
     * Create a new web guard role and assign its permissions.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Role
    {
        return DB::transaction(function () use ($data): Role {
            $role = Role::query()->create([
                'name' => $data['name'],
                'guard_name' => 'web',
            ]);

            $permissionIds = is_array($data['permissions'] ?? null) ? $data['permissions'] : [];
            $role->syncPermissions(Permission::query()->where('guard_name', 'web')->whereIn('id', $permissionIds)->get());

            return $role;
        });
    }
}
