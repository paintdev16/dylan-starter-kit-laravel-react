<?php

namespace App\Http\Controllers\Web\AccessControl;

use App\Actions\AccessControl\CreateUserAction;
use App\Actions\AccessControl\UpdateUserAction;
use App\Concerns\RendersAccessControlPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccessControl\StoreUserRequest;
use App\Http\Requests\AccessControl\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use RendersAccessControlPage;

    public function index(Request $request): Response
    {
        return $this->renderAccessControlPage($request, 'users', [
            'users' => User::query()->with('roles:id,name')->orderBy('name')->get(['id', 'name', 'email']),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreUserRequest $request, CreateUserAction $createUser): RedirectResponse
    {
        $createUser->handle($request->validated());

        return back();
    }

    public function update(UpdateUserRequest $request, User $user, UpdateUserAction $updateUser): RedirectResponse
    {
        $updateUser->handle($user, $request->validated());

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return back();
    }
}
