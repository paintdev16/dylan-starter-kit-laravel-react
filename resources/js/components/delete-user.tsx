import { Form } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';
import { useRef } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Web/Settings/ProfileController';
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

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <section className="rounded-2xl border border-destructive-border bg-gradient-to-br from-destructive-surface via-card to-destructive-surface/60 p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5 sm:gap-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-destructive-border bg-card text-destructive-foreground shadow-xs sm:size-10">
                        <TriangleAlert
                            className="size-4 sm:size-5"
                            aria-hidden="true"
                        />
                    </span>
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold text-destructive-foreground">
                                Eliminar cuenta
                            </h2>
                            <Badge
                                variant="outline"
                                className="border-destructive-border bg-destructive-surface text-destructive-foreground"
                            >
                                Zona de peligro
                            </Badge>
                        </div>
                        <p className="max-w-xl text-xs leading-relaxed text-foreground/80 sm:text-sm">
                            Elimina permanentemente tu cuenta y todos sus datos.
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full shrink-0 sm:w-auto"
                            data-test="delete-user-button"
                        >
                            Eliminar cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto border-destructive-border bg-card p-4 sm:w-full sm:p-6">
                        <DialogHeader className="border-b border-state-secondary-border pb-4">
                            <DialogTitle className="text-foreground">
                                ¿Estás seguro de que deseas eliminar tu cuenta?
                            </DialogTitle>
                            <DialogDescription>
                                Al eliminar tu cuenta, todos sus datos se
                                eliminarán permanentemente. Ingresa tu
                                contraseña para confirmar.
                            </DialogDescription>
                        </DialogHeader>

                        <Form
                            {...destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-4 sm:space-y-5"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="rounded-xl border border-destructive-border bg-destructive-surface p-3.5 text-xs leading-relaxed text-destructive-foreground">
                                        Esta operación cerrará tu sesión de
                                        inmediato y borrará tu perfil de forma
                                        irreversible.
                                    </div>

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
                                            className="h-10 border-input bg-state-secondary/50 focus-visible:bg-card sm:h-11"
                                            placeholder="Contraseña"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2 border-t border-state-secondary-border pt-4">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                className="w-full sm:w-auto"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto"
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
        </section>
    );
}
