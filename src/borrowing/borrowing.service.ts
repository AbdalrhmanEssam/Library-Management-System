import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { Borrowing } from './entities/borrowing.entity';
import { BooksService } from '../books/books.service';
import { BorrowersService } from '../borrowers/borrowers.service';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class BorrowingService {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingRepository: Repository<Borrowing>,
    private booksService: BooksService,
    private borrowersService: BorrowersService,
  ) {}

  async checkoutBook(checkoutDto: CheckoutBookDto): Promise<Borrowing> {
    const book = await this.booksService.findOne(checkoutDto.bookId);
    const borrower = await this.borrowersService.findOne(checkoutDto.borrowerId);

    if (book.availableQuantity <= 0) {
      throw new ConflictException('Book is not available for checkout');
    }

    const existingBorrowing = await this.borrowingRepository.findOne({
      where: {
        book: { id: book.id },
        borrower: { id: borrower.id },
        returnDate: IsNull()
      }
    });

    if (existingBorrowing) {
      throw new ConflictException('Borrower already has this book checked out');
    }

    const borrowing = this.borrowingRepository.create({
      book,
      borrower,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'BORROWED' as const
    });

    await this.booksService.updateQuantity(book.id, -1);

    return await this.borrowingRepository.save(borrowing);
  }

  async returnBook(returnDto: ReturnBookDto): Promise<Borrowing> {
    const borrowing = await this.borrowingRepository.findOne({
      where: {
        book: { id: returnDto.bookId },
        borrower: { id: returnDto.borrowerId },
        returnDate: IsNull()
      },
      relations: ['book', 'borrower']
    });

    if (!borrowing) {
      throw new NotFoundException('No active borrowing found for this book and borrower');
    }

    borrowing.returnDate = new Date();
    borrowing.status = 'RETURNED';

    await this.booksService.updateQuantity(borrowing.book.id, 1);

    return await this.borrowingRepository.save(borrowing);
  }

  async getBorrowerBooks(borrowerId: number): Promise<Borrowing[]> {
    await this.borrowersService.findOne(borrowerId);

    return await this.borrowingRepository.find({
      where: {
        borrower: { id: borrowerId },
        returnDate: IsNull()
      },
      relations: ['book'],
      order: { borrowDate: 'DESC' }
    });
  }

  async getOverdueBooks(): Promise<Borrowing[]> {
    const now = new Date();

    const overdueBooks = await this.borrowingRepository.find({
      where: {
        returnDate: IsNull(),
        dueDate: LessThan(now)
      },
      relations: ['book', 'borrower'],
      order: { dueDate: 'ASC' }
    });

    for (const borrowing of overdueBooks) {
      if (borrowing.status !== 'OVERDUE') {
        borrowing.status = 'OVERDUE';
        await this.borrowingRepository.save(borrowing);
      }
    }

    return overdueBooks;
  }

  async getAllBorrowings(): Promise<Borrowing[]> {
    return await this.borrowingRepository.find({
      relations: ['book', 'borrower'],
      order: { borrowDate: 'DESC' }
    });
  }
}
