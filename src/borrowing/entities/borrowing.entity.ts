import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Borrower } from '../../borrowers/entities/borrower.entity';

export type BorrowingStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

@Entity('borrowings')
@Index(['borrower', 'book', 'returnDate'])
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, book => book.borrowings, { eager: false })
  book: Book;

  @ManyToOne(() => Borrower, borrower => borrower.borrowings, { eager: false })
  borrower: Borrower;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date | null;

  @Column({ type: 'enum', enum: ['BORROWED', 'RETURNED', 'OVERDUE'], default: 'BORROWED' })
  status: BorrowingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
