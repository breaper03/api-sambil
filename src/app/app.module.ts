import { Module } from '@nestjs/common';
import { JwtStrategy } from './users/auth/jwt.strategy';
import { TasksModule } from 'src/app/tasks/tasks.module';
import { UsersModule } from 'src/app/users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule,
    TasksModule,
    UsersModule
  ],
  controllers: [],
  providers: [JwtStrategy]
})
export class AppModule {}
