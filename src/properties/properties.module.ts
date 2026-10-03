import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import { PropertiesController } from './properties.controller.js';
import { Property } from './entities/property.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService]
})
export class PropertiesModule {}
