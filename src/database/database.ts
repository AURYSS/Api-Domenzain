import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get('DB_HOST', 'localhost'),
      port: configService.get('DB_PORT', 3306),
      username: configService.get('DB_USERNAME', 'root'),
      password: configService.get('DB_PASSWORD', ''),
      database: configService.get('DB_DATABASE', 'carh_db'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    inject: [ConfigService],
  }),
];