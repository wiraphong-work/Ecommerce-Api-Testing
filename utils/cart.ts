import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly dropdownCategory: Locator;
  readonly getAllNameCategory: Locator;
  readonly getAllNumProduct: Locator;
  readonly getAllNumProductRecommend: Locator;
  readonly classProductName: Locator;
  readonly btnSearch: Locator;
  readonly btnAddToCart: Locator;
  readonly iconCart: Locator;
  readonly popupProductRecommend: Locator;
  readonly gotoCart: Locator;
  readonly productInCart: Locator;
  readonly titleNameProductPage: Locator;
  readonly btnIncrease: Locator;
  readonly btndecrease: Locator;
  readonly btnDelete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdownCategory = page.getByText('ทั้งหมด', { exact: true });
    this.getAllNameCategory = page.locator('.option-item');
    this.getAllNumProduct = page.locator('.product-item');
    this.getAllNumProductRecommend = page.locator(
      '.ins-web-smart-recommender-box-item'
    );
    this.classProductName = page.locator('.product-name');
    this.btnSearch = page.getByRole('button', { name: 'search' });
    this.btnAddToCart = page.getByRole('button', { name: 'หยิบใส่ตะกร้า' });
    this.iconCart = page.getByLabel('shopping cart');
    this.popupProductRecommend = page
      .getByRole('dialog')
      .locator('path')
      .nth(1);
    this.gotoCart = page.getByRole('button', { name: 'ไปที่ตะกร้า' });
    this.productInCart = page.locator('.name');
    this.titleNameProductPage = page.locator('h1.page-title.product-name');
    this.btnIncrease = page.locator('.btn.btn-increase');
    this.btndecrease = page.locator('.btn.btn-decrease');
    this.btnDelete = page.locator('.btn.btn-delete');
  }

  async goToPageBanana() {
    await this.page.goto(`${process.env.URL_BANANA}`);
    await expect(this.page).toHaveTitle(/BaNANA/);
  }

  async replaceText(text: any[]) {
    let data: any[] = [];
    await text.forEach((val) => {
      data.push(val.replace(/\s+/g, ' ').trim());
    });
    return data;
  }

  async randomValue(text: any[], number?: number) {
    if (!number) {
      const randomIndex = Math.floor(Math.random() * text.length);
      return text[randomIndex];
    } else {
      const randomNumber = Math.floor(Math.random() * number);
      return randomNumber;
    }
  }
  async selectProduct() {
    await this.page.waitForTimeout(3000);
    await this.dropdownCategory.click();

    //ต้องการ Get ข้อมูล Category ทั้งหมดเพื่อทําการ Randomแล้วนำไปใช้
    const allNameCategory = await this.getAllNameCategory.allTextContents();
    const replaceTextAllNameCategory = await this.replaceText(allNameCategory);
    const nameRandomCategory = await this.randomValue(
      replaceTextAllNameCategory
    );
    await this.page.getByRole('option', { name: nameRandomCategory }).click();
    await this.btnSearch.click();
    await this.classProductName.first().waitFor();

    //ต้องการ Get ข้อมูล Product ทั้งหมดเพื่อทําการ Random แล้วนำไปใช้
    const nameProduct = await this.classProductName.allTextContents();
    const replaceTextNameProduct = await this.replaceText(nameProduct);
    const ranDomSelectProduct = await this.randomValue(replaceTextNameProduct);
    await this.page
      .getByRole('link', { name: ranDomSelectProduct })
      .first()
      .waitFor();
    await this.page
      .getByRole('link', { name: ranDomSelectProduct })
      .first()
      .click();

    //เช็คว่า Product หมดหรือยัง ถ้าหมดแล้วให้ออกแจ้งเตือนแล้วหยุด Test
    if (await this.page.getByText('สินค้าหมด').first().isVisible()) {
      console.log('!!!Warning: สินค้าหมด/ต้องสั่งจองล่วงหน้า จะไม่สามารถเพิ่มรายการลงในตะกร้าได้');
      return '!!!Warning: สินค้าหมด/ต้องสั่งจองล่วงหน้า จะไม่สามารถเพิ่มรายการลงในตะกร้าได้';
    } else {
      await this.titleNameProductPage.waitFor();
      const productTitle = await this.titleNameProductPage.textContent();

      await this.btnAddToCart.click();
      await this.popupProductRecommend.click();
      await this.iconCart.click();
      await this.gotoCart.click();
      const productInCart = await this.productInCart.first().textContent();
      const replaceTextProductInCart = await this.replaceText([productInCart]);
      const replaceTitleNameProductPage = await this.replaceText([
        productTitle,
      ]);

      await expect(replaceTextProductInCart[0]).toEqual(
        replaceTitleNameProductPage[0]
      );
    }
  }
  async increaseProductInCart() {
    await this.btnIncrease.click();
  }

  async decreaseProductsInCart() {
    await this.btndecrease.click();
  }

  async deleteProductsInCart() {
    await this.btnDelete.click();
  }
}
