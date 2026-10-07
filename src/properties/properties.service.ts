import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Property, PropertyType } from './entities/property.entity.js';
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
    return this.propertyRepo.find({order: { createdAt: 'DESC' }});
  }

  search(query?: string, filter?: string, limit?: number) {
   
    const normalizedFilter = filter?.trim().toLowerCase();
    if ((normalizedFilter === 'all' || normalizedFilter === 'undefined' ) && (!query || query=== 'undefined' || query === 'null')) {
      return this.findAll();
    }

    // const propertyType = normalizedFilter
    //   ? Object.values(PropertyType).find((type) => {
    //       const normalizedType = type.toLowerCase();
    //       return [normalizedType, `${normalizedType}s`, `${normalizedType}es`].includes(normalizedFilter);
    //     })
    //   : undefined;

    // if (normalizedFilter && !propertyType) {
    //   throw new BadRequestException(`Invalid property type filter: ${filter}`);
    // }

    const queryBuilder = this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent')
      .leftJoinAndSelect('property.reviews', 'reviews')
      .orderBy('property.createdAt', 'DESC');

    const normalizedQuery = query?.trim();
    if (normalizedQuery && !['undefined', 'null'].includes(normalizedQuery.toLowerCase())) {
      queryBuilder.andWhere('property.name ILIKE :query', {
        query: `%${normalizedQuery}%`,
      });
    }

    if (filter && (query === 'undefined' || query === 'null' || !query)) {
      queryBuilder.andWhere('property.type = :filter', { filter });
    }

    if (limit !== undefined && Number.isFinite(limit) && limit > 0) {
      queryBuilder.take(Math.floor(limit));
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const property = await this.propertyRepo.findOne({ where: { id } , relations:{reviews:true,agent:true}});
    if(!property) {
      throw new NotFoundException('Property not found');
    }
    console.log(property)
    return property;
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
