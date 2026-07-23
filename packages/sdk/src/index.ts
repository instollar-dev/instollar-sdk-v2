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

export * from './core';
export * from './utils';
