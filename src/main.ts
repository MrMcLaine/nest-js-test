import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from '@common/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(CustomValidationPipe);

    await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
