import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';
import {
  DiscountType,
  DiscountTypeEnum,
  PromotionStatus,
  PromotionType,
  PromotionTypeEnum,
} from './promotion.constants';
import { Transform, Type } from 'class-transformer';
import { PromotionException } from './promotion.exception';
import {
  INVALID_DISCOUNT_TYPE,
  INVALID_DISCOUNT_VALUE,
  INVALID_MIN_PURCHASE,
  INVALID_PROMOTION_TYPE,
  INVALID_START_DATE,
  INVALID_USAGE_LIMIT,
  PromotionValidation,
} from './promotion.validation';
import { CreateVoucherDto } from 'src/voucher/voucher.dto';

export class CreatePromotionDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty({ message: INVALID_PROMOTION_TYPE })
  @Transform(({ value }) => {
    const type = Object.values(PromotionTypeEnum).find(
      (type) => type === value,
    );
    if (!type) {
      throw new PromotionException(PromotionValidation.INVALID_PROMOTION_TYPE);
    }
    return type;
  })
  type: PromotionType;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty({ message: INVALID_DISCOUNT_TYPE })
  @Transform(({ value }) => {
    const type = Object.values(DiscountTypeEnum).find((type) => type === value);
    if (!type) {
      throw new PromotionException(PromotionValidation.INVALID_DISCOUNT_TYPE);
    }
    return type;
  })
  discountType: DiscountType;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty({ message: INVALID_DISCOUNT_VALUE })
  discountValue: number;

  @AutoMap()
  @ApiProperty({
    example: '2024-10-20',
  })
  @IsNotEmpty({ message: INVALID_START_DATE })
  @Type(() => Date)
  startDate: Date;

  @AutoMap()
  @ApiProperty({
    example: '2024-10-20',
  })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty({ message: INVALID_USAGE_LIMIT })
  usageLimit: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty({ message: INVALID_MIN_PURCHASE })
  minPurchase: number;

  @ApiProperty()
  @IsOptional()
  voucher: CreateVoucherDto;
}

export class GetPromotionDto {
  @AutoMap()
  @ApiProperty({ required: false })
  slug: string;
}

export class UpdatePromotionDto extends CreatePromotionDto {}

export class PromotionResponseDto extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  name: string;

  //   upcoming, active, expired
  @ApiProperty()
  @AutoMap()
  status: PromotionStatus;

  // voucher, sale
  @ApiProperty()
  @AutoMap()
  type: PromotionType;

  //   percentage, fixed
  @AutoMap()
  @ApiProperty()
  discountType: DiscountType;

  @AutoMap()
  @ApiProperty()
  discountValue: number;

  @AutoMap()
  @ApiProperty()
  startDate: Date;

  @AutoMap()
  @ApiProperty()
  endDate?: Date;

  @AutoMap()
  @ApiProperty()
  usageLimit: number;

  @AutoMap()
  @ApiProperty()
  minPurchase?: number;
}
