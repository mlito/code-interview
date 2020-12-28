// eslint-disable-next-line @typescript-eslint/tslint/config
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/tslint/config
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';

export interface IEnvData {
  // application
  APP_ENV: string;
  APP_DEBUG: boolean;
  SERVICE_NAME: string;
  PORT: number;
  // swagger
  ENABLE_SWAGGER: boolean;
  DOCUMENT_PATH: string; // the path or the doc
  // rabbit mq
  RABBITMQ_URL: string;
  RABBITMQ_SERVICE_QUE_NAME: string;
  // redis
  REDIS_URL: string;
  // jwt
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: number;
  // logs
  LOGS_LEVEL: 'debug' | 'error' | 'warn' | 'info';
  LOGS_PATH: string;
  LOGS_PAPERTRAIL_ENABLE: boolean;
  LOGS_PAPERTRAIL_URL: string;
  LOGS_PAPERTRAIL_PORT: string;
  // database
  DB_HOST: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_CA_ENABLE: boolean;
  DB_CA_FILE: string;
}
interface ILoggerConfig {
  host: string;
  port: string;
  protocol: string;
  localhost: string;
  eol: string;
}
export class EnvService {
  private vars: IEnvData;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    const data: any = dotenv.parse(fs.readFileSync(`.${environment}.env`));

    data.APP_ENV = environment;
    data.APP_DEBUG = this.isBool(data.APP_DEBUG);
    data.ENABLE_SWAGGER = this.isBool(data.ENABLE_SWAGGER);
    data.LOGS_PAPERTRAIL_ENABLE = this.isBool(data.LOGS_PAPERTRAIL_ENABLE);
    data.DB_PORT = parseInt(data.DB_PORT, 10);
    data.PORT = parseInt(data.PORT, 10);
    data.JWT_EXPIRATION_TIME = parseInt(data.JWT_EXPIRATION_TIME, 10);

    this.vars = data as IEnvData;
    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  private isBool(prop: string): boolean {
    return prop === 'true';
  }

  read(): IEnvData {
    return this.vars;
  }

  loggerOptionsConfig(): ILoggerConfig {
    return {
      host: this.read().LOGS_PAPERTRAIL_URL,
      port: this.read().LOGS_PAPERTRAIL_PORT,
      protocol: 'tls4',
      localhost: os.hostname(),
      eol: '\n',
    };
  }

  databaseConfigOptions(rootPath: string): TypeOrmModuleOptions {
    let entities = [__dirname + '/../../**/entities/*.entity{.ts,.js}'];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    if ((<any>module).hot) {
      const entityContext = (<any>require).context(
        './../../',
        true,
        '/entities',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (<any>require).context(
        './../../migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }
    const sslOptions = {
      ssl: true,
      ca: fs
        .readFileSync(`${rootPath}/../${this.read().DB_CA_FILE}`)
        .toString(),
    };
    const options: TypeOrmModuleOptions = {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'mysql',
      synchronize: false,
      host: this.read().DB_HOST,
      port: this.read().DB_PORT,
      database: this.read().DB_NAME,
      username: this.read().DB_USER,
      password: this.read().DB_PASSWORD,
      migrationsRun: true,
      logging: process.env.NODE_ENV === 'development',
      ssl: !this.read().DB_CA_ENABLE ? null : sslOptions,
    };

    return options;
  }

  isDev(): boolean {
    return this.vars.APP_ENV === 'development';
  }

  isStaging(): boolean {
    return this.vars.APP_ENV === 'staging';
  }

  isProd(): boolean {
    return this.vars.APP_ENV === 'production';
  }
}
