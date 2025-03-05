import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DynamodbModule } from '@dynamodb/dynamodb.module';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsResolver } from './book-reviews.resolver';

@Module({
    imports: [forwardRef(() => AuthModule), DynamodbModule],
    providers: [BookReviewsService, BookReviewsResolver],
})
export class BookReviewsModule {}
