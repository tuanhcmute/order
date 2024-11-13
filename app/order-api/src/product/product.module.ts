import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductProfile } from './product.mapper';
import { CatalogModule } from 'src/catalog/catalog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CatalogModule
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductProfile,
  ],
  exports: [ProductService]
})
export class ProductModule{}