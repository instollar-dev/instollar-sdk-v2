import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FC,
  type KeyboardEvent,
} from 'react';
import { Button } from './Button';
import { cn } from '../utils/cn';

export interface OtpInputProps {
  length?: number;
  onChange?: (code: string) => void;
  mask?: boolean;
  separatorAfterIndex?: number | null;
  className?: string;
  inputsClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  'aria-label'?: string;
  showResend?: boolean;
  onResend?: () => void | Promise<void>;
  resendText?: string;
  resendLabel?: string;
  resendLoadingText?: string;
  resendLoading?: boolean;
  resendClassName?: string;
}

export type VerificationInputProps = OtpInputProps;

const DEFAULT_RESEND_TEXT =
  "Didn't get the email? Check your spam folder or click";

export const OtpInput: FC<OtpInputProps> = ({
  length = 6,
  onChange,
  mask = true,
  separatorAfterIndex = 2,
  className,
  inputsClassName,
  inputClassName,
  disabled = false,
  'aria-label': ariaLabel = 'Verification code',
  showResend = true,
  onResend,
  resendText = DEFAULT_RESEND_TEXT,
  resendLabel = 'Resend Code',
  resendLoadingText = 'Sending...',
  resendLoading = false,
  resendClassName,
}) => {
  const [code, setCode] = useState<string[]>(() => Array.from({ length }, () => ''));
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCode(Array.from({ length }, () => ''));
    setVisibleIndex(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const emit = (next: string[]) => {
    onChange?.(next.join(''));
  };

  const processInput = (event: ChangeEvent<HTMLInputElement>, slot: number) => {
    const num = event.target.value;
    if (/[^0-9]/.test(num)) return;

    const next = [...code];
    next[slot] = num;
    setCode(next);
    setVisibleIndex(slot);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisibleIndex(null), 500);

    emit(next);
    if (num && slot < length - 1) {
      inputs.current[slot + 1]?.focus();
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (event.key !== 'Backspace') return;

    if (code[slot]) {
      const next = [...code];
      next[slot] = '';
      setCode(next);
      emit(next);
      return;
    }

    if (slot > 0) {
      const next = [...code];
      next[slot - 1] = '';
      setCode(next);
      emit(next);
      inputs.current[slot - 1]?.focus();
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').slice(0, length).split('');
    if (pasted.some((char) => /[^0-9]/.test(char))) return;

    const next = [...code];
    pasted.forEach((char, index) => {
      next[index] = char;
    });
    setCode(next);
    emit(next);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={cn(
          'flex w-full items-center justify-between gap-2 md:w-auto md:justify-start md:gap-5',
          inputsClassName,
        )}
      >
        {code.map((num, idx) => {
          const display = num ? (!mask || visibleIndex === idx ? num : '*') : '';
          return (
            <Fragment key={idx}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={display}
                disabled={disabled}
                aria-label={`Digit ${idx + 1} of ${length}`}
                onChange={(event) => processInput(event, idx)}
                onKeyUp={(event) => onKeyUp(event, idx)}
                onPaste={onPaste}
                onFocus={(event) => event.target.select()}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                className={cn(
                  'aspect-square min-w-0 flex-1 rounded-lg border-[0.5px] border-border text-center text-lg font-bold transition-all md:h-[60px] md:w-[60px] md:flex-none md:text-xl',
                  'focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  inputClassName,
                )}
              />
              {typeof separatorAfterIndex === 'number' &&
              separatorAfterIndex === idx &&
              idx < length - 1 ? (
                <span className="text-lg text-foreground md:text-xl">-</span>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {showResend ? (
        <div className={cn('flex flex-wrap items-center gap-2 text-base', resendClassName)}>
          <span className="text-foreground">{resendText}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void onResend?.()}
            disabled={resendLoading || disabled || !onResend}
            aria-busy={resendLoading || undefined}
          >
            {resendLoading ? resendLoadingText : resendLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export const VerificationInput = OtpInput;

export default OtpInput;
