export interface NormalizedSelectOption {
  label: string;
  value: string;
  description?: string;
}

export function toSelectOptions(
  items: (string | number | { value: string | number; label: string; description?: string })[],
): NormalizedSelectOption[] {
  return items.map((item) => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return { label: item.label, value: String(item.value), description: item.description };
    }
    return { label: String(item), value: String(item) };
  });
}
