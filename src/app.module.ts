import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { BorrowingModule } from './borrowing/borrowing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '0000',
      database: 'lms',
     // entities: [],
      autoLoadEntities:true,
      synchronize: true,
    }),
    BooksModule,
    BorrowersModule,
    BorrowingModule,
  ],
})
export class AppModule {}
