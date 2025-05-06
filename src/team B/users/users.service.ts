import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with username=${createUserDto.userName}`);
    const { password, userName } = createUserDto;
    const existingUser = await this.usersRepository.findOne({ where: { userName } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password!, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(page: number, limit: number, search: string): Promise<any> {
    this.logger.log(`Fetching users: page=${page}, limit=${limit}, search=${search}`);
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { userName: Like(`%${search}%`) },
        ]
      : {};

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return {
      users,
      total,
      start: skip + 1,
      end: Math.min(skip + limit, total),
    };
  }

  async findAllWithoutPagination(): Promise<User[]> {
    this.logger.log('Fetching all users without pagination');
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with id=${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async toggleStatus(id: number, updateUserStatusDto: UpdateUserStatusDto): Promise<User> {
    this.logger.log(`Toggling status for user id=${id}, isActive=${updateUserStatusDto.isActive}`);
    const user = await this.findOne(id);
    user.isActive = updateUserStatusDto.isActive;
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Updating user id=${id}`);
    const user = await this.findOne(id);

    if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
      const existingUser = await this.usersRepository.findOne({
        where: { userName: updateUserDto.userName },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      userName: updateUserDto.userName,
      contactNo: updateUserDto.contactNo,
      emailId: updateUserDto.emailId,
      address: updateUserDto.address,
      userRoleId: updateUserDto.userRoleId,
      notes: updateUserDto.notes,
    });

    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting user id=${id}`);
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validateUser(userName: string, password: string): Promise<User> {
    this.logger.log(`Validating user with username=${userName}`);
    const user = await this.usersRepository.findOne({
      where: { userName },
      select: ['id', 'userName', 'password', 'isActive'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new ConflictException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    return user;
  }
}