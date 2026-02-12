import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyFreeWater,
  calculatePricing,
  canSkipMeal,
  isFreeWaterEligible,
  validateBulkOrder
} from '../lib/businessRules.js';

test('free water eligibility works', () => {
  assert.equal(isFreeWaterEligible({ userOrderCount: 0, isNewLogin: false }), true);
  assert.equal(isFreeWaterEligible({ userOrderCount: 2, isNewLogin: true }), true);
  assert.equal(isFreeWaterEligible({ userOrderCount: 2, isNewLogin: false }), false);
});

test('apply free water appends promo item', () => {
  const cart = [{ id: 'thali', price: 95 }];
  const updated = applyFreeWater(cart, true);
  assert.equal(updated.length, 2);
  assert.equal(updated[1].id, 'water-500');
});

test('pricing calculates transparent totals', () => {
  const pricing = calculatePricing([{ id: 'x', price: 100, taxRate: 0.05 }]);
  assert.equal(pricing.subtotal, 100);
  assert.equal(pricing.taxAmount, 5);
  assert.equal(pricing.deliveryFee, 0);
  assert.equal(pricing.total, 105);
});

test('bulk order validator enforces constraints', () => {
  const tooSoon = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  assert.match(validateBulkOrder({ eventDate: tooSoon, units: 40, advancePercent: 50 }), /7 days/);

  const valid = new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  assert.equal(validateBulkOrder({ eventDate: valid, units: 200, advancePercent: 100 }), null);
});

test('skip rule needs 4 hour notice', () => {
  const threeHours = new Date(Date.now() + 3 * 3600 * 1000).toISOString();
  const sixHours = new Date(Date.now() + 6 * 3600 * 1000).toISOString();
  assert.equal(canSkipMeal(threeHours), false);
  assert.equal(canSkipMeal(sixHours), true);
});
