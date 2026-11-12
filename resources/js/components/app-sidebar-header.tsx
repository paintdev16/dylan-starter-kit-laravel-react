import { Breadcrumbs } from '@/components/breadcrumbs';
import AppearanceTabs from '@/components/appearance-tabs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-2 rounded-xl border border-sidebar-border bg-card px-4 md:top-2 dark:bg-background">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <AppearanceTabs className="shrink-0" />
        </header>
    );
}
