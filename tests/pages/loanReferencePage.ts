import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantReferencePage {
  constructor(private page: Page) {}

  async assertLoaded(headings: Array<string | RegExp>) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantReference/i);

    for (const heading of headings) {
      await expect(
        this.page.getByRole("main").getByRole("heading", { name: heading }),
      ).toBeVisible();
    }
  }

  async enterRequiredFields(referenceFields: Record<string, string>) {
    for (const [label, value] of Object.entries(referenceFields)) {
      const combo = this.page
        .getByRole("main")
        .getByRole("combobox", { name: label });

      if (await combo.count()) {
        // It's a combobox / dropdown
        await combo.click();
        await this.page
          .getByRole("option", { name: value, exact: true })
          .click();

        await expect(combo).toHaveText(value);
        continue;
      }

      await this.page.getByLabel(label).nth(0).pressSequentially(value);
    }
  }
  async clickNext() {
    await nextButton(this.page).click();
  }
}
