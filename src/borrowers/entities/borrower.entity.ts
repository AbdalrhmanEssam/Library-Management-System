import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Borrowing } from '../../borrowing/entities/borrowing.entity';

@Entity('borrowers')
export class Borrower {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ length: 255 })
  firstName: string;

  
  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 , unique: true})
  username: string;

  // Keep unique on column only (remove @Index() to avoid duplicate index creation)
  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registeredDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Borrowing, borrowing => borrowing.borrower)
  borrowings: Borrowing[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
