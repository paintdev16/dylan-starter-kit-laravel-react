<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Exists;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules\Unique;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

trait AccessControlValidationRules
{
    use ProfileValidationRules;

    /**
     * Get the validation rules for creating or updating an access control user.
     *
     * @return array<string, array<int, Exists|Password|Unique|ValidationRule|array<mixed>|string>>
     */
    protected function userRules(?User $user = null, bool $includePassword = false): array
    {
        $rules = [
            ...$this->profileRules($user?->id),
            'roles' => ['present', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ];

        if ($includePassword) {
            $rules['password'] = ['required', 'string', Password::default()];
        }

        return $rules;
    }

    /**
     * Get the validation rules for creating or updating a web guard role.
     *
     * @return array<string, array<int, Exists|Unique|ValidationRule|array<mixed>|string>>
     */
    protected function roleRules(?Role $role = null): array
    {
        $uniqueRule = Rule::unique('roles')->where('guard_name', 'web');

        if ($role !== null) {
            $uniqueRule->ignore($role->id);
        }

        return [
            'name' => ['required', 'string', 'max:255', $uniqueRule],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['integer', Rule::exists('permissions', 'id')->where('guard_name', 'web')],
        ];
    }

    /**
     * Get the validation rules for creating or updating a web guard permission.
     *
     * @return array<string, array<int, Unique|ValidationRule|array<mixed>|string>>
     */
    protected function permissionRules(?Permission $permission = null): array
    {
        $uniqueRule = Rule::unique('permissions')->where('guard_name', 'web');

        if ($permission !== null) {
            $uniqueRule->ignore($permission->id);
        }

        return [
            'name' => ['required', 'string', 'max:255', $uniqueRule],
            'display_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
