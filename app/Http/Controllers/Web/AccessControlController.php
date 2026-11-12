<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessControlController extends Controller
{
    public function index(Request $request, string $section): Response
    {
        abort_unless(in_array($section, ['users', 'roles', 'permissions'], true), 404);

        return Inertia::render('access-control/index', [
            'section' => $section,
            'users' => $section === 'users' ? User::query()->with('roles:id,name')->orderBy('name')->get(['id', 'name', 'email']) : [],
            'roles' => Role::query()->where('guard_name', 'web')->with('permissions:id,name')->orderBy('name')->get(['id', 'name']),
            'permissions' => Permission::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name', 'display_name', 'description']),
            'assignedRoleIds' => $request->user()->roles->pluck('id'),
            'isSuperAdmin' => $request->user()->hasRole('super-admin'),
        ]);
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')],
            'password' => ['required', 'string', Password::default()],
            'roles' => ['present', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);
        $this->ensureCanAssignRoles($request, $data['roles']);
        DB::transaction(function () use ($data) {
            $user = User::create(collect($data)->only(['name', 'email', 'password'])->all());
            $user->syncRoles(Role::whereIn('id', $data['roles'])->get());
        });

        return back();
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'roles' => ['present', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);
        if ($request->user()->is($user)) {
            abort(403, 'No puedes modificar tus propios roles aquí.');
        }
        abort_if(! $request->user()->hasRole('super-admin') && $user->hasRole('super-admin'), 403);
        $this->ensureCanAssignRoles($request, $data['roles']);
        DB::transaction(function () use ($user, $data) {
            $user->fill(collect($data)->only(['name', 'email'])->all());
            if ($user->isDirty('email')) $user->email_verified_at = null;
            $user->save();
            $user->syncRoles(Role::whereIn('id', $data['roles'])->get());
        });

        return back();
    }

    public function deleteUser(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 403, 'No puedes eliminar tu propia cuenta aquí.');
        abort_if(! $request->user()->hasRole('super-admin') && $user->hasRole('super-admin'), 403);
        $user->delete();

        return back();
    }

    public function storeRole(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->where('guard_name', 'web')],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['integer', Rule::exists('permissions', 'id')->where('guard_name', 'web')],
        ]);
        DB::transaction(function () use ($data) {
            $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
            $role->syncPermissions(Permission::whereIn('id', $data['permissions'])->get());
        });

        return back();
    }

    public function updateRole(Request $request, Role $role): RedirectResponse
    {
        abort_unless($role->guard_name === 'web' && $role->name !== 'super-admin', 403);
        abort_if($request->user()->hasRole($role), 403, 'No puedes modificar un rol que tienes asignado.');
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->where('guard_name', 'web')->ignore($role->id)],
            'permissions' => ['present', 'array'],
            'permissions.*' => ['integer', Rule::exists('permissions', 'id')->where('guard_name', 'web')],
        ]);
        abort_if(in_array($role->name, ['admin', 'client'], true) && $data['name'] !== $role->name, 403);
        DB::transaction(function () use ($role, $data) {
            $role->update(['name' => $data['name']]);
            $role->syncPermissions(Permission::whereIn('id', $data['permissions'])->get());
        });

        return back();
    }

    public function deleteRole(Request $request, Role $role): RedirectResponse
    {
        abort_unless($role->guard_name === 'web' && ! in_array($role->name, ['super-admin', 'admin', 'client'], true), 403);
        abort_if($request->user()->hasRole($role), 403, 'No puedes eliminar un rol que tienes asignado.');
        $role->delete();

        return back();
    }

    public function storePermission(Request $request): RedirectResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255', Rule::unique('permissions')->where('guard_name', 'web')], 'display_name' => ['nullable', 'string', 'max:255'], 'description' => ['nullable', 'string', 'max:1000']]);
        Permission::create(['name' => $data['name'], 'display_name' => $data['display_name'] ?? null, 'description' => $data['description'] ?? null, 'guard_name' => 'web']);

        return back();
    }

    public function updatePermission(Request $request, Permission $permission): RedirectResponse
    {
        abort_unless($permission->guard_name === 'web', 403);
        $data = $request->validate(['name' => ['required', 'string', 'max:255', Rule::unique('permissions')->where('guard_name', 'web')->ignore($permission->id)], 'display_name' => ['nullable', 'string', 'max:255'], 'description' => ['nullable', 'string', 'max:1000']]);
        abort_if($permission->name === 'manage access' && $data['name'] !== 'manage access', 403);
        $permission->update($data);

        return back();
    }

    public function deletePermission(Permission $permission): RedirectResponse
    {
        abort_unless($permission->guard_name === 'web' && $permission->name !== 'manage access', 403);
        $permission->delete();

        return back();
    }

    private function ensureCanAssignRoles(Request $request, array $roleIds): void
    {
        if (! $request->user()->hasRole('super-admin')) {
            abort_if(Role::query()->where('guard_name', 'web')->where('name', 'super-admin')->whereIn('id', $roleIds)->exists(), 403);
        }
    }
}
