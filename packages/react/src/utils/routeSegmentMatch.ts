/** Shared router adapter for Tabs / Segments route mode. */
export interface RouteSegmentAdapter {
  /** Current location.pathname */
  pathname: string;
  navigate: (path: string, opts?: { replace?: boolean }) => void;
}

export function normalizeBasePath(basePath: string): string {
  return basePath.replace(/\/+$/, '');
}

/** Pathname relative to basePath, or null when the pathname is outside basePath entirely. */
export function getRelativePath(pathname: string, basePath: string): string | null {
  const base = normalizeBasePath(basePath);
  if (pathname === base) return '';
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length).replace(/^\/+/, '');
  return null;
}

export function matchesRelativePath(
  item: { value: string; path?: string },
  relativePath: string,
): boolean {
  if (item.path === undefined) return item.value === relativePath;
  if (item.path === '') return relativePath === '';
  return relativePath === item.path || relativePath.startsWith(`${item.path}/`);
}

export function getRouteTargetPath(
  item: { value: string; path?: string },
  basePath: string,
): string {
  const base = normalizeBasePath(basePath);
  const segment = item.path ?? item.value;
  return segment === '' ? base : `${base}/${segment}`;
}
