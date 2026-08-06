import { useMemo, useState, type ReactNode } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Button } from './Button';
import { FieldControl } from './FieldControl';
import { Icon, ArrowDown2, TickCircle } from './Icon';
import { BottomSheet } from './BottomSheet';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle, fieldControlTextStyle } from '../styles/formStyles';
import { triggerHapticFeedback } from '../utils/haptics';

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
  /**
   * Color for the selected trigger label and selected option accent.
   * Defaults to theme `fg` (trigger) / `brand` (list check).
   */
  selectedColor?: string;
  /** Sheet snap points. Default: `['55%', '90%']`. */
  snapPoints?: (string | number)[];
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
  selectedColor,
  snapPoints = ['55%', '90%'],
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
    return options.filter((o) => {
      const valueKey =
        typeof o.value === 'string' || typeof o.value === 'number'
          ? String(o.value).toLowerCase()
          : '';
      return (
        o.label.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        valueKey.includes(q)
      );
    });
  }, [options, query, searchable]);

  const triggerLabel =
    selectedOptions.length === 0
      ? placeholder
      : multiple
        ? selectedOptions.map((o) => o.label).join(', ')
        : selectedOptions[0]?.label;

  const triggerColor = selectedOptions.length
    ? (selectedColor ?? colors.fg)
    : colors.muted;
  const optionAccent = selectedColor ?? colors.brand;

  const setValue = (next: T | T[] | null) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const closeSheet = () => {
    setOpen(false);
    setQuery('');
  };

  const toggleOption = (option: SelectOption<T>) => {
    if (option.disabled) return;
    triggerHapticFeedback('selection');
    if (multiple) {
      const values = Array.isArray(current) ? [...current] : current != null ? [current] : [];
      const idx = values.findIndex((v) => compareValue(v, option.value));
      if (idx >= 0) values.splice(idx, 1);
      else values.push(option.value);
      setValue(values);
      return;
    }
    setValue(option.value);
    closeSheet();
  };

  return (
    <View style={style}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          if (!disabled) triggerHapticFeedback('light');
        }}
        onPress={() => setOpen(true)}
      >
        <FieldControl
          prefix={prefix}
          suffix={
            suffix ?? <Icon icon={ArrowDown2} size="sm" color="muted" />
          }
          error={Boolean(error)}
          disabled={disabled}
          style={{ height: 44 }}
        >
          <Text
            variant="open-regular-p"
            style={[{ color: triggerColor }, fieldControlTextStyle]}
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

      <BottomSheet
        open={open}
        onClose={closeSheet}
        title={label ?? 'Select'}
        snapPoints={snapPoints}
        scrollable={false}
        contentContainerStyle={{ flex: 1, maxHeight: '100%' }}
      >
        {searchable ? (
          <BottomSheetTextInput
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
              marginBottom: 8,
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
          <BottomSheetFlatList
            data={filtered}
            keyExtractor={(item, index) =>
              getOptionKey?.(item) ?? `${String(item.value)}-${index}`
            }
            style={{ flexGrow: 1 }}
            contentContainerStyle={{ paddingBottom: multiple ? 8 : 24 }}
            keyboardShouldPersistTaps="handled"
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
                    gap: 10,
                  }}
                >
                  {item.prefix}
                  <View style={{ flex: 1 }}>
                    <Text
                      variant="open-regular-p"
                      style={{ color: selected ? optionAccent : colors.fg }}
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
                    <TickCircle size={20} color={optionAccent} variant="Bold" />
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
          <Button onPress={closeSheet} style={{ marginTop: 8 }}>
            Done
          </Button>
        ) : null}
      </BottomSheet>
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
