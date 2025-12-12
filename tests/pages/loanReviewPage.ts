import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanReviewPage {
  constructor(private page: Page) {}
  async assertLoaded() {
    await expect(this.page).toHaveURL(/Loan\/Review/i);
    await expect(
      this.page
        .getByRole("main")
        .getByRole("heading", { name: /Review Your Application/i }),
    ).toBeVisible();
  }
  async selectReferral(value: string | RegExp) {
    await this.assertLoaded();
    const combobox = this.page.getByRole("combobox", {
      name: /How did you hear/i,
    });
    await combobox.click();
    const listbox = this.page.getByRole("listbox").last();
    await listbox.getByRole("option", { name: value, exact: true }).click();
  }

  async clickNext() {
    await this.assertLoaded();
    await nextButton(this.page).click();
  }
}
