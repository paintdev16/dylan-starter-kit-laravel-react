<?php

namespace App\Http\Requests\AccessControl;

use App\Concerns\AccessControlValidationRules;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdateUserRequest extends FormRequest
{
    use AccessControlValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): Response|bool
    {
        $target = $this->route('user');

        if (! $target instanceof User) {
            return false;
        }

        return Gate::inspect('update', [$target, $this->input('roles', [])]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $target = $this->route('user');

        return $this->userRules($target instanceof User ? $target : null);
    }
}
