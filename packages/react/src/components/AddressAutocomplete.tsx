import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  fetchPlaceAutocompleteSuggestions,
  fetchPlaceDetailsAsAddress,
  resolveGooglePlacesApiKey,
  type AddressComponents,
  type PlaceAutocompleteSuggestion,
} from '../places';
import { cn } from '../utils/cn';
import { FieldControl } from './FieldControl';
import { Spinner } from './Spinner';
import {
  formFieldDescriptionClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from './formVariants';

const DEBOUNCE_MS = 300;
const BLUR_CLOSE_MS = 200;

export interface AddressAutocompleteProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onPlaceSelect: (address: AddressComponents) => void;
  apiKey?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
  id?: string;
}

export function AddressAutocomplete({
  inputValue,
  onInputChange,
  onPlaceSelect,
  apiKey,
  label,
  placeholder,
  disabled,
  className,
  helperText,
  error,
  id,
}: AddressAutocompleteProps) {
  const generatedId = useId();
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const listboxId = `${inputId}-suggestions`;

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceAutocompleteSuggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [suggestionsUnavailable, setSuggestionsUnavailable] = useState(false);

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const detailsAbortRef = useRef<AbortController | null>(null);
  const selectingRef = useRef(false);

  const resolvedKey = resolveGooglePlacesApiKey(apiKey);
  const availabilityHint =
    "The address dropdown is currently unavailable. You can still continue by entering your address manually, or contact support if you need help.";

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setHighlightIndex(-1);
    setOpen(false);
  }, []);

  useEffect(() => {
    const trimmed = inputValue.trim();

    if (!trimmed || !resolvedKey) {
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      clearSuggestions();
      return;
    }

    const timeoutId = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setSuggestionsUnavailable(false);

      fetchPlaceAutocompleteSuggestions(trimmed, resolvedKey, controller.signal)
        .then((next) => {
          if (controller.signal.aborted) return;
          setSuggestions(next);
          setHighlightIndex(next.length ? 0 : -1);
          setOpen(next.length > 0);
          setSuggestionsUnavailable(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          clearSuggestions();
          setSuggestionsUnavailable(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, resolvedKey, clearSuggestions]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      detailsAbortRef.current?.abort();
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    },
    [],
  );

  const selectSuggestion = useCallback(
    async (suggestion: PlaceAutocompleteSuggestion) => {
      if (!resolvedKey || disabled) return;

      selectingRef.current = true;
      setOpen(false);
      clearSuggestions();
      setLoading(true);
      setSuggestionsUnavailable(false);

      const display =
        suggestion.fullText ||
        [suggestion.mainText, suggestion.secondaryText].filter(Boolean).join(', ');
      onInputChange(display);

      detailsAbortRef.current?.abort();
      const controller = new AbortController();
      detailsAbortRef.current = controller;

      try {
        const address = await fetchPlaceDetailsAsAddress(
          suggestion.placeId,
          resolvedKey,
          suggestion.types,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          onPlaceSelect(address);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestionsUnavailable(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
        selectingRef.current = false;
      }
    },
    [resolvedKey, disabled, clearSuggestions, onInputChange, onPlaceSelect],
  );

  function handleFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    if (suggestions.length > 0) setOpen(true);
  }

  function handleBlur() {
    if (selectingRef.current) return;
    blurTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, BLUR_CLOSE_MS);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (event.key === 'Escape') setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const index = highlightIndex >= 0 ? highlightIndex : 0;
      const suggestion = suggestions[index];
      if (suggestion) void selectSuggestion(suggestion);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const showList = open && suggestions.length > 0 && !disabled;

  return (
    <div className={cn('relative flex flex-col gap-1', className)}>
      {label ? (
        <label htmlFor={inputId} className={formFieldLabelClass}>
          {label}
        </label>
      ) : null}

      <FieldControl
        error={!!error}
        disabled={disabled}
        className="focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        suffix={loading ? <Spinner size={16} className="text-muted" /> : undefined}
      >
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={showList ? listboxId : undefined}
          aria-activedescendant={
            showList && highlightIndex >= 0
              ? `${listboxId}-option-${highlightIndex}`
              : undefined
          }
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full border-0 bg-transparent px-3 py-2 text-open-regular-p outline-none placeholder:text-muted"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : suggestionsUnavailable
                ? `${inputId}-hint`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
          }
        />
      </FieldControl>

      {showList ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-background py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => {
            const active = index === highlightIndex;
            return (
              <li key={suggestion.placeId} role="presentation">
                <button
                  type="button"
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    'flex w-full flex-col items-start px-3 py-2 text-left text-open-regular-p transition-colors',
                    active ? 'bg-muted/30 text-foreground' : 'text-foreground hover:bg-muted/20',
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => void selectSuggestion(suggestion)}
                >
                  <span className="font-medium">{suggestion.mainText}</span>
                  {suggestion.secondaryText ? (
                    <span className="text-open-regular-tiny text-muted">
                      {suggestion.secondaryText}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <p id={`${inputId}-error`} role="alert" className={formFieldErrorClass}>
          {error}
        </p>
      ) : suggestionsUnavailable ? (
        <p id={`${inputId}-hint`} className={formFieldDescriptionClass}>
          {availabilityHint}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className={formFieldDescriptionClass}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default AddressAutocomplete;
