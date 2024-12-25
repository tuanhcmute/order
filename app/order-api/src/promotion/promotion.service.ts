import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreatePromotionDto,
  GetPromotionDto,
  PromotionResponseDto,
  UpdatePromotionDto,
} from './promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PromotionException } from './promotion.exception';
import { PromotionValidation } from './promotion.validation';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Voucher } from 'src/voucher/voucher.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const context = `${PromotionService.name}.${this.create.name}`;
    // Validate start date, end date
    const startOfDate = moment(createPromotionDto.startDate).startOf('day');
    const endOfDate = moment(createPromotionDto.endDate).endOf('day');

    if (endOfDate.isBefore(startOfDate)) {
      this.logger.error(`End date cannot be before start date`, null, context);
      throw new PromotionException(PromotionValidation.INVALID_RANGE_OF_DATE);
    }

    const promotion = this.mapper.map(
      createPromotionDto,
      CreatePromotionDto,
      Promotion,
    );

    let createdPromotion: Promotion;
    await this.promotionRepository.manager.transaction(async (manager) => {
      try {
        createdPromotion = await manager.save(promotion);
        this.logger.log(`Created promotion: ${promotion.slug}`, context);
      } catch (error) {
        this.logger.error(
          `Error when creating promotion: ${error.message}`,
          error.stack,
          context,
        );
        throw new PromotionException(
          PromotionValidation.CREATE_PROMOTION_ERROR,
          error.message,
        );
      }
    });

    return this.mapper.map(createdPromotion, Promotion, PromotionResponseDto);
  }

  async findAll() {
    const context = `${PromotionService.name}.${this.findAll.name}`;
    const promotions = await this.promotionRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return this.mapper.mapArray(promotions, Promotion, PromotionResponseDto);
  }

  async findOne(query: GetPromotionDto) {
    const context = `${PromotionService.name}.${this.findOne.name}`;
    if (_.isEmpty(query)) {
      this.logger.error(`Query is not empty`, null, context);
      throw new PromotionException(PromotionValidation.INVALID_QUERY);
    }
    const promotion = await this.promotionRepository.findOne({
      where: {
        slug: query.slug,
      },
    });

    if (!promotion) {
      this.logger.error(`Promotion not found: ${query.slug}`, null, context);
      throw new PromotionException(PromotionValidation.PROMOTION_NOT_FOUND);
    }

    return this.mapper.map(promotion, Promotion, PromotionResponseDto);
  }

  async update(slug: string, updatePromotionDto: UpdatePromotionDto) {
    const context = `${PromotionService.name}.${this.findOne.name}`;
    const promotion = await this.promotionRepository.findOne({
      where: {
        slug,
      },
    });

    // Validate start date, end date
    const startOfDate = moment(updatePromotionDto.startDate).startOf('day');
    const endOfDate = moment(updatePromotionDto.endDate).endOf('day');

    if (endOfDate.isBefore(startOfDate)) {
      this.logger.error(`End date cannot be before start date`, null, context);
      throw new PromotionException(PromotionValidation.INVALID_RANGE_OF_DATE);
    }

    if (!promotion) {
      this.logger.error(`Promotion not found: ${slug}`, null, context);
      throw new PromotionException(PromotionValidation.PROMOTION_NOT_FOUND);
    }

    Object.assign(promotion, { ...updatePromotionDto });
    let updatedPromotion: Promotion;

    await this.promotionRepository.manager.transaction(async (manager) => {
      try {
        updatedPromotion = await manager.save(promotion);
        this.logger.log(`Updated promotion: ${updatedPromotion.slug}`, context);
      } catch (error) {
        this.logger.error(
          `Error when updating promotion: ${error.message}`,
          error.stack,
          context,
        );
        throw new PromotionException(
          PromotionValidation.UPDATE_PROMOTION_ERROR,
          error.message,
        );
      }
    });

    return this.mapper.map(updatedPromotion, Promotion, PromotionResponseDto);
  }

  remove(id: number) {
    return `This action removes a #${id} promotion`;
  }
}
