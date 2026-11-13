import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Compass,
    Home,
    LayoutGrid,
    LogIn,
    RefreshCw,
    ServerCrash,
    ShieldAlert,
    UserRound,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, home, login } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { Auth } from '@/types';

type ErrorStatusConfig = {
    code: number;
    badge: string;
    title: string;
    description: string;
    suggestion: string;
    icon: LucideIcon;
    toneClassName: string;
    iconSurfaceClassName: string;
};

const ERROR_CONFIGS: Record<number, ErrorStatusConfig> = {
    404: {
        code: 404,
        badge: 'Error 404 · Ruta no disponible',
        title: 'Página no encontrada',
        description:
            'La dirección a la que intentas acceder no existe, fue movida o el enlace es incorrecto.',
        suggestion:
            'Verifica que la URL esté bien escrita o utiliza los accesos directos para continuar navegando de forma segura.',
        icon: Compass,
        toneClassName: 'border-info-border bg-info-surface text-info',
        iconSurfaceClassName:
            'border-state-primary-border bg-state-primary text-primary',
    },
    403: {
        code: 403,
        badge: 'Error 403 · Acceso restringido',
        title: 'Acceso denegado',
        description:
            'No cuentas con los permisos necesarios para visualizar o realizar acciones en esta sección.',
        suggestion:
            'Si necesitas acceder a este módulo, solicita los permisos correspondientes a un administrador del sistema.',
        icon: ShieldAlert,
        toneClassName: 'border-warning-border bg-warning-surface text-warning',
        iconSurfaceClassName:
            'border-warning-border bg-warning-surface text-warning',
    },
    500: {
        code: 500,
        badge: 'Error 500 · Fallo interno',
        title: 'Error del servidor',
        description:
            'Ocurrió un problema inesperado al procesar tu solicitud en nuestros servidores.',
        suggestion:
            'Por favor, intenta recargar la página en unos instantes o regresa a una sección segura.',
        icon: ServerCrash,
        toneClassName:
            'border-destructive-border bg-destructive-surface text-destructive',
        iconSurfaceClassName:
            'border-destructive-border bg-destructive-surface text-destructive',
    },
    503: {
        code: 503,
        badge: 'Error 503 · Mantenimiento',
        title: 'Servicio no disponible',
        description:
            'Estamos realizando tareas de mantenimiento o actualización en la plataforma.',
        suggestion:
            'El servicio se restablecerá en breve. Por favor, vuelve a intentarlo en unos minutos.',
        icon: Wrench,
        toneClassName: 'border-warning-border bg-warning-surface text-warning',
        iconSurfaceClassName:
            'border-warning-border bg-warning-surface text-warning',
    },
};

export default function ErrorPage({ status }: { status: number }) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const isAuthenticated = Boolean(auth?.user);

    const config: ErrorStatusConfig = ERROR_CONFIGS[status] ?? {
        code: status,
        badge: `Error ${status}`,
        title: 'No se pudo completar la solicitud',
        description:
            'Se produjo un estado inesperado al intentar cargar esta dirección.',
        suggestion:
            'Puedes regresar a la pantalla anterior o volver al inicio de la aplicación.',
        icon: Compass,
        toneClassName: 'border-info-border bg-info-surface text-info',
        iconSurfaceClassName:
            'border-state-primary-border bg-state-primary text-primary',
    };

    const Icon = config.icon;
    const isRetryable = status === 500 || status === 503;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();

            return;
        }

        window.location.assign(isAuthenticated ? dashboard.url() : home.url());
    };

    return (
        <>
            <Head title={`${config.code} - ${config.title}`} />

            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-3 py-6 text-foreground sm:px-6 sm:py-12">
                <div className="pointer-events-none absolute -top-28 -right-24 size-80 rounded-full bg-state-primary/80 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-24 size-80 rounded-full bg-info-surface/70 blur-3xl" />

                <main className="relative w-full max-w-2xl">
                    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                        {/* Encabezado principal */}
                        <div className="border-b border-border/80 bg-gradient-to-br from-state-primary/70 via-card to-card p-5 sm:p-8">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.toneClassName}`}
                                >
                                    <Icon className="size-3.5 shrink-0" />
                                    {config.badge}
                                </span>

                                <span className="font-mono text-3xl font-extrabold tracking-tight text-primary/35 select-none sm:text-4xl">
                                    #{config.code}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div
                                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-2xs sm:size-14 ${config.iconSurfaceClassName}`}
                                >
                                    <Icon className="size-6 sm:size-7" />
                                </div>

                                <div className="min-w-0 space-y-2">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                                        {config.title}
                                    </h1>
                                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                        {config.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cuerpo de sugerencia y acciones */}
                        <div className="space-y-5 p-5 sm:space-y-6 sm:p-8">
                            <div className="rounded-xl border border-state-secondary-border bg-state-secondary/60 p-3.5 sm:p-4">
                                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                    {config.suggestion}
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoBack}
                                    className="w-full gap-2 border-state-primary-border bg-state-primary/40 text-foreground hover:border-selected-border hover:bg-selected sm:w-auto"
                                    data-test="error-back-button"
                                >
                                    <ArrowLeft className="size-4 shrink-0" />
                                    Volver atrás
                                </Button>

                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                                    {isRetryable && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="w-full gap-2 sm:w-auto"
                                            data-test="error-reload-button"
                                        >
                                            <RefreshCw className="size-4 shrink-0" />
                                            Reintentar
                                        </Button>
                                    )}

                                    {isAuthenticated ? (
                                        <Button
                                            asChild
                                            className="w-full gap-2 sm:w-auto"
                                            data-test="error-primary-link"
                                        >
                                            <Link href={dashboard()}>
                                                <LayoutGrid className="size-4 shrink-0" />
                                                Ir al panel principal
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            asChild
                                            className="w-full gap-2 sm:w-auto"
                                            data-test="error-primary-link"
                                        >
                                            <Link href={home()}>
                                                <Home className="size-4 shrink-0" />
                                                Ir al inicio
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Accesos rápidos contextuales */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                                <span>Accesos rápidos:</span>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link
                                        href={home()}
                                        className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                                    >
                                        <Home className="size-3.5 text-primary" />
                                        Inicio
                                    </Link>

                                    {isAuthenticated ? (
                                        <>
                                            <span className="text-border">
                                                •
                                            </span>
                                            <Link
                                                href={dashboard()}
                                                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                                            >
                                                <LayoutGrid className="size-3.5 text-primary" />
                                                Dashboard
                                            </Link>
                                            <span className="text-border">
                                                •
                                            </span>
                                            <Link
                                                href={editProfile()}
                                                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                                            >
                                                <UserRound className="size-3.5 text-primary" />
                                                Mi perfil
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-border">
                                                •
                                            </span>
                                            <Link
                                                href={login()}
                                                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                                            >
                                                <LogIn className="size-3.5 text-primary" />
                                                Iniciar sesión
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
