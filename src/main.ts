import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Listen on all interfaces
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
