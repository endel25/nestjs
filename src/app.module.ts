import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './login+register/item.module';
import { AuthModule } from './login+register/auth/auth.module';
import { MailModule } from './login+register/mail/mail.module';
import { VisitorModule } from './team A/employee_sends_visitor_data/visitor.module';
import { AppointmentModule } from './team B/appointment/appointment.module';
import { MailService } from './team B/mail/mail.service';
import { UsersModule } from './team B/users/users.module';
import { UserRolesModule } from './user-roles/user-roles.module';
 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'endel@123',
      database: 'CURD',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Set to false in production
      logging: true,
    }),
    ItemModule,
    AuthModule,
    MailModule,
    VisitorModule,
    AppointmentModule,
    UsersModule,
    UserRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
 
  constructor() {
    this.logger.log('AppModule initialized');
    this.logger.log('Loaded modules: ItemModule, AuthModule, MailModule, VisitorModule, AppointmentModule, UsersModule, UserRolesModule');
  }
}