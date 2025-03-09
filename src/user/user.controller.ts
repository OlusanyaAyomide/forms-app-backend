import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';


@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get()
  getUsers() {
    return this.userService.getAllUsers({})
  }

  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }
}
