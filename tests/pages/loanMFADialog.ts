// pom/LoanMFADialogPage.ts
import { Page, expect } from "@playwright/test";
import { getMfaElements, MfaMode } from "../shared/mfaHelper"; // adjust path if needed

export class LoanMFADialogPage {
  constructor(private page: Page) {}

  // Small convenience so we don't keep passing this.page everywhere
  private mfa(mode: MfaMode) {
    return getMfaElements(this.page, mode);
  }

  // ===== LOAN MFA =====

  async assertLoaded() {
    const { dialog, submitButton } = this.mfa("loan");

    await expect(dialog).toBeVisible();
    await expect(submitButton).toBeVisible();
  }

  async assertErrorMessage() {
    const { dialog, passcodeInput, submitButton } = this.mfa("loan");

    await passcodeInput.fill("");
    await submitButton.click();

    await expect(dialog.getByText(/Passcode is required/i)).toBeVisible();
  }

  async submitCorrectPasscode(passcode: string) {
    const { dialog, passcodeInput, submitButton } = this.mfa("loan");

    await passcodeInput.clear();
    await passcodeInput.fill(passcode);
    await submitButton.click();

    await expect(dialog).toBeHidden({ timeout: 15000 });
    await expect(this.page).toHaveURL(/Loan\/ApplicantIdentification/i);
  }

  async submitIncorrectPasscode(passcode: string) {
    const { dialog, passcodeInput, submitButton } = this.mfa("loan");

    await passcodeInput.fill(passcode);
    await submitButton.click();

    await expect(
      dialog.getByText(/Unable to verify Multi-Factor Authentication code/i),
    ).toBeVisible();
  }

  // ===== MEMBERSHIP MFA =====

  async assertMembershipLoaded() {
    const { dialog, submitButton } = this.mfa("membership");

    await expect(dialog).toBeVisible();
    await expect(submitButton).toBeVisible();
  }

  async assertMembershipErrormessage(errorText: string | RegExp) {
    const { dialog, passcodeInput, submitButton } = this.mfa("membership");

    await passcodeInput.fill("");
    await submitButton.click();

    await expect(dialog.getByText(errorText)).toBeVisible();
  }

  async submitMembershipIncorrectPasscode(
    passcode: string,
    incorrectPasscodeText: string | RegExp,
  ) {
    const { dialog, passcodeInput, submitButton } = this.mfa("membership");

    await passcodeInput.fill(passcode);
    await submitButton.click();

    await expect(dialog.getByText(incorrectPasscodeText)).toBeVisible();
  }

  async submitMembershipCorrectPasscode(passcode: string) {
    const { passcodeInput, submitButton } = this.mfa("membership");

    await passcodeInput.fill("");
    await passcodeInput.fill(passcode);
    await submitButton.click();

    await expect(this.page).toHaveURL(/Membership\/Review/i, {
      timeout: 15000,
    });
    // If you want, we can also assert the dialog is hidden here via the helper.
  }
}
