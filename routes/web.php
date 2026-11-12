<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AccessControlController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::middleware('can:manage access')->group(function () {
        Route::redirect('access-control', '/access-control/users')->name('access-control');
        Route::get('access-control/users', [AccessControlController::class, 'index'])->defaults('section', 'users')->name('access-control.users');
        Route::get('access-control/roles', [AccessControlController::class, 'index'])->defaults('section', 'roles')->name('access-control.roles');
        Route::get('access-control/permissions', [AccessControlController::class, 'index'])->defaults('section', 'permissions')->name('access-control.permissions');
        Route::post('access-control/users', [AccessControlController::class, 'storeUser'])->name('access-control.users.store');
        Route::put('access-control/users/{user}', [AccessControlController::class, 'updateUser'])->name('access-control.users.update');
        Route::delete('access-control/users/{user}', [AccessControlController::class, 'deleteUser'])->name('access-control.users.destroy');
        Route::post('access-control/roles', [AccessControlController::class, 'storeRole'])->name('access-control.roles.store');
        Route::put('access-control/roles/{role}', [AccessControlController::class, 'updateRole'])->name('access-control.roles.update');
        Route::delete('access-control/roles/{role}', [AccessControlController::class, 'deleteRole'])->name('access-control.roles.destroy');
        Route::post('access-control/permissions', [AccessControlController::class, 'storePermission'])->name('access-control.permissions.store');
        Route::put('access-control/permissions/{permission}', [AccessControlController::class, 'updatePermission'])->name('access-control.permissions.update');
        Route::delete('access-control/permissions/{permission}', [AccessControlController::class, 'deletePermission'])->name('access-control.permissions.destroy');
    });
});

require __DIR__.'/settings.php';
