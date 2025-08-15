import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrower } from './entities/borrower.entity';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Injectable()
export class BorrowersService {
  constructor(
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
  ) {}

  async create(createBorrowerDto: CreateBorrowerDto): Promise<Borrower> {
    const existingBorrower = await this.borrowerRepository.findOne({
      where: { email: createBorrowerDto.email }
    });

    if (existingBorrower) {
      throw new ConflictException('Borrower with this email already exists');
    }

    const borrower = this.borrowerRepository.create(createBorrowerDto);
    return await this.borrowerRepository.save(borrower);
  }

  async findAll(): Promise<Borrower[]> {
    return await this.borrowerRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Borrower> {
    const borrower = await this.borrowerRepository.findOne({
      where: { id, isActive: true }
    });

    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${id} not found`);
    }

    return borrower;
  }

  async update(id: number, updateBorrowerDto: UpdateBorrowerDto): Promise<Borrower> {
    const borrower = await this.findOne(id);

    if (updateBorrowerDto.email && updateBorrowerDto.email !== borrower.email) {
      const existingBorrower = await this.borrowerRepository.findOne({
        where: { email: updateBorrowerDto.email }
      });

      if (existingBorrower) {
        throw new ConflictException('Borrower with this email already exists');
      }
    }

    Object.assign(borrower, updateBorrowerDto);
    return await this.borrowerRepository.save(borrower);
  }

  async remove(id: number): Promise<void> {
    const borrower = await this.findOne(id);
    borrower.isActive = false;
    await this.borrowerRepository.save(borrower);
  }
}
