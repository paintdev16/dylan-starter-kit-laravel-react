<?php

namespace App\Http\Controllers\Web\AccessControl;

use App\Actions\AccessControl\CreateRoleAction;
use App\Actions\AccessControl\UpdateRoleAction;
use App\Concerns\RendersAccessControlPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccessControl\StoreRoleRequest;
use App\Http\Requests\AccessControl\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    use RendersAccessControlPage;

    public function index(Request $request): Response
    {
        return $this->renderAccessControlPage($request, 'roles', [
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->with('permissions:id,name')
                ->orderBy('name')
                ->get(['id', 'name']),
            'permissions' => Permission::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name', 'display_name', 'description']),
        ]);
    }

    public function store(StoreRoleRequest $request, CreateRoleAction $createRole): RedirectResponse
    {
        $createRole->handle($request->validated());

        return back();
    }

    public function update(UpdateRoleRequest $request, Role $role, UpdateRoleAction $updateRole): RedirectResponse
    {
        $updateRole->handle($role, $request->validated());

        return back();
    }

    public function destroy(Role $role): RedirectResponse
    {
        Gate::authorize('delete', $role);

        $role->delete();

        return back();
    }
}
