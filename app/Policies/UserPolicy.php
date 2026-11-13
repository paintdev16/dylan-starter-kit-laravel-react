<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Role;

class UserPolicy
{
    /**
     * Determine whether the actor can create a user with the requested roles.
     */
    public function create(User $actor, mixed $roleIds = []): bool
    {
        return $actor->can('manage access') && $this->canAssignRoles($actor, $roleIds);
    }

    /**
     * Determine whether the actor can update the target user and assign the requested roles.
     */
    public function update(User $actor, User $target, mixed $roleIds = []): Response|bool
    {
        if (! $actor->can('manage access')) {
            return false;
        }

        if ($actor->is($target)) {
            return Response::deny('No puedes modificar tus propios roles aquí.');
        }

        if (! $actor->hasRole('super-admin') && $target->hasRole('super-admin')) {
            return false;
        }

        return $this->canAssignRoles($actor, $roleIds);
    }

    /**
     * Determine whether the actor can delete the target user.
     */
    public function delete(User $actor, User $target): Response|bool
    {
        if (! $actor->can('manage access')) {
            return false;
        }

        if ($actor->is($target)) {
            return Response::deny('No puedes eliminar tu propia cuenta aquí.');
        }

        return $actor->hasRole('super-admin') || ! $target->hasRole('super-admin');
    }

    /**
     * Determine whether the actor may assign all requested role identifiers.
     */
    private function canAssignRoles(User $actor, mixed $roleIds): bool
    {
        if ($actor->hasRole('super-admin') || ! is_array($roleIds)) {
            return true;
        }

        $ids = array_values(array_filter(
            $roleIds,
            static fn (mixed $id): bool => is_int($id) || (is_string($id) && ctype_digit($id)),
        ));

        if ($ids === []) {
            return true;
        }

        return ! Role::query()
            ->where('guard_name', 'web')
            ->where('name', 'super-admin')
            ->whereIn('id', $ids)
            ->exists();
    }
}
