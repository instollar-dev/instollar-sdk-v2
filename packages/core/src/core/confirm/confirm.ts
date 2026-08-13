export type ConfirmVariant = 'default' | 'danger' | 'warning';

export type ConfirmIconPreset = 'warning' | 'danger' | 'logout' | 'none';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  /** Preset icon or omit for variant default. Pass `none` to hide. */
  icon?: ConfirmIconPreset;
  /** Allow backdrop / Android back to cancel. Default: false for destructive variants. */
  dismissible?: boolean;
}

export type ConfirmHandler = (options: ConfirmOptions) => Promise<boolean>;

let customConfirmHandler: ConfirmHandler | undefined;

/** Register platform confirm UI (e.g. React Native ConfirmProvider). */
export function setConfirmHandler(handler: ConfirmHandler): void {
  customConfirmHandler = handler;
}

export function clearConfirmHandler(): void {
  customConfirmHandler = undefined;
}

export async function confirm(options: ConfirmOptions): Promise<boolean> {
  if (!customConfirmHandler) {
    console.warn(
      '[Instollar SDK] confirm() called without ConfirmProvider mounted — returning false.',
    );
    return false;
  }
  return customConfirmHandler(options);
}
