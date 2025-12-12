import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class ProductsPage {
  constructor(private page: Page) {}

  async assertLoaded(
    banner: string | RegExp,
    saveProgress: string | RegExp,
    offerCode: string | RegExp,
  ) {
    await expect(this.page).toHaveURL("/Membership/Products");
    await expect(
      this.page.getByRole("banner").getByRole("heading", { name: banner }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: saveProgress }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: offerCode }),
    ).toBeVisible();
  }

  async selectSubServices(
    subServices: { selector: string; answer: string | RegExp }[],
  ) {
    for (const svc of subServices) {
      await this.page.locator(svc.selector).getByText(svc.answer).click();
    }
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
