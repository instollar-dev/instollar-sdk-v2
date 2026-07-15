export type { EndpointRow, EndpointSection, EndpointDomain } from './api/catalog';
export { apiEndpointDomains, apiBaseUrls } from './api/catalog';

export const apiSetupSnippet = `import { initInstollarSDK, authApi, companyApi } from '@codearemo/instollar-sdk';

initInstollarSDK({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseUrls: {
    admin: import.meta.env.VITE_API_ADMIN_BASE_URL,
    company: import.meta.env.VITE_API_COMPANY_BASE_URL,
    installer: import.meta.env.VITE_API_INSTOLLER_BASE_URL,
  },
  autoStorage: true,
});

const login = await authApi.login({ email, password });
const profile = await companyApi.getCompanyProfile();`;

export const apiResponseSnippet = `// Inner payload types end with Model — e.g. LoginModel, CompanyProfileModel
type ApiResponse<T> = {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
};

// Lists use PaginatedApiResponse<JobRequestModel>, etc.
type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

const login: ApiResponse<LoginModel> = await authApi.login({ email, password });
const profile: ApiResponse<CompanyProfileModel> = await companyApi.getCompanyProfile();`;
