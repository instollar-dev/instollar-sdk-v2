type ErrorResponseData = {
  message?: unknown;
  errors?: unknown;
};

type ErrorLike = {
  message?: unknown;
  response?: { data?: ErrorResponseData } | null;
  request?: unknown;
};

function asErrorLike(value: unknown): ErrorLike | null {
  return typeof value === 'object' && value !== null ? (value as ErrorLike) : null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  const errorLike = asErrorLike(error);
  const data = errorLike?.response?.data;
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (Array.isArray(data?.errors) && typeof data.errors[0] === 'string') {
    return data.errors[0];
  }
  if (typeof data?.errors === 'string' && data.errors) return data.errors;
  if (typeof errorLike?.message === 'string' && errorLike.message) return errorLike.message;
  return fallback;
}

export function isNetworkDisconnectError(error: unknown): boolean {
  const errorLike = asErrorLike(error);
  if (!errorLike) return false;
  if (Boolean(errorLike.request) && !errorLike.response) return true;
  if (typeof errorLike.message !== 'string') return false;
  const message = errorLike.message.toLowerCase();
  return message.includes('no response from server') || message.includes('network error');
}
