// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verificar correo electrónico" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-success">
                    Hemos enviado un nuevo enlace de verificación a tu correo
                    electrónico.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner aria-label="Cargando" />}
                            Reenviar correo de verificación
                        </Button>

                        <TextLink
                            href={logout()}
                            as="button"
                            className="mx-auto block text-sm"
                        >
                            Cerrar sesión
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifica tu correo electrónico',
    description:
        'Abre el enlace que enviamos a tu correo para verificar tu cuenta y continuar.',
};
