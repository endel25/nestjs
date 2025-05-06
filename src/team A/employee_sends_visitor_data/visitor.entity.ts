import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsEmail, IsDateString, IsOptional } from "class-validator";

@Entity()
export class Visitor {
    @PrimaryGeneratedColumn()
    @IsOptional()
    id: number;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    firstname: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    lastname: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    gender: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    contactnumber: string;

    @Column({ nullable: true })
    @IsEmail()
    @IsOptional()
    email: string;

    @Column({ type: "date", nullable: true })
    @IsDateString()
    @IsOptional()
    date: string;

    @Column({ type: "time", nullable: true })
    @IsString()
    @IsOptional()
    time: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    nationalid: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    photo: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    visit: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    personname: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    department: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    durationtime: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    durationunit: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    visitortype: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    vehicletype: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    vehiclenumber: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    drivername: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    drivermobile: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    drivernationalid: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    driverphoto: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    notes: string;
}