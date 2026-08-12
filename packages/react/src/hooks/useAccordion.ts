import { useCallback, useMemo, useState } from 'react';

export type AccordionType = 'single' | 'multiple';

export type UseAccordionOptions = {
  type?: AccordionType;
  collapsible?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
};

function normalizeSingle(value: string | string[] | null | undefined): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function normalizeMultiple(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function useAccordion({
  type = 'single',
  collapsible = true,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
}: UseAccordionOptions = {}) {
  const controlled = controlledValue !== undefined;
  const [internalSingle, setInternalSingle] = useState<string | null>(() =>
    normalizeSingle(defaultValue),
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(() =>
    normalizeMultiple(defaultValue),
  );

  const openSingle = controlled
    ? normalizeSingle(controlledValue)
    : internalSingle;
  const openMultiple = controlled
    ? normalizeMultiple(controlledValue)
    : internalMultiple;

  const isOpen = useCallback(
    (itemValue: string) =>
      type === 'single'
        ? openSingle === itemValue
        : openMultiple.includes(itemValue),
    [type, openSingle, openMultiple],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const next =
          openSingle === itemValue
            ? collapsible
              ? null
              : itemValue
            : itemValue;
        if (!controlled) setInternalSingle(next);
        onValueChange?.(next);
        return;
      }

      const next = openMultiple.includes(itemValue)
        ? openMultiple.filter((v) => v !== itemValue)
        : [...openMultiple, itemValue];
      if (!controlled) setInternalMultiple(next);
      onValueChange?.(next);
    },
    [type, collapsible, openSingle, openMultiple, controlled, onValueChange],
  );

  return useMemo(
    () => ({
      type,
      collapsible,
      isOpen,
      toggle,
      openValue: type === 'single' ? openSingle : openMultiple,
    }),
    [type, collapsible, isOpen, toggle, openSingle, openMultiple],
  );
}

export type UseAccordionReturn = ReturnType<typeof useAccordion>;
