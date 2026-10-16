import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Main');
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );

    await app.listen(envs.port);
    logger.log(`The app is running on: ${envs.port}`)
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to start the application: ${err.message}`, err.stack);
  }
}
bootstrap();
