import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { DynamodbModule } from '@providers/dynamodb/dynamodb.module';
import { BookReviewsResolver } from '@book-reviews/book-reviews.resolver';
import { BookReviewsService } from '@book-reviews/book-reviews.service';

@Module({
    imports: [forwardRef(() => AuthModule), DynamodbModule],
    providers: [BookReviewsService, BookReviewsResolver],
})
export class BookReviewsModule {}
