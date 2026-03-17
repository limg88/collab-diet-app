import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async list(userId: string, filters?: { category?: string; name?: string }): Promise<Ingredient[]> {
    const qb = this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.userId = :userId', { userId })
      .andWhere('ingredient.isDeleted = false');

    if (filters?.category) {
      qb.andWhere('ingredient.category = :category', { category: filters.category });
    }
    if (filters?.name) {
      qb.andWhere('ingredient.name ILIKE :name', { name: `%${filters.name}%` });
    }

    return qb.orderBy('ingredient.name', 'ASC').getMany();
  }

  async create(userId: string, dto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = this.ingredientRepository.create({
      ...dto,
      userId,
    });
    return this.ingredientRepository.save(ingredient);
  }

  async update(userId: string, id: string, dto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOwnedOrFail(userId, id);
    Object.assign(ingredient, dto);
    return this.ingredientRepository.save(ingredient);
  }

  async softDelete(userId: string, id: string): Promise<void> {
    const ingredient = await this.findOwnedOrFail(userId, id);
    ingredient.isDeleted = true;
    await this.ingredientRepository.save(ingredient);
  }

  async findOwnedOrFail(userId: string, id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient ${id} not found`);
    }
    if (ingredient.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return ingredient;
  }

  async findById(id: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({ where: { id } });
  }
}
