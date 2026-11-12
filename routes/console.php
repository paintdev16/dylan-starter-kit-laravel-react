<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;
use Database\Seeders\AccessControlSeeder;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('access:grant-admin {email}', function () {
    $user = User::where('email', $this->argument('email'))->first();
    if (! $user) {
        $this->error('No se encontró el usuario.');

        return 1;
    }

    DB::transaction(function () use ($user) {
        app(AccessControlSeeder::class)->run();
        $user->assignRole('super-admin');
    });
    $this->info('Acceso de administrador asignado.');

    return 0;
})->purpose('Conceder acceso inicial de administrador a una cuenta existente');
