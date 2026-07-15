// Auto-generated from API_ENDPOINTS.md
export type { EndpointRow, EndpointSection, EndpointDomain } from './types';
export { authDomain } from './auth';
export { sharedDomain } from './shared';
export { adminDomain } from './admin';
export { companyDomain } from './company';
export { installerDomain } from './installer';

import { authDomain } from './auth';
import { sharedDomain } from './shared';
import { adminDomain } from './admin';
import { companyDomain } from './company';
import { installerDomain } from './installer';

export const apiEndpointDomains = [
  authDomain,
  sharedDomain,
  adminDomain,
  companyDomain,
  installerDomain,
];

export const apiBaseUrls = [
  { alias: 'BASE', env: 'VITE_API_BASE_URL', usage: 'Auth, user CRUD, upload, legacy paths' },
  { alias: 'ADMIN', env: 'VITE_API_ADMIN_BASE_URL', usage: 'Admin portal service' },
  { alias: 'COMPANY', env: 'VITE_API_COMPANY_BASE_URL', usage: 'Company portal service' },
  { alias: 'INSTALLER', env: 'VITE_API_INSTOLLER_BASE_URL', usage: 'Installer portal service' },
] as const;
