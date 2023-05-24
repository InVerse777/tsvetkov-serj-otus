import { Injectable } from '@nestjs/common';
import { BookPostEntity } from '../models/books.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookPost } from '../models/books.interface';
import { Repository } from 'typeorm/repository/Repository';
import { from, Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookPostEntity)
    private readonly bookPostRepository: Repository<BookPostEntity>,
  ) {}
  createPost(bookPost: BookPost): Observable<BookPost> {
    return from(this.bookPostRepository.save(bookPost));
  }

  findAllPosts(): Observable<BookPost[]> {
    return from(this.bookPostRepository.find());
  }
  updatePost(id: number, bookPost: BookPost): Observable<UpdateResult> {
    return from(this.bookPostRepository.update(id, bookPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.bookPostRepository.delete(id));
  }
}
