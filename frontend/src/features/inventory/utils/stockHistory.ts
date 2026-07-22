/**
 * Stock Movement History Storage Utility
 *
 * Persists and retrieves stock adjustment history records in localStorage.
 * Enables full movement auditing and history tracking for each inventory item.
 */

import { StockMovement } from '../types/inventory.types';

const STORAGE_KEY = 'dealerflow_stock_history';

/**
 * Get all logged stock movements from localStorage
 */
export function getAllStockHistory(): StockMovement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StockMovement[];
  } catch {
    return [];
  }
}

/**
 * Get stock movements specifically for a given inventory item or vehicle
 */
export function getStockHistoryForInventory(inventoryId: string): StockMovement[] {
  const all = getAllStockHistory();
  return all
    .filter((record) => record.inventoryId === inventoryId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Record a new stock movement entry
 */
export function recordStockMovement(
  entry: Omit<StockMovement, 'id' | 'timestamp'>
): StockMovement {
  const newRecord: StockMovement = {
    ...entry,
    id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const history = getAllStockHistory();
  history.unshift(newRecord);

  try {
    // Keep up to 200 history logs
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 200)));
  } catch (err) {
    console.error('Failed to store stock movement record:', err);
  }

  return newRecord;
}
