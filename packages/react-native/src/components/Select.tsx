import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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

function optionMatchesQuery<T>(option: SelectOption<T>, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const label = option.label.toLowerCase();
  const description = option.description?.toLowerCase() ?? '';
  const valueKey =
    typeof option.value === 'string' || typeof option.value === 'number'
      ? String(option.value).toLowerCase()
      : '';
  const queryDigits = q.replace(/\D/g, '');
  const labelDigits = label.replace(/\D/g, '');

  return (
    label.includes(q) ||
    description.includes(q) ||
    valueKey.includes(q) ||
    (queryDigits.length > 0 && labelDigits.includes(queryDigits))
  );
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
    return options.filter((o) => optionMatchesQuery(o, query));
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
  /** Prefer the tallest snap so keyboard search still leaves room for options. */
  const initialIndex = searchable ? Math.max(0, snapPoints.length - 1) : 0;

  const setValue = (next: T | T[] | null) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const closeSheet = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

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

      {/*
        Use BottomSheetScrollView (not FlatList) for option lists.
        FlatList nested under sheet layouts often collapses to 0 height /
        loses items when the keyboard opens — bad for PhoneInput country search.
        Country / form option lists are small enough for ScrollView.
      */}
      <BottomSheet
        open={open}
        onClose={closeSheet}
        title={label ?? 'Select'}
        snapPoints={snapPoints}
        index={initialIndex}
        scrollable
        modalProps={{
          keyboardBehavior: 'interactive',
          keyboardBlurBehavior: 'restore',
          android_keyboardInputMode: 'adjustResize',
        }}
      >
        <View style={{ gap: 12 }}>
          {searchable ? (
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search country or code…"
              placeholderTextColor={colors.muted}
              autoCorrect={false}
              autoCapitalize="none"
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
          ) : filtered.length === 0 ? (
            <Text muted style={{ paddingVertical: 16, textAlign: 'center' }}>
              No options
            </Text>
          ) : (
            filtered.map((item, index) => {
              const selected = selectedOptions.some((o) =>
                compareValue(o.value, item.value),
              );
              const key =
                getOptionKey?.(item) ?? `${String(item.value)}-${index}`;
              return (
                <Pressable
                  key={key}
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
            })
          )}

          {multiple ? (
            <Button onPress={closeSheet} style={{ marginTop: 8 }}>
              Done
            </Button>
          ) : null}
        </View>
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
