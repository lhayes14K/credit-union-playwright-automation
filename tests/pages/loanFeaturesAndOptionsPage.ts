import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanFeaturesAndOptionsPage {
  constructor(private page: Page) {}

  async assertLoaded() {
    await expect(this.page).toHaveURL(/Loan\/FeaturesOptions/i);
    await expect(
      this.page.getByRole("heading", { name: /Choose your coverage./i })
    ).toBeVisible();
  }

  async selectOneProduct(feature: string) {
    await this.page.locator(feature).check();
  }

  async clickNext() {
    await nextButton(this.page).click();
  }
}
