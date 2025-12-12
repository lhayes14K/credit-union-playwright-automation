import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class ApplicantPage {
  constructor(private page: Page) {}

  async assertLoaded(
    mainHeading: string | RegExp,
    bannerHeading: string | RegExp,
  ) {
    await this.page.waitForURL(/Membership\/Applicants/i);
    await expect(
      this.page.getByRole("main").getByRole("heading", { name: mainHeading }),
    ).toBeVisible();
    await expect(this.page).toHaveURL("/Membership/Applicants");
    await expect(
      this.page
        .getByRole("banner")
        .getByRole("heading", { name: bannerHeading }),
    ).toBeVisible();
  }

  async uploadIDFront(filePath: string, uploadText: string | RegExp) {
    await this.page
      .locator("#primary-applicant a", { hasText: uploadText })
      .click();
    await this.page.getByRole("button", { name: "Continue" }).click();

    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.page.locator("#upload-front-image").click(),
    ]);
    await fileChooser.setFiles(filePath);
  }

  async uploadIDBack(filePath: string) {
    const [backfileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"), // catches the hidden <input type="file">
      this.page.locator("#upload-back-image").click(),
    ]);
    await backfileChooser.setFiles(filePath);
  }

  async clickSubmitButton() {
    await this.page.locator("#btn-submit-image").click();
  }

  async escapeAddressDialog() {
    const dialog = this.page.locator(".k-dialog:visible"); // or getByRole('dialog', { name: /error/i })
    await dialog.waitFor();
    await expect(dialog).toContainText(/Unable to validate address/i);
    await dialog.getByRole("button", { name: "OK" }).click();
    await expect(dialog).toBeHidden();
  }

  async assertLicenseUploaded() {
    await expect(this.page.locator("#success-alert-front")).toBeVisible();
    await expect(this.page.locator("#success-alert-back-span")).toBeVisible();
    await expect(this.page.locator("#pri-dl-front-thumbnail")).toBeVisible();
  }

  async assertLicenseDecoder(expectedValues: Record<string, string>) {
    for (const [selector, expectedValue] of Object.entries(expectedValues)) {
      const field = this.page.locator(selector);
      await expect(field).toHaveValue(expectedValue);
    }
  }

  async enterRequiredFields(personalValues: Record<string, string>) {
    for (const [selector, value] of Object.entries(personalValues)) {
      const field = this.page.locator(selector);
      await field.fill(value); // ✅ correct
    }
  }

  async selectEmploymentStatus(status: string) {
    await this.page.locator("#pri-employment-status-type").selectOption(status);
  }

  async selectMaritalStatus(status: string) {
    await this.page.locator("#pri-marital-status").selectOption(status);
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
