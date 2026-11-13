<?php

namespace App\Actions\AccessControl;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class CreateUserAction
{
    /**
     * Create a new user and assign their initial roles.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): User
    {
        Gate::authorize('create', [User::class, $data['roles'] ?? null]);

        return DB::transaction(function () use ($data): User {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $roleIds = is_array($data['roles'] ?? null) ? $data['roles'] : [];
            $user->syncRoles(Role::query()->where('guard_name', 'web')->whereIn('id', $roleIds)->get());

            return $user;
        });
    }
}
