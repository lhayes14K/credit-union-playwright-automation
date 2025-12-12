import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantAddressPage {
  constructor(private page: Page) {}

  async assertLoaded(
    heading: string | RegExp,
    residentialInfo: Record<string, string | RegExp>,
  ) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantAddress/i);
    await this.page.waitForURL(/Loan\/ApplicantAddress/i);
    await expect(
      this.page.getByRole("main").getByRole("heading", { name: heading }),
    ).toBeVisible();

    for (const [label, value] of Object.entries(residentialInfo)) {
      await expect(this.page.getByLabel(label, { exact: true })).toHaveValue(
        value,
      );
    }
  }

  async enterRequiredFields(requiredFields: Record<string, string>) {
    for (const [label, value] of Object.entries(requiredFields)) {
      await this.page.getByLabel(label).nth(0).fill(value);
    }
  }

  async selectDropDownValues(residentialComboboxes: Record<string, string>) {
    //refactor later to find a better selector to use instead of .nth(0)
    for (const [box, value] of Object.entries(residentialComboboxes)) {
      const combobox = this.page.getByRole("combobox", { name: box }).nth(0);
      await combobox.click();
      await this.page.getByRole("option", { name: value, exact: true }).click();
      const displayedValue = combobox.locator(".k-input-value-text");
      await expect(displayedValue).toHaveText(value);
    }
  }

  async clickNext() {
    await nextButton(this.page).click();
  }
}
