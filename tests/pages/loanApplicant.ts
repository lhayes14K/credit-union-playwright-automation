import { Page, expect } from "@playwright/test";
import { nextButton } from "../shared/controls";

export class LoanApplicantPage {
  constructor(private page: Page) {}

  async assertLoaded(
    heading: string | RegExp,
    buttons: Array<string | RegExp>
  ) {
    await expect(this.page).toHaveURL(/Loan\/Applicant/i);
    await expect(
      this.page.getByRole("main").getByRole("heading", {
        name: heading,
      })
    ).toBeVisible();
    for (const label of buttons) {
      await expect(
        this.page.getByRole("main").getByRole("button", { name: label })
      ).toBeVisible();
    }
  }

  async selectMemberOrNonMember(button: string | RegExp) {
    await this.page.getByRole("button", { name: button }).click();
  }

  async clickNext() {
    // 3) Use shared helper to find a reliable “Next” button
    await nextButton(this.page).click();
  }
}
