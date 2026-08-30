import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X, Check, Loader2, Plus } from "lucide-react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { cn } from "../utils/cn";
import InfoTooltip from "./infoTooltip";

/**
 * Option shape for Select: display label and generic value T.
 * Use getOptionKey when T is an object so keys and equality work correctly.
 */
export interface SelectOption<T> {
  label: string;
  value: T;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: string;
  disabled?: boolean;
}

/**
 * Props for the generic Select component.
 * T is the type of the option value (string, number, or object).
 * For object T, provide getOptionKey so selection and keys work correctly.
 */
export interface SelectProps<T> {
  /** Options to display. Each has a label (display) and value (generic T). */
  options: SelectOption<T>[];
  /** Current value. Single: T | null. Multiple: T[]. */
  value: T | null | T[];
  /** Called when selection changes. Single: (value: T | null). Multiple: (value: T[]). */
  onChange: (value: T | null | T[]) => void;
  /** Allow selecting multiple options. Default false. */
  multiple?: boolean;
  /** Enable search/filter by label. Default true. */
  searchable?: boolean;
  /** Placeholder when nothing selected. */
  placeholder?: string;
  /** Label above the trigger. */
  label?: string;
  /** Optional extra information shown beside the label. */
  labelInfo?: ReactNode;
  /** Error message (e.g. validation, shows below trigger, red). */
  error?: string;
  /**
   * Controls whether the error message is rendered under the trigger.
   * Useful when you only want the red border styling.
   */
  showErrorMessage?: boolean;
  /** When true, shows loading state and prevents opening. Use when options are being fetched. */
  loading?: boolean;
  /** Error message when options failed to load (e.g. API error). Shows below trigger with Retry. */
  loadError?: string;
  /** Called when user clicks Retry after a load error. */
  onRetry?: () => void;
  /** Disable the select. */
  disabled?: boolean;
  /** Optional: unique key for value (required when T is object). Used for keys and equality. */
  getOptionKey?: (value: T) => string | number;
  /** Optional: custom equality. Default uses getOptionKey or ===. */
  isOptionEqual?: (a: T, b: T) => boolean;
  /** Optional class for the trigger. */
  className?: string;
  /**
   * `inline` — borderless, compact trigger for embedding in tables/grids
   * (no boxed field look; still keyboard-focusable).
   */
  variant?: "default" | "inline";
  /** Optional class for the dropdown. */
  dropdownClassName?: string;
  /** Optional class for the root container. */
  containerClassName?: string;
  /** Id for the trigger (for label association). */
  id?: string;
  /** Optional content rendered at the start of the trigger (e.g. icon or prefix). */
  prefix?: ReactNode;
  /** Optional content rendered before the chevron/spinner at the end of the trigger. */
  suffix?: ReactNode;
  /** Optional class for the label. */
  labelClassName?: string;
  /** Allow adding custom values not in options. Only works when searchable is true. */
  creatable?: boolean;
  /** Optional custom search callback. If provided, internal filtering is skipped. */
  onSearch?: (query: string) => void;
  /**
   * Optional persistent action pinned to the bottom of the dropdown
   * (e.g. "Create new workflow"). Unlike a regular option, selecting it does
   * not change the value — it runs `onClick` and closes the dropdown.
   */
  createAction?: {
    label: string;
    onClick: () => void;
    /** Optional leading icon. Defaults to a Plus icon. */
    icon?: ReactNode;
  };
}

const defaultGetOptionKey = <T,>(value: T): string => {
  if (value === null) return "__null__";
  if (value === undefined) return "__undefined__";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  return JSON.stringify(value);
};

function defaultIsOptionEqual<T>(
  a: T,
  b: T,
  getKey: (v: T) => string | number,
): boolean {
  return getKey(a) === getKey(b);
}

function SelectInner<T>({
  options,
  value,
  onChange,
  multiple = false,
  searchable = false,
  placeholder = "Select...",
  label,
  labelInfo,
  error,
  showErrorMessage = true,
  loading = false,
  loadError,
  onRetry,
  disabled = false,
  getOptionKey,
  isOptionEqual: isOptionEqualProp,
  className,
  variant = "default",
  dropdownClassName,
  containerClassName,
  id: idProp,
  prefix,
  suffix,
  labelClassName,
  creatable = false,
  onSearch,
  createAction,
}: SelectProps<T>): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const getKey = useMemo(
    () => getOptionKey ?? (defaultGetOptionKey as (v: T) => string | number),
    [getOptionKey],
  );

  const isEqual = useCallback(
    (a: T, b: T) => {
      if (a === null && b === null) return true;
      if (a === undefined && b === undefined) return true;
      if (a === null || a === undefined || b === null || b === undefined)
        return false;
      return isOptionEqualProp
        ? isOptionEqualProp(a, b)
        : defaultIsOptionEqual(a, b, getKey);
    },
    [isOptionEqualProp, getKey],
  );

  const selectedValues = useMemo((): T[] => {
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const isSelected = useCallback(
    (option: SelectOption<T>) =>
      selectedValues.some((v) => isEqual(v, option.value)),
    [selectedValues, isEqual],
  );

  const filteredOptions = useMemo(() => {
    let results = options;

    if (!onSearch) {
      const q = searchQuery.trim().toLowerCase();
      results = !searchQuery.trim()
        ? options
        : options.filter((opt) => (opt.label || "").toLowerCase().includes(q));
    }

    // Handle creatable logic
    if (creatable && searchQuery.trim()) {
      const exactMatch = results.find(
        (opt) => (opt.label || "").toLowerCase() === searchQuery.trim().toLowerCase(),
      );
      if (!exactMatch) {
        // Add "Create..." option at the top
        return [
          {
            label: `Add "${searchQuery}"`,
            value: searchQuery as unknown as T,
            prefix: <Plus size={14} className="text-primary" />,
          } as SelectOption<T>,
          ...results,
        ];
      }
    }

    return results;
  }, [options, searchQuery, creatable, onSearch]);

  useOnClickOutside(containerRef, (event) => {
    if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 280; // max-h matches the existing 280px cap
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setDropdownStyle(showAbove ? {
        position: "fixed",
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      } : {
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      return;
    }
    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown itself
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    // Use capture: true to catch scrolls on nested scrollable containers
    window.addEventListener("scroll", handleScroll, { capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setHighlightedIndex(0);
    if (searchable) {
      setSearchQuery("");
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector(`[data-index="${highlightedIndex}"]`);
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlightedIndex]);

  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      if (multiple) {
        const next = isSelected(option)
          ? selectedValues.filter((v) => !isEqual(v, option.value))
          : [...selectedValues, option.value];
        (onChange as (v: T[]) => void)(next);
      } else {
        (onChange as (v: T | null) => void)(option.value);
        setIsOpen(false);
      }
    },
    [multiple, isSelected, selectedValues, isEqual, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i < filteredOptions.length - 1 ? i + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i > 0 ? i - 1 : filteredOptions.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        default:
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex, handleSelect],
  );

  const handleRemoveChip = useCallback(
    (e: React.MouseEvent, valueToRemove: T) => {
      e.stopPropagation();
      const next = selectedValues.filter((v) => !isEqual(v, valueToRemove));
      (onChange as (v: T[]) => void)(next);
    },
    [selectedValues, isEqual, onChange],
  );

  const triggerId =
    idProp ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  const isTriggerDisabled = disabled || loading;
  const isInline = variant === "inline";

  const displayLabel = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    if (multiple && selectedValues.length > 1) {
      return `${selectedValues.length} selected`;
    }
    const first = options.find((o) => isEqual(o.value, selectedValues[0]));
    return first?.label ?? placeholder;
  }, [selectedValues, multiple, options, isEqual, placeholder]);

  return (
    <div
      className={cn("w-full relative", containerClassName)}
      ref={containerRef}
    >
      {label && (
        <div className="flex items-center gap-1 mb-1">
          <label
            htmlFor={triggerId}
            className={cn(
              "block text-sm md:text-base font-normal text-foreground",
              labelClassName,
            )}
          >
            {label}
          </label>
          {labelInfo && <InfoTooltip content={labelInfo} />}
        </div>
      )}

      <div
        ref={triggerRef}
        id={triggerId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${triggerId}-listbox`}
        aria-disabled={isTriggerDisabled}
        aria-busy={loading}
        aria-label={label ?? placeholder}
        tabIndex={isTriggerDisabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !isTriggerDisabled && setIsOpen((open) => !open)}
        className={cn(
          "w-full flex text-left text-foreground focus:outline-none",
          isInline
            ? cn(
              "items-center min-h-[36px] gap-2 border-0 rounded-none bg-transparent shadow-none ring-0 text-sm",
              multiple ? "flex-wrap" : "flex-nowrap",
              "py-1 px-0 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0",
              className,
            )
            : cn(
              "items-center min-h-[44px] py-2.5 px-3 md:py-3 md:px-4 flex-wrap gap-2",
              "border-[0.5px] rounded-[4px] bg-white transition-shadow",
              className || "text-sm md:text-base",
              "focus:ring-1 focus:ring-primary",
              error ? "border-red-500 focus:ring-red-500" : "border-border-light",
              loadError && "border-red-500",
              (disabled || loading) && "cursor-not-allowed opacity-60 bg-gray-50",
              !isTriggerDisabled && "cursor-pointer hover:border-gray-400",
            ),
          isInline && error && "ring-1 ring-inset ring-red-500 focus:ring-red-500",
          isInline && loadError && "ring-1 ring-inset ring-red-500",
          isInline &&
          (disabled || loading) &&
          "cursor-not-allowed opacity-60 bg-transparent",
          isInline && !isTriggerDisabled && "cursor-pointer hover:bg-gray-50/60",
        )}
      >
        {prefix && (
          <span className="shrink-0 flex items-center gap-1">{prefix}</span>
        )}

        {multiple && selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {selectedValues.map((v) => {
              const opt = options.find((o) => isEqual(o.value, v));
              return (
                <span
                  key={getKey(v)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary max-w-full min-w-0 text-xs md:text-sm"
                >
                  <span className="truncate">{opt?.label ?? String(v)}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveChip(e, v)}
                    className="shrink-0 p-0.5 rounded hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label={`Remove ${opt?.label ?? String(v)}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <span
            className={cn(
              "flex-1 min-w-0 truncate",
              selectedValues.length === 0 && !loading && "text-gray-500",
            )}
          >
            {loading ? "Loading..." : displayLabel}
          </span>
        )}

        {suffix && (
          <span className="shrink-0 flex items-center gap-1">{suffix}</span>
        )}

        {loading ? (
          <Loader2
            size={20}
            className={cn(
              "shrink-0 text-primary animate-spin",
              isInline && "ml-auto",
            )}
            aria-hidden
          />
        ) : (
          <ChevronDown
            size={20}
            className={cn(
              "shrink-0 text-gray-500 transition-transform",
              isOpen && "rotate-180",
              isInline && "ml-auto",
            )}
          />
        )}
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className={cn(
            "select-dropdown-portal",
            "bg-white border-[0.5px] border-border-light rounded-[4px] shadow-lg",
            "max-h-[min(280px,60vh)] overflow-hidden flex flex-col",
            dropdownClassName,
          )}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-100 shrink-0">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                  onSearch?.(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                    (e.target as HTMLInputElement)?.blur?.();
                    setTimeout(() => containerRef.current?.focus(), 0);
                  }
                }}
                placeholder="Search..."
                className={cn(
                  "w-full py-2 px-3 text-sm rounded border-[0.5px] border-border-light",
                  "focus:outline-none focus:ring-1 focus:ring-primary",
                )}
                aria-label="Filter options"
              />
            </div>
          )}

          <ul
            id={`${triggerId}-listbox`}
            ref={listRef}
            role="listbox"
            aria-multiselectable={multiple}
            className="overflow-y-auto py-1 flex-1 min-h-0 custom-scrollbar"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-4 text-sm text-gray-500 text-center">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = isSelected(option);
                const highlighted = index === highlightedIndex;
                return (
                  <li
                    key={getKey(option.value)}
                    data-index={index}
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer",
                      "text-sm md:text-base transition-colors",
                      highlighted && "bg-primary/10",
                      selected && "bg-primary/5 text-primary font-medium",
                      !highlighted && !selected && "hover:bg-gray-50",
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      {option.prefix && (
                        <span className="shrink-0">{option.prefix}</span>
                      )}
                      <span className="flex flex-col min-w-0 flex-1 text-left leading-snug">
                        <span
                          className={cn(
                            "min-w-0 flex-1",
                            isInline
                              ? "whitespace-normal wrap-break-word"
                              : "truncate",
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-[10px] sm:text-xs text-secondary-text mt-0.5 whitespace-normal leading-tight">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </span>
                    {option.suffix && (
                      <span className="shrink-0 ml-2">{option.suffix}</span>
                    )}
                    {selected && (
                      <Check size={18} className="shrink-0 text-primary" />
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {createAction && (
            <div className="border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => {
                  createAction.onClick();
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 text-left",
                  "text-sm md:text-base font-medium text-foreground",
                  "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                )}
              >
                <span className="shrink-0 flex items-center">
                  {createAction.icon ?? <Plus size={16} />}
                </span>
                <span className="truncate">{createAction.label}</span>
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {showErrorMessage && (error || loadError) && (
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm text-red-500" role="alert">
            {error ?? loadError}
          </p>
          {loadError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Select<T>(props: SelectProps<T>): ReactElement {
  return <SelectInner {...props} />;
}

export default Select;
