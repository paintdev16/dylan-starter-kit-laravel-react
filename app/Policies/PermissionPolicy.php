<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    /**
     * Determine whether the actor can create a permission.
     */
    public function create(User $actor): bool
    {
        return $actor->can('manage.access');
    }

    /**
     * Determine whether the actor can update the given permission.
     */
    public function update(User $actor, Permission $permission, mixed $name = null): bool
    {
        if (! $actor->can('manage.access') || $permission->guard_name !== 'web') {
            return false;
        }

        if ($permission->name === 'manage.access' && is_string($name) && $name !== '' && $name !== 'manage.access') {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the actor can delete the given permission.
     */
    public function delete(User $actor, Permission $permission): bool
    {
        return $actor->can('manage.access')
            && $permission->guard_name === 'web'
            && $permission->name !== 'manage.access';
    }
}
