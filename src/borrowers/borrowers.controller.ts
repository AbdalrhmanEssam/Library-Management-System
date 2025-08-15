import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';

@Controller('api/borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBorrowerDto: CreateBorrowerDto) {
    return this.borrowersService.create(createBorrowerDto);
  }

  @Get()
  async findAll() {
    return this.borrowersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.borrowersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBorrowerDto: UpdateBorrowerDto) {
    return this.borrowersService.update(+id, updateBorrowerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.borrowersService.remove(+id);
  }
}
