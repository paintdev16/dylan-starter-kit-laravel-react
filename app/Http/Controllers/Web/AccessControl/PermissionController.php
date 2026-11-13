<?php

namespace App\Http\Controllers\Web\AccessControl;

use App\Concerns\RendersAccessControlPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccessControl\StorePermissionRequest;
use App\Http\Requests\AccessControl\UpdatePermissionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    use RendersAccessControlPage;

    public function index(Request $request): Response
    {
        return $this->renderAccessControlPage($request, 'permissions', [
            'permissions' => Permission::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name', 'display_name', 'description']),
        ]);
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Permission::query()->create([
            'name' => $data['name'],
            'display_name' => $data['display_name'] ?? null,
            'description' => $data['description'] ?? null,
            'guard_name' => 'web',
        ]);

        return back();
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update($request->validated());

        return back();
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        Gate::authorize('delete', $permission);

        $permission->delete();

        return back();
    }
}
