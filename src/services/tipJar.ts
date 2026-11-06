import {
  ErrorCode,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';

// The one-off product created in the Play Console; until it exists the tip reports 'unavailable'.
export const COFFEE_PRODUCT_ID = 'tip_coffee';

export type TipResult = 'thanks' | 'cancelled' | 'unavailable';

// A tip is consumed rather than kept, so the same person can buy another later.
async function consumeUnfinishedTips(): Promise<void> {
  const owned = await getAvailablePurchases();
  await Promise.all(
    owned
      .filter(purchase => purchase.productId === COFFEE_PRODUCT_ID && purchase.purchaseState === 'purchased')
      .map(purchase => finishTransaction({ purchase, isConsumable: true })),
  );
}

function waitForPurchase(): Promise<TipResult> {
  return new Promise<TipResult>(resolve => {
    let settled = false;
    const finish = (result: TipResult) => {
      if (settled) {
        return;
      }
      settled = true;
      updated.remove();
      failed.remove();
      resolve(result);
    };
    const updated = purchaseUpdatedListener(purchase => {
      if (purchase.productId !== COFFEE_PRODUCT_ID) {
        return;
      }
      if (purchase.purchaseState !== 'purchased') {
        // A payment still pending is consumed by the next attempt once it has gone through.
        finish('cancelled');
        return;
      }
      finishTransaction({ purchase, isConsumable: true })
        .then(() => finish('thanks'))
        .catch(() => finish('unavailable'));
    });
    const failed = purchaseErrorListener(error =>
      finish(error.code === ErrorCode.UserCancelled ? 'cancelled' : 'unavailable'),
    );
    requestPurchase({
      request: { google: { skus: [COFFEE_PRODUCT_ID] }, apple: { sku: COFFEE_PRODUCT_ID } },
      type: 'in-app',
    }).catch(() => finish('unavailable'));
  });
}

export async function buyCoffee(): Promise<TipResult> {
  try {
    if (!(await initConnection())) {
      return 'unavailable';
    }
    const products = await fetchProducts({ skus: [COFFEE_PRODUCT_ID], type: 'in-app' });
    if (!products?.some(product => product.id === COFFEE_PRODUCT_ID)) {
      return 'unavailable';
    }
    await consumeUnfinishedTips();
    return await waitForPurchase();
  } catch {
    return 'unavailable';
  }
}
