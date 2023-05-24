import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../users/models/user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  add(@Body() user: User): Observable<User> {
    return this.usersService.addUser(user);
  }

  @Get(':name')
  findOne(@Param('name') name: string): Observable<User | undefined> {
    return this.usersService.findOne(name);
  }
}
