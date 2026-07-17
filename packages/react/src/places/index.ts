export type {
  AddressComponents,
  GoogleAddressComponent,
  PlaceAutocompleteSuggestion,
  PlaceDetailsResult,
} from './types';
export { parseAddressComponents } from './parse-address-components';
export {
  fetchPlaceAutocompleteSuggestions,
  fetchPlaceDetailsAsAddress,
} from './google-places-client';
export {
  configureGooglePlacesApiKey,
  getConfiguredGooglePlacesApiKey,
  resolveGooglePlacesApiKey,
} from './config';
