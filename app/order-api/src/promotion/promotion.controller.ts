import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreatePromotionDto,
  GetPromotionDto,
  PromotionResponseDto,
  UpdatePromotionDto,
} from './promotion.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { HasRoles } from 'src/role/roles.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { AppResponseDto } from 'src/app/app.dto';

@ApiTags('Promotion')
@Controller('promotion')
@ApiBearerAuth()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create promotion' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Create a new promotion successfully',
    type: PromotionResponseDto,
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.SuperAdmin)
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createPromotionDto: CreatePromotionDto,
  ) {
    const result = await this.promotionService.create(createPromotionDto);
    return {
      message: 'Promotion created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PromotionResponseDto>;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve promotions' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Promotions retrieved successfully',
    type: PromotionResponseDto,
    isArray: true,
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.SuperAdmin)
  async findAll() {
    const result = await this.promotionService.findAll();
    return {
      message: 'Promotions retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PromotionResponseDto[]>;
  }

  @Get('specific')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve promotion' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Promotion retrieved successfully',
    type: PromotionResponseDto,
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.SuperAdmin)
  async findOne(
    @Query(new ValidationPipe({ transform: true })) query: GetPromotionDto,
  ) {
    const result = await this.promotionService.findOne(query);
    return {
      message: 'Promotion retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PromotionResponseDto>;
  }

  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update promotion' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Promotion updated successfully',
    type: PromotionResponseDto,
  })
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.SuperAdmin)
  async update(
    @Param('slug') slug: string,
    @Body(new ValidationPipe({ transform: true }))
    updatePromotionDto: UpdatePromotionDto,
  ) {
    const result = await this.promotionService.update(slug, updatePromotionDto);
    return {
      message: 'Promotion updated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PromotionResponseDto>;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(+id);
  }
}
