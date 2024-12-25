import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionProfile } from './promotion.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { PromotionScheduler } from './promotion.scheduler';
import { Voucher } from 'src/voucher/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Voucher])],
  controllers: [PromotionController],
  providers: [PromotionService, PromotionProfile, PromotionScheduler],
})
export class PromotionModule {}
