<?php

return [
    'required' => 'El campo :attribute es obligatorio.',
    'present' => 'El campo :attribute debe estar presente.',
    'string' => 'El campo :attribute debe ser texto.',
    'email' => 'Ingresa un correo electrónico válido.',
    'unique' => 'El valor de :attribute ya está en uso.',
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'current_password' => 'La contraseña actual es incorrecta.',
    'array' => 'El campo :attribute debe ser una lista.',
    'integer' => 'El campo :attribute debe ser un número entero.',
    'exists' => 'El valor seleccionado para :attribute no es válido.',
    'min' => [
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
        'numeric' => 'El campo :attribute debe ser al menos :min.',
        'array' => 'El campo :attribute debe tener al menos :min elementos.',
        'file' => 'El archivo :attribute debe pesar al menos :min kilobytes.',
    ],
    'max' => [
        'string' => 'El campo :attribute no puede superar los :max caracteres.',
        'numeric' => 'El campo :attribute no puede ser mayor que :max.',
        'array' => 'El campo :attribute no puede tener más de :max elementos.',
        'file' => 'El archivo :attribute no puede superar los :max kilobytes.',
    ],
    'password' => [
        'letters' => 'La contraseña debe contener al menos una letra.',
        'mixed' => 'La contraseña debe contener mayúsculas y minúsculas.',
        'numbers' => 'La contraseña debe contener al menos un número.',
        'symbols' => 'La contraseña debe contener al menos un símbolo.',
        'uncompromised' => 'Esta contraseña ha aparecido en una filtración de datos. Elige otra.',
    ],
    'attributes' => [
        'name' => 'nombre',
        'email' => 'correo electrónico',
        'password' => 'contraseña',
        'password_confirmation' => 'confirmación de contraseña',
        'current_password' => 'contraseña actual',
        'roles' => 'roles',
        'permissions' => 'permisos',
        'display_name' => 'nombre visible',
        'description' => 'descripción',
    ],
];
