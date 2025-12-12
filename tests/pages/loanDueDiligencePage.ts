import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanDueDiligencePage {
  constructor(private page: Page) {}
  async assertLoaded() {
    await expect(this.page).toHaveURL(/Loan\/DueDiligenceQuestions/i);
    await expect(
      this.page
        .getByRole("main")
        .getByRole("heading", { name: /Please answer the following/i }),
    ).toBeVisible();
  }

  async answerQuestions(answers: Record<string, string>) {
    const main = this.page.getByRole("main");
    await this.assertLoaded();

    for (const [label, value] of Object.entries(answers)) {
      const combo = main.getByRole("combobox", { name: label });
      if (await combo.count()) {
        // It's a combobox / dropdown
        await combo.click();
        const listbox = this.page.getByRole("listbox").last();
        await listbox.getByRole("option", { name: value, exact: true }).click();

        continue;
      }
      await main.getByLabel(label).pressSequentially(value);
      await expect(main.getByLabel(label)).toHaveValue(value);
    }
  }
  async clickNext() {
    await this.assertLoaded();
    await nextButton(this.page).click();
  }
}
