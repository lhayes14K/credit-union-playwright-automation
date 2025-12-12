import { Page, expect } from "@playwright/test";
type FundingSource = "Loan" | "GL" | "Existing Share";
type FundingDestination = "Existing Share" | "GL" | "Check";

interface FundingDetails {
  amount: string;
  source: FundingSource;
  destination: FundingDestination;
  accountNumber: string;
  shareId: string;
}

export class OadminApplicationDetailsPage {
  constructor(private page: Page) {}

  async assertLoaded() {
    await expect(this.page).toHaveURL(/OAdmin\/Application/i);
  }

  // Helper just for inside this class
  async expectDecision(decisionStatus: string = "Approved") {
    const decisionRegex = new RegExp(`Decision:\\s*${decisionStatus}`, "i");
    await expect(this.page.getByText(decisionRegex).nth(0)).toBeVisible();
  }

  // Main flow you call from the spec
  async decisionApplication(decisionStatus: string = "Approved") {
    await this.assertLoaded();

    const combo = this.page
      .getByRole("combobox")
      .filter({ hasText: "Select Decision" });

    await combo.click();
    await this.page.getByRole("option", { name: decisionStatus }).click();
    await this.page.getByRole("button", { name: /Save/i }).click();

    await this.expectDecision(decisionStatus);
  }

  async fillFundingForm(details: FundingDetails) {
    await this.page
      .locator("#application-funding-grid")
      .getByRole("button", { name: "Add" })
      .click();

    const fundingModal = this.page.locator("#loan-application-fundings-form");
    const amountField = fundingModal
      .getByRole("spinbutton", {
        name: "Amount",
      })
      .first();
    await amountField.click();
    await amountField.press("Control+A");
    await amountField.press("Backspace");
    await amountField.pressSequentially(details.amount);

    await fundingModal
      .getByRole("combobox")
      .filter({ hasText: "Select source category" })
      .click();
    await this.page
      .getByRole("option", { name: details.source, exact: true })
      .click();
    await fundingModal
      .getByRole("combobox")
      .filter({ hasText: "Select destination category" })
      .click();
    await this.page.getByRole("option", { name: details.destination }).click();
    await fundingModal
      .locator("#DestinationExistingShareAccount")
      .fill(details.accountNumber);
    await fundingModal
      .getByRole("textbox", { name: /Share Id/i })
      .fill(details.shareId);
  }

  async clickSave() {
    await this.page
      .locator("#loan-application-fundings-form")
      .getByRole("button", { name: /Save/i })
      .click();
  }

  async expectSaveConfirmation() {
    await expect(
      this.page.getByRole("heading", { name: "Success" }),
    ).toBeVisible();
  }

  async completeFundingStep() {
    await this.page.getByRole("button", { name: /Complete/i }).click();
  }

  async handleCreditErrorIfPresent() {
    const errorModal = this.page.getByText(/An error occurred during/i);

    if (await errorModal.isVisible().catch(() => false)) {
      console.log("Credit report error detected—skipping step.");
      await this.page.getByRole("button", { name: /Skip/i }).click();
    }
  }
  async enterAccountNumber() {
    await this.page.locator("#EditApplicationDataBtn").click();
    await this.page
      .getByRole("textbox", { name: "Account Number" })
      .fill("7018915");
    await this.page.getByRole("button", { name: "Update" }).click();
    await this.expectSaveConfirmation();
  }
  async expectApplicationClosed() {
    await expect(
      this.page.getByText(/This application is closed/i),
    ).toBeVisible({ timeout: 15000 });
  }

  async expectLoadingAnimation() {
    const loading = this.page.locator("#loading-animation");
    await expect(loading).toBeVisible({
      timeout: 10000,
    });
    await expect(loading).not.toBeVisible({
      timeout: 10000,
    });
  }
}
