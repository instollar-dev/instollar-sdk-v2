import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  StartAssessmentPayload,
  SubmitAssessmentModel,
  SubmitAssessmentPayload,
} from './assessment.types';

export const installerAssessmentApi = {
  startAssessment: (
    payload: StartAssessmentPayload = {},
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.assessmentStart),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  submitAssessment: (
    payload: SubmitAssessmentPayload,
  ): Promise<ApiResponse<SubmitAssessmentModel>> =>
    unwrap(
      api.post<ApiResponse<SubmitAssessmentModel>>(
        apiUrl('installer', installerPaths.assessmentSubmit),
        payload,
        {},
        { showSuccessToast: true, showErrorToast: false },
      ),
    ),
};
