import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';

@Controller('user')
export class UserController {
  @Post()
  async createUser(@Body() createUser: CreateUserDTO) {
    return {
      ...createUser,
      password: undefined,
    };
  }
}
