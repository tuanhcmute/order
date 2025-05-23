import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const SIZE_NOT_FOUND = 'SIZE_NOT_FOUND';
export const SIZE_NAME_DOES_EXIST = 'SIZE_NAME_DOES_EXIST';
export const MUST_CHANGE_SIZE_OF_VARIANTS_BEFORE_DELETE =
  'MUST_CHANGE_SIZE_OF_VARIANTS_BEFORE_DELETE';

export type TSizeErrorCodeKey =
  | typeof SIZE_NAME_DOES_EXIST
  | typeof MUST_CHANGE_SIZE_OF_VARIANTS_BEFORE_DELETE
  | typeof SIZE_NOT_FOUND;

export type TSizeErrorCode = Record<TSizeErrorCodeKey, TErrorCodeValue>;

// 135501 - 13600
export const SizeValidation: TSizeErrorCode = {
  SIZE_NOT_FOUND: createErrorCode(135501, 'Size not found'),
  SIZE_NAME_DOES_EXIST: createErrorCode(135502, 'Size name does exist'),
  MUST_CHANGE_SIZE_OF_VARIANTS_BEFORE_DELETE: createErrorCode(
    135503,
    'Must change size of variant before delete',
  ),
};
