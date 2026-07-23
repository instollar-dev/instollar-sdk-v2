import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  StoreOrderListModel,
  StoreOverviewModel,
  StoreProductListModel,
  StoreProductModel,
} from './store-mesh.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyStoreFrontApi = {
  getStoreOverviewAndOrders: (): Promise<ApiResponse<StoreOverviewModel>> =>
    unwrap(
      api.get<ApiResponse<StoreOverviewModel>>(
        apiUrl('base', basePaths.storeFrontOverview),
        {},
        {},
        silent,
      ),
    ),

  getStoreOrders: (): Promise<ApiResponse<StoreOrderListModel>> =>
    unwrap(
      api.get<ApiResponse<StoreOrderListModel>>(
        apiUrl('base', basePaths.storeFrontOrders),
        {},
        {},
        silent,
      ),
    ),

  getProducts: (): Promise<ApiResponse<StoreProductListModel>> =>
    unwrap(
      api.get<ApiResponse<StoreProductListModel>>(
        apiUrl('base', basePaths.storeFrontProducts),
        {},
        {},
        silent,
      ),
    ),

  getProductById: (id: string): Promise<ApiResponse<StoreProductModel>> =>
    unwrap(
      api.get<ApiResponse<StoreProductModel>>(
        apiUrl('base', basePaths.storeFrontProduct(id)),
        {},
        {},
        silent,
      ),
    ),
};
