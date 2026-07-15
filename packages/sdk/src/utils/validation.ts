import type { z, ZodSchema } from 'zod';

export type ValidationResult<T> =
  | { success: true; data: T; fieldErrors: Record<string, never> }
  | { success: false; data: null; fieldErrors: Record<string, string> };

export function validateForm<T>(
  schema: ZodSchema<T>,
  data: unknown,
): ValidationResult<T> {
  const parsed = schema.safeParse(data);
  if (parsed.success) {
    return { success: true, data: parsed.data, fieldErrors: {} };
  }

  const fieldErrors: Record<string, string> = {};
  const flattened = parsed.error.flatten();
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages[0]) {
      fieldErrors[key] = String(messages[0]);
    } else if (typeof messages === 'string') {
      fieldErrors[key] = messages;
    }
  }
  return { success: false, data: null, fieldErrors };
}

export type InferSchema<Schema extends ZodSchema> = z.infer<Schema>;
