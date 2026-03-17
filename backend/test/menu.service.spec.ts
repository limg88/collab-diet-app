import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { MenuService, getMondayOfCurrentWeekRome } from '../src/menu/menu.service';
import { WeeklyMenu } from '../src/menu/entities/weekly-menu.entity';
import { MenuDay } from '../src/menu/entities/menu-day.entity';
import { Meal } from '../src/menu/entities/meal.entity';
import { MealItem } from '../src/menu/entities/meal-item.entity';
import { IngredientsService } from '../src/ingredients/ingredients.service';
import { MealTypeEnum, UnitEnum } from '../src/ingredients/ingredient.entity';

// ---- helpers to build mock objects ----

function makeMenu(userId: string, weekStart: string, days: MenuDay[] = []): WeeklyMenu {
  const m = new WeeklyMenu();
  m.id = 'menu-1';
  m.userId = userId;
  m.weekStart = weekStart;
  m.days = days;
  return m;
}

function makeDay(menuId: string, dow: number, meals: Meal[] = []): MenuDay {
  const d = new MenuDay();
  d.id = `day-${dow}`;
  d.menuId = menuId;
  d.dayOfWeek = dow;
  d.meals = meals;
  return d;
}

function makeMeal(dayId: string, mealType: MealTypeEnum, items: MealItem[] = []): Meal {
  const m = new Meal();
  m.id = `meal-${mealType}`;
  m.dayId = dayId;
  m.mealType = mealType;
  m.items = items;
  return m;
}

function makeMealItem(mealId: string, ingredientId: string, qty: number, unit: UnitEnum): MealItem {
  const i = new MealItem();
  i.id = `item-${Math.random()}`;
  i.mealId = mealId;
  i.ingredientId = ingredientId;
  i.quantity = qty;
  i.unit = unit;
  return i;
}

// ---- tests ----

describe('MenuService', () => {
  let service: MenuService;
  let weeklyMenuRepo: jest.Mocked<Repository<WeeklyMenu>>;
  let menuDayRepo: jest.Mocked<Repository<MenuDay>>;
  let mealRepo: jest.Mocked<Repository<Meal>>;
  let mealItemRepo: jest.Mocked<Repository<MealItem>>;
  let ingredientsService: jest.Mocked<IngredientsService>;
  let dataSource: jest.Mocked<DataSource>;

  const mockQB = (result: any) => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(result),
    getMany: jest.fn().mockResolvedValue(result ?? []),
  });

  beforeEach(async () => {
    weeklyMenuRepo = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    menuDayRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    mealRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    mealItemRepo = {
      createQueryBuilder: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as any;

    ingredientsService = {
      findOwnedOrFail: jest.fn(),
      findById: jest.fn(),
    } as any;

    dataSource = {
      transaction: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: getRepositoryToken(WeeklyMenu), useValue: weeklyMenuRepo },
        { provide: getRepositoryToken(MenuDay), useValue: menuDayRepo },
        { provide: getRepositoryToken(Meal), useValue: mealRepo },
        { provide: getRepositoryToken(MealItem), useValue: mealItemRepo },
        { provide: IngredientsService, useValue: ingredientsService },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  describe('getMondayOfCurrentWeekRome', () => {
    it('should return a valid YYYY-MM-DD date string', () => {
      const result = getMondayOfCurrentWeekRome();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return a Monday', () => {
      const result = getMondayOfCurrentWeekRome();
      // Create date at noon UTC to avoid timezone offset issues
      const d = new Date(result + 'T12:00:00Z');
      expect(d.getUTCDay()).toBe(1); // 1 = Monday
    });
  });

  describe('getCurrentWeekMenu', () => {
    it('should return existing menu if one exists for the current week', async () => {
      const weekStart = getMondayOfCurrentWeekRome();
      const existingMenu = makeMenu('user-1', weekStart);

      weeklyMenuRepo.createQueryBuilder.mockReturnValue(mockQB(existingMenu) as any);

      const result = await service.getCurrentWeekMenu('user-1');
      expect(result).toBe(existingMenu);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('should create a new menu and copy items from previous week when no current menu exists', async () => {
      const weekStart = getMondayOfCurrentWeekRome();

      // Build a previous-week menu with one day, one meal, one item
      const prevItem = makeMealItem('prev-meal-1', 'ing-1', 100, UnitEnum.GR);
      const prevMeal = makeMeal('prev-day-1', MealTypeEnum.LUNCH, [prevItem]);
      const prevDay = makeDay('prev-menu-1', 1, [prevMeal]);
      const prevMenu = makeMenu('user-1', 'prev-week', [prevDay]);
      const newMenu = makeMenu('user-1', weekStart, []);

      // First call returns null (current week), second returns prevMenu, third returns newMenu
      let qbCallCount = 0;
      weeklyMenuRepo.createQueryBuilder.mockImplementation(() => {
        qbCallCount++;
        if (qbCallCount === 1) return mockQB(null) as any; // current week: not found
        if (qbCallCount === 2) return mockQB(prevMenu) as any; // prev week: found
        return mockQB(newMenu) as any; // reload after creation
      });

      // Simulate transaction by immediately calling the callback
      dataSource.transaction.mockImplementation(async (cb: any) => {
        const mockManager = {
          create: jest.fn().mockImplementation((Entity, data) => Object.assign(new Entity(), data)),
          save: jest.fn().mockImplementation(async (_Entity, entity) => ({
            ...entity,
            id: 'new-id-' + Math.random(),
          })),
        };
        return cb(mockManager);
      });

      await service.getCurrentWeekMenu('user-1');

      expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('addMealItem', () => {
    it('should throw BadRequestException if ingredient is deleted', async () => {
      ingredientsService.findOwnedOrFail.mockResolvedValue({
        id: 'ing-1',
        isDeleted: true,
        allowedMealTypes: null,
        defaultQty: 100,
        defaultUnit: UnitEnum.GR,
        name: 'Old Ingredient',
      } as any);

      await expect(
        service.addMealItem('user-1', {
          dayOfWeek: 1,
          mealType: MealTypeEnum.LUNCH,
          ingredientId: 'ing-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when mealType is not in allowedMealTypes', async () => {
      ingredientsService.findOwnedOrFail.mockResolvedValue({
        id: 'ing-1',
        isDeleted: false,
        allowedMealTypes: [MealTypeEnum.BREAKFAST, MealTypeEnum.MORNING_SNACK],
        defaultQty: 50,
        defaultUnit: UnitEnum.GR,
        name: 'Yogurt',
      } as any);

      await expect(
        service.addMealItem('user-1', {
          dayOfWeek: 1,
          mealType: MealTypeEnum.DINNER,
          ingredientId: 'ing-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow adding meal item when mealType matches allowedMealTypes', async () => {
      const weekStart = getMondayOfCurrentWeekRome();
      const existingDay = makeDay('menu-1', 1, []);
      const existingMenu = makeMenu('user-1', weekStart, [existingDay]);

      ingredientsService.findOwnedOrFail.mockResolvedValue({
        id: 'ing-1',
        isDeleted: false,
        allowedMealTypes: [MealTypeEnum.BREAKFAST],
        defaultQty: 80,
        defaultUnit: UnitEnum.GR,
        name: 'Oats',
      } as any);

      weeklyMenuRepo.createQueryBuilder.mockReturnValue(mockQB(existingMenu) as any);

      const savedMeal = makeMeal('day-1', MealTypeEnum.BREAKFAST);
      mealRepo.create.mockReturnValue(savedMeal);
      mealRepo.save.mockResolvedValue(savedMeal);

      const savedItem = makeMealItem('meal-1', 'ing-1', 80, UnitEnum.GR);
      mealItemRepo.create.mockReturnValue(savedItem);
      mealItemRepo.save.mockResolvedValue(savedItem);

      const result = await service.addMealItem('user-1', {
        dayOfWeek: 1,
        mealType: MealTypeEnum.BREAKFAST,
        ingredientId: 'ing-1',
      });

      expect(result).toBe(savedItem);
    });

    it('should allow adding meal item when no mealType restriction is set', async () => {
      const weekStart = getMondayOfCurrentWeekRome();
      const existingDay = makeDay('menu-1', 2, []);
      const existingMenu = makeMenu('user-1', weekStart, [existingDay]);

      ingredientsService.findOwnedOrFail.mockResolvedValue({
        id: 'ing-2',
        isDeleted: false,
        allowedMealTypes: null,
        defaultQty: 150,
        defaultUnit: UnitEnum.GR,
        name: 'Chicken',
      } as any);

      weeklyMenuRepo.createQueryBuilder.mockReturnValue(mockQB(existingMenu) as any);

      const savedMeal = makeMeal('day-2', MealTypeEnum.DINNER);
      mealRepo.create.mockReturnValue(savedMeal);
      mealRepo.save.mockResolvedValue(savedMeal);

      const savedItem = makeMealItem('meal-dinner', 'ing-2', 150, UnitEnum.GR);
      mealItemRepo.create.mockReturnValue(savedItem);
      mealItemRepo.save.mockResolvedValue(savedItem);

      const result = await service.addMealItem('user-1', {
        dayOfWeek: 2,
        mealType: MealTypeEnum.DINNER,
        ingredientId: 'ing-2',
      });

      expect(result).toBe(savedItem);
      expect(mealItemRepo.save).toHaveBeenCalled();
    });
  });
});
