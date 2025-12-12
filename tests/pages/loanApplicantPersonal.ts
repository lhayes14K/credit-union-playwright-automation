import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantPersonalPage {
  constructor(private page: Page) {}

  async assertLoaded(expectedValues: Record<string, string | RegExp>) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantPersonal/i);

    for (const [selector, expected] of Object.entries(expectedValues)) {
      const field = this.page.locator(selector);
      await expect(field).toHaveValue(expected);
    }
  }

  async enterApplicantPersonalData(data: Record<string, string>) {
    for (const [selector, value] of Object.entries(data)) {
      await this.page.locator(selector).fill(value);
    }
  }

  async selectMaritalStatus(status: string | RegExp) {
    const combobox = this.page.getByRole("combobox", {
      name: /marital status/i,
    });

    // 1. Open dropdown reliably
    await combobox.getByLabel("select").click();

    // 2. Select option by visible text
    await this.page.getByRole("option", { name: status }).click();
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
