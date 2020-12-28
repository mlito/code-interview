import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import * as pinoms from 'pino-multi-stream';
import * as papertrail from 'pino-papertrail';
import * as rfs from 'rotating-file-stream';

import { CommandLineModule } from './commandLine/commandLine.module';
import { EnvModule } from './common/env.module';
import { contextMiddleware } from './common/middlewares';
import { EnvService } from './common/services/env.service';
import { AppointmentsModule } from './modules/appoitments/appoitments.module';

const environment = process.env.NODE_ENV || 'development';
const rootPath = __dirname;
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
const pad = (num) => (num > 9 ? '' : '0') + num;
const generatorApp = (time, index) => {
  if (!time) {
    return `${environment}-application.log`;
  }

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const month = time.getFullYear() + '' + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  // const hour = pad(time.getHours());
  // const minute = pad(time.getMinutes());

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `${environment}-${month}-${day}-${index}-application.log`;
};
const logStream = rfs.createStream(generatorApp, {
  interval: '1d', // rotate daily
  path: path.join(rootPath, '../', 'logs'),
  maxFiles: 10,
  size: '500M',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${environment}.env`,
      ignoreEnvFile: true,
      expandVariables: true,
      isGlobal: true,
    }),
    EnvModule,
    // TypeOrmModule.forRootAsync({
    //   imports: [EnvModule],
    //   inject: [EnvService],
    //   // eslint-disable-next-line @typescript-eslint/require-await
    //   useFactory: async (config: EnvService) => {
    //     const options: TypeOrmModuleOptions = {
    //       ...config.databaseConfigOptions(rootPath),
    //     };
    //     // eslint-disable-next-line no-restricted-syntax
    //     console.log('Database Config', options);
    //     return options;
    //   },
    // }),
    CommandLineModule,
    AppointmentsModule,
    LoggerModule.forRootAsync({
      imports: [EnvService],
      inject: [EnvService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (config: EnvService) => {
        const options = config.loggerOptionsConfig();
        const appname = config.read().SERVICE_NAME;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const externalLogEnable = config.read().LOGS_PAPERTRAIL_ENABLE;
        const writeStream = papertrail.createWriteStream({
          ...options,
          appname,
        });
        const logger = (externalLogEnable) ? pinoms.multistream([
          { stream: writeStream },
          { stream: logStream },
        ]) : pinoms.multistream([
          { stream: logStream },
        ]);
        return {
          pinoHttp: [
            {
              // genReqId: (req) => req.id,
              level: config.read().LOGS_LEVEL || 'debug',
              useLevelLabels: true,
            },
            logger,
          ],
        };
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
