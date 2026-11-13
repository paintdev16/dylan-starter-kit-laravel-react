<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AccessControlSeeder::class);

        $user = User::query()->firstOrCreate(['email' => 'paint@gmail.com'], [
            'name' => 'Paint',
            'password' => '123456789',
        ]);

        if ($user->wasRecentlyCreated) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $user->assignRole('super-admin');
    }
}
