import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn }
    });

    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find({
      where: { isActive: true },
      order: { title: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, isActive: true }
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async search(query: string): Promise<Book[]> {
    if (!query || !query.trim()) return [];
    const q = `%${query.trim()}%`;
    return await this.bookRepository.find({
      where: [
        { title: Like(q), isActive: true },
        { author: Like(q), isActive: true },
        { isbn: Like(q), isActive: true },
      ],
      order: { title: 'ASC' },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findOne({
        where: { isbn: updateBookDto.isbn }
      });
      
      if (existingBook) {
        throw new ConflictException('Book with this ISBN already exists');
      }
    }

    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    book.isActive = false;
    await this.bookRepository.save(book);
  }

  async updateQuantity(id: number, quantityChange: number): Promise<Book> {
    const book = await this.findOne(id);
    const newQty = (book.availableQuantity || 0) + quantityChange;
    if (newQty < 0) {
      throw new ConflictException('Insufficient books available');
    }
    book.availableQuantity = newQty;
    return await this.bookRepository.save(book);
  }
}
