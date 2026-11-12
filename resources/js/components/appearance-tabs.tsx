import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Claro' },
        { value: 'dark', icon: Moon, label: 'Oscuro' },
        { value: 'system', icon: Monitor, label: 'Sistema' },
    ];

    return (
        <div
            className={cn('inline-flex items-center gap-1', className)}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <Tooltip key={value}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            data-appearance-option={value}
                            aria-label={label}
                            aria-pressed={appearance === value}
                            onClick={() => updateAppearance(value)}
                            className="appearance-option inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            <Icon className="size-3.5" aria-hidden="true" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
