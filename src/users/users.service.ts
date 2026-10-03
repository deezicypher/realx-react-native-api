import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider, User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
      @InjectRepository(User)
      private userRepo: Repository<User>
  ) {
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepo.findOneBy({email:dto.email})
    if(existingUser){
      throw new ConflictException("User with this email already exists")
    }
    
    try{
      const user =  this.userRepo.create({
        ...dto,
        password: await bcrypt.hash(dto.password, 12),
        provider: AuthProvider.LOCAL,
        isEmailVerified:false
      })

      return await this.userRepo.save(user)

        }catch(error){
      console.log(error)
      throw new InternalServerErrorException('Unable to proceed further at the moment')
    }
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

  activateUser(user:Partial<User>):Promise<User>{
    if(user.isEmailVerified){
        throw new ConflictException("User already activated")
    }
    user.isEmailVerified = true
    return this.userRepo.save(user)
  }

  async update(id: string, dto: UpdateUserDto, req:any) {
    const user = await this.userRepo.findOneBy({id});
    if(!user) {
      throw new Error('User not found');
    }
    if(user.id !== req.user.id) {
      throw new Error('Unauthorized');
    }
    return this.userRepo.update(id, dto);
  }

  async remove(id: string,req:any) {
    const user = await this.userRepo.findOneBy({id});
    if(!user) {
      throw new Error('User not found');
    }
    if(user.id !== req.user.id) {
      throw new Error('Unauthorized');
    }
    return this.userRepo.delete(id);
  }
}
