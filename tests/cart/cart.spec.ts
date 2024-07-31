import { test, expect } from '@playwright/test';
import { CartPage } from '../../utils/cart';

let cartPage;
test.describe('Create automated test script with Playwright ', () => {
  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.goToPageBanana();
  });

  test('A customer adds the products in catalog page and click "Cart" Icon', async () => {
    await cartPage.selectProduct();
  });
  test('A customer adjusts their cart due to product quantity etc.', async () => {
    const quantityProduct = await cartPage.selectProduct();
    if (!quantityProduct) {
      await cartPage.increaseProductInCart();
      await cartPage.decreaseProductsInCart();
      await cartPage.deleteProductsInCart();
    }
  });
});
