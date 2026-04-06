import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { baseClasses, variantClasses } from '@/components/UI/Banner/Banner.styles';
import type { BannerProps } from '@/components/UI/Banner/Banner.types';
import Button from '@/components/UI/Button/Button';

const Banner = ({
    variant = 'info',
    title,
    children,
    action,
    icon,
    dismissible = false,
    onDismiss,
    className,
}: BannerProps) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    return (
        <div className={cn(baseClasses, variantClasses[variant], className)}>
            <div className="flex items-center gap-3 min-w-0">
                {icon && <span className="shrink-0">{icon}</span>}
                <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm">{title}</p>
                    {children && <div className="text-sm">{children}</div>}
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {action && (
                    <Button
                        variant="primary"
                        size="sm"
                        to={action.to}
                        onClick={action.onClick}
                        ariaLabel={action.ariaLabel}
                    >
                        {action.label}
                    </Button>
                )}
                {dismissible && (
                    <Button
                        variant="text"
                        size="xs"
                        ariaLabel="Fermer la bannière"
                        onClick={handleDismiss}
                        icon={<X className="h-4 w-4" />}
                    />
                )}
            </div>
        </div>
    );
};

Banner.displayName = 'Banner';

export default Banner;
