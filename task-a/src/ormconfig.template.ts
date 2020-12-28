// You can load you .env file here synchronously using dotenv package (not installed here),
// eslint-disable-next-line @typescript-eslint/tslint/config
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConnectionOptions } from 'typeorm';
const environment = process.env.NODE_ENV || 'development';
const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'mysql',
  host: data.DB_HOST,
  port: data.DB_PORT,
  username: data.DB_USER,
  password: data.DB_PASSWORD,
  database: 'foo-food',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: 'file',

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = config;
