import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantIdentificationPage {
  constructor(private page: Page) {}

  async assertLoaded(
    headings: Array<string | RegExp>,
    //expectedValues: Record<string, string | RegExp>
    expectedByLabel: Record<string, string | RegExp>,
  ) {
    await expect(this.page).toHaveURL(/Loan\/ApplicantIdentification/i);

    const idTypeContainer = this.page.locator(
      '[data-container-for="IdentificationTypeId"]',
    );
    const idTypeCombo = idTypeContainer.getByRole("combobox");

    // The text you want is inside .k-input-value-text
    const idTypeText = idTypeContainer.locator(".k-input-value-text");

    // Ensure dropdown has finished hydrating
    await expect(idTypeCombo).toHaveAttribute("aria-busy", "false");

    // Ensure the dropdown actually has a value (not empty string)
    await expect(idTypeText).not.toHaveText("");

    await expect(
      this.page.getByRole("main").getByRole("button", { name: /Next/i }),
    ).toBeVisible();

    for (const heading of headings) {
      await expect(
        this.page.getByRole("main").getByRole("heading", { name: heading }),
      ).toBeVisible();
    }

    for (const [label, value] of Object.entries(expectedByLabel)) {
      //const element = this.page.locator(selector);
      const element = this.page.getByLabel(label);
      await expect(element).toHaveValue(value);
    }
  }

  async addIdentificationType(idTypeLabel: string, answer: string) {
    const combobox = this.page
      .getByRole("combobox", { name: "Identification Type" })
      .nth(1);
    await expect(combobox).toBeVisible({ timeout: 10000 });
    await combobox.click();
    await this.page.getByRole("option", { name: idTypeLabel }).click();
    await expect(combobox).toHaveText(idTypeLabel);

    const idtypeAnswerBox = this.page
      .locator('input[aria-labelledby="Value-form-label"]')
      .nth(1);

    await expect(idtypeAnswerBox).toBeVisible({ timeout: 10000 });
    await idtypeAnswerBox.fill(answer);
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
