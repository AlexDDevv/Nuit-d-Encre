import type { BannerVariant } from '@/components/UI/Banner/Banner.types';

export const baseClasses =
    'flex items-center justify-between gap-4 rounded-lg border-2 p-4';

export const variantClasses: Record<BannerVariant, string> = {
    success:    'bg-validate-light    border-validate-medium    text-validate-dark',
    error:      'bg-destructive-light border-destructive-medium text-destructive-dark',
    warning:    'bg-warning-light     border-warning-medium     text-warning-dark',
    info:       'bg-muted             border-border             text-foreground',
    completion: 'bg-muted             border-border             text-foreground',
};
