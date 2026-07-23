let configuredGooglePlacesApiKey: string | undefined;

export function configureGooglePlacesApiKey(apiKey: string | undefined): void {
  configuredGooglePlacesApiKey = apiKey?.trim() || undefined;
}

export function getConfiguredGooglePlacesApiKey(): string | undefined {
  return configuredGooglePlacesApiKey;
}

export function resolveGooglePlacesApiKey(propKey?: string): string | undefined {
  const fromProp = propKey?.trim();
  if (fromProp) return fromProp;
  return configuredGooglePlacesApiKey;
}
