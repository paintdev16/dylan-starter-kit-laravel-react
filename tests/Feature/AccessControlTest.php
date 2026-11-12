<?php

use App\Models\User;
use Database\Seeders\AccessControlSeeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(AccessControlSeeder::class);
});

test('super administrator passes gate checks without individually assigned permissions', function () {
    $super = User::factory()->create();
    $super->assignRole('super-admin');
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $client = User::factory()->create();
    $client->assignRole('client');

    Gate::define('restricted-example', fn () => false);
    expect($super->can('restricted-example'))->toBeTrue();
    expect($super->can('users.create'))->toBeTrue();
    expect($admin->can('restricted-example'))->toBeFalse();
    expect($admin->can('users.create'))->toBeFalse();
    expect($client->can('restricted-example'))->toBeFalse();
    expect($client->can('manage access'))->toBeFalse();
});

test('access management requires its permission', function () {
    $this->get('/access-control/users')->assertRedirect(route('login'));
    $user = User::factory()->create();
    $this->actingAs($user)->get('/access-control/users')->assertForbidden();
    $this->actingAs($user)->post('/access-control/roles', ['name' => 'editor', 'permissions' => []])->assertForbidden();
});

test('administrator can view sections and manage users and roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    $permission = Permission::create(['name' => 'edit articles', 'guard_name' => 'web']);
    $this->actingAs($admin)->post('/access-control/roles', ['name' => 'editor', 'permissions' => [$permission->id]])->assertRedirect();
    $role = Role::where('name', 'editor')->firstOrFail();
    expect($role->hasPermissionTo($permission))->toBeTrue();
    $this->actingAs($admin)->post('/access-control/users', ['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'password123', 'roles' => [$role->id]])->assertRedirect();
    $user = User::where('email', 'ana@example.com')->firstOrFail();
    expect(Hash::check('password123', $user->password))->toBeTrue();
    expect($user->hasRole('editor'))->toBeTrue();
    $this->actingAs($admin)->get('/access-control/users')->assertOk()->assertInertia(fn (Assert $page) => $page->component('access-control')->where('section', 'users')->has('users', 2));
    $this->actingAs($admin)->get('/access-control/roles')->assertOk()->assertInertia(fn (Assert $page) => $page->where('section', 'roles'));
    $this->actingAs($admin)->get('/access-control/permissions')->assertOk()->assertInertia(fn (Assert $page) => $page->where('section', 'permissions'));
});

test('administrator cannot remove their access or protected records', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    $role = Role::findByName('super-admin');
    $permission = Permission::findByName('manage access');
    $this->actingAs($admin)->delete('/access-control/users/'.$admin->id)->assertForbidden();
    $this->actingAs($admin)->put('/access-control/users/'.$admin->id, ['name' => $admin->name, 'email' => $admin->email, 'roles' => []])->assertForbidden();
    $this->actingAs($admin)->delete('/access-control/roles/'.$role->id)->assertForbidden();
    $this->actingAs($admin)->delete('/access-control/permissions/'.$permission->id)->assertForbidden();
});

test('administrator can update and remove unprotected records', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    $user = User::factory()->create();
    $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
    $permission = Permission::create(['name' => 'view articles', 'guard_name' => 'web']);
    $this->actingAs($admin)->put('/access-control/users/'.$user->id, ['name' => 'Nombre nuevo', 'email' => $user->email, 'roles' => [$role->id]])->assertRedirect();
    expect($user->fresh()->hasRole('editor'))->toBeTrue();
    $this->actingAs($admin)->put('/access-control/roles/'.$role->id, ['name' => 'redactor', 'permissions' => [$permission->id]])->assertRedirect();
    expect($role->fresh()->hasPermissionTo($permission))->toBeTrue();
    $this->actingAs($admin)->put('/access-control/permissions/'.$permission->id, ['name' => 'read articles'])->assertRedirect();
    $this->actingAs($admin)->delete('/access-control/permissions/'.$permission->id)->assertRedirect();
    $this->actingAs($admin)->delete('/access-control/roles/'.$role->id)->assertRedirect();
    $this->actingAs($admin)->delete('/access-control/users/'.$user->id)->assertRedirect();
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('default roles exist and administrator cannot manage or assign super-admin', function () {
    expect(Role::findByName('admin')->hasPermissionTo('manage access'))->toBeTrue();
    expect(Role::findByName('client')->hasPermissionTo('manage access'))->toBeFalse();
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $super = User::factory()->create();
    $super->assignRole('super-admin');
    $role = Role::findByName('super-admin');
    $this->actingAs($admin)->post('/access-control/users', ['name' => 'Ana', 'email' => 'ana@example.com', 'password' => 'password123', 'roles' => [$role->id]])->assertForbidden();
    $this->actingAs($admin)->put('/access-control/users/'.$super->id, ['name' => $super->name, 'email' => $super->email, 'roles' => []])->assertForbidden();
    $this->actingAs($admin)->delete('/access-control/users/'.$super->id)->assertForbidden();
    $this->actingAs($admin)->delete('/access-control/roles/'.$role->id)->assertForbidden();
});

test('permission descriptions are saved and the built-in description can be edited', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    $this->actingAs($admin)->post('/access-control/permissions', ['name' => 'view orders', 'display_name' => 'Ver pedidos', 'description' => 'Permite consultar los pedidos.'])->assertRedirect();
    $permission = Permission::findByName('view orders');
    expect($permission->description)->toBe('Permite consultar los pedidos.');
    expect($permission->display_name)->toBe('Ver pedidos');
    $this->actingAs($admin)->put('/access-control/permissions/'.$permission->id, ['name' => 'view orders', 'description' => 'Permite ver pedidos.'])->assertRedirect();
    expect($permission->fresh()->description)->toBe('Permite ver pedidos.');
    $protected = Permission::findByName('manage access');
    $this->actingAs($admin)->put('/access-control/permissions/'.$protected->id, ['name' => 'manage access', 'description' => 'Administrar accesos.'])->assertRedirect();
    expect($protected->fresh()->description)->toBe('Administrar accesos.');
    $this->actingAs($admin)->put('/access-control/permissions/'.$protected->id, ['name' => 'otro', 'description' => 'x'])->assertForbidden();
});

test('the initial permission catalog has Spanish labels and preserves edits when reseeded', function () {
    $permission = Permission::findByName('users.view');
    expect($permission->display_name)->toBe('Ver usuarios');
    expect($permission->description)->toBe('Permite consultar los usuarios registrados.');
    $permission->update(['display_name' => 'Consultar usuarios']);
    $this->seed(AccessControlSeeder::class);
    expect($permission->fresh()->display_name)->toBe('Consultar usuarios');
    expect(Permission::whereIn('name', ['users.view', 'users.create', 'users.update', 'users.delete', 'roles.view', 'roles.create', 'permissions.view'])->count())->toBe(7);
});
