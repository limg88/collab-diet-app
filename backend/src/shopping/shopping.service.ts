import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingItem, ShoppingSourceEnum, CollaboratorBreakdownEntry } from './shopping-item.entity';
import { MenuService, getMondayOfCurrentWeekRome } from '../menu/menu.service';
import { CollaborationService } from '../collaboration/collaboration.service';
import { UsersService } from '../users/users.service';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { MealItem } from '../menu/entities/meal-item.entity';

interface AggregationKey {
  name: string;
  unit: string;
}

interface AggregatedItem {
  name: string;
  category: string | null;
  unit: string;
  totalQty: number;
  breakdown: CollaboratorBreakdownEntry[];
}

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingItem)
    private readonly shoppingItemRepo: Repository<ShoppingItem>,
    private readonly menuService: MenuService,
    private readonly collaborationService: CollaborationService,
    private readonly usersService: UsersService,
  ) {}

  async syncMenuItems(userId: string): Promise<void> {
    const weekStart = getMondayOfCurrentWeekRome();

    // Preserve existing user-set values before deleting
    const existingItems = await this.shoppingItemRepo.find({
      where: { userId, weekStart, source: ShoppingSourceEnum.MENU },
    });
    const preserved = new Map<string, { stockQty: number; isPurchased: boolean }>();
    for (const item of existingItems) {
      const key = `${item.name.toLowerCase()}::${item.unit}`;
      preserved.set(key, { stockQty: Number(item.stockQty), isPurchased: item.isPurchased });
    }

    // Delete existing MENU items for the current week
    await this.shoppingItemRepo.delete({
      userId,
      weekStart,
      source: ShoppingSourceEnum.MENU,
    });

    // Get active collaborators
    const collaborators = await this.collaborationService.getActiveCollaborators(userId);
    const allUserIds = [userId, ...collaborators.map((c) => c.id)];

    // Fetch meal items for the user and each collaborator
    const allMealItems: { userId: string; email: string; items: MealItem[] }[] = [];
    for (const uid of allUserIds) {
      const user = await this.usersService.findById(uid);
      if (!user) continue;
      const items = await this.menuService.getMealItemsForCurrentWeek(uid);
      allMealItems.push({ userId: uid, email: user.email, items });
    }

    // Aggregate by (name lowercase, unit)
    const aggregationMap = new Map<string, AggregatedItem>();

    for (const { userId: uid, email, items } of allMealItems) {
      for (const item of items) {
        if (!item.ingredient || item.ingredient.isDeleted) continue;

        const key = `${item.ingredient.name.toLowerCase()}::${item.unit}`;
        const qty = Number(item.quantity);

        if (!aggregationMap.has(key)) {
          aggregationMap.set(key, {
            name: item.ingredient.name,
            category: item.ingredient.category,
            unit: item.unit,
            totalQty: 0,
            breakdown: [],
          });
        }

        const agg = aggregationMap.get(key)!;
        agg.totalQty += qty;

        const existing = agg.breakdown.find((b) => b.userId === uid);
        if (existing) {
          existing.qty += qty;
        } else {
          agg.breakdown.push({ userId: uid, email, qty });
        }
      }
    }

    // Compute collaborator stock for each aggregated item
    const collaboratorStockMap = new Map<string, number>();
    for (const collab of collaborators) {
      const collabShoppingItems = await this.shoppingItemRepo.find({
        where: { userId: collab.id, weekStart, source: ShoppingSourceEnum.MENU },
      });
      for (const ci of collabShoppingItems) {
        const stockVal = Number(ci.stockQty);
        if (stockVal > 0) {
          const key = `${ci.name.toLowerCase()}::${ci.unit}`;
          collaboratorStockMap.set(key, (collaboratorStockMap.get(key) ?? 0) + stockVal);
        }
      }
    }

    // Persist aggregated MENU items, restoring preserved user values
    const toSave: Partial<ShoppingItem>[] = [];
    for (const agg of aggregationMap.values()) {
      const key = `${agg.name.toLowerCase()}::${agg.unit}`;
      const prev = preserved.get(key);
      toSave.push({
        userId,
        weekStart,
        source: ShoppingSourceEnum.MENU,
        name: agg.name,
        category: agg.category,
        unit: agg.unit as any,
        totalQty: agg.totalQty,
        stockQty: prev?.stockQty ?? 0,
        collaboratorStockQty: collaboratorStockMap.get(key) ?? 0,
        isPurchased: prev?.isPurchased ?? false,
        collaboratorBreakdown: agg.breakdown.length > 0 ? agg.breakdown : null,
      });
    }

    if (toSave.length > 0) {
      await this.shoppingItemRepo.save(toSave as ShoppingItem[]);
    }
  }

  async getShoppingList(userId: string): Promise<ShoppingItem[]> {
    await this.syncMenuItems(userId);
    const weekStart = getMondayOfCurrentWeekRome();
    return this.shoppingItemRepo.find({
      where: { userId, weekStart },
      order: { source: 'ASC', name: 'ASC' },
    });
  }

  async addExtraItem(userId: string, dto: CreateExtraItemDto): Promise<ShoppingItem> {
    const weekStart = getMondayOfCurrentWeekRome();
    const item = this.shoppingItemRepo.create({
      userId,
      weekStart,
      source: ShoppingSourceEnum.FUORI_MENU,
      name: dto.name,
      category: dto.category ?? null,
      unit: dto.unit,
      totalQty: dto.totalQty,
      stockQty: 0,
      isPurchased: false,
    });
    return this.shoppingItemRepo.save(item);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateItemDto): Promise<ShoppingItem> {
    const item = await this.findOwnedOrFail(userId, itemId);

    if (dto.totalQty !== undefined && item.source !== ShoppingSourceEnum.FUORI_MENU) {
      throw new BadRequestException('Quantity can only be changed for FUORI_MENU items');
    }

    if (dto.stockQty !== undefined) item.stockQty = dto.stockQty;
    if (dto.isPurchased !== undefined) item.isPurchased = dto.isPurchased;
    if (dto.totalQty !== undefined) item.totalQty = dto.totalQty;

    if (dto.name !== undefined) {
      if (item.source !== ShoppingSourceEnum.FUORI_MENU)
        throw new BadRequestException('Name can only be changed for FUORI_MENU items');
      item.name = dto.name.trim();
    }
    if (dto.unit !== undefined) {
      if (item.source !== ShoppingSourceEnum.FUORI_MENU)
        throw new BadRequestException('Unit can only be changed for FUORI_MENU items');
      item.unit = dto.unit as any;
    }
    if (dto.category !== undefined) {
      item.category = dto.category || null;
    }

    return this.shoppingItemRepo.save(item);
  }

  async deleteExtraItem(userId: string, itemId: string): Promise<void> {
    const item = await this.findOwnedOrFail(userId, itemId);
    if (item.source !== ShoppingSourceEnum.FUORI_MENU) {
      throw new ForbiddenException('Only FUORI_MENU items can be deleted');
    }
    await this.shoppingItemRepo.remove(item);
  }

  private async findOwnedOrFail(userId: string, itemId: string): Promise<ShoppingItem> {
    const item = await this.shoppingItemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException(`ShoppingItem ${itemId} not found`);
    if (item.userId !== userId) throw new ForbiddenException('Access denied');
    return item;
  }

  /**
   * Exposed for unit testing: aggregate meal items into shopping items without DB access.
   * Returns the aggregated map keyed by "name::unit".
   */
  static aggregateMealItems(
    mealItemsPerUser: { userId: string; email: string; items: Array<{ name: string; category: string | null; unit: string; qty: number }> }[],
  ): Map<string, AggregatedItem> {
    const map = new Map<string, AggregatedItem>();

    for (const { userId: uid, email, items } of mealItemsPerUser) {
      for (const item of items) {
        const key = `${item.name.toLowerCase()}::${item.unit}`;

        if (!map.has(key)) {
          map.set(key, { name: item.name, category: item.category, unit: item.unit, totalQty: 0, breakdown: [] });
        }

        const agg = map.get(key)!;
        agg.totalQty += item.qty;

        const existing = agg.breakdown.find((b) => b.userId === uid);
        if (existing) {
          existing.qty += item.qty;
        } else {
          agg.breakdown.push({ userId: uid, email, qty: item.qty });
        }
      }
    }

    return map;
  }
}
