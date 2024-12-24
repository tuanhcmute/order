import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const MENU_ITEM_NOT_FOUND = 'MENU_ITEM_NOT_FOUND';
export const MENU_ITEM_EXIST = 'MENU_ITEM_EXIST';

export type TMenuItemErrorCodeKey =
  | typeof MENU_ITEM_NOT_FOUND
  | typeof MENU_ITEM_EXIST;

export type TMenuItemErrorCode = Record<TMenuItemErrorCodeKey, TErrorCodeValue>;

// 113000 - 114000
export const MenuItemValidation: TMenuItemErrorCode = {
  MENU_ITEM_NOT_FOUND: createErrorCode(113000, 'Menu item not found'),
  MENU_ITEM_EXIST: createErrorCode(113001, 'Menu item existed'),
};