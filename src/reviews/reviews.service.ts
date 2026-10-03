import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Review } from './entities/review.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertiesService } from '../properties/properties.service.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    private propertiesService: PropertiesService
  ) {}

  async create(dto: CreateReviewDto) {
    const property = await this.propertiesService.findOne(dto.propertyId);
    if(!property) {
      throw new Error('Property not found');
    }
    const review = this.reviewRepo.create(dto);
    review.property = property;
    return this.reviewRepo.save(review);
  } 
 
  findAll() {
    return this.reviewRepo.find({ relations: { property: true } });
  }

  findOne(id: string) {
    const review = this.reviewRepo.findOne({ where: { id }, relations: { property: true } });
    if(!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: string, dto: UpdateReviewDto, user: any) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if(!review) {
      throw new NotFoundException('Review not found');
    }
    if(user.id !== review.user.id) {
      throw new UnauthorizedException();
    }
    return this.reviewRepo.update(id, dto);
  }

  async remove(id: string, user:any) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if(!review) {
      throw new NotFoundException('Review not found');
    }
    if(user.id !== review.user.id) {
      throw new UnauthorizedException();
    }
    return this.reviewRepo.remove(review);
  }
}
