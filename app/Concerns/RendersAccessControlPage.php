<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

trait RendersAccessControlPage
{
    /**
     * Render the shared access control Inertia page for the active section.
     *
     * @param  array<string, mixed>  $props
     */
    protected function renderAccessControlPage(Request $request, string $section, array $props = []): Response
    {
        /** @var User $actor */
        $actor = $request->user();

        return Inertia::render('access-control/index', [
            'section' => $section,
            'users' => [],
            'roles' => [],
            'permissions' => [],
            'assignedRoleIds' => $actor->roles->pluck('id'),
            'isSuperAdmin' => $actor->hasRole('super-admin'),
            ...$props,
        ]);
    }
}
