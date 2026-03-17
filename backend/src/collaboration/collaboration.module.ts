import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaborationInvite } from './invite.entity';
import { CollaborationService } from './collaboration.service';
import { CollaborationController } from './collaboration.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CollaborationInvite]), UsersModule],
  providers: [CollaborationService],
  controllers: [CollaborationController],
  exports: [CollaborationService],
})
export class CollaborationModule {}
