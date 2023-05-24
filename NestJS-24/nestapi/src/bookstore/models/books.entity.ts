import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookPost')
export class BookPostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 'No title present' })
  title: string;
  @Column()
  year: string;
  @Column({ default: 'Unknown author' })
  author: string;
  @Column('double precision')
  price: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
