import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WeeklyMenu } from './entities/weekly-menu.entity';
import { MenuDay } from './entities/menu-day.entity';
import { Meal } from './entities/meal.entity';
import { MealItem } from './entities/meal-item.entity';
import { IngredientsService } from '../ingredients/ingredients.service';
import { MealTypeEnum, UnitEnum } from '../ingredients/ingredient.entity';
import { AddMealItemDto } from './dto/add-meal-item.dto';
import { UpdateMealItemDto } from './dto/update-meal-item.dto';

/**
 * Returns the ISO date string (YYYY-MM-DD) for the Monday of the current week
 * using the Europe/Rome timezone.
 */
export function getMondayOfCurrentWeekRome(): string {
  const now = new Date();

  // Get current date components in Europe/Rome timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find((p) => p.type === 'year')!.value, 10);
  const month = parseInt(parts.find((p) => p.type === 'month')!.value, 10);
  const day = parseInt(parts.find((p) => p.type === 'day')!.value, 10);

  // Build a Date at noon UTC to avoid DST edge-cases when computing day-of-week
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayOfWeek = d.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setUTCDate(d.getUTCDate() + diffToMonday);

  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(WeeklyMenu)
    private readonly weeklyMenuRepo: Repository<WeeklyMenu>,
    @InjectRepository(MenuDay)
    private readonly menuDayRepo: Repository<MenuDay>,
    @InjectRepository(Meal)
    private readonly mealRepo: Repository<Meal>,
    @InjectRepository(MealItem)
    private readonly mealItemRepo: Repository<MealItem>,
    private readonly ingredientsService: IngredientsService,
    private readonly dataSource: DataSource,
  ) {}

  async getCurrentWeekMenu(userId: string): Promise<WeeklyMenu> {
    const weekStart = getMondayOfCurrentWeekRome();
    let menu = await this.loadFullMenu(userId, weekStart);

    if (!menu) {
      menu = await this.createMenuForWeek(userId, weekStart);
    }

    return menu;
  }

  async getMenuForUser(userId: string): Promise<WeeklyMenu> {
    return this.getCurrentWeekMenu(userId);
  }

  private async loadFullMenu(userId: string, weekStart: string): Promise<WeeklyMenu | null> {
    return this.weeklyMenuRepo
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.days', 'day')
      .leftJoinAndSelect('day.meals', 'meal')
      .leftJoinAndSelect('meal.items', 'item')
      .leftJoinAndSelect('item.ingredient', 'ingredient')
      .where('menu.userId = :userId', { userId })
      .andWhere('menu.weekStart = :weekStart', { weekStart })
      .orderBy('day.dayOfWeek', 'ASC')
      .addOrderBy('meal.mealType', 'ASC')
      .getOne();
  }

  private async createMenuForWeek(userId: string, weekStart: string): Promise<WeeklyMenu> {
    // Find previous week to potentially copy items
    const prevWeekDate = new Date(weekStart + 'T12:00:00Z');
    prevWeekDate.setUTCDate(prevWeekDate.getUTCDate() - 7);
    const prevWeekStart = prevWeekDate.toISOString().slice(0, 10);

    const previousMenu = await this.loadFullMenu(userId, prevWeekStart);

    return this.dataSource.transaction(async (manager) => {
      const menu = manager.create(WeeklyMenu, { userId, weekStart });
      const savedMenu = await manager.save(WeeklyMenu, menu);

      // Create all 7 days
      const days: MenuDay[] = [];
      for (let dow = 1; dow <= 7; dow++) {
        const day = manager.create(MenuDay, { menuId: savedMenu.id, dayOfWeek: dow });
        days.push(await manager.save(MenuDay, day));
      }

      // Copy items from previous week if available
      if (previousMenu?.days) {
        for (const prevDay of previousMenu.days) {
          const newDay = days.find((d) => d.dayOfWeek === prevDay.dayOfWeek);
          if (!newDay || !prevDay.meals) continue;

          for (const prevMeal of prevDay.meals) {
            const meal = manager.create(Meal, { dayId: newDay.id, mealType: prevMeal.mealType });
            const savedMeal = await manager.save(Meal, meal);

            if (!prevMeal.items) continue;
            for (const prevItem of prevMeal.items) {
              const item = manager.create(MealItem, {
                mealId: savedMeal.id,
                ingredientId: prevItem.ingredientId,
                quantity: prevItem.quantity,
                unit: prevItem.unit,
              });
              await manager.save(MealItem, item);
            }
          }
        }
      }

      return this.loadFullMenu(userId, weekStart);
    });
  }

  async addMealItem(userId: string, dto: AddMealItemDto): Promise<MealItem> {
    // Validate ingredient ownership
    const ingredient = await this.ingredientsService.findOwnedOrFail(userId, dto.ingredientId);

    if (ingredient.isDeleted) {
      throw new BadRequestException('Cannot add a deleted ingredient');
    }

    // Validate meal type restriction
    if (ingredient.allowedMealTypes && ingredient.allowedMealTypes.length > 0) {
      if (!ingredient.allowedMealTypes.includes(dto.mealType)) {
        throw new BadRequestException(
          `Ingredient "${ingredient.name}" is not allowed for meal type ${dto.mealType}`,
        );
      }
    }

    const menu = await this.getCurrentWeekMenu(userId);

    let day = menu.days.find((d) => d.dayOfWeek === dto.dayOfWeek);
    if (!day) {
      day = this.menuDayRepo.create({ menuId: menu.id, dayOfWeek: dto.dayOfWeek });
      day = await this.menuDayRepo.save(day);
    }

    let meal = (day.meals || []).find((m) => m.mealType === dto.mealType);
    if (!meal) {
      meal = this.mealRepo.create({ dayId: day.id, mealType: dto.mealType });
      meal = await this.mealRepo.save(meal);
    }

    const quantity = dto.quantity ?? Number(ingredient.defaultQty);
    const unit = dto.unit ?? ingredient.defaultUnit;

    const item = this.mealItemRepo.create({
      mealId: meal.id,
      ingredientId: ingredient.id,
      quantity,
      unit,
    });

    return this.mealItemRepo.save(item);
  }

  async updateMealItem(userId: string, itemId: string, dto: UpdateMealItemDto): Promise<MealItem> {
    const item = await this.findMealItemOwnedOrFail(userId, itemId);
    item.quantity = dto.quantity;
    return this.mealItemRepo.save(item);
  }

  async removeMealItem(userId: string, itemId: string): Promise<void> {
    const item = await this.findMealItemOwnedOrFail(userId, itemId);
    await this.mealItemRepo.remove(item);
  }

  async getCollaboratorMenu(requestingUserId: string, collaboratorUserId: string): Promise<WeeklyMenu> {
    const weekStart = getMondayOfCurrentWeekRome();
    const menu = await this.loadFullMenu(collaboratorUserId, weekStart);
    if (!menu) {
      throw new NotFoundException('No menu found for this collaborator this week');
    }
    return menu;
  }

  private async findMealItemOwnedOrFail(userId: string, itemId: string): Promise<MealItem> {
    const item = await this.mealItemRepo
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.meal', 'meal')
      .innerJoinAndSelect('meal.day', 'day')
      .innerJoinAndSelect('day.menu', 'menu')
      .where('item.id = :itemId', { itemId })
      .getOne();

    if (!item) {
      throw new NotFoundException(`MealItem ${itemId} not found`);
    }

    if (item.meal.day.menu.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  /**
   * Returns all meal items for the current week for a given userId.
   * Used by ShoppingService for aggregation.
   */
  async getMealItemsForCurrentWeek(userId: string): Promise<MealItem[]> {
    const weekStart = getMondayOfCurrentWeekRome();

    return this.mealItemRepo
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.ingredient', 'ingredient')
      .innerJoin('item.meal', 'meal')
      .innerJoin('meal.day', 'day')
      .innerJoin('day.menu', 'menu')
      .where('menu.userId = :userId', { userId })
      .andWhere('menu.weekStart = :weekStart', { weekStart })
      .getMany();
  }
}
