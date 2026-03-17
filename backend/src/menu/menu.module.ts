import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyMenu } from './entities/weekly-menu.entity';
import { MenuDay } from './entities/menu-day.entity';
import { Meal } from './entities/meal.entity';
import { MealItem } from './entities/meal-item.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { CollaborationModule } from '../collaboration/collaboration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklyMenu, MenuDay, Meal, MealItem]),
    IngredientsModule,
    CollaborationModule,
  ],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}
