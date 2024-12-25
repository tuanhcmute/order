import { Base } from 'src/app/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import {
  DiscountType,
  PromotionStatus,
  PromotionStatusEnum,
  PromotionType,
} from './promotion.constants';
import { Voucher } from 'src/voucher/voucher.entity';
import { AutoMap } from '@automapper/classes';

@Entity('promotion_tbl')
export class Promotion extends Base {
  @Column({ name: 'name_column', type: 'text' })
  @AutoMap()
  name: string;

  //   upcoming, active, expired
  @Column({ name: 'status_column', default: PromotionStatusEnum.UPCOMING })
  @AutoMap()
  status: PromotionStatus;

  // voucher, sale
  @Column({ name: 'type_column' })
  @AutoMap()
  type: PromotionType;

  //   percentage, fixed
  @Column({ name: 'discount_type_column' })
  @AutoMap()
  discountType: DiscountType;

  @Column({ name: 'discount_value_column' })
  @AutoMap()
  discountValue: number;

  @AutoMap()
  @Column({ name: 'start_date_column' })
  startDate: Date;

  @AutoMap()
  @Column({ name: 'end_date_column' })
  endDate?: Date;

  @AutoMap()
  @Column({ name: 'usage_limit_column' })
  usageLimit: number;

  @AutoMap()
  @Column({ name: 'min_purcahse_column', nullable: true, default: 0 })
  minPurchase?: number;

  @AutoMap()
  @OneToOne(() => Voucher, (v) => v.promotion)
  voucher: Voucher;
}
