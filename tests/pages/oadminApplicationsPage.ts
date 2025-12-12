import { Page, expect } from '@playwright/test';

export class OadminApplicationsPage {
constructor(private page: Page) {}

async assertLoaded(){
    await expect(this.page).toHaveURL(/OAdmin\/Applications/i)
    await expect(this.page.locator('#right-pane').getByText(/Applications/i)).toBeVisible();
}

async searchBySSN(ssn: string) {
    await (this.page.getByPlaceholder('Search...')).fill(ssn);
    
  }

 async openApplicationBySSN(ssn: string) {
    const resultCell = this.page.locator('td').filter({ hasText: ssn }).first();

    await expect(resultCell).toBeVisible({ timeout: 60000 });
    await resultCell.click();
    await expect(this.page.locator('#loading-animation')).toBeHidden({timeout: 60000});
 }


}