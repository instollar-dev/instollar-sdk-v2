import { parseAddressComponents } from './parse-address-components';
import type {
  AddressComponents,
  PlaceAutocompleteSuggestion,
  PlaceDetailsResult,
} from './types';

const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const AUTOCOMPLETE_FIELD_MASK = [
  'suggestions.placePrediction.placeId',
  'suggestions.placePrediction.text',
  'suggestions.placePrediction.structuredFormat',
  'suggestions.placePrediction.types',
].join(',');

const PLACE_DETAILS_FIELD_MASK = 'id,formattedAddress,addressComponents,location';

interface AutocompleteApiResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
      types?: string[];
    };
  }>;
}

async function placesFetch<T>(
  url: string,
  apiKey: string,
  init: RequestInit & { fieldMask: string },
): Promise<T> {
  const { fieldMask, ...requestInit } = init;
  const response = await fetch(url, {
    ...requestInit,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
      ...requestInit.headers,
    },
  });

  if (!response.ok) {
    let message = `Places API request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchPlaceAutocompleteSuggestions(
  input: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<PlaceAutocompleteSuggestion[]> {
  const trimmed = input.trim();
  if (!trimmed || !apiKey) return [];

  const data = await placesFetch<AutocompleteApiResponse>(
    AUTOCOMPLETE_URL,
    apiKey,
    {
      method: 'POST',
      fieldMask: AUTOCOMPLETE_FIELD_MASK,
      signal,
      body: JSON.stringify({
        input: trimmed,
        includedRegionCodes: [],
      }),
    },
  );

  const suggestions: PlaceAutocompleteSuggestion[] = [];
  for (const item of data.suggestions ?? []) {
    const prediction = item.placePrediction;
    const placeId = prediction?.placeId;
    if (!placeId) continue;

    const mainText =
      prediction.structuredFormat?.mainText?.text?.trim() ||
      prediction.text?.text?.trim() ||
      '';
    if (!mainText) continue;

    suggestions.push({
      placeId,
      mainText,
      secondaryText: prediction.structuredFormat?.secondaryText?.text?.trim() || undefined,
      types: prediction.types,
      fullText: prediction.text?.text?.trim(),
    });
  }

  return suggestions;
}

export async function fetchPlaceDetailsAsAddress(
  placeId: string,
  apiKey: string,
  placeTypes?: string[],
  signal?: AbortSignal,
): Promise<AddressComponents> {
  const encodedId = encodeURIComponent(placeId);
  const details = await placesFetch<PlaceDetailsResult>(
    `https://places.googleapis.com/v1/places/${encodedId}`,
    apiKey,
    {
      method: 'GET',
      fieldMask: PLACE_DETAILS_FIELD_MASK,
      signal,
    },
  );

  return parseAddressComponents(details, placeTypes);
}
