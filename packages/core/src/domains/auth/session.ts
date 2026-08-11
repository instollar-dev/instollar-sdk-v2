import type { TokenData } from '../../core/types';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
  StorageKeys,
} from '../../core/storage';
import type { AuthSessionInput, UserType } from './types';

function normalizeUserType(
  userType: string | null | undefined,
): UserType | string | undefined {
  if (userType == null) return undefined;
  const trimmed = String(userType).trim();
  if (!trimmed) return undefined;
  return trimmed.toUpperCase();
}

/** Persist `{ token, refreshToken, userType? }` under `StorageKeys.TOKEN_DATA`. */
export async function saveAuthSession(input: AuthSessionInput): Promise<TokenData> {
  const existing = await getFromStorage<TokenData>(StorageKeys.TOKEN_DATA);
  const next: TokenData = {
    token: input.token ?? existing?.token,
    refreshToken: input.refreshToken ?? existing?.refreshToken,
    userType:
      normalizeUserType(input.userType) ??
      normalizeUserType(existing?.userType as string | undefined),
  };
  await saveToStorage(StorageKeys.TOKEN_DATA, next);
  return next;
}

export async function getAuthSession(): Promise<TokenData | null> {
  return getFromStorage<TokenData>(StorageKeys.TOKEN_DATA);
}

export async function clearAuthSession(): Promise<void> {
  await removeFromStorage(StorageKeys.TOKEN_DATA);
}
