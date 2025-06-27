import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }

  // @Post('login')
  // login(@Body() loginUserDto: LoginUserDto) {
  //   return this.userService.loginUser(loginUserDto);
  // }
}
