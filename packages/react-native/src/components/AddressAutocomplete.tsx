import {
  fetchPlaceAutocompleteSuggestions,
  fetchPlaceDetailsAsAddress,
  resolveGooglePlacesApiKey,
  type AddressComponents,
  type PlaceAutocompleteSuggestion,
} from '@instollar-dev/instollar-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Input } from './Input';
import { Location } from './Icon';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;

export type AddressAutocompleteProps = {
  value: string;
  onChangeText: (value: string) => void;
  onPlaceSelect: (address: AddressComponents) => void;
  apiKey?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export function AddressAutocomplete({
  value,
  onChangeText,
  onPlaceSelect,
  apiKey,
  label = 'Address',
  placeholder = 'Start typing your address',
  disabled = false,
  helperText,
  error,
  style,
}: AddressAutocompleteProps) {
  const colors = useThemeColors();
  const resolvedKey = resolveGooglePlacesApiKey(apiKey);

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceAutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>();
  const [focused, setFocused] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const detailsAbortRef = useRef<AbortController | null>(null);
  const selectingRef = useRef(false);
  /** Skip one autocomplete pass after a place is chosen (avoids refetching the filled address). */
  const skipNextFetchRef = useRef(false);

  const displayError = error ?? apiError;
  const showDropdown = open && focused && suggestions.length > 0 && !disabled;

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setOpen(false);
  }, []);

  useEffect(() => {
    const trimmed = value.trim();

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      return;
    }

    if (!trimmed || trimmed.length < MIN_QUERY_LENGTH || !resolvedKey || disabled) {
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      clearSuggestions();
      return;
    }

    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setApiError(undefined);

      fetchPlaceAutocompleteSuggestions(trimmed, resolvedKey, controller.signal)
        .then((next) => {
          if (controller.signal.aborted) return;
          setSuggestions(next);
          setOpen(next.length > 0);
        })
        .catch((fetchError: unknown) => {
          if (controller.signal.aborted) return;
          clearSuggestions();
          const message =
            fetchError instanceof Error ? fetchError.message : 'Could not load suggestions';
          setApiError(message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, resolvedKey, disabled, clearSuggestions]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      detailsAbortRef.current?.abort();
    },
    [],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      // Typing means the field is active again — even if we cleared `focused`
      // after a previous selection while the native input stayed focused.
      selectingRef.current = false;
      skipNextFetchRef.current = false;
      setFocused(true);
      onChangeText(text);
    },
    [onChangeText],
  );

  const selectSuggestion = useCallback(
    async (suggestion: PlaceAutocompleteSuggestion) => {
      if (!resolvedKey || disabled) return;

      selectingRef.current = true;
      skipNextFetchRef.current = true;
      setOpen(false);
      clearSuggestions();
      setLoading(true);
      setApiError(undefined);
      triggerHapticFeedback('selection');

      const display =
        suggestion.fullText ||
        [suggestion.mainText, suggestion.secondaryText].filter(Boolean).join(', ');
      onChangeText(display);

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
          // Parent often writes a slightly different formatted address; skip the
          // follow-up autocomplete fetch so suggestions don't reopen after pick.
          skipNextFetchRef.current = true;
          onPlaceSelect(address);
          setFocused(false);
          setOpen(false);
          setSuggestions([]);
        }
      } catch (fetchError: unknown) {
        if (!controller.signal.aborted) {
          const message =
            fetchError instanceof Error ? fetchError.message : 'Could not load place details';
          setApiError(message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
        // Keep the guard briefly so a late Input blur from keyboard dismiss
        // cannot race and remount/clear mid-select on some devices.
        setTimeout(() => {
          selectingRef.current = false;
        }, 0);
      }
    },
    [resolvedKey, disabled, clearSuggestions, onChangeText, onPlaceSelect],
  );

  return (
    <View style={[styles.root, showDropdown ? styles.rootElevated : null, style]}>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        editable={!disabled}
        onChangeText={handleChangeText}
        onFocus={() => {
          setFocused(true);
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => {
          // Blur fires before suggestion onPress on iOS. Delay close so the
          // press can mark selectingRef / run selectSuggestion first.
          setTimeout(() => {
            if (selectingRef.current) return;
            setFocused(false);
            setOpen(false);
          }, 180);
        }}
        error={displayError}
        suffix={loading ? <Spinner size={16} /> : undefined}
      />

      {!resolvedKey && !displayError ? (
        <Text variant="open-regular-tiny" muted>
          Google Places API key is not configured.
        </Text>
      ) : null}

      {helperText && !displayError ? (
        <Text variant="open-regular-tiny" muted>
          {helperText}
        </Text>
      ) : null}

      {showDropdown ? (
        <View
          style={[
            styles.dropdown,
            {
              borderColor: colors.border,
              backgroundColor: colors.bg,
            },
            Platform.OS === 'ios' ? styles.dropdownShadowIos : styles.dropdownShadowAndroid,
          ]}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            style={styles.list}>
            {suggestions.map((item, index) => (
              <DismissKeyboardPressable
                key={item.placeId}
                // Do not dismiss the keyboard on press-in — that blurs the
                // input and unmounts this list before onPress can fire.
                dismissKeyboard={false}
                accessibilityRole="button"
                onPressIn={() => {
                  selectingRef.current = true;
                }}
                onPress={() => void selectSuggestion(item)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: pressed ? colors.secondary : colors.bg,
                    borderBottomColor: colors.border,
                  },
                  index === suggestions.length - 1 ? styles.optionLast : null,
                ]}>
                <View style={[styles.optionIcon, { backgroundColor: colors.secondary }]}>
                  <Location size={16} color={colors.destructive} variant="Bold" />
                </View>
                <View style={styles.optionCopy}>
                  <Text variant="open-regular-p" style={{ color: colors.fg, fontWeight: '600' }}>
                    {item.mainText}
                  </Text>
                  {item.secondaryText ? (
                    <Text variant="open-regular-tiny" muted numberOfLines={2}>
                      {item.secondaryText}
                    </Text>
                  ) : null}
                </View>
              </DismissKeyboardPressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 6,
    zIndex: 1,
  },
  rootElevated: {
    zIndex: 30,
    elevation: 30,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 240,
    overflow: 'hidden',
    zIndex: 40,
  },
  dropdownShadowIos: {
    shadowColor: '#012B15',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  dropdownShadowAndroid: {
    elevation: 12,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
});
