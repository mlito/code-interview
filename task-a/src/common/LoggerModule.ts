import { Module } from '@nestjs/common';
import { LoggerService } from 'nest-logger';

import { EnvModule } from './env.module';
import { EnvService } from './services/env.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: LoggerService,
      useFactory: (config: EnvService) => {
        // getLoggers() is a helper function to get configured console and/or rotate logger transports.
        // It takes takes two parameters:
        // 1: Appenders where to log to: console or rotate or both in array
        //    (eg. [LoggerTransport.CONSOLE, LoggerTransport.ROTATE])
        // 2: Logger options object that contains the following properties:
        //    timeFormat?: winston's time format syntax. Defaults to "HH:mm:ss".
        //    colorize?: whether to colorize the log output. Defaults to true.
        //    consoleOptions?: see Winston's ConsoleTransportOptions interface
        //    fileOptions?: see Winston Daily Rotate File's DailyRotateFile.DailyRotateFileTransportOptions
        const loggers = [
          LoggerService.console({
            timeFormat: 'HH:mm',
            colorize: config.read().LOGS_COLORING,
          }),
          LoggerService.rotate({
            fileOptions: {
              filename: `${config.read().LOGS_PATH}/${
                config.read().SERVICE_NAME
              }-${config.read().APP_ENV}-%DATE%.log`,
            },
          }),
        ];

        // LoggerService constructor will take two parameters:
        // 1. Log level: debug, info, warn or error
        // 2. List of logger transport objects.
        return new LoggerService(config.read().LOGS_LEVEL, loggers);
      },
      inject: [EnvService],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
