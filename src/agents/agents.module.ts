import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service.js';
import { AgentsController } from './agents.controller.js';
import { Agent } from './entities/agent.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
