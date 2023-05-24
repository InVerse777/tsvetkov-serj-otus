import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { User } from '../users/models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(name: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { name: name } }));
  }
  addUser(user: User): Observable<User> {
    return from(this.userRepository.save(user));
  }
}
