import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'contact_no', nullable: true })
  contactNo: string;

  @Column({ name: 'email_id', nullable: true })
  emailId: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'user_role_id' })
  userRoleId: number;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}