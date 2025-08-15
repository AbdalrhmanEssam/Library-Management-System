// src/borrowers/borrowers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowersService } from './borrowers.service';
import { BorrowersController } from './borrowers.controller';
import { Borrower } from './entities/borrower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrower])],
  controllers: [BorrowersController],
  providers: [BorrowersService],
  exports: [BorrowersService, TypeOrmModule], // <-- re-export TypeOrmModule
})
export class BorrowersModule {}
