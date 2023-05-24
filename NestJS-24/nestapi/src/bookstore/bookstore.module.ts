import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookPostEntity } from './models/books.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookPostEntity])],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BookstoreModule {}
