import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantContactPage {
  constructor(private page: Page) {}

  async assertLoaded(headings: Array<string | RegExp>) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantContact/i);

    for (const heading of headings) {
      await expect(
        this.page.getByRole("heading", {
          name: heading,
        })
      ).toBeVisible();
    }
  }

  async enterContactInfo(contactInfo: Record<string, string>) {
    for (const [selector, value] of Object.entries(contactInfo)) {
      const field = this.page.locator(selector);
      await field.pressSequentially(value);
    }
  }
  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
