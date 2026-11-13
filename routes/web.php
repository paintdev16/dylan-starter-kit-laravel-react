<?php

use App\Http\Controllers\Web\AccessControl\PermissionController;
use App\Http\Controllers\Web\AccessControl\RoleController;
use App\Http\Controllers\Web\AccessControl\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::middleware('can:manage access')->group(function () {
        Route::redirect('access-control', '/access-control/users')->name('access-control');

        Route::prefix('access-control')->name('access-control.')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

            Route::get('roles', [RoleController::class, 'index'])->name('roles');
            Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
            Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

            Route::get('permissions', [PermissionController::class, 'index'])->name('permissions');
            Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
            Route::put('permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
            Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
        });
    });
});

require __DIR__.'/settings.php';
