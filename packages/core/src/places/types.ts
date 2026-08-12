export interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  lga?: string;
  postalCode?: string;
  country?: string;
  /** ISO 3166-1 alpha-2 when resolved from the country component. */
  countryCode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  placeTypes?: string[];
}

export interface GoogleAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
  languageCode?: string;
}

export interface PlaceAutocompleteSuggestion {
  placeId: string;
  mainText: string;
  secondaryText?: string;
  types?: string[];
  fullText?: string;
}

export interface PlaceDetailsResult {
  id: string;
  formattedAddress?: string;
  addressComponents?: GoogleAddressComponent[];
  location?: { latitude?: number; longitude?: number };
}
