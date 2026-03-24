import { Module } from '@nestjs/common';
import { PostController } from './post.controller.js';
import { PrismaService } from '../../common/services/prisma.service.js';
import { PostService } from './post.service.js';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}