import type { CompanyUpdatePayload } from './onboarding.types';

/** @deprecated Prefer {@link CompanyUpdatePayload} from onboarding types. */
export type CompanyUpdateProfilePayload = CompanyUpdatePayload & {
  [key: string]: unknown;
};

export interface CompanyDashboardModel {
  [key: string]: unknown;
}
