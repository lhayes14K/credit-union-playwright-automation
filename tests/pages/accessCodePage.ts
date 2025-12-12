// tests/pages/accessCodePage.ts
import { Page, expect } from '@playwright/test';

export class AccessCodePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/membership');
    await expect(this.page).toHaveURL(/\/accesscontrol/i);
  }

  async enterAccessCode(code: string) {
    await this.page.getByRole('textbox', { name: /Access Code/i }).fill(code);
  }

  async submit() {
    await this.page.getByRole('button', { name: /Submit/i }).click();
  }
async goToLoan() {
    await this.page.goto('/loan');
    await expect(this.page).toHaveURL(/\/accesscontrol/i);
  }

  async gotoOAdmin() {
    await this.page.goto('/oadmin');
    await expect(this.page).toHaveURL(/\/accesscontrol/i);
  }

}
