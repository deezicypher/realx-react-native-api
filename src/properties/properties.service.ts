import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class PropertiesService {

  constructor(
    @InjectRepository(Property)
    private propertyRepo: Repository<Property> 
  ) {}


  create(dto: CreatePropertyDto) {
    const property = this.propertyRepo.create(dto);
    return this.propertyRepo.save(property);
  }

  findAll() {
    return this.propertyRepo.find();
  }

  findOne(id: string) {
    return this.propertyRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdatePropertyDto, user: any) {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if(!property) {
      throw new NotFoundException('Property not found');
    }
    if(user.id !== property.agent.id) {
      throw new UnauthorizedException();
    }
    return this.propertyRepo.update(id, dto);
  }

  async remove(id: string, user: any) {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if(!property) {
      throw new NotFoundException('Property not found');
    }
    if(user.id !== property.agent.id) {
      throw new UnauthorizedException();
    }
    return this.propertyRepo.delete(id);
  }
}
