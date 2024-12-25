import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Promotion } from 'src/promotion/promotion.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('voucher_tbl')
export class Voucher extends Base {
  @Column({ name: 'code_column', unique: true })
  @AutoMap()
  code: string;

  @Column({ name: 'description_column', type: 'text', nullable: true })
  @AutoMap()
  description: string;

  @OneToOne(() => Promotion, (promotion) => promotion.voucher)
  @JoinColumn({ name: 'promotion_column' })
  @AutoMap(() => Promotion)
  promotion: Promotion;
}
