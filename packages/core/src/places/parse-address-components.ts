import { COUNTRIES } from '../core/app/countries/countries';
import type { AddressComponents, GoogleAddressComponent, PlaceDetailsResult } from './types';

function componentWithType(
  components: GoogleAddressComponent[] | undefined,
  type: string,
): GoogleAddressComponent | undefined {
  return components?.find((component) => component.types?.includes(type));
}

function componentText(component: GoogleAddressComponent | undefined): string {
  if (!component) return '';
  return (component.longText ?? component.shortText ?? '').trim();
}

function joinNonEmpty(parts: string[], separator: string): string {
  return parts.map((part) => part.trim()).filter(Boolean).join(separator);
}

export function parseAddressComponents(
  details: PlaceDetailsResult,
  placeTypes?: string[],
): AddressComponents {
  const components = details.addressComponents;
  const streetNumber = componentText(componentWithType(components, 'street_number'));
  const route = componentText(componentWithType(components, 'route'));
  const locality = componentText(componentWithType(components, 'locality'));
  const neighborhood = componentText(componentWithType(components, 'neighborhood'));
  const landmarkType = componentText(componentWithType(components, 'landmark'));

  const city = locality || neighborhood;
  const landmark = landmarkType || neighborhood;
  const countryName = componentText(componentWithType(components, 'country'));
  const countryShort = componentWithType(components, 'country')?.shortText ?? '';
  const countryCode =
    COUNTRIES.find(
      (c) => c.name === countryName || c.countryCode === countryShort,
    )?.countryCode ?? countryShort;

  const lga =
    componentText(componentWithType(components, 'administrative_area_level_2')) ||
    city ||
    undefined;

  return {
    street: joinNonEmpty([streetNumber, route], ' ') || undefined,
    city: city || undefined,
    state: componentText(componentWithType(components, 'administrative_area_level_1')) || undefined,
    lga,
    postalCode: componentText(componentWithType(components, 'postal_code')) || undefined,
    country: countryName || undefined,
    countryCode: countryCode || undefined,
    landmark: landmark || undefined,
    latitude: details.location?.latitude,
    longitude: details.location?.longitude,
    formattedAddress: details.formattedAddress,
    placeTypes: placeTypes?.length ? [...placeTypes] : undefined,
  };
}
