// Builds an order array from a submitted form body and menu.
export function buildOrderItemsFromForm(formBody, menu) {
  return menu
    .map((item) => {
      const qtyRaw = formBody[`qty_${item.id}`];
      const quantity = Number.parseInt(qtyRaw, 10) || 0;

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      };
    })
    .filter((line) => line.quantity > 0);
}

// Calculates subtotal (before discounts and tax) for an array of order items.
export function calculateSubtotal(items) {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return Math.round(subtotal * 100) / 100;
}

// Calculates the taxable amount after discounts are applied.
export function calculateTaxableAmount(subtotal, discount) {
  return Math.max(0, subtotal - discount);
}

// Validates whether a coupon exists in the available coupon list.
export function validateCouponCode(code, availableCoupons) {
  if (!code) return false;

  const normalized = code.trim();
  return availableCoupons.some((c) => c.code === normalized);
}

// Finds the coupon object for a coupon code.
export function getCouponByCode(code, availableCoupons) {
  if (!code) return null;

  const normalized = code.trim();
  return availableCoupons.find((c) => c.code === normalized) || null;
}

// Calculates the discount amount for a given subtotal and coupon.
export function calculateCouponDiscount(subtotal, coupon) {
  if (!coupon) return 0;

  if (coupon.type === 'fixed') {
    if (typeof coupon.minSubtotal === 'number' && subtotal < coupon.minSubtotal) return 0;
    return Math.min(coupon.value, subtotal);
  }

  if (coupon.type === 'percent') {
    const discount = subtotal * coupon.value;
    return Math.round(discount * 100) / 100;
  }

  return 0;
}

// Calculates tax for a province code using a simple rate table.
export function calculateTaxByProvince(amount, provinceCode) {
  const rates = {
    ON: 0.13,
    BC: 0.12,
    AB: 0.05,
    QC: 0.14975,
    NS: 0.15,
    NB: 0.15,
    MB: 0.12,
    SK: 0.11,
    NL: 0.15,
    PE: 0.15,
    NT: 0.05,
    NU: 0.05,
    YT: 0.05,
  };

  const rate = rates[provinceCode] ?? 0;
  const tax = amount * rate;
  return Math.round(tax * 100) / 100;
}

// Calculates the final total from taxable amount and tax.
export function calculateFinalTotal(taxableAmount, tax) {
  const total = taxableAmount + tax;
  return Math.round(total * 100) / 100;
}

// Calculates an order's full pricing breakdown from inputs (items, coupon, province).
export function calculateOrderPricing(items, couponCode, availableCoupons, province) {
  const subtotal = calculateSubtotal(items);

  const couponIsValid = validateCouponCode(couponCode, availableCoupons);
  const coupon = couponIsValid ? getCouponByCode(couponCode, availableCoupons) : null;
  const discount = coupon ? calculateCouponDiscount(subtotal, coupon) : 0;

  const taxableAmount = calculateTaxableAmount(subtotal, discount);
  const tax = calculateTaxByProvince(taxableAmount, province);
  const total = calculateFinalTotal(taxableAmount, tax);

  return {
    subtotal,
    couponIsValid,
    coupon,
    discount,
    taxableAmount,
    tax,
    total,
  };
}

// Calculates loyalty points earned for a purchase total.
export function calculateLoyaltyPoints(finalTotal) {
  // 1 point per $5 spent (rounded down)
  return Math.round(finalTotal / 5);
}

// Determines loyalty tier from a customer's total point balance.
export function determineLoyaltyTier(pointsBalance) {
  if (pointsBalance > 500) return 'Platinum';
  if (pointsBalance > 250) return 'Gold';
  if (pointsBalance > 100) return 'Silver';
  return 'Bronze';
}
