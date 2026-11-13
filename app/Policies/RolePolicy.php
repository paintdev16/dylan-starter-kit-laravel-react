<?php

namespace App\Policies;

use App\Concerns\NormalizesAccessControlIds;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    use NormalizesAccessControlIds;

    /**
     * Determine whether the actor can create a role with the requested permissions.
     */
    public function create(User $actor, mixed $permissionIds = []): bool
    {
        return $actor->can('manage.access') && $this->canAssignPermissions($actor, $permissionIds);
    }

    /**
     * Determine whether the actor can update the given role and its permissions.
     */
    public function update(User $actor, Role $role, mixed $name = null, mixed $permissionIds = []): Response|bool
    {
        if (! $actor->can('manage.access') || $role->guard_name !== 'web' || $role->name === 'super-admin') {
            return false;
        }

        if ($actor->hasRole($role)) {
            return Response::deny('No puedes modificar un rol que tienes asignado.');
        }

        if (in_array($role->name, ['admin', 'client'], true) && is_string($name) && $name !== '' && $name !== $role->name) {
            return false;
        }

        return $this->canAssignPermissions($actor, $permissionIds);
    }

    /**
     * Determine whether the actor can delete the given role.
     */
    public function delete(User $actor, Role $role): Response|bool
    {
        if (
            ! $actor->can('manage.access')
            || $role->guard_name !== 'web'
            || in_array($role->name, ['super-admin', 'admin', 'client'], true)
        ) {
            return false;
        }

        if ($actor->hasRole($role)) {
            return Response::deny('No puedes eliminar un rol que tienes asignado.');
        }

        return true;
    }

    /**
     * Ensure the actor only assigns valid web permissions that they are authorized to use.
     */
    public function canAssignPermissions(User $actor, mixed $permissionIds): bool
    {
        $ids = $this->normalizeIds($permissionIds);

        if ($ids === null) {
            return false;
        }

        if ($ids === []) {
            return true;
        }

        $permissions = Permission::query()
            ->where('guard_name', 'web')
            ->whereIn('id', $ids)
            ->get(['id', 'name']);

        if ($permissions->count() !== count($ids)) {
            return false;
        }

        if ($actor->hasRole('super-admin')) {
            return true;
        }

        return $permissions->every(
            static fn (Permission $permission): bool => $actor->can($permission->name),
        );
    }
}
