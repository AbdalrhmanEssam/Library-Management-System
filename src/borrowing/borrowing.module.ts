import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowingService } from './borrowing.service';
import { BorrowingController } from './borrowing.controller';
import { Borrowing } from './entities/borrowing.entity';
import { BooksModule } from '../books/books.module';
import { BorrowersModule } from '../borrowers/borrowers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrowing]),
    BooksModule,
    BorrowersModule,
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
