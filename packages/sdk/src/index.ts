export * from '@instollar-dev/instollar-react';

/** Explicit UI re-exports so named members resolve even when `export *` is flaky in IDEs. */
export {
  Avatar,
  getAvatarInitials,
  Segments,
} from '@instollar-dev/instollar-react';
export type {
  AvatarProps,
  AvatarSize,
  RouteSegmentAdapter,
  SegmentOption,
  SegmentsProps,
  SegmentsRouterAdapter,
} from '@instollar-dev/instollar-react';

export * from './core';
export * from './utils';
