/**
 * CreatePurchasePage
 *
 * Standalone entry point for vehicle acquisition routed via `/purchases/new`.
 * Redirects or seamlessly renders the redesigned PurchasesPage acquisition workflow.
 */

import { PurchasesPage } from './PurchasesPage';

export function CreatePurchasePage() {
  return <PurchasesPage />;
}
