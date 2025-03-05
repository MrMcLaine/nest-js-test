import { forwardRef, Module } from '@nestjs/common';
import { DynamoDBService } from '@common/services/dynamo-db.service';
import { AuthModule } from '@auth/auth.module';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsResolver } from './book-reviews.resolver';

@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [BookReviewsService, BookReviewsResolver, DynamoDBService],
})
export class BookReviewsModule {}
