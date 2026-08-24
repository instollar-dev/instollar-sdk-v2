export * from '@instollar-dev/instollar-react';

/** Explicit UI re-exports so named members resolve even when `export *` is flaky in IDEs. */
export {
  Avatar,
  getAvatarInitials,
  Segments,
  SuccessModal,
  SuccessModalIcon,
  useSuccessModal,
} from '@instollar-dev/instollar-react';
export type {
  AvatarProps,
  AvatarSize,
  OpenSuccessModalOptions,
  RouteSegmentAdapter,
  SegmentOption,
  SegmentsProps,
  SegmentsRouterAdapter,
  SuccessModalApi,
  SuccessModalProps,
} from '@instollar-dev/instollar-react';

export * from '@instollar-dev/instollar-core';
export {
  configureGooglePlacesApiKey,
  fetchPlaceAutocompleteSuggestions,
  fetchPlaceDetailsAsAddress,
  getConfiguredGooglePlacesApiKey,
  parseAddressComponents,
  resolveGooglePlacesApiKey,
  countryCodeToFlagEmoji,
  createPhoneValue,
  formatNationalNumber,
  formatPhoneValueForApi,
  toE164,
  validateNationalNumber,
} from '@instollar-dev/instollar-core';
export type { PhoneValue } from '@instollar-dev/instollar-core';
export { cn } from './utils/cn';
