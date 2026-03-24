import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/interfaces/auth.module.js';
import { TaskModule } from './modules/task/interfaces/task.module.js';
import { User } from './modules/user/entities/user.entity.js';
import { Task } from './modules/task/entities/task.entity.js';
import { PrismaService } from './common/services/prisma.service.js';
import { PostModule } from './modules/post/post.module.js'; 

@Controller()
class AppController {
  @Get()
  getHello() {
    return { message: 'Welcome to CARH API', version: '1.0.0' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Task],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    TaskModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
