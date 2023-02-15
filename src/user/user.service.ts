import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDTO } from './dtos/createUser.dto';
import { User } from './Interfaces/user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];

  async createUser(createrUserDTO: CreateUserDTO): Promise<User> {
    const saltOrRounds = 10;
    const passwordHashed = await hash(createrUserDTO.phone, saltOrRounds);

    const user = {
      ...createrUserDTO,
      id: this.users.length + 1,
      password: passwordHashed,
    };
    this.users.push(user);

    return user;
  }
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}
