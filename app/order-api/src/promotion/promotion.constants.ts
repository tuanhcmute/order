export type PromotionStatus = 'upcoming' | 'active' | 'expired';
export type PromotionType = 'voucher' | 'sale';
export type DiscountType = 'percentage' | 'fixed';

export enum PromotionStatusEnum {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum PromotionTypeEnum {
  VOUCHER = 'voucher',
  SALE = 'sale',
}

export enum DiscountTypeEnum {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}
