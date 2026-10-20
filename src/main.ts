import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  try {
    //const app = await NestFactory.create(AppModule);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule, {
      transport: Transport.TCP,
      options:{
        port:envs.port
      }
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );

    //await app.listen(envs.port);
    await app.listen();
    logger.log(`Products Microservices running on port: ${envs.port}`)

  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to start the application: ${err.message}`, err.stack);
  }
}
bootstrap();
