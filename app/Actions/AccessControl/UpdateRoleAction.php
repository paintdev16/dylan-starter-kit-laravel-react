<?php

namespace App\Actions\AccessControl;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRoleAction
{
    /**
     * Update an existing role and sync its permissions.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(Role $role, array $data): Role
    {
        Gate::authorize('update', [$role, $data['name'] ?? null, $data['permissions'] ?? null]);

        return DB::transaction(function () use ($role, $data): Role {
            $role->update([
                'name' => $data['name'],
            ]);

            $permissionIds = is_array($data['permissions'] ?? null) ? $data['permissions'] : [];
            $role->syncPermissions(Permission::query()->where('guard_name', 'web')->whereIn('id', $permissionIds)->get());

            return $role;
        });
    }
}
