import { Page, expect } from "@playwright/test";

export class AccountPage {
  constructor(private page: Page) {}
  async assertLoaded() {
    await expect(this.page).toHaveURL(/Membership\/Account/i);
  }
  async selectAccountByHeading(heading: string | RegExp) {
    const accountHeading = this.page.getByRole("heading", { name: heading });
    await expect(accountHeading).toBeVisible();
    await accountHeading.click();
  }
}
