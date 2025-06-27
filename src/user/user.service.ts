import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  findUser(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.findUser(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // Create the user with hashed password
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...withoutPassword } = await this.userRepo.save(user);

    return withoutPassword;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.findUser(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    return 'Login successful';
  }
}
