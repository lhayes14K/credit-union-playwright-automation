import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class FundingPage {
  constructor(private page: Page) {}

  async assertLoaded(selectedProduct: string | RegExp) {
    await expect(this.page).toHaveURL(/Membership\/Funding/i);
    await expect(
      this.page.getByRole("heading", { name: /Funding/i }).nth(0),
    ).toBeVisible();
    //await expect(this.page.getByText(/Share (Savings)/i)).toBeVisible();
    await expect(this.page.getByText(selectedProduct).nth(0)).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: /Submit Application/i }),
    ).toBeEnabled();
  }

  async clickNext() {
    await nextButton(this.page).click();
  }
}
