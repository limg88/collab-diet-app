import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AddMealItemDto } from '../src/menu/dto/add-meal-item.dto';
import { UpdateMealItemDto } from '../src/menu/dto/update-meal-item.dto';
import { CreateIngredientDto } from '../src/ingredients/dto/create-ingredient.dto';
import { MealTypeEnum, UnitEnum } from '../src/ingredients/ingredient.entity';

describe('DTO quantity validation — overflow prevention', () => {
  describe('AddMealItemDto', () => {
    it('should reject quantity > 99999 (numeric overflow prevention)', async () => {
      const dto = plainToInstance(AddMealItemDto, {
        dayOfWeek: 1,
        mealType: MealTypeEnum.BREAKFAST,
        ingredientId: 'a-valid-uuid',
        quantity: 234234234,
      });
      const errors = await validate(dto);
      const qtyError = errors.find(e => e.property === 'quantity');
      expect(qtyError).toBeDefined();
    });

    it('should accept quantity within valid range', async () => {
      const dto = plainToInstance(AddMealItemDto, {
        dayOfWeek: 1,
        mealType: MealTypeEnum.BREAKFAST,
        ingredientId: 'a-valid-uuid',
        quantity: 250,
      });
      const errors = await validate(dto);
      expect(errors.find(e => e.property === 'quantity')).toBeUndefined();
    });

    it('should reject quantity of 0 or negative', async () => {
      const dto = plainToInstance(AddMealItemDto, {
        dayOfWeek: 1,
        mealType: MealTypeEnum.BREAKFAST,
        ingredientId: 'a-valid-uuid',
        quantity: 0,
      });
      const errors = await validate(dto);
      expect(errors.find(e => e.property === 'quantity')).toBeDefined();
    });
  });

  describe('UpdateMealItemDto', () => {
    it('should reject quantity > 99999', async () => {
      const dto = plainToInstance(UpdateMealItemDto, { quantity: 100000 });
      const errors = await validate(dto);
      expect(errors.find(e => e.property === 'quantity')).toBeDefined();
    });

    it('should accept quantity at boundary (99999)', async () => {
      const dto = plainToInstance(UpdateMealItemDto, { quantity: 99999 });
      const errors = await validate(dto);
      expect(errors.find(e => e.property === 'quantity')).toBeUndefined();
    });
  });

  describe('CreateIngredientDto', () => {
    it('should reject defaultQty > 99999', async () => {
      const dto = plainToInstance(CreateIngredientDto, {
        name: 'Test',
        defaultUnit: UnitEnum.GR,
        defaultQty: 200000,
      });
      const errors = await validate(dto);
      expect(errors.find(e => e.property === 'defaultQty')).toBeDefined();
    });
  });
});

// --- Ingredient defaultQty min validation ---
describe('CreateIngredientDto defaultQty > 0', () => {
  it('should reject defaultQty = 0', async () => {
    const dto = plainToInstance(CreateIngredientDto, {
      name: 'Test',
      defaultUnit: UnitEnum.GR,
      defaultQty: 0,
    });
    const errors = await validate(dto);
    expect(errors.find(e => e.property === 'defaultQty')).toBeDefined();
  });

  it('should accept defaultQty = 0.01', async () => {
    const dto = plainToInstance(CreateIngredientDto, {
      name: 'Test',
      defaultUnit: UnitEnum.GR,
      defaultQty: 0.01,
    });
    const errors = await validate(dto);
    expect(errors.find(e => e.property === 'defaultQty')).toBeUndefined();
  });
});

describe('UpdateItemDto — FUORI_MENU fields', () => {
  it('should accept name update', async () => {
    const { UpdateItemDto } = await import('../src/shopping/dto/update-item.dto');
    const dto = plainToInstance(UpdateItemDto, { name: 'Detersivo aggiornato' });
    const errors = await validate(dto);
    expect(errors.find(e => e.property === 'name')).toBeUndefined();
  });

  it('should reject invalid unit', async () => {
    const { UpdateItemDto } = await import('../src/shopping/dto/update-item.dto');
    const dto = plainToInstance(UpdateItemDto, { unit: 'kg' });
    const errors = await validate(dto);
    expect(errors.find(e => e.property === 'unit')).toBeDefined();
  });

  it('should accept valid unit update', async () => {
    const { UpdateItemDto } = await import('../src/shopping/dto/update-item.dto');
    const dto = plainToInstance(UpdateItemDto, { unit: 'ml' });
    const errors = await validate(dto);
    expect(errors.find(e => e.property === 'unit')).toBeUndefined();
  });
});
