<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileDeleteRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'password' => $this->currentPasswordRules(),
        ];
    }

    public function messages(): array
    {
        return [
            'password.required' => 'Ingresa tu contraseña.',
            'password.string' => 'La contraseña debe ser texto.',
            'password.current_password' => 'La contraseña es incorrecta.',
        ];
    }
}
