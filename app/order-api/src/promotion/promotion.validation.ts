import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const PROMOTION_NOT_FOUND = 'PROMOTION_NOT_FOUND';
export const CREATE_PROMOTION_ERROR = 'CREATE_PROMOTION_ERROR';
export const INVALID_PROMOTION_TYPE = 'INVALID_PROMOTION_TYPE';
export const INVALID_MIN_PURCHASE = 'INVALID_MIN_PURCHASE';
export const INVALID_DISCOUNT_TYPE = 'INVALID_DISCOUNT_TYPE';
export const INVALID_DISCOUNT_VALUE = 'INVALID_DISCOUNT_VALUE';
export const INVALID_START_DATE = 'INVALID_START_DATE';
export const INVALID_USAGE_LIMIT = 'INVALID_USAGE_LIMIT';
export const UPDATE_PROMOTION_ERROR = 'UPDATE_PROMOTION_ERROR';
export const INVALID_QUERY = 'INVALID_QUERY';
export const INVALID_RANGE_OF_DATE = 'INVALID_RANGE_OF_DATE';

export type TPromotionErrorCodeKey =
  | typeof PROMOTION_NOT_FOUND
  | typeof INVALID_PROMOTION_TYPE
  | typeof INVALID_MIN_PURCHASE
  | typeof INVALID_DISCOUNT_TYPE
  | typeof INVALID_DISCOUNT_VALUE
  | typeof INVALID_USAGE_LIMIT
  | typeof INVALID_START_DATE
  | typeof INVALID_QUERY
  | typeof UPDATE_PROMOTION_ERROR
  | typeof INVALID_RANGE_OF_DATE
  | typeof CREATE_PROMOTION_ERROR;

export type TPromotionErrorCode = Record<
  TPromotionErrorCodeKey,
  TErrorCodeValue
>;

// 142000 – 143000
export const PromotionValidation: TPromotionErrorCode = {
  PROMOTION_NOT_FOUND: createErrorCode(142000, 'Promotion not found'),
  CREATE_PROMOTION_ERROR: createErrorCode(
    142001,
    'Error when creating promotion',
  ),
  INVALID_PROMOTION_TYPE: createErrorCode(142002, 'Invalid promotion type'),
  INVALID_MIN_PURCHASE: createErrorCode(142003, 'Invalid min purchase'),
  INVALID_DISCOUNT_TYPE: createErrorCode(142004, 'Invalid discount type'),
  INVALID_DISCOUNT_VALUE: createErrorCode(142005, 'Invalid discount value'),
  INVALID_USAGE_LIMIT: createErrorCode(142006, 'Invalid usage limit'),
  INVALID_START_DATE: createErrorCode(142007, 'Invalid start date'),
  INVALID_QUERY: createErrorCode(142008, 'Invalid query'),
  UPDATE_PROMOTION_ERROR: createErrorCode(
    142009,
    'Error when updating promotion',
  ),
  INVALID_RANGE_OF_DATE: createErrorCode(
    142010,
    'End date cannot be before start date',
  ),
};
