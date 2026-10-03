import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { PropertiesModule } from '../properties/properties.module.js';
import { Review } from './entities/review.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [PropertiesModule, TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
