import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/task/interfaces/task.module';


@Module({
  imports: [AuthModule, TaskModule]
})
export class AppModule {}
