export const FREE_WATER_ITEM = {
  id: 'water-500',
  name: '500ml Water Bottle',
  price: 0,
  taxRate: 0,
  isPromo: true
};

export const DELIVERY_FEE = 0;

export function isFreeWaterEligible({ userOrderCount, isNewLogin }) {
  return userOrderCount === 0 || isNewLogin;
}

export function applyFreeWater(cartItems, eligibility) {
  const hasWater = cartItems.some((item) => item.id === FREE_WATER_ITEM.id);
  if (eligibility && !hasWater) {
    return [...cartItems, FREE_WATER_ITEM];
  }
  if (!eligibility && hasWater) {
    return cartItems.filter((item) => item.id !== FREE_WATER_ITEM.id);
  }
  return cartItems;
}

export function calculatePricing(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const taxAmount = items.reduce((sum, item) => sum + item.price * (item.taxRate || 0), 0);
  const total = subtotal + taxAmount + DELIVERY_FEE;

  return {
    subtotal,
    taxAmount,
    deliveryFee: DELIVERY_FEE,
    total
  };
}

export function validateBulkOrder({ eventDate, units, advancePercent }) {
  const now = new Date();
  const selectedDate = new Date(eventDate);
  const diffDays = (selectedDate - now) / (1000 * 60 * 60 * 24);

  if (Number.isNaN(selectedDate.getTime())) {
    return 'Please select a valid date.';
  }
  if (diffDays < 7) {
    return 'Bulk orders must be placed at least 7 days in advance.';
  }
  if (units < 1 || units > 200) {
    return 'Bulk quantity must be between 1 and 200 units.';
  }
  if (advancePercent < 50 || advancePercent > 100) {
    return 'Advance payment must be between 50% and 100%.';
  }

  return null;
}

export function canSkipMeal(mealTimeISO) {
  const mealTime = new Date(mealTimeISO);
  const now = new Date();
  const diffHours = (mealTime - now) / (1000 * 60 * 60);
  return diffHours >= 4;
}

export function repeatOrderRate(totalCustomers, repeatCustomers) {
  if (!totalCustomers) return 0;
  return (repeatCustomers / totalCustomers) * 100;
}
