import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserEntity } from './interfaces/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createrUserDTO: CreateUserDTO): Promise<UserEntity> {
    const saltOrRounds = 10;
    const passwordHashed = await hash(createrUserDTO.phone, saltOrRounds);

    return this.userRepository.save({
      ...createrUserDTO,
      typeUser: 1,
      password: passwordHashed,
    });
  }
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
