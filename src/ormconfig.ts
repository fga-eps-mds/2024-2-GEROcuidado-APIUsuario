import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const ENV = !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`;
const path = resolve(__dirname, `../${ENV}`);

const envConfig = dotenv.parse(readFileSync(path));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const SnakeNamingStrategy = require("typeorm-naming-strategies").SnakeNamingStrategy

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5001,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_DATABASE || 'localhost',
  migrationsTableName: 'migrations',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  migrations: [__dirname + '/migration/**/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy()
};

export default new DataSource(config);

export const typeOrmConfig: TypeOrmModuleOptions = config;
