import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class ReviewPage {
  constructor(private page: Page) {}

  async assertLoaded(expectedHeading: string | RegExp) {
    await this.page.waitForURL(/Membership\/Review/i);
    await expect(this.page).toHaveURL(/Membership\/Review/i);
    await expect(
      this.page.getByRole("heading", { name: expectedHeading }).nth(1),
    ).toBeVisible();
  }

  async selectReferralSource(referral: string) {
    await this.page
      .locator("#how-did-you-hear-about-us-drop-down")
      .selectOption(referral);
  }
  async checkAll() {
    await this.page.getByRole("button", { name: /Check All/i }).click();
  }
  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }

  async signAndSubmitPrimaryOnly(reviewCheckbox: string | RegExp) {
    const dialog = this.page.locator(".k-dialog:visible");
    await dialog.waitFor();
    await dialog.locator("#sign-button").click();
    await dialog.getByLabel(reviewCheckbox).check();
    await dialog.getByRole("button", { name: /continue/i }).click();
  }
}
