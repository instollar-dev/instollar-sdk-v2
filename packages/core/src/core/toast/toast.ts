import { detectPlatform } from '../storage/platform-detection';
import type { ToastOptions, ToastType } from '../types';

const STYLE_TAG_ID = 'instollar-toast-styles';

const FALLBACK = {
  bg: '#ffffff',
  fg: '#012b15',
  muted: '#6b8074',
  border: '#d6ddd9',
  brand: '#012b15',
  primary: '#012b15',
  secondary: '#effe3e',
  destructive: '#f49e0c',
  danger: '#dc2626',
  font: '"Spline Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

type ToastPalette = {
  surface: string;
  titleColor: string;
  descColor: string;
  borderColor: string;
  iconColor: string;
  closeStroke: string;
  fontFamily: string;
};

function getToastPalette(type: ToastType): ToastPalette {
  const canvas = readCssVar('--color-bg', FALLBACK.bg);
  const fg = readCssVar('--color-fg', FALLBACK.fg);
  const muted = readCssVar('--color-muted', FALLBACK.muted);
  const border = readCssVar('--color-border', FALLBACK.border);
  const brand = readCssVar('--color-brand', FALLBACK.brand);
  const primary = readCssVar('--color-primary', FALLBACK.primary);
  const secondary = readCssVar('--color-secondary', FALLBACK.secondary);
  const destructive = readCssVar('--color-destructive', FALLBACK.destructive);
  const danger = readCssVar('--color-danger', FALLBACK.danger);
  const fontFamily = readCssVar('--font-spline', FALLBACK.font);

  const accentByType: Record<ToastType, string> = {
    success: primary,
    error: danger,
    warning: destructive,
    info: primary,
    message: brand,
    default: muted,
  };
  const accent = accentByType[type] ?? accentByType.default;

  const tintedSurface = `color-mix(in srgb, ${accent} 14%, ${canvas})`;
  const warningSurface = `color-mix(in srgb, ${secondary} 35%, ${canvas})`;

  return {
    surface: type === 'message' ? canvas : type === 'warning' ? warningSurface : tintedSurface,
    titleColor: fg,
    descColor: muted,
    borderColor: border,
    iconColor: accent,
    closeStroke: muted,
    fontFamily,
  };
}

export type ToastHandler = (options: ToastOptions) => void;

let customToastHandler: ToastHandler | undefined;

/** Register a platform toast UI (e.g. React Native ToastProvider). */
export function setToastHandler(handler: ToastHandler): void {
  customToastHandler = handler;
}

export function clearToastHandler(): void {
  customToastHandler = undefined;
}

const showConsoleToast = (options: ToastOptions): void => {
  const { message, title, description, type = 'default' } = options;
  const content = description || message || '';
  const header = title ? `[${title}] ` : '';
  const emoji = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  if (type === 'error') {
    console.warn(`[Instollar SDK] ${emoji} ${header}${content}`);
  } else {
    console.log(`[Instollar SDK] ${emoji} ${header}${content}`);
  }
};

const showMobileToast = (options: ToastOptions): void => {
  if (customToastHandler) {
    customToastHandler(options);
    return;
  }
  showConsoleToast(options);
};

const getIcons = (type: ToastType, color: string) => {
  const icons: Record<ToastType, string> = {
    success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="${color}"/><path d="M6 10L9 13L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="${color}"/><path d="M10 6V11M10 14H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2L1 18H19L10 2Z" fill="${color}"/><path d="M10 8V13M10 15H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="${color}"/><path d="M10 14V9M10 6H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    message: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="${color}"/><path d="M10 14V9M10 6H10.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    default: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="${color}"/></svg>`,
  };
  return icons[type] || icons.default;
};

function ensureToastStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_TAG_ID)) return;
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_TAG_ID;
  styleEl.textContent = `
    @keyframes instollar-toast-in { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes instollar-toast-out { from { transform: translateY(0); opacity: 1; } to { transform: translateY(10px); opacity: 0; } }
    .instollar-toast.closing { animation: instollar-toast-out 0.2s ease-in forwards; }
    .instollar-toast-container.instollar-toast-center { transform: translateX(-50%); }
  `;
  document.head.appendChild(styleEl);
}

let toastId = 0;

const showWebToast = (options: ToastOptions): void => {
  if (typeof document === 'undefined') {
    showMobileToast(options);
    return;
  }
  const {
    title,
    description,
    message,
    type = 'default',
    position = 'top-right',
    closeOnClick = true,
  } = options;
  const autoClose = options.autoClose ?? (type === 'message' ? 10000 : 5000);

  const finalTitle = escapeHtml(title || type.charAt(0).toUpperCase() + type.slice(1));
  const finalDesc = escapeHtml(description || message || '');

  const id = `instollar-toast-${++toastId}`;
  const containerId = 'instollar-toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    ensureToastStyles();
    container = document.createElement('div');
    container.id = containerId;
    container.className = `instollar-toast-container ${position}`;
    container.style.cssText =
      'position:fixed;z-index:9999;padding:24px;pointer-events:none;max-width:420px;display:flex;flex-direction:column;gap:12px;';
    if (position.includes('top')) container.style.top = '0';
    else container.style.bottom = '0';
    if (position.includes('right')) container.style.right = '0';
    else if (position.includes('left')) container.style.left = '0';
    else {
      container.style.left = '50%';
      container.classList.add('instollar-toast-center');
    }
    document.body.appendChild(container);
  }

  const palette = getToastPalette(type);

  const el = document.createElement('div');
  el.id = id;
  el.className = `instollar-toast instollar-toast-${type}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');

  el.style.cssText = `
    display:flex; align-items:flex-start; padding:16px; border-radius:12px;
    box-shadow:0 10px 24px -8px color-mix(in srgb, ${palette.titleColor} 18%, transparent);
    pointer-events:auto; background:${palette.surface};
    border:1px solid ${palette.borderColor}; font-family:${palette.fontFamily};
    animation:instollar-toast-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; position:relative; min-width:300px;
  `;

  const closeIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="${palette.closeStroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const iconHtml = `<div style="margin-right:12px; flex-shrink:0; margin-top:2px;">${getIcons(type, palette.iconColor)}</div>`;
  const contentHtml = finalDesc
    ? `
    <div style="flex:1; margin-right:24px;">
      <div style="font-size:15px; font-weight:700; color:${palette.titleColor}; margin-bottom:2px;">${finalTitle}</div>
      <div style="font-size:13px; color:${palette.descColor}; line-height:1.4;">${finalDesc}</div>
    </div>
  `
    : `
    <div style="flex:1; margin-right:24px;">
      <div style="font-size:15px; font-weight:700; color:${palette.titleColor};">${finalTitle}</div>
    </div>
  `;
  const closeBtnHtml = `<button type="button" aria-label="Dismiss notification" class="instollar-toast-close" style="background:none; border:none; padding:4px; cursor:pointer; position:absolute; right:8px; top:8px; display:flex; align-items:center; justify-content:center;">${closeIcon}</button>`;

  el.innerHTML = `${iconHtml}${contentHtml}${closeBtnHtml}`;

  const closeBtn = el.querySelector('.instollar-toast-close') as HTMLButtonElement;
  const dismiss = () => {
    el.classList.add('closing');
    window.setTimeout(() => el.remove(), 200);
  };

  closeBtn.onclick = (event) => {
    event.stopPropagation();
    dismiss();
  };
  if (closeOnClick) el.onclick = dismiss;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const startTimer = () => {
    if (autoClose > 0) {
      timeoutId = setTimeout(dismiss, autoClose);
    }
  };
  const stopTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  el.onmouseenter = stopTimer;
  el.onmouseleave = startTimer;

  container.appendChild(el);
  startTimer();
};

const showToast = (options: ToastOptions): void => {
  try {
    if (customToastHandler) {
      customToastHandler(options);
      return;
    }
    if (detectPlatform() === 'web') showWebToast(options);
    else showMobileToast(options);
  } catch {
    console.log(`[Instollar SDK] ${options.description || options.message}`);
  }
};

export const toast = {
  success: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'success' }),
  error: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'error' }),
  info: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'info' }),
  warning: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'warning' }),
  message: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'message' }),
  default: (msg: string, opts?: Omit<ToastOptions, 'message' | 'type'>) =>
    showToast({ ...opts, message: msg, type: 'default' }),
  show: (options: ToastOptions) => showToast(options),
};
