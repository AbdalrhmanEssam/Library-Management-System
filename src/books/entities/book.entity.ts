import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Borrowing } from '../../borrowing/entities/borrowing.entity';

@Entity('books')
// keep composite index (optionally give it a name)
@Index('IDX_books_title_author_isbn', ['title', 'author', 'isbn'])
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  // Use unique on column only; remove the extra @Index() decorator
  @Column({ length: 20, unique: true })
  isbn: string;

  @Column({ default: 1 })
  availableQuantity: number;

  @Column({ length: 50 })
  shelfLocation: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Borrowing, borrowing => borrowing.book)
  borrowings: Borrowing[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
