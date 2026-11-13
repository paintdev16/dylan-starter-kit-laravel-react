import { Form } from '@inertiajs/react';
import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Web/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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
import { Label } from '@/components/ui/label';

// oxfmt-ignore
type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState(false);

    return (
        <section className="flex flex-col justify-between space-y-5 rounded-2xl border border-state-secondary-border bg-card p-4 text-card-foreground shadow-sm sm:space-y-6 sm:p-6 lg:p-8">
            <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-col gap-3.5 rounded-xl border border-state-primary-border bg-state-primary/50 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-3.5">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-state-primary-border bg-card text-primary shadow-xs sm:size-10">
                            <ShieldCheck
                                className="size-4 sm:size-5"
                                aria-hidden="true"
                            />
                        </span>
                        <div className="min-w-0">
                            <h2 className="font-semibold text-foreground">
                                Contraseña y seguridad
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                Usa una contraseña segura y única para proteger
                                tu cuenta.
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
                                <KeyRound className="size-4" /> Cambiar
                                contraseña
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto border-state-primary-border bg-card p-4 sm:w-full sm:p-6">
                            <DialogHeader className="border-b border-state-secondary-border pb-4">
                                <DialogTitle className="text-foreground">
                                    Cambiar contraseña
                                </DialogTitle>
                                <DialogDescription>
                                    Ingresa tu contraseña actual y elige una
                                    nueva.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...SecurityController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onSuccess={() => setEditing(false)}
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }

                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-4 sm:space-y-5"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Contraseña actual
                                            </Label>

                                            <PasswordInput
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                className="mt-1 h-10 w-full border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                                autoComplete="current-password"
                                                placeholder="Contraseña actual"
                                            />

                                            <InputError
                                                message={
                                                    errors.current_password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                Nueva contraseña
                                            </Label>

                                            <PasswordInput
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                className="mt-1 h-10 w-full border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                                autoComplete="new-password"
                                                placeholder="Nueva contraseña"
                                                passwordrules={
                                                    props.passwordRules
                                                }
                                            />

                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirmar contraseña
                                            </Label>

                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                className="mt-1 h-10 w-full border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                                autoComplete="new-password"
                                                placeholder="Confirmar contraseña"
                                                passwordrules={
                                                    props.passwordRules
                                                }
                                            />

                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
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
                                                data-test="update-password-button"
                                            >
                                                Actualizar contraseña
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="divide-y divide-state-secondary-border overflow-hidden rounded-xl border border-state-secondary-border bg-state-secondary/40">
                    <div className="flex flex-col items-start justify-between gap-2 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                        <div className="min-w-0 space-y-1">
                            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <LockKeyhole
                                    className="size-3.5 shrink-0 text-primary"
                                    aria-hidden="true"
                                />
                                Credencial de acceso
                            </p>
                            <p className="font-mono text-sm tracking-widest text-foreground">
                                ••••••••••••
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-success-border bg-success-surface text-success"
                        >
                            Activa
                        </Badge>
                    </div>

                    <div className="bg-info-surface/60 p-3.5 sm:p-4">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Te recomendamos combinar letras mayúsculas,
                            minúsculas, números y símbolos para mantener tu
                            cuenta protegida.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
