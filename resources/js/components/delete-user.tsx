import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { TriangleAlert } from 'lucide-react';
import { destroy } from '@/actions/App/Http/Controllers/Web/Settings/ProfileController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="rounded-2xl border border-destructive-border bg-destructive-surface p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive-border bg-card/60 text-destructive-foreground"><TriangleAlert className="size-5" aria-hidden="true" /></span>
                    <div className="space-y-1"><h2 className="font-semibold text-destructive-foreground">Eliminar cuenta</h2><p className="max-w-lg text-sm text-foreground/80">Elimina permanentemente tu cuenta y todos sus datos. Esta acción no se puede deshacer.</p></div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Eliminar cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            ¿Estás seguro de que deseas eliminar tu cuenta?
                        </DialogTitle>
                        <DialogDescription>
                            Al eliminar tu cuenta, todos sus datos se eliminarán permanentemente. Ingresa tu contraseña para confirmar.
                        </DialogDescription>

                        <Form
                            {...destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Contraseña
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Contraseña"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Eliminar cuenta
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
