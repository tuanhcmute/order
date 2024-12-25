import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { PromotionStatusEnum } from './promotion.constants';

@Injectable()
export class PromotionScheduler {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,

    private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleUpdatePromotionStatus() {
    const context = `${PromotionScheduler.name}.${this.handleUpdatePromotionStatus.name}`;

    const promotions = await this.promotionRepository.find({});
    this.logger.log(`Found promotions: ${promotions.length}`, context);

    const currentDate = moment();
    const updatedPromotions = await Promise.all(
      promotions.map(async (p) => {
        const startOfDate = moment(p.startDate).startOf('day');
        const endOfDate = moment(p.endDate).endOf('day');

        // Check if the current date is between the start date and end date
        if (
          currentDate.isBetween(startOfDate, endOfDate) &&
          p.status !== PromotionStatusEnum.ACTIVE
        )
          p.status = PromotionStatusEnum.ACTIVE;

        // Check if the current data is before the start date
        if (
          currentDate.isBefore(startOfDate) &&
          p.status !== PromotionStatusEnum.UPCOMING
        )
          p.status = PromotionStatusEnum.UPCOMING;

        // Check if the current date is after the end date
        if (
          currentDate.isAfter(endOfDate) &&
          p.status !== PromotionStatusEnum.EXPIRED
        )
          p.status = PromotionStatusEnum.EXPIRED;
        return p;
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(updatedPromotions);
      await queryRunner.commitTransaction();
      this.logger.log(`Updated promotions successfully`, context);
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error when updating promotion status: ${err.message}`,
        err.stack,
        context,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
