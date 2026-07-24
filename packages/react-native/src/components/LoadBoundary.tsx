import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Alert } from './Alert';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';

export type LoadBoundaryProps = {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isStale?: boolean;
  permitted?: boolean;
  error?: unknown;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  staleMessage?: string;
  forbiddenTitle?: string;
  forbiddenMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  refreshLabel?: string;
  minHeight?: number;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  forbiddenFallback?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function loadBoundaryPropsFromQuery(query: {
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  isFetched?: boolean;
  error?: unknown;
  refetch?: () => void;
}) {
  return {
    isLoading: Boolean(query.isLoading),
    isError: Boolean(query.isError),
    isStale: Boolean(query.isFetching && query.isFetched),
    error: query.error,
    onRetry: query.refetch,
  };
}

export function LoadBoundary({
  children,
  isLoading,
  isError,
  isStale,
  permitted = true,
  error,
  loadingMessage = 'Loading…',
  errorTitle = 'Something went wrong',
  errorMessage = 'Please try again.',
  staleMessage = 'Showing older data. Refresh to update.',
  forbiddenTitle = 'Access denied',
  forbiddenMessage = 'You do not have permission to view this content.',
  onRetry,
  retryLabel = 'Try again',
  refreshLabel = 'Refresh',
  minHeight = 160,
  loadingFallback,
  errorFallback,
  forbiddenFallback,
  style,
}: LoadBoundaryProps) {
  const colors = useThemeColors();

  if (!permitted) {
    return (
      <View style={[{ minHeight, justifyContent: 'center', gap: 12 }, style]}>
        {forbiddenFallback ?? (
          <>
            <Alert variant="warning" title={forbiddenTitle}>
              {forbiddenMessage}
            </Alert>
          </>
        )}
      </View>
    );
  }

  if (isLoading && !isStale) {
    return (
      <View style={[{ minHeight, alignItems: 'center', justifyContent: 'center', gap: 12 }, style]}>
        {loadingFallback ?? (
          <>
            <Spinner />
            <Text muted>{loadingMessage}</Text>
          </>
        )}
      </View>
    );
  }

  if (isError && !isStale) {
    return (
      <View style={[{ minHeight, justifyContent: 'center', gap: 12 }, style]}>
        {errorFallback ?? (
          <>
            <Alert variant="error" title={errorTitle}>
              {typeof error === 'string' ? error : errorMessage}
            </Alert>
            {onRetry ? (
              <Button size="sm" onPress={onRetry}>
                {retryLabel}
              </Button>
            ) : null}
          </>
        )}
      </View>
    );
  }

  return (
    <View style={[{ position: 'relative' }, style]}>
      {isStale ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: colors.bg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Text variant="open-regular-tiny" muted style={{ flex: 1 }}>
            {staleMessage}
          </Text>
          {onRetry ? (
            <Button size="sm" variant="underline" onPress={onRetry}>
              {refreshLabel}
            </Button>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
