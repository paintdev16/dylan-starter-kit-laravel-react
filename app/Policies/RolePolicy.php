<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    /**
     * Determine whether the actor can create a role.
     */
    public function create(User $actor): bool
    {
        return $actor->can('manage access');
    }

    /**
     * Determine whether the actor can update the given role.
     */
    public function update(User $actor, Role $role, mixed $name = null): Response|bool
    {
        if (! $actor->can('manage access') || $role->guard_name !== 'web' || $role->name === 'super-admin') {
            return false;
        }

        if ($actor->hasRole($role)) {
            return Response::deny('No puedes modificar un rol que tienes asignado.');
        }

        if (in_array($role->name, ['admin', 'client'], true) && is_string($name) && $name !== '' && $name !== $role->name) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the actor can delete the given role.
     */
    public function delete(User $actor, Role $role): Response|bool
    {
        if (
            ! $actor->can('manage access')
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
}
