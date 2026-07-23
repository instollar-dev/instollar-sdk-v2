import { describe, expect, it } from 'vitest';
import { parseAddressComponents, type PlaceDetailsResult } from '../places';

describe('parseAddressComponents', () => {
  it('maps Google address component types to AddressComponents', () => {
    const details: PlaceDetailsResult = {
      id: 'places/ChIJ…',
      formattedAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
      location: { latitude: 37.422, longitude: -122.084 },
      addressComponents: [
        { longText: '1600', types: ['street_number'] },
        { longText: 'Amphitheatre Parkway', types: ['route'] },
        { longText: 'Mountain View', types: ['locality'] },
        { longText: 'Santa Clara County', types: ['administrative_area_level_2'] },
        { shortText: 'CA', longText: 'California', types: ['administrative_area_level_1'] },
        { longText: '94043', types: ['postal_code'] },
        { longText: 'United States', shortText: 'US', types: ['country'] },
      ],
    };

    expect(parseAddressComponents(details, ['street_address'])).toEqual({
      street: '1600 Amphitheatre Parkway',
      city: 'Mountain View',
      state: 'California',
      lga: 'Santa Clara County',
      postalCode: '94043',
      country: 'United States',
      landmark: undefined,
      latitude: 37.422,
      longitude: -122.084,
      formattedAddress: details.formattedAddress,
      placeTypes: ['street_address'],
    });
  });

  it('falls back to neighborhood for city and landmark', () => {
    const details: PlaceDetailsResult = {
      id: 'x',
      addressComponents: [
        { longText: 'Victoria Island', types: ['neighborhood'] },
        { longText: 'Lagos', types: ['administrative_area_level_1'] },
      ],
    };

    const parsed = parseAddressComponents(details);
    expect(parsed.city).toBe('Victoria Island');
    expect(parsed.landmark).toBe('Victoria Island');
    expect(parsed.state).toBe('Lagos');
  });
});
