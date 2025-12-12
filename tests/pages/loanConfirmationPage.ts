import { Page, expect } from "@playwright/test";

export class LoanConfirmationPage {
  constructor(private page: Page) {}
  async assertLoaded() {
    await expect(this.page).toHaveURL(/Loan\/Confirmation/i);
    await expect(
      this.page
        .getByRole("main")
        .getByRole("heading", { name: /We will contact you soon\./i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: /new application/i }),
    ).toBeVisible();
  }
  async startNewApplication() {
    await this.assertLoaded();
    await this.page.getByRole("link", { name: /new application/i }).click();
  }
}
