// tests/pages/agreementsPage.ts
import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class AgreementsPage {
  constructor(private page: Page) {}

  async assertLoaded(expectHeading: string | RegExp) {
    // 1) Make sure we’re on the Agreements route
    await expect(this.page).toHaveURL(/Membership\/Agreements/i);

    // 2) Sanity-check a key element that proves the page rendered fully
    await expect(
      this.page.getByRole("main").getByRole("heading", { name: expectHeading }),
    ).toBeVisible();
  }

  async selectEligibilityCheckbox() {
    const eligibility = this.page.locator("#agreement-check-label-2");
    await eligibility.check();
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }

  async selectElegibilityFromList() {
    await expect(
      this.page.getByRole("heading", {
        name: /How do you qualify for membership/i,
      }),
    ).toBeVisible();

    await this.page.getByRole("button", { name: /Select/i }).click();
    await expect(this.page.getByText(/I live, work/i)).toBeVisible();
    await this.page.getByText(/I have a family/i).click();
    await this.page.locator("#eligibility-custom-value").fill("Larry Hayes");
    await this.page.getByRole("button", { name: /Done/i }).click();
  }
}
