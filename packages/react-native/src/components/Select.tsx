import { useMemo, useState, type ReactNode } from 'react';
import {
  FlatList,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button } from './Button';
import { FieldControl } from './FieldControl';
import { Icon, ArrowDown2 } from './Icon';
import { Modal } from './Modal';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';

export type SelectVariant = 'default' | 'inline';

export type SelectOption<T = string> = {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export type SelectProps<T = string> = {
  label?: string;
  error?: string;
  optionsError?: boolean;
  optionsLoading?: boolean;
  optionsLoadingLabel?: string;
  optionsErrorLabel?: string;
  onReloadOptions?: () => void;
  reloadLabel?: string;
  variant?: SelectVariant;
  options: SelectOption<T>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  value?: T | T[] | null;
  defaultValue?: T | T[] | null;
  onValueChange?: (value: T | T[] | null) => void;
  compareValue?: (a: T, b: T) => boolean;
  getOptionKey?: (option: SelectOption<T>) => string;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function defaultCompare<T>(a: T, b: T) {
  return Object.is(a, b);
}

export function Select<T = string>({
  label,
  error,
  optionsError,
  optionsLoading,
  optionsLoadingLabel = 'Loading options…',
  optionsErrorLabel = 'Could not load options',
  onReloadOptions,
  reloadLabel = 'Retry',
  options,
  placeholder = 'Select…',
  multiple = false,
  searchable = false,
  value,
  defaultValue,
  onValueChange,
  compareValue = defaultCompare,
  getOptionKey,
  disabled = false,
  prefix,
  suffix,
  style,
}: SelectProps<T>) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<T | T[] | null | undefined>(defaultValue);
  const current = controlled ? value : internal;

  const selectedOptions = useMemo(() => {
    if (current == null) return [];
    const values = Array.isArray(current) ? current : [current];
    return options.filter((opt) => values.some((v) => compareValue(opt.value, v)));
  }, [current, options, compareValue]);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q),
    );
  }, [options, query, searchable]);

  const triggerLabel =
    selectedOptions.length === 0
      ? placeholder
      : multiple
        ? selectedOptions.map((o) => o.label).join(', ')
        : selectedOptions[0]?.label;

  const setValue = (next: T | T[] | null) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const toggleOption = (option: SelectOption<T>) => {
    if (option.disabled) return;
    if (multiple) {
      const values = Array.isArray(current) ? [...current] : current != null ? [current] : [];
      const idx = values.findIndex((v) => compareValue(v, option.value));
      if (idx >= 0) values.splice(idx, 1);
      else values.push(option.value);
      setValue(values);
      return;
    }
    setValue(option.value);
    setOpen(false);
  };

  return (
    <View style={style}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <Pressable disabled={disabled} onPress={() => setOpen(true)}>
        <FieldControl
          prefix={prefix}
          suffix={
            suffix ?? <Icon icon={ArrowDown2} size="sm" color="muted" />
          }
          error={Boolean(error)}
          disabled={disabled}
        >
          <Text
            variant="open-regular-p"
            style={{
              color: selectedOptions.length ? colors.fg : colors.muted,
              paddingVertical: 10,
            }}
            numberOfLines={1}
          >
            {triggerLabel}
          </Text>
        </FieldControl>
      </Pressable>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)}>
        <View style={{ gap: 12, maxHeight: 420 }}>
          <Text variant="spline-bold-h5">{label ?? 'Select'}</Text>
          {searchable ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search…"
              placeholderTextColor={colors.muted}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.fg,
              }}
            />
          ) : null}

          {optionsLoading ? (
            <View style={{ alignItems: 'center', gap: 8, paddingVertical: 24 }}>
              <Spinner />
              <Text muted>{optionsLoadingLabel}</Text>
            </View>
          ) : optionsError ? (
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.danger }}>{optionsErrorLabel}</Text>
              {onReloadOptions ? (
                <Button size="sm" onPress={onReloadOptions}>
                  {reloadLabel}
                </Button>
              ) : null}
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item, index) =>
                getOptionKey?.(item) ?? `${String(item.value)}-${index}`
              }
              style={{ maxHeight: 280 }}
              renderItem={({ item }) => {
                const selected = selectedOptions.some((o) =>
                  compareValue(o.value, item.value),
                );
                return (
                  <Pressable
                    disabled={item.disabled}
                    onPress={() => toggleOption(item)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 4,
                      opacity: item.disabled ? 0.4 : 1,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {item.prefix}
                    <View style={{ flex: 1 }}>
                      <Text
                        variant="open-regular-p"
                        style={{ color: selected ? colors.brand : colors.fg }}
                      >
                        {item.label}
                      </Text>
                      {item.description ? (
                        <Text variant="open-regular-tiny" muted>
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                    {item.suffix}
                    {selected ? (
                      <Text variant="open-bold-p" style={{ color: colors.brand }}>
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text muted style={{ paddingVertical: 16, textAlign: 'center' }}>
                  No options
                </Text>
              }
            />
          )}

          {multiple ? (
            <Button onPress={() => setOpen(false)}>Done</Button>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

export function selectOptionsPropsFromQuery<T>(query: {
  data?: SelectOption<T>[];
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
}) {
  return {
    options: query.data ?? [],
    optionsLoading: Boolean(query.isLoading),
    optionsError: Boolean(query.isError),
    onReloadOptions: query.refetch,
  };
}
