import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantEmploymentPage {
  constructor(private page: Page) {}
  async assertLoaded(heading: string | RegExp) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantEmployment/i);
    await expect(
      this.page.getByRole("main").getByRole("heading", { name: heading }),
    ).toBeVisible();
  }
  async enterRequiredFields(fields: Record<string, string>) {
    for (const [label, value] of Object.entries(fields)) {
      const control = this.page.getByLabel(label);
      await control.fill(value);
      await expect(control).toHaveValue(value);
      await control.press("Tab"); //triggers the javascript to fill the city and state when zipcode is entered
    }
    await this.page.waitForTimeout(1000);
  }
  async enterDropdownValues(dropdownValues: Record<string, string>) {
    for (const [label, value] of Object.entries(dropdownValues)) {
      const dropdownLabel = this.page.getByRole("combobox", { name: label });
      await dropdownLabel.click();
      await this.page.getByRole("option", { name: value }).click();
    }
  }

  async clickNext() {
    await nextButton(this.page).click();
  }
}
