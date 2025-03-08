import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { helmetConfig } from '@config';
import { CustomValidationPipe } from '@common/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(CustomValidationPipe);
    if (process.env.NODE_ENV === 'production') {
        app.use(helmet(helmetConfig));
    }

    await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
