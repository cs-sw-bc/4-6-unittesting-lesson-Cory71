import { menuItems } from '../models/menuModel.js';
import { coupons } from '../models/couponModel.js';
import {
  buildOrderItemsFromForm,
  calculateOrderPricing,
  calculateLoyaltyPoints,
  determineLoyaltyTier,
} from '../models/orderLogicModel.js';
import {
  getCustomerPoints,
  addCustomerPoints,
  getAllCustomers,
} from '../models/rewardsLedgerModel.js';

export function showOrderForm(req, res) {
  res.render('index', {
    menuItems,
    provinces: ['ON', 'BC', 'AB', 'QC', 'NS', 'NB', 'MB', 'SK', 'NL', 'PE', 'NT', 'NU', 'YT'],
  });
}

export function submitOrder(req, res) {
  const customerName = (req.body.customerName || '').trim();
  const province = (req.body.province || '').trim();
  const couponCode = (req.body.couponCode || '').trim();

  const items = buildOrderItemsFromForm(req.body, menuItems);

  const {
    subtotal,
    couponIsValid,
    discount,
    taxableAmount,
    tax,
    total,
  } = calculateOrderPricing(items, couponCode, coupons, province);

  const pointsBefore = getCustomerPoints(customerName);
  const pointsEarned = calculateLoyaltyPoints(total);
  const pointsAfter = addCustomerPoints(customerName, pointsEarned);
  const tier = determineLoyaltyTier(pointsAfter);

  res.render('orderSummary', {
    customerName,
    province,
    items,
    couponCode,
    couponIsValid,
    subtotal,
    discount,
    taxableAmount,
    tax,
    total,
    pointsBefore,
    pointsEarned,
    pointsAfter,
    tier,
  });
}

export function showRewards(req, res) {
  res.render('rewards', {
    customers: getAllCustomers(),
  });
}
