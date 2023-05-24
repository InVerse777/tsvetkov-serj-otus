import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BookPost } from '../models/books.interface';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() bookPost: BookPost): Observable<BookPost> {
    return this.bookService.createPost(bookPost);
  }

  @Get()
  findAll(): Observable<BookPost[]> {
    return this.bookService.findAllPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() bookPost: BookPost,
  ): Observable<UpdateResult> {
    return this.bookService.updatePost(id, bookPost);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.bookService.deletePost(id);
  }
}
