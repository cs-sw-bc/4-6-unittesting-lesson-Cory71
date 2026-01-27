const customerPoints = new Map();

function normalizeCustomerName(customerName) {
  return (customerName || '').trim();
}

export function getCustomerPoints(customerName) {
  const key = normalizeCustomerName(customerName);
  if (!key) return 0;
  return customerPoints.get(key) || 0;
}

export function addCustomerPoints(customerName, pointsToAdd) {
  const key = normalizeCustomerName(customerName);
  if (!key) return 0;

  const current = customerPoints.get(key) || 0;
  const updated = current + (Number(pointsToAdd) || 0);
  customerPoints.set(key, updated);
  return updated;
}

export function getAllCustomers() {
  return [...customerPoints.entries()]
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points);
}
