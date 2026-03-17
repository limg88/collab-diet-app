import { ShoppingService } from '../src/shopping/shopping.service';

describe('ShoppingService - aggregation logic', () => {
  describe('aggregateMealItems (static)', () => {
    it('should sum quantities of the same ingredient from two different meals for the same user', () => {
      const input = [
        {
          userId: 'user1',
          email: 'user1@example.com',
          items: [
            { name: 'Oats', category: 'Cereals', unit: 'gr', qty: 80 },
            { name: 'Oats', category: 'Cereals', unit: 'gr', qty: 40 },
          ],
        },
      ];

      const result = ShoppingService.aggregateMealItems(input);
      expect(result.size).toBe(1);
      const item = result.get('oats::gr')!;
      expect(item).toBeDefined();
      expect(item.totalQty).toBe(120);
      expect(item.breakdown).toHaveLength(1);
      expect(item.breakdown[0].qty).toBe(120);
    });

    it('should aggregate same ingredient from two different users with breakdown', () => {
      const input = [
        {
          userId: 'user1',
          email: 'user1@example.com',
          items: [{ name: 'Chicken', category: 'Proteins', unit: 'gr', qty: 200 }],
        },
        {
          userId: 'user2',
          email: 'user2@example.com',
          items: [{ name: 'Chicken', category: 'Proteins', unit: 'gr', qty: 150 }],
        },
      ];

      const result = ShoppingService.aggregateMealItems(input);
      expect(result.size).toBe(1);
      const item = result.get('chicken::gr')!;
      expect(item.totalQty).toBe(350);
      expect(item.breakdown).toHaveLength(2);

      const user1Entry = item.breakdown.find((b) => b.userId === 'user1')!;
      expect(user1Entry.qty).toBe(200);
      expect(user1Entry.email).toBe('user1@example.com');

      const user2Entry = item.breakdown.find((b) => b.userId === 'user2')!;
      expect(user2Entry.qty).toBe(150);
    });

    it('should treat same ingredient in different units as separate items', () => {
      const input = [
        {
          userId: 'user1',
          email: 'user1@example.com',
          items: [
            { name: 'Milk', category: 'Dairy', unit: 'ml', qty: 200 },
            { name: 'Milk', category: 'Dairy', unit: 'gr', qty: 100 },
          ],
        },
      ];

      const result = ShoppingService.aggregateMealItems(input);
      expect(result.size).toBe(2);
      expect(result.get('milk::ml')!.totalQty).toBe(200);
      expect(result.get('milk::gr')!.totalQty).toBe(100);
    });

    it('should return empty map for empty input', () => {
      const result = ShoppingService.aggregateMealItems([]);
      expect(result.size).toBe(0);
    });

    it('should handle multiple ingredients and users correctly', () => {
      const input = [
        {
          userId: 'user1',
          email: 'alice@example.com',
          items: [
            { name: 'Rice', category: 'Grains', unit: 'gr', qty: 100 },
            { name: 'Broccoli', category: 'Vegetables', unit: 'gr', qty: 150 },
          ],
        },
        {
          userId: 'user2',
          email: 'bob@example.com',
          items: [
            { name: 'Rice', category: 'Grains', unit: 'gr', qty: 80 },
            { name: 'Tomato', category: 'Vegetables', unit: 'unit', qty: 2 },
          ],
        },
      ];

      const result = ShoppingService.aggregateMealItems(input);
      expect(result.size).toBe(3);
      expect(result.get('rice::gr')!.totalQty).toBe(180);
      expect(result.get('broccoli::gr')!.totalQty).toBe(150);
      expect(result.get('tomato::unit')!.totalQty).toBe(2);
    });

    it('should compute qty_to_buy as max(0, total - stock) conceptually', () => {
      // This tests the aggregation produces correct totalQty
      // qty_to_buy is derived in the UI/client as max(0, totalQty - stockQty)
      const input = [
        {
          userId: 'user1',
          email: 'user1@example.com',
          items: [
            { name: 'Pasta', category: 'Grains', unit: 'gr', qty: 250 },
            { name: 'Pasta', category: 'Grains', unit: 'gr', qty: 250 },
          ],
        },
      ];

      const result = ShoppingService.aggregateMealItems(input);
      const pasta = result.get('pasta::gr')!;
      // stockQty = 100 (hypothetical), total = 500, qtyToBuy = max(0, 500 - 100) = 400
      const stockQty = 100;
      const qtyToBuy = Math.max(0, pasta.totalQty - stockQty);
      expect(pasta.totalQty).toBe(500);
      expect(qtyToBuy).toBe(400);
    });
  });
});
