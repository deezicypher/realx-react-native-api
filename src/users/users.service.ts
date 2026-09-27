import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
      @InjectRepository(User)
      private userRepo: Repository<User>
  ) {
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) : Promise<User | null> {
    return this.userRepo.findOneBy({id});
  }

  findByGoogleId(googleId: string) : Promise<User | null> {
    return this.userRepo.findOneBy({googleId});
  }

  findOneByEmail(email: string) : Promise<User | null> {
    return this.userRepo.findOneBy({email});
  }

  saveUser(user: User) : Promise<User> {
    return this.userRepo.save(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
