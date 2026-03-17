import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { MenuModule } from './menu/menu.module';
import { ShoppingModule } from './shopping/shopping.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { User } from './users/user.entity';
import { Ingredient } from './ingredients/ingredient.entity';
import { WeeklyMenu } from './menu/entities/weekly-menu.entity';
import { MenuDay } from './menu/entities/menu-day.entity';
import { Meal } from './menu/entities/meal.entity';
import { MealItem } from './menu/entities/meal-item.entity';
import { ShoppingItem } from './shopping/shopping-item.entity';
import { CollaborationInvite } from './collaboration/invite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          User,
          Ingredient,
          WeeklyMenu,
          MenuDay,
          Meal,
          MealItem,
          ShoppingItem,
          CollaborationInvite,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    IngredientsModule,
    MenuModule,
    ShoppingModule,
    CollaborationModule,
  ],
})
export class AppModule {}
