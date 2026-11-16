import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_DATABASE', 'shikkha_bridge'),
  autoLoadEntities: true,
  synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
  logging: configService.get<string>('NODE_ENV', 'development') === 'development',
  charset: 'utf8mb4',
});

export default databaseConfig;
