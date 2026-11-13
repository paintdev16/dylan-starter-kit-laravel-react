<?php

namespace App\Actions\AccessControl;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class UpdateUserAction
{
    /**
     * Update an existing user's details and sync their roles.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(User $user, array $data): User
    {
        Gate::authorize('update', [$user, $data['roles'] ?? null]);

        return DB::transaction(function () use ($user, $data): User {
            $user->fill([
                'name' => $data['name'],
                'email' => $data['email'],
            ]);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();

            $roleIds = is_array($data['roles'] ?? null) ? $data['roles'] : [];
            $user->syncRoles(Role::query()->where('guard_name', 'web')->whereIn('id', $roleIds)->get());

            return $user;
        });
    }
}
