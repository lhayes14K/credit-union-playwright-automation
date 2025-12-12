import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class ConfirmationPage {
  constructor(private page: Page) {}

  async assertLoaded() {
    await this.page.waitForURL(/Membership\/Confirmation/i, { timeout: 65000 });
    await expect(
      this.page.getByRole("heading", {
        level: 3,
        name: /Want to start a new application?/i,
      }),
    ).toBeVisible();
  }
}
