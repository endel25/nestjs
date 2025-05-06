// src/user-roles/entities/user-role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRolePermission } from './entities/user-role-permission.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userRoleName: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => UserRolePermission, userRolePermission => userRolePermission.userRole)
  permissions: UserRolePermission[];
}