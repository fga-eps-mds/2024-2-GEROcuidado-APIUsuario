import { DataSource } from 'typeorm';

(async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    migrationsTableName: 'migrations',
    entities: ['**/*.entity.js'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
    migrations: [__dirname + '/migration/*.js'],
    // namingStrategy: new SnakeNamingStrategy(), // Here you'r using the strategy!,
  });

  await dataSource.initialize();
  await dataSource.runMigrations();
})();
