import { Page, expect, Locator } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanCalculatorPage {
  constructor(private page: Page) {}

  private get main(): Locator {
    return this.page.getByRole("main");
  }

  async assertLoaded(expectedTexts: string[]) {
    await expect(this.page).toHaveURL(/Loan\/Calculator/i);

    for (const text of expectedTexts) {
      await expect(
        this.main.getByText(new RegExp(text, "i")).nth(0),
      ).toBeVisible();
    }
  }

  async setCreditScore(score: string) {
    const creditScore = this.page.locator("#estimated-credit-score-value");
    await this.clearAndType(creditScore, score);
    await expect(creditScore).toHaveValue(score);
  }

  async setFinanceTerm(term: string) {
    const financeTerm = this.page.getByTitle("FinanceTermTextBox");
    await this.clearAndType(financeTerm, term);
    await expect(financeTerm).toHaveValue(term);
  }

  async setLoanAmount(amount: number) {
    const loanAmountInput = this.page
      .locator('[data-container-for="LoanAmount"] input[role="spinbutton"]')
      .first();

    // Kendo numeric input: use the same clear+type pattern
    await this.clearAndType(loanAmountInput, amount.toString());
  }

  async selectToggleButton() {
    const toggle = this.page.locator("#payment-toggle-button");
    await expect(toggle).toBeEnabled();
    await toggle.click();
  }

  async clickNext() {
    await nextButton(this.page).click();
  }

  // 🔽 Shared helper for all text/numeric fields
  private async clearAndType(locator: Locator, value: string) {
    await expect(locator).toBeEditable();
    await locator.click();
    await locator.press("Control+A");
    await locator.press("Backspace");
    await locator.pressSequentially(value);
  }
}
