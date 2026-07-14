import { useId, useState, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  className,
  disabled,
  id,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const isControlled = checked !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isOn = isControlled ? checked : uncontrolled;

  function toggle() {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) {
      setUncontrolled(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isOn ? 'bg-primary' : 'bg-border',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform',
            isOn && 'translate-x-5',
          )}
        />
      </button>
      {label ? (
        <label htmlFor={switchId} className="cursor-pointer text-open-regular-p text-foreground">
          {label}
        </label>
      ) : null}
    </div>
  );
}
