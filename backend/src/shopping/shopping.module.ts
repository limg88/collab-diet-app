import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingItem } from './shopping-item.entity';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { MenuModule } from '../menu/menu.module';
import { CollaborationModule } from '../collaboration/collaboration.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingItem]),
    MenuModule,
    CollaborationModule,
    UsersModule,
  ],
  providers: [ShoppingService],
  controllers: [ShoppingController],
  exports: [ShoppingService],
})
export class ShoppingModule {}
