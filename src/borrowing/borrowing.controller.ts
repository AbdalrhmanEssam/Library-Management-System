import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('api/borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkout(@Body() checkoutDto: CheckoutBookDto) {
    return this.borrowingService.checkoutBook(checkoutDto);
  }

  @Post('return')
  @HttpCode(HttpStatus.OK)
  async return(@Body() returnDto: ReturnBookDto) {
    return this.borrowingService.returnBook(returnDto);
  }

  @Get('borrower/:borrowerId')
  async getBorrowerBooks(@Param('borrowerId') borrowerId: string) {
    return this.borrowingService.getBorrowerBooks(+borrowerId);
  }

  @Get('overdue')
  async getOverdueBooks() {
    return this.borrowingService.getOverdueBooks();
  }

  @Get()
  async getAllBorrowings() {
    return this.borrowingService.getAllBorrowings();
  }
}
