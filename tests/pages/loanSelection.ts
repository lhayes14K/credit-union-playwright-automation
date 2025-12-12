import { Page, expect } from "@playwright/test";

export class LoanSelectionPage {
  constructor(private page: Page) {}
  async assertLoaded(heading: string | RegExp) {
    await expect(this.page).toHaveURL(/Loan\/Selection/i);
    await expect(
      this.page.getByRole("main").getByRole("heading", { name: heading }),
    ).toBeVisible();
  }

  async selectLoanCategory(loanGroup: string) {
    const categoryHeading = this.page
      .getByRole("heading", { name: new RegExp(loanGroup, "i") })
      .click();
  }

  async selectLoanType(loanType: string) {
    await this.page
      .getByRole("heading", { name: new RegExp(loanType, "i") })
      .click();
  }
}
