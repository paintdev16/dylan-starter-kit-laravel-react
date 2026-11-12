import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import SecurityController from '@/actions/App/Http/Controllers/Web/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// oxfmt-ignore
type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState(false);

    return (
        <>
            <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-state-primary text-primary"><ShieldCheck className="size-5" aria-hidden="true" /></span>
                    <div><h2 className="font-semibold">Contraseña y seguridad</h2><p className="mt-1 text-sm text-muted-foreground">Usa una contraseña segura y única para proteger tu cuenta.</p></div>
                  </div>
                  <Dialog open={editing} onOpenChange={setEditing}>
                    <DialogTrigger asChild><Button variant="outline">Cambiar contraseña</Button></DialogTrigger>
                    <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card sm:max-w-lg">
                    <DialogHeader><DialogTitle>Cambiar contraseña</DialogTitle><DialogDescription>Ingresa tu contraseña actual y elige una nueva.</DialogDescription></DialogHeader>

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
                    className="space-y-6"
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
                                    className="mt-1 h-11 w-full bg-background dark:bg-muted"
                                    autoComplete="current-password"
                                    placeholder="Contraseña actual"
                                />

                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Nueva contraseña</Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 h-11 w-full bg-background dark:bg-muted"
                                    autoComplete="new-password"
                                    placeholder="Nueva contraseña"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 h-11 w-full bg-background dark:bg-muted"
                                    autoComplete="new-password"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={props.passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                <Button
                                    disabled={processing}
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
            </div>
        </>
    );
}

