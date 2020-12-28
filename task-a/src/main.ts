import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { Logger } from 'nestjs-pino';
// import {
//   initializeTransactionalContext,
//   patchTypeORMRepositoryWithBaseRepository,
// } from 'typeorm-transactional-cls-hooked';
import * as uuid from 'uuid';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/bad-request.filter';
import { QueryFailedFilter } from './common/filters/query-failed.filter';
import { EnvService } from './common/services/env.service';

declare const module: any;

async function bootstrap() {
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  app.setGlobalPrefix('api');
  const reflector = app.get(Reflector);
  const configService = app.get(EnvService);
  const loggerService = app.get(Logger);
  // eslint-disable-next-line no-restricted-syntax
  console.log(`Loading ${configService.read().SERVICE_NAME} Service`);
  // Then combine it with a RabbitMQ microservice
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  function assignId(req, res, next) {
    req.id = uuid.v4();
    req.service_name = configService.read().SERVICE_NAME;
    next();
  }

  app.useLogger(loggerService);
  app.enableCors();
  app.use(assignId);

  if (configService.isProd()) {
    app.use(helmet.contentSecurityPolicy());
    app.use(compression());
    app.useGlobalFilters(
      new HttpExceptionFilter(reflector),
      new QueryFailedFilter(reflector),
    );
  }
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  // log only 4xx and 5xx responses to console
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (configService.isDev() || configService.isStaging()) {
    if (configService.read().ENABLE_SWAGGER) {
      const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Backend service')
        .setDescription('The Backend API Documentation')
        .setVersion('1.0')
        .addTag('backend')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup(configService.read().DOCUMENT_PATH, app, document);
    }
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
    }),
  );

  await app.startAllMicroservicesAsync();
  await app.listen(configService.read().PORT, '0.0.0.0', () => {
    console.info(
      `${configService.read().SERVICE_NAME} Service Start at Port ${
        configService.read().PORT
      }`,
    );
  });
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
