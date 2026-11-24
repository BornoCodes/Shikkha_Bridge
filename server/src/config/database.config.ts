import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'shikkha_bridge'),
  autoLoadEntities: true,
  // Always true: a student project has no migrations yet, so tables are
  // created from the entities automatically in every environment.
  synchronize: true,
  logging: configService.get<string>('NODE_ENV', 'development') === 'development',
  charset: 'utf8mb4',
});

export default databaseConfig;
