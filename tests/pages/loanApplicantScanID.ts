import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantScanIDPage {
  constructor(private page: Page) {}

  async assertLoaded(coApplicantText: string | RegExp) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantScanId/i);
    await expect(this.page.getByText(coApplicantText)).toBeVisible();
  }

  async clickOk() {
    await this.page.getByRole("button", { name: /OK/i }).click();
  }

  async assertConsentText(content: Array<string | RegExp>) {
    for (const labels of content) {
      await expect(
        this.page.getByRole("main").getByRole("heading", { name: labels })
      ).toBeVisible();
    }
  }

  async clickAgreeOrEnterManually(button: string | RegExp) {
    const agreeAndScan = await this.page
      .getByRole("button", { name: button })
      .click();
  }

  async uploadFrontImage(filepath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.page.locator("#wfl-upload-front-image").click(),
    ]);
    await fileChooser.setFiles(filepath);
  }

  async uploadBackImage(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.page.locator("#wfl-upload-back-image").click(),
    ]);
    await fileChooser.setFiles(filePath);
  }

  async assertUIafterUpload() {
    await expect(
      this.page.getByRole("heading", { name: /Well, that was easy!/i })
    ).toBeVisible({ timeout: 35000 });
    await expect(
      this.page.getByText(/Your ID uploaded successfully./i)
    ).toBeVisible();
    await expect(
      this.page.getByText(/You may continue to the next screen./i)
    ).toBeVisible();
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
