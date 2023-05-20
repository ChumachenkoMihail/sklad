import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const userToCreate = new User(); // crate new user
    userToCreate.email = user.email; // set users email
    userToCreate.password = user.password; // set users password
    userToCreate.refreshToken = user.refreshToken; // set users refreshToken
    return await this.userRepository.save(userToCreate); // save user to the database
  }


  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async updateRefreshToken(id: number, refreshToken: string) { // update users refresh token
    return await this.userRepository.update(
      {
        id,
      },
      {
        refreshToken,
      },
    );
  }
}
