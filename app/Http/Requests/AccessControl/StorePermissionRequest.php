<?php

namespace App\Http\Requests\AccessControl;

use App\Concerns\AccessControlValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;

class StorePermissionRequest extends FormRequest
{
    use AccessControlValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('create', Permission::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->permissionRules();
    }
}
