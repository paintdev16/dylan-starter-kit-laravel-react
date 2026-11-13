<?php

namespace App\Http\Requests\AccessControl;

use App\Concerns\AccessControlValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;

class UpdatePermissionRequest extends FormRequest
{
    use AccessControlValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $permission = $this->route('permission');

        if (! $permission instanceof Permission) {
            return false;
        }

        return Gate::allows('update', [$permission, $this->input('name')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $permission = $this->route('permission');

        return $this->permissionRules($permission instanceof Permission ? $permission : null);
    }
}
