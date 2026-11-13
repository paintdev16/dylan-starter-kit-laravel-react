import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Clock,
    Mail,
    Pencil,
    Sparkles,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Web/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Security from '@/components/update-password';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
    passwordRules,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    passwordRules: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const [editing, setEditing] = useState(false);
    const isVerified = auth.user.email_verified_at !== null;

    return (
        <div className="mx-auto w-full max-w-6xl space-y-4 px-3 pt-4 pb-8 sm:space-y-6 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8">
            <Head title="Mi perfil" />

            <header className="rounded-2xl border border-state-primary-border bg-gradient-to-br from-state-primary via-card to-selected p-4 shadow-sm sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3.5 sm:gap-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-state-primary-border bg-primary text-primary-foreground shadow-xs sm:size-11">
                            <UserRound className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                                    Configuración de cuenta
                                </p>
                                <Badge
                                    variant="outline"
                                    className={
                                        isVerified
                                            ? 'border-success-border bg-success-surface text-success'
                                            : 'border-warning-border bg-warning-surface text-warning'
                                    }
                                >
                                    {isVerified
                                        ? 'Cuenta verificada'
                                        : 'Verificación pendiente'}
                                </Badge>
                            </div>
                            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                Mi perfil
                            </h1>
                            <p className="max-w-xl text-sm text-muted-foreground">
                                Administra tu información personal, tus
                                credenciales de acceso y la seguridad de tu
                                cuenta.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full items-center gap-3.5 rounded-xl border border-state-primary-border bg-card/90 p-3 shadow-xs sm:px-4 sm:py-3 lg:w-auto lg:max-w-xs">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-state-primary-border sm:size-11">
                            {getInitials(auth.user.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {auth.user.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-2">
                <section className="flex flex-col justify-between space-y-5 rounded-2xl border border-state-secondary-border bg-card p-4 text-card-foreground shadow-sm sm:space-y-6 sm:p-6 lg:p-8">
                    <div className="space-y-5 sm:space-y-6">
                        <div className="flex flex-col gap-3.5 rounded-xl border border-state-primary-border bg-state-primary/50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                            <div className="flex items-start gap-3.5">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-state-primary-border bg-card text-primary shadow-xs sm:size-10">
                                    <UserRound
                                        className="size-4 sm:size-5"
                                        aria-hidden="true"
                                    />
                                </span>
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-foreground">
                                        Información personal
                                    </h2>
                                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                        Datos principales asociados a tu perfil.
                                    </p>
                                </div>
                            </div>

                            <Dialog open={editing} onOpenChange={setEditing}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full shrink-0 border-state-secondary-border bg-card hover:border-state-primary-border hover:bg-state-primary sm:w-auto"
                                    >
                                        <Pencil className="size-4" /> Editar
                                        datos
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto border-state-primary-border bg-card p-4 sm:w-full sm:p-6">
                                    <DialogHeader className="border-b border-state-secondary-border pb-4">
                                        <DialogTitle className="text-foreground">
                                            Editar información personal
                                        </DialogTitle>
                                        <DialogDescription>
                                            Actualiza el nombre y el correo
                                            electrónico de tu cuenta.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form
                                        {...ProfileController.update.form()}
                                        options={{ preserveScroll: true }}
                                        onSuccess={() => setEditing(false)}
                                        className="space-y-4 sm:space-y-5"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">
                                                        Nombre
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        className="h-10 border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                                        defaultValue={
                                                            auth.user.name
                                                        }
                                                        name="name"
                                                        required
                                                        autoComplete="name"
                                                        placeholder="Nombre completo"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">
                                                        Correo electrónico
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="h-10 border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                                        defaultValue={
                                                            auth.user.email
                                                        }
                                                        name="email"
                                                        required
                                                        autoComplete="username"
                                                        placeholder="Correo electrónico"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>
                                                <DialogFooter className="gap-2 border-t border-state-secondary-border pt-4">
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full border-state-secondary-border hover:bg-state-primary sm:w-auto"
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        disabled={processing}
                                                        className="w-full sm:w-auto"
                                                        data-test="update-profile-button"
                                                    >
                                                        Guardar cambios
                                                    </Button>
                                                </DialogFooter>
                                            </>
                                        )}
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <dl className="divide-y divide-state-secondary-border overflow-hidden rounded-xl border border-state-secondary-border bg-state-secondary/40">
                            <div className="flex flex-col items-start justify-between gap-2 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                                <div className="min-w-0 space-y-1">
                                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <Sparkles
                                            className="size-3.5 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        Nombre completo
                                    </dt>
                                    <dd className="text-sm font-semibold break-words text-foreground">
                                        {auth.user.name}
                                    </dd>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="border-state-primary-border bg-state-primary text-secondary-foreground"
                                >
                                    Titular
                                </Badge>
                            </div>

                            <div className="flex flex-col items-start justify-between gap-2 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                                <div className="min-w-0 space-y-1">
                                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <Mail
                                            className="size-3.5 shrink-0 text-primary"
                                            aria-hidden="true"
                                        />
                                        Correo electrónico
                                    </dt>
                                    <dd className="text-sm font-medium break-all text-foreground">
                                        {auth.user.email}
                                    </dd>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        isVerified
                                            ? 'border-success-border bg-success-surface text-success'
                                            : 'border-warning-border bg-warning-surface text-warning'
                                    }
                                >
                                    {isVerified ? (
                                        <>
                                            <BadgeCheck className="size-3" />
                                            Verificado
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="size-3" />
                                            Sin verificar
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </dl>
                    </div>

                    {mustVerifyEmail &&
                        auth.user.email_verified_at === null && (
                            <div className="space-y-3 rounded-xl border border-warning-border bg-warning-surface p-3.5 sm:p-4">
                                <p className="text-xs leading-relaxed text-warning sm:text-sm">
                                    Tu correo electrónico no está verificado.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="font-semibold text-warning underline underline-offset-4 hover:opacity-80"
                                    >
                                        Volver a enviar el correo de
                                        verificación.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="rounded-lg border border-success-border bg-success-surface px-3 py-2 text-xs font-medium text-success">
                                        Se ha enviado un nuevo enlace de
                                        verificación a tu correo.
                                    </div>
                                )}
                            </div>
                        )}
                </section>

                <Security passwordRules={passwordRules} />
            </div>

            <DeleteUser />
        </div>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Mi perfil',
            href: edit(),
        },
    ],
};
