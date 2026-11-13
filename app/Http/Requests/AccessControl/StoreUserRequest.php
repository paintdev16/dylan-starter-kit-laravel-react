<?php

namespace App\Http\Requests\AccessControl;

use App\Concerns\AccessControlValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreUserRequest extends FormRequest
{
    use AccessControlValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create', [User::class, $this->input('roles', [])]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->userRules(includePassword: true);
    }
}
