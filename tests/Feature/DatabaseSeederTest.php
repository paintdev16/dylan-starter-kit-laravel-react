<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Hash;

test('database seeder assigns super admin to the initial user without resetting an existing account', function () {
    $user = User::factory()->create(['email' => 'paint@gmail.com', 'name' => 'Nombre existente', 'password' => 'otra-contraseña']);
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    expect(User::where('email', 'paint@gmail.com')->count())->toBe(1);
    expect($user->fresh()->hasRole('super-admin'))->toBeTrue();
    expect($user->fresh()->name)->toBe('Nombre existente');
    expect(Hash::check('otra-contraseña', $user->fresh()->password))->toBeTrue();
});

test('database seeder creates a verified super administrator when the account is absent', function () {
    $this->seed(DatabaseSeeder::class);

    $user = User::where('email', 'paint@gmail.com')->firstOrFail();
    expect($user->hasRole('super-admin'))->toBeTrue();
    expect($user->hasVerifiedEmail())->toBeTrue();
});
