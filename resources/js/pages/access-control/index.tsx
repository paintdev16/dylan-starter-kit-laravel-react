import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownUp,
    ChevronDown,
    KeyRound,
    MoreHorizontal,
    Pencil,
    Plus,
    ShieldCheck,
    ShieldEllipsis,
    Trash2,
    UsersRound,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    destroy as deletePermission,
    store as storePermission,
    update as updatePermission,
} from '@/actions/App/Http/Controllers/Web/AccessControl/PermissionController';
import {
    destroy as deleteRole,
    store as storeRole,
    update as updateRole,
} from '@/actions/App/Http/Controllers/Web/AccessControl/RoleController';
import {
    destroy as deleteUser,
    store as storeUser,
    update as updateUser,
} from '@/actions/App/Http/Controllers/Web/AccessControl/UserController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { accessControl } from '@/routes';
import { permissions, roles, users } from '@/routes/access-control';

type Item = {
    id: number;
    name: string;
    display_name?: string | null;
    description?: string | null;
};
type Role = Item & { permissions?: Item[] };
type User = Item & { email: string; roles: Item[] };
type Section = 'users' | 'roles' | 'permissions';

const tabs = [
    {
        id: 'users',
        label: 'Usuarios',
        action: 'Nuevo usuario',
        href: users,
        icon: UsersRound,
        description:
            'Administra las personas que pueden acceder a la aplicación.',
        empty: 'Aquí aparecerán los usuarios cuando se conecten los datos.',
    },
    {
        id: 'roles',
        label: 'Roles',
        action: 'Nuevo rol',
        href: roles,
        icon: ShieldEllipsis,
        description: 'Organiza las responsabilidades y niveles de acceso.',
        empty: 'Aquí aparecerán los roles cuando se conecten los datos.',
    },
    {
        id: 'permissions',
        label: 'Permisos',
        action: 'Nuevo permiso',
        href: permissions,
        icon: KeyRound,
        description: 'Define las acciones disponibles para cada rol.',
        empty: 'Aquí aparecerán los permisos cuando se conecten los datos.',
    },
] as const;

export default function AccessControl({
    section,
    users: userList,
    roles: roleList,
    permissions: permissionList,
    assignedRoleIds,
    isSuperAdmin,
}: {
    section: Section;
    users: User[];
    roles: Role[];
    permissions: Item[];
    assignedRoleIds: number[];
    isSuperAdmin: boolean;
}) {
    const selected = tabs.find((tab) => tab.id === section) ?? tabs[0];
    const Icon = selected.icon;
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<User | Role | Item | null>(null);
    const [permissionFilter, setPermissionFilter] = useState('');
    const [permissionPage, setPermissionPage] = useState(0);
    const [ascending, setAscending] = useState(true);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        [],
    );
    const [showName, setShowName] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const form = useForm({
        name: '',
        display_name: '',
        description: '',
        email: '',
        password: '',
        roles: [] as number[],
        permissions: [] as number[],
    });
    const entries: (User | Role | Item)[] =
        section === 'users'
            ? userList
            : section === 'roles'
              ? roleList
              : permissionList.filter((permission) =>
                    (permission.display_name || '')
                        .toLocaleLowerCase('es')
                        .includes(
                            permissionFilter.trim().toLocaleLowerCase('es'),
                        ),
                );
    const sortedPermissions =
        section === 'permissions'
            ? [...entries].sort(
                  (a, b) =>
                      (a.display_name || '').localeCompare(
                          b.display_name || '',
                          'es',
                      ) * (ascending ? 1 : -1),
              )
            : [];
    const pageCount = Math.max(1, Math.ceil(sortedPermissions.length / 10));
    const currentPage = Math.min(permissionPage, pageCount - 1);
    const visiblePermissions = sortedPermissions.slice(
        currentPage * 10,
        (currentPage + 1) * 10,
    );
    const selectedVisible = visiblePermissions.filter((item) =>
        selectedPermissions.includes(item.id),
    ).length;
    const selectedFiltered = sortedPermissions.filter((item) =>
        selectedPermissions.includes(item.id),
    ).length;
    const totalCount =
        section === 'users'
            ? userList.length
            : section === 'roles'
              ? roleList.length
              : permissionList.length;
    const isReadOnlyName =
        !!editing &&
        ((section === 'roles' && ['admin', 'client'].includes(editing.name)) ||
            (section === 'permissions' && editing.name === 'manage.access'));

    function openForm(item: User | Role | Item | null = null) {
        setEditing(item);
        form.clearErrors();
        form.setData({
            name: item?.name ?? '',
            display_name: item?.display_name ?? '',
            description: item?.description ?? '',
            email: item && 'email' in item ? item.email : '',
            password: '',
            roles:
                item && 'roles' in item
                    ? item.roles.map((role) => role.id)
                    : [],
            permissions:
                item && 'permissions' in item && item.permissions
                    ? item.permissions.map((permission) => permission.id)
                    : [],
        });
        setOpen(true);
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        };

        if (section === 'users') {
            if (editing) {
                form.put(updateUser.url(editing.id), options);
            } else {
                form.post(storeUser.url(), options);
            }
        } else if (section === 'roles') {
            if (editing) {
                form.put(updateRole.url(editing.id), options);
            } else {
                form.post(storeRole.url(), options);
            }
        } else {
            if (editing) {
                form.put(updatePermission.url(editing.id), options);
            } else {
                form.post(storePermission.url(), options);
            }
        }
    }

    function remove(item: User | Role | Item) {
        if (
            !window.confirm(
                `¿Eliminar «${section === 'permissions' ? item.display_name || 'permiso sin nombre visible' : item.name}»? Esta acción no se puede deshacer.`,
            )
        )
            return;
        const action =
            section === 'users'
                ? deleteUser(item.id)
                : section === 'roles'
                  ? deleteRole(item.id)
                  : deletePermission(item.id);
        router.delete(action.url, { preserveScroll: true });
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-8 pb-12 sm:px-6">
            <Head title="Control de acceso" />
            <header className="rounded-2xl border border-state-primary-border bg-gradient-to-br from-state-primary via-card to-selected p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-state-primary-border bg-primary text-primary-foreground shadow-xs">
                            <ShieldCheck
                                className="size-5"
                                aria-hidden="true"
                            />
                        </span>
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                                    Administración
                                </p>
                                <Badge
                                    variant="outline"
                                    className="border-info-border bg-info-surface text-info"
                                >
                                    {isSuperAdmin
                                        ? 'Superadministrador'
                                        : 'Administrador'}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Control de acceso
                            </h1>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                Organiza los usuarios, sus roles y los permisos
                                de la aplicación.
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => openForm()}>
                        <Plus className="size-4" />
                        {selected.action}
                    </Button>
                </div>
            </header>

            <section className="overflow-hidden rounded-2xl border border-state-secondary-border bg-card text-card-foreground shadow-sm">
                <nav
                    aria-label="Secciones de control de acceso"
                    className="flex gap-1 overflow-x-auto border-b border-state-secondary-border bg-state-secondary/70 px-4 sm:px-6"
                >
                    {tabs.map((tab) => {
                        const isActive = selected.id === tab.id;
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href()}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'relative inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring',
                                    isActive
                                        ? 'border-primary bg-selected/60 text-primary'
                                        : 'border-transparent text-muted-foreground hover:bg-state-primary/50 hover:text-foreground',
                                )}
                            >
                                <tab.icon
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                {tab.label}
                                {isActive && (
                                    <span className="rounded-md border border-selected-border bg-card px-1.5 py-0.5 text-xs font-semibold text-primary">
                                        {totalCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-state-primary-border bg-state-primary/50 p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-state-primary-border bg-card text-primary shadow-xs">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {selected.label}
                                    </h2>
                                    <Badge
                                        variant="outline"
                                        className="border-info-border bg-info-surface text-info"
                                    >
                                        {totalCount}{' '}
                                        {totalCount === 1
                                            ? 'registro'
                                            : 'registros'}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {selected.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    {section === 'permissions' && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="w-full max-w-sm">
                                <Label
                                    htmlFor="permission-filter"
                                    className="sr-only"
                                >
                                    Buscar permisos por nombre visible
                                </Label>
                                <Input
                                    id="permission-filter"
                                    type="search"
                                    placeholder="Buscar permisos por nombre"
                                    className="border-input bg-state-secondary/60 focus-visible:bg-card"
                                    value={permissionFilter}
                                    onChange={(event) => {
                                        setPermissionFilter(event.target.value);
                                        setPermissionPage(0);
                                    }}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-state-secondary-border bg-state-secondary/60 hover:bg-state-primary"
                                    >
                                        Columnas{' '}
                                        <ChevronDown className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuCheckboxItem
                                        checked={showName}
                                        onCheckedChange={setShowName}
                                        onSelect={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        Nombre
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={showDescription}
                                        onCheckedChange={setShowDescription}
                                        onSelect={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        Descripción
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                    {section === 'permissions' ? (
                        <>
                            <div className="mt-6 overflow-hidden rounded-xl border border-state-secondary-border bg-card shadow-xs">
                                <Table>
                                    <TableHeader className="bg-state-secondary [&_tr]:border-state-secondary-border">
                                        <TableRow className="hover:bg-state-secondary">
                                            <TableHead className="w-12 pl-4">
                                                <Checkbox
                                                    aria-label="Seleccionar permisos de esta página"
                                                    checked={
                                                        visiblePermissions.length >
                                                            0 &&
                                                        selectedVisible ===
                                                            visiblePermissions.length
                                                            ? true
                                                            : selectedVisible >
                                                                0
                                                              ? 'indeterminate'
                                                              : false
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setSelectedPermissions(
                                                            (current) =>
                                                                checked === true
                                                                    ? [
                                                                          ...new Set(
                                                                              [
                                                                                  ...current,
                                                                                  ...visiblePermissions.map(
                                                                                      (
                                                                                          item,
                                                                                      ) =>
                                                                                          item.id,
                                                                                  ),
                                                                              ],
                                                                          ),
                                                                      ]
                                                                    : current.filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              !visiblePermissions.some(
                                                                                  (
                                                                                      item,
                                                                                  ) =>
                                                                                      item.id ===
                                                                                      id,
                                                                              ),
                                                                      ),
                                                        )
                                                    }
                                                />
                                            </TableHead>
                                            {showName && (
                                                <TableHead
                                                    aria-sort={
                                                        ascending
                                                            ? 'ascending'
                                                            : 'descending'
                                                    }
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-state-primary"
                                                        onClick={() =>
                                                            setAscending(
                                                                !ascending,
                                                            )
                                                        }
                                                    >
                                                        Nombre{' '}
                                                        <ArrowDownUp className="size-4" />
                                                    </Button>
                                                </TableHead>
                                            )}
                                            {showDescription && (
                                                <TableHead className="text-secondary-foreground">
                                                    Descripción
                                                </TableHead>
                                            )}
                                            <TableHead className="w-14">
                                                <span className="sr-only">
                                                    Acciones
                                                </span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visiblePermissions.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        2 +
                                                        Number(showName) +
                                                        Number(showDescription)
                                                    }
                                                    className="h-32 bg-state-secondary/40 text-center text-muted-foreground"
                                                >
                                                    {permissionFilter.trim()
                                                        ? 'No hay permisos que coincidan con la búsqueda.'
                                                        : 'Aún no hay permisos registrados.'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            visiblePermissions.map((item) => {
                                                const isProtectedPermission =
                                                    item.name ===
                                                    'manage.access';
                                                return (
                                                    <TableRow
                                                        key={item.id}
                                                        data-state={
                                                            selectedPermissions.includes(
                                                                item.id,
                                                            )
                                                                ? 'selected'
                                                                : undefined
                                                        }
                                                        className="border-state-secondary-border hover:bg-state-primary/50 data-[state=selected]:bg-selected"
                                                    >
                                                        <TableCell className="pl-4">
                                                            <Checkbox
                                                                aria-label={`Seleccionar ${item.display_name || 'permiso sin nombre visible'}`}
                                                                checked={selectedPermissions.includes(
                                                                    item.id,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    setSelectedPermissions(
                                                                        (
                                                                            current,
                                                                        ) =>
                                                                            checked ===
                                                                            true
                                                                                ? [
                                                                                      ...current,
                                                                                      item.id,
                                                                                  ]
                                                                                : current.filter(
                                                                                      (
                                                                                          id,
                                                                                      ) =>
                                                                                          id !==
                                                                                          item.id,
                                                                                  ),
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        {showName && (
                                                            <TableCell className="px-4 font-medium">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-foreground">
                                                                        {item.display_name ||
                                                                            'Sin nombre visible'}
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn(
                                                                            'font-mono text-[11px]',
                                                                            isProtectedPermission
                                                                                ? 'border-warning-border bg-warning-surface text-warning'
                                                                                : 'border-state-primary-border bg-state-primary text-secondary-foreground',
                                                                        )}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                        {showDescription && (
                                                            <TableCell className="max-w-md px-4 whitespace-normal text-muted-foreground">
                                                                {item.description ||
                                                                    '—'}
                                                            </TableCell>
                                                        )}
                                                        <TableCell className="px-4 text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="hover:bg-state-primary"
                                                                        aria-label={`Acciones de ${item.display_name || 'permiso sin nombre visible'}`}
                                                                    >
                                                                        <MoreHorizontal className="size-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onSelect={() =>
                                                                            openForm(
                                                                                item,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Pencil className="size-4" />{' '}
                                                                        Editar
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        variant="destructive"
                                                                        disabled={
                                                                            isProtectedPermission
                                                                        }
                                                                        onSelect={() =>
                                                                            remove(
                                                                                item,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-4" />{' '}
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-state-secondary-border bg-state-secondary/70 px-4 py-3 text-sm text-muted-foreground">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            selectedFiltered > 0
                                                ? 'border-selected-border bg-selected text-secondary-foreground'
                                                : 'border-state-secondary-border bg-card text-muted-foreground',
                                        )}
                                    >
                                        {selectedFiltered} de{' '}
                                        {sortedPermissions.length} seleccionados
                                    </Badge>
                                    <span>
                                        Página {currentPage + 1} de {pageCount}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-state-secondary-border bg-card hover:bg-state-primary"
                                        disabled={currentPage === 0}
                                        onClick={() =>
                                            setPermissionPage(currentPage - 1)
                                        }
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="border-state-secondary-border bg-card hover:bg-state-primary"
                                        disabled={currentPage >= pageCount - 1}
                                        onClick={() =>
                                            setPermissionPage(currentPage + 1)
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : entries.length === 0 ? (
                        <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-state-primary-border bg-state-secondary px-6 py-10 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full border border-state-primary-border bg-card text-primary shadow-xs">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <p className="mt-4 text-sm font-semibold text-foreground">
                                Sin datos disponibles
                            </p>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{`Aún no hay ${selected.label.toLowerCase()} registrados.`}</p>
                        </div>
                    ) : (
                        <div className="mt-6 divide-y divide-state-secondary-border overflow-hidden rounded-xl border border-state-secondary-border bg-card shadow-xs">
                            {entries.map((item) => {
                                const isCurrentUser =
                                    section === 'users' &&
                                    item.id === auth.user.id;
                                const isSystemRole =
                                    section === 'roles' &&
                                    ['super-admin', 'admin', 'client'].includes(
                                        item.name,
                                    );
                                const protectedItem =
                                    section === 'users'
                                        ? isCurrentUser ||
                                          (!isSuperAdmin &&
                                              'roles' in item &&
                                              item.roles.some(
                                                  (role) =>
                                                      role.name ===
                                                      'super-admin',
                                              ))
                                        : section === 'roles'
                                          ? item.name === 'super-admin' ||
                                            assignedRoleIds.includes(item.id)
                                          : false;
                                const protectedDeletion =
                                    protectedItem || isSystemRole;
                                const hasFullAccess =
                                    (section === 'roles' &&
                                        item.name === 'super-admin') ||
                                    ('roles' in item &&
                                        item.roles.some(
                                            (role) =>
                                                role.name === 'super-admin',
                                        ));
                                return (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            'flex flex-wrap items-center justify-between gap-4 p-4 transition-colors sm:px-5',
                                            isCurrentUser
                                                ? 'bg-selected/40 hover:bg-selected/60'
                                                : 'hover:bg-state-primary/40',
                                        )}
                                    >
                                        <div className="min-w-0 space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold break-words text-foreground">
                                                    {item.name}
                                                </p>
                                                {isCurrentUser && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-info-border bg-info-surface text-info"
                                                    >
                                                        Tu cuenta
                                                    </Badge>
                                                )}
                                                {hasFullAccess && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-warning-border bg-warning-surface text-warning"
                                                    >
                                                        Acceso total
                                                    </Badge>
                                                )}
                                                {isSystemRole &&
                                                    !hasFullAccess && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-info-border bg-info-surface text-info"
                                                        >
                                                            Rol base
                                                        </Badge>
                                                    )}
                                            </div>
                                            {'email' in item && (
                                                <p className="text-sm break-all text-muted-foreground">
                                                    {item.email}
                                                </p>
                                            )}
                                            {'roles' in item && (
                                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                    {item.roles.length > 0 ? (
                                                        item.roles.map(
                                                            (role) => (
                                                                <Badge
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    variant="outline"
                                                                    className={cn(
                                                                        role.name ===
                                                                            'super-admin'
                                                                            ? 'border-warning-border bg-warning-surface text-warning'
                                                                            : 'border-state-primary-border bg-state-primary text-secondary-foreground',
                                                                    )}
                                                                >
                                                                    {role.name}
                                                                </Badge>
                                                            ),
                                                        )
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-state-secondary-border bg-state-secondary text-muted-foreground"
                                                        >
                                                            Sin roles
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                            {'permissions' in item &&
                                                item.permissions && (
                                                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                                        {hasFullAccess ? (
                                                            <p className="text-xs text-muted-foreground">
                                                                Este rol supera
                                                                las
                                                                comprobaciones
                                                                de autorización
                                                                de Laravel.
                                                            </p>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    item
                                                                        .permissions
                                                                        .length >
                                                                        0
                                                                        ? 'border-success-border bg-success-surface text-success'
                                                                        : 'border-state-secondary-border bg-state-secondary text-muted-foreground',
                                                                )}
                                                            >
                                                                {
                                                                    item
                                                                        .permissions
                                                                        .length
                                                                }{' '}
                                                                permisos
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-state-secondary-border bg-card hover:border-state-primary-border hover:bg-state-primary"
                                                disabled={protectedItem}
                                                onClick={() => openForm(item)}
                                                aria-label={`Editar ${item.name}`}
                                            >
                                                <Pencil className="size-4" />{' '}
                                                Editar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-state-secondary-border bg-card hover:border-destructive-border hover:bg-destructive-surface hover:text-destructive"
                                                disabled={protectedDeletion}
                                                onClick={() => remove(item)}
                                                aria-label={`Eliminar ${item.name}`}
                                            >
                                                <Trash2 className="size-4" />{' '}
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-state-primary-border bg-card">
                    <DialogHeader className="border-b border-state-secondary-border pb-4">
                        <DialogTitle className="text-foreground">
                            {editing ? 'Editar' : 'Crear'}{' '}
                            {section === 'users'
                                ? 'usuario'
                                : section === 'roles'
                                  ? 'rol'
                                  : 'permiso'}
                        </DialogTitle>
                        <DialogDescription>
                            Completa los datos y guarda los cambios.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="access-name">
                                {section === 'permissions'
                                    ? 'Permiso en Spatie'
                                    : 'Nombre'}
                            </Label>
                            <Input
                                id="access-name"
                                className="border-input bg-state-secondary/50 read-only:bg-muted read-only:text-muted-foreground focus-visible:bg-card"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder={
                                    section === 'permissions'
                                        ? 'users.view'
                                        : undefined
                                }
                                readOnly={isReadOnlyName}
                                required
                            />
                            {isReadOnlyName && (
                                <p className="rounded-lg border border-warning-border bg-warning-surface px-3 py-1.5 text-xs text-warning">
                                    El identificador interno de este registro
                                    está protegido por el sistema.
                                </p>
                            )}
                            <InputError message={form.errors.name} />
                        </div>
                        {section === 'permissions' && (
                            <div className="grid gap-2">
                                <Label htmlFor="access-display-name">
                                    Nombre visible
                                </Label>
                                <Input
                                    id="access-display-name"
                                    className="border-input bg-state-secondary/50 focus-visible:bg-card"
                                    value={form.data.display_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'display_name',
                                            event.target.value,
                                        )
                                    }
                                    maxLength={255}
                                    placeholder="Por ejemplo, ver usuarios"
                                    required
                                />
                                <InputError
                                    message={form.errors.display_name}
                                />
                            </div>
                        )}
                        {section === 'permissions' && (
                            <div className="grid gap-2">
                                <Label htmlFor="access-description">
                                    Descripción en español
                                </Label>
                                <Input
                                    id="access-description"
                                    className="border-input bg-state-secondary/50 focus-visible:bg-card"
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                    placeholder="Describe para qué sirve este permiso"
                                />
                                <InputError message={form.errors.description} />
                            </div>
                        )}
                        {section === 'users' && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="access-email">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="access-email"
                                        type="email"
                                        className="border-input bg-state-secondary/50 focus-visible:bg-card"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={form.errors.email} />
                                </div>
                                {!editing && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="access-password">
                                            Contraseña inicial
                                        </Label>
                                        <Input
                                            id="access-password"
                                            type="password"
                                            autoComplete="new-password"
                                            className="border-input bg-state-secondary/50 focus-visible:bg-card"
                                            value={form.data.password}
                                            onChange={(event) =>
                                                form.setData(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={form.errors.password}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {section !== 'permissions' && (
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium text-foreground">
                                    {section === 'users' ? 'Roles' : 'Permisos'}
                                </legend>
                                <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-xl border border-state-secondary-border bg-state-secondary/60 p-2.5">
                                    {(section === 'users'
                                        ? roleList.filter(
                                              (role) =>
                                                  isSuperAdmin ||
                                                  role.name !== 'super-admin',
                                          )
                                        : permissionList
                                    ).map((option) => {
                                        const key =
                                            section === 'users'
                                                ? 'roles'
                                                : 'permissions';
                                        const isChecked = form.data[
                                            key
                                        ].includes(option.id);
                                        return (
                                            <label
                                                key={option.id}
                                                className={cn(
                                                    'flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                                                    isChecked
                                                        ? 'border-selected-border bg-selected font-medium text-foreground'
                                                        : 'border-transparent bg-card/70 text-foreground hover:border-state-primary-border hover:bg-state-primary/60',
                                                )}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <input
                                                        type="checkbox"
                                                        className="size-4 rounded border-input accent-primary"
                                                        checked={isChecked}
                                                        onChange={(event) =>
                                                            form.setData(
                                                                key,
                                                                event.target
                                                                    .checked
                                                                    ? [
                                                                          ...form
                                                                              .data[
                                                                              key
                                                                          ],
                                                                          option.id,
                                                                      ]
                                                                    : form.data[
                                                                          key
                                                                      ].filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              option.id,
                                                                      ),
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        {section === 'roles'
                                                            ? option.display_name ||
                                                              'Sin nombre visible'
                                                            : option.name}
                                                    </span>
                                                </span>
                                                {section === 'roles' && (
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {option.name}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                    {(section === 'users'
                                        ? roleList
                                        : permissionList
                                    ).length === 0 && (
                                        <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                                            No hay opciones disponibles.
                                        </p>
                                    )}
                                </div>
                                <InputError
                                    message={
                                        form.errors[
                                            section === 'users'
                                                ? 'roles'
                                                : 'permissions'
                                        ]
                                    }
                                />
                            </fieldset>
                        )}
                        <DialogFooter className="border-t border-state-secondary-border pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-state-secondary-border hover:bg-state-primary"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

AccessControl.layout = {
    breadcrumbs: [{ title: 'Control de acceso', href: accessControl() }],
};
