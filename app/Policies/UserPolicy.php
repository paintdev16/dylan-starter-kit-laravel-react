<?php

namespace App\Policies;

use App\Concerns\NormalizesAccessControlIds;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Role;

class UserPolicy
{
    use NormalizesAccessControlIds;

    /**
     * Determine whether the actor can create a user with the requested roles.
     */
    public function create(User $actor, mixed $roleIds = []): bool
    {
        return $actor->can('manage.access') && $this->canAssignRoles($actor, $roleIds);
    }

    /**
     * Determine whether the actor can update the target user and assign the requested roles.
     */
    public function update(User $actor, User $target, mixed $roleIds = []): Response|bool
    {
        if (! $actor->can('manage.access')) {
            return false;
        }

        if (! $this->canAssignRoles($actor, $roleIds)) {
            return false;
        }

        if (! $actor->hasRole('super-admin') && $target->hasRole('super-admin')) {
            return false;
        }

        if (! $this->preservesSuperAdmin($target, $roleIds)) {
            return Response::deny('El sistema debe conservar al menos un superadministrador.');
        }

        if ($actor->is($target)) {
            return Response::deny('No puedes modificar tus propios roles aquí.');
        }

        return true;
    }

    /**
     * Determine whether the actor can delete the target user.
     */
    public function delete(User $actor, User $target): Response|bool
    {
        if (! $actor->can('manage.access')) {
            return false;
        }

        if (! $actor->hasRole('super-admin') && $target->hasRole('super-admin')) {
            return false;
        }

        if ($this->isLastSuperAdmin($target)) {
            return Response::deny('El sistema debe conservar al menos un superadministrador.');
        }

        if ($actor->is($target)) {
            return Response::deny('No puedes eliminar tu propia cuenta aquí.');
        }

        return true;
    }

    /**
     * Determine whether the actor may assign all requested role identifiers.
     */
    public function canAssignRoles(User $actor, mixed $roleIds): bool
    {
        $ids = $this->normalizeIds($roleIds);

        if ($ids === null) {
            return false;
        }

        if ($ids === []) {
            return true;
        }

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->whereIn('id', $ids)
            ->get(['id', 'name']);

        if ($roles->count() !== count($ids)) {
            return false;
        }

        return $actor->hasRole('super-admin') || ! $roles->contains('name', 'super-admin');
    }

    /**
     * Ensure that updating the target user does not leave the system without a super-admin.
     */
    private function preservesSuperAdmin(User $target, mixed $roleIds): bool
    {
        if (! $this->isLastSuperAdmin($target)) {
            return true;
        }

        $ids = $this->normalizeIds($roleIds);

        if ($ids === null || $ids === []) {
            return false;
        }

        return Role::query()
            ->where('guard_name', 'web')
            ->where('name', 'super-admin')
            ->whereIn('id', $ids)
            ->exists();
    }

    /**
     * Determine whether the target user is the only super-admin in the system.
     */
    private function isLastSuperAdmin(User $target): bool
    {
        return $target->hasRole('super-admin')
            && ! User::role('super-admin', 'web')->whereKeyNot($target->getKey())->exists();
    }
}
