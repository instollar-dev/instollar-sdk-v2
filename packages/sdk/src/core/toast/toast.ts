import { detectPlatform } from '../storage/platform-detection';
import type { ToastOptions, ToastType } from '../types';

const showMobileToast = (options: ToastOptions): void => {
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

const CLOSE_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 12M4 4L12 12" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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

  const finalTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
  const finalDesc = description || message || '';

  const id = `instollar-toast-${++toastId}`;
  const containerId = 'instollar-toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = `instollar-toast-container ${position}`;
    container.style.cssText =
      'position:fixed;z-index:9999;padding:24px;pointer-events:none;max-width:420px;';
    if (position.includes('top')) container.style.top = '0';
    else container.style.bottom = '0';
    if (position.includes('right')) container.style.right = '0';
    else if (position.includes('left')) container.style.left = '0';
    else container.style.left = '50%';
    document.body.appendChild(container);

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes instollar-toast-in { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes instollar-toast-out { from { transform: translateY(0); opacity: 1; } to { transform: translateY(10px); opacity: 0; } }
      .instollar-toast.closing { animation: instollar-toast-out 0.2s ease-in forwards; }
      .instollar-toast-close:hover svg path { stroke: #4b5563; }
    `;
    document.head.appendChild(styleEl);
  }

  const el = document.createElement('div');
  el.id = id;
  el.className = `instollar-toast instollar-toast-${type}`;

  const colors: Record<ToastType, { bg: string; text: string; icon: string }> = {
    success: { bg: '#f0fdf4', text: '#166534', icon: '#10b981' },
    error: { bg: '#fef2f2', text: '#991b1b', icon: '#ef4444' },
    warning: { bg: '#fffbeb', text: '#92400e', icon: '#f59e0b' },
    info: { bg: '#eff6ff', text: '#1e40af', icon: '#3b82f6' },
    message: { bg: '#ffffff', text: '#111827', icon: '#012b15' },
    default: { bg: '#f9fafb', text: '#374151', icon: '#6b7280' },
  };
  const theme = colors[type] || colors.default;

  el.style.cssText = `
    display:flex; align-items:flex-start; padding:16px; margin-bottom:12px; border-radius:12px;
    box-shadow:0 10px 15px -3px rgba(0,0,0,0.05); pointer-events:auto; background:${theme.bg};
    border:1px solid #e5e7eb; font-family:ui-sans-serif,system-ui,-apple-system;
    animation:instollar-toast-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; position:relative; min-width:300px;
  `;

  const iconHtml = `<div style="margin-right:12px; flex-shrink:0; margin-top:2px;">${getIcons(type, theme.icon)}</div>`;
  const contentHtml = `
    <div style="flex:1; margin-right:24px;">
      <div style="font-size:15px; font-weight:700; color:${theme.text}; margin-bottom:2px;">${finalTitle}</div>
      <div style="font-size:13px; color:#4b5563; line-height:1.4;">${finalDesc}</div>
    </div>
  `;
  const closeBtnHtml = `<button class="instollar-toast-close" style="background:none; border:none; padding:4px; cursor:pointer; position:absolute; right:8px; top:8px; display:flex; align-items:center; justify-content:center;">${CLOSE_ICON}</button>`;

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
