import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class AgentsService {
  
  constructor(
    @InjectRepository(Agent)
    private agentRepo: Repository<Agent>
  ) {}

  async create(dto: CreateAgentDto) {
    const existingAgent = await this.agentRepo.findOne({ where: { email: dto.email } });
    if (existingAgent) {
      throw new Error('Agent with this email already exists');
    }
    const agent = this.agentRepo.create(dto);
    return this.agentRepo.save(agent);
  }

  findAll() {
    return this.agentRepo.find();
  }

  async findOne(id: string) {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if(!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  async update(id: string, dto: UpdateAgentDto, user:any) {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if(!agent) {
      throw new Error('Agent not found');
    }
    if(agent.id !== user.id) {
      throw new Error('Unauthorized');
    }
    return this.agentRepo.update(id, dto);
  }

  async remove(id: string, user:any) {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if(!agent) {
      throw new Error('Agent not found');
    }
    if(agent.id !== user.id) {
      throw new Error('Unauthorized');
    }
    return this.agentRepo.delete(id);
  }
}
