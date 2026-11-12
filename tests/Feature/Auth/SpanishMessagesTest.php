<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('authentication errors are shown in Spanish', function () {
    app()->setLocale('es');
    $user = User::factory()->create();

    $this->from(route('login'))->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'incorrecta',
    ])->assertSessionHasErrors(['email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.']);
});

test('password recovery confirmation is shown in Spanish', function () {
    app()->setLocale('es');
    Notification::fake();
    $user = User::factory()->create();

    $this->from(route('password.request'))->post(route('password.email'), ['email' => $user->email])
        ->assertSessionHas('status', 'Te enviamos el enlace para restablecer tu contraseña.');
});
