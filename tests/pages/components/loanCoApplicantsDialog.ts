import { Page, expect, Locator } from "@playwright/test";

export class LoanCoApplicantsDialog {
  constructor(private page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole("dialog", { name: /co-app/i });
  }
  async assertDialog() {
    await expect(this.dialog).toBeVisible();
  }
  async addCoApplicant() {
    await this.assertDialog();
    await this.page.getByRole("button", { name: /Yes/i }).click();
  }
  async proceedtoDueDiligence() {
    await this.assertDialog();
    await this.page
      .getByRole("button", { name: /No, Proceed to Next Step/i })
      .click();
  }
  async closeModalWithX() {
    await this.assertDialog();
    await this.page.getByRole("button", { name: /close/i }).click();
    await expect(
      this.page.getByRole("dialog", { name: /co-app/i }),
    ).not.toBeVisible();
  }
}
