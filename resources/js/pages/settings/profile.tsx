import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Pencil, UserRound } from 'lucide-react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Web/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';
import Security from '@/components/update-password';
import { useInitials } from '@/hooks/use-initials';

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

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-8 pb-12 sm:px-6">
            <Head title="Mi perfil" />

            <header className="flex flex-col gap-4 rounded-2xl border border-state-primary-border bg-gradient-to-br from-state-primary via-card to-selected p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-semibold tracking-wider text-primary uppercase">Configuración de cuenta</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Mi perfil</h1>
                    <p className="text-sm text-muted-foreground">Administra tu información personal y la seguridad de tu cuenta.</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-state-primary-border bg-card/80 px-4 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{getInitials(auth.user.name)}</span>
                    <p className="max-w-48 truncate text-sm font-semibold">{auth.user.name}</p>
                </div>
            </header>

            <div className="grid items-stretch gap-5 lg:grid-cols-2">
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-state-primary text-primary"><UserRound className="size-5" aria-hidden="true" /></span>
                    <div><h2 className="font-semibold">Información personal</h2><p className="mt-1 text-sm text-muted-foreground">Consulta los datos asociados a tu cuenta.</p></div>
                  </div>
                  <Dialog open={editing} onOpenChange={setEditing}>
                    <DialogTrigger asChild><Button variant="outline"><Pencil className="size-4" /> Editar datos</Button></DialogTrigger>
                    <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card sm:max-w-lg">
                        <DialogHeader><DialogTitle>Editar información personal</DialogTitle><DialogDescription>Actualiza el nombre y el correo electrónico de tu cuenta.</DialogDescription></DialogHeader>
                        <Form {...ProfileController.update.form()} options={{ preserveScroll: true }} onSuccess={() => setEditing(false)} className="space-y-5">
                            {({ processing, errors }) => (<>
                                <div className="grid gap-2"><Label htmlFor="name">Nombre</Label><Input id="name" className="h-11 bg-background" defaultValue={auth.user.name} name="name" required autoComplete="name" placeholder="Nombre completo" /><InputError message={errors.name} /></div>
                                <div className="grid gap-2"><Label htmlFor="email">Correo electrónico</Label><Input id="email" type="email" className="h-11 bg-background" defaultValue={auth.user.email} name="email" required autoComplete="username" placeholder="Correo electrónico" /><InputError message={errors.email} /></div>
                                <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose><Button disabled={processing} data-test="update-profile-button">Guardar cambios</Button></DialogFooter>
                            </>)}
                        </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <dl className="grid gap-5 border-t border-border pt-6">
                    <div className="min-w-0 space-y-1"><dt className="text-xs font-medium text-muted-foreground">Correo electrónico</dt><dd className="break-all text-sm font-medium">{auth.user.email}</dd></div>
                </dl>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Tu correo electrónico no está verificado.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                            className="text-primary underline underline-offset-4"
                                            >
                                                Volver a enviar el correo de verificación.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-success">
                                                Se ha enviado un nuevo enlace de verificación a tu correo.
                                            </div>
                                        )}
                                    </div>
                                )}

            </div>

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
