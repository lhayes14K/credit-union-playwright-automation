import { Page, expect, Locator } from "@playwright/test";

export class LoanSignAndSubmitDialog {
  constructor(private page: Page) {}
  private get dialog(): Locator {
    return this.page.getByRole("dialog", { name: /Sign and Submit/i });
  }
  async assertDialog() {
    await expect(this.dialog).toBeVisible();
  }

  async autoSignApplication() {
    await this.assertDialog();

    const signatureButton = this.dialog.locator("#wf-signature-autosign");
    const confirmCheckbox = this.dialog.locator("#wf-confirmation-checkbox");

    await signatureButton.click();
    await confirmCheckbox.check();

    await this.dialog.getByRole("button", { name: /Submit/i }).click();

    await expect(this.dialog).not.toBeVisible();
  }
}
